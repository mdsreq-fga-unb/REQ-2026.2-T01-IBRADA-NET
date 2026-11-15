"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import {
  criarOportunidade,
  listarCategorias,
  listarProjetos,
  mensagemDeErro,
  type Opcao,
} from "@/lib/gestor-oportunidades";
import { OpportunityForm } from "./opportunity-form";

export default function NovaOportunidadePage() {
  const [projects, setProjects] = useState<Opcao[]>([]);
  const [categories, setCategories] = useState<Opcao[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let ativo = true;
    Promise.all([listarProjetos(), listarCategorias()])
      .then(([projetos, categorias]) => {
        if (!ativo) return;
        setProjects(projetos);
        setCategories(categorias);
      })
      .catch((erro) => {
        if (ativo) setLoadError(mensagemDeErro(erro, "Não foi possível carregar projetos e categorias."));
      });
    return () => {
      ativo = false;
    };
  }, []);

  return (
    <section className="mx-auto max-w-4xl px-6 py-12 sm:py-16">
      <header className="mb-8">
        <Link
          href="/gestor/voluntariado"
          className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          Gestão de voluntariado
        </Link>
        <h1 className="font-serif text-4xl text-primary sm:text-5xl">Criar oportunidade</h1>
      </header>
      {loadError && (
        <p role="alert" className="mb-4 text-sm text-destructive">
          {loadError}
        </p>
      )}
      <OpportunityForm
        projects={projects}
        categories={categories}
        onCreate={async (draft) => {
          try {
            await criarOportunidade(draft);
          } catch (erro) {
            throw new Error(mensagemDeErro(erro, "Não foi possível criar a oportunidade. Tente novamente."));
          }
        }}
      />
    </section>
  );
}
