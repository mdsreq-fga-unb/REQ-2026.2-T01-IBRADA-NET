import { IsString, IsOptional, IsArray, IsEnum, IsDateString, IsNotEmpty } from 'class-validator';
import { NivelEducacao, StatusEducacao } from './create-user.dto.js';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsDateString({ strict: true }, { message: 'Informe uma data de nascimento válida (AAAA-MM-DD).' })
  @IsOptional()
  dataNascimento?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  cidade?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  estado?: string;

  // Campos de voluntário (PerfilVoluntario)
  @IsString()
  @IsOptional()
  bio?: string;

  @IsString()
  @IsOptional()
  outros?: string;

  @IsOptional()
  @IsEnum(NivelEducacao, { message: 'Nível de educação inválido.' })
  educacaoNivel?: NivelEducacao;

  @IsOptional()
  @IsEnum(StatusEducacao, { message: 'Situação da educação inválida.' })
  educacaoCompletude?: StatusEducacao;

  // Substitui a lista de interesses (Categoria) pela enviada.
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  categoriaIds?: string[];
}
