import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { NivelEducacao, StatusEducacao } from './create-user.dto.js';

export class CreatePerfilVoluntarioDto {
  // Obrigatórios (US15): apresentação/disponibilidade e escolaridade.
  @IsString()
  @IsNotEmpty({ message: 'Informe sua apresentação, experiências e disponibilidade.' })
  bio: string;

  // Habilidades ou experiências que não estão na lista de categorias
  @IsString()
  @IsOptional()
  outros?: string;

  @IsEnum(NivelEducacao, { message: 'Informe um nível de escolaridade válido.' })
  educacaoNivel: NivelEducacao;

  @IsEnum(StatusEducacao, { message: 'Informe uma situação da formação válida.' })
  educacaoCompletude: StatusEducacao;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  categoriaIds?: string[];
}