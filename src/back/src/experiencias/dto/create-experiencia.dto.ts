import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsDateString,
  IsDefined,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ToCurrency } from '../decorators/to-currency.decorator.js';

export const BIOMAS = ['Cerrado', 'Amazônia', 'Caatinga', 'Mata Atlântica', 'Pantanal', 'Pampa'] as const;
export const DIFICULDADES = ['LEVE', 'MODERADA', 'INTENSA'] as const;

export class CreateExperienciaDto {
  @IsString({ message: 'O título deve ser um texto válido.' })
  @IsNotEmpty({ message: 'O título do pacote é obrigatório.' })
  title: string;

  @IsString({ message: 'A descrição deve ser um texto válido.' })
  @IsNotEmpty({ message: 'A descrição do pacote é obrigatória.' })
  description: string;

  @IsString({ message: 'O roteiro deve ser um texto válido.' })
  @IsNotEmpty({ message: 'O roteiro do pacote é obrigatório.' })
  itinerary: string;

  /**
   * Preço monetário protegido contra imprecisões do IEEE 754.
   * Aceita number (150.50), string ("150.50" ou "150,50").
   * É normalizado para string decimal exata (ex: "150.50")
   * compatível com a coluna DECIMAL(10, 2) do Prisma e MySQL/MariaDB.
   */
  @ToCurrency()
  price: string | number;

  @IsDateString({}, { message: 'A data de início deve ser uma data válida no formato ISO 8601.' })
  @IsNotEmpty({ message: 'A data de início é obrigatória.' })
  startsAt: string;

  @IsDateString({}, { message: 'A data de término deve ser uma data válida no formato ISO 8601.' })
  @IsNotEmpty({ message: 'A data de término é obrigatória.' })
  endsAt: string;

  @Type(() => Number)
  @IsInt({ message: 'A capacidade deve ser um número inteiro.' })
  @Min(1, { message: 'A capacidade deve ser de no mínimo 1 vaga.' })
  capacity: number;

  @IsBoolean({ message: 'A disponibilidade deve ser um valor booleano (true ou false).' })
  @IsDefined({ message: 'A disponibilidade do pacote é obrigatória.' })
  isAvailable: boolean;

  /** Local de atuação (ex.: "Planaltina/DF"). */
  @IsString({ message: 'O local deve ser um texto válido.' })
  @IsNotEmpty({ message: 'O local do pacote é obrigatório.' })
  @MaxLength(191, { message: 'O local deve ter no máximo 191 caracteres.' })
  location: string;

  @IsString({ message: 'A comunidade deve ser um texto válido.' })
  @IsNotEmpty({ message: 'A comunidade anfitriã é obrigatória.' })
  @MaxLength(191, { message: 'A comunidade deve ter no máximo 191 caracteres.' })
  community: string;

  @IsIn(BIOMAS, { message: `O bioma deve ser um destes: ${BIOMAS.join(', ')}.` })
  biome: string;

  @IsIn(DIFICULDADES, { message: `A dificuldade deve ser: ${DIFICULDADES.join(', ')}.` })
  difficulty: string;

  @IsString({ message: 'O ponto de encontro deve ser um texto válido.' })
  @IsNotEmpty({ message: 'O ponto de encontro é obrigatório.' })
  @MaxLength(191, { message: 'O ponto de encontro deve ter no máximo 191 caracteres.' })
  meetingPoint: string;

  @IsString({ message: 'O horário de encontro deve ser um texto válido.' })
  @IsNotEmpty({ message: 'O horário de encontro é obrigatório.' })
  @MaxLength(191, { message: 'O horário de encontro deve ter no máximo 191 caracteres.' })
  meetingTime: string;

  /** O que está incluso no pacote (um item por posição da lista). */
  @IsArray({ message: 'Os itens inclusos devem ser enviados como uma lista.' })
  @ArrayMinSize(1, { message: 'Informe ao menos um item incluso no pacote.' })
  @ArrayMaxSize(30, { message: 'Informe no máximo 30 itens inclusos.' })
  @IsString({ each: true, message: 'Cada item incluso deve ser um texto.' })
  @IsNotEmpty({ each: true, message: 'Os itens inclusos não podem ser vazios.' })
  includedItems: string[];

  @IsOptional()
  @IsArray({ message: 'As regras devem ser enviadas como uma lista.' })
  @ArrayMaxSize(30, { message: 'Informe no máximo 30 regras.' })
  @IsString({ each: true, message: 'Cada regra deve ser um texto.' })
  @IsNotEmpty({ each: true, message: 'As regras não podem ser vazias.' })
  rules?: string[];

  @IsOptional()
  @IsArray({ message: 'As recomendações de vestuário devem ser enviadas como uma lista.' })
  @ArrayMaxSize(30, { message: 'Informe no máximo 30 recomendações.' })
  @IsString({ each: true, message: 'Cada recomendação deve ser um texto.' })
  @IsNotEmpty({ each: true, message: 'As recomendações não podem ser vazias.' })
  clothingTips?: string[];

  @IsOptional()
  @IsString({ message: 'O impacto na comunidade deve ser um texto válido.' })
  communityImpact?: string;

  @IsOptional()
  @IsString({ message: 'O nome do guia deve ser um texto válido.' })
  @MaxLength(191, { message: 'O nome do guia deve ter no máximo 191 caracteres.' })
  guideName?: string;

  @IsOptional()
  @IsString({ message: 'A função do guia deve ser um texto válido.' })
  @MaxLength(191, { message: 'A função do guia deve ter no máximo 191 caracteres.' })
  guideRole?: string;

  /** Máximo de pessoas por reserva (padrão 6). */
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'O máximo por reserva deve ser um número inteiro.' })
  @Min(1, { message: 'O máximo por reserva deve ser de no mínimo 1 pessoa.' })
  @Max(50, { message: 'O máximo por reserva deve ser de no máximo 50 pessoas.' })
  maxPerBooking?: number;

  /**
   * Fotos de divulgação (URLs). Todo pacote publicado tem fotos (US11, validado com o cliente);
   * a primeira é a capa.
   */
  @IsArray({ message: 'As fotos devem ser enviadas como uma lista de links.' })
  @ArrayMinSize(1, { message: 'Informe ao menos uma foto de divulgação do pacote.' })
  @ArrayMaxSize(20, { message: 'Envie no máximo 20 fotos por pacote.' })
  @IsUrl({ require_protocol: true, protocols: ['http', 'https'] }, { each: true, message: 'Cada foto deve ser um link válido (http ou https).' })
  photos: string[];

  /** Vídeos de divulgação (URLs), opcionais. */
  @IsOptional()
  @IsArray({ message: 'Os vídeos devem ser enviados como uma lista de links.' })
  @ArrayMaxSize(5, { message: 'Envie no máximo 5 vídeos por pacote.' })
  @IsUrl({ require_protocol: true, protocols: ['http', 'https'] }, { each: true, message: 'Cada vídeo deve ser um link válido (http ou https).' })
  videos?: string[];
}
