import { api } from "./api";

export type StatusReserva = "PENDING" | "CONFIRMED" | "CANCELED";
export type StatusPagamento = "PENDING" | "PAID" | "FAILED";

export type Participante = {
  nome: string;
  documento: string; // CPF ou RG
  telefone?: string;
  observacoes?: string; // restrições alimentares, necessidades de acessibilidade, etc.
};

export type Reserva = {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  experienceId: string;
  experienceSlug: string;
  experienceTitle: string;
  experienceStartsAt: string;
  experienceEndsAt: string;
  seats: number;
  unitPrice: number;
  totalAmount: number;
  participantes: Participante[];
  status: StatusReserva;
  createdAt: string;
  expiresAt: string; // 30 minutos a partir da criação
  isConfirmedByCustomer: boolean;
  paymentMethod?: "PIX" | "CREDIT_CARD";
  paymentStatus?: StatusPagamento;
  transactionId?: string;
  paidAt?: string;
  paymentError?: string;
};

export type CriarReservaInput = {
  userId: string;
  userName: string;
  userEmail: string;
  experienceId: string;
  experienceSlug: string;
  experienceTitle: string;
  experienceStartsAt: string;
  experienceEndsAt: string;
  seats: number;
  unitPrice: number;
  participantes: Participante[];
};

export type ProcessarPagamentoInput = {
  metodo: "PIX" | "CREDIT_CARD";
  cartao?: {
    numero: string;
    nome: string;
    validade: string;
    cvv: string;
    parcelas: number;
  };
  simulacaoResultado?: "APROVADO" | "PENDENTE" | "RECUSADO";
};

const STORAGE_KEY = "ibrada_reservas_v1";
const TEMPO_EXPIRACAO_MINUTOS = 30;

function lerReservasLocais(): Reserva[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Reserva[]) : [];
  } catch {
    return [];
  }
}

function salvarReservasLocais(reservas: Reserva[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reservas));
  } catch {
    // Ignorado se quota excedida
  }
}

export function estaExpirada(reserva: Reserva): boolean {
  if (reserva.status !== "PENDING") return false;
  const agora = Date.now();
  const limite = new Date(reserva.expiresAt).getTime();
  return agora >= limite;
}

export function calcularSegundosRestantes(reserva: Reserva): number {
  if (reserva.status !== "PENDING") return 0;
  const agora = Date.now();
  const limite = new Date(reserva.expiresAt).getTime();
  const diferencaSegundos = Math.floor((limite - agora) / 1000);
  return Math.max(0, diferencaSegundos);
}

