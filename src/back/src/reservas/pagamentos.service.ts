import {
  ConflictException, Inject, Injectable, Logger, NotFoundException, ServiceUnavailableException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import type { PaymentWebhookDto } from './dto/reservas.dto.js';
import { PAYMENT_GATEWAY, type PaymentGateway } from './payment-gateway.js';
import { assertBookingPending, bookingDeadline, lockExperience, lockOwnedBooking } from './reservas.service.js';

@Injectable()
export class PagamentosService {
  private readonly logger = new Logger(PagamentosService.name);

  constructor(
    private readonly prisma: PrismaService,
    @Inject(PAYMENT_GATEWAY) private readonly gateway: PaymentGateway,
  ) {}

  async iniciar(id: string, userId: string) {
    if (this.gateway.provider === 'fake' && !process.env.PAYMENT_FAKE_WEBHOOK_SECRET) {
      throw new ServiceUnavailableException('O pagamento simulado não está configurado.');
    }

    const payment = await this.prisma.$transaction(async (tx) => {
      const booking = await lockOwnedBooking(tx, id, userId);
      assertBookingPending(booking, new Date());
      if (!booking.checkoutConfirmedAt) {
        throw new ConflictException({
          code: 'CHECKOUT_NOT_CONFIRMED',
          message: 'Confirme os dados da reserva antes de pagar.',
        });
      }

      const pending = await tx.payment.findFirst({
        where: { bookingId: id, status: 'PENDING', provider: this.gateway.provider },
      });
      if (pending) return pending;
      return tx.payment.create({
        data: { bookingId: id, amount: booking.totalAmount, method: 'FAKE', provider: this.gateway.provider },
      });
    }, { isolationLevel: 'ReadCommitted' });

    if (payment.externalId) {
      return {
        paymentId: payment.id,
        status: await this.gateway.consultarStatus(payment.externalId),
        checkoutUrl: payment.checkoutUrl ?? undefined,
      };
    }

    // Repetições após timeout usam a mesma tentativa local e a mesma chave no provedor.
    const charge = await this.gateway.criarCobranca({
      bookingId: id,
      amount: payment.amount.toFixed(2),
      currency: 'BRL',
      idempotencyKey: payment.id,
    });
    const registered = await this.prisma.payment.update({
      where: { id: payment.id },
      data: { externalId: charge.externalId, checkoutUrl: charge.checkoutUrl ?? null },
    });
    return { paymentId: registered.id, status: registered.status, checkoutUrl: charge.checkoutUrl };
  }

  async processarWebhook(event: PaymentWebhookDto) {
    const result = await this.prisma.$transaction(async (tx) => {
      const key = { provider: event.provider, eventId: event.eventId };
      if (await tx.paymentWebhookEvent.findUnique({ where: { provider_eventId: key } })) {
        return 'duplicate';
      }

      const payment = await tx.payment.findUnique({
        where: { provider_externalId: { provider: event.provider, externalId: event.externalId } },
        select: { id: true, booking: { select: { experienceId: true } } },
      });
      if (!payment) throw new NotFoundException('Cobrança não encontrada.');

      await lockExperience(tx, payment.booking.experienceId);
      const current = await tx.payment.findUniqueOrThrow({
        where: { id: payment.id },
        include: { booking: true },
      });
      if (!current.amount.eq(event.amount) || !current.booking.totalAmount.eq(event.amount)) {
        throw new ConflictException('O valor do evento diverge do valor da reserva.');
      }

      // A chave única também protege contra entregas paralelas com o mesmo identificador.
      const inserted = await tx.paymentWebhookEvent.createMany({ data: [key], skipDuplicates: true });
      if (inserted.count === 0) return 'duplicate';
      if (current.status !== 'PENDING' || event.status === 'PENDING') return 'ignored';

      const now = new Date();
      const booking = current.booking;
      const approved = event.status === 'PAID';
      const activeCheckout = booking.status === 'PENDING'
        && booking.checkoutConfirmedAt !== null && bookingDeadline(booking) > now;

      await tx.payment.update({
        where: { id: current.id },
        data: { status: event.status, paidAt: approved ? new Date(event.occurredAt) : null },
      });
      if (booking.status === 'PENDING') {
        await tx.booking.update({
          where: { id: booking.id },
          data: { status: approved && activeCheckout ? 'CONFIRMED' : 'CANCELED' },
        });
      }
      return approved && !activeCheckout ? 'reconciliation_required' : 'processed';
    }, { isolationLevel: 'ReadCommitted' });

    if (result === 'reconciliation_required') {
      this.logger.warn('Pagamento aprovado fora do checkout ativo. Evento para conciliação: ' + event.eventId);
    }
    return { result };
  }
}
