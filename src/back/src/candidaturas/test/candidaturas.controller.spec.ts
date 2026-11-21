import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CandidaturasController } from '../candidaturas.controller.js';
import { StatusCandidatura } from '../../generated/prisma/enums.js';
import type { AuthenticatedRequest } from '../../auth/auth.types.js';

const req = (sub: string, role: string) =>
  ({ user: { sub, email: `${sub}@teste.com`, role } }) as unknown as AuthenticatedRequest;

describe('CandidaturasController (US16, US18)', () => {
  const service = {
    findMine: vi.fn(),
    findAllForGestor: vi.fn(),
    updateStatus: vi.fn(),
  };
  const controller = new CandidaturasController(service as never);

  beforeEach(() => {
    service.findMine.mockReset();
    service.findAllForGestor.mockReset();
    service.updateStatus.mockReset();
  });

  it('GET /candidaturas/minhas delega sub do usuário autenticado', async () => {
    await controller.findMine(req('u1', 'VOLUNTARIO'));
    expect(service.findMine).toHaveBeenCalledWith('u1');
  });

  it('GET /candidaturas delega filtros e paginação ao service', async () => {
    const query = { oportunidadeId: 'op1', status: StatusCandidatura.EM_ANALISE, page: 2, limit: 5 };
    await controller.findAllForGestor(query);
    expect(service.findAllForGestor).toHaveBeenCalledWith(query);
  });

  it('PATCH /candidaturas/:id/status delega id e novo status', async () => {
    await controller.updateStatus('cand1', { status: StatusCandidatura.APROVADO });
    expect(service.updateStatus).toHaveBeenCalledWith('cand1', StatusCandidatura.APROVADO);
  });
});