import { api } from "@/lib/api";
import type {
  CreatePedidoParceriaPayload,
  ParceriaMutationResponse,
  PedidoParceriaDto,
  StatusParceria,
} from "@/types/parceria";

export type {
  CreatePedidoParceriaPayload,
  ParceriaMutationResponse,
  PedidoParceriaDto,
  StatusParceria,
};

// Nomes dos status como na US20: Nova, Em análise, Respondida e Arquivada.
// Os valores do back são RECEIVED, IN_ANALYSIS, ACCEPTED e DECLINED.
export const STATUS_PARCERIA: Array<{ value: StatusParceria; label: string }> = [
  { value: "RECEIVED", label: "Nova" },
  { value: "IN_ANALYSIS", label: "Em análise" },
  { value: "ACCEPTED", label: "Respondida" },
  { value: "DECLINED", label: "Arquivada" },
];

export function rotuloStatusParceria(status: StatusParceria): string {
  return STATUS_PARCERIA.find((s) => s.value === status)?.label ?? status;
}

// POST /parcerias (público, US19)
export function enviarParceria(payload: CreatePedidoParceriaPayload) {
  return api<ParceriaMutationResponse>("/parcerias", { method: "POST", body: payload });
}

// GET /parcerias (gestor, US20)
export function listarParcerias() {
  return api<PedidoParceriaDto[]>("/parcerias");
}

// GET /parcerias/:id (gestor, US20)
export function buscarParceria(id: string) {
  return api<PedidoParceriaDto>(`/parcerias/${encodeURIComponent(id)}`);
}

// PATCH /parcerias/:id/status (gestor, US20)
export function atualizarStatusParceria(id: string, status: StatusParceria) {
  return api<ParceriaMutationResponse>(`/parcerias/${encodeURIComponent(id)}/status`, {
    method: "PATCH",
    body: { status },
  });
}

export function formatarDataHora(iso: string): string {
  const data = new Date(iso);
  if (Number.isNaN(data.getTime())) return "—";
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(data);
}
