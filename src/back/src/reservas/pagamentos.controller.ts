import { timingSafeEqual } from 'node:crypto';
import {
  Body, Controller, Headers, HttpCode, HttpStatus, Post, ServiceUnavailableException, UnauthorizedException,
} from '@nestjs/common';
import { Public } from '../auth/public.decorator.js';
import { PaymentWebhookDto } from './dto/reservas.dto.js';
import { PagamentosService } from './pagamentos.service.js';

@Controller('pagamentos')
export class PagamentosController {
  constructor(private readonly pagamentos: PagamentosService) {}

  @Public()
  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  webhook(@Headers('x-payment-webhook-secret') secret: string | undefined, @Body() event: PaymentWebhookDto) {
    const configuredSecret = process.env.PAYMENT_FAKE_WEBHOOK_SECRET;
    if (!configuredSecret) {
      throw new ServiceUnavailableException('O webhook simulado não está configurado.');
    }
    const expected = Buffer.from(configuredSecret);
    const received = Buffer.from(secret ?? '');
    if (expected.length !== received.length || !timingSafeEqual(expected, received)) {
      throw new UnauthorizedException('Credencial do webhook inválida.');
    }
    return this.pagamentos.processarWebhook(event);
  }
}
