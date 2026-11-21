import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import type { Prisma } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';

const HOLD_MS = 30 * 60 * 1000;
const MAX_TOTAL_AMOUNT = '99999999.99';

const summaryInclude = {
  experience: { select: { id: true, title: true, startsAt: true, isAvailable: true, capacity: true } },
  payments: { orderBy: [{ createdAt: 'desc' as const }, { id: 'desc' as const }], take: 1 },
} satisfies Prisma.BookingInclude;

type BookingSummary = Prisma.BookingGetPayload<{ include: typeof summaryInclude }>;

export function bookingDeadline(booking: { expiresAt: Date | null; createdAt: Date }): Date {
  return booking.expiresAt ?? new Date(booking.createdAt.getTime() + HOLD_MS);
}

export function assertBookingPending(booking: BookingSummary, now: Date) {
  if (booking.status === 'CONFIRMED') {
    throw new ConflictException({ code: 'BOOKING_NOT_PENDING', message: 'A reserva já foi paga.' });
  }
  if (bookingDeadline(booking) <= now) {
    throw new ConflictException({ code: 'BOOKING_EXPIRED', message: 'O prazo da reserva terminou.' });
  }
  if (booking.status !== 'PENDING') {
    throw new ConflictException({ code: 'BOOKING_NOT_PENDING', message: 'A reserva foi cancelada.' });
  }
}

function assertRevision(booking: BookingSummary, revision: number) {
  if (booking.revision !== revision) {
    throw new ConflictException({
      code: 'STALE_BOOKING_SUMMARY',
      message: 'A reserva foi atualizada. Revise os dados novamente.',
    });
  }
}

// A US08 deve adquirir este mesmo lock antes de conferir o saldo e gravar a reserva.
export async function lockExperience(tx: Prisma.TransactionClient, experienceId: string) {
  await tx.$queryRaw`SELECT id FROM Experiencia WHERE id = ${experienceId} FOR UPDATE`;
}

export async function countHeldSeats(tx: Prisma.TransactionClient, experienceId: string, now: Date) {
  const held = await tx.booking.aggregate({
    where: {
      experienceId,
      OR: [
        { status: 'CONFIRMED' },
        { status: 'PENDING', expiresAt: { gt: now } },
        { status: 'PENDING', expiresAt: null, createdAt: { gt: new Date(now.getTime() - HOLD_MS) } },
      ],
    },
    _sum: { seats: true },
  });
  return held._sum.seats ?? 0;
}

export async function findOwnedBooking(tx: Prisma.TransactionClient, id: string, userId: string) {
  const booking = await tx.booking.findFirst({ where: { id, userId }, include: summaryInclude });
  if (!booking) throw new NotFoundException('Reserva não encontrada.');
  return booking;
}

export async function lockOwnedBooking(tx: Prisma.TransactionClient, id: string, userId: string) {
  const booking = await tx.booking.findFirst({ where: { id, userId }, select: { experienceId: true } });
  if (!booking) throw new NotFoundException('Reserva não encontrada.');
  await lockExperience(tx, booking.experienceId);
  return findOwnedBooking(tx, id, userId);
}

function paymentDetails(payment: BookingSummary['payments'][number]) {
  return {
    id: payment.id,
    status: payment.status,
    method: payment.method,
    externalId: payment.externalId,
    paidAt: payment.paidAt,
  };
}

function bookingDetails(booking: BookingSummary) {
  const { id, title, startsAt } = booking.experience;
  return {
    experience: { id, title, startsAt },
    seats: booking.seats,
    unitAmount: booking.totalAmount.div(booking.seats).toFixed(2),
    totalAmount: booking.totalAmount.toFixed(2),
    currency: 'BRL',
  };
}

function summary(booking: BookingSummary) {
  const now = new Date();
  const active = booking.status === 'PENDING' && bookingDeadline(booking) > now;
  return {
    id: booking.id,
    ...bookingDetails(booking),
    conditions: ['Conclua o pagamento até o fim do prazo para garantir as vagas.'],
    status: booking.status,
    expiresAt: bookingDeadline(booking),
    isExpired: booking.status !== 'CONFIRMED' && bookingDeadline(booking) <= now,
    canEdit: active && booking.checkoutConfirmedAt === null,
    revision: booking.revision,
    checkoutConfirmedAt: booking.checkoutConfirmedAt,
    payment: booking.payments[0] ? paymentDetails(booking.payments[0]) : null,
  };
}

