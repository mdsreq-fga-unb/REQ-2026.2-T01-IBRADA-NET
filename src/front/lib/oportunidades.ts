import { ApiError, api } from "@/lib/api";

// Modelo usado pelas telas de voluntariado (US21 e US14).
// `formato` e `local` não constam nas histórias: são opcionais e só aparecem
// nas telas quando a API os enviar.
export type Oportunidade = {
  id: string;
  titulo: string;
  categoria?: string;
  formato?: string;
  local?: string;
  projeto?: string;
  projetoDescricao?: string;
  duracao: string;
  disponibilidade: string;
  aberta: boolean;
  atividades: string[];
  habilidades: string[];
};

// Formato da API de oportunidades (GET /oportunidades e /oportunidades/:id).
// Toda a adaptação fica concentrada em `normalizar`, para absorver ajustes
// de nome sem mexer nas telas.
export type OportunidadeApi = {
  id: string;
  title: string;
  duracao: string;
  disponibilidade: string;
  isOpen?: boolean;
  formato?: string;
  local?: string;
  localAtuacao?: string | null;
  categoria?: string | { nome: string };
  projeto?: string | { title: string; description?: string };
  atividades?: string | string[];
  habilidades?: Array<string | { nome: string }>;
};

export function normalizar(raw: OportunidadeApi): Oportunidade {
  const projeto = typeof raw.projeto === "string" ? { title: raw.projeto } : raw.projeto;
  const atividades =
    typeof raw.atividades === "string"
      ? raw.atividades.split(/\r?\n/).map((linha) => linha.trim()).filter(Boolean)
      : (raw.atividades ?? []);

  return {
    id: raw.id,
    titulo: raw.title,
    categoria: typeof raw.categoria === "string" ? raw.categoria : raw.categoria?.nome,
    formato: raw.formato,
    local: raw.local ?? raw.localAtuacao ?? undefined,
    projeto: projeto?.title,
    projetoDescricao: projeto && "description" in projeto ? projeto.description : undefined,
    duracao: raw.duracao,
    disponibilidade: raw.disponibilidade,
    aberta: raw.isOpen ?? true,
    atividades,
    habilidades: (raw.habilidades ?? []).map((h) => (typeof h === "string" ? h : h.nome)),
  };
}

// US21: lista pública das oportunidades abertas.
export async function listarOportunidades(): Promise<Oportunidade[]> {
  const dados = await api<OportunidadeApi[] | { data: OportunidadeApi[] }>("/oportunidades");
  const lista = Array.isArray(dados) ? dados : dados.data;
  return lista.map(normalizar);
}

// US14: detalhe público; devolve null quando a API responde 404.
export async function buscarOportunidade(id: string): Promise<Oportunidade | null> {
  try {
    const dados = await api<OportunidadeApi | { data: OportunidadeApi }>(
      `/oportunidades/${encodeURIComponent(id)}`,
    );
    return normalizar("data" in dados ? dados.data : dados);
  } catch (erro) {
    if (erro instanceof ApiError && erro.status === 404) return null;
    throw erro;
  }
}

// US16: candidatura do voluntário autenticado.
export type StatusCandidatura = { candidatado: boolean; temPerfil: boolean };

export async function statusCandidatura(id: string): Promise<StatusCandidatura> {
  return api<StatusCandidatura>(`/oportunidades/${encodeURIComponent(id)}/candidatura`);
}

export async function candidatar(id: string): Promise<void> {
  await api(`/oportunidades/${encodeURIComponent(id)}/candidaturas`, { method: "POST" });
}

// Quem ainda não tem perfil de voluntário é levado a Minha Conta; guardamos a vaga
// para voltar a ela depois de criar o perfil.
const RETORNO_KEY = "ibrada:retorno_candidatura";

export function guardarRetornoCandidatura(path: string) {
  try {
    sessionStorage.setItem(RETORNO_KEY, path);
  } catch {
    /* storage indisponível: o usuário volta pela home */
  }
}

export function consumirRetornoCandidatura(): string | null {
  try {
    const path = sessionStorage.getItem(RETORNO_KEY);
    sessionStorage.removeItem(RETORNO_KEY);
    return path && path.startsWith("/") ? path : null;
  } catch {
    return null;
  }
}

