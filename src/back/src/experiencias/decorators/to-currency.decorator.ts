import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsNotEmpty, Matches, type ValidationOptions } from 'class-validator';
import { parseCurrency } from '../utils/currency.util.js';

/**
 * Decorator customizado para atributos monetários.
 *
 * Intercepta o preço enviado pelo front-end em qualquer formato:
 * - number (ex: 150.50, 19.99, 80)
 * - string com ponto (ex: "150.50")
 * - string no padrão brasileiro com vírgula (ex: "150,50", "1.250,50")
 *
 * Transforma com precisão exata para uma string decimal de duas casas (ex: "150.50"),
 * impedindo qualquer perda de centavos por arredondamento binário do IEEE 754.
 */
export function ToCurrency(validationOptions?: ValidationOptions) {
  return applyDecorators(
    Transform(({ value }) => {
      if (value === null || value === undefined || value === '') {
        return value;
      }
      try {
        const parsed = parseCurrency(value);
        return parsed.decimalString;
      } catch {
        return 'INVALID_CURRENCY';
      }
    }),
    IsNotEmpty({
      message: 'O preço da experiência é obrigatório.',
      ...validationOptions,
    }),
    Matches(/^\d+\.\d{2}$/, {
      message:
        'O preço deve ser um valor monetário positivo válido com até 2 casas decimais (ex: 150.50 ou "150,50").',
      ...validationOptions,
    }),
  );
}
