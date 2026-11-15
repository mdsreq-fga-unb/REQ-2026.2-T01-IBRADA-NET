import 'reflect-metadata';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { describe, expect, it } from 'vitest';
import { CreateOportunidadeDto } from '../dto/create-oportunidade.dto.js';
import { UpdateOportunidadeDto } from '../dto/update-oportunidade.dto.js';

const pipe = new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true });
const valid = {
  title: 'Monitor ambiental', description: 'Apoio em campo', projetoId: 'p1',
  categoriaId: 'c1', duracao: '3 meses', disponibilidade: 'Sábados', habilidades: ['Botânica'],
};

describe('Validação de oportunidades', () => {
  it('aceita cadastro válido com critérios', async () => {
    await expect(pipe.transform({ ...valid, criteriosFunil: { exigeExperiencia: true } },
      { type: 'body', metatype: CreateOportunidadeDto })).resolves.toBeInstanceOf(CreateOportunidadeDto);
  });

  it.each([
    { duracao: ' ' }, { disponibilidade: '\t' }, { habilidades: [''] },
    { habilidades: [' '] }, { title: 'a'.repeat(192) }, { isOpen: null },
    { criteriosFunil: { exigeExperiencia: null } },
  ])('rejeita cadastro inválido: %j', async (fields) => {
    await expect(pipe.transform({ ...valid, ...fields }, { type: 'body', metatype: CreateOportunidadeDto }))
      .rejects.toBeInstanceOf(BadRequestException);
  });

  it.each([{ title: null }, { isOpen: null }, { habilidades: null }, { duracao: ' ' }])(
    'rejeita PATCH inválido: %j', async (body) => {
      await expect(pipe.transform(body, { type: 'body', metatype: UpdateOportunidadeDto }))
        .rejects.toBeInstanceOf(BadRequestException);
    },
  );

  it('aceita PATCH com apenas um critério', async () => {
    await expect(pipe.transform({ criteriosFunil: { exigeExperiencia: true } },
      { type: 'body', metatype: UpdateOportunidadeDto })).resolves.toBeInstanceOf(UpdateOportunidadeDto);
  });
});
