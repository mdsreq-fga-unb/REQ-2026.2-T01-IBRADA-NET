"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Calendar,
  Users,
  MapPin,
  Clock,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  MessageCircle,
  ShieldCheck,
  Compass,
} from "lucide-react";
import { Experiencia, buscarExperienciaPorSlug } from "@/lib/ecoturismo";
import { useAuth } from "@/lib/auth-context";
import { buildWhatsAppLink } from "@/lib/site";

export default function DetalheExperiencia() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const { user } = useAuth();

  const [experiencia, setExperiencia] = useState<Experiencia | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params?.slug) {
      buscarExperienciaPorSlug(params.slug).then((res) => {
        setExperiencia(res);
        setLoading(false);
      });
    }
  }, [params?.slug]);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center text-muted-foreground">
        Carregando detalhes da experiência...
      </div>
    );
  }

  if (!experiencia) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-foreground">Experiência não encontrada</h2>
        <p className="mt-2 text-muted-foreground">
          O pacote procurado não foi localizado ou não está mais ativo.
        </p>
        <Link
          href="/ecoturismo"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
        >
          <ArrowLeft className="size-4" />
          Voltar ao Catálogo
        </Link>
      </div>
    );
  }

  const esgotado = experiencia.isSoldOut || experiencia.availableSeats <= 0;
  const indisponivel = !experiencia.isAvailable;
  const bloqueado = esgotado || indisponivel;

  const formatarData = (iso: string) => {
    try {
      const d = new Date(iso);
      return d.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
    } catch {
      return iso;
    }
  };

  /**
   * FLUXO DO BOTÃO "RESERVAR" (US08 / Requisito 1):
   * 1. Bloqueado se pacote indisponível ou esgotado.
   * 2. Sem login: redireciona para /login?redirect=/ecoturismo/[slug]/reserva para voltar à reserva depois.
   * 3. Com login: navega diretamente para o formulário de reserva /ecoturismo/[slug]/reserva.
   */
  const handleReservarClick = () => {
    if (bloqueado) return;

    const destinoReserva = `/ecoturismo/${experiencia.slug}/reserva`;

    if (!user) {
      router.push(`/login?redirect=${encodeURIComponent(destinoReserva)}`);
    } else {
      router.push(destinoReserva);
    }
  };

  const whatsappDuvidasLink = buildWhatsAppLink(
    `Olá! Tenho uma dúvida sobre a experiência "${experiencia.title}". Pode me ajudar?`
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      {/* Navegação de retorno */}
      <Link
        href="/ecoturismo"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="size-4" />
        Voltar a todas as experiências
      </Link>

      <div className="grid gap-10 lg:grid-cols-[1fr_380px] lg:items-start">
        {/* Coluna Principal: Informações completas do pacote (US03) */}
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold uppercase tracking-wider text-earth">
              Ecoturismo Comunitário
            </span>
            {indisponivel ? (
              <span className="rounded-full bg-gray-200 px-3 py-1 text-xs font-semibold text-gray-700">
                Oferta Indisponível
              </span>
            ) : esgotado ? (
              <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                Vagas Esgotadas
              </span>
            ) : (
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                {experiencia.availableSeats} vagas disponíveis
              </span>
            )}
          </div>

          <h1 className="text-3xl font-bold font-serif text-foreground sm:text-4xl">
            {experiencia.title}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="size-4 text-primary" />
              <span>Início: {formatarData(experiencia.startsAt)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="size-4 text-primary" />
              <span>Término: {formatarData(experiencia.endsAt)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="size-4 text-primary" />
              <span>Capacidade total: {experiencia.capacity} pessoas</span>
            </div>
          </div>

          {/* Descrição detalhada */}
          <section className="mt-8 border-t pt-6">
            <h2 className="text-xl font-bold text-foreground">Sobre a Vivência</h2>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground whitespace-pre-line">
              {experiencia.description}
            </p>
          </section>

          {/* Roteiro e Programação */}
          {experiencia.itinerary && (
            <section className="mt-8 border-t pt-6">
              <div className="flex items-center gap-2 text-xl font-bold text-foreground mb-4">
                <Compass className="size-5 text-primary" />
                <h2>Roteiro Detalhado</h2>
              </div>
              <div className="rounded-2xl bg-secondary/50 p-6">
                <div className="space-y-3 text-sm leading-relaxed text-foreground whitespace-pre-line">
                  {experiencia.itinerary}
                </div>
              </div>
            </section>
          )}

          {/* O que está incluso e recomendações */}
          <section className="mt-8 border-t pt-6">
            <h2 className="text-xl font-bold text-foreground mb-4">O que está incluso</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex items-start gap-2.5 text-sm text-foreground">
                <CheckCircle2 className="size-4 text-primary shrink-0 mt-0.5" />
                <span>Condutor ambiental e comunitário credenciado</span>
              </div>
              <div className="flex items-start gap-2.5 text-sm text-foreground">
                <CheckCircle2 className="size-4 text-primary shrink-0 mt-0.5" />
                <span>Seguro atividade e atendimento a primeiros socorros</span>
              </div>
              <div className="flex items-start gap-2.5 text-sm text-foreground">
                <CheckCircle2 className="size-4 text-primary shrink-0 mt-0.5" />
                <span>Contribuição direta para o fundo comunitário local</span>
              </div>
              <div className="flex items-start gap-2.5 text-sm text-foreground">
                <CheckCircle2 className="size-4 text-primary shrink-0 mt-0.5" />
                <span>Alimentação típica agroecológica produzida no território</span>
              </div>
            </div>
          </section>
        </div>

        {/* Card Lateral de Reserva (Fluxo do Botão Reservar) */}
        <aside className="sticky top-24 rounded-2xl border bg-card p-6 shadow-sm">
          <div className="border-b pb-4">
            <span className="text-xs uppercase tracking-wide text-muted-foreground block">
              Investimento por pessoa
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-primary">
                {experiencia.priceFormatted ?? `R$ ${experiencia.price.toFixed(2).replace(".", ",")}`}
              </span>
              <span className="text-xs text-muted-foreground">/ participante</span>
            </div>
          </div>

          <div className="py-4 space-y-3 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Disponibilidade:</span>
              <span className={`font-semibold ${bloqueado ? "text-destructive" : "text-emerald-700"}`}>
                {indisponivel
                  ? "Indisponível"
                  : esgotado
                  ? "0 vagas (Esgotado)"
                  : `${experiencia.availableSeats} vagas restantes`}
              </span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Período:</span>
              <span className="font-medium text-foreground">{formatarData(experiencia.startsAt)}</span>
            </div>
          </div>

          {/* Avisos de Bloqueio se pacote indisponível ou esgotado */}
          {indisponivel && (
            <div className="mb-4 rounded-lg bg-gray-100 p-3 text-xs text-gray-700 flex items-start gap-2">
              <AlertCircle className="size-4 text-gray-500 shrink-0 mt-0.5" />
              <span>
                Este pacote está temporariamente indisponível para novas reservas no momento.
              </span>
            </div>
          )}

          {esgotado && !indisponivel && (
            <div className="mb-4 rounded-lg bg-red-50 p-3 text-xs text-red-700 flex items-start gap-2 border border-red-200">
              <AlertCircle className="size-4 text-red-500 shrink-0 mt-0.5" />
              <span>
                Todas as vagas para esta data foram preenchidas. Fique atento às próximas turmas!
              </span>
            </div>
          )}

          {!user && !bloqueado && (
            <div className="mb-4 rounded-lg bg-amber-50 p-3 text-xs text-amber-800 border border-amber-200">
              Você será direcionado para entrar na sua conta ao clicar em Reservar.
            </div>
          )}

          {/* Botão Oficial de Reserva (Substitui o WhatsApp Provisório) */}
          <button
            type="button"
            disabled={bloqueado}
            onClick={handleReservarClick}
            className={`w-full rounded-xl py-3.5 px-4 text-center font-bold shadow-xs transition-all ${
              bloqueado
                ? "bg-muted text-muted-foreground cursor-not-allowed opacity-60"
                : "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-md active:scale-[0.99]"
            }`}
          >
            {indisponivel
              ? "Pacote Indisponível"
              : esgotado
              ? "Vagas Esgotadas"
              : "Reservar Vaga Agora"}
          </button>

          {/* Canal de Dúvidas via WhatsApp (secundário, não compra) */}
          <div className="mt-4 border-t pt-4 text-center">
            <a
              href={whatsappDuvidasLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 text-xs font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              <MessageCircle className="size-4 text-whatsapp" />
              Dúvidas sobre o roteiro? Fale no WhatsApp
            </a>
          </div>

          <div className="mt-6 rounded-lg bg-secondary/40 p-3 text-xs text-muted-foreground flex items-center gap-2">
            <ShieldCheck className="size-4 text-primary shrink-0" />
            <span>Garantia de 30 minutos de reserva temporária durante o checkout.</span>
          </div>
        </aside>
      </div>
    </div>
  );
}
