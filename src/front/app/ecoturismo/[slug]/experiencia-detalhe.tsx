"use client";

import type React from "react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  Check,
  Clock,
  Compass,
  HeartHandshake,
  MapPin,
  Minus,
  Plus,
  RefreshCw,
  UserRound,
} from "lucide-react";
import { WhatsAppIcon } from "@/components/brand-icons";
import { ApiError } from "@/lib/api";
import {
  buscarExperienciaPorSlug,
  calcularDuracaoTexto,
  calcularPrecoTotalExperiencia,
  extrairEtapasRoteiro,
  formatarPrecoExperiencia,
  gerarOpcoesDatas,
  obterVagasDisponiveis,
  resolverMetaVisual,
  type EtapaRoteiro,
  type ExperienciaResponseDto,
  type NivelDificuldade,
  type OpcaoDataExperiencia,
} from "@/lib/experiencias";
import { buildWhatsAppLink } from "@/lib/site";
import { cn } from "@/lib/utils";

const ESTILO_DIFICULDADE: Record<NivelDificuldade, string> = {
  moderada: "bg-[#f6e7c8] text-[#8a5a14]",
  leve: "bg-[#dcf2e2] text-[#1f6239]",
  intensa: "bg-[#f9ded5] text-[#9b3b24]",
};

interface ResultadoDetalhe {
  experiencia: ExperienciaResponseDto | null;
  error: string | null;
  notFound: boolean;
}

async function fetchDetalheExperiencia(
  slug: string,
): Promise<ResultadoDetalhe> {
  try {
    const dados = await buscarExperienciaPorSlug(slug);
    return { experiencia: dados, error: null, notFound: false };
  } catch (err: unknown) {
    if (err instanceof ApiError && err.status === 404) {
      return { experiencia: null, error: null, notFound: true };
    }
    return {
      experiencia: null,
      error:
        err instanceof Error
          ? err.message
          : "Não foi possível carregar os detalhes do pacote.",
      notFound: false,
    };
  }
}

