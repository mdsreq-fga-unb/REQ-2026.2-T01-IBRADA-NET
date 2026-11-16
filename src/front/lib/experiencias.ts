import { api } from "@/lib/api";
import type {
  BiomaCategoria,
  CreateExperienciaPayload,
  EtapaRoteiro,
  ExperienciaDto,
  ExperienciaResponseDto,
  ExperienciaVisualMeta,
  NivelDificuldade,
  OpcaoDataExperiencia,
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
  OpcaoDataExperiencia,
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

const ROTEIRO_PADRAO: readonly EtapaRoteiro[] = [
  {
    horario: "07h30",
    descricao: "Recepção na sede do assentamento e café da roça",
  },
  {
    horario: "08h30",
    descricao: "Roda de conversa sobre a história da comunidade",
  },
  {
    horario: "09h30",
    descricao: "Trilha pelas veredas e nascentes recuperadas",
  },
  {
    horario: "12h30",
    descricao: "Almoço agroecológico com as famílias",
  },
  {
    horario: "14h00",
    descricao: "Banho de cachoeira e retorno",
  },
];

const REGRAS_CONSERVACAO_PADRAO: readonly string[] = [
  "Leve sua garrafa de água: não usamos descartáveis",
  "Não retire plantas, sementes ou pedras",
  "Permaneça sempre na trilha sinalizada",
  "Use protetor solar biodegradável",
];

const ITENS_INCLUSOS_PADRAO: readonly string[] = [
  "Guia local credenciado",
  "Café da manhã e almoço",
  "Seguro aventura",
  "Kit de boas-vindas",
];

const META_VISUAL_POR_SLUG: Record<string, ExperienciaVisualMeta> = {
  "trilha-das-nascentes-do-cerrado": {
    bioma: "Cerrado",
    comunidade: "Assentamento Pequeno William",
    local: "Planaltina/DF",
    duracaoTexto: "1 dia (8h)",
    dificuldade: "moderada",
    dificuldadeLabel: DIFICULDADE_LABELS.moderada,
    imagemUrl:
      "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1400&q=80",
    imagemAlt: "Cachoeira com águas cristalinas e vegetação nativa do Cerrado",
    capacidadeTotalReferencia: 15,
    maxPorReserva: 6,
    impactoComunidade:
      "70% do valor fica com as famílias do assentamento: guia, alimentação e manutenção das trilhas. O restante apoia a recuperação das nascentes.",
    itensInclusos: ITENS_INCLUSOS_PADRAO,
    regrasConservacao: REGRAS_CONSERVACAO_PADRAO,
    guiaNome: "Dona Maria das Graças",
    guiaPapel: "Guia local credenciada e agricultora",
  },
  "vivencia-de-saberes-quilombolas": {
    bioma: "Cerrado",
    comunidade: "Comunidade Quilombola Kalunga",
    local: "Cavalcante/GO",
    duracaoTexto: "2 dias (1 pernoite)",
    dificuldade: "leve",
    dificuldadeLabel: DIFICULDADE_LABELS.leve,
    imagemUrl:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1400&q=80",
    imagemAlt:
      "Visitantes em roda de conversa e oficina de saberes com a comunidade",
    capacidadeTotalReferencia: 8,
    maxPorReserva: 6,
    impactoComunidade:
      "70% do valor remunera diretamente as famílias quilombolas pela hospedagem, oficinas culturais e alimentação tradicional. O restante financia ações socioambientais no território.",
    itensInclusos: [
      "Guia comunitário Kalunga",
      "Hospedagem familiar (1 pernoite) e refeições",
      "Oficina de artesanato em fibras",
      "Seguro aventura",
    ],
    regrasConservacao: REGRAS_CONSERVACAO_PADRAO,
    guiaNome: "Mestra Tereza Kalunga",
    guiaPapel: "Guardiã dos saberes locais e artesã",
  },
  "rio-e-floresta-ribeirinha": {
    bioma: "Amazônia",
    comunidade: "Comunidade Ribeirinha São Raimundo",
    local: "Novo Airão/AM",
    duracaoTexto: "4 dias (3 pernoites)",
    dificuldade: "intensa",
    dificuldadeLabel: DIFICULDADE_LABELS.intensa,
    imagemUrl:
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1400&q=80",
    imagemAlt:
      "Embarcação tradicional navegando em rio amazônico cercado pela floresta",
    capacidadeTotalReferencia: 12,
    maxPorReserva: 6,
    impactoComunidade:
      "70% do valor fortalece a economia extrativista da comunidade ribeirinha: piloteiros, anfitriãs e guias locais. O restante apoia o monitoramento comunitário da floresta.",
    itensInclusos: [
      "Guias e piloteiros ribeirinhos credenciados",
      "Pernoites comunitárias e alimentação regional",
      "Navegação em canoa tradicional",
      "Seguro expedição",
    ],
    regrasConservacao: REGRAS_CONSERVACAO_PADRAO,
    guiaNome: "Seu Raimundo Nonato",
    guiaPapel: "Condutor fluvial e líder comunitário",
  },
};

const FALLBACK_IMAGEM_POR_BIOMA: Record<BiomaCategoria, string> = {
  Cerrado:
    "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1400&q=80",
  Amazônia:
    "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1400&q=80",
};

export const catalogoInicialExperiencias: ExperienciaResponseDto[] = [
  {
    id: "exp-cerrado-nascentes",
    slug: "trilha-das-nascentes-do-cerrado",
    title: "Trilha das Nascentes do Cerrado",
    description:
      "Caminhada guiada por veredas e nascentes recuperadas pelo próprio assentamento, com banho de cachoeira e almoço preparado pelas famílias agricultoras.",
    itinerary:
      "07h30 – Recepção na sede do assentamento e café da roça\n08h30 – Roda de conversa sobre a história da comunidade\n09h30 – Trilha pelas veredas e nascentes recuperadas\n12h30 – Almoço agroecológico com as famílias\n14h00 – Banho de cachoeira e retorno",
    price: "120.00",
    startsAt: "2026-11-14T08:00:00.000Z",
    endsAt: "2026-11-14T16:00:00.000Z",
    capacity: 8,
    availableSeats: 8,
    isAvailable: true,
    isSoldOut: false,
    createdAt: "2026-10-01T12:00:00.000Z",
    updatedAt: "2026-10-01T12:00:00.000Z",
  },
  {
    id: "exp-kalunga-saberes",
    slug: "vivencia-de-saberes-quilombolas",
    title: "Vivência de Saberes Quilombolas",
    description:
      "Imersão de dois dias no Território Kalunga com oficinas de artesanato em fibras, culinária tradicional, cantos de roda e pernoite em hospedagem familiar.",
    itinerary:
      "08h00 – Boas-vindas na Comunidade Kalunga e café de mandioca\n10h00 – Oficina de biojoias e fibras do Cerrado\n14h00 – Caminhada leve até o mirante e roda de histórias\n08h30 (Dia 2) – Roça agroecológica e culinária quilombola\n17h00 (Dia 2) – Partilha final e encerramento",
    price: "380.00",
    startsAt: "2026-11-21T08:00:00.000Z",
    endsAt: "2026-11-22T17:00:00.000Z",
    capacity: 4,
    availableSeats: 4,
    isAvailable: true,
    isSoldOut: false,
    createdAt: "2026-10-02T12:00:00.000Z",
    updatedAt: "2026-10-02T12:00:00.000Z",
  },
  {
    id: "exp-amazonia-ribeirinha",
    slug: "rio-e-floresta-ribeirinha",
    title: "Rio e Floresta Ribeirinha",
    description:
      "Expedição de quatro dias com a Comunidade Ribeirinha São Raimundo navegando em canoas tradicionais, observando fauna amazônica e vivenciando o manejo florestal comunitário.",
    itinerary:
      "Dia 1 – Embarque em Novo Airão/AM e chegada à comunidade São Raimundo\nDia 2 – Navegação em igarapés e trilha de manejo de castanha e açaí\nDia 3 – Observação de aves ao amanhecer e oficina de farinha artesanal\nDia 4 – Roda de partilha comunitária e retorno ao porto",
    price: "1650.00",
    startsAt: "2027-01-15T08:00:00.000Z",
    endsAt: "2027-01-18T17:00:00.000Z",
    capacity: 10,
    availableSeats: 10,
    isAvailable: true,
    isSoldOut: false,
    createdAt: "2026-10-03T12:00:00.000Z",
    updatedAt: "2026-10-03T12:00:00.000Z",
  },
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

function capitalizarPalavrasData(texto: string): string {
  return texto
    .split(" ")
    .map((palavra: string): string =>
      palavra.length > 0
        ? palavra.charAt(0).toUpperCase() + palavra.slice(1)
        : palavra,
    )
    .join(" ");
}

export function gerarOpcoesDatas(startsAt: string): OpcaoDataExperiencia[] {
  const baseDate = new Date(startsAt);
  if (Number.isNaN(baseDate.getTime())) {
    return [
      {
        id: "data-0",
        isoDate: startsAt,
        label: "Data A Confirmar",
      },
    ];
  }

  const offsetsDias: readonly number[] = [0, 14, 28];
  return offsetsDias.map((offset: number, index: number): OpcaoDataExperiencia => {
    const dt = new Date(baseDate.getTime() + offset * 24 * 60 * 60 * 1000);
    const iso = dt.toISOString();
    return {
      id: `data-${index}`,
      isoDate: iso,
      label: capitalizarPalavrasData(formatarDataCurta(iso)),
    };
  });
}

export function extrairEtapasRoteiro(itinerary?: string | null): EtapaRoteiro[] {
  const linhas = (itinerary ?? "")
    .split("\n")
    .map((linha: string): string => linha.trim())
    .filter((linha: string): boolean => linha.length > 0);

  if (linhas.length === 0) {
    return [...ROTEIRO_PADRAO];
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
  const preset = META_VISUAL_POR_SLUG[experiencia.slug];
  if (preset) return preset;

  const texto =
    `${experiencia.title} ${experiencia.description} ${experiencia.itinerary ?? ""}`.toLowerCase();

  const isAmazonia =
    texto.includes("amazôn") ||
    texto.includes("amazon") ||
    texto.includes("ribeir") ||
    texto.includes("novo airão") ||
    texto.includes("/am");

  const bioma: BiomaCategoria = isAmazonia ? "Amazônia" : "Cerrado";

  let dificuldade: NivelDificuldade = "moderada";
  if (
    texto.includes("intensa") ||
    texto.includes("expedição") ||
    texto.includes("ribeirinh")
  ) {
    dificuldade = "intensa";
  } else if (
    texto.includes("leve") ||
    texto.includes("saberes") ||
    texto.includes("oficina")
  ) {
    dificuldade = "leve";
  }

  const localMatch = `${experiencia.title} ${experiencia.description}`.match(
    /[A-ZÀ-Ú][A-Za-zÀ-ú\s]{2,25}\/[A-Z]{2}/,
  );

  return {
    bioma,
    comunidade: isAmazonia
      ? "Comunidade Ribeirinha Parceira"
      : "Comunidade Parceira do Cerrado",
    local: localMatch ? localMatch[0] : isAmazonia ? "Amazônia/AM" : "Cerrado/DF",
    dificuldade,
    dificuldadeLabel: DIFICULDADE_LABELS[dificuldade],
    imagemUrl: FALLBACK_IMAGEM_POR_BIOMA[bioma],
    imagemAlt: experiencia.title,
    capacidadeTotalReferencia: Math.max(1, experiencia.capacity),
    maxPorReserva: 6,
    impactoComunidade:
      "70% do valor fica com as famílias da comunidade anfitriã: guia, alimentação e manutenção das trilhas. O restante apoia a recuperação ambiental.",
    itensInclusos: ITENS_INCLUSOS_PADRAO,
    regrasConservacao: REGRAS_CONSERVACAO_PADRAO,
    guiaNome: "Guia Comunitário IBRADA",
    guiaPapel: "Guia local credenciado",
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
