import { ApiError, api } from "@/lib/api";
import type { NivelEducacao } from "@/lib/brasil";
import { normalizar, type Oportunidade, type OportunidadeApi } from "@/lib/oportunidades";

// Chamadas restritas ao GESTOR (US13 e RF19). Se os nomes mudarem no back, o ajuste
// é só neste arquivo.
//   GET   /oportunidades/gestor   todas as oportunidades (abertas e fechadas)
//   GET   /projetos               projetos para o seletor
//   GET   /categorias             categorias para o seletor (rota pública)
//   POST  /oportunidades          cadastra (US13)
//   PATCH /oportunidades/:id      abre ou fecha (RF19)

export type Opcao = { id: string; label: string };

// Critérios do funil (RN05) que o back avalia: experiência na área, escolaridade
// mínima e habilidades exigidas (comparadas com as declaradas no perfil do voluntário).
export type CriteriosFunil = {
  exigeExperiencia: boolean;
  educacaoMinima: NivelEducacao | "";
  habilidadesExigidas: string[];
};

export type NovaOportunidade = {
  name: string;
  description: string;
  projectId: string;
  categoryId: string;
  activities: string;
  duration: string;
  availability: string;
  skills: string[];
  funnelCriteria: CriteriosFunil;
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
  const { exigeExperiencia, educacaoMinima, habilidadesExigidas } = dados.funnelCriteria;
  // Só envia o bloco quando o gestor escolheu algum critério (sem critérios, todos ficam aptos).
  const temCriterio = exigeExperiencia || Boolean(educacaoMinima) || habilidadesExigidas.length > 0;

  return api("/oportunidades", {
    method: "POST",
    body: {
      title: dados.name,
      description: dados.description,
      projetoId: dados.projectId,
      categoriaId: dados.categoryId,
      atividades: dados.activities,
      duracao: dados.duration,
      disponibilidade: dados.availability,
      habilidades: dados.skills,
      ...(temCriterio && {
        criteriosFunil: {
          ...(exigeExperiencia && { exigeExperiencia: true }),
          ...(educacaoMinima && { educacaoMinima }),
          ...(habilidadesExigidas.length > 0 && { habilidadesExigidas }),
        },
      }),
    },
  });
}

export type EditarOportunidadePayload = {
  title?: string;
  description?: string;
  duracao?: string;
  disponibilidade?: string;
  atividades?: string;
  localAtuacao?: string;
  habilidades?: string[];
  isOpen?: boolean;
};

export async function atualizarOportunidade(id: string, dados: EditarOportunidadePayload) {
  return api(`/oportunidades/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: dados,
  });
}
