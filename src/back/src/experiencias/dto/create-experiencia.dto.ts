import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsDateString,
  IsDefined,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ToCurrency } from '../decorators/to-currency.decorator.js';

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
