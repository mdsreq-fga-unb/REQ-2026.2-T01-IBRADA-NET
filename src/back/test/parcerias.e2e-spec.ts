import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import request from 'supertest';
import { AppModule } from './../src/app.module.js';
import { PrismaService } from './../src/prisma/prisma.service.js';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import * as dotenv from 'dotenv';
dotenv.config();

// US19 (envio público) e US20 (consulta pelo gestor) ponta a ponta.
// Os tokens são assinados com o JwtService da aplicação: GESTOR não pode ser
// criado pela rota pública de cadastro.
describe('ParceriasController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let gestorToken: string;
  let clienteToken: string;
  let pedidoId: string;
  const criados: string[] = [];

  const sufixo = Date.now();
  const formulario = (extra: Record<string, unknown> = {}) => ({
    organization: `Instituto E2E ${sufixo}`,
    cnpj: '12.345.678/0001-90',
    contactName: 'Carlos Silva',
    contactEmail: 'carlos@e2e.org',
    contactPhone: '(61) 98765-4321',
    proposal: 'Oficinas de sustentabilidade comunitária.',
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
    gestorToken = await jwt.signAsync({ sub: 'gestor-e2e', email: 'gestor@e2e.com', role: 'GESTOR' });
    clienteToken = await jwt.signAsync({ sub: 'cliente-e2e', email: 'cliente@e2e.com', role: 'CLIENTE' });
  });

  afterAll(async () => {
    if (criados.length) {
      await prisma.pedidoParceria.deleteMany({ where: { id: { in: criados } } });
    }
    await app.close();
  });

  describe('POST /parcerias (US19, público)', () => {
    it('201 sem token, com status RECEIVED e CNPJ na coluna própria', async () => {
      const res = await request(app.getHttpServer()).post('/parcerias').send(formulario());

      expect(res.status).toBe(201);
      expect(res.body.message).toContain('enviada com sucesso');
      expect(res.body.data.status).toBe('RECEIVED');
      expect(res.body.data.cnpj).toBe('12.345.678/0001-90');
      expect(res.body.data.proposal).toBe('Oficinas de sustentabilidade comunitária.');
      pedidoId = res.body.data.id;
      criados.push(pedidoId);
    });

    it('201 sem CNPJ e sem telefone (campos opcionais)', async () => {
      const { cnpj: _cnpj, contactPhone: _phone, ...minimo } = formulario({
        organization: `Instituto E2E mínimo ${sufixo}`,
      });
      const res = await request(app.getHttpServer()).post('/parcerias').send(minimo);

      expect(res.status).toBe(201);
      expect(res.body.data.cnpj).toBeNull();
      expect(res.body.data.contactPhone).toBeNull();
      criados.push(res.body.data.id);
    });

    it('400 quando falta campo de identificação', async () => {
      const { contactName: _nome, ...semNome } = formulario();
      const res = await request(app.getHttpServer()).post('/parcerias').send(semNome);
      expect(res.status).toBe(400);
    });

    it('400 quando um campo obrigatório vem só com espaços', async () => {
      const res = await request(app.getHttpServer())
        .post('/parcerias')
        .send(formulario({ organization: '   ' }));
      expect(res.status).toBe(400);
    });

    it('400 para e-mail inválido e para status enviado no formulário', async () => {
      const email = await request(app.getHttpServer())
        .post('/parcerias')
        .send(formulario({ contactEmail: 'sem-arroba' }));
      const status = await request(app.getHttpServer())
        .post('/parcerias')
        .send(formulario({ status: 'ACCEPTED' }));

      expect(email.status).toBe(400);
      expect(status.status).toBe(400);
    });
  });

  describe('GET /parcerias (US20, só gestor)', () => {
    it('401 sem token e 403 para cliente', async () => {
      const semToken = await request(app.getHttpServer()).get('/parcerias');
      const cliente = await request(app.getHttpServer())
        .get('/parcerias')
        .set('Authorization', `Bearer ${clienteToken}`);

      expect(semToken.status).toBe(401);
      expect(cliente.status).toBe(403);
    });

    it('200 para gestor, com a solicitação enviada na lista', async () => {
      const res = await request(app.getHttpServer())
        .get('/parcerias')
        .set('Authorization', `Bearer ${gestorToken}`);

      expect(res.status).toBe(200);
      expect(res.body.some((p: { id: string }) => p.id === pedidoId)).toBe(true);
    });

    it('detalhe: 401 sem token, 403 para cliente, 404 inexistente e 200 para gestor', async () => {
      const semToken = await request(app.getHttpServer()).get(`/parcerias/${pedidoId}`);
      const cliente = await request(app.getHttpServer())
        .get(`/parcerias/${pedidoId}`)
        .set('Authorization', `Bearer ${clienteToken}`);
      const inexistente = await request(app.getHttpServer())
        .get('/parcerias/id-inexistente')
        .set('Authorization', `Bearer ${gestorToken}`);
      const ok = await request(app.getHttpServer())
        .get(`/parcerias/${pedidoId}`)
        .set('Authorization', `Bearer ${gestorToken}`);

      expect(semToken.status).toBe(401);
      expect(cliente.status).toBe(403);
      expect(inexistente.status).toBe(404);
      expect(ok.status).toBe(200);
      expect(ok.body.organization).toBe(`Instituto E2E ${sufixo}`);
      expect(ok.body.contactEmail).toBe('carlos@e2e.org');
    });
  });

  describe('PATCH /parcerias/:id/status (acompanhamento)', () => {
    it('403 para cliente, 400 para status inválido e 200 para gestor', async () => {
      const cliente = await request(app.getHttpServer())
        .patch(`/parcerias/${pedidoId}/status`)
        .set('Authorization', `Bearer ${clienteToken}`)
        .send({ status: 'IN_ANALYSIS' });
      const invalido = await request(app.getHttpServer())
        .patch(`/parcerias/${pedidoId}/status`)
        .set('Authorization', `Bearer ${gestorToken}`)
        .send({ status: 'QUALQUER' });
      const ok = await request(app.getHttpServer())
        .patch(`/parcerias/${pedidoId}/status`)
        .set('Authorization', `Bearer ${gestorToken}`)
        .send({ status: 'IN_ANALYSIS' });

      expect(cliente.status).toBe(403);
      expect(invalido.status).toBe(400);
      expect(ok.status).toBe(200);
      expect(ok.body.data.status).toBe('IN_ANALYSIS');
    });
  });
});
