import 'dotenv/config';
import * as bcrypt from 'bcrypt';
import { PrismaClient } from '../src/generated/prisma/client.js';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

// Seed idempotente: pode rodar várias vezes sem duplicar registros.
// Os projetos, oportunidades e usuários abaixo são DADOS DE DEMONSTRAÇÃO para testes;
// troque pelos projetos reais do instituto quando existirem.

const CATEGORIAS_INICIAIS = [
  // De acordo com o documento do dia 15/11/2026 fornecido pelo presidente do IBRADA
  // 1. Perfil e Vínculo Comunitário
  'Estudante de Ensino Médio',
  'Estudante Universitário / Graduação',
  'Pós-graduando / Pesquisador',
  'Profissional / Consultor Técnico',
  'Agricultor(a) Familiar',
  'Morador(a) de Comunidade Rural ou Periferia',
  'Indígena',
  'Quilombola',
  'Comunidade Tradicional / Extrativista',
  'Guia ou Condutor(a) de Turismo',
  'Praticante de Trilhas / Ecoturista',

  // 2. Áreas de Projeto (Alinhadas ao IBRADA)
  // Regularização Fundiária e Geoprocessamento
  'Geoprocessamento / SIG / Mapeamento',
  'Regularização Fundiária e Ambiental (CAR)',
  'Topografia e Memorial Descritivo',
  'Direito Ambiental e Agrário',
  // Ecoturismo e Gestão de Áreas Protegidas
  'Ecoturismo e Trilhas',
  'Turismo de Base Comunitária (TBC)',
  'Venda e Operação de Pacotes Turísticos',
  'Unidades de Conservação (UC) e RPPN',
  'Plano de Manejo e Plano Diretor de UC',
  'Governança do Turismo',
  // Agroecologia e Recuperação Ambiental
  'Agroecologia e Produção Orgânica',
  'Sistemas Agroflorestais (SAFs)',
  'Reflorestamento e Recuperação de Áreas Degradadas (PRAD)',
  'Corredores Ecológicos',
  'Assistência Técnica e Extensão Rural (ATER)',
  // Mobilização Social e Educação
  'Inclusão Socioprodutiva',
  'Mobilização e Organização Comunitária',
  'Educação Ambiental e Patrimonial',
  'Oficinas Educativas e Culturais',

  // 3. Habilidades Práticas e Apoio Operacional
  'Conhecimento Local / Mateiro(a)',
  'Primeiros Socorros em Áreas Remotas',
  'Manejo de Viveiros e Sementes',
  'Comunicação, Fotografia e Documentário',
  'Captação de Recursos e Elaboração de Projetos',
  'Vendas e Atendimento ao Cliente',
  'Logística e Apoio em Campo',
];

const PROJETOS = [
  {
    title: 'Restauração de Nascentes no Cerrado',
    description:
      'Recuperação de nascentes e áreas degradadas com plantio de espécies nativas e mobilização das comunidades do entorno.',
    startDate: '2026-12-01',
    endDate: '2027-06-30',
  },
  {
    title: 'Agroecologia e Quintais Produtivos',
    description:
      'Apoio a famílias agricultoras com oficinas, assistência técnica e troca de saberes sobre produção agroecológica.',
    startDate: '2026-12-01',
    endDate: '2027-12-31',
  },
  {
    title: 'Ecoturismo de Base Comunitária',
    description:
      'Estruturação de roteiros conduzidos por comunidades locais, com formação de monitores e gestão responsável das trilhas.',
    startDate: '2027-01-15',
    endDate: null,
  },
];

type CriterioSeed = {
  exigeExperiencia?: boolean;
  educacaoMinima?: 'FUNDAMENTAL' | 'MEDIO' | 'GRADUACAO' | 'POS_GRADUACAO' | 'MESTRADO' | 'DOUTORADO';
  habilidadesExigidas?: string[];
};

