import type { Metadata } from "next";
import type React from "react";
import { Suspense } from "react";
import { ExperienciaDetalhe } from "./experiencia-detalhe";

export const metadata: Metadata = {
  title: "Pacote de ecoturismo",
};

interface PaginaExperienciaProps {
  params: Promise<{ slug: string }>;
}

// Com cacheComponents, ler `params` (rota dinâmica) precisa estar dentro de um Suspense.
async function ConteudoExperiencia({
  params,
}: PaginaExperienciaProps): Promise<React.JSX.Element> {
  const { slug } = await params;
  return <ExperienciaDetalhe slug={slug} />;
}

export default function PaginaExperiencia({
  params,
}: PaginaExperienciaProps): React.JSX.Element {
  return (
    <Suspense
      fallback={
        <p
          role="status"
          className="mx-auto max-w-6xl px-4 py-10 text-sm text-muted-foreground sm:px-6 lg:px-8"
        >
          Carregando pacote…
        </p>
      }
    >
      <ConteudoExperiencia params={params} />
    </Suspense>
  );
}
