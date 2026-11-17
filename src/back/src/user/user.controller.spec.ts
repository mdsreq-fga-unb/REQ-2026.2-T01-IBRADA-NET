import { ForbiddenException } from '@nestjs/common';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { AuthenticatedRequest } from '../auth/auth.types.js';
import { UserController } from './user.controller.js';

const requisicao = (sub: string, role: string, method = 'PATCH', url = '/users/u1') =>
  ({ method, url, user: { sub, email: `${sub}@a.com`, role } }) as unknown as AuthenticatedRequest;

describe('UserController (US05, US15)', () => {
  const userService = {
    findMe: vi.fn(),
    createPerfilVoluntario: vi.fn(),
    update: vi.fn(),
  };
  const controller = new UserController(userService as never);

  beforeEach(() => {
    userService.findMe.mockReset();
    userService.createPerfilVoluntario.mockReset();
    userService.update.mockReset();
  });

  it('GET /users/me delega o sub do token para findMe', () => {
    controller.findMe(requisicao('u1', 'CLIENTE', 'GET', '/users/me'));
    expect(userService.findMe).toHaveBeenCalledWith('u1');
  });

  it('POST /users/me/perfil-voluntario delega o sub e o DTO para createPerfilVoluntario', () => {
    const dto = { bio: 'Quero ajudar', categoriaIds: ['c1'] };
    controller.createPerfilVoluntario(dto, requisicao('u1', 'CLIENTE', 'POST', '/users/me/perfil-voluntario'));
    expect(userService.createPerfilVoluntario).toHaveBeenCalledWith('u1', dto);
  });

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