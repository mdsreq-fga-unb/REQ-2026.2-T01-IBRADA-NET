import { IsIn, IsInt, IsISO8601, IsString, Matches, Max, MaxLength, Min } from 'class-validator';

export class ConfirmarReservaDto {
  @IsInt()
  @Min(1)
  @Max(2147483647)
  revision: number;
}

export class AlterarReservaDto extends ConfirmarReservaDto {
  @IsInt()
  @Min(1)
  @Max(2147483647)
  seats: number;
}

export class PaymentWebhookDto {
  @IsIn(['fake'])
  provider: 'fake';

  @IsString()
  @MaxLength(191)
  @Matches(/^[a-z0-9_-]+$/)
  eventId: string;

  @IsString()
  @MaxLength(191)
  @Matches(/^fake_[a-z0-9_-]+$/)
  externalId: string;

  @IsIn(['PENDING', 'PAID', 'FAILED'])
  status: 'PENDING' | 'PAID' | 'FAILED';

  @IsString()
  @Matches(/^\d{1,8}\.\d{2}$/)
  amount: string;

  @IsIn(['BRL'])
  currency: 'BRL';

  @IsISO8601({ strict: true, strictSeparator: true })
  @Matches(/(?:Z|[+-]\d{2}:\d{2})$/)
  occurredAt: string;
}
