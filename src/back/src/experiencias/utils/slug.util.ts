/**
 * Utilitário para conversão de strings em slugs URL-amigáveis.
 * Exemplo: "Trilha da Cachoeira & Aventura!" -> "trilha-da-cachoeira-aventura"
 */
export function slugify(text: string): string {
  return text
    .normalize('NFD') // Decompõe caracteres acentuados (ex: 'ã' -> 'a' + til)
    .replace(/[\u0300-\u036f]/g, '') // Remove marcas de acentuação
    .toLowerCase() // Normaliza para letras minúsculas
    .trim() // Remove espaços em branco nas extremidades
    .replace(/[^a-z0-9\s-]/g, '') // Remove pontuações e caracteres especiais
    .replace(/[\s_-]+/g, '-') // Substitui espaços e underscores por traço
    .replace(/^-+|-+$/g, ''); // Remove traços extras no início e fim
}
