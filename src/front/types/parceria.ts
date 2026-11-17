// Contrato da API de parcerias (PedidoParceria no back).

export type StatusParceria = "RECEIVED" | "IN_ANALYSIS" | "ACCEPTED" | "DECLINED";

export interface PedidoParceriaDto {
  id: string;
  organization: string;
  cnpj: string | null;
  contactName: string;
  contactEmail: string;
  contactPhone: string | null;
  proposal: string;
  status: StatusParceria;
  createdAt: string;
}

// Corpo do POST /parcerias (CreatePedidoParceriaDto): CNPJ e telefone são opcionais.
export interface CreatePedidoParceriaPayload {
  organization: string;
  cnpj?: string;
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  proposal: string;
}

export interface ParceriaMutationResponse {
  message: string;
  data: PedidoParceriaDto;
}
