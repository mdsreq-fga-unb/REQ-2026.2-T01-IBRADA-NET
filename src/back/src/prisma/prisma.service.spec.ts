import { afterEach, describe, expect, it, vi } from 'vitest';
import { PrismaService } from './prisma.service.js';

describe('PrismaService', () => {
  afterEach(() => vi.unstubAllEnvs());

  it('rejeita configuração sem DATABASE_URL', () => {
    vi.stubEnv('DATABASE_URL', '');
    expect(() => new PrismaService()).toThrow('DATABASE_URL não definida');
  });

  it('conecta e desconecta nos eventos do módulo', async () => {
    vi.stubEnv('DATABASE_URL', 'mysql://test:test@localhost:3306/test');
    const service = new PrismaService();
    const connect = vi.spyOn(service, '$connect').mockResolvedValue(undefined);
    const disconnect = vi.spyOn(service, '$disconnect').mockResolvedValue(undefined);
    await service.onModuleInit();
    await service.onModuleDestroy();
    expect(connect).toHaveBeenCalledOnce();
    expect(disconnect).toHaveBeenCalledOnce();
  });
});
