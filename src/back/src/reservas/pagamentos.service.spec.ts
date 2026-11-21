import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Prisma } from '../generated/prisma/client.js';
import type { PaymentWebhookDto } from './dto/reservas.dto.js';
import { PagamentosService } from './pagamentos.service.js';

describe('PagamentosService.processarWebhook', () => {
  const event: PaymentWebhookDto = {
    provider: 'fake', eventId: 'evt_01', externalId: 'fake_pay_01',
    status: 'PAID', amount: '240.00', currency: 'BRL', occurredAt: '2026-11-20T17:15:00Z',
  };
  const tx = {
    $queryRaw: vi.fn(),
    paymentWebhookEvent: { findUnique: vi.fn(), createMany: vi.fn() },
    payment: { findUnique: vi.fn(), findUniqueOrThrow: vi.fn(), update: vi.fn() },
    booking: { update: vi.fn() },
  };
  const service = new PagamentosService({
    $transaction: (run: (transaction: typeof tx) => Promise<unknown>) => run(tx),
  } as never, {} as never);
  const storedPayment = (expiresAt: Date) => ({
    id: 'payment-1', amount: new Prisma.Decimal('240'), status: 'PENDING',
    booking: {
      id: 'booking-1', status: 'PENDING', totalAmount: new Prisma.Decimal('240'),
      checkoutConfirmedAt: new Date(), createdAt: new Date(), expiresAt,
    },
  });

  beforeEach(() => {
    vi.resetAllMocks();
    tx.payment.findUnique.mockResolvedValue({ id: 'payment-1', booking: { experienceId: 'exp-1' } });
    tx.payment.findUniqueOrThrow.mockResolvedValue(storedPayment(new Date(Date.now() + 60_000)));
    tx.paymentWebhookEvent.createMany.mockResolvedValue({ count: 1 });
  });

  it('aprova pagamento e confirma a reserva', async () => {
    await expect(service.processarWebhook(event)).resolves.toEqual({ result: 'processed' });
    expect(tx.payment.update).toHaveBeenCalledWith({
      where: { id: 'payment-1' }, data: { status: 'PAID', paidAt: new Date(event.occurredAt) },
    });
    expect(tx.booking.update).toHaveBeenCalledWith({ where: { id: 'booking-1' }, data: { status: 'CONFIRMED' } });
  });

  it('cancela a reserva quando o pagamento é recusado definitivamente', async () => {
    await expect(service.processarWebhook({ ...event, status: 'FAILED' })).resolves.toEqual({ result: 'processed' });
    expect(tx.payment.update).toHaveBeenCalledWith({
      where: { id: 'payment-1' }, data: { status: 'FAILED', paidAt: null },
    });
    expect(tx.booking.update).toHaveBeenCalledWith({ where: { id: 'booking-1' }, data: { status: 'CANCELED' } });
  });

  it('não repete as atualizações quando outra entrega já registrou o evento', async () => {
    tx.paymentWebhookEvent.createMany.mockResolvedValue({ count: 0 });
    await expect(service.processarWebhook(event)).resolves.toEqual({ result: 'duplicate' });
    expect(tx.payment.update).not.toHaveBeenCalled();
    expect(tx.booking.update).not.toHaveBeenCalled();
  });

  it('sinaliza conciliação se a cobrança for aprovada após o prazo', async () => {
    tx.payment.findUniqueOrThrow.mockResolvedValue(storedPayment(new Date(0)));
    await expect(service.processarWebhook(event)).resolves.toEqual({ result: 'reconciliation_required' });
    expect(tx.booking.update).toHaveBeenCalledWith({ where: { id: 'booking-1' }, data: { status: 'CANCELED' } });
  });

  it('rejeita valor divergente sem registrar o evento', async () => {
    await expect(service.processarWebhook({ ...event, amount: '240.01' })).rejects.toThrow('valor do evento diverge');
    expect(tx.paymentWebhookEvent.createMany).not.toHaveBeenCalled();
    expect(tx.payment.update).not.toHaveBeenCalled();
  });
});
