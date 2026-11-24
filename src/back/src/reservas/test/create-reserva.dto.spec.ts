import { ValidationPipe } from '@nestjs/common';
import { describe, expect, it } from 'vitest';
import { CreateReservaDto } from '../dto/create-reserva.dto.js';

const pipe = new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
});

const validate = (body: unknown) =>
  pipe.transform(body, { type: 'body', metatype: CreateReservaDto });

async function getValidationErrors(body: unknown): Promise<string[]> {
  try {
    await validate(body);
  } catch (error) {
    const response = (error as { getResponse: () => { message: string[] } }).getResponse();
    return Array.isArray(response.message) ? response.message : [String(response.message)];
  }
  return [];
}

describe('CreateReservaDto (US08)', () => {
  it('aceita payload válido com experienceId e seats inteiro positivo', async () => {
    const dto = (await validate({ experienceId: 'exp-123', seats: 2 })) as CreateReservaDto;

    expect(dto.experienceId).toBe('exp-123');
    expect(dto.seats).toBe(2);
  });

  it('rejeita quando experienceId está ausente, vazio ou não é string', async () => {
    expect((await getValidationErrors({ seats: 1 })).length).toBeGreaterThan(0);
    expect(await getValidationErrors({ experienceId: '', seats: 1 })).toContain(
      'A experiência é obrigatória.',
    );
    expect((await getValidationErrors({ experienceId: 123, seats: 1 })).length).toBeGreaterThan(0);
  });

  it('rejeita seats ausente, zero, negativo, decimal, string ou booleano', async () => {
    expect((await getValidationErrors({ experienceId: 'exp-1' })).length).toBeGreaterThan(0);
    expect(await getValidationErrors({ experienceId: 'exp-1', seats: 0 })).toContain(
      'A quantidade mínima para reserva é de 1 vaga.',
    );
    expect((await getValidationErrors({ experienceId: 'exp-1', seats: -2 })).length).toBeGreaterThan(
      0,
    );
    expect(
      (await getValidationErrors({ experienceId: 'exp-1', seats: 1.5 })).length,
    ).toBeGreaterThan(0);
    expect(
      (await getValidationErrors({ experienceId: 'exp-1', seats: '2' })).length,
    ).toBeGreaterThan(0);
    expect(
      (await getValidationErrors({ experienceId: 'exp-1', seats: true })).length,
    ).toBeGreaterThan(0);
  });

  it('rejeita campos extras sensíveis (userId, status, totalAmount, expiresAt)', async () => {
    for (const extraField of [
      { userId: 'outro-user' },
      { status: 'CONFIRMED' },
      { totalAmount: 0 },
      { expiresAt: '2099-01-01T00:00:00.000Z' },
    ]) {
      const errors = await getValidationErrors({
        experienceId: 'exp-1',
        seats: 1,
        ...extraField,
      });
      expect(errors.length).toBeGreaterThan(0);
    }
  });
});
