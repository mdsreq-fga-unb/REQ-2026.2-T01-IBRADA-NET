import { NotFoundException } from '@nestjs/common';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CandidaturasService } from '../candidaturas.service.js';
import { StatusCandidatura } from '../../generated/prisma/enums.js';

const prisma = {
  candidatura: {
    count: vi.fn(),
    findMany: vi.fn(),
    findUnique: vi.fn(),
    update: vi.fn(),
    groupBy: vi.fn(),
  },
  perfilVoluntario: {
    findUnique: vi.fn(),
  },
  $transaction: vi.fn(),
};

describe('CandidaturasService (US18)', () => {
  let service: CandidaturasService;

  beforeEach(() => {
    vi.clearAllMocks();
    prisma.$transaction.mockImplementation(async (ops: Promise<unknown>[]) => Promise.all(ops));
    service = new CandidaturasService(prisma as never);
  });

  it('lista candidaturas com paginação, filtros e resumo de status', async () => {
    prisma.candidatura.count.mockResolvedValue(1);
    prisma.candidatura.findMany.mockResolvedValue([
      {
        id: 'cand-1',
        status: StatusCandidatura.INSCRITO,
        experienciaNaArea: true,
        mensagem: 'Quero ajudar nas trilhas',
        createdAt: new Date('2026-11-20T10:00:00Z'),
        updatedAt: new Date('2026-11-20T10:00:00Z'),
        oportunidade: {
          id: 'op-1',
          title: 'Monitor de Trilhas',
          isOpen: true,
          categoria: { id: 'cat-1', nome: 'Ecoturismo e Trilhas' },
          projeto: { id: 'proj-1', title: 'Ecoturismo Comunitário' },
          criteriosFunil: {
            exigeExperiencia: true,
            educacaoMinima: 'MEDIO',
            habilidadesExigidas: null,
          },
        },
        perfil: {
          id: 'perf-1',
          bio: 'Guia local',
          outros: 'Primeiros socorros',
          educacaoNivel: 'GRADUACAO',
          educacaoCompletude: 'COMPLETO',
          user: {
            id: 'u-1',
            name: 'Ana Silva',
            email: 'ana@teste.com',
            phone: '61999999999',
            cidade: 'Brasília',
            estado: 'DF',
          },
          interesses: [{ categoria: { id: 'cat-1', nome: 'Ecoturismo e Trilhas' } }],
        },
      },
    ]);
    prisma.candidatura.groupBy.mockResolvedValue([
      { status: StatusCandidatura.INSCRITO, _count: { _all: 3 } },
      { status: StatusCandidatura.APROVADO, _count: { _all: 2 } },
    ]);

    const res = await service.findAllForGestor({
      oportunidadeId: 'op-1',
      status: StatusCandidatura.INSCRITO,
      page: 1,
      limit: 10,
    });

    expect(res.meta).toEqual({ total: 1, page: 1, limit: 10, totalPages: 1 });
    expect(res.resumo.total).toBe(5);
    expect(res.resumo.porStatus.APROVADO).toBe(2);
    expect(res.data[0].voluntario.name).toBe('Ana Silva');
    expect(res.data[0].triagemFunil.apto).toBe(true);
  });

  it('atualiza o status da candidatura no funil', async () => {
    prisma.candidatura.findUnique.mockResolvedValue({
      id: 'cand-1',
      status: StatusCandidatura.INSCRITO,
    });
    prisma.candidatura.update.mockResolvedValue({
      id: 'cand-1',
      status: StatusCandidatura.APROVADO,
      updatedAt: new Date(),
    });

    const res = await service.updateStatus('cand-1', StatusCandidatura.APROVADO);
    expect(res.data.status).toBe(StatusCandidatura.APROVADO);
    expect(prisma.candidatura.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'cand-1' },
        data: { status: StatusCandidatura.APROVADO },
      }),
    );
  });

  it('lança 404 ao tentar alterar status de candidatura inexistente', async () => {
    prisma.candidatura.findUnique.mockResolvedValue(null);
    await expect(
      service.updateStatus('inexistente', StatusCandidatura.REJEITADO),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('retorna lista vazia em findMine quando usuário não tem perfil de voluntário', async () => {
    prisma.perfilVoluntario.findUnique.mockResolvedValue(null);
    const res = await service.findMine('u-sem-perfil');
    expect(res).toEqual([]);
  });
});