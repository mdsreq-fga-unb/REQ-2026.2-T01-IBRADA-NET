"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Calendar, Users, MapPin, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { Experiencia, listarExperiencias } from "@/lib/ecoturismo";

export default function CatalogoEcoturismo() {
  const [experiencias, setExperiencias] = useState<Experiencia[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listarExperiencias().then((dados) => {
      setExperiencias(dados);
      setLoading(false);
    });
  }, []);

  const formatarData = (iso: string) => {
    try {
      const d = new Date(iso);
      return d.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return iso;
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      {/* Hero do Ecoturismo */}
      <div className="mb-12 text-center sm:text-left sm:flex sm:items-end sm:justify-between border-b pb-8">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-primary mb-3">
            <Sparkles className="size-3.5" />
            <span>Turismo Sustentável e Comunitário no Cerrado</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-serif">
            Experiências de Ecoturismo
          </h1>
          <p className="mt-3 text-base text-muted-foreground sm:text-lg">
            Conheça o Cerrado de perto com quem preserva e vive na terra. Vivências autênticas,
            trilhas interpretativas e contato direto com comunidades tradicionais e agricultores familiares.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-muted-foreground">
          Carregando experiências de ecoturismo...
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {experiencias.map((exp) => {
            const esgotado = exp.isSoldOut || exp.availableSeats <= 0;
            const indisponivel = !exp.isAvailable;
            const bloqueado = esgotado || indisponivel;

            return (
              <div
                key={exp.id}
                className="group flex flex-col justify-between rounded-2xl border bg-card p-6 shadow-xs transition-all hover:shadow-md hover:border-primary/40"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-earth">
                      <MapPin className="size-3.5" />
                      Cerrado Vivo
                    </span>

                    {indisponivel ? (
                      <span className="rounded-full bg-gray-200 px-2.5 py-0.5 text-xs font-semibold text-gray-700">
                        Indisponível
                      </span>
                    ) : esgotado ? (
                      <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-700">
                        Esgotado
                      </span>
                    ) : (
                      <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
                        {exp.availableSeats} {exp.availableSeats === 1 ? "vaga restante" : "vagas restantes"}
                      </span>
                    )}
                  </div>

                  <h2 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                    {exp.title}
                  </h2>

                  <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground line-clamp-3">
                    {exp.description}
                  </p>

                  <div className="mt-5 space-y-2 text-xs text-muted-foreground border-t pt-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="size-4 text-primary" />
                      <span>{formatarData(exp.startsAt)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="size-4 text-primary" />
                      <span>Capacidade total: {exp.capacity} pessoas</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 border-t pt-4 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-muted-foreground block">Por participante</span>
                    <span className="text-xl font-bold text-primary">
                      {exp.priceFormatted ?? `R$ ${exp.price.toFixed(2).replace(".", ",")}`}
                    </span>
                  </div>

                  <Link
                    href={`/ecoturismo/${exp.slug}`}
                    className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                      bloqueado
                        ? "bg-muted text-muted-foreground hover:bg-muted/80"
                        : "bg-primary text-primary-foreground hover:bg-primary/90"
                    }`}
                  >
                    <span>{bloqueado ? "Ver detalhes" : "Reservar"}</span>
                    <ArrowRight className="size-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Selo e garantia */}
      <div className="mt-16 rounded-2xl bg-secondary/60 p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-5">
        <div className="rounded-full bg-primary/10 p-3 text-primary shrink-0">
          <ShieldCheck className="size-8" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            Reserva direta, segura e transparente
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Toda a arrecadação das vivências é revertida diretamente para o sustento das famílias
            condutoras locais e para as ações de conservação de nascentes do bioma Cerrado promovidas pelo IBRADA.
          </p>
        </div>
      </div>
    </div>
  );
}
