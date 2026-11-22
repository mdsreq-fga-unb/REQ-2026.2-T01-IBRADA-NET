import { api } from "@/lib/api";
import type {
  BiomaCategoria,
  CreateExperienciaPayload,
  EtapaRoteiro,
  ExperienciaDto,
  ExperienciaResponseDto,
  ExperienciaVisualMeta,
  NivelDificuldade,
  UpdateDisponibilidadePayload,
} from "@/types/experiencia";

export type {
  BiomaCategoria,
  CreateExperienciaPayload,
  EtapaRoteiro,
  ExperienciaDto,
  ExperienciaResponseDto,
  ExperienciaVisualMeta,
  NivelDificuldade,
  UpdateDisponibilidadePayload,
};

export interface ExperienciaMutationResponse {
  message: string;
  data: ExperienciaResponseDto;
}

const DIFICULDADE_LABELS: Record<NivelDificuldade, string> = {
  leve: "Dificuldade leve",
  moderada: "Dificuldade moderada",
  intensa: "Dificuldade intensa",
};

// Imagem neutra usada só em pacotes antigos sem nenhuma foto cadastrada.
export const IMAGEM_SEM_FOTO =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="1400" height="900"><rect width="100%" height="100%" fill="#d9d4c7"/></svg>',
  );

const DIFICULDADE_API: Record<string, NivelDificuldade> = {
  LEVE: "leve",
  MODERADA: "moderada",
  INTENSA: "intensa",
};

export const BIOMAS_OPCOES: readonly BiomaCategoria[] = [
  "Cerrado",
  "Amazônia",
  "Caatinga",
  "Mata Atlântica",
  "Pantanal",
  "Pampa",
];

export async function listarExperiencias(): Promise<ExperienciaResponseDto[]> {
  return api<ExperienciaResponseDto[]>("/experiencias");
}

export async function buscarExperienciaPorSlug(
  slug: string,
): Promise<ExperienciaResponseDto> {
  return api<ExperienciaResponseDto>(
    `/experiencias/${encodeURIComponent(slug)}`,
  );
}

export async function criarExperiencia(
  payload: CreateExperienciaPayload,
): Promise<ExperienciaMutationResponse> {
  return api<ExperienciaMutationResponse>("/experiencias", {
    method: "POST",
    body: payload,
  });
}

export async function atualizarDisponibilidadeExperiencia(
  id: string,
  payload: UpdateDisponibilidadePayload,
): Promise<ExperienciaMutationResponse> {
  return api<ExperienciaMutationResponse>(
    `/experiencias/${encodeURIComponent(id)}/disponibilidade`,
    {
      method: "PATCH",
      body: payload,
    },
  );
}

function parsePriceNumber(price: string | number): number {
  if (typeof price === "number") return price;
  const cleaned = price.trim().replace(/\s+/g, "");
  if (cleaned.includes(",") && cleaned.includes(".")) {
    return Number(cleaned.replace(/\./g, "").replace(",", "."));
  }
  return Number(cleaned.replace(",", "."));
}

export function formatarPrecoExperiencia(price: string | number): string {
  const numericValue = parsePriceNumber(price);
  if (!Number.isFinite(numericValue)) return "Consulte";

  const cents = Math.round(numericValue * 100);
  const hasCents = cents % 100 !== 0;

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: hasCents ? 2 : 0,
    maximumFractionDigits: hasCents ? 2 : 0,
  })
    .format(numericValue)
    .replace(/\u00a0/g, " ");
}

export function calcularPrecoTotalExperiencia(
  price: string | number,
  participantes: number,
): string {
  const unitValue = parsePriceNumber(price);
  if (!Number.isFinite(unitValue)) return "Consulte";

  const quantidade = Math.max(1, Math.floor(participantes));
  const unitCents = Math.round(unitValue * 100);
  const totalCents = unitCents * quantidade;
  const hasCents = totalCents % 100 !== 0;

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: hasCents ? 2 : 0,
    maximumFractionDigits: hasCents ? 2 : 0,
  })
    .format(totalCents / 100)
    .replace(/\u00a0/g, " ");
}

