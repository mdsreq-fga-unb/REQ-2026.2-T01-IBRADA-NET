import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { NivelEducacao } from '../../user/dto/create-user.dto.js';
import { CriterioFunilDto } from './create-oportunidade.dto.js';

/**
 * DTO para edição parcial de oportunidade (PATCH, RF19).
 * Todos os campos são opcionais — apenas os enviados são atualizados.
 * Permite também abrir/fechar a oportunidade (isOpen).
 */
export class UpdateOportunidadeDto {
  @IsOptional()
  @IsString({ message: 'O título deve ser um texto válido.' })
  @IsNotEmpty({ message: 'O título não pode ser vazio.' })
  title?: string;

  @IsOptional()
  @IsString({ message: 'A descrição deve ser um texto válido.' })
  @IsNotEmpty({ message: 'A descrição não pode ser vazia.' })
  description?: string;

  @IsOptional()
  @IsString({ message: 'A duração deve ser um texto válido.' })
  @IsNotEmpty({ message: 'A duração não pode ser vazia.' })
  duracao?: string;

  @IsOptional()
  @IsString({ message: 'A disponibilidade deve ser um texto válido.' })
  @IsNotEmpty({ message: 'A disponibilidade não pode ser vazia.' })
  disponibilidade?: string;

  @IsOptional()
  @IsArray({ message: 'As habilidades devem ser informadas como um array de textos.' })
  @IsString({ each: true, message: 'Cada habilidade deve ser um texto.' })
  @ArrayMinSize(1, { message: 'Informe ao menos uma habilidade requerida.' })
  habilidades?: string[];

  @IsOptional()
  @IsString({ message: 'As atividades planejadas devem ser um texto válido.' })
  atividades?: string;

  @IsOptional()
  @IsString({ message: 'O local de atuação deve ser um texto válido.' })
  localAtuacao?: string;

  /**
   * Abrir ou fechar a oportunidade (RF19).
   * `true` = Publicada / aberta. `false` = Fechada / rascunho.
   */
  @IsOptional()
  @IsBoolean({ message: 'isOpen deve ser um valor booleano (true ou false).' })
  isOpen?: boolean;

  /** Atualização dos critérios do funil (upsert). */
  @IsOptional()
  @ValidateNested({ message: 'Os critérios do funil devem ser um objeto válido.' })
  @Type(() => CriterioFunilDto)
  criteriosFunil?: CriterioFunilDto;
}
