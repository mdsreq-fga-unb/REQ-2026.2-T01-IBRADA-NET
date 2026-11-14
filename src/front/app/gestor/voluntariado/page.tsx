import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, HandHeart, Leaf, Plus } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Gestão de voluntariado",
};

const indicators = ["Oportunidades abertas", "Candidaturas recebidas", "Aprovadas"];
const filterClass = "mt-2 min-h-11 w-full rounded-xl border border-input bg-card px-3 text-sm text-muted-foreground";

function UnavailableTable({ columns, message }: { columns: string[]; message: string }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-card">
      <table className="w-full min-w-max text-left text-sm">
        <thead className="bg-muted text-muted-foreground">
          <tr>
            {columns.map((column) => (
              <th key={column} scope="col" className="px-4 py-4 sm:px-5">{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className="border-t border-border">
            <td colSpan={columns.length} className="px-4 py-7 text-muted-foreground sm:px-5">{message}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default function GestaoVoluntariadoPage() {
  //TODO: Integrar a sessão e restringir o acesso ao perfil GESTOR nas rotas do painel
  return (
    <div className="min-h-screen">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-border px-6 py-5 lg:px-9">
        <div className="flex items-center gap-3 text-primary">
          <span className="grid size-11 place-items-center rounded-xl bg-primary text-primary-foreground">
            <Leaf aria-hidden="true" className="size-6" />
          </span>
          <div>
            <p className="font-serif text-2xl font-bold leading-none">IBRADA</p>
            <p className="mt-1 text-xs text-muted-foreground sm:text-sm">Instituto Brasileiro de Direito Ambiental</p>
          </div>
        </div>
        {/*TODO: Exibir o nome do gestor e conectar a saída do ambiente administrativo à sessão */}
        <span className="rounded-full bg-muted px-4 py-2 text-sm font-medium text-muted-foreground">
          Ambiente administrativo
        </span>
      </header>

      <div className="grid lg:min-h-[calc(100vh-85px)] lg:grid-cols-[17.5%_minmax(0,1fr)]">
        <aside className="bg-primary px-5 py-6 text-primary-foreground lg:py-10">
          <p className="mb-5 text-xs font-semibold uppercase tracking-widest text-primary-foreground/75">Gestão IBRADA</p>
          <nav aria-label="Gestão IBRADA" className="flex flex-wrap gap-3 lg:flex-col">
            <Link href="/gestor/voluntariado" aria-current="page" className="flex items-center gap-3 rounded-xl bg-primary-foreground/15 px-4 py-3 text-sm font-medium">
              <HandHeart aria-hidden="true" className="size-5" />
              Voluntariado
            </Link>
            <Link href="/" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm hover:bg-primary-foreground/10">
              <ArrowUpRight aria-hidden="true" className="size-5" />
              Visitar site
            </Link>
          </nav>
        </aside>

        <div className="min-w-0 px-6 py-10 sm:px-10 lg:px-[3.5%]">
          <header className="mb-8 flex flex-wrap items-center justify-between gap-5">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-earth">Administração</p>
              <h1 className="font-serif text-4xl sm:text-5xl">Voluntariado</h1>
              <p className="mt-3 text-muted-foreground">Oportunidades que conectam pessoas, comunidades e conservação.</p>
            </div>
            <Link href="/gestor/voluntariado/nova" className={cn(buttonVariants(), "h-11 gap-2 rounded-xl px-5")}>
              <Plus aria-hidden="true" className="size-4" />
              Criar oportunidade
            </Link>
          </header>

          {/*TODO: Exibir as contagens reais de oportunidades abertas, candidaturas recebidas e aprovadas */}
          <dl className="mb-9 grid gap-4 sm:grid-cols-3">
            {indicators.map((label) => (
              <div key={label} className="rounded-2xl border border-border bg-card p-5 sm:p-6">
                <dt className="font-medium text-muted-foreground">{label}</dt>
                <dd className="mt-3 font-serif text-5xl font-semibold">
                  <span aria-hidden="true">—</span>
                  <span className="sr-only">Contagem indisponível</span>
                </dd>
              </div>
            ))}
          </dl>

          <section aria-labelledby="oportunidades-publicadas" className="mb-9">
            <h2 id="oportunidades-publicadas" className="mb-4 font-serif text-3xl">Oportunidades publicadas</h2>
            {/*TODO: Carregar oportunidades da API de gestor e atualizar a tabela apos o cadastro */}
            {/*TODO: Conectar edicao e pausa/retomada quando as rotas de alteracao estiverem disponiveis */}
            <UnavailableTable
              columns={["Oportunidade / projeto", "Vagas", "Candidaturas", "Publicação", "Ações"]}
              message="A lista de oportunidades está indisponível no momento."
            />
          </section>

          <section aria-labelledby="gestao-candidaturas">
            <h2 id="gestao-candidaturas" className="mb-5 font-serif text-3xl">Gestão de candidaturas</h2>
            {/*TODO: Carregar as opções e aplicar os filtros de nome ou email, oportunidade e status */}
            <fieldset disabled className="mb-5 grid gap-4 sm:grid-cols-3">
              <legend className="sr-only">Filtros de candidaturas indisponíveis</legend>
              <label className="text-sm font-medium">
                Buscar candidato
                <input type="search" placeholder="Nome ou e-mail" className={filterClass} />
              </label>
              <label className="text-sm font-medium">
                Oportunidade
                <select className={filterClass}><option>Todas as oportunidades</option></select>
              </label>
              <label className="text-sm font-medium">
                Status da candidatura
                <select className={filterClass}><option>Todos os status</option></select>
              </label>
            </fieldset>
            {/*TODO: Consultar candidaturas com os filtros, implementar paginação e abrir a revisão da linha selecionada */}
            <UnavailableTable
              columns={["Candidato", "Oportunidade", "Recebida", "Status", "Revisão"]}
              message="As candidaturas estão indisponíveis no momento."
            />
            {/*TODO: Carregar a candidatura selecionada e integrar o parecer e as decisões as rotas de revisão */}
            <div className="mt-8 rounded-2xl border border-border bg-card p-6">
              <h3 className="font-serif text-2xl">Revisar candidatura</h3>
              <p className="mt-3 text-sm text-muted-foreground">A revisão ficará disponível quando houver candidaturas para selecionar.</p>
            </div>
          </section>

          <footer className="mt-9 text-sm text-muted-foreground">IBRADA · Gestão interna</footer>
        </div>
      </div>
    </div>
  );
}
