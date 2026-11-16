import { ConflictException } from '@nestjs/common';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CategoriaService } from './categoria.service.js';

const prisma = {
  categoria: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
  },
};

describe('CategoriaService', () => {
  let service: CategoriaService;

  beforeEach(() => {
    Object.values(prisma.categoria).forEach((fn) => fn.mockReset());
    service = new CategoriaService(prisma as never);
  });

  it('lista categorias em ordem alfabética', async () => {
    prisma.categoria.findMany.mockResolvedValue([{ id: '1', nome: 'Ecoturismo' }]);
    const res = await service.findAll();
    expect(res).toEqual([{ id: '1', nome: 'Ecoturismo' }]);
    expect(prisma.categoria.findMany).toHaveBeenCalledWith({
      orderBy: { nome: 'asc' },
      select: { id: true, nome: true },
    });
  });

  it('cria nova categoria quando nome ainda não existe', async () => {
    prisma.categoria.findUnique.mockResolvedValue(null);
    prisma.categoria.create.mockResolvedValue({ id: 'c1', nome: 'Educação Ambiental' });

    const res = await service.create({ nome: 'Educação Ambiental' });
    expect(res).toEqual({ id: 'c1', nome: 'Educação Ambiental' });
  });

  it('lança 409 Conflict se o nome da categoria já existir', async () => {
    prisma.categoria.findUnique.mockResolvedValue({ id: 'c1', nome: 'Educação Ambiental' });
    await expect(service.create({ nome: 'Educação Ambiental' })).rejects.toBeInstanceOf(ConflictException);
    expect(prisma.categoria.create).not.toHaveBeenCalled();
  });
});