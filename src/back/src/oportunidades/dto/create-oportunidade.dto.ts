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

// ---------------------------------------------------------------------------
// Sub-DTO: critérios objetivos do funil (ciclo 7, RN05)
// ---------------------------------------------------------------------------

/**
 * Tags de critérios que o gestor seleciona ao cadastrar a oportunidade.
 * Exemplos: "Experiência em campo", "Conhecimento em botânica", etc.
 */
export class CriterioFunilDto {
  /** Se `true`, apenas candidatos com `experienciaNaArea = true` passam no funil. */
  @IsOptional()
  @IsBoolean({ message: 'exigeExperiencia deve ser um booleano.' })
  exigeExperiencia?: boolean;

  /** Nível mínimo de educação exigido (ex.: GRADUACAO). */
  @IsOptional()
  @IsEnum(NivelEducacao, { message: 'educacaoMinima inválido. Valores aceitos: FUNDAMENTAL, MEDIO, GRADUACAO, POS_GRADUACAO, MESTRADO, DOUTORADO.' })
  educacaoMinima?: NivelEducacao;

  /**
   * Tags de habilidades específicas exigidas.
   * Ex.: ["Botânica", "Primeiros Socorros"]
   * No funil, cada tag será comparada (case-insensitive) com os interesses
   * e habilidades do perfil do candidato.
   */
  @IsOptional()
  @IsArray({ message: 'habilidadesExigidas deve ser um array de strings.' })
  @IsString({ each: true, message: 'Cada habilidade exigida deve ser um texto.' })
  habilidadesExigidas?: string[];
}

// ---------------------------------------------------------------------------
// DTO principal: criação de oportunidade (US13)
// ---------------------------------------------------------------------------

export class CreateOportunidadeDto {
  @IsString({ message: 'O título deve ser um texto válido.' })
  @IsNotEmpty({ message: 'O título da oportunidade é obrigatório.' })
  title: string;

  @IsString({ message: 'A descrição deve ser um texto válido.' })
  @IsNotEmpty({ message: 'A descrição da oportunidade é obrigatória.' })
  description: string;

  /** ID do projeto associado (obrigatório, US13). */
  @IsString({ message: 'O ID do projeto deve ser um texto válido.' })
  @IsNotEmpty({ message: 'O projeto associado é obrigatório.' })
  projetoId: string;

  /** ID da categoria / área de atuação. */
  @IsString({ message: 'O ID da categoria deve ser um texto válido.' })
  @IsNotEmpty({ message: 'A categoria da oportunidade é obrigatória.' })
  categoriaId: string;

  /** Duração estimada (texto livre). Ex.: "3 meses", "2 fins de semana". */
  @IsString({ message: 'A duração deve ser um texto válido.' })
  @IsNotEmpty({ message: 'A duração da oportunidade é obrigatória.' })
  duracao: string;

  /** Disponibilidade exigida. Ex.: "Manhãs", "Integral", "Fins de semana". */
  @IsString({ message: 'A disponibilidade deve ser um texto válido.' })
  @IsNotEmpty({ message: 'A disponibilidade da oportunidade é obrigatória.' })
  disponibilidade: string;

  /**
   * Habilidades requeridas (obrigatório, US13).
   * Array de strings; mínimo 1 habilidade.
   */
  @IsArray({ message: 'As habilidades devem ser informadas como um array de textos.' })
  @IsString({ each: true, message: 'Cada habilidade deve ser um texto.' })
  @ArrayMinSize(1, { message: 'Informe ao menos uma habilidade requerida.' })
  habilidades: string[];

  /** Atividades planejadas (US14). Opcional no cadastro. */
  @IsOptional()
  @IsString({ message: 'As atividades planejadas devem ser um texto válido.' })
  atividades?: string;

  /** Local de atuação (US14). */
  @IsOptional()
  @IsString({ message: 'O local de atuação deve ser um texto válido.' })
  localAtuacao?: string;

  /**
   * Status de publicação (US13 critério atualizado).
   * `true` = Publicada (visível na listagem pública US21).
   * `false` = Rascunho (não visível publicamente).
   * Padrão: `true`.
   */
  @IsOptional()
  @IsBoolean({ message: 'isOpen deve ser um valor booleano (true ou false).' })
  isOpen?: boolean;

  /**
   * Critérios do funil de seleção (ciclo 7, RN05).
   * O gestor seleciona tags de critérios objetivos no cadastro da oportunidade.
   * Opcional — se não informado, nenhuma filtragem automática é aplicada.
   */
  @IsOptional()
  @ValidateNested({ message: 'Os critérios do funil devem ser um objeto válido.' })
  @Type(() => CriterioFunilDto)
  criteriosFunil?: CriterioFunilDto;
}