@Injectable()
export class ReservasService {
  constructor(private readonly prisma: PrismaService) {}

  async resumo(id: string, userId: string) {
    return summary(await findOwnedBooking(this.prisma, id, userId));
  }

  async alterarQuantidade(id: string, userId: string, seats: number, revision: number) {
    return this.prisma.$transaction(async (tx) => {
      const booking = await lockOwnedBooking(tx, id, userId);
      const now = new Date();
      assertBookingPending(booking, now);
      assertRevision(booking, revision);
      if (booking.checkoutConfirmedAt) {
        throw new ConflictException({
          code: 'BOOKING_NOT_EDITABLE',
          message: 'A reserva já foi confirmada para pagamento.',
        });
      }

      const extra = seats - booking.seats;
      if (extra === 0) return summary(booking);
      if (extra > 0) {
        await this.validateAdditionalSeats(tx, booking, extra, now);
      }

      const unitAmount = booking.totalAmount.div(booking.seats).toDecimalPlaces(2);
      const totalAmount = unitAmount.mul(seats);
      if (totalAmount.gt(MAX_TOTAL_AMOUNT)) {
        throw new ConflictException({
          code: 'BOOKING_TOTAL_EXCEEDS_LIMIT',
          message: 'O total da reserva excede o limite permitido.',
        });
      }

      const updated = await tx.booking.update({
        where: { id },
        data: { seats, totalAmount, revision: { increment: 1 } },
        include: summaryInclude,
      });
      return summary(updated);
    }, { isolationLevel: 'ReadCommitted' });
  }

  async confirmar(id: string, userId: string, revision: number) {
    return this.prisma.$transaction(async (tx) => {
      const booking = await lockOwnedBooking(tx, id, userId);
      const now = new Date();
      assertBookingPending(booking, now);
      assertRevision(booking, revision);
      if (booking.checkoutConfirmedAt) return summary(booking);
      if (booking.experience.startsAt <= now) {
        throw new ConflictException({
          code: 'EXPERIENCE_ALREADY_STARTED',
          message: 'A experiência já começou.',
        });
      }

      const updated = await tx.booking.update({
        where: { id },
        data: { checkoutConfirmedAt: now },
        include: summaryInclude,
      });
      return summary(updated);
    }, { isolationLevel: 'ReadCommitted' });
  }

  async comprovante(id: string, userId: string) {
    const booking = await findOwnedBooking(this.prisma, id, userId);
    const payment = booking.status === 'CONFIRMED' && await this.prisma.payment.findFirst({
      where: { bookingId: id, status: 'PAID' },
      orderBy: [{ paidAt: 'asc' }, { id: 'asc' }],
    });
    if (!payment) {
      throw new ConflictException({
        code: 'RECEIPT_UNAVAILABLE',
        message: 'O comprovante fica disponível após a aprovação do pagamento.',
      });
    }
    return {
      bookingId: booking.id,
      bookingStatus: booking.status,
      ...bookingDetails(booking),
      payment: paymentDetails(payment),
    };
  }

  private async validateAdditionalSeats(
    tx: Prisma.TransactionClient,
    booking: BookingSummary,
    extra: number,
    now: Date,
  ) {
    if (!booking.experience.isAvailable || booking.experience.startsAt <= now) {
      throw new ConflictException({
        code: 'EXPERIENCE_UNAVAILABLE',
        message: 'A experiência não está disponível para acrescentar vagas.',
      });
    }

    const held = await countHeldSeats(tx, booking.experienceId, now);
    if (booking.experience.capacity - held < extra) {
      throw new ConflictException({
        code: 'INSUFFICIENT_SEATS',
        message: 'Não há vagas suficientes para aumentar a reserva.',
      });
    }
  }
}
