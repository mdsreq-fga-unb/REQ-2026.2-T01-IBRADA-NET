"use client";

import type React from "react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  AlertCircle,
  Calendar,
  Clock,
  Compass,
  HeartHandshake,
  Leaf,
  MapPin,
  RefreshCw,
  Users,
  type LucideIcon,
} from "lucide-react";
import { WhatsAppIcon } from "@/components/brand-icons";
import {
  calcularDuracaoTexto,
  formatarDataCurta,
  formatarPrecoExperiencia,
  listarExperiencias,
  obterVagasDisponiveis,
  resolverMetaVisual,
  type ExperienciaResponseDto,
  type NivelDificuldade,
} from "@/lib/experiencias";
import { buildWhatsAppLink } from "@/lib/site";
import { cn } from "@/lib/utils";

interface PilarValor {
  readonly titulo: string;
  readonly descricao: string;
  readonly Icone: LucideIcon;
}

const PILARES_VALOR: readonly PilarValor[] = [
  {
    titulo: "Renda para a comunidade",
    descricao: "A maior parte do valor fica com as famílias anfitriãs.",
    Icone: HeartHandshake,
  },
  {
    titulo: "Conservação na prática",
    descricao: "Parte de cada reserva financia a recuperação de áreas.",
    Icone: Leaf,
  },
  {
    titulo: "Grupos pequenos",
    descricao: "Limitamos as vagas para reduzir o impacto no território.",
    Icone: Users,
  },
];

const ESTILO_DIFICULDADE: Record<NivelDificuldade, string> = {
  moderada: "bg-[#f6e7c8] text-[#8a5a14]",
  leve: "bg-[#dcf2e2] text-[#1f6239]",
  intensa: "bg-[#f9ded5] text-[#9b3b24]",
};

function CardSkeleton(): React.JSX.Element {
  return (
    <div
      aria-hidden="true"
      className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-xs"
    >
      <div className="aspect-[16/10] w-full animate-pulse bg-muted" />
      <div className="flex flex-1 flex-col p-5">
        <div className="h-3 w-40 animate-pulse rounded bg-muted" />
        <div className="mt-2 h-6 w-56 animate-pulse rounded bg-muted" />
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="h-4 animate-pulse rounded bg-muted" />
          <div className="h-4 animate-pulse rounded bg-muted" />
          <div className="h-4 animate-pulse rounded bg-muted" />
          <div className="h-4 animate-pulse rounded bg-muted" />
        </div>
        <div className="my-4 border-t border-border" />
        <div className="flex items-end justify-between">
          <div className="h-6 w-32 animate-pulse rounded-full bg-muted" />
          <div className="h-7 w-20 animate-pulse rounded bg-muted" />
        </div>
        <div className="mt-4 h-10 w-full animate-pulse rounded-lg bg-muted" />
      </div>
    </div>
  );
}

interface ExperienciaCardProps {
  experiencia: ExperienciaResponseDto;
}

