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
  experiencias?: string;

  @IsString()
  @IsOptional()
  interesses?: string;

  @IsString()
  @IsOptional()
  disponibilidade?: string;

  @IsString()
  @IsOptional()
  outros?: string;

  @IsArray()
  @IsOptional()
  habilidadeIds?: string[];
}