import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  Matches,
  MaxLength,
  ValidateIf,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { NivelEducacao } from '../../user/dto/create-user.dto.js';

// ---------------------------------------------------------------------------
// Sub-DTO: critérios objetivos do funil (ciclo 7, RN05)
// ---------------------------------------------------------------------------

/**
 * Tags de critérios que o gestor seleciona ao cadastrar a oportunidade.
 * Exemplos: "Experiência em campo", "Conhecimento em botânica", etc.
 */
export class CriterioFunilDto {
  /** Se `true`, apenas candidatos com `experienciaNaArea = true` passam no funil. */
  @ValidateIf((_, value: unknown) => value !== undefined)
  @IsBoolean({ message: 'exigeExperiencia deve ser um booleano.' })
  exigeExperiencia?: boolean;

  /** Nível mínimo de educação exigido (ex.: GRADUACAO). */
  @ValidateIf((_, value: unknown) => value !== undefined)
  @IsEnum(NivelEducacao, { message: 'educacaoMinima inválido. Valores aceitos: FUNDAMENTAL, MEDIO, GRADUACAO, POS_GRADUACAO, MESTRADO, DOUTORADO.' })
  educacaoMinima?: NivelEducacao;

  /**
   * Tags de habilidades específicas exigidas.
   * Ex.: ["Botânica", "Primeiros Socorros"]
   * No funil, cada tag é comparada integralmente, sem diferenciar maiúsculas,
   * com as habilidades declaradas em `outros` (separadas por vírgula, ; ou quebra de linha).
   */
  @ValidateIf((_, value: unknown) => value !== undefined)
  @IsArray({ message: 'habilidadesExigidas deve ser um array de strings.' })
  @IsString({ each: true, message: 'Cada habilidade exigida deve ser um texto.' })
  @Matches(/\S/, { each: true, message: 'Habilidades não podem ser vazias.' })
  habilidadesExigidas?: string[];
}

// ---------------------------------------------------------------------------
// DTO principal: criação de oportunidade (US13)
// ---------------------------------------------------------------------------

export class CreateOportunidadeDto {
  @IsString({ message: 'O título deve ser um texto válido.' })
  @IsNotEmpty({ message: 'O título da oportunidade é obrigatório.' })
  @Matches(/\S/, { message: 'Informe um texto que não contenha apenas espaços.' })
  @MaxLength(191)
  title: string;

  @IsString({ message: 'A descrição deve ser um texto válido.' })
  @IsNotEmpty({ message: 'A descrição da oportunidade é obrigatória.' })
  @Matches(/\S/, { message: 'Informe um texto que não contenha apenas espaços.' })
  description: string;

  /** ID do projeto associado (obrigatório, US13). */
  @IsString({ message: 'O ID do projeto deve ser um texto válido.' })
  @IsNotEmpty({ message: 'O projeto associado é obrigatório.' })
  @Matches(/\S/, { message: 'Informe um texto que não contenha apenas espaços.' })
  @MaxLength(191)
  projetoId: string;

  /** ID da categoria / área de atuação. */
  @IsString({ message: 'O ID da categoria deve ser um texto válido.' })
  @IsNotEmpty({ message: 'A categoria da oportunidade é obrigatória.' })
  @Matches(/\S/, { message: 'Informe um texto que não contenha apenas espaços.' })
  @MaxLength(191)
  categoriaId: string;

  /** Duração estimada (texto livre). Ex.: "3 meses", "2 fins de semana". */
  @IsString({ message: 'A duração deve ser um texto válido.' })
  @IsNotEmpty({ message: 'A duração da oportunidade é obrigatória.' })
  @Matches(/\S/, { message: 'Informe um texto que não contenha apenas espaços.' })
  @MaxLength(191)
  duracao: string;

  /** Disponibilidade exigida. Ex.: "Manhãs", "Integral", "Fins de semana". */
  @IsString({ message: 'A disponibilidade deve ser um texto válido.' })
  @IsNotEmpty({ message: 'A disponibilidade da oportunidade é obrigatória.' })
  @Matches(/\S/, { message: 'Informe um texto que não contenha apenas espaços.' })
  @MaxLength(191)
  disponibilidade: string;

  /**
   * Habilidades requeridas (obrigatório, US13).
   * Array de strings; mínimo 1 habilidade.
   */
  @IsArray({ message: 'As habilidades devem ser informadas como um array de textos.' })
  @IsString({ each: true, message: 'Cada habilidade deve ser um texto.' })
  @Matches(/\S/, { each: true, message: 'Habilidades não podem ser vazias.' })
  @ArrayMinSize(1, { message: 'Informe ao menos uma habilidade requerida.' })
  habilidades: string[];

  /** Atividades planejadas (US14). Opcional no cadastro. */
  @ValidateIf((_, value: unknown) => value !== undefined)
  @IsString({ message: 'As atividades planejadas devem ser um texto válido.' })
  atividades?: string;

  /** Local de atuação (US14). */
  @ValidateIf((_, value: unknown) => value !== undefined)
  @IsString({ message: 'O local de atuação deve ser um texto válido.' })
  @MaxLength(191)
  localAtuacao?: string;

  /**
   * Status de publicação (US13 critério atualizado).
   * `true` = Publicada (visível na listagem pública US21).
   * `false` = Rascunho (não visível publicamente).
   * Padrão: `true`.
   */
  @ValidateIf((_, value: unknown) => value !== undefined)
  @IsBoolean({ message: 'isOpen deve ser um valor booleano (true ou false).' })
  isOpen?: boolean;

  /**
   * Critérios do funil de seleção (ciclo 7, RN05).
   * O gestor seleciona tags de critérios objetivos no cadastro da oportunidade.
   * Opcional — se não informado, nenhuma filtragem automática é aplicada.
   */
  @ValidateIf((_, value: unknown) => value !== undefined)
  @ValidateNested({ message: 'Os critérios do funil devem ser um objeto válido.' })
  @Type(() => CriterioFunilDto)
  criteriosFunil?: CriterioFunilDto;
}