function ExperienciaCard({
  experiencia,
}: ExperienciaCardProps): React.JSX.Element {
  const meta = resolverMetaVisual(experiencia);
  const vagas = obterVagasDisponiveis(experiencia);
  const isSoldOut = experiencia.isSoldOut ?? vagas <= 0;
  const indisponivel = !experiencia.isAvailable || isSoldOut;
  const poucasVagas = !indisponivel && vagas <= 5;

  const precoTexto = formatarPrecoExperiencia(
    experiencia.priceDecimal ?? experiencia.price,
  );
  const dataTexto = formatarDataCurta(experiencia.startsAt);
  const duracaoTexto = calcularDuracaoTexto(
    experiencia.startsAt,
    experiencia.endsAt,
    meta.duracaoTexto,
  );

  const vagasTexto = !experiencia.isAvailable
    ? "Indisponível"
    : isSoldOut
      ? "Sem vagas"
      : `${vagas} ${vagas === 1 ? "vaga" : "vagas"}`;

  return (
    <article
      className={cn(
        "flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-xs transition-shadow hover:shadow-md",
        indisponivel && "opacity-90",
      )}
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
        <img
          src={meta.imagemUrl}
          alt={meta.imagemAlt}
          className={cn(
            "h-full w-full object-cover transition-transform duration-300 hover:scale-[1.02]",
            indisponivel && "grayscale-[35%]",
          )}
        />
        <span className="absolute top-3 left-3 rounded-full bg-card/95 px-3 py-1 text-xs font-medium text-foreground shadow-xs">
          {meta.bioma}
        </span>
        {indisponivel && (
          <span className="absolute top-3 right-3 rounded-full bg-destructive px-3 py-1 text-xs font-medium text-white shadow-xs">
            {!experiencia.isAvailable ? "Indisponível" : "Esgotada"}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-medium text-earth">{meta.comunidade}</p>
        <h2 className="mt-1 font-serif text-lg font-semibold leading-snug text-foreground">
          {experiencia.title}
        </h2>

        <dl className="mt-4 grid grid-cols-2 gap-x-3 gap-y-2 text-xs text-muted-foreground">
          <div className="flex min-w-0 items-center gap-1.5">
            <dt className="sr-only">Local</dt>
            <MapPin aria-hidden="true" className="size-3.5 shrink-0" />
            <dd className="truncate">{meta.local}</dd>
          </div>
          <div className="flex min-w-0 items-center gap-1.5">
            <dt className="sr-only">Duração</dt>
            <Clock aria-hidden="true" className="size-3.5 shrink-0" />
            <dd className="truncate">{duracaoTexto}</dd>
          </div>
          <div className="flex min-w-0 items-center gap-1.5">
            <dt className="sr-only">Data</dt>
            <Calendar aria-hidden="true" className="size-3.5 shrink-0" />
            <dd className="truncate">{dataTexto}</dd>
          </div>
          <div
            className={cn(
              "flex min-w-0 items-center gap-1.5",
              poucasVagas && "font-semibold text-earth",
              indisponivel && "font-semibold text-destructive",
            )}
          >
            <dt className="sr-only">Vagas disponíveis</dt>
            <Users aria-hidden="true" className="size-3.5 shrink-0" />
            <dd className="truncate">{vagasTexto}</dd>
          </div>
        </dl>

        <hr className="my-4 border-border" />

        <div className="mt-auto flex items-end justify-between gap-3">
          <span
            className={cn(
              "inline-flex items-center rounded-full px-3 py-1 text-[11px] font-medium whitespace-nowrap",
              ESTILO_DIFICULDADE[meta.dificuldade],
            )}
          >
            {meta.dificuldadeLabel}
          </span>

          <div className="text-right leading-none">
            <span className="mb-1 block text-[11px] text-muted-foreground">
              a partir de
            </span>
            <span className="font-serif text-xl font-bold tracking-tight text-foreground">
              {precoTexto}
            </span>
          </div>
        </div>

        <Link
          href={`/ecoturismo/${experiencia.slug}`}
          className={cn(
            "mt-4 inline-flex min-h-10 w-full items-center justify-center rounded-lg px-4 py-2.5 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:text-sm",
            indisponivel
              ? "bg-muted text-muted-foreground hover:bg-muted/80"
              : "bg-primary text-primary-foreground hover:bg-primary/90",
          )}
        >
          {indisponivel
            ? "Ver Detalhes (Indisponível)"
            : "Ver pacote e reservar"}
        </Link>
      </div>
    </article>
  );
}

interface ResultadoCatalogo {
  experiencias: ExperienciaResponseDto[];
  error: string | null;
}

async function fetchCatalogoExperiencias(): Promise<ResultadoCatalogo> {
  try {
    const dados = await listarExperiencias();
    return { experiencias: dados, error: null };
  } catch (err: unknown) {
    return {
      experiencias: [],
      error:
        err instanceof Error
          ? err.message
          : "Não foi possível carregar os pacotes de ecoturismo.",
    };
  }
}

export default function EcoturismoPage(): React.JSX.Element {
  const [experiencias, setExperiencias] = useState<ExperienciaResponseDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const aplicarResultado = useCallback((resultado: ResultadoCatalogo): void => {
    setExperiencias(resultado.experiencias);
    setError(resultado.error);
    setLoading(false);
  }, []);

  useEffect((): (() => void) => {
    let mounted = true;
    void fetchCatalogoExperiencias().then(
      (resultado: ResultadoCatalogo): void => {
        if (!mounted) return;
        aplicarResultado(resultado);
      },
    );
    return (): void => {
      mounted = false;
    };
  }, [aplicarResultado]);

  const recarregarExperiencias = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    const resultado = await fetchCatalogoExperiencias();
    aplicarResultado(resultado);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Cabeçalho / Hero Mobile-First */}
      <section className="border-b border-border bg-secondary/45">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 md:py-14 lg:px-8">
          <p className="text-[11px] font-semibold tracking-[0.14em] text-earth uppercase sm:text-xs">
            Ecoturismo Comunitário
          </p>

          <h1 className="mt-3 max-w-md font-serif text-[2rem] leading-[1.12] font-bold tracking-tight text-foreground sm:text-4xl lg:text-[2.75rem]">
            Pacotes no Cerrado e na Amazônia
          </h1>

          <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Trilhas, saberes e sabores guiados por quem vive no território.
            Escolha seu pacote, veja o roteiro completo e reserve em poucos
            passos.
          </p>

          <ul className="mt-8 grid grid-cols-1 gap-5 md:mt-10 md:grid-cols-3 md:gap-8">
            {PILARES_VALOR.map(
              ({ titulo, descricao, Icone }: PilarValor): React.JSX.Element => (
                <li key={titulo} className="flex items-start gap-3">
                  <Icone
                    aria-hidden="true"
                    className="mt-0.5 size-4 shrink-0 text-primary"
                  />
                  <div>
                    <h2 className="font-sans text-sm font-semibold text-foreground">
                      {titulo}
                    </h2>
                    <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground sm:text-[13px]">
                      {descricao}
                    </p>
                  </div>
                </li>
              ),
            )}
          </ul>
        </div>
      </section>

      {/* Catálogo de pacotes */}
      <section
        aria-label="Catálogo de pacotes"
        className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14"
      >
        {loading && (
          <div
            aria-busy="true"
            aria-live="polite"
            className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            <span className="sr-only">
              Carregando pacotes de ecoturismo...
            </span>
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        )}

        {!loading && error && (
          <div
            role="alert"
            className="mx-auto max-w-lg rounded-2xl border border-destructive/30 bg-card p-6 text-center shadow-xs sm:p-8"
          >
            <AlertCircle
              aria-hidden="true"
              className="mx-auto size-10 text-destructive"
            />
            <h2 className="mt-3 font-serif text-xl font-semibold text-foreground">
              Erro ao carregar pacotes
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">{error}</p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={(): void => {
                  void recarregarExperiencias();
                }}
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <RefreshCw aria-hidden="true" className="size-4" />
                Tentar novamente
              </button>
            </div>
          </div>
        )}

        {!loading && !error && experiencias.length === 0 && (
          <div className="mx-auto max-w-lg rounded-2xl border border-border bg-card p-8 text-center shadow-xs">
            <Compass
              aria-hidden="true"
              className="mx-auto size-10 text-primary"
            />
            <h2 className="mt-3 font-serif text-xl font-semibold text-foreground">
              Nenhum pacote disponível no momento
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Novas expedições comunitárias no Cerrado e na Amazônia serão
              publicadas em breve.
            </p>
            <button
              type="button"
              onClick={(): void => {
                void recarregarExperiencias();
              }}
              className="mt-6 inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              <RefreshCw aria-hidden="true" className="size-4" />
              Atualizar catálogo
            </button>
          </div>
        )}

        {!loading && !error && experiencias.length > 0 && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {experiencias.map(
              (experiencia: ExperienciaResponseDto): React.JSX.Element => (
                <ExperienciaCard
                  key={experiencia.id}
                  experiencia={experiencia}
                />
              ),
            )}
          </div>
        )}
      </section>

      {/* Botão Flutuante WhatsApp */}
      <div className="fixed right-4 bottom-4 z-40 sm:right-6 sm:bottom-6">
        <a
          href={buildWhatsAppLink(
            "Olá! Gostaria de saber mais sobre os pacotes de ecoturismo comunitário do IBRADA.",
          )}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Precisa de ajuda? Fale conosco pelo WhatsApp"
          className="group flex items-center gap-3"
        >
          <span className="hidden rounded-full border border-border bg-card px-4 py-2 text-xs font-medium text-foreground shadow-md transition-transform group-hover:-translate-x-0.5 md:inline-block">
            Precisa de ajuda? Fale conosco
          </span>
          <span className="flex size-12 items-center justify-center rounded-full bg-whatsapp text-white shadow-lg transition-transform group-hover:scale-105 sm:size-13">
            <WhatsAppIcon className="size-6" />
          </span>
        </a>
      </div>
    </div>
  );
}
