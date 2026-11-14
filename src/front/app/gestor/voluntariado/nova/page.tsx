import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { OpportunityForm } from "./opportunity-form";

export default function NovaOportunidadePage() {
  //TODO: Exigir sessão de gestor também no acesso direto ao formulário
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
      {/*TODO: Carregar projetos e categorias da API para preencher os seletores */}
      {/*TODO: Conectar onCreate ao cadastro autenticado e atualizar a lista e os contadores após salvar */}
      <OpportunityForm projects={[]} categories={[]} />
    </section>
  );
}