const OPORTUNIDADES: Array<{
  title: string;
  projeto: string;
  categoria: string;
  description: string;
  atividades: string;
  duracao: string;
  disponibilidade: string;
  habilidades: string[];
  localAtuacao: string;
  isOpen: boolean;
  criterios?: CriterioSeed;
}> = [
  {
    title: 'Monitor(a) de Trilhas Ecológicas',
    projeto: 'Ecoturismo de Base Comunitária',
    categoria: 'Ecoturismo e Trilhas',
    description: 'Apoio à condução de grupos nas trilhas e à recepção de visitantes.',
    atividades: 'Acompanhar grupos nas trilhas\nApresentar a fauna e a flora local\nApoiar a recepção dos visitantes',
    duracao: '3 meses',
    disponibilidade: 'Finais de semana',
    habilidades: ['Condução de grupos', 'Primeiros socorros'],
    localAtuacao: 'Presencial, a combinar com a equipe',
    isOpen: true,
    criterios: { exigeExperiencia: true, educacaoMinima: 'MEDIO', habilidadesExigidas: ['Primeiros socorros'] },
  },
  {
    title: 'Apoio na Captação de Recursos',
    projeto: 'Restauração de Nascentes no Cerrado',
    categoria: 'Captação de Recursos e Elaboração de Projetos',
    description: 'Pesquisa de editais e apoio à escrita de propostas de financiamento.',
    atividades: 'Pesquisar editais abertos\nApoiar a escrita de propostas\nOrganizar a documentação exigida',
    duracao: '2 meses',
    disponibilidade: 'Meio período, remoto',
    habilidades: ['Escrita de projetos', 'Pesquisa de editais'],
    localAtuacao: 'Remoto',
    isOpen: true,
    criterios: { educacaoMinima: 'GRADUACAO' },
  },
  {
    title: 'Oficinas de Agroecologia',
    projeto: 'Agroecologia e Quintais Produtivos',
    categoria: 'Agroecologia e Produção Orgânica',
    description: 'Apoio às oficinas práticas com famílias agricultoras.',
    atividades: 'Preparar o material das oficinas\nApoiar a condução das atividades práticas\nRegistrar a participação das famílias',
    duracao: '6 meses',
    disponibilidade: 'Sábados pela manhã',
    habilidades: ['Agricultura familiar', 'Educação ambiental'],
    localAtuacao: 'Presencial, comunidades parceiras',
    isOpen: true,
  },
  {
    title: 'Apoio Jurídico em Regularização Fundiária',
    projeto: 'Restauração de Nascentes no Cerrado',
    categoria: 'Direito Ambiental e Agrário',
    description: 'Apoio à análise de documentos e à elaboração de peças em processos de regularização.',
    atividades: 'Analisar documentos fundiários\nRedigir minutas e pareceres simples\nApoiar o atendimento às comunidades',
    duracao: '4 meses',
    disponibilidade: 'Remoto, 6 horas por semana',
    habilidades: ['Direito ambiental', 'Redação jurídica'],
    localAtuacao: 'Remoto',
    isOpen: true,
    criterios: { exigeExperiencia: false, educacaoMinima: 'GRADUACAO', habilidadesExigidas: ['Direito ambiental'] },
  },
  {
    // Fechada: serve para testar o bloqueio da candidatura e o botão "Retomar" do gestor.
    title: 'Mutirão de Plantio de Mudas',
    projeto: 'Restauração de Nascentes no Cerrado',
    categoria: 'Agroecologia e Produção Orgânica',
    description: 'Mutirão de plantio de mudas nativas em áreas de nascente.',
    atividades: 'Preparar as covas\nPlantar e irrigar as mudas',
    duracao: '1 dia',
    disponibilidade: 'Um sábado, dia inteiro',
    habilidades: ['Trabalho em equipe'],
    localAtuacao: 'Presencial',
    isOpen: false,
  },
];

// Só fora de produção. Senha de desenvolvimento, nunca use em ambiente real.
const SENHA_TESTE = 'Teste@123';

