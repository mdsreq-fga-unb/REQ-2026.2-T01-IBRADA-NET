import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module.js';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import * as dotenv from 'dotenv';
dotenv.config();

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/auth/register (POST)', () => {
    it('deve bloquear a criação de um usuário com role GESTOR via rota pública', async () => {
      const payloadGestor = {
        name: 'Hacker',
        email: 'hacker@teste.com',
        password: 'Password@123',
        role: 'GESTOR', // Tentativa de trocar de role
        lgpdAccepted: true,
        lgpdVersion: 'v1'
      };

      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send(payloadGestor);

      // Pode retornar 400 (Bad Request pelo ValidationPipe) ou 403 (Forbidden pelo Service)
      expect([400, 403]).toContain(response.status);
    });

    it('deve permitir a criação de um usuário CLIENTE válido', async () => {
      const payloadCliente = {
        name: 'Cliente Teste',
        email: `cliente_${Date.now()}@teste.com`,
        password: 'Password@123',
        role: 'CLIENTE',
        lgpdAccepted: true,
        lgpdVersion: 'v1'
      };

      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send(payloadCliente);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.role).toBe('CLIENTE');
    });
  });
});