import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreatePedidoParceriaDto {
  // === Identificação da Organização ===
  @IsString({ message: 'A razão social ou nome da instituição deve ser um texto.' })
  @IsNotEmpty({ message: 'A razão social ou nome da instituição é obrigatória.' })
  organization: string;

  @IsString({ message: 'O CNPJ deve ser um texto.' })
  @IsOptional()
  cnpj?: string;

  @IsString({ message: 'O telefone de contato deve ser um texto.' })
  @IsOptional()
  contactPhone?: string;

  // === Identificação do Representante ===
  @IsString({ message: 'O nome do responsável deve ser um texto.' })
  @IsNotEmpty({ message: 'O nome do responsável é obrigatório.' })
  contactName: string;

  @IsEmail({}, { message: 'O e-mail de contato institucional deve ser válido.' })
  @IsNotEmpty({ message: 'O e-mail de contato é obrigatório.' })
  contactEmail: string;

  // === Proposta / Texto Livre (US19) ===
  @IsString({ message: 'A descrição da proposta deve ser um texto.' })
  @IsNotEmpty({ message: 'A proposta de parceria (texto livre) é obrigatória.' })
  proposal: string;
}
