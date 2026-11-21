import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { StatusCandidatura } from '../../generated/prisma/enums.js';

export class ListCandidaturasQueryDto {
  @IsOptional()
  @IsString()
  oportunidadeId?: string;

  @IsOptional()
  @IsEnum(StatusCandidatura, {
    message:
      'Status inválido. Valores aceitos: INSCRITO, EM_ANALISE, ENTREVISTA, APROVADO, REJEITADO.',
  })
  status?: StatusCandidatura;

  @IsOptional()
  @IsString()
  busca?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'page deve ser um número inteiro.' })
  @Min(1, { message: 'page deve ser no mínimo 1.' })
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'limit deve ser um número inteiro.' })
  @Min(1, { message: 'limit deve ser no mínimo 1.' })
  @Max(100, { message: 'limit deve ser no máximo 100.' })
  limit?: number = 10;
}