const USUARIOS_TESTE = [
  {
    name: 'Cliente Teste',
    email: 'cliente@exemplo.com',
    role: 'CLIENTE' as const,
  },
  {
    name: 'Voluntária Teste',
    email: 'voluntario1@exemplo.com',
    role: 'VOLUNTARIO' as const,
    perfil: {
      bio: 'Disponível aos finais de semana. Tenho experiência com educação ambiental.',
      outros: 'Primeiros socorros, Educação ambiental',
      educacaoNivel: 'GRADUACAO' as const,
      educacaoCompletude: 'COMPLETO' as const,
      interesses: ['Ecoturismo e Trilhas', 'Agroecologia e Produção Orgânica'],
    },
    candidaturas: [
      { oportunidade: 'Monitor(a) de Trilhas Ecológicas', experienciaNaArea: true },
      { oportunidade: 'Oficinas de Agroecologia', experienciaNaArea: false },
    ],
  },
  {
    name: 'Voluntário em Formação',
    email: 'voluntario2@exemplo.com',
    role: 'VOLUNTARIO' as const,
    perfil: {
      bio: 'Estudante, disponível à noite e aos sábados.',
      outros: 'Pesquisa de editais',
      educacaoNivel: 'MEDIO' as const,
      educacaoCompletude: 'EM_ANDAMENTO' as const,
      interesses: ['Captação de Recursos e Elaboração de Projetos'],
    },
    candidaturas: [
      { oportunidade: 'Monitor(a) de Trilhas Ecológicas', experienciaNaArea: false },
      { oportunidade: 'Apoio na Captação de Recursos', experienciaNaArea: false },
    ],
  },
];

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error('DATABASE_URL não está definida para executar o seed.');
  }

  const adapter = new PrismaMariaDb(url);
  const prisma = new PrismaClient({ adapter });

  try {
    // 1. Categorias
    for (const nome of CATEGORIAS_INICIAIS) {
      await prisma.categoria.upsert({ where: { nome }, update: {}, create: { nome } });
    }
    console.log(`Categorias: ${CATEGORIAS_INICIAIS.length} verificadas/criadas.`);

    const categorias = new Map(
      (await prisma.categoria.findMany()).map((c) => [c.nome, c.id] as const),
    );
    const idCategoria = (nome: string) => {
      const id = categorias.get(nome);
      if (!id) throw new Error(`Categoria não encontrada no seed: ${nome}`);
      return id;
    };

    // 2. Projetos (sem campo único: confere pelo título antes de criar)
    const projetos = new Map<string, string>();
    let projetosCriados = 0;
    for (const p of PROJETOS) {
      let projeto = await prisma.projeto.findFirst({ where: { title: p.title } });
      if (!projeto) {
        projeto = await prisma.projeto.create({
          data: {
            title: p.title,
            description: p.description,
            startDate: p.startDate ? new Date(p.startDate) : null,
            endDate: p.endDate ? new Date(p.endDate) : null,
          },
        });
        projetosCriados++;
      }
      projetos.set(p.title, projeto.id);
    }
    console.log(`Projetos: ${projetosCriados} criado(s), ${PROJETOS.length - projetosCriados} já existiam.`);

    // 3. Oportunidades (com critérios do funil)
    const oportunidades = new Map<string, string>();
    let oportunidadesCriadas = 0;
    for (const o of OPORTUNIDADES) {
      let oportunidade = await prisma.oportunidade.findFirst({ where: { title: o.title } });
      if (!oportunidade) {
        const projetoId = projetos.get(o.projeto);
        if (!projetoId) throw new Error(`Projeto não encontrado no seed: ${o.projeto}`);
        oportunidade = await prisma.oportunidade.create({
          data: {
            title: o.title,
            description: o.description,
            atividades: o.atividades,
            duracao: o.duracao,
            disponibilidade: o.disponibilidade,
            habilidades: JSON.stringify(o.habilidades),
            localAtuacao: o.localAtuacao,
            isOpen: o.isOpen,
            projetoId,
            categoriaId: idCategoria(o.categoria),
            ...(o.criterios && {
              criteriosFunil: {
                create: {
                  exigeExperiencia: o.criterios.exigeExperiencia ?? false,
                  educacaoMinima: o.criterios.educacaoMinima ?? null,
                  habilidadesExigidas: o.criterios.habilidadesExigidas?.length
                    ? JSON.stringify(o.criterios.habilidadesExigidas)
                    : null,
                },
              },
            }),
          },
        });
        oportunidadesCriadas++;
      }
      oportunidades.set(o.title, oportunidade.id);
    }
    console.log(
      `Oportunidades: ${oportunidadesCriadas} criada(s), ${OPORTUNIDADES.length - oportunidadesCriadas} já existiam.`,
    );

    // 4. Usuários de teste, perfis e candidaturas (nunca em produção)
    if (process.env.NODE_ENV === 'production') {
      console.log('Usuários de teste ignorados (NODE_ENV=production).');
      return;
    }

    const passwordHash = await bcrypt.hash(SENHA_TESTE, 10);
    let usuariosCriados = 0;
    for (const u of USUARIOS_TESTE) {
      let user = await prisma.user.findUnique({ where: { email: u.email } });
      if (!user) {
        user = await prisma.user.create({
          data: {
            name: u.name,
            email: u.email,
            passwordHash,
            phone: '61999999999',
            dataNascimento: new Date('1998-05-20'),
            cidade: 'Brasília',
            estado: 'DF',
            role: u.role,
            consents: { create: { termVersion: 'seed' } },
            ...('perfil' in u && u.perfil && {
              perfilVoluntario: {
                create: {
                  bio: u.perfil.bio,
                  outros: u.perfil.outros,
                  educacaoNivel: u.perfil.educacaoNivel,
                  educacaoCompletude: u.perfil.educacaoCompletude,
                  interesses: {
                    create: u.perfil.interesses.map((nome) => ({
                      categoria: { connect: { id: idCategoria(nome) } },
                    })),
                  },
                },
              },
            }),
          },
        });
        usuariosCriados++;
      }

      if ('candidaturas' in u && u.candidaturas) {
        const perfil = await prisma.perfilVoluntario.findUnique({ where: { userId: user.id } });
        if (perfil) {
          for (const c of u.candidaturas) {
            const oportunidadeId = oportunidades.get(c.oportunidade);
            if (!oportunidadeId) throw new Error(`Oportunidade não encontrada no seed: ${c.oportunidade}`);
            await prisma.candidatura.upsert({
              where: { perfilId_oportunidadeId: { perfilId: perfil.id, oportunidadeId } },
              update: {},
              create: { perfilId: perfil.id, oportunidadeId, experienciaNaArea: c.experienciaNaArea },
            });
          }
        }
      }
    }
    console.log(
      `Usuários de teste: ${usuariosCriados} criado(s) (senha de desenvolvimento: ${SENHA_TESTE}).`,
    );
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error('Erro ao executar seed:', err);
  process.exit(1);
});
