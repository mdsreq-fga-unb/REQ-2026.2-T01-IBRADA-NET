import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  IsBoolean,
  IsOptional,
  IsEnum,
  IsArray,
  IsDateString,
  Equals,
} from 'class-validator';

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

// Espelham os enums NivelEducacao / StatusEducacao do schema.prisma.
export enum NivelEducacao {
  FUNDAMENTAL = 'FUNDAMENTAL',
  MEDIO = 'MEDIO',
  GRADUACAO = 'GRADUACAO',
  POS_GRADUACAO = 'POS_GRADUACAO',
  MESTRADO = 'MESTRADO',
  DOUTORADO = 'DOUTORADO',
}

export enum StatusEducacao {
  COMPLETO = 'COMPLETO',
  EM_ANDAMENTO = 'EM_ANDAMENTO',
  INCOMPLETO = 'INCOMPLETO',
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

  // === Dados pessoais (US04) ===

  // Formato ISO "AAAA-MM-DD" (é o que o <input type="date"> envia).
  @IsDateString({ strict: true }, { message: 'Informe uma data de nascimento válida (AAAA-MM-DD).' })
  dataNascimento: string;

  @IsString()
  @IsNotEmpty({ message: 'Informe a cidade.' })
  cidade: string;

  @IsString()
  @IsNotEmpty({ message: 'Informe o estado.' })
  estado: string;

  // subtitui o enum local na validação pelo PublicUserRole
  // Opcional: sem papel, o cadastro é de CLIENTE (padrão do banco). GESTOR é rejeitado.
  @IsOptional()
  @IsEnum(PublicUserRole, { message: 'O papel deve ser apenas CLIENTE ou VOLUNTARIO.' })
  role?: PublicUserRole;

  @IsBoolean()
  @Equals(true, { message: 'É obrigatório aceitar os termos de uso (LGPD).' })
  lgpdAccepted: boolean;

  @IsString()
  @IsNotEmpty()
  lgpdVersion: string;

  // === Campos específicos para Voluntários (US15) ===
  // Só são gravados quando role = VOLUNTARIO (cria o PerfilVoluntario junto da conta).
  // TODO(front): a aba/tela de perfil de voluntário ainda não existe; hoje o front
  // cadastra só clientes. Estes campos já estão prontos para quando ela for criada.

  @IsString()
  @IsOptional()
  bio?: string;

  // Habilidades que não estão na lista de categorias.
  @IsString()
  @IsOptional()
  outros?: string;

  @IsOptional()
  @IsEnum(NivelEducacao, { message: 'Nível de educação inválido.' })
  educacaoNivel?: NivelEducacao;

  @IsOptional()
  @IsEnum(StatusEducacao, { message: 'Situação da educação inválida.' })
  educacaoCompletude?: StatusEducacao;

  // Ids de Categoria (interesses do voluntário).
  // TODO: criar GET /categorias para o front listar as opções.
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  categoriaIds?: string[];
}
