import { ForbiddenException, UnauthorizedException } from '@nestjs/common';
import type { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { UserRole } from '../user/dto/create-user.dto.js';
import { JwtAuthGuard } from './jwt-auth.guard.js';
import { Public } from './public.decorator.js';
import { Roles } from './roles.decorator.js';
import { RolesGuard } from './roles.guard.js';

class FakeController {
  @Public()
  aberta() {}

  fechada() {}

  @Roles(UserRole.GESTOR)
  soGestor() {}
}

function contexto(handler: () => void, req: Record<string, unknown>) {
  const request = { method: 'GET', url: '/x', headers: {}, ...req };
  const ctx = {
    getHandler: () => handler,
    getClass: () => FakeController,
    switchToHttp: () => ({ getRequest: () => request }),
  } as unknown as ExecutionContext;
  return { ctx, request };
}

describe('JwtAuthGuard (negar por padrão)', () => {
  const jwt = { verifyAsync: vi.fn() };
  let guard: JwtAuthGuard;

  beforeEach(() => {
    jwt.verifyAsync.mockReset();
    guard = new JwtAuthGuard(new Reflector(), jwt as never);
  });

  it('libera rota @Public sem token', async () => {
    const { ctx } = contexto(FakeController.prototype.aberta, {});
    await expect(guard.canActivate(ctx)).resolves.toBe(true);
    expect(jwt.verifyAsync).not.toHaveBeenCalled();
  });

  it('nega rota sem @Public e sem token (401)', async () => {
    const { ctx } = contexto(FakeController.prototype.fechada, {});
    await expect(guard.canActivate(ctx)).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('nega esquema diferente de Bearer (401)', async () => {
    const { ctx } = contexto(FakeController.prototype.fechada, {
      headers: { authorization: 'Basic abc' },
    });
    await expect(guard.canActivate(ctx)).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('nega token inválido ou expirado (401)', async () => {
    jwt.verifyAsync.mockRejectedValue(new Error('jwt expired'));
    const { ctx } = contexto(FakeController.prototype.fechada, {
      headers: { authorization: 'Bearer ruim' },
    });
    await expect(guard.canActivate(ctx)).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('aceita token válido e anexa o usuário na requisição', async () => {
    const payload = { sub: 'u1', email: 'a@a.com', role: 'CLIENTE' };
    jwt.verifyAsync.mockResolvedValue(payload);
    const { ctx, request } = contexto(FakeController.prototype.fechada, {
      headers: { authorization: 'Bearer valido' },
    });
    await expect(guard.canActivate(ctx)).resolves.toBe(true);
    expect(request['user']).toEqual(payload);
  });
});

describe('RolesGuard', () => {
  const guard = new RolesGuard(new Reflector());

  it('rota sem @Roles exige só autenticação', () => {
    const { ctx } = contexto(FakeController.prototype.fechada, {});
    expect(guard.canActivate(ctx)).toBe(true);
  });

  it('nega CLIENTE em rota de GESTOR (403)', () => {
    const { ctx } = contexto(FakeController.prototype.soGestor, {
      user: { sub: 'u1', email: 'a@a.com', role: 'CLIENTE' },
    });
    expect(() => guard.canActivate(ctx)).toThrow(ForbiddenException);
  });

  it('nega VOLUNTARIO em rota de GESTOR (403)', () => {
    const { ctx } = contexto(FakeController.prototype.soGestor, {
      user: { sub: 'u2', email: 'v@a.com', role: 'VOLUNTARIO' },
    });
    expect(() => guard.canActivate(ctx)).toThrow(ForbiddenException);
  });

  it('nega requisição sem usuário em rota de GESTOR (403)', () => {
    const { ctx } = contexto(FakeController.prototype.soGestor, {});
    expect(() => guard.canActivate(ctx)).toThrow(ForbiddenException);
  });

  it('libera GESTOR em rota de GESTOR', () => {
    const { ctx } = contexto(FakeController.prototype.soGestor, {
      user: { sub: 'g1', email: 'g@a.com', role: 'GESTOR' },
    });
    expect(guard.canActivate(ctx)).toBe(true);
  });
});
