import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import request from 'supertest';
import { AppModule } from './../src/app.module.js';
import { PrismaService } from './../src/prisma/prisma.service.js';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import * as dotenv from 'dotenv';
dotenv.config();

// Voluntariado ponta a ponta (HTTP + guards + validação + banco): US13, US14, US21 e RF19.
// Os tokens são assinados direto com o JwtService da aplicação, porque GESTOR não pode
// ser criado pela rota pública de cadastro.
describe('Voluntariado (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let gestorToken: string;
  let clienteToken: string;
  let voluntarioToken: string;

  const sufixo = Date.now();
  let projetoId: string;
  let categoriaId: string;
  let oportunidadeId: string;
  const categoriasCriadas: string[] = [];

  const http = () => request(app.getHttpServer());
  const comToken = (token: string) => ({ Authorization: `Bearer ${token}` });

  const novoProjeto = (extra: Record<string, unknown> = {}) => ({
    title: `Projeto E2E ${sufixo}`,
    description: 'Projeto criado pelo teste e2e',
    ...extra,
  });

  const novaOportunidade = (extra: Record<string, unknown> = {}) => ({
    title: `Oportunidade E2E ${sufixo}`,
    description: 'Apoio em campo nas ações do projeto',
    projetoId,
    categoriaId,
    duracao: '3 meses',
    disponibilidade: 'Sábados pela manhã',
    habilidades: ['Primeiros socorros'],
    atividades: 'Acompanhar as visitas\nRegistrar fotos',
    criteriosFunil: {
      exigeExperiencia: true,
      educacaoMinima: 'MEDIO',
      habilidadesExigidas: ['Botânica'],
    },
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
    voluntarioToken = await jwt.signAsync({
      sub: 'voluntario-e2e',
      email: 'voluntario@e2e.com',
      role: 'VOLUNTARIO',
    });

    // Categoria usada pelas oportunidades (criada direto no banco, só para o teste).
    const categoria = await prisma.categoria.create({ data: { nome: `Categoria E2E ${sufixo}` } });
    categoriaId = categoria.id;
  });

  afterAll(async () => {
    // Oportunidades antes de projeto e categoria; os critérios do funil saem em cascata.
    await prisma.oportunidade.deleteMany({ where: { title: { contains: `E2E ${sufixo}` } } });
    await prisma.projeto.deleteMany({ where: { title: { contains: `E2E ${sufixo}` } } });
    await prisma.categoria.deleteMany({
      where: { id: { in: [categoriaId, ...categoriasCriadas].filter(Boolean) } },
    });
    await app.close();
  });

  // ===========================================================================
  // Controle de acesso: todas as rotas de gestor
  // sem token = 401; cliente ou voluntário = 403
  // ===========================================================================
  describe('Controle de acesso das rotas de gestor', () => {
    const rotasDeGestor: Array<{
      nome: string;
      metodo: 'get' | 'post' | 'patch';
      caminho: () => string;
      corpo?: () => Record<string, unknown>;
    }> = [
      { nome: 'GET /projetos', metodo: 'get', caminho: () => '/projetos' },
      { nome: 'GET /projetos/:id', metodo: 'get', caminho: () => '/projetos/qualquer-id' },
      { nome: 'POST /projetos', metodo: 'post', caminho: () => '/projetos', corpo: () => novoProjeto() },
      {
        nome: 'POST /oportunidades',
        metodo: 'post',
        caminho: () => '/oportunidades',
        corpo: () => novaOportunidade(),
      },
      {
        nome: 'PATCH /oportunidades/:id',
        metodo: 'patch',
        caminho: () => '/oportunidades/qualquer-id',
        corpo: () => ({ isOpen: false }),
      },
      { nome: 'GET /oportunidades/gestor', metodo: 'get', caminho: () => '/oportunidades/gestor' },
      {
        nome: 'POST /categorias',
        metodo: 'post',
        caminho: () => '/categorias',
        corpo: () => ({ nome: `Categoria acesso ${sufixo}` }),
      },
    ];

    describe.each(rotasDeGestor)('$nome', ({ metodo, caminho, corpo }) => {
      it('401 sem token', async () => {
        const res = await http()[metodo](caminho()).send(corpo?.() ?? {});
        expect(res.status).toBe(401);
      });

      it('403 para cliente autenticado', async () => {
        const res = await http()
          [metodo](caminho())
          .set(comToken(clienteToken))
          .send(corpo?.() ?? {});
        expect(res.status).toBe(403);
      });

      it('403 para voluntário autenticado', async () => {
        const res = await http()
          [metodo](caminho())
          .set(comToken(voluntarioToken))
          .send(corpo?.() ?? {});
        expect(res.status).toBe(403);
      });
    });
  });

  // ===========================================================================
  // Projetos (módulo mínimo)
  // ===========================================================================
  describe('Projetos', () => {
    it('400 quando falta o título', async () => {
      const res = await http()
        .post('/projetos')
        .set(comToken(gestorToken))
        .send(novoProjeto({ title: undefined }));
      expect(res.status).toBe(400);
    });

    it('400 quando o término não é posterior ao início', async () => {
      const res = await http()
        .post('/projetos')
        .set(comToken(gestorToken))
        .send(novoProjeto({ startDate: '2026-12-10', endDate: '2026-12-01' }));
      expect(res.status).toBe(400);
    });

    it('201 para gestor (inserção) e o projeto aparece na consulta', async () => {
      const res = await http().post('/projetos').set(comToken(gestorToken)).send(novoProjeto());
      expect(res.status).toBe(201);
      expect(res.body.data.id).toBeTruthy();
      projetoId = res.body.data.id;

      const detalhe = await http().get(`/projetos/${projetoId}`).set(comToken(gestorToken));
      expect(detalhe.status).toBe(200);
      expect(detalhe.body.title).toBe(`Projeto E2E ${sufixo}`);

      const lista = await http().get('/projetos').set(comToken(gestorToken));
      expect(lista.status).toBe(200);
      expect(lista.body.some((p: { id: string }) => p.id === projetoId)).toBe(true);
    });
  });

  // ===========================================================================
  // Categorias (cadastro pelo gestor)
  // ===========================================================================
  describe('Categorias', () => {
    it('201 para gestor e 409 ao repetir o nome', async () => {
      const nome = `Categoria nova E2E ${sufixo}`;
      const criada = await http().post('/categorias').set(comToken(gestorToken)).send({ nome });
      expect(criada.status).toBe(201);
      categoriasCriadas.push(criada.body.id);

      const repetida = await http().post('/categorias').set(comToken(gestorToken)).send({ nome });
      expect(repetida.status).toBe(409);
    });

    it('lista pública sem token', async () => {
      const res = await http().get('/categorias');
      expect(res.status).toBe(200);
      expect(res.body.some((c: { id: string }) => c.id === categoriaId)).toBe(true);
    });
  });

  // ===========================================================================
  // US13 — Cadastro de oportunidade (envio de formulário e inserção)
  // ===========================================================================
  describe('POST /oportunidades (US13)', () => {
    it('400 sem habilidades', async () => {
      const res = await http()
        .post('/oportunidades')
        .set(comToken(gestorToken))
        .send(novaOportunidade({ habilidades: [] }));
      expect(res.status).toBe(400);
    });

    it('400 sem disponibilidade', async () => {
      const res = await http()
        .post('/oportunidades')
        .set(comToken(gestorToken))
        .send(novaOportunidade({ disponibilidade: undefined }));
      expect(res.status).toBe(400);
    });

    it('400 para campo desconhecido (ex.: "criterios" no formato antigo)', async () => {
      const res = await http()
        .post('/oportunidades')
        .set(comToken(gestorToken))
        .send(novaOportunidade({ criterios: ['EXPERIENCIA_PREVIA'] }));
      expect(res.status).toBe(400);
    });

    it('400 quando o projeto não existe', async () => {
      const res = await http()
        .post('/oportunidades')
        .set(comToken(gestorToken))
        .send(novaOportunidade({ projetoId: 'projeto-inexistente' }));
      expect(res.status).toBe(400);
    });

    it('201 para gestor, com critérios do funil salvos', async () => {
      const res = await http()
        .post('/oportunidades')
        .set(comToken(gestorToken))
        .send(novaOportunidade());
      expect(res.status).toBe(201);
      expect(res.body.message).toContain('sucesso');
      expect(res.body.data.id).toBeTruthy();
      oportunidadeId = res.body.data.id;

      const criterio = await prisma.criterioFunil.findUnique({ where: { oportunidadeId } });
      expect(criterio?.exigeExperiencia).toBe(true);
      expect(criterio?.educacaoMinima).toBe('MEDIO');
      expect(JSON.parse(criterio?.habilidadesExigidas ?? '[]')).toEqual(['Botânica']);
    });
  });

  // ===========================================================================
  // US21 e US14 — Consultas públicas
  // ===========================================================================
  describe('GET público (US21 e US14)', () => {
    it('lista sem token, com nome, duração e disponibilidade', async () => {
      const res = await http().get('/oportunidades');
      expect(res.status).toBe(200);
      const item = res.body.find((o: { id: string }) => o.id === oportunidadeId);
      expect(item).toMatchObject({
        title: `Oportunidade E2E ${sufixo}`,
        duracao: '3 meses',
        disponibilidade: 'Sábados pela manhã',
      });
    });

    it('detalha sem token, com projeto, atividades, duração, disponibilidade e habilidades', async () => {
      const res = await http().get(`/oportunidades/${oportunidadeId}`);
      expect(res.status).toBe(200);
      expect(res.body.projeto.id).toBe(projetoId);
      expect(res.body.atividades).toContain('Registrar fotos');
      expect(res.body.habilidades).toEqual(['Primeiros socorros']);
      expect(res.body.aceitandoCandidaturas).toBe(true);
    });

    it('404 para oportunidade inexistente', async () => {
      const res = await http().get('/oportunidades/id-inexistente');
      expect(res.status).toBe(404);
    });
  });

  // ===========================================================================
  // RF19 — Alteração (editar, fechar e reabrir)
  // ===========================================================================
  describe('PATCH /oportunidades/:id (RF19)', () => {
    it('404 para id inexistente', async () => {
      const res = await http()
        .patch('/oportunidades/id-inexistente')
        .set(comToken(gestorToken))
        .send({ isOpen: false });
      expect(res.status).toBe(404);
    });

    it('400 quando isOpen não é booleano', async () => {
      const res = await http()
        .patch(`/oportunidades/${oportunidadeId}`)
        .set(comToken(gestorToken))
        .send({ isOpen: 'talvez' });
      expect(res.status).toBe(400);
    });

    it('200 ao editar a duração, preservando os critérios do funil', async () => {
      const res = await http()
        .patch(`/oportunidades/${oportunidadeId}`)
        .set(comToken(gestorToken))
        .send({ duracao: '6 meses' });
      expect(res.status).toBe(200);

      const detalhe = await http().get(`/oportunidades/${oportunidadeId}`);
      expect(detalhe.body.duracao).toBe('6 meses');
      expect(detalhe.body.criteriosFunil.educacaoMinima).toBe('MEDIO');
    });

    it('fechar tira da lista pública, mantém no painel do gestor e bloqueia a candidatura', async () => {
      const res = await http()
        .patch(`/oportunidades/${oportunidadeId}`)
        .set(comToken(gestorToken))
        .send({ isOpen: false });
      expect(res.status).toBe(200);

      const publica = await http().get('/oportunidades');
      expect(publica.body.some((o: { id: string }) => o.id === oportunidadeId)).toBe(false);

      const painel = await http().get('/oportunidades/gestor').set(comToken(gestorToken));
      expect(painel.status).toBe(200);
      const item = painel.body.find((o: { id: string }) => o.id === oportunidadeId);
      expect(item?.isOpen).toBe(false);

      const detalhe = await http().get(`/oportunidades/${oportunidadeId}`);
      expect(detalhe.status).toBe(200);
      expect(detalhe.body.aceitandoCandidaturas).toBe(false);
    });

    it('reabrir devolve a oportunidade à lista pública', async () => {
      const res = await http()
        .patch(`/oportunidades/${oportunidadeId}`)
        .set(comToken(gestorToken))
        .send({ isOpen: true });
      expect(res.status).toBe(200);

      const publica = await http().get('/oportunidades');
      expect(publica.body.some((o: { id: string }) => o.id === oportunidadeId)).toBe(true);
    });

    it('remove critérios com null e lista vazia', async () => {
      const res = await http()
        .patch(`/oportunidades/${oportunidadeId}`)
        .set(comToken(gestorToken))
        .send({ criteriosFunil: { educacaoMinima: null, habilidadesExigidas: [] } });
      expect(res.status).toBe(200);

      const criterio = await prisma.criterioFunil.findUnique({ where: { oportunidadeId } });
      expect(criterio?.educacaoMinima).toBeNull();
      expect(criterio?.habilidadesExigidas).toBeNull();
      expect(criterio?.exigeExperiencia).toBe(true);
    });
  });
});
