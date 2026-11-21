import { IsEnum } from 'class-validator';
import { StatusCandidatura } from '../../generated/prisma/enums.js';

export class UpdateStatusCandidaturaDto {
  @IsEnum(StatusCandidatura, {
    message:
      'Status inválido. Valores aceitos: INSCRITO, EM_ANALISE, ENTREVISTA, APROVADO, REJEITADO.',
  })
  status: StatusCandidatura;
}