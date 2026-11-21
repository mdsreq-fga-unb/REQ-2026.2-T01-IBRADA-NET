import type { Categoria } from "@/lib/api";

export type GrupoCategoria = {
  titulo: string;
  descricao: string;
  categorias: Categoria[];
};

const PERFIL_VINCULO = new Set([
  "Estudante de Ensino Médio",
  "Estudante Universitário / Graduação",
  "Pós-graduando / Pesquisador",
  "Profissional / Consultor Técnico",
  "Agricultor(a) Familiar",
  "Morador(a) de Comunidade Rural ou Periferia",
  "Indígena",
  "Quilombola",
  "Comunidade Tradicional / Extrativista",
  "Guia ou Condutor(a) de Turismo",
  "Praticante de Trilhas / Ecoturista",
]);

const AREAS_PROJETO = new Set([
  "Geoprocessamento / SIG / Mapeamento",
  "Regularização Fundiária e Ambiental (CAR)",
  "Topografia e Memorial Descritivo",
  "Direito Ambiental e Agrário",
  "Ecoturismo e Trilhas",
  "Turismo de Base Comunitária (TBC)",
  "Venda e Operação de Pacotes Turísticos",
  "Unidades de Conservação (UC) e RPPN",
  "Plano de Manejo e Plano Diretor de UC",
  "Governança do Turismo",
  "Agroecologia e Produção Orgânica",
  "Sistemas Agroflorestais (SAFs)",
  "Reflorestamento e Recuperação de Áreas Degradadas (PRAD)",
  "Corredores Ecológicos",
  "Assistência Técnica e Extensão Rural (ATER)",
  "Inclusão Socioprodutiva",
  "Mobilização e Organização Comunitária",
  "Educação Ambiental e Patrimonial",
  "Oficinas Educativas e Culturais",
]);

const HABILIDADES_PRATICAS = new Set([
  "Conhecimento Local / Mateiro(a)",
  "Primeiros Socorros em Áreas Remotas",
  "Manejo de Viveiros e Sementes",
  "Comunicação, Fotografia e Documentário",
  "Captação de Recursos e Elaboração de Projetos",
  "Vendas e Atendimento ao Cliente",
  "Logística e Apoio em Campo",
]);

export function agruparCategorias(categorias: Categoria[]): GrupoCategoria[] {
  const perfil: Categoria[] = [];
  const projetos: Categoria[] = [];
  const praticas: Categoria[] = [];
  const outras: Categoria[] = [];

  for (const cat of categorias) {
    if (PERFIL_VINCULO.has(cat.nome)) {
      perfil.push(cat);
    } else if (AREAS_PROJETO.has(cat.nome)) {
      projetos.push(cat);
    } else if (HABILIDADES_PRATICAS.has(cat.nome)) {
      praticas.push(cat);
    } else {
      outras.push(cat);
    }
  }

  const grupos: GrupoCategoria[] = [
    {
      titulo: "1. Perfil e Vínculo Comunitário",
      descricao: "Identifique sua origem, formação ou vínculo com comunidades e territórios.",
      categorias: perfil,
    },
    {
      titulo: "2. Áreas de Projeto (Alinhadas ao IBRADA)",
      descricao: "Frentes temáticas de atuação em regularização, ecoturismo, agroecologia e educação.",
      categorias: projetos,
    },
    {
      titulo: "3. Habilidades Práticas e Apoio Operacional",
      descricao: "Competências técnicas e operacionais para ações em campo ou apoio remoto.",
      categorias: praticas,
    },
  ];

  if (outras.length > 0) {
    grupos.push({
      titulo: "Outras áreas cadastradas",
      descricao: "Categorias complementares adicionadas pela gestão do IBRADA.",
      categorias: outras,
    });
  }

  return grupos.filter((g) => g.categorias.length > 0);
}