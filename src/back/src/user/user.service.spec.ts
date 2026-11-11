import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CreateUserDto, PublicUserRole } from './dto/create-user.dto.js';
import { UserService } from './user.service.js';

const prisma = {
  user: { findUnique: vi.fn(), create: vi.fn(), update: vi.fn() },
  perfilVoluntario: { findUnique: vi.fn() },
};
const resetPrisma = () => {
  Object.values(prisma.user).forEach((fn) => fn.mockReset());
  prisma.perfilVoluntario.findUnique.mockReset();
};

const base = {
  name: 'Ana',
  email: 'ana@teste.com',
  password: 'SenhaForte@123',
  lgpdAccepted: true,
  lgpdVersion: '2026-11-v1',
} as CreateUserDto;

describe('UserService.create (US04, US15, US23)', () => {
  let service: UserService;

  beforeEach(() => {
    resetPrisma();
    prisma.user.findUnique.mockResolvedValue(null);
    prisma.user.create.mockResolvedValue({ id: 'u1' });
    service = new UserService(prisma as never);
  });

  const dadosCriados = () => prisma.user.create.mock.calls[0][0].data;

  it('cria CLIENTE com senha em hash e registro de consentimento (sem perfil)', async () => {
    await service.create({ ...base, role: PublicUserRole.CLIENTE });

    const data = dadosCriados();
    expect(data.role).toBe('CLIENTE');
    expect(data.passwordHash).not.toBe(base.password);
    expect(data.consents.create.termVersion).toBe('2026-11-v1');
    expect(data.perfilVoluntario).toBeUndefined();
  });

  it('recusa papel GESTOR no cadastro público (403) sem tocar no banco', async () => {
    await expect(service.create({ ...base, role: 'GESTOR' as never })).rejects.toBeInstanceOf(
      ForbiddenException,
    );
    expect(prisma.user.create).not.toHaveBeenCalled();
  });

  it('VOLUNTARIO cria o perfil com as habilidades na mesma operação', async () => {
    await service.create({
      ...base,
      role: PublicUserRole.VOLUNTARIO,
      bio: 'Bio',
      habilidadeIds: ['h1', 'h2'],
    });

    const data = dadosCriados();
    expect(data.perfilVoluntario.create.bio).toBe('Bio');
    expect(data.perfilVoluntario.create.habilidades.create).toHaveLength(2);
  });

  it('recusa cadastro sem aceite da LGPD com 400 (não 409)', async () => {
    await expect(service.create({ ...base, lgpdAccepted: false })).rejects.toBeInstanceOf(
      BadRequestException,
    );
    expect(prisma.user.create).not.toHaveBeenCalled();
  });

  it('recusa e-mail já cadastrado (409)', async () => {
    prisma.user.findUnique.mockResolvedValue({ id: 'existente' });
    await expect(service.create(base)).rejects.toBeInstanceOf(ConflictException);
  });

  it('trata e-mail duplicado em corrida (P2002) como 409', async () => {
    prisma.user.create.mockRejectedValue({ code: 'P2002' });
    await expect(service.create(base)).rejects.toBeInstanceOf(ConflictException);
  });

  it('habilidade inexistente (P2025) vira 400', async () => {
    prisma.user.create.mockRejectedValue({ code: 'P2025' });
    await expect(
      service.create({ ...base, role: PublicUserRole.VOLUNTARIO, habilidadeIds: ['x'] }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});

describe('UserService.update (US05)', () => {
  let service: UserService;

  beforeEach(() => {
    resetPrisma();
    prisma.user.update.mockResolvedValue({ id: 'u1' });
    service = new UserService(prisma as never);
  });

  const dados = () => prisma.user.update.mock.calls[0][0].data;

  it('name/phone vão para o User, sem tocar no perfil', async () => {
    await service.update('u1', { name: 'Novo', phone: '61' });

    expect(dados()).toEqual({ name: 'Novo', phone: '61' });
    expect(prisma.perfilVoluntario.findUnique).not.toHaveBeenCalled();
  });

  it('campos de voluntário vão para o perfil, não para o User (antes causavam 500)', async () => {
    prisma.perfilVoluntario.findUnique.mockResolvedValue({ id: 'p1' });

    await service.update('u1', { bio: 'Nova bio', habilidadeIds: ['h1'] });

    const update = dados().perfilVoluntario.update;
    expect(update.bio).toBe('Nova bio');
    expect(update.habilidades.deleteMany).toEqual({});
    expect(update.habilidades.create).toHaveLength(1);
    expect(dados().bio).toBeUndefined();
  });

  it('recusa editar perfil de voluntário que não existe (400)', async () => {
    prisma.perfilVoluntario.findUnique.mockResolvedValue(null);
    await expect(service.update('u1', { bio: 'x' })).rejects.toBeInstanceOf(BadRequestException);
    expect(prisma.user.update).not.toHaveBeenCalled();
  });

  it('registro inexistente (P2025) vira 404', async () => {
    prisma.user.update.mockRejectedValue({ code: 'P2025' });
    await expect(service.update('u9', { name: 'A' })).rejects.toBeInstanceOf(NotFoundException);
  });
});

describe('UserService gestor inicial', () => {
  let service: UserService;

  beforeEach(() => {
    resetPrisma();
    prisma.user.findUnique.mockResolvedValue(null);
    service = new UserService(prisma as never);
  });
  afterEach(() => vi.unstubAllEnvs());

  it('não faz nada sem GESTOR_EMAIL/GESTOR_PASSWORD', async () => {
    await service.onApplicationBootstrap();
    expect(prisma.user.create).not.toHaveBeenCalled();
  });

  it('cria o gestor quando ainda não existe', async () => {
    vi.stubEnv('GESTOR_EMAIL', 'gestor@ibrada.org');
    vi.stubEnv('GESTOR_PASSWORD', 'SenhaForte@123');
    await service.onApplicationBootstrap();

    const data = prisma.user.create.mock.calls[0][0].data;
    expect(data.role).toBe('GESTOR');
    expect(data.passwordHash).not.toBe('SenhaForte@123');
  });

  it('é idempotente e não promove conta existente', async () => {
    vi.stubEnv('GESTOR_EMAIL', 'cliente@teste.com');
    vi.stubEnv('GESTOR_PASSWORD', 'SenhaForte@123');
    prisma.user.findUnique.mockResolvedValue({ id: 'u1', role: 'CLIENTE' });

    await service.onApplicationBootstrap();

    expect(prisma.user.create).not.toHaveBeenCalled();
    expect(prisma.user.update).not.toHaveBeenCalled();
  });

  it('não cria gestor com senha fraca', async () => {
    vi.stubEnv('GESTOR_EMAIL', 'gestor@ibrada.org');
    vi.stubEnv('GESTOR_PASSWORD', 'fraca');
    await service.onApplicationBootstrap();
    expect(prisma.user.create).not.toHaveBeenCalled();
  });
});
