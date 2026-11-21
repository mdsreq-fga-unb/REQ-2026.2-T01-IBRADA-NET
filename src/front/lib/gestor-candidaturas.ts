import { api } from "@/lib/api";
import type { NivelEducacao, StatusEducacao } from "@/lib/brasil";

export type EtapaCandidatura =
  | "INSCRITO"
  | "EM_ANALISE"
  | "ENTREVISTA"
  | "APROVADO"
  | "REJEITADO";

export const ETAPA_LABELS: Record<EtapaCandidatura, string> = {
  INSCRITO: "Inscrito",
  EM_ANALISE: "Em análise",
  ENTREVISTA: "Entrevista",
  APROVADO: "Aprovado",
  REJEITADO: "Não selecionado",
};

export const ETAPAS_FUNIL: EtapaCandidatura[] = [
  "INSCRITO",
  "EM_ANALISE",
  "ENTREVISTA",
  "APROVADO",
  "REJEITADO",
];

export type CandidaturaGestorItem = {
  id: string;
  status: EtapaCandidatura;
  experienciaNaArea: boolean;
  mensagem: string | null;
  createdAt: string;
  updatedAt: string;
  oportunidade: {
    id: string;
    title: string;
    isOpen: boolean;
    categoria: { id: string; nome: string };
    projeto: { id: string; title: string };
  };
  voluntario: {
    perfilId: string;
    userId: string;
    name: string;
    email: string;
    phone: string | null;
    cidade: string | null;
    estado: string | null;
    bio: string | null;
    outros: string | null;
    educacaoNivel: NivelEducacao | null;
    educacaoCompletude: StatusEducacao | null;
    interesses: string[];
  };
  triagemFunil: {
    apto: boolean;
    motivos: string[];
  };
};

export type ListCandidaturasResponse = {
  data: CandidaturaGestorItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  resumo: {
    total: number;
    porStatus: Record<EtapaCandidatura, number>;
  };
};

export async function listarCandidaturasGestor(params: {
  oportunidadeId?: string;
  status?: EtapaCandidatura | "";
  busca?: string;
  page?: number;
  limit?: number;
}): Promise<ListCandidaturasResponse> {
  const search = new URLSearchParams();
  if (params.oportunidadeId) search.set("oportunidadeId", params.oportunidadeId);
  if (params.status) search.set("status", params.status);
  if (params.busca?.trim()) search.set("busca", params.busca.trim());
  if (params.page) search.set("page", String(params.page));
  if (params.limit) search.set("limit", String(params.limit));

  const qs = search.toString();
  return api<ListCandidaturasResponse>(`/candidaturas${qs ? `?${qs}` : ""}`);
}

export async function atualizarStatusCandidatura(
  id: string,
  status: EtapaCandidatura,
): Promise<{ message: string; data: { id: string; status: EtapaCandidatura } }> {
  return api(`/candidaturas/${encodeURIComponent(id)}/status`, {
    method: "PATCH",
    body: { status },
  });
}

export type MinhaCandidaturaItem = {
  id: string;
  status: EtapaCandidatura;
  experienciaNaArea: boolean;
  mensagem: string | null;
  createdAt: string;
  updatedAt: string;
  oportunidade: {
    id: string;
    title: string;
    duracao: string;
    disponibilidade: string;
    isOpen: boolean;
    categoria: { id: string; nome: string };
    projeto: { id: string; title: string };
  };
};

export async function listarMinhasCandidaturas(): Promise<MinhaCandidaturaItem[]> {
  return api<MinhaCandidaturaItem[]>("/candidaturas/minhas");
}