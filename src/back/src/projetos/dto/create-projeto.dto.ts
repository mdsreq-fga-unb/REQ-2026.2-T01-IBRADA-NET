import {
  IsDateString,
  IsNotEmpty,
  Matches,
  MaxLength,
  ValidateIf,
  IsString,
} from 'class-validator';

/**
 * DTO para criação de projeto (gestor).
 * Módulo mínimo: apenas os dados necessários para vincular a oportunidade.
 */
export class CreateProjetoDto {
  @IsString({ message: 'O título deve ser um texto válido.' })
  @IsNotEmpty({ message: 'O título do projeto é obrigatório.' })
  @Matches(/\S/, { message: 'Informe um texto que não contenha apenas espaços.' })
  @MaxLength(191)
  title: string;

  @IsString({ message: 'A descrição deve ser um texto válido.' })
  @IsNotEmpty({ message: 'A descrição do projeto é obrigatória.' })
  @Matches(/\S/, { message: 'Informe um texto que não contenha apenas espaços.' })
  description: string;

  @ValidateIf((_, value: unknown) => value !== undefined)
  @IsDateString({ strict: true }, { message: 'A data de início deve ser uma data válida no formato ISO 8601.' })
  startDate?: string;

  @ValidateIf((_, value: unknown) => value !== undefined)
  @IsDateString({ strict: true }, { message: 'A data de término deve ser uma data válida no formato ISO 8601.' })
  endDate?: string;
}
