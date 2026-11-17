import type { Metadata } from "next";
import { Suspense } from "react";
import { PropostaParceriaDetalhe } from "./proposta-parceria-detalhe";

export const metadata: Metadata = {
  title: "Proposta de parceria",
};

type PaginaPropostaProps = {
  params: Promise<{ id: string }>;
};

// Com cacheComponents, ler `params` (rota dinâmica) precisa estar dentro de um Suspense.
async function ConteudoProposta({ params }: PaginaPropostaProps) {
  const { id } = await params;
  return <PropostaParceriaDetalhe id={id} />;
}

export default function PaginaProposta({ params }: PaginaPropostaProps) {
  return (
    <Suspense
      fallback={
        <p role="status" className="mx-auto max-w-7xl px-4 py-10 text-sm text-muted-foreground sm:px-6">
          Carregando proposta…
        </p>
      }
    >
      <ConteudoProposta params={params} />
    </Suspense>
  );
}
