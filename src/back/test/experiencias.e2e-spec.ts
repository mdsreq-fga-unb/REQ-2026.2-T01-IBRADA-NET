import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import request from 'supertest';
import { AppModule } from './../src/app.module.js';
import { PrismaService } from './../src/prisma/prisma.service.js';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import * as dotenv from 'dotenv';
dotenv.config();

// US02, US03, US11 e US12 ponta a ponta (HTTP + guards + validação + banco).
// Os tokens são assinados direto com o JwtService da aplicação: GESTOR não pode
// ser criado pela rota pública de cadastro.
describe('ExperienciasController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let gestorToken: string;
  let clienteToken: string;
  let gestorId: string;
  const criados: string[] = [];

  const sufixo = Date.now();
  const novaExperiencia = (extra: Record<string, unknown> = {}) => ({
    title: `Trilha E2E ${sufixo}`,
    description: 'Caminhada guiada pela mata',
    itinerary: 'Saída às 8h, trilha, almoço e retorno',
    price: '150,50',
    startsAt: '2026-12-01T08:00:00.000Z',
    endsAt: '2026-12-01T17:00:00.000Z',
    capacity: 12,
    isAvailable: true,
    photos: ['https://exemplo.com/capa.jpg'],
    location: 'Planaltina/DF',
    community: 'Assentamento Pequeno William',
    biome: 'Cerrado',
    difficulty: 'MODERADA',
    meetingPoint: 'Sede do assentamento',
    meetingTime: '07h30',
    includedItems: ['Guia local', 'Almoço'],
    rules: ['Permaneça na trilha'],
    clothingTips: ['Calçado fechado'],
    communityImpact: 'Parte do valor fica com as famílias anfitriãs.',
    guideName: 'Seu Raimundo',
    guideRole: 'Guia local',
    maxPerBooking: 6,
    ...extra,
  });

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
    const jwt = app.get(JwtService);
    // O pacote guarda quem o cadastrou (chave estrangeira), então o gestor precisa existir no banco.
    const gestor = await prisma.user.create({
      data: {
        name: `Gestor E2E ${sufixo}`,
        email: `gestor-exp-${sufixo}@e2e.com`,
        passwordHash: 'nao-usado-no-teste',
        role: 'GESTOR',
      },
    });
    gestorId = gestor.id;
    gestorToken = await jwt.signAsync({ sub: gestorId, email: gestor.email, role: 'GESTOR' });
    clienteToken = await jwt.signAsync({ sub: 'cliente-e2e', email: 'cliente@e2e.com', role: 'CLIENTE' });
  });

  afterAll(async () => {
    if (criados.length) {
      await prisma.experiencia.deleteMany({ where: { id: { in: criados } } });
    }
    await prisma.user.deleteMany({ where: { id: gestorId } });
    await app.close();
  });

  describe('POST /experiencias (US11)', () => {
    it('401 sem token', async () => {
      const res = await request(app.getHttpServer()).post('/experiencias').send(novaExperiencia());
      expect(res.status).toBe(401);
    });

    it('403 para cliente autenticado', async () => {
      const res = await request(app.getHttpServer())
        .post('/experiencias')
        .set('Authorization', `Bearer ${clienteToken}`)
        .send(novaExperiencia());
      expect(res.status).toBe(403);
    });

    it('400 quando falta campo obrigatório (roteiro)', async () => {
      const { itinerary: _roteiro, ...semRoteiro } = novaExperiencia();
      const res = await request(app.getHttpServer())
        .post('/experiencias')
        .set('Authorization', `Bearer ${gestorToken}`)
        .send(semRoteiro);
      expect(res.status).toBe(400);
    });

    it('400 quando endsAt não é posterior a startsAt', async () => {
      const res = await request(app.getHttpServer())
        .post('/experiencias')
        .set('Authorization', `Bearer ${gestorToken}`)
        .send(novaExperiencia({ endsAt: '2026-12-01T08:00:00.000Z' }));
      expect(res.status).toBe(400);
    });

    it('400 quando capacity é zero', async () => {
      const res = await request(app.getHttpServer())
        .post('/experiencias')
        .set('Authorization', `Bearer ${gestorToken}`)
        .send(novaExperiencia({ capacity: 0 }));
      expect(res.status).toBe(400);
    });

    it('201 para gestor, com slug gerado e preço exato', async () => {
      const res = await request(app.getHttpServer())
        .post('/experiencias')
        .set('Authorization', `Bearer ${gestorToken}`)
        .send(novaExperiencia());

      expect(res.status).toBe(201);
      expect(res.body.message).toBe('Pacote cadastrado com sucesso!');
      expect(res.body.data.slug).toBe(`trilha-e2e-${sufixo}`);
      expect(res.body.data.priceCents).toBe(15050);
      expect(res.body.data.availableSeats).toBe(12);
      expect(res.body.data.location).toBe('Planaltina/DF');
      expect(res.body.data.includedItems).toEqual(['Guia local', 'Almoço']);
      criados.push(res.body.data.id);
    });

    it('gera slug diferente para título repetido', async () => {
      const res = await request(app.getHttpServer())
        .post('/experiencias')
        .set('Authorization', `Bearer ${gestorToken}`)
        .send(novaExperiencia());

      expect(res.status).toBe(201);
      expect(res.body.data.slug).toBe(`trilha-e2e-${sufixo}-2`);
      criados.push(res.body.data.id);
    });
  });

  describe('GET /experiencias/gestor (US11 e US12)', () => {
    it('401 sem token e 403 para cliente', async () => {
      const semToken = await request(app.getHttpServer()).get('/experiencias/gestor');
      const comoCliente = await request(app.getHttpServer())
        .get('/experiencias/gestor')
        .set('Authorization', `Bearer ${clienteToken}`);

      expect(semToken.status).toBe(401);
      expect(comoCliente.status).toBe(403);
    });

    it('200 para gestor, com quem cadastrou o pacote e a data de cadastro', async () => {
      const res = await request(app.getHttpServer())
        .get('/experiencias/gestor')
        .set('Authorization', `Bearer ${gestorToken}`);

      expect(res.status).toBe(200);
      const meu = res.body.find((p: { id: string }) => p.id === criados[0]);
      expect(meu.createdBy).toEqual({ id: gestorId, name: `Gestor E2E ${sufixo}` });
      expect(meu.createdAt).toBeDefined();
    });

    it('a lista pública não expõe quem cadastrou', async () => {
      const res = await request(app.getHttpServer()).get('/experiencias');
      const meu = res.body.find((p: { id: string }) => p.id === criados[0]);

      expect(meu).toBeDefined();
      expect(meu.createdBy).toBeUndefined();
    });
  });

  describe('GET público (US02 e US03)', () => {
    it('lista sem token, incluindo a experiência cadastrada', async () => {
      const res = await request(app.getHttpServer()).get('/experiencias');

      expect(res.status).toBe(200);
      const item = res.body.find((e: { slug: string }) => e.slug === `trilha-e2e-${sufixo}`);
      expect(item).toBeDefined();
      expect(item.availableSeats).toBe(12);
      expect(item.isSoldOut).toBe(false);
      expect(item.isAvailable).toBe(true);
    });

    it('detalha por slug sem token (roteiro, datas, vagas e valor)', async () => {
      const res = await request(app.getHttpServer()).get(`/experiencias/trilha-e2e-${sufixo}`);

      expect(res.status).toBe(200);
      expect(res.body.itinerary).toContain('trilha');
      expect(res.body.startsAt).toBe('2026-12-01T08:00:00.000Z');
      expect(res.body.priceFormatted).toBe('R$ 150,50');
      expect(res.body.availableSeats).toBe(12);
      expect(res.body.meetingPoint).toBe('Sede do assentamento');
      expect(res.body.meetingTime).toBe('07h30');
      expect(res.body.clothingTips).toEqual(['Calçado fechado']);
    });

    it('404 para slug inexistente', async () => {
      const res = await request(app.getHttpServer()).get('/experiencias/nao-existe-e2e');
      expect(res.status).toBe(404);
    });
  });

  describe('PATCH /experiencias/:id/disponibilidade (US12)', () => {
    it('401 sem token e 403 para cliente', async () => {
      const id = criados[0];
      const semToken = await request(app.getHttpServer())
        .patch(`/experiencias/${id}/disponibilidade`)
        .send({ isAvailable: false });
      const cliente = await request(app.getHttpServer())
        .patch(`/experiencias/${id}/disponibilidade`)
        .set('Authorization', `Bearer ${clienteToken}`)
        .send({ isAvailable: false });

      expect(semToken.status).toBe(401);
      expect(cliente.status).toBe(403);
    });

    it('400 quando isAvailable não é booleano', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/experiencias/${criados[0]}/disponibilidade`)
        .set('Authorization', `Bearer ${gestorToken}`)
        .send({ isAvailable: 'sim' });
      expect(res.status).toBe(400);
    });

    it('404 para id inexistente', async () => {
      const res = await request(app.getHttpServer())
        .patch('/experiencias/id-inexistente/disponibilidade')
        .set('Authorization', `Bearer ${gestorToken}`)
        .send({ isAvailable: false });
      expect(res.status).toBe(404);
    });

    it('200 para gestor e a mudança aparece no catálogo público', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/experiencias/${criados[0]}/disponibilidade`)
        .set('Authorization', `Bearer ${gestorToken}`)
        .send({ isAvailable: false });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Disponibilidade atualizada para indisponível com sucesso!');

      const detalhe = await request(app.getHttpServer()).get(`/experiencias/trilha-e2e-${sufixo}`);
      expect(detalhe.body.isAvailable).toBe(false);
    });
  });
});
