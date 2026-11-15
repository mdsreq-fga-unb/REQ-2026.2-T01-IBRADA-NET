import { IsString, IsOptional, IsArray } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  // Campos de voluntário
  @IsString()
  @IsOptional()
  bio?: string;

  @IsString()
  @IsOptional()
  outros?: string; // habilidades que não estão na lista

  // Interesses do voluntário: ids de Categoria (tabela InteresseVoluntario).
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  categoriaIds?: string[];
}