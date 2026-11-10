import { IsEmail, IsNotEmpty, IsString, Matches, IsBoolean, IsOptional, IsEnum, IsArray } from 'class-validator';

//criei o Enum localmente refletindo o que está no banco
export enum UserRole {
  CLIENTE = 'CLIENTE',
  VOLUNTARIO = 'VOLUNTARIO',
  GESTOR = 'GESTOR',
}

// Adicionei um Enum restrito apenas para o cadastro público, para evitar que qualquer pessoa
// consiga se cadastrar como GESTOR, que é um papel mais restrito.
export enum PublicUserRole {
  CLIENTE = 'CLIENTE',
  VOLUNTARIO = 'VOLUNTARIO',
}

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail({}, { message: 'Formato de email inválido.' })
  email: string;

  @IsString()
  @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/, {
    message: 'A senha deve ter no mínimo 8 caracteres, contendo 1 maiúscula, 1 número e 1 caractere especial.',
  })
  password: string;

  @IsString()
  @IsOptional()
  phone?: string;

  // subtitui o enum local na validação pelo PublicUserRole
  @IsEnum(PublicUserRole, { message: 'O papel deve ser apenas CLIENTE ou VOLUNTARIO.' })
  @IsNotEmpty()
  role: PublicUserRole;

  @IsBoolean()
  @IsNotEmpty({ message: 'É obrigatório aceitar os termos de uso (LGPD).' })
  lgpdAccepted: boolean;

  @IsString()
  @IsNotEmpty()
  lgpdVersion: string;

  // === Campos específicos para Voluntários (US15) ===
  
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