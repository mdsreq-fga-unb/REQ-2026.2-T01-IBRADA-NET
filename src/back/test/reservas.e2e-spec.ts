import { INestApplication, ValidationPipe } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import * as dotenv from 'dotenv';
import { AppModule } from '../src/app.module.js';
import { PrismaService } from '../src/prisma/prisma.service.js';
import { ReservasService } from '../src/reservas/reservas.service.js';
import { BookingStatus } from '../src/generated/prisma/enums.js';

dotenv.config();

// US08 ponta a ponta (HTTP + JWT guard + DTO + transação ACID + lock FOR UPDATE + expiração).
describe('ReservasController (e2e e concorrência)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let reservasService: ReservasService;
  let jwt: JwtService;

  const sufixo = Date.now();
  const createdUserIds: string[] = [];
  const createdExperienceIds: string[] = [];
  const concorrenteTokens: string[] = [];

  let primaryUserId: string;
  let primaryToken: string;

  const futureStart = (daysAhead = 15) =>
    new Date(Date.now() + daysAhead * 24 * 60 * 60 * 1000);
  const futureEnd = (daysAhead = 16) =>
    new Date(Date.now() + daysAhead * 24 * 60 * 60 * 1000);

  async function criarExperienciaTeste(opts: {
    slugSuffix: string;
    capacity: number;
    availableSeats?: number;
    isAvailable?: boolean;
    price?: string;
    startsAt?: Date;
    endsAt?: Date;
  }) {
    const exp = await prisma.experiencia.create({
      data: {
        slug: `reserva-e2e-${opts.slugSuffix}-${sufixo}`,
        title: `Pacote Reserva E2E ${opts.slugSuffix}`,
        description: 'Pacote criado para testes E2E da US08',
        itinerary: 'Saída pela manhã e trilha guiada',
        price: opts.price ?? '150.50',
        startsAt: opts.startsAt ?? futureStart(),
        endsAt: opts.endsAt ?? futureEnd(),
        capacity: opts.capacity,
        availableSeats: opts.availableSeats ?? opts.capacity,
        isAvailable: opts.isAvailable ?? true,
      },
    });
    createdExperienceIds.push(exp.id);
    return exp;
  }

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
    );
    await app.init();

    prisma = app.get(PrismaService);
    reservasService = app.get(ReservasService);
    jwt = app.get(JwtService);

    for (let i = 0; i < 10; i++) {
      const user = await prisma.user.create({
        data: {
          name: `Cliente Reserva E2E ${i}`,
          email: `cliente-reserva-${i}-${sufixo}@e2e.com`,
          passwordHash: 'hash-e2e',
          role: 'CLIENTE',
        },
      });
      createdUserIds.push(user.id);
      const token = await jwt.signAsync({
        sub: user.id,
        email: user.email,
        role: 'CLIENTE',
      });
      concorrenteTokens.push(token);

      if (i === 0) {
        primaryUserId = user.id;
        primaryToken = token;
      }
    }
  });

  afterAll(async () => {
    if (createdExperienceIds.length || createdUserIds.length) {
      await prisma.payment.deleteMany({
        where: {
          booking: {
            OR: [
              { experienceId: { in: createdExperienceIds } },
              { userId: { in: createdUserIds } },
            ],
          },
        },
      });
      await prisma.booking.deleteMany({
        where: {
          OR: [
            { experienceId: { in: createdExperienceIds } },
            { userId: { in: createdUserIds } },
          ],
        },
      });
    }
    if (createdExperienceIds.length) {
      await prisma.experiencia.deleteMany({ where: { id: { in: createdExperienceIds } } });
    }
    if (createdUserIds.length) {
      await prisma.user.deleteMany({ where: { id: { in: createdUserIds } } });
    }
    await app.close();
  });

  describe('Autenticação e validação de payload', () => {
    it('deve retornar 401 sem token e 401 com token inválido (RNF04)', async () => {
      const semToken = await request(app.getHttpServer())
        .post('/reservas')
        .send({ experienceId: 'qualquer', seats: 1 });
      expect(semToken.status).toBe(401);

      const tokenInvalido = await request(app.getHttpServer())
        .post('/reservas')
        .set('Authorization', 'Bearer token-invalido')
        .send({ experienceId: 'qualquer', seats: 1 });
      expect(tokenInvalido.status).toBe(401);
    });

    it('deve retornar 400 para quantidade inválida ou campos extras proibidos', async () => {
      const invalidPayloads = [
        { experienceId: 'exp-1', seats: 0 },
        { experienceId: 'exp-1', seats: -1 },
        { experienceId: 'exp-1', seats: 1.5 },
        { seats: 1 },
        { experienceId: 'exp-1', seats: 1, userId: 'outro' },
        { experienceId: 'exp-1', seats: 1, totalAmount: 1 },
      ];

      for (const payload of invalidPayloads) {
        const res = await request(app.getHttpServer())
          .post('/reservas')
          .set('Authorization', `Bearer ${primaryToken}`)
          .send(payload);
        expect(res.status).toBe(400);
      }
    });
  });

  describe('Fluxo de reserva e exposição de vagas no catálogo/detalhe', () => {
    it('deve retornar 404 para experiência inexistente', async () => {
      const res = await request(app.getHttpServer())
        .post('/reservas')
        .set('Authorization', `Bearer ${primaryToken}`)
        .send({ experienceId: 'exp-inexistente-e2e', seats: 1 });

      expect(res.status).toBe(404);
    });

    it('deve retornar 400 para experiência indisponível ou com data passada', async () => {
      const indisponivel = await criarExperienciaTeste({
        slugSuffix: 'indisponivel',
        capacity: 5,
        isAvailable: false,
      });

      const resIndisponivel = await request(app.getHttpServer())
        .post('/reservas')
        .set('Authorization', `Bearer ${primaryToken}`)
        .send({ experienceId: indisponivel.id, seats: 1 });
      expect(resIndisponivel.status).toBe(400);

      const passada = await criarExperienciaTeste({
        slugSuffix: 'passada',
        capacity: 5,
        startsAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        endsAt: new Date(Date.now() + 2 * 60 * 60 * 1000),
      });

      const resPassada = await request(app.getHttpServer())
        .post('/reservas')
        .set('Authorization', `Bearer ${primaryToken}`)
        .send({ experienceId: passada.id, seats: 1 });
      expect(resPassada.status).toBe(400);
    });

    it('deve criar reserva PENDING, debitar vagas, expor saldo no catálogo/detalhe e bloquear excesso', async () => {
      const exp = await criarExperienciaTeste({
        slugSuffix: 'fluxo-vagas',
        capacity: 3,
        price: '150.50',
      });

      const beforeCreate = Date.now();
      const res = await request(app.getHttpServer())
        .post('/reservas')
        .set('Authorization', `Bearer ${primaryToken}`)
        .send({ experienceId: exp.id, seats: 2 });

      expect(res.status).toBe(201);
      expect(res.body.aviso).toContain('30 minutos');
      expect(res.body.data.status).toBe(BookingStatus.PENDING);
      expect(res.body.data.seats).toBe(2);
      expect(res.body.data.totalAmountDecimal).toBe('301.00');
      expect(res.body.data.totalAmountCents).toBe(30100);
      expect(res.body.data.experience.availableSeats).toBe(1);

      const expiresAtMs = new Date(res.body.data.expiresAt).getTime();
      expect(expiresAtMs).toBeGreaterThanOrEqual(beforeCreate + 29 * 60 * 1000);
      expect(expiresAtMs).toBeLessThanOrEqual(Date.now() + 31 * 60 * 1000);

      // Catálogo e detalhe refletem as vagas restantes (1 de 3)
      const catalogo = await request(app.getHttpServer()).get('/experiencias');
      expect(catalogo.status).toBe(200);
      const itemCatalogo = catalogo.body.find((e: { id: string }) => e.id === exp.id);
      expect(itemCatalogo.availableSeats).toBe(1);
      expect(itemCatalogo.isSoldOut).toBe(false);

      const detalhe = await request(app.getHttpServer()).get(`/experiencias/${exp.slug}`);
      expect(detalhe.status).toBe(200);
      expect(detalhe.body.availableSeats).toBe(1);
      expect(detalhe.body.isSoldOut).toBe(false);

      // Tentar reservar mais do que o saldo restante deve retornar 409
      const excesso = await request(app.getHttpServer())
        .post('/reservas')
        .set('Authorization', `Bearer ${primaryToken}`)
        .send({ experienceId: exp.id, seats: 2 });
      expect(excesso.status).toBe(409);
      expect(excesso.body.message).toContain('disponível: 1');

      // Reservar a última vaga zera availableSeats e marca isSoldOut=true
      const ultima = await request(app.getHttpServer())
        .post('/reservas')
        .set('Authorization', `Bearer ${primaryToken}`)
        .send({ experienceId: exp.id, seats: 1 });
      expect(ultima.status).toBe(201);

      const detalheEsgotado = await request(app.getHttpServer()).get(`/experiencias/${exp.slug}`);
      expect(detalheEsgotado.body.availableSeats).toBe(0);
      expect(detalheEsgotado.body.isSoldOut).toBe(true);
    });
  });

  describe('Concorrência / Anti-overbooking (RNF02)', () => {
    it('deve impedir overbooking com 10 requisições simultâneas na última vaga', async () => {
      const exp = await criarExperienciaTeste({
        slugSuffix: 'ultima-vaga-concorrencia',
        capacity: 1,
      });

      const responses = await Promise.all(
        concorrenteTokens.map((token) =>
          request(app.getHttpServer())
            .post('/reservas')
            .set('Authorization', `Bearer ${token}`)
            .send({ experienceId: exp.id, seats: 1 }),
        ),
      );

      const created = responses.filter((r) => r.status === 201);
      const conflicts = responses.filter((r) => r.status === 409);

      expect(created).toHaveLength(1);
      expect(conflicts).toHaveLength(9);

      const bookings = await prisma.booking.findMany({ where: { experienceId: exp.id } });
      expect(bookings).toHaveLength(1);

      const updatedExp = await prisma.experiencia.findUnique({ where: { id: exp.id } });
      expect(updatedExp?.availableSeats).toBe(0);

      const detalhe = await request(app.getHttpServer()).get(`/experiencias/${exp.slug}`);
      expect(detalhe.body.availableSeats).toBe(0);
      expect(detalhe.body.isSoldOut).toBe(true);
    });

    it('deve impedir overbooking quando múltiplas requisições disputam lotes de vagas', async () => {
      const exp = await criarExperienciaTeste({
        slugSuffix: 'multi-vagas-concorrencia',
        capacity: 5,
      });

      const responses = await Promise.all(
        concorrenteTokens.slice(0, 6).map((token) =>
          request(app.getHttpServer())
            .post('/reservas')
            .set('Authorization', `Bearer ${token}`)
            .send({ experienceId: exp.id, seats: 2 }),
        ),
      );

      const created = responses.filter((r) => r.status === 201);
      const conflicts = responses.filter((r) => r.status === 409);

      expect(created).toHaveLength(2);
      expect(conflicts).toHaveLength(4);

      const bookings = await prisma.booking.findMany({ where: { experienceId: exp.id } });
      const totalBookedSeats = bookings.reduce((sum, b) => sum + b.seats, 0);
      expect(bookings).toHaveLength(2);
      expect(totalBookedSeats).toBe(4);

      const updatedExp = await prisma.experiencia.findUnique({ where: { id: exp.id } });
      expect(updatedExp?.availableSeats).toBe(1);
    });
  });

  describe('Expiração de 30 minutos e devolução de vagas', () => {
    it('deve cancelar reservas PENDING expiradas, preservar CONFIRMED e devolver vagas', async () => {
      const exp = await criarExperienciaTeste({
        slugSuffix: 'expiracao-cron',
        capacity: 3,
      });

      // 1) Reserva PENDING de 2 vagas (saldo cai para 1)
      const pendingRes = await request(app.getHttpServer())
        .post('/reservas')
        .set('Authorization', `Bearer ${primaryToken}`)
        .send({ experienceId: exp.id, seats: 2 });
      expect(pendingRes.status).toBe(201);
      const pendingBookingId = pendingRes.body.data.id as string;

      // 2) Reserva CONFIRMED de 1 vaga com expiresAt vencido (saldo cai para 0)
      const confirmedBooking = await prisma.booking.create({
        data: {
          userId: primaryUserId,
          experienceId: exp.id,
          seats: 1,
          totalAmount: '150.50',
          status: BookingStatus.CONFIRMED,
          expiresAt: new Date(Date.now() - 60_000),
        },
      });
      await prisma.experiencia.update({
        where: { id: exp.id },
        data: { availableSeats: 0 },
      });

      // Retrocede o expiresAt da reserva PENDING para 1 minuto no passado
      await prisma.booking.update({
        where: { id: pendingBookingId },
        data: { expiresAt: new Date(Date.now() - 60_000) },
      });

      const outcome = await reservasService.cancelarReservasExpiradas();
      expect(outcome.canceledCount).toBeGreaterThanOrEqual(1);
      expect(outcome.restoredSeats).toBeGreaterThanOrEqual(2);

      const pendingAfter = await prisma.booking.findUnique({ where: { id: pendingBookingId } });
      const confirmedAfter = await prisma.booking.findUnique({
        where: { id: confirmedBooking.id },
      });
      expect(pendingAfter?.status).toBe(BookingStatus.CANCELED);
      expect(confirmedAfter?.status).toBe(BookingStatus.CONFIRMED);

      const detalhe = await request(app.getHttpServer()).get(`/experiencias/${exp.slug}`);
      expect(detalhe.status).toBe(200);
      expect(detalhe.body.availableSeats).toBe(2);
      expect(detalhe.body.isSoldOut).toBe(false);
    });

    it('deve liberar última vaga presa em PENDING vencida durante nova tentativa de reserva (lazy expiration)', async () => {
      const exp = await criarExperienciaTeste({
        slugSuffix: 'lazy-expiration',
        capacity: 1,
      });

      const firstRes = await request(app.getHttpServer())
        .post('/reservas')
        .set('Authorization', `Bearer ${primaryToken}`)
        .send({ experienceId: exp.id, seats: 1 });
      expect(firstRes.status).toBe(201);
      const firstId = firstRes.body.data.id as string;

      await prisma.booking.update({
        where: { id: firstId },
        data: { expiresAt: new Date(Date.now() - 60_000) },
      });

      const secondRes = await request(app.getHttpServer())
        .post('/reservas')
        .set('Authorization', `Bearer ${concorrenteTokens[1]}`)
        .send({ experienceId: exp.id, seats: 1 });

      expect(secondRes.status).toBe(201);
      expect(secondRes.body.data.id).not.toBe(firstId);

      const firstAfter = await prisma.booking.findUnique({ where: { id: firstId } });
      expect(firstAfter?.status).toBe(BookingStatus.CANCELED);

      const updatedExp = await prisma.experiencia.findUnique({ where: { id: exp.id } });
      expect(updatedExp?.availableSeats).toBe(0);
    });
  });
});
