import { IsEmail, IsNotEmpty, IsString, Matches, IsBoolean, IsOptional, IsEnum, IsArray } from 'class-validator';

//criei o Enum localmente refletindo o que está no banco
export enum UserRole {
  CLIENTE = 'CLIENTE',
  VOLUNTARIO = 'VOLUNTARIO',
  GESTOR = 'GESTOR',
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

  //usei o Enum local na validação
  @IsEnum(UserRole, { message: 'O papel deve ser CLIENTE, VOLUNTARIO ou GESTOR.' })
  @IsNotEmpty()
  role: UserRole;

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