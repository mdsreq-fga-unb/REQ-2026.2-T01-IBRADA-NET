import { Injectable, NotFoundException } from '@nestjs/common';
import type { PaymentStatus } from '../generated/prisma/enums.js';
import { PrismaService } from '../prisma/prisma.service.js';

export const PAYMENT_GATEWAY = Symbol('PaymentGateway');

export interface PaymentGateway {
  readonly provider: string;
  criarCobranca(input: {
    bookingId: string;
    amount: string;
    currency: 'BRL';
    idempotencyKey: string;
  }): Promise<{ externalId: string; checkoutUrl?: string }>;
  consultarStatus(externalId: string): Promise<PaymentStatus>;
}

@Injectable()
export class FakePaymentGateway implements PaymentGateway {
  readonly provider = 'fake';

  constructor(private readonly prisma: PrismaService) {}

  criarCobranca(input: { idempotencyKey: string }) {
    return Promise.resolve({ externalId: 'fake_' + input.idempotencyKey });
  }

  async consultarStatus(externalId: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { provider_externalId: { provider: this.provider, externalId } },
      select: { status: true },
    });
    if (!payment) throw new NotFoundException('Cobrança simulada não encontrada.');
    return payment.status;
  }
}
