import { ForbiddenException } from '@nestjs/common';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { AuthenticatedRequest } from '../auth/auth.types.js';
import { UserController } from './user.controller.js';

const requisicao = (sub: string, role: string) =>
  ({ method: 'PATCH', url: '/users/u1', user: { sub, email: `${sub}@a.com`, role } }) as unknown as AuthenticatedRequest;

describe('UserController PATCH /users/:id (US05)', () => {
  const userService = { update: vi.fn() };
  const controller = new UserController(userService as never);

  beforeEach(() => userService.update.mockReset());

  it('permite o usuário editar os próprios dados', () => {
    controller.update('u1', { phone: '61988887777' }, requisicao('u1', 'CLIENTE'));
    expect(userService.update).toHaveBeenCalledWith('u1', { phone: '61988887777' });
  });

  it('nega editar dados de outro usuário (403) sem chamar o service', () => {
    expect(() => controller.update('u1', { name: 'Hack' }, requisicao('u2', 'CLIENTE'))).toThrow(
      ForbiddenException,
    );
    expect(userService.update).not.toHaveBeenCalled();
  });

  it('nem o gestor edita dados pessoais de outra conta (403)', () => {
    expect(() => controller.update('u1', { name: 'X' }, requisicao('g1', 'GESTOR'))).toThrow(
      ForbiddenException,
    );
    expect(userService.update).not.toHaveBeenCalled();
  });
});
