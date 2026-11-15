import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateCategoriaDto {
  @Transform(({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim() : value))
  @IsString({ message: 'O nome da categoria deve ser um texto.' })
  @IsNotEmpty({ message: 'Informe o nome da categoria.' })
  @MaxLength(100, { message: 'O nome da categoria deve ter no máximo 100 caracteres.' })
  nome: string;
}