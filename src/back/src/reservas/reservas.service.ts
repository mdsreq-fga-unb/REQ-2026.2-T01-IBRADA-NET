import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { BookingStatus } from '../generated/prisma/enums.js';
import {
  centsToDecimalString,
  centsToFormattedBrl,
  decimalStringToCents,
} from '../experiencias/utils/currency.util.js';
import { CreateReservaDto } from './dto/create-reserva.dto.js';
import {
  AVISO_RETENCAO_VAGA,
  RESERVA_EXPIRACAO_MINUTOS,
  RESERVA_EXPIRACAO_MS,
} from './reservas.constants.js';

interface LockedExperienciaRow {
  id: string;
  slug: string;
  title: string;
  price: string | number | { toString(): string };
  startsAt: Date | string;
  endsAt: Date | string;
  capacity: number | bigint;
  availableSeats: number | bigint;
  isAvailable: boolean | number | bigint;
}

type ReservaTxClient = Pick<PrismaService, 'booking' | '$executeRaw'>;

const TRANSACTION_OPTIONS = {
  maxWait: 10_000,
  timeout: 15_000,
} as const;

@Injectable()
export class ReservasService {
  private readonly logger = new Logger(ReservasService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * US08: Cria uma reserva em estado PENDING com retenção de 30 minutos (RF12 / RNF02).
   * Usa transação ACID com lock pessimista (SELECT ... FOR UPDATE) e débito condicional
   * para impedir overbooking sob alta concorrência.
   */
  async create(userId: string, dto: CreateReservaDto) {
    // Valida o usuário fora da transação para que o lock de linha na Experiência
    // seja a primeira operação do bloco ACID (evita snapshot antigo em REPEATABLE READ).
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!user) {
      throw new UnauthorizedException('Usuário autenticado não encontrado.');
    }

    const result = await this.prisma.$transaction(async (tx) => {
      const now = new Date();

      const rows = await tx.$queryRaw<LockedExperienciaRow[]>`
        SELECT id, slug, title, price, startsAt, endsAt, capacity, availableSeats, isAvailable
        FROM Experiencia
        WHERE id = ${dto.experienceId}
        FOR UPDATE
      `;
      const experiencia = rows[0];

      if (!experiencia) {
        throw new NotFoundException(`Experiência com ID '${dto.experienceId}' não encontrada.`);
      }

      const capacity = Number(experiencia.capacity);
      const { restoredSeats } = await this.liberarReservasExpiradasDaExperiencia(
        tx,
        experiencia.id,
        now,
      );
      const availableSeats = Math.min(
        capacity,
        Number(experiencia.availableSeats) + restoredSeats,
      );

      const isAvailable = Boolean(experiencia.isAvailable);
      if (!isAvailable) {
        throw new BadRequestException(
          'Esta experiência não está disponível para reservas no momento.',
        );
      }

      const startsAt =
        experiencia.startsAt instanceof Date
          ? experiencia.startsAt
          : new Date(experiencia.startsAt);
      const endsAt =
        experiencia.endsAt instanceof Date
          ? experiencia.endsAt
          : new Date(experiencia.endsAt);

      if (
        Number.isNaN(startsAt.getTime()) ||
        Number.isNaN(endsAt.getTime()) ||
        endsAt <= startsAt
      ) {
        throw new BadRequestException('A experiência possui um período de datas inválido.');
      }

      if (startsAt <= now) {
        throw new BadRequestException(
          'Não é possível reservar uma experiência com data passada ou já iniciada.',
        );
      }

      if (availableSeats <= 0) {
        throw new ConflictException('Não há vagas disponíveis para esta experiência.');
      }

      if (availableSeats < dto.seats) {
        throw new ConflictException(
          `Vagas insuficientes para esta experiência. Solicitado: ${dto.seats}, disponível: ${availableSeats}.`,
        );
      }

      const updatedRows = await tx.$executeRaw`
        UPDATE Experiencia
        SET availableSeats = availableSeats - ${dto.seats}
        WHERE id = ${experiencia.id}
          AND isAvailable = true
          AND availableSeats >= ${dto.seats}
      `;

      if (Number(updatedRows) !== 1) {
        throw new ConflictException(
          'Não foi possível reservar as vagas solicitadas. Verifique a disponibilidade atualizada.',
        );
      }

      const unitPriceCents = decimalStringToCents(String(experiencia.price));
      const totalAmountCents = unitPriceCents * dto.seats;
      const totalAmountDecimal = centsToDecimalString(totalAmountCents);
      const totalAmountFormatted = centsToFormattedBrl(totalAmountCents);
      const expiresAt = new Date(now.getTime() + RESERVA_EXPIRACAO_MS);

      const booking = await tx.booking.create({
        data: {
          userId,
          experienceId: experiencia.id,
          seats: dto.seats,
          totalAmount: totalAmountDecimal,
          status: BookingStatus.PENDING,
          expiresAt,
        },
      });

      const remainingSeats = availableSeats - dto.seats;

      return {
        message:
          'Reserva criada com sucesso! Conclua o pagamento em até 30 minutos para garantir sua vaga.',
        aviso: AVISO_RETENCAO_VAGA,
        data: {
          id: booking.id,
          userId: booking.userId,
          experienceId: booking.experienceId,
          seats: booking.seats,
          totalAmount: Number(booking.totalAmount),
          totalAmountDecimal,
          totalAmountCents,
          totalAmountFormatted,
          status: booking.status,
          expiresAt: booking.expiresAt,
          createdAt: booking.createdAt,
          retentionMinutes: RESERVA_EXPIRACAO_MINUTOS,
          experience: {
            id: experiencia.id,
            slug: experiencia.slug,
            title: experiencia.title,
            startsAt,
            endsAt,
            price: Number(experiencia.price),
            priceDecimal: centsToDecimalString(unitPriceCents),
            priceCents: unitPriceCents,
            priceFormatted: centsToFormattedBrl(unitPriceCents),
            capacity,
            availableSeats: remainingSeats,
          },
        },
      };
    }, TRANSACTION_OPTIONS);

    this.logger.log(
      `Reserva ${result.data.id} criada como PENDING (${dto.seats} vaga(s)) para experiência ${dto.experienceId}`,
    );

    return result;
  }

