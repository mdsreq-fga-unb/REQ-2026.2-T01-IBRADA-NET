import 'dotenv/config';
import { PrismaClient } from '../src/generated/prisma/client.js';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

const CATEGORIAS_INICIAIS = [
  'Ecoturismo e Condução de Trilhas',
  'Gestão de Projetos e Captação de Recursos',
  'Cultura e Agricultura familiar',
  'Agroecologia e Reflorestamento',
  'Apoio Administrativo e Jurídico',
  'Saúde e Bem-Estar Comunitário',
];

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error('DATABASE_URL não está definida para executar o seed.');
  }

  const adapter = new PrismaMariaDb(url);
  const prisma = new PrismaClient({ adapter });

  try {
    for (const nome of CATEGORIAS_INICIAIS) {
      await prisma.categoria.upsert({
        where: { nome },
        update: {},
        create: { nome },
      });
    }
    console.log(`Seed concluído: ${CATEGORIAS_INICIAIS.length} categorias verificadas/criadas.`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error('Erro ao executar seed:', err);
  process.exit(1);
});