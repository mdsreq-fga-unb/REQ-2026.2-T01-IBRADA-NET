import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

// Remove espaços nas pontas: "   " vira "" e é barrado pelo IsNotEmpty.
const trim = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;

// Campo opcional: texto vazio ou só espaços equivale a não informado.
const trimOuIgnora = ({ value }: { value: unknown }) => {
  if (typeof value !== 'string') return value;
  const limpo = value.trim();
  return limpo === '' ? undefined : limpo;
};

// Limite das colunas VARCHAR(191) do banco.
const MAX_CAMPO = 191;
const MAX_PROPOSTA = 5000;

export class CreatePedidoParceriaDto {
  // === Identificação da Organização ===
  @Transform(trim)
  @IsString({ message: 'A razão social ou nome da instituição deve ser um texto.' })
  @IsNotEmpty({ message: 'A razão social ou nome da instituição é obrigatória.' })
  @MaxLength(MAX_CAMPO, { message: `O nome da instituição deve ter no máximo ${MAX_CAMPO} caracteres.` })
  organization: string;

  @Transform(trimOuIgnora)
  @IsOptional()
  @IsString({ message: 'O CNPJ deve ser um texto.' })
  @Matches(/^\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2}$/, {
    message: 'O CNPJ deve ter 14 dígitos (ex.: 12.345.678/0001-90).',
  })
  cnpj?: string;

  // === Contato da organização ===
  @Transform(trim)
  @IsEmail({}, { message: 'O e-mail de contato institucional deve ser válido.' })
  @IsNotEmpty({ message: 'O e-mail de contato é obrigatório.' })
  @MaxLength(MAX_CAMPO, { message: `O e-mail deve ter no máximo ${MAX_CAMPO} caracteres.` })
  contactEmail: string;

  @Transform(trimOuIgnora)
  @IsOptional()
  @IsString({ message: 'O telefone de contato deve ser um texto.' })
  @MaxLength(MAX_CAMPO, { message: `O telefone deve ter no máximo ${MAX_CAMPO} caracteres.` })
  contactPhone?: string;

  // === Identificação do Representante ===
  @Transform(trim)
  @IsString({ message: 'O nome do responsável deve ser um texto.' })
  @IsNotEmpty({ message: 'O nome do responsável é obrigatório.' })
  @MaxLength(MAX_CAMPO, { message: `O nome do responsável deve ter no máximo ${MAX_CAMPO} caracteres.` })
  contactName: string;

  // === Proposta / Texto Livre (US19) ===
  @Transform(trim)
  @IsString({ message: 'A descrição da proposta deve ser um texto.' })
  @IsNotEmpty({ message: 'A proposta de parceria (texto livre) é obrigatória.' })
  @MaxLength(MAX_PROPOSTA, { message: `A proposta deve ter no máximo ${MAX_PROPOSTA} caracteres.` })
  proposal: string;
}
