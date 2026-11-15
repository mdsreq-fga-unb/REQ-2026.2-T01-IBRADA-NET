import { ApiError, api } from "@/lib/api";
import { normalizar, type Oportunidade, type OportunidadeApi } from "@/lib/oportunidades";

// Chamadas restritas ao GESTOR (US13 e RF19). O contrato abaixo segue o escopo do
// back de oportunidades; se os nomes mudarem lá, o ajuste é só neste arquivo.
//   GET   /oportunidades/gestor   todas as oportunidades (abertas e pausadas)  [a confirmar]
//   GET   /projetos               projetos para o seletor
//   GET   /categorias             categorias para o seletor                    [a confirmar]
//   POST  /oportunidades          cadastra (US13)
//   PATCH /oportunidades/:id      abre ou fecha (RF19)

export type Opcao = { id: string; label: string };

export type NovaOportunidade = {
  name: string;
  projectId: string;
  categoryId: string;
  activities: string;
  duration: string;
  availability: string;
  skills: string[];
  funnelCriteria: string[];
};

// Critérios do funil (RN05): rótulo da tela -> código enviado à API [a confirmar].
const CODIGO_CRITERIO: Record<string, string> = {
  "Conhecimento técnico": "CONHECIMENTO_TECNICO",
  "Experiência prévia": "EXPERIENCIA_PREVIA",
  "Aptidão física": "APTIDAO_FISICA",
};

const lista = <T>(dados: T[] | { data: T[] }): T[] => (Array.isArray(dados) ? dados : dados.data);

export async function listarOportunidadesGestor(): Promise<Oportunidade[]> {
  const dados = await api<OportunidadeApi[] | { data: OportunidadeApi[] }>("/oportunidades/gestor");
  return lista(dados).map(normalizar);
}

export async function listarProjetos(): Promise<Opcao[]> {
  const dados = await api<Array<{ id: string; title: string }> | { data: Array<{ id: string; title: string }> }>(
    "/projetos",
  );
  return lista(dados).map(({ id, title }) => ({ id, label: title }));
}

export async function listarCategorias(): Promise<Opcao[]> {
  const dados = await api<Array<{ id: string; nome: string }> | { data: Array<{ id: string; nome: string }> }>(
    "/categorias",
  );
  return lista(dados).map(({ id, nome }) => ({ id, label: nome }));
}

export async function alterarStatusOportunidade(id: string, aberta: boolean) {
  return api(`/oportunidades/${encodeURIComponent(id)}`, { method: "PATCH", body: { isOpen: aberta } });
}

// Traduz os erros da API em mensagens para o gestor (sessão, permissão e validação).
export function mensagemDeErro(erro: unknown, padrao: string): string {
  if (!(erro instanceof ApiError)) return padrao;
  if (erro.status === 401) return "Sua sessão expirou. Entre novamente para continuar.";
  if (erro.status === 403) return "Você não tem permissão para esta ação.";
  if (erro.status === 400 && erro.message) return erro.message;
  if (erro.status === 0) return erro.message;
  return padrao;
}

export async function criarOportunidade(dados: NovaOportunidade) {
  return api("/oportunidades", {
    method: "POST",
    body: {
      title: dados.name,
      projetoId: dados.projectId,
      categoriaId: dados.categoryId,
      atividades: dados.activities,
      duracao: dados.duration,
      disponibilidade: dados.availability,
      habilidades: dados.skills,
      criterios: dados.funnelCriteria.map((c) => CODIGO_CRITERIO[c] ?? c),
    },
  });
}