export async function criarReserva(input: CriarReservaInput): Promise<Reserva> {
  const agora = new Date();
  const expiresAt = new Date(agora.getTime() + TEMPO_EXPIRACAO_MINUTOS * 60 * 1000);
  const totalAmount = input.seats * input.unitPrice;

  const novaReserva: Reserva = {
    id: `res-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
    userId: input.userId,
    userName: input.userName,
    userEmail: input.userEmail,
    experienceId: input.experienceId,
    experienceSlug: input.experienceSlug,
    experienceTitle: input.experienceTitle,
    experienceStartsAt: input.experienceStartsAt,
    experienceEndsAt: input.experienceEndsAt,
    seats: input.seats,
    unitPrice: input.unitPrice,
    totalAmount,
    participantes: input.participantes,
    status: "PENDING",
    createdAt: agora.toISOString(),
    expiresAt: expiresAt.toISOString(),
    isConfirmedByCustomer: false,
    paymentStatus: "PENDING",
  };

  // Tenta persistir no backend caso o endpoint /bookings exista
  try {
    const doBack = await api<Reserva>("/bookings", {
      method: "POST",
      body: {
        experienceId: input.experienceId,
        seats: input.seats,
        participantes: input.participantes,
      },
    });
    if (doBack && doBack.id) {
      salvarReservaLocalmente({ ...novaReserva, id: doBack.id });
      return { ...novaReserva, id: doBack.id };
    }
  } catch {
    // Fallback silencioso para armazenamento local consistente
  }

  salvarReservaLocalmente(novaReserva);
  return novaReserva;
}

function salvarReservaLocalmente(reserva: Reserva) {
  const locais = lerReservasLocais();
  const index = locais.findIndex((r) => r.id === reserva.id);
  if (index >= 0) {
    locais[index] = reserva;
  } else {
    locais.unshift(reserva);
  }
  salvarReservasLocais(locais);
}

export async function obterReserva(id: string): Promise<Reserva | null> {
  // 1. Tenta buscar no backend
  try {
    const doBack = await api<Reserva>(`/bookings/${id}`);
    if (doBack && doBack.id) {
      salvarReservaLocalmente(doBack);
      return doBack;
    }
  } catch {
    // Fallback para storage local
  }

  // 2. Consulta no storage local
  const locais = lerReservasLocais();
  const encontrada = locais.find((r) => r.id === id);
  if (!encontrada) return null;

  // Auto-expiração se passou dos 30 minutos e ainda está pendente
  if (estaExpirada(encontrada)) {
    encontrada.status = "CANCELED";
    salvarReservaLocalmente(encontrada);
  }

  return encontrada;
}

export async function atualizarDadosReserva(
  id: string,
  seats: number,
  participantes: Participante[],
): Promise<Reserva | null> {
  const reserva = await obterReserva(id);
  if (!reserva) return null;

  reserva.seats = seats;
  reserva.participantes = participantes;
  reserva.totalAmount = seats * reserva.unitPrice;

  try {
    await api<Reserva>(`/bookings/${id}`, {
      method: "PATCH",
      body: { seats, participantes },
    });
  } catch {
    // Prossegue com atualização local
  }

  salvarReservaLocalmente(reserva);
  return reserva;
}

export async function confirmarReserva(id: string): Promise<Reserva | null> {
  const reserva = await obterReserva(id);
  if (!reserva) return null;

  if (estaExpirada(reserva)) {
    reserva.status = "CANCELED";
    salvarReservaLocalmente(reserva);
    throw new Error("Esta reserva expirou após 30 minutos. Por favor, inicie uma nova reserva.");
  }

  reserva.isConfirmedByCustomer = true;

  try {
    await api<Reserva>(`/bookings/${id}/confirm`, {
      method: "POST",
    });
  } catch {
    // Prossegue localmente
  }

  salvarReservaLocalmente(reserva);
  return reserva;
}

export async function processarPagamento(
  id: string,
  input: ProcessarPagamentoInput,
): Promise<{ reserva: Reserva; status: StatusPagamento; mensagem: string }> {
  const reserva = await obterReserva(id);
  if (!reserva) {
    throw new Error("Reserva não encontrada.");
  }

  if (estaExpirada(reserva)) {
    reserva.status = "CANCELED";
    salvarReservaLocalmente(reserva);
    throw new Error("Esta reserva expirou após 30 minutos e as vagas foram liberadas.");
  }

  const resultado = input.simulacaoResultado ?? "APROVADO";
  const transactionId = `TX-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

  reserva.paymentMethod = input.metodo;
  reserva.transactionId = transactionId;

  if (resultado === "APROVADO") {
    reserva.status = "CONFIRMED";
    reserva.paymentStatus = "PAID";
    reserva.paidAt = new Date().toISOString();
    delete reserva.paymentError;

    salvarReservaLocalmente(reserva);

    try {
      await api(`/bookings/${id}/pay`, {
        method: "POST",
        body: { status: "PAID", transactionId, method: input.metodo },
      });
    } catch {
      // Ignora erro de rede no mock
    }

    return {
      reserva,
      status: "PAID",
      mensagem: "Pagamento aprovado com sucesso! Sua vaga no ecoturismo está garantida.",
    };
  }

  if (resultado === "PENDENTE") {
    reserva.status = "PENDING";
    reserva.paymentStatus = "PENDING";
    salvarReservaLocalmente(reserva);

    return {
      reserva,
      status: "PENDING",
      mensagem: "Pagamento em processamento. Aguardando a compensação do PIX.",
    };
  }

  // RECUSADO
  reserva.paymentStatus = "FAILED";
  reserva.paymentError = "Transação não autorizada pelo emissor do pagamento (Saldo insuficiente ou dados inválidos).";
  salvarReservaLocalmente(reserva);

  return {
    reserva,
    status: "FAILED",
    mensagem: reserva.paymentError,
  };
}

export async function expirarReserva(id: string): Promise<Reserva | null> {
  const reserva = await obterReserva(id);
  if (!reserva) return null;
  reserva.status = "CANCELED";
  salvarReservaLocalmente(reserva);
  return reserva;
}

export async function listarMinhasReservas(userId: string): Promise<Reserva[]> {
  try {
    const doBack = await api<Reserva[]>("/bookings/my");
    if (Array.isArray(doBack) && doBack.length > 0) {
      return doBack;
    }
  } catch {
    // Fallback para storage local
  }

  const locais = lerReservasLocais();
  // Atualiza expirações
  const atualizadas = locais.map((r) => {
    if (r.userId === userId && estaExpirada(r)) {
      return { ...r, status: "CANCELED" as StatusReserva };
    }
    return r;
  });
  salvarReservasLocais(atualizadas);

  return atualizadas
    .filter((r) => r.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}