export function formatarDataCurta(isoDate: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return "Data a definir";

  return new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

// Período real do pacote: "1 dez 2026" ou "1 dez 2026 a 3 dez 2026".
export function formatarPeriodoExperiencia(startsAt: string, endsAt: string): string {
  const inicio = formatarDataCurta(startsAt);
  const fim = formatarDataCurta(endsAt);
  if (inicio === "Data a definir") return inicio;
  if (fim === "Data a definir" || fim === inicio) return inicio;
  return `${inicio} a ${fim}`;
}

export function extrairEtapasRoteiro(itinerary?: string | null): EtapaRoteiro[] {
  const linhas = (itinerary ?? "")
    .split("\n")
    .map((linha: string): string => linha.trim())
    .filter((linha: string): boolean => linha.length > 0);

  if (linhas.length === 0) {
    return [];
  }

  return linhas.map((linha: string, index: number): EtapaRoteiro => {
    const separadorMatch = linha.match(/^(.+?)\s+[–—-]\s+(.+)$/);
    if (separadorMatch) {
      return {
        horario: separadorMatch[1].trim(),
        descricao: separadorMatch[2].trim(),
      };
    }

    return {
      horario: `Etapa ${index + 1}`,
      descricao: linha,
    };
  });
}

export function calcularDuracaoTexto(
  startsAt: string,
  endsAt: string,
  override?: string,
): string {
  if (override) return override;

  const start = new Date(startsAt);
  const end = new Date(endsAt);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return "Duração a confirmar";
  }

  const diffMs = end.getTime() - start.getTime();
  if (diffMs <= 0) return "1 dia";

  const startUtcDay = Date.UTC(
    start.getUTCFullYear(),
    start.getUTCMonth(),
    start.getUTCDate(),
  );
  const endUtcDay = Date.UTC(
    end.getUTCFullYear(),
    end.getUTCMonth(),
    end.getUTCDate(),
  );
  const calendarDays = Math.round(
    (endUtcDay - startUtcDay) / (1000 * 60 * 60 * 24),
  );

  if (calendarDays <= 0) {
    const hours = Math.max(1, Math.round(diffMs / (1000 * 60 * 60)));
    return `1 dia (${hours}h)`;
  }

  const dias = calendarDays + 1;
  const pernoites = calendarDays;
  return `${dias} dias (${pernoites} ${pernoites === 1 ? "pernoite" : "pernoites"})`;
}

export function resolverMetaVisual(
  experiencia: ExperienciaDto | ExperienciaResponseDto,
): ExperienciaVisualMeta {
  const resposta = experiencia as ExperienciaResponseDto;
  const capa = resposta.photos && resposta.photos.length > 0 ? resposta.photos[0] : null;
  const dificuldade = resposta.difficulty ? (DIFICULDADE_API[resposta.difficulty] ?? null) : null;

  return {
    bioma: resposta.biome ?? null,
    comunidade: resposta.community ?? null,
    local: resposta.location ?? null,
    dificuldade,
    dificuldadeLabel: dificuldade ? DIFICULDADE_LABELS[dificuldade] : null,
    imagemUrl: capa ?? IMAGEM_SEM_FOTO,
    imagemAlt: experiencia.title,
    maxPorReserva: resposta.maxPerBooking ?? 6,
    impactoComunidade: resposta.communityImpact ?? null,
    itensInclusos: resposta.includedItems ?? [],
    regrasConservacao: resposta.rules ?? [],
    vestuario: resposta.clothingTips ?? [],
    pontoEncontro: resposta.meetingPoint ?? null,
    horarioEncontro: resposta.meetingTime ?? null,
    guiaNome: resposta.guideName ?? null,
    guiaPapel: resposta.guideRole ?? null,
  };
}

export function obterVagasDisponiveis(
  experiencia: ExperienciaDto | ExperienciaResponseDto,
): number {
  const seats =
    "availableSeats" in experiencia &&
    typeof experiencia.availableSeats === "number"
      ? experiencia.availableSeats
      : experiencia.capacity;

  return Math.max(0, seats);
}
