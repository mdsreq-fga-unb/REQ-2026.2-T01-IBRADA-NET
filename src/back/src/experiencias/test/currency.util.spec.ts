import { describe, expect, it } from 'vitest';
import {
  centsToDecimalString,
  centsToFormattedBrl,
  decimalStringToCents,
  parseCurrency,
} from '../utils/currency.util.js';

describe('currency.util (Prevenção de erros IEEE 754)', () => {
  describe('parseCurrency', () => {
    it('deve converter número float perigoso (19.99) com exatidão sem perder centavos', () => {
      // No JS puro: 19.99 * 100 === 1998.9999999999998
      const result = parseCurrency(19.99);

      expect(result.cents).toBe(1999);
      expect(result.decimalString).toBe('19.99');
      expect(result.formatted).toBe('R$ 19,99');
    });

    it('deve converter string com ponto ("150.50")', () => {
      const result = parseCurrency('150.50');

      expect(result.cents).toBe(15050);
      expect(result.decimalString).toBe('150.50');
      expect(result.formatted).toBe('R$ 150,50');
    });

    it('deve converter string no formato brasileiro com vírgula ("150,50")', () => {
      const result = parseCurrency('150,50');

      expect(result.cents).toBe(15050);
      expect(result.decimalString).toBe('150.50');
      expect(result.formatted).toBe('R$ 150,50');
    });

    it('deve aceitar string com separador de milhar brasileiro ("1.250,50")', () => {
      const result = parseCurrency('1.250,50');

      expect(result.cents).toBe(125050);
      expect(result.decimalString).toBe('1250.50');
      expect(result.formatted).toBe('R$ 1.250,50');
    });

    it('deve aceitar inteiros como reais (150 -> R$ 150,00 / 15000 centavos)', () => {
      const result = parseCurrency(150);

      expect(result.cents).toBe(15000);
      expect(result.decimalString).toBe('150.00');
    });

    it('deve normalizar valores com apenas 1 casa decimal (150.5 -> 50 centavos)', () => {
      const result = parseCurrency(150.5);

      expect(result.cents).toBe(15050);
      expect(result.decimalString).toBe('150.50');
    });

    it('deve rejeitar valores com mais de 2 casas decimais ("10.999")', () => {
      expect(() => parseCurrency('10.999')).toThrowError(/no máximo 2 casas decimais/);
    });

    it('deve rejeitar valores negativos (-10)', () => {
      expect(() => parseCurrency(-10)).toThrowError(/número positivo/);
    });

    it('deve rejeitar texto não numérico ("abc")', () => {
      expect(() => parseCurrency('abc')).toThrowError(/Formato de preço inválido/);
    });

    it('deve rejeitar valores vazios ou nulos', () => {
      expect(() => parseCurrency('')).toThrowError(/obrigatório/);
      expect(() => parseCurrency(null)).toThrowError(/obrigatório/);
      expect(() => parseCurrency(undefined)).toThrowError(/obrigatório/);
    });
  });

  describe('centsToDecimalString e decimalStringToCents', () => {
    it('deve fazer conversão bidirecional perfeita entre centavos e string decimal', () => {
      const cents = 15050;
      const str = centsToDecimalString(cents);
      expect(str).toBe('150.50');

      const convertedBack = decimalStringToCents(str);
      expect(convertedBack).toBe(15050);
    });
  });

  describe('centsToFormattedBrl', () => {
    it('deve formatar centavos no padrão da moeda Real', () => {
      expect(centsToFormattedBrl(1999)).toBe('R$ 19,99');
      expect(centsToFormattedBrl(15000)).toBe('R$ 150,00');
    });
  });
});