export function ExperienciaDetalhe({
  slug,
}: {
  slug: string;
}): React.JSX.Element {

  const [experiencia, setExperiencia] = useState<ExperienciaResponseDto | null>(
    null,
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [notFoundState, setNotFoundState] = useState<boolean>(false);
  const [selectedDateIndex, setSelectedDateIndex] = useState<number>(0);
  const [participantes, setParticipantes] = useState<number>(1);

  const aplicarResultado = useCallback((resultado: ResultadoDetalhe): void => {
    setExperiencia(resultado.experiencia);
    setError(resultado.error);
    setNotFoundState(resultado.notFound);
    setLoading(false);
  }, []);

  useEffect((): (() => void) | void => {
    if (!slug) return;
    let mounted = true;
    void fetchDetalheExperiencia(slug).then(
      (resultado: ResultadoDetalhe): void => {
        if (!mounted) return;
        aplicarResultado(resultado);
      },
    );
    return (): void => {
      mounted = false;
    };
  }, [slug, aplicarResultado]);

  const recarregarDetalhe = async (): Promise<void> => {
    if (!slug) return;
    setLoading(true);
    setError(null);
    setNotFoundState(false);
    const resultado = await fetchDetalheExperiencia(slug);
    aplicarResultado(resultado);
  };

  if (loading && slug) {
    return (
      <div
        aria-busy="true"
        aria-live="polite"
        className="min-h-screen bg-background"
      >
        <div className="h-60 w-full animate-pulse bg-muted sm:h-72 md:h-80 lg:h-[340px]" />
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-12">
            <div className="space-y-5">
              <div className="h-5 w-64 animate-pulse rounded bg-muted" />
              <div className="h-16 w-full animate-pulse rounded bg-muted" />
              <div className="h-28 w-full animate-pulse rounded-2xl bg-muted" />
              <div className="h-56 w-full animate-pulse rounded-2xl bg-muted" />
            </div>
            <div className="h-96 animate-pulse rounded-2xl bg-muted" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <div
          role="alert"
          className="rounded-2xl border border-destructive/30 bg-card p-6 text-center shadow-xs sm:p-8"
        >
          <AlertCircle
            aria-hidden="true"
            className="mx-auto size-10 text-destructive"
          />
          <h1 className="mt-3 font-serif text-2xl font-semibold text-foreground">
            Erro ao carregar pacote
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">{error}</p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={(): void => {
                void recarregarDetalhe();
              }}
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              <RefreshCw aria-hidden="true" className="size-4" />
              Tentar novamente
            </button>
            <Link
              href="/ecoturismo"
              className="inline-flex min-h-10 items-center justify-center rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
            >
              Voltar ao catálogo
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!slug || notFoundState || !experiencia) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-xs">
          <Compass
            aria-hidden="true"
            className="mx-auto size-10 text-primary"
          />
          <h1 className="mt-3 font-serif text-2xl font-semibold text-foreground">
            Pacote não encontrado
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            O pacote solicitado não está disponível ou foi removida do
            catálogo.
          </p>
          <Link
            href="/ecoturismo"
            className="mt-6 inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
            Voltar para Ecoturismo Comunitário
          </Link>
        </div>
      </div>
    );
  }

  const meta = resolverMetaVisual(experiencia);
  const vagas = obterVagasDisponiveis(experiencia);
  const capacidadeTotal = Math.max(
    experiencia.capacity,
    meta.capacidadeTotalReferencia,
  );
  const isSoldOut = experiencia.isSoldOut ?? vagas <= 0;
  const indisponivel = !experiencia.isAvailable || isSoldOut;

  const unitPriceValue = experiencia.priceDecimal ?? experiencia.price;
  const precoUnitarioTexto = formatarPrecoExperiencia(unitPriceValue);
  const duracaoTexto = calcularDuracaoTexto(
    experiencia.startsAt,
    experiencia.endsAt,
    meta.duracaoTexto,
  );
  const etapasRoteiro = extrairEtapasRoteiro(experiencia.itinerary);
  const opcoesDatas = gerarOpcoesDatas(experiencia.startsAt);
  const opcaoDataSelecionada =
    opcoesDatas[selectedDateIndex] ?? opcoesDatas[0];

  const maxParticipantes = Math.max(1, Math.min(meta.maxPorReserva, vagas));
  const participantesAtivos = Math.min(participantes, maxParticipantes);
  const precoTotalTexto = calcularPrecoTotalExperiencia(
    unitPriceValue,
    participantesAtivos,
  );

  const vagasDisponiveisTexto = !experiencia.isAvailable
    ? "Oferta temporariamente pausada"
    : isSoldOut
      ? "Sem vagas disponíveis"
      : `${vagas} de ${capacidadeTotal} vagas disponíveis`;

  const mensagemReserva = `Olá! Gostaria de reservar ${participantesAtivos} ${
    participantesAtivos === 1 ? "vaga" : "vagas"
  } para "${experiencia.title}" na data ${opcaoDataSelecionada.label} (Total: ${precoTotalTexto}).`;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Banner Hero Full-Width */}
      <section className="relative h-60 w-full overflow-hidden bg-muted sm:h-72 md:h-80 lg:h-[340px]">
        <img
          src={meta.imagemUrl}
          alt={meta.imagemAlt}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/15"
        />

        <div className="relative mx-auto flex h-full max-w-6xl flex-col justify-end px-4 pb-6 sm:px-6 md:pb-8 lg:px-8">
          <Link
            href="/ecoturismo"
            className="inline-flex w-fit items-center gap-1.5 text-xs font-medium text-white/85 transition-colors hover:text-white sm:text-sm"
          >
            <ArrowLeft aria-hidden="true" className="size-3.5 sm:size-4" />
            Todos os pacotes
          </Link>

          <p className="mt-3 text-xs font-medium text-white/90 sm:text-sm">
            {meta.comunidade}
          </p>

          <h1 className="mt-1 max-w-3xl font-serif text-2xl leading-tight font-bold tracking-tight text-white sm:text-3xl md:text-4xl">
            {experiencia.title}
          </h1>
        </div>
      </section>

      {/* Conteúdo Principal + Sidebar de Reserva */}
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start lg:gap-12">
          {/* Coluna Esquerda */}
          <div>
            {/* Metadados do pacote */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground sm:text-sm">
              <span className="inline-flex items-center gap-1.5">
                <MapPin
                  aria-hidden="true"
                  className="size-3.5 shrink-0 text-primary"
                />
                <span>{meta.local}</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock
                  aria-hidden="true"
                  className="size-3.5 shrink-0 text-primary"
                />
                <span>{duracaoTexto}</span>
              </span>
              <span
                className={cn(
                  "inline-flex items-center rounded-full px-3 py-0.5 text-xs font-medium",
                  ESTILO_DIFICULDADE[meta.dificuldade],
                )}
              >
                {meta.dificuldadeLabel}
              </span>
            </div>

            {/* Descrição */}
            <p className="mt-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
              {experiencia.description}
            </p>

            {/* Galeria de fotos e vídeos de divulgação (a capa já aparece no topo) */}
            {((experiencia.photos?.length ?? 0) > 1 ||
              (experiencia.videos?.length ?? 0) > 0) && (
              <section aria-label="Fotos e vídeos do pacote" className="mt-6">
                <h2 className="font-serif text-lg font-semibold text-foreground">
                  Fotos e vídeos
                </h2>
                <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {(experiencia.photos ?? []).slice(1).map(
                    (url: string, index: number): React.JSX.Element => (
                      <li
                        key={`foto-${url}`}
                        className="aspect-[4/3] overflow-hidden rounded-xl bg-muted"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={url}
                          alt={`${experiencia.title} - foto ${index + 2}`}
                          loading="lazy"
                          className="h-full w-full object-cover"
                        />
                      </li>
                    ),
                  )}
                  {(experiencia.videos ?? []).map(
                    (url: string, index: number): React.JSX.Element => (
                      <li
                        key={`video-${url}`}
                        className="col-span-2 aspect-video overflow-hidden rounded-xl bg-muted sm:col-span-3"
                      >
                        <video
                          src={url}
                          controls
                          preload="metadata"
                          aria-label={`${experiencia.title} - vídeo ${index + 1}`}
                          className="h-full w-full"
                        />
                      </li>
                    ),
                  )}
                </ul>
              </section>
            )}

            {/* Impacto na comunidade */}
            <section
              aria-label="Impacto na comunidade"
              className="mt-6 rounded-2xl bg-secondary/60 p-5 sm:p-6"
            >
              <div className="flex items-start gap-3">
                <HeartHandshake
                  aria-hidden="true"
                  className="mt-0.5 size-5 shrink-0 text-earth"
                />
                <div>
                  <h2 className="font-sans text-sm font-semibold text-foreground">
                    Impacto na comunidade
                  </h2>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                    {meta.impactoComunidade}
                  </p>
                </div>
              </div>
            </section>

            {/* Roteiro (Timeline Vertical) */}
            <section aria-label="Roteiro" className="mt-8">
              <h2 className="font-serif text-xl font-bold text-foreground sm:text-2xl">
                Roteiro
              </h2>
              <ol className="relative mt-5 ml-1.5 space-y-5 border-l border-border pl-6">
                {etapasRoteiro.map(
                  (etapa: EtapaRoteiro, index: number): React.JSX.Element => (
                    <li
                      key={`${etapa.horario}-${index}`}
                      className="relative"
                    >
                      <span
                        aria-hidden="true"
                        className="absolute top-1.5 -left-[29px] size-2.5 rounded-full bg-primary ring-4 ring-background"
                      />
                      <p className="text-xs font-bold text-primary">
                        {etapa.horario}
                      </p>
                      <p className="mt-0.5 text-sm leading-relaxed text-foreground/90">
                        {etapa.descricao}
                      </p>
                    </li>
                  ),
                )}
              </ol>
            </section>

            {/* Incluso + Regras de Conservação */}
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <section
                aria-label="O que está incluso"
                className="rounded-2xl border border-border bg-card p-5"
              >
                <h2 className="font-sans text-sm font-semibold text-foreground">
                  O que está incluso
                </h2>
                <ul className="mt-3.5 space-y-2.5">
                  {meta.itensInclusos.map(
                    (item: string): React.JSX.Element => (
                      <li
                        key={item}
                        className="flex items-start gap-2.5 text-xs leading-relaxed text-foreground/85 sm:text-[13px]"
                      >
                        <Check
                          aria-hidden="true"
                          className="mt-0.5 size-4 shrink-0 text-primary"
                        />
                        <span>{item}</span>
                      </li>
                    ),
                  )}
                </ul>
              </section>

              <section
                aria-label="Regras de conservação"
                className="rounded-2xl border border-[#ebd5c8] bg-[#fbf3ee] p-5"
              >
                <h2 className="flex items-center gap-2 font-sans text-sm font-semibold text-foreground">
                  <AlertCircle
                    aria-hidden="true"
                    className="size-4 shrink-0 text-earth"
                  />
                  <span>Regras de conservação</span>
                </h2>
                <ul className="mt-3.5 space-y-2.5">
                  {meta.regrasConservacao.map(
                    (regra: string): React.JSX.Element => (
                      <li
                        key={regra}
                        className="flex items-start gap-2.5 text-xs leading-relaxed text-foreground/85 sm:text-[13px]"
                      >
                        <span
                          aria-hidden="true"
                          className="mt-1.5 size-1.5 shrink-0 rounded-full bg-earth"
                        />
                        <span>{regra}</span>
                      </li>
                    ),
                  )}
                </ul>
              </section>
            </div>

            {/* Seu Guia Local */}
            <section
              aria-label="Seu guia local"
              className="mt-4 flex items-center gap-4 rounded-2xl border border-border bg-card p-4 sm:p-5"
            >
              <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <UserRound aria-hidden="true" className="size-5" />
              </div>
              <div>
                <p className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                  Seu guia local
                </p>
                <p className="mt-0.5 font-serif text-base font-bold text-foreground">
                  {meta.guiaNome}
                </p>
                <p className="text-xs text-muted-foreground">
                  {meta.guiaPapel}
                </p>
              </div>
            </section>
          </div>

          {/* Coluna Direita / Card de Reserva */}
          <aside className="overflow-hidden rounded-2xl border border-border bg-card shadow-md lg:sticky lg:top-24">
            <div className="border-b border-border bg-secondary/55 px-6 py-5">
              <span className="block text-xs text-muted-foreground">
                a partir de
              </span>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="font-serif text-3xl font-bold tracking-tight text-primary">
                  {precoUnitarioTexto}
                </span>
                <span className="text-xs text-muted-foreground">
                  / pessoa
                </span>
              </div>
              <p
                className={cn(
                  "mt-1 text-xs",
                  indisponivel
                    ? "font-medium text-destructive"
                    : "text-muted-foreground",
                )}
              >
                {vagasDisponiveisTexto}
              </p>
            </div>

            <div className="space-y-5 p-6">
              {/* Seletor de Data */}
              <fieldset>
                <legend className="text-xs font-semibold text-foreground">
                  Escolha a data
                </legend>
                <div role="radiogroup" className="mt-2.5 space-y-2">
                  {opcoesDatas.map(
                    (
                      opcao: OpcaoDataExperiencia,
                      index: number,
                    ): React.JSX.Element => {
                      const isSelected = selectedDateIndex === index;
                      return (
                        <button
                          key={opcao.id}
                          type="button"
                          role="radio"
                          aria-checked={isSelected}
                          onClick={(): void => {
                            setSelectedDateIndex(index);
                          }}
                          className={cn(
                            "flex w-full items-center gap-3 rounded-xl border px-3.5 py-2.5 text-left text-xs font-medium transition-colors sm:text-sm",
                            isSelected
                              ? "border-primary bg-secondary/45 text-foreground"
                              : "border-border bg-card text-foreground/85 hover:border-primary/50",
                          )}
                        >
                          <span
                            aria-hidden="true"
                            className={cn(
                              "flex size-4 shrink-0 items-center justify-center rounded-full border",
                              isSelected
                                ? "border-primary"
                                : "border-muted-foreground/40",
                            )}
                          >
                            {isSelected && (
                              <span className="size-2 rounded-full bg-primary" />
                            )}
                          </span>
                          <Calendar
                            aria-hidden="true"
                            className="size-4 shrink-0 text-primary"
                          />
                          <span>{opcao.label}</span>
                        </button>
                      );
                    },
                  )}
                </div>
              </fieldset>

              {/* Seletor de Participantes */}
              <div>
                <p className="text-xs font-semibold text-foreground">
                  Número de participantes
                </p>
                <div className="mt-2.5 flex items-center gap-4">
                  <button
                    type="button"
                    aria-label="Diminuir número de participantes"
                    disabled={participantesAtivos <= 1 || indisponivel}
                    onClick={(): void => {
                      setParticipantes((prev: number): number =>
                        Math.max(1, prev - 1),
                      );
                    }}
                    className="inline-flex size-9 items-center justify-center rounded-lg border border-border bg-background text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Minus aria-hidden="true" className="size-4" />
                  </button>

                  <span
                    aria-live="polite"
                    className="min-w-6 text-center font-serif text-lg font-bold text-foreground"
                  >
                    {participantesAtivos}
                  </span>

                  <button
                    type="button"
                    aria-label="Aumentar número de participantes"
                    disabled={
                      participantesAtivos >= maxParticipantes || indisponivel
                    }
                    onClick={(): void => {
                      setParticipantes((prev: number): number =>
                        Math.min(maxParticipantes, prev + 1),
                      );
                    }}
                    className="inline-flex size-9 items-center justify-center rounded-lg border border-border bg-background text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Plus aria-hidden="true" className="size-4" />
                  </button>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Máximo de {meta.maxPorReserva} pessoas por reserva.
                </p>
              </div>

              {/* Total */}
              <div className="flex items-center justify-between border-t border-border pt-4">
                <span className="text-sm text-muted-foreground">Total</span>
                <span className="font-serif text-xl font-bold text-foreground">
                  {precoTotalTexto}
                </span>
              </div>

              {/* Botão Reservar */}
              {indisponivel ? (
                <button
                  type="button"
                  disabled
                  className="inline-flex min-h-11 w-full cursor-not-allowed items-center justify-center rounded-lg bg-muted px-4 py-2.5 text-sm font-medium text-muted-foreground"
                >
                  {!experiencia.isAvailable
                    ? "Indisponível para reserva"
                    : "Sem vagas disponíveis"}
                </button>
              ) : (
                <a
                  href={buildWhatsAppLink(mensagemReserva)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90"
                >
                  Reservar vagas
                </a>
              )}
            </div>
          </aside>
        </div>
      </div>

      {/* Botão Flutuante WhatsApp */}
      <div className="fixed right-4 bottom-4 z-40 sm:right-6 sm:bottom-6">
        <a
          href={buildWhatsAppLink(
            `Olá! Gostaria de tirar uma dúvida sobre o pacote "${experiencia.title}".`,
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
