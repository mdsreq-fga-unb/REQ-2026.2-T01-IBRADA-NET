import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check, Clock3, FolderOpen, MapPin, Monitor } from "lucide-react";
import { buscarOportunidade, oportunidades } from "@/lib/oportunidades";

type PaginaOportunidadeProps = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return oportunidades.map(({ id }) => ({ id }));
}

export async function generateMetadata({
  params,
}: PaginaOportunidadeProps): Promise<Metadata> {
  const { id } = await params;
  const oportunidade = buscarOportunidade(id);

  return {
    title: oportunidade?.titulo ?? "Oportunidade de voluntariado",
  };
}

export default async function PaginaOportunidade({
  params,
}: PaginaOportunidadeProps) {
  const { id } = await params;
  const oportunidade = buscarOportunidade(id);

  if (!oportunidade) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
      <Link
        href="/voluntariado"
        className="mb-7 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft aria-hidden="true" className="size-4" />
        Todas as oportunidades
      </Link>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start lg:gap-10">
        <div>
          <div className="mb-3 flex flex-wrap gap-2">
            <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
              {oportunidade.area}
            </span>
            <span className="rounded-full border border-border px-3 py-1 text-xs font-medium text-foreground/80">
              {oportunidade.formato}
            </span>
          </div>

          <h1 className="max-w-3xl text-3xl leading-tight font-semibold tracking-tight sm:text-4xl lg:text-[2.75rem]">
            {oportunidade.titulo}
          </h1>

          {oportunidade.descricao && (
            <section
              aria-label="Projeto beneficiado"
              className="mt-7 rounded-2xl bg-secondary/75 p-5 sm:p-6"
            >
              <p className="mb-2 text-xs font-semibold tracking-wide text-earth uppercase">
                Projeto beneficiado: {oportunidade.projeto}
              </p>
              <p className="text-sm leading-relaxed sm:text-base">
                {oportunidade.descricao}
              </p>
            </section>
          )}

          {oportunidade.atividades && oportunidade.atividades.length > 0 && (
            <section className="mt-8">
              <h2 className="text-xl font-semibold">O que você vai fazer</h2>
              <ul className="mt-3 space-y-2.5">
                {oportunidade.atividades.map((atividade) => (
                  <li
                    key={atividade}
                    className="flex items-start gap-2.5 text-sm leading-relaxed"
                  >
                    <Check
                      aria-hidden="true"
                      className="mt-0.5 size-4 shrink-0 text-primary"
                      strokeWidth={2}
                    />
                    <span>{atividade}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="mt-8">
            <h2 className="text-xl font-semibold">Requisitos</h2>
            <ul className="mt-3 space-y-2.5">
              {oportunidade.requisitos.map((requisito) => (
                <li
                  key={requisito}
                  className="flex items-start gap-2.5 text-sm leading-relaxed"
                >
                  <span
                    aria-hidden="true"
                    className="mt-2 size-1.5 shrink-0 rounded-full bg-earth"
                  />
                  <span>{requisito}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <aside className="rounded-2xl border border-border bg-card p-5 shadow-lg shadow-foreground/10 lg:sticky lg:top-24">
          <dl className="space-y-4">
            <div className="flex items-start gap-3">
              <FolderOpen
                aria-hidden="true"
                className="mt-0.5 size-4 shrink-0 text-primary"
              />
              <div>
                <dt className="text-xs text-muted-foreground">Projeto</dt>
                <dd className="text-sm font-medium">{oportunidade.projeto}</dd>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Monitor
                aria-hidden="true"
                className="mt-0.5 size-4 shrink-0 text-primary"
              />
              <div>
                <dt className="text-xs text-muted-foreground">Formato</dt>
                <dd className="text-sm font-medium">{oportunidade.formato}</dd>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock3
                aria-hidden="true"
                className="mt-0.5 size-4 shrink-0 text-primary"
              />
              <div>
                <dt className="text-xs text-muted-foreground">Disponibilidade</dt>
                <dd className="text-sm font-medium">{oportunidade.duracao}</dd>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin
                aria-hidden="true"
                className="mt-0.5 size-4 shrink-0 text-primary"
              />
              <div>
                <dt className="text-xs text-muted-foreground">Local</dt>
                <dd className="text-sm font-medium">{oportunidade.local}</dd>
              </div>
            </div>
          </dl>

          <Link
            href="/login"
            className="mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            Candidatar-se
          </Link>
        </aside>
      </div>
    </div>
  );
}
