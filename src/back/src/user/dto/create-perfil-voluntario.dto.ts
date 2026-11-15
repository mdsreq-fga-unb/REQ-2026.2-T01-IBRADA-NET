import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';
import { NivelEducacao, StatusEducacao } from './create-user.dto.js';

export class CreatePerfilVoluntarioDto {
  @IsString()
  @IsOptional()
  bio?: string;

  // Habilidades ou experiências que não estão na lista de categorias
  @IsString()
  @IsOptional()
  outros?: string;

  @IsEnum(NivelEducacao, { message: 'Nível de educação inválido.' })
  @IsOptional()
  educacaoNivel?: NivelEducacao;

  @IsEnum(StatusEducacao, { message: 'Situação da educação inválida.' })
  @IsOptional()
  educacaoCompletude?: StatusEducacao;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  categoriaIds?: string[];
}