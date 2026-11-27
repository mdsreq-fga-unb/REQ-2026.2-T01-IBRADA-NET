import 'dotenv/config';
import { randomUUID } from 'node:crypto';
import { type INestApplication, ValidationPipe } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { AppModule } from '../src/app.module.js';
import { PrismaService } from '../src/prisma/prisma.service.js';

describe('Reservas (US09) e pagamentos simulados (US10)', () => {
  const runId = randomUUID().replaceAll('-', '');
  const secret = 'teste-webhook-' + runId;
  let app: INestApplication;
  let prisma: PrismaService;
  let userId: string;
  let owner: string;
  let outsider: string;
  let experienceId: string;
  const experiences: string[] = [];

  beforeAll(async () => {
    vi.stubEnv('PAYMENT_FAKE_WEBHOOK_SECRET', secret);
    const module = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
    await app.init();
    prisma = app.get(PrismaService);
    const user = await prisma.user.create({
      data: { name: 'Cliente de teste', email: runId + '@example.test', passwordHash: 'fixture' },
    });
    userId = user.id;
    const jwt = app.get(JwtService);
    owner = 'Bearer ' + await jwt.signAsync({ sub: userId, email: user.email, role: 'CLIENTE' });
    outsider = 'Bearer ' + await jwt.signAsync({
      sub: 'outro-' + userId, email: 'outro@example.test', role: 'CLIENTE',
    });
  });

  beforeEach(async () => {
    const experience = await prisma.experiencia.create({
      data: {
        title: 'Vivência E2E', slug: 'vivencia-' + randomUUID(), description: 'Experiência de teste',
        startsAt: new Date(Date.now() + 86_400_000), endsAt: new Date(Date.now() + 90_000_000),
        capacity: 3, price: '120.50',
      },
    });
    experienceId = experience.id;
    experiences.push(experienceId);
  });

  afterAll(async () => {
    try {
      if (prisma && experiences.length) {
        const experienceIds = { in: experiences };
        await prisma.paymentWebhookEvent.deleteMany({ where: { provider: 'fake', eventId: { startsWith: runId } } });
        await prisma.payment.deleteMany({ where: { booking: { experienceId: experienceIds } } });
        await prisma.booking.deleteMany({ where: { experienceId: experienceIds } });
        await prisma.experiencia.deleteMany({ where: { id: experienceIds } });
      }
      if (prisma && userId) await prisma.user.delete({ where: { id: userId } });
    } finally {
      await app?.close();
      vi.unstubAllEnvs();
    }
  });

  async function pending() {
    // Fixture temporária até a integração do POST /reservas da US08.
    return prisma.booking.create({
      data: {
        experienceId, userId, seats: 1, totalAmount: '120.50',
        expiresAt: new Date(Date.now() + 30 * 60_000),
      },
    });
  }

  function eventFor(paymentId: string, suffix: string, status: 'PAID' | 'FAILED', amount: string) {
    return {
      provider: 'fake', eventId: runId + '_' + suffix, externalId: 'fake_' + paymentId,
      status, amount, currency: 'BRL', occurredAt: new Date().toISOString(),
    };
  }

  function notify(event: ReturnType<typeof eventFor>, credential = secret) {
    return request(app.getHttpServer()).post('/pagamentos/webhook')
      .set('x-payment-webhook-secret', credential).send(event);
  }

  async function checkout(bookingId: string, revision: number) {
    const path = '/reservas/' + bookingId;
    await request(app.getHttpServer()).post(path + '/confirmar').set('Authorization', owner)
      .send({ revision }).expect(200);
    const payment = await request(app.getHttpServer()).post(path + '/pagamentos')
      .set('Authorization', owner).expect(200);
    return { path, paymentId: payment.body.paymentId as string };
  }

  it('protege o resumo, edita vagas, exige a revisão atual e gera comprovante após aprovação', async () => {
    const booking = await pending();
    const path = '/reservas/' + booking.id;
    const api = request(app.getHttpServer());
    await api.get(path).expect(401);
    await api.get(path).set('Authorization', outsider).expect(404);
    await api.get(path + '/comprovante').set('Authorization', outsider).expect(404);
    await api.post(path + '/pagamentos').set('Authorization', owner).expect(409);
    await api.patch(path).set('Authorization', owner).send({ seats: 0, revision: 1 }).expect(400);
    await api.patch(path).set('Authorization', owner).send({ seats: 4, revision: 1 }).expect(409);
    const edit = await api.patch(path).set('Authorization', owner).send({ seats: 2, revision: 1 }).expect(200);
    expect(edit.body).toMatchObject({ totalAmount: '241.00', revision: 2, seats: 2 });
    expect(edit.body.expiresAt).toBe(booking.expiresAt?.toISOString());
    await api.post(path + '/confirmar').set('Authorization', owner).send({ revision: 1 }).expect(409);
    const { paymentId } = await checkout(booking.id, 2);
    await api.patch(path).set('Authorization', owner).send({ seats: 1, revision: 2 }).expect(409);
    await api.get(path + '/comprovante').set('Authorization', owner).expect(409);
    const retry = await api.post(path + '/pagamentos').set('Authorization', owner).expect(200);
    expect(retry.body.paymentId).toBe(paymentId);

    const paid = eventFor(paymentId, 'paid', 'PAID', '241.00');
    await notify(paid, 'invalida').expect(401);
    const replies = await Promise.all([notify(paid).expect(200), notify(paid).expect(200)]);
    expect(replies.map((reply) => reply.body.result).sort()).toEqual(['duplicate', 'processed']);
    await notify(eventFor(paymentId, 'out_of_order', 'FAILED', '241.00')).expect(200);
    const receipt = await api.get(path + '/comprovante').set('Authorization', owner).expect(200);
    expect(receipt.body).toMatchObject({
      bookingStatus: 'CONFIRMED', totalAmount: '241.00', payment: { id: paymentId, status: 'PAID' },
    });
  });

  it('serializa duas edições para a última vaga e libera capacidade ao recusar', async () => {
    const first = await pending();
    const second = await pending();
    const api = request(app.getHttpServer());
    const ids = [first.id, second.id];
    const replies = await Promise.all(ids.map((id) => api.patch('/reservas/' + id)
      .set('Authorization', owner).send({ seats: 2, revision: 1 })));
    expect(replies.map((reply) => reply.status).sort()).toEqual([200, 409]);
    const loserIndex = replies.findIndex((reply) => reply.status === 409);
    expect(replies[loserIndex].body.code).toBe('INSUFFICIENT_SEATS');

    const { paymentId } = await checkout(ids[1 - loserIndex], 2);
    const declined = eventFor(paymentId, 'declined', 'FAILED', '241.00');
    await notify(declined).expect(200).expect({ result: 'processed' });
    await notify(declined).expect(200).expect({ result: 'duplicate' });
    const failed = await prisma.payment.findUniqueOrThrow({ where: { id: paymentId }, include: { booking: true } });
    expect(failed).toMatchObject({ status: 'FAILED', booking: { status: 'CANCELED' } });
    await api.patch('/reservas/' + ids[loserIndex]).set('Authorization', owner)
      .send({ seats: 3, revision: 1 }).expect(200);
  });

  it('registra aprovação tardia para conciliação e mantém a reserva cancelada', async () => {
    const booking = await pending();
    const { path, paymentId } = await checkout(booking.id, 1);
    await prisma.booking.update({ where: { id: booking.id }, data: { expiresAt: new Date(0) } });
    const late = eventFor(paymentId, 'late', 'PAID', '120.50');
    await notify(late).expect(200).expect({ result: 'reconciliation_required' });
    await request(app.getHttpServer()).get(path + '/comprovante').set('Authorization', owner).expect(409);
    const current = await prisma.payment.findUniqueOrThrow({ where: { id: paymentId }, include: { booking: true } });
    expect(current).toMatchObject({ status: 'PAID', booking: { status: 'CANCELED' } });
  });
});
