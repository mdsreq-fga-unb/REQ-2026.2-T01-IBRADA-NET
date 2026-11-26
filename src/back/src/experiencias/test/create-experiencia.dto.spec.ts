import { ValidationPipe } from '@nestjs/common';
import { describe, expect, it } from 'vitest';
import { CreateExperienciaDto } from '../dto/create-experiencia.dto.js';
import { UpdateDisponibilidadeDto } from '../dto/update-disponibilidade.dto.js';

// Mesmas opções do main.ts: o que o gestor enviar passa por aqui antes do service.
const pipe = new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true });

const validBody = {
  title: 'Vivência Quilombola',
  description: 'Imersão cultural com a comunidade',
  itinerary: 'Visita à horta, almoço típico e roda de conversa',
  price: '150,50',
  startsAt: '2026-12-01T08:00:00.000Z',
  endsAt: '2026-12-01T18:00:00.000Z',
  capacity: 10,
  isAvailable: true,
  photos: ['https://exemplo.com/capa.jpg'],
  location: 'Planaltina/DF',
  community: 'Assentamento Pequeno William',
  biome: 'Cerrado',
  difficulty: 'MODERADA',
  meetingPoint: 'Sede do assentamento',
  meetingTime: '07h30',
  includedItems: ['Guia local', 'Almoço'],
  rules: ['Permaneça na trilha'],
  clothingTips: ['Calçado fechado'],
  communityImpact: 'Parte do valor fica com as famílias anfitriãs.',
  guideName: 'Seu Raimundo',
  guideRole: 'Guia local',
  maxPerBooking: 6,
};

const validate = (body: unknown, metatype: new () => object = CreateExperienciaDto) =>
  pipe.transform(body, { type: 'body', metatype });

async function mensagens(body: unknown, metatype?: new () => object): Promise<string[]> {
  try {
    await validate(body, metatype);
  } catch (error) {
    const response = (error as { getResponse: () => { message: string[] } }).getResponse();
    return response.message;
  }
  return [];
}

describe('CreateExperienciaDto (US11 - campos obrigatórios)', () => {
  it('aceita um corpo completo e normaliza o preço para string decimal', async () => {
    const dto = (await validate(validBody)) as CreateExperienciaDto;

    expect(dto.price).toBe('150.50');
    expect(dto.capacity).toBe(10);
    expect(dto.location).toBe('Planaltina/DF');
    expect(dto.includedItems).toEqual(['Guia local', 'Almoço']);
  });

  it('exige local, ponto e horário de encontro e itens inclusos (US03)', async () => {
    const { location: _l, meetingPoint: _p, meetingTime: _t, includedItems: _i, ...incompleto } = validBody;
    const msgs = await mensagens(incompleto);

    expect(msgs).toEqual(
      expect.arrayContaining([
        'O local do pacote é obrigatório.',
        'O ponto de encontro é obrigatório.',
        'O horário de encontro é obrigatório.',
        'Os itens inclusos devem ser enviados como uma lista.',
      ]),
    );
  });

  it('rejeita bioma e dificuldade fora das opções válidas', async () => {
    const msgs = await mensagens({ ...validBody, biome: 'Deserto', difficulty: 'EXTREMA' });

    expect(msgs.join(' ')).toContain('O bioma deve ser um destes');
    expect(msgs.join(' ')).toContain('A dificuldade deve ser');
  });

  it('aceita regras, vestuário, impacto e guia como opcionais', async () => {
    const { community: _co, rules: _r, clothingTips: _v, communityImpact: _ci, guideName: _gn, guideRole: _gr, maxPerBooking: _m, ...semOpcionais } = validBody;

    await expect(validate(semOpcionais)).resolves.toBeDefined();
  });

  it.each(['title', 'description', 'itinerary', 'price', 'startsAt', 'endsAt', 'capacity', 'isAvailable'])(
    'rejeita o cadastro sem o campo obrigatório "%s"',
    async (campo) => {
      const { [campo]: _omitido, ...semCampo } = validBody as Record<string, unknown>;

      expect((await mensagens(semCampo)).length).toBeGreaterThan(0);
    },
  );

  it('aceita isAvailable=false (gestor cadastra já indisponível)', async () => {
    const dto = (await validate({ ...validBody, isAvailable: false })) as CreateExperienciaDto;

    expect(dto.isAvailable).toBe(false);
  });

  it('rejeita roteiro vazio', async () => {
    expect(await mensagens({ ...validBody, itinerary: '' })).toContain(
      'O roteiro do pacote é obrigatório.',
    );
  });

  it('rejeita capacidade zero ou negativa', async () => {
    expect(await mensagens({ ...validBody, capacity: 0 })).toContain(
      'A capacidade deve ser de no mínimo 1 vaga.',
    );
    expect((await mensagens({ ...validBody, capacity: -3 })).length).toBeGreaterThan(0);
  });

  it('rejeita capacidade não inteira', async () => {
    expect((await mensagens({ ...validBody, capacity: 2.5 })).length).toBeGreaterThan(0);
  });

  it('rejeita preço com mais de 2 casas decimais, negativo ou textual', async () => {
    for (const price of ['10.999', -10, 'abc']) {
      expect((await mensagens({ ...validBody, price })).length).toBeGreaterThan(0);
    }
  });

  it('rejeita datas que não estejam em formato ISO 8601', async () => {
    expect(await mensagens({ ...validBody, startsAt: '01/12/2026' })).toContain(
      'A data de início deve ser uma data válida no formato ISO 8601.',
    );
    expect((await mensagens({ ...validBody, endsAt: 'amanhã' })).length).toBeGreaterThan(0);
  });

  it('rejeita campos fora do DTO (ex.: slug enviado pelo cliente)', async () => {
    expect((await mensagens({ ...validBody, slug: 'meu-slug' })).length).toBeGreaterThan(0);
  });
});

describe('UpdateDisponibilidadeDto (US12)', () => {
  it('aceita true e false', async () => {
    expect(await mensagens({ isAvailable: true }, UpdateDisponibilidadeDto)).toEqual([]);
    expect(await mensagens({ isAvailable: false }, UpdateDisponibilidadeDto)).toEqual([]);
  });

  it('rejeita corpo vazio ou valor que não seja booleano', async () => {
    expect((await mensagens({}, UpdateDisponibilidadeDto)).length).toBeGreaterThan(0);
    expect((await mensagens({ isAvailable: 'sim' }, UpdateDisponibilidadeDto)).length).toBeGreaterThan(0);
  });
});
