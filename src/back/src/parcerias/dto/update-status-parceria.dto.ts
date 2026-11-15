import { IsEnum, IsNotEmpty } from 'class-validator';

export enum PartnershipStatus {
  RECEIVED = 'RECEIVED',
  IN_ANALYSIS = 'IN_ANALYSIS',
  ACCEPTED = 'ACCEPTED',
  DECLINED = 'DECLINED',
}

export class UpdateStatusParceriaDto {
  @IsEnum(PartnershipStatus, {
    message: 'O status deve ser um dos seguintes: RECEIVED, IN_ANALYSIS, ACCEPTED, DECLINED.',
  })
  @IsNotEmpty({ message: 'O novo status da proposta é obrigatório.' })
  status: PartnershipStatus;
}
