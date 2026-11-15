import { ValidationPipe } from '@nestjs/common';
import { describe, expect, it } from 'vitest';
import { CreatePedidoParceriaDto } from '../dto/create-pedido-parceria.dto.js';
import { UpdateStatusParceriaDto } from '../dto/update-status-parceria.dto.js';

// Mesmas opções do main.ts: o formulário público passa por aqui antes do service.
const pipe = new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true });

const corpoValido = {
  organization: 'Instituto Terra Viva',
  cnpj: '12.345.678/0001-90',
  contactName: 'Carlos Silva',
  contactEmail: 'carlos@terraviva.org',
  contactPhone: '(61) 98765-4321',
  proposal: 'Gostaríamos de propor oficinas de sustentabilidade comunitária.',
};

const validar = (body: unknown, metatype: new () => object = CreatePedidoParceriaDto) =>
  pipe.transform(body, { type: 'body', metatype });

async function mensagens(body: unknown, metatype?: new () => object): Promise<string[]> {
  try {
    await validar(body, metatype);
  } catch (error) {
    return (error as { getResponse: () => { message: string[] } }).getResponse().message;
  }
  return [];
}

describe('CreatePedidoParceriaDto (US19 - formulário de parceria)', () => {
  it('aceita o formulário completo', async () => {
    expect(await mensagens(corpoValido)).toEqual([]);
  });

  it('aceita o formulário só com os campos de identificação e a proposta (CNPJ e telefone são opcionais)', async () => {
    const { cnpj: _cnpj, contactPhone: _phone, ...minimo } = corpoValido;

    expect(await mensagens(minimo)).toEqual([]);
  });

  it.each(['organization', 'contactName', 'contactEmail', 'proposal'])(
    'rejeita o envio sem o campo obrigatório "%s"',
    async (campo) => {
      const { [campo]: _omitido, ...semCampo } = corpoValido as Record<string, unknown>;

      expect((await mensagens(semCampo)).length).toBeGreaterThan(0);
    },
  );

  it.each(['organization', 'contactName', 'contactEmail', 'proposal'])(
    'rejeita "%s" preenchido só com espaços',
    async (campo) => {
      expect((await mensagens({ ...corpoValido, [campo]: '   ' })).length).toBeGreaterThan(0);
    },
  );

  it('remove espaços nas pontas dos textos', async () => {
    const dto = (await validar({
      ...corpoValido,
      organization: '  Instituto Terra Viva  ',
    })) as CreatePedidoParceriaDto;

    expect(dto.organization).toBe('Instituto Terra Viva');
  });

  it('trata telefone e CNPJ vazios como não informados', async () => {
    const dto = (await validar({ ...corpoValido, contactPhone: '  ', cnpj: '' })) as CreatePedidoParceriaDto;

    expect(dto.contactPhone).toBeUndefined();
    expect(dto.cnpj).toBeUndefined();
  });

  it('rejeita e-mail inválido', async () => {
    expect(await mensagens({ ...corpoValido, contactEmail: 'sem-arroba' })).toContain(
      'O e-mail de contato institucional deve ser válido.',
    );
  });

  it('rejeita CNPJ fora do formato', async () => {
    expect(await mensagens({ ...corpoValido, cnpj: '123' })).toContain(
      'O CNPJ deve ter 14 dígitos (ex.: 12.345.678/0001-90).',
    );
  });

  it('rejeita textos acima do limite da coluna', async () => {
    expect((await mensagens({ ...corpoValido, organization: 'x'.repeat(192) })).length).toBeGreaterThan(0);
    expect((await mensagens({ ...corpoValido, proposal: 'x'.repeat(5001) })).length).toBeGreaterThan(0);
  });

  it('rejeita campos fora do DTO (ex.: tentar definir o status pelo formulário público)', async () => {
    expect((await mensagens({ ...corpoValido, status: 'ACCEPTED' })).length).toBeGreaterThan(0);
  });
});

describe('UpdateStatusParceriaDto', () => {
  it('aceita os status do funil e rejeita outros valores', async () => {
    expect(await mensagens({ status: 'IN_ANALYSIS' }, UpdateStatusParceriaDto)).toEqual([]);
    expect((await mensagens({ status: 'QUALQUER' }, UpdateStatusParceriaDto)).length).toBeGreaterThan(0);
    expect((await mensagens({}, UpdateStatusParceriaDto)).length).toBeGreaterThan(0);
  });
});
