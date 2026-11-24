import {
  BadRequestException,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ReservasService } from '../reservas.service.js';
import { ReservasScheduler } from '../reservas.scheduler.js';
import {
  AVISO_RETENCAO_VAGA,
  RESERVA_EXPIRACAO_MINUTOS,
  RESERVA_EXPIRACAO_MS,
} from '../reservas.constants.js';
import { BookingStatus } from '../../generated/prisma/enums.js';

const mockTx = {
  $queryRaw: vi.fn(),
  $executeRaw: vi.fn(),
  booking: {
    findMany: vi.fn(),
    updateMany: vi.fn(),
    create: vi.fn(),
  },
};

const mockPrisma = {
  user: {
    findUnique: vi.fn(),
  },
  booking: {
    findMany: vi.fn(),
  },
  $transaction: vi.fn(),
};

const resetMocks = () => {
  mockPrisma.user.findUnique.mockReset();
  mockPrisma.booking.findMany.mockReset();
  mockPrisma.$transaction.mockReset();
  mockTx.$queryRaw.mockReset();
  mockTx.$executeRaw.mockReset();
  mockTx.booking.findMany.mockReset();
  mockTx.booking.updateMany.mockReset();
  mockTx.booking.create.mockReset();
};

const futureStart = () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
const futureEnd = () => new Date(Date.now() + 8 * 24 * 60 * 60 * 1000);

