export interface ExperienciaDto {
  id: string;
  slug: string;
  title: string;
  description: string;
  itinerary?: string | null;
  price: string | number; // Decimal vindo do backend (ex: "150.50")
  startsAt: string; // ISO 8601 Date string
  endsAt: string; // ISO 8601 Date string
  capacity: number;
  isAvailable: boolean;
  location?: string | null; // local de atuação, ex.: Planaltina/DF
  community?: string | null;
  biome?: string | null;
  difficulty?: "LEVE" | "MODERADA" | "INTENSA" | null;
  meetingPoint?: string | null;
  meetingTime?: string | null;
  includedItems?: string[];
  rules?: string[];
  clothingTips?: string[];
  communityImpact?: string | null;
  guideName?: string | null;
  guideRole?: string | null;
  maxPerBooking?: number;
  createdAt: string;
  updatedAt: string;
}

// Payload para criação (CreateExperienciaDto)
export type CreateExperienciaPayload = Omit<
  ExperienciaDto,
  "id" | "slug" | "createdAt" | "updatedAt"
> & {
  photos: string[]; // ao menos uma foto de divulgação (a primeira é a capa)
  videos?: string[];
  location: string;
  community: string;
  biome: BiomaCategoria;
  difficulty: "LEVE" | "MODERADA" | "INTENSA";
  meetingPoint: string;
  meetingTime: string;
  includedItems: string[];
};

// Payload para atualização de disponibilidade (UpdateDisponibilidadeDto)
export interface UpdateDisponibilidadePayload {
  isAvailable: boolean;
}

// Resposta enriquecida opcional retornada pelo ExperienciasService do NestJS
export interface ExperienciaResponseDto extends ExperienciaDto {
  photos?: string[];
  videos?: string[];
  availableSeats?: number;
  isSoldOut?: boolean;
  priceDecimal?: string;
  priceCents?: number;
  priceFormatted?: string;
}

export type BiomaCategoria =
  | "Cerrado"
  | "Amazônia"
  | "Caatinga"
  | "Mata Atlântica"
  | "Pantanal"
  | "Pampa";

export type NivelDificuldade = "leve" | "moderada" | "intensa";

export interface EtapaRoteiro {
  horario: string;
  descricao: string;
}

// Dados de apresentação derivados do que o gestor cadastrou. Nada aqui é inventado:
// o que não foi cadastrado vem nulo ou vazio e a tela omite a seção.
export interface ExperienciaVisualMeta {
  bioma: string | null;
  comunidade: string | null;
  local: string | null;
  duracaoTexto?: string;
  dificuldade: NivelDificuldade | null;
  dificuldadeLabel: string | null;
  imagemUrl: string;
  imagemAlt: string;
  maxPorReserva: number;
  impactoComunidade: string | null;
  itensInclusos: readonly string[];
  regrasConservacao: readonly string[];
  vestuario: readonly string[];
  pontoEncontro: string | null;
  horarioEncontro: string | null;
  guiaNome: string | null;
  guiaPapel: string | null;
}
