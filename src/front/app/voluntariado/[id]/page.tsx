import type { Metadata } from "next";
import { Suspense } from "react";
import { OportunidadeDetalhe } from "./oportunidade-detalhe";

export const metadata: Metadata = {
  title: "Oportunidade de voluntariado",
};

type PaginaOportunidadeProps = {
  params: Promise<{ id: string }>;
};

// Com cacheComponents, ler `params` (rota dinâmica) precisa estar dentro de um Suspense.
async function ConteudoOportunidade({ params }: PaginaOportunidadeProps) {
  const { id } = await params;
  return <OportunidadeDetalhe id={id} />;
}

export default function PaginaOportunidade({ params }: PaginaOportunidadeProps) {
  return (
    <Suspense
      fallback={
        <p role="status" className="mx-auto max-w-7xl px-4 py-10 text-sm text-muted-foreground sm:px-6">
          Carregando oportunidade…
        </p>
      }
    >
      <ConteudoOportunidade params={params} />
    </Suspense>
  );
}