  /**
   * Cancela reservas PENDING expiradas e devolve as vagas para cada experiência afetada.
   * Mantém a mesma ordem de lock (Experiencia -> Booking) de `create()` para evitar deadlocks.
   */
  async cancelarReservasExpiradas(
    now = new Date(),
  ): Promise<{ canceledCount: number; restoredSeats: number }> {
    const expiredExperiences = await this.prisma.booking.findMany({
      where: {
        status: BookingStatus.PENDING,
        expiresAt: { lte: now },
      },
      distinct: ['experienceId'],
      select: { experienceId: true },
    });

    if (expiredExperiences.length === 0) {
      return { canceledCount: 0, restoredSeats: 0 };
    }

    let totalCanceled = 0;
    let totalRestoredSeats = 0;

    for (const { experienceId } of expiredExperiences) {
      try {
        const outcome = await this.prisma.$transaction(async (tx) => {
          const locked = await tx.$queryRaw<Array<{ id: string }>>`
            SELECT id
            FROM Experiencia
            WHERE id = ${experienceId}
            FOR UPDATE
          `;

          if (locked.length === 0) {
            return { canceledCount: 0, restoredSeats: 0 };
          }

          return this.liberarReservasExpiradasDaExperiencia(tx, experienceId, now);
        }, TRANSACTION_OPTIONS);

        totalCanceled += outcome.canceledCount;
        totalRestoredSeats += outcome.restoredSeats;
      } catch (error) {
        this.logger.error(
          `Erro ao expirar reservas da experiência ${experienceId}: ${error instanceof Error ? error.message : String(error)}`,
        );
      }
    }

    if (totalCanceled > 0) {
      this.logger.log(
        `Expiração automática: ${totalCanceled} reserva(s) cancelada(s) e ${totalRestoredSeats} vaga(s) devolvida(s).`,
      );
    }

    return {
      canceledCount: totalCanceled,
      restoredSeats: totalRestoredSeats,
    };
  }

  /**
   * Deve ser chamado exclusivamente dentro de uma transação com lock FOR UPDATE na Experiência.
   */
  private async liberarReservasExpiradasDaExperiencia(
    tx: ReservaTxClient,
    experienceId: string,
    now: Date,
  ): Promise<{ canceledCount: number; restoredSeats: number }> {
    const expiredBookings = await tx.booking.findMany({
      where: {
        experienceId,
        status: BookingStatus.PENDING,
        expiresAt: { lte: now },
      },
      select: {
        id: true,
        seats: true,
      },
    });

    if (expiredBookings.length === 0) {
      return { canceledCount: 0, restoredSeats: 0 };
    }

    const expiredIds = expiredBookings.map((booking) => booking.id);
    const seatsToRestore = expiredBookings.reduce((sum, booking) => sum + booking.seats, 0);

    const updated = await tx.booking.updateMany({
      where: {
        id: { in: expiredIds },
        status: BookingStatus.PENDING,
      },
      data: {
        status: BookingStatus.CANCELED,
      },
    });

    if (updated.count === 0) {
      return { canceledCount: 0, restoredSeats: 0 };
    }

    await tx.$executeRaw`
      UPDATE Experiencia
      SET availableSeats = LEAST(capacity, availableSeats + ${seatsToRestore})
      WHERE id = ${experienceId}
    `;

    return {
      canceledCount: updated.count,
      restoredSeats: seatsToRestore,
    };
  }
}
