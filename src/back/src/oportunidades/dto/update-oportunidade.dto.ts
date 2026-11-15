import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsNotEmpty,
  Matches,
  MaxLength,
  ValidateIf,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CriterioFunilDto } from './create-oportunidade.dto.js';

/**
 * DTO para edição parcial de oportunidade (PATCH, RF19).
 * Todos os campos são opcionais — apenas os enviados são atualizados.
 * Permite também abrir/fechar a oportunidade (isOpen).
 */
export class UpdateOportunidadeDto {
  @ValidateIf((_, value: unknown) => value !== undefined)
  @IsString({ message: 'O título deve ser um texto válido.' })
  @IsNotEmpty({ message: 'O título não pode ser vazio.' })
  @Matches(/\S/, { message: 'Informe um texto que não contenha apenas espaços.' })
  @MaxLength(191)
  title?: string;

  @ValidateIf((_, value: unknown) => value !== undefined)
  @IsString({ message: 'A descrição deve ser um texto válido.' })
  @IsNotEmpty({ message: 'A descrição não pode ser vazia.' })
  @Matches(/\S/, { message: 'Informe um texto que não contenha apenas espaços.' })
  description?: string;

  @ValidateIf((_, value: unknown) => value !== undefined)
  @IsString({ message: 'A duração deve ser um texto válido.' })
  @IsNotEmpty({ message: 'A duração não pode ser vazia.' })
  @Matches(/\S/, { message: 'Informe um texto que não contenha apenas espaços.' })
  @MaxLength(191)
  duracao?: string;

  @ValidateIf((_, value: unknown) => value !== undefined)
  @IsString({ message: 'A disponibilidade deve ser um texto válido.' })
  @IsNotEmpty({ message: 'A disponibilidade não pode ser vazia.' })
  @Matches(/\S/, { message: 'Informe um texto que não contenha apenas espaços.' })
  @MaxLength(191)
  disponibilidade?: string;

  @ValidateIf((_, value: unknown) => value !== undefined)
  @IsArray({ message: 'As habilidades devem ser informadas como um array de textos.' })
  @IsString({ each: true, message: 'Cada habilidade deve ser um texto.' })
  @Matches(/\S/, { each: true, message: 'Habilidades não podem ser vazias.' })
  @ArrayMinSize(1, { message: 'Informe ao menos uma habilidade requerida.' })
  habilidades?: string[];

  @ValidateIf((_, value: unknown) => value !== undefined)
  @IsString({ message: 'As atividades planejadas devem ser um texto válido.' })
  atividades?: string;

  @ValidateIf((_, value: unknown) => value !== undefined)
  @IsString({ message: 'O local de atuação deve ser um texto válido.' })
  @MaxLength(191)
  localAtuacao?: string;

  /**
   * Abrir ou fechar a oportunidade (RF19).
   * `true` = Publicada / aberta. `false` = Fechada / rascunho.
   */
  @ValidateIf((_, value: unknown) => value !== undefined)
  @IsBoolean({ message: 'isOpen deve ser um valor booleano (true ou false).' })
  isOpen?: boolean;

  /** Atualização dos critérios do funil (upsert). */
  @ValidateIf((_, value: unknown) => value !== undefined)
  @ValidateNested({ message: 'Os critérios do funil devem ser um objeto válido.' })
  @Type(() => CriterioFunilDto)
  criteriosFunil?: CriterioFunilDto;
}
