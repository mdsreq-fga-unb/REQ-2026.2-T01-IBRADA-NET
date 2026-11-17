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

export type BiomaCategoria = "Cerrado" | "Amazônia";

export type NivelDificuldade = "leve" | "moderada" | "intensa";

export interface EtapaRoteiro {
  horario: string;
  descricao: string;
}

export interface OpcaoDataExperiencia {
  id: string;
  isoDate: string;
  label: string;
}

export interface ExperienciaVisualMeta {
  bioma: BiomaCategoria;
  comunidade: string;
  local: string;
  duracaoTexto?: string;
  dificuldade: NivelDificuldade;
  dificuldadeLabel: string;
  imagemUrl: string;
  imagemAlt: string;
  capacidadeTotalReferencia: number;
  maxPorReserva: number;
  impactoComunidade: string;
  itensInclusos: readonly string[];
  regrasConservacao: readonly string[];
  guiaNome: string;
  guiaPapel: string;
}
