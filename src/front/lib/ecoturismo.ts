import { api } from "./api";

export type Experiencia = {
  id: string;
  slug: string;
  title: string;
  description: string;
  itinerary: string | null;
  price: number;
  priceDecimal?: string;
  priceFormatted?: string;
  startsAt: string;
  endsAt: string;
  capacity: number;
  availableSeats: number;
  isAvailable: boolean;
  isSoldOut?: boolean;
};

// Dados padrão com base nos projetos reais do IBRADA no Cerrado.
// Utilizados como fallback caso o backend NestJS esteja desligado ou sem dados cadastrados.
export const EXPERIENCIAS_FALLBACK: Experiencia[] = [
  {
    id: "exp-01-quilombola",
    slug: "vivencia-quilombola-kalunga",
    title: "Vivência Quilombola Kalunga no Vão de Almas",
    description:
      "Uma imersão cultural e ecológica profunda na maior comunidade quilombola do Brasil. Trilha guiada por lideranças locais, saberes tradicionais, banho nas cachoeiras preservadas e alimentação típica com produtos da sociobiodiversidade.",
    itinerary:
      "Dia 1: Recepção em Cavalcante/GO, roda de conversa com anciãos da comunidade Kalunga e jantar comunitário.\nDia 2: Trilha interpretativa das águas sagradas, visita aos sistemas agroecológicos e almoço tradicional.\nDia 3: Oficina de artesanato em palha de buriti, banho no poço dos Encantados e retorno.",
    price: 420.0,
    priceDecimal: "420.00",
    priceFormatted: "R$ 420,00",
    startsAt: "2026-12-10T08:00:00.000Z",
    endsAt: "2026-12-12T17:00:00.000Z",
    capacity: 15,
    availableSeats: 6,
    isAvailable: true,
    isSoldOut: false,
  },
  {
    id: "exp-02-aguas-nascentes",
    slug: "trilha-aguas-nascentes-cerrado",
    title: "Trilha das Águas e Nascentes do Cerrado",
    description:
      "Caminhada interpretativa por veredas preservadas e nascentes do bioma Cerrado, com foco na conservação dos recursos hídricos e observação da fauna nativa.",
    itinerary:
      "Manhã: Ponto de encontro na sede de Pirenópolis/GO, orientações de segurança e início da caminhada pela Trilha das Veredas.\nTarde: Parada para banho refrescante na Cachoeira das Bromélias, piquenique agroecológico e debate sobre restauração florestal.",
    price: 180.0,
    priceDecimal: "180.00",
    priceFormatted: "R$ 180,00",
    startsAt: "2026-12-18T07:30:00.000Z",
    endsAt: "2026-12-18T16:00:00.000Z",
    capacity: 20,
    availableSeats: 2,
    isAvailable: true,
    isSoldOut: false,
  },
  {
    id: "exp-03-agroecologia",
    slug: "caminhos-agroecologia-cerrado",
    title: "Caminhos da Agroecologia e Frutos Nativos",
    description:
      "Oficina de campo e vivência agroflorestal em assentamento modelo do Distrito Federal. Degustação de frutos nativos do Cerrado (pequi, baru, cagaita) e plantio simbólico de mudas.",
    itinerary:
      "08h30: Café da manhã camponês com pães e geléias do Cerrado.\n10h00: Circuito prático nos SAFs (Sistemas Agroflorestais).\n13h00: Almoço comunitário.\n15h00: Plantio coletivo de espécies nativas.",
    price: 130.0,
    priceDecimal: "130.00",
    priceFormatted: "R$ 130,00",
    startsAt: "2026-12-22T08:30:00.000Z",
    endsAt: "2026-12-22T16:30:00.000Z",
    capacity: 12,
    availableSeats: 0, // ESGOTADO (para testar tratamento de vagas)
    isAvailable: true,
    isSoldOut: true,
  },
  {
    id: "exp-04-botanica",
    slug: "imersao-botanica-chapadinha",
    title: "Imersão Botânica e Plantas Medicinais do Planalto",
    description:
      "Expedição botânica voltada à identificação das espécies curativas e fitoterápicas do Cerrado com raizeiras tradicionais.",
    itinerary:
      "08h00: Reconhecimento botânico em campo aberto.\n11h30: Oficina prática de xaropes e pomadas naturais.\n14h00: Roda de partilha e encerramento.",
    price: 240.0,
    priceDecimal: "240.00",
    priceFormatted: "R$ 240,00",
    startsAt: "2027-01-15T08:00:00.000Z",
    endsAt: "2027-01-15T15:00:00.000Z",
    capacity: 10,
    availableSeats: 10,
    isAvailable: false, // INDISPONÍVEL PELO GESTOR (para testar bloqueio)
    isSoldOut: false,
  },
];

export async function listarExperiencias(): Promise<Experiencia[]> {
  try {
    const data = await api<Experiencia[]>("/experiencias");
    if (Array.isArray(data) && data.length > 0) {
      return data;
    }
    return EXPERIENCIAS_FALLBACK;
  } catch {
    return EXPERIENCIAS_FALLBACK;
  }
}

export async function buscarExperienciaPorSlug(slug: string): Promise<Experiencia | null> {
  try {
    const data = await api<Experiencia>(`/experiencias/${slug}`);
    if (data && data.id) {
      return data;
    }
  } catch {
    // Fallback local se o backend não estiver respondendo
  }

  const encontrada = EXPERIENCIAS_FALLBACK.find((e) => e.slug === slug);
  return encontrada ?? null;
}
