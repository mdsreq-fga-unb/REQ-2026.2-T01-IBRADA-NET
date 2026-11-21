import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateCandidaturaDto {
  @IsOptional()
  @IsBoolean({ message: 'experienciaNaArea deve ser um valor booleano.' })
  experienciaNaArea?: boolean;

  @IsOptional()
  @IsString({ message: 'A mensagem deve ser um texto válido.' })
  @MaxLength(2000, { message: 'A mensagem deve ter no máximo 2000 caracteres.' })
  mensagem?: string;
}