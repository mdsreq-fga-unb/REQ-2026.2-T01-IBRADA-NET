const MIN_SECRET_LENGTH = 32;

// Segredo do JWT vindo do ambiente, sem fallback: se faltar (ou for curto
// demais) a aplicação não sobe, em vez de assinar tokens com chave conhecida.
// Gere um valor com: openssl rand -hex 32
export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < MIN_SECRET_LENGTH) {
    throw new Error(
      `JWT_SECRET não definido ou com menos de ${MIN_SECRET_LENGTH} caracteres. Defina no .env (ex.: openssl rand -hex 32).`,
    );
  }
  return secret;
}
