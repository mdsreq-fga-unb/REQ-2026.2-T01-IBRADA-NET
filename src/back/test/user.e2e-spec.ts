import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module.js';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import * as dotenv from 'dotenv';
dotenv.config();

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let userToken: string;
  let userId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
    await app.init();

    // Setup para iniciar o teste - Criar um usuário e fazer login para obter o token antes
    const email = `user_${Date.now()}@teste.com`;
    await request(app.getHttpServer()).post('/auth/register').send({
      name: 'User Teste',
      email: email,
      password: 'Password@123',
      role: 'CLIENTE',
      lgpdAccepted: true,
      lgpdVersion: 'v1'
    });

    const loginResponse = await request(app.getHttpServer()).post('/auth/login').send({
      email: email,
      password: 'Password@123'
    });

    userToken = loginResponse.body.access_token;
    userId = loginResponse.body.user.id;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/users/:id (PATCH)', () => {
    
    it('deve retornar 401 Unauthorized se não enviar o token JWT', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/users/${userId}`)
        .send({ name: 'Novo Nome' });

      expect(response.status).toBe(401);
    });

    it('deve retornar 401 Unauthorized se enviar um token JWT inválido ou forjado', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/users/${userId}`)
        .set('Authorization', 'Bearer um-token-totalmente-falso-e-invalido')
        .send({ name: 'Hacker' });

      expect(response.status).toBe(401);
    });

    it('deve retornar 403 Forbidden se tentar editar o perfil de OUTRO usuário (IDOR)', async () => {
      const idDeOutroUsuario = 'id-falso-de-outra-pessoa-123';
      
      const response = await request(app.getHttpServer())
        .patch(`/users/${idDeOutroUsuario}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ name: 'Hackeando o nome' });

      expect(response.status).toBe(403);
    });

    it('deve retornar 400 Bad Request se tentar enviar campos proibidos (Mass Assignment)', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/users/${userId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ 
          name: 'Nome Válido', 
          role: 'GESTOR' // Tentativa de injetar a role via PATCH
        });

      expect(response.status).toBe(400); 
    });

    it('deve atualizar o próprio perfil com sucesso (200 OK)', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/users/${userId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ name: 'Nome Atualizado' });

      expect(response.status).toBe(200);
      expect(response.body.name).toBe('Nome Atualizado');
    });
  });
});