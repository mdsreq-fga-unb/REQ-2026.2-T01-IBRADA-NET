import type { Metadata } from "next";
import { OportunidadeDetalhe } from "./oportunidade-detalhe";

export const metadata: Metadata = {
  title: "Oportunidade de voluntariado",
};

type PaginaOportunidadeProps = {
  params: Promise<{ id: string }>;
};

export default async function PaginaOportunidade({ params }: PaginaOportunidadeProps) {
  const { id } = await params;
  return <OportunidadeDetalhe id={id} />;
}
