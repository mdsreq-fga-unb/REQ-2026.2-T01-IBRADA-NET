import { afterEach, describe, expect, it, vi } from 'vitest';
import { getJwtSecret } from './jwt-secret.js';

describe('getJwtSecret', () => {
  afterEach(() => vi.unstubAllEnvs());

  it('falha quando JWT_SECRET não está definido (sem fallback)', () => {
    vi.stubEnv('JWT_SECRET', '');
    expect(() => getJwtSecret()).toThrow(/JWT_SECRET/);
  });

  it('falha quando o segredo é curto demais', () => {
    vi.stubEnv('JWT_SECRET', 'curto');
    expect(() => getJwtSecret()).toThrow(/JWT_SECRET/);
  });

  it('retorna o segredo quando válido', () => {
    const secret = 'a'.repeat(32);
    vi.stubEnv('JWT_SECRET', secret);
    expect(getJwtSecret()).toBe(secret);
  });
});