describe('ReservasService e ReservasScheduler (US08)', () => {
  let service: ReservasService;

  beforeEach(() => {
    resetMocks();
    mockPrisma.$transaction.mockImplementation(
      async (callback: (tx: typeof mockTx) => Promise<unknown>) => callback(mockTx),
    );
    service = new ReservasService(mockPrisma as never);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('create', () => {
    it('deve criar reserva PENDING com transação ACID, cálculo exato em centavos e expiração de 30 min', async () => {
      const fixedNow = new Date('2026-12-01T12:00:00.000Z');
      vi.useFakeTimers();
      vi.setSystemTime(fixedNow);

      const startsAt = new Date('2026-12-10T08:00:00.000Z');
      const endsAt = new Date('2026-12-10T17:00:00.000Z');

      mockPrisma.user.findUnique.mockResolvedValue({ id: 'user-1' });
      mockTx.$queryRaw.mockResolvedValue([
        {
          id: 'exp-1',
          slug: 'trilha-cerrado',
          title: 'Trilha no Cerrado',
          price: '19.99',
          startsAt,
          endsAt,
          capacity: 10,
          availableSeats: 5,
          isAvailable: 1,
        },
      ]);
      mockTx.booking.findMany.mockResolvedValue([]);
      mockTx.$executeRaw.mockResolvedValue(1);

      const expectedExpiresAt = new Date(fixedNow.getTime() + RESERVA_EXPIRACAO_MS);
      mockTx.booking.create.mockResolvedValue({
        id: 'booking-1',
        userId: 'user-1',
        experienceId: 'exp-1',
        seats: 3,
        totalAmount: '59.97',
        status: BookingStatus.PENDING,
        expiresAt: expectedExpiresAt,
        createdAt: fixedNow,
      });

      const result = await service.create('user-1', {
        experienceId: 'exp-1',
        seats: 3,
      });

      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'user-1' },
        select: { id: true },
      });
      expect(mockPrisma.$transaction).toHaveBeenCalledTimes(1);
      expect(mockTx.$queryRaw).toHaveBeenCalledTimes(1);
      expect(mockTx.$executeRaw).toHaveBeenCalledTimes(1);
      expect(mockTx.booking.create).toHaveBeenCalledWith({
        data: {
          userId: 'user-1',
          experienceId: 'exp-1',
          seats: 3,
          totalAmount: '59.97',
          status: BookingStatus.PENDING,
          expiresAt: expectedExpiresAt,
        },
      });

      expect(result.aviso).toBe(AVISO_RETENCAO_VAGA);
      expect(result.data.id).toBe('booking-1');
      expect(result.data.status).toBe(BookingStatus.PENDING);
      expect(result.data.totalAmount).toBe(59.97);
      expect(result.data.totalAmountDecimal).toBe('59.97');
      expect(result.data.totalAmountCents).toBe(5997);
      expect(result.data.totalAmountFormatted).toBe('R$ 59,97');
      expect(result.data.retentionMinutes).toBe(RESERVA_EXPIRACAO_MINUTOS);
      expect(result.data.expiresAt).toEqual(expectedExpiresAt);
      expect(result.data.experience.availableSeats).toBe(2);
    });

    it('deve liberar reservas PENDING vencidas dentro do mesmo lock antes de validar vagas', async () => {
      const fixedNow = new Date('2026-12-01T12:00:00.000Z');
      vi.useFakeTimers();
      vi.setSystemTime(fixedNow);

      mockPrisma.user.findUnique.mockResolvedValue({ id: 'user-2' });
      mockTx.$queryRaw.mockResolvedValue([
        {
          id: 'exp-1',
          slug: 'trilha-cerrado',
          title: 'Trilha no Cerrado',
          price: '100.00',
          startsAt: new Date('2026-12-10T08:00:00.000Z'),
          endsAt: new Date('2026-12-10T17:00:00.000Z'),
          capacity: 3,
          availableSeats: 0,
          isAvailable: true,
        },
      ]);
      mockTx.booking.findMany.mockResolvedValue([{ id: 'booking-vencida', seats: 2 }]);
      mockTx.booking.updateMany.mockResolvedValue({ count: 1 });
      mockTx.$executeRaw.mockResolvedValue(1);
      mockTx.booking.create.mockResolvedValue({
        id: 'booking-nova',
        userId: 'user-2',
        experienceId: 'exp-1',
        seats: 2,
        totalAmount: '200.00',
        status: BookingStatus.PENDING,
        expiresAt: new Date(fixedNow.getTime() + RESERVA_EXPIRACAO_MS),
        createdAt: fixedNow,
      });

      const result = await service.create('user-2', {
        experienceId: 'exp-1',
        seats: 2,
      });

      expect(mockTx.booking.updateMany).toHaveBeenCalledWith({
        where: {
          id: { in: ['booking-vencida'] },
          status: BookingStatus.PENDING,
        },
        data: {
          status: BookingStatus.CANCELED,
        },
      });
      // 1a chamada restaura as 2 vagas vencidas; 2a chamada debita as 2 vagas da nova reserva
      expect(mockTx.$executeRaw).toHaveBeenCalledTimes(2);
      expect(result.data.id).toBe('booking-nova');
      expect(result.data.experience.availableSeats).toBe(0);
    });

    it('deve lançar UnauthorizedException quando usuário autenticado não existir no banco', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(
        service.create('user-inexistente', { experienceId: 'exp-1', seats: 1 }),
      ).rejects.toBeInstanceOf(UnauthorizedException);

      expect(mockPrisma.$transaction).not.toHaveBeenCalled();
    });

    it('deve lançar NotFoundException quando experiência não existir', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ id: 'user-1' });
      mockTx.$queryRaw.mockResolvedValue([]);

      await expect(
        service.create('user-1', { experienceId: 'exp-inexistente', seats: 1 }),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it('deve lançar BadRequestException quando experiência estiver indisponível (isAvailable=false/0)', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ id: 'user-1' });
      mockTx.$queryRaw.mockResolvedValue([
        {
          id: 'exp-1',
          slug: 'trilha',
          title: 'Trilha',
          price: '100.00',
          startsAt: futureStart(),
          endsAt: futureEnd(),
          capacity: 10,
          availableSeats: 10,
          isAvailable: 0,
        },
      ]);
      mockTx.booking.findMany.mockResolvedValue([]);

      await expect(
        service.create('user-1', { experienceId: 'exp-1', seats: 1 }),
      ).rejects.toThrow(BadRequestException);
      expect(mockTx.booking.create).not.toHaveBeenCalled();
    });

    it('deve lançar BadRequestException quando período da experiência for inválido (endsAt <= startsAt)', async () => {
      const data = futureStart();
      mockPrisma.user.findUnique.mockResolvedValue({ id: 'user-1' });
      mockTx.$queryRaw.mockResolvedValue([
        {
          id: 'exp-1',
          slug: 'trilha',
          title: 'Trilha',
          price: '100.00',
          startsAt: data,
          endsAt: data,
          capacity: 10,
          availableSeats: 10,
          isAvailable: true,
        },
      ]);
      mockTx.booking.findMany.mockResolvedValue([]);

      await expect(
        service.create('user-1', { experienceId: 'exp-1', seats: 1 }),
      ).rejects.toThrow(BadRequestException);
    });

    it('deve lançar BadRequestException quando experiência já iniciou ou está no passado', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ id: 'user-1' });
      mockTx.$queryRaw.mockResolvedValue([
        {
          id: 'exp-1',
          slug: 'trilha-passada',
          title: 'Trilha Passada',
          price: '100.00',
          startsAt: new Date(Date.now() - 60_000),
          endsAt: futureEnd(),
          capacity: 10,
          availableSeats: 10,
          isAvailable: true,
        },
      ]);
      mockTx.booking.findMany.mockResolvedValue([]);

      await expect(
        service.create('user-1', { experienceId: 'exp-1', seats: 1 }),
      ).rejects.toThrow(BadRequestException);
    });

    it('deve lançar ConflictException quando não houver nenhuma vaga disponível', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ id: 'user-1' });
      mockTx.$queryRaw.mockResolvedValue([
        {
          id: 'exp-1',
          slug: 'trilha-lotada',
          title: 'Trilha Lotada',
          price: '100.00',
          startsAt: futureStart(),
          endsAt: futureEnd(),
          capacity: 10,
          availableSeats: 0,
          isAvailable: true,
        },
      ]);
      mockTx.booking.findMany.mockResolvedValue([]);

      await expect(
        service.create('user-1', { experienceId: 'exp-1', seats: 1 }),
      ).rejects.toThrow('Não há vagas disponíveis para esta experiência.');
      expect(mockTx.booking.create).not.toHaveBeenCalled();
    });

    it('deve lançar ConflictException com saldo detalhado quando faltar vaga suficiente', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ id: 'user-1' });
      mockTx.$queryRaw.mockResolvedValue([
        {
          id: 'exp-1',
          slug: 'trilha-quase-lotada',
          title: 'Trilha Quase Lotada',
          price: '100.00',
          startsAt: futureStart(),
          endsAt: futureEnd(),
          capacity: 10,
          availableSeats: 2,
          isAvailable: true,
        },
      ]);
      mockTx.booking.findMany.mockResolvedValue([]);

      await expect(
        service.create('user-1', { experienceId: 'exp-1', seats: 4 }),
      ).rejects.toThrow('Vagas insuficientes para esta experiência. Solicitado: 4, disponível: 2.');
      expect(mockTx.booking.create).not.toHaveBeenCalled();
    });

    it('deve lançar ConflictException se update condicional afetar 0 linhas', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ id: 'user-1' });
      mockTx.$queryRaw.mockResolvedValue([
        {
          id: 'exp-1',
          slug: 'trilha',
          title: 'Trilha',
          price: '100.00',
          startsAt: futureStart(),
          endsAt: futureEnd(),
          capacity: 10,
          availableSeats: 2,
          isAvailable: true,
        },
      ]);
      mockTx.booking.findMany.mockResolvedValue([]);
      mockTx.$executeRaw.mockResolvedValue(0);

      await expect(
        service.create('user-1', { experienceId: 'exp-1', seats: 1 }),
      ).rejects.toBeInstanceOf(ConflictException);
      expect(mockTx.booking.create).not.toHaveBeenCalled();
    });
  });

  describe('cancelarReservasExpiradas', () => {
    it('deve retornar zeros sem abrir transação quando não houver reservas vencidas', async () => {
      mockPrisma.booking.findMany.mockResolvedValue([]);

      const result = await service.cancelarReservasExpiradas();

      expect(result).toEqual({ canceledCount: 0, restoredSeats: 0 });
      expect(mockPrisma.$transaction).not.toHaveBeenCalled();
    });

    it('deve cancelar reservas expiradas e devolver vagas com lock na Experiência', async () => {
      const now = new Date('2026-12-01T12:35:00.000Z');
      mockPrisma.booking.findMany.mockResolvedValue([
        { experienceId: 'exp-1' },
        { experienceId: 'exp-2' },
      ]);

      mockTx.$queryRaw
        .mockResolvedValueOnce([{ id: 'exp-1' }])
        .mockResolvedValueOnce([{ id: 'exp-2' }]);
      mockTx.booking.findMany
        .mockResolvedValueOnce([
          { id: 'b-1', seats: 2 },
          { id: 'b-2', seats: 1 },
        ])
        .mockResolvedValueOnce([{ id: 'b-3', seats: 4 }]);
      mockTx.booking.updateMany
        .mockResolvedValueOnce({ count: 2 })
        .mockResolvedValueOnce({ count: 1 });
      mockTx.$executeRaw.mockResolvedValue(1);

      const result = await service.cancelarReservasExpiradas(now);

      expect(result).toEqual({ canceledCount: 3, restoredSeats: 7 });
      expect(mockPrisma.$transaction).toHaveBeenCalledTimes(2);
      expect(mockTx.booking.updateMany).toHaveBeenNthCalledWith(1, {
        where: { id: { in: ['b-1', 'b-2'] }, status: BookingStatus.PENDING },
        data: { status: BookingStatus.CANCELED },
      });
      expect(mockTx.$executeRaw).toHaveBeenCalledTimes(2);
    });

    it('deve continuar processando outras experiências se uma transação falhar', async () => {
      mockPrisma.booking.findMany.mockResolvedValue([
        { experienceId: 'exp-erro' },
        { experienceId: 'exp-ok' },
      ]);
      mockPrisma.$transaction
        .mockRejectedValueOnce(new Error('lock timeout'))
        .mockImplementationOnce(
          async (callback: (tx: typeof mockTx) => Promise<unknown>) => callback(mockTx),
        );
      mockTx.$queryRaw.mockResolvedValueOnce([{ id: 'exp-ok' }]);
      mockTx.booking.findMany.mockResolvedValueOnce([{ id: 'b-ok', seats: 2 }]);
      mockTx.booking.updateMany.mockResolvedValueOnce({ count: 1 });
      mockTx.$executeRaw.mockResolvedValue(1);

      const result = await service.cancelarReservasExpiradas();

      expect(result).toEqual({ canceledCount: 1, restoredSeats: 2 });
    });
  });

  describe('ReservasScheduler', () => {
    it('deve chamar cancelarReservasExpiradas e evitar execuções sobrepostas', async () => {
      let releaseFirst!: () => void;
      const firstRunPromise = new Promise<{ canceledCount: number; restoredSeats: number }>(
        (resolve) => {
          releaseFirst = () => resolve({ canceledCount: 0, restoredSeats: 0 });
        },
      );

      const cancelarMock = vi
        .fn()
        .mockReturnValueOnce(firstRunPromise)
        .mockResolvedValueOnce({ canceledCount: 1, restoredSeats: 1 });

      const scheduler = new ReservasScheduler({
        cancelarReservasExpiradas: cancelarMock,
      } as unknown as ReservasService);

      const p1 = scheduler.handleExpiredBookings();
      const p2 = scheduler.handleExpiredBookings();
      await p2;

      expect(cancelarMock).toHaveBeenCalledTimes(1);

      releaseFirst();
      await p1;

      await scheduler.handleExpiredBookings();
      expect(cancelarMock).toHaveBeenCalledTimes(2);
    });

    it('não deve propagar exceções se cancelarReservasExpiradas falhar', async () => {
      const cancelarMock = vi.fn().mockRejectedValue(new Error('erro de conexão'));
      const scheduler = new ReservasScheduler({
        cancelarReservasExpiradas: cancelarMock,
      } as unknown as ReservasService);

      await expect(scheduler.handleExpiredBookings()).resolves.toBeUndefined();
    });
  });
});
