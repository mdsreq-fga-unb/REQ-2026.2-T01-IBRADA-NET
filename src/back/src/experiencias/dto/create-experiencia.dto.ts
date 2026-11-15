import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ToCurrency } from '../decorators/to-currency.decorator.js';

export class CreateExperienciaDto {
  @IsString({ message: 'O título deve ser um texto válido.' })
  @IsNotEmpty({ message: 'O título da experiência é obrigatório.' })
  title: string;

  @IsString({ message: 'A descrição deve ser um texto válido.' })
  @IsNotEmpty({ message: 'A descrição da experiência é obrigatória.' })
  description: string;

  @IsString({ message: 'O roteiro deve ser um texto válido.' })
  @IsOptional()
  itinerary?: string;

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

  @IsBoolean({ message: 'A disponibilidade deve ser um valor booleano.' })
  @IsOptional()
  isAvailable?: boolean;
}
