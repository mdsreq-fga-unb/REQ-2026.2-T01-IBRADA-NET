/**
 * Estrutura com todos os formatos seguros de representação monetária.
 */
export interface SafePriceRepresentation {
  cents: number;          // Inteiro em centavos (ex: 1999) - Ideal para gateways (Stripe, Mercado Pago) e Dinero.js
  decimalString: string;  // String decimal exata (ex: "19.99") - Ideal para envio direto ao Prisma DECIMAL(10, 2)
  numberValue: number;    // Número em reais (ex: 19.99) - Para compatibilidade com telas do front-end
  formatted: string;      // String formatada em Real brasileiro (ex: "R$ 19,99")
}

/**
 * Converte qualquer entrada monetária (number, string com ponto, string com vírgula)
 * em uma representação exata sem utilizar operações de multiplicação em ponto flutuante
 * binário (IEEE 754), eliminando falhas como 19.99 * 100 === 1998.9999999999998.
 */
export function parseCurrency(value: unknown): SafePriceRepresentation {
  if (value === null || value === undefined || value === '') {
    throw new Error('O preço é obrigatório.');
  }

  // Converte para string e limpa símbolos de moeda e espaços
  let str = String(value).trim().replace(/[R$\s]/g, '');

  // Se contiver vírgula, trata como padrão brasileiro:
  // Remove pontos de milhar (ex: "1.250,50" -> "1250,50") e troca a vírgula decimal por ponto
  if (str.includes(',')) {
    str = str.replace(/\./g, '').replace(',', '.');
  }

  // Validação estrita: apenas números positivos com até 2 casas decimais
  if (!/^\d+(\.\d{1,2})?$/.test(str)) {
    throw new Error(
      'Formato de preço inválido. O valor deve ser um número positivo com no máximo 2 casas decimais.',
    );
  }

  // Decomposição puramente textual para evitar erros binários de ponto flutuante
  const [reaisStr, centsStr] = str.split('.');
  const reais = parseInt(reaisStr, 10);

  // Normaliza os centavos: "5" vira 50 centavos; "05" vira 5 centavos; ausente vira 0
  const cents = centsStr ? parseInt(centsStr.padEnd(2, '0'), 10) : 0;

  // Matemática com números inteiros (garantia de precisão exata)
  const totalCents = reais * 100 + cents;
  const decimalString = `${reais}.${String(cents).padStart(2, '0')}`;
  const numberValue = Number(decimalString);
  const formatted = `R$ ${reais.toLocaleString('pt-BR')},${String(cents).padStart(2, '0')}`;

  return {
    cents: totalCents,
    decimalString,
    numberValue,
    formatted,
  };
}

/**
 * Converte valor inteiro em centavos para string decimal com 2 casas.
 * Exemplo: 15050 -> "150.50"
 */
export function centsToDecimalString(cents: number): string {
  const reais = Math.floor(cents / 100);
  const remainder = cents % 100;
  return `${reais}.${String(remainder).padStart(2, '0')}`;
}

/**
 * Converte valor inteiro em centavos para moeda brasileira formatada.
 * Exemplo: 15050 -> "R$ 150,50"
 */
export function centsToFormattedBrl(cents: number): string {
  const reais = Math.floor(cents / 100);
  const remainder = cents % 100;
  return `R$ ${reais.toLocaleString('pt-BR')},${String(remainder).padStart(2, '0')}`;
}

/**
 * Converte string decimal diretamente para centavos inteiros via decomposição de texto.
 * Exemplo: "150.50" -> 15050
 */
export function decimalStringToCents(decimalStr: string): number {
  const clean = String(decimalStr).trim();
  const [r, c] = clean.split('.');
  const reais = parseInt(r, 10) || 0;
  const cents = c ? parseInt(c.padEnd(2, '0'), 10) : 0;
  return reais * 100 + cents;
}
