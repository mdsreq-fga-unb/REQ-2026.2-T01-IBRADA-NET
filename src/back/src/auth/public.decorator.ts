import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

// Libera a rota da autenticação. Por padrão TODA rota exige JWT válido
// (negar por padrão, RNF04); use só em rotas realmente públicas.
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
