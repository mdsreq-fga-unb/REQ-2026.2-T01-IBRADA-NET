"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { GestorShell } from "@/components/gestor-shell";
import {
  alterarStatusOportunidade,
  listarOportunidadesGestor,
  mensagemDeErro,
} from "@/lib/gestor-oportunidades";
import type { Oportunidade } from "@/lib/oportunidades";
import { cn } from "@/lib/utils";

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
  const [oportunidades, setOportunidades] = useState<Oportunidade[]>([]);
  const [estado, setEstado] = useState<"carregando" | "ok" | "erro">("carregando");
  const [erro, setErro] = useState("");
  const [alterando, setAlterando] = useState<string | null>(null);

  const carregar = useCallback(async () => {
    try {
      setOportunidades(await listarOportunidadesGestor());
      setEstado("ok");
    } catch (e) {
      setErro(mensagemDeErro(e, "Não foi possível carregar as oportunidades."));
      setEstado("erro");
    }
  }, []);

  useEffect(() => {
    // carregamento inicial dos dados do painel
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void carregar();
  }, [carregar]);

  async function alternar(oportunidade: Oportunidade) {
    setAlterando(oportunidade.id);
    setErro("");
    try {
      await alterarStatusOportunidade(oportunidade.id, !oportunidade.aberta);
      await carregar();
    } catch (e) {
      setErro(mensagemDeErro(e, "Não foi possível alterar a oportunidade."));
    } finally {
      setAlterando(null);
    }
  }

  const abertas = oportunidades.filter((o) => o.aberta).length;
  // Candidaturas recebidas e aprovadas dependem da US16 e da US18 (ciclo 8).
  const indicators: Array<{ label: string; value: number | null }> = [
    { label: "Oportunidades abertas", value: estado === "ok" ? abertas : null },
    { label: "Candidaturas recebidas", value: null },
    { label: "Aprovadas", value: null },
  ];

  return (
    <GestorShell ativo="voluntariado">
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

          <dl className="mb-9 grid gap-4 sm:grid-cols-3">
            {indicators.map(({ label, value }) => (
              <div key={label} className="rounded-2xl border border-border bg-card p-5 sm:p-6">
                <dt className="font-medium text-muted-foreground">{label}</dt>
                <dd className="mt-3 font-serif text-5xl font-semibold">
                  {value === null ? (
                    <>
                      <span aria-hidden="true">—</span>
                      <span className="sr-only">Contagem indisponível</span>
                    </>
                  ) : (
                    value
                  )}
                </dd>
              </div>
            ))}
          </dl>

          <section aria-labelledby="oportunidades-publicadas" className="mb-9">
            <h2 id="oportunidades-publicadas" className="mb-4 font-serif text-3xl">Oportunidades publicadas</h2>
            {/*TODO: Edição dos dados da oportunidade (o PATCH já aceita; falta a tela de edição) */}
            {erro && (
              <p role="alert" className="mb-3 text-sm text-destructive">
                {erro}
              </p>
            )}
            {estado === "carregando" && (
              <p role="status" className="text-sm text-muted-foreground">Carregando oportunidades…</p>
            )}
            {estado === "erro" && (
              <UnavailableTable
                columns={["Oportunidade / projeto", "Duração", "Disponibilidade", "Publicação", "Ações"]}
                message="A lista de oportunidades está indisponível no momento."
              />
            )}
            {estado === "ok" && oportunidades.length === 0 && (
              <UnavailableTable
                columns={["Oportunidade / projeto", "Duração", "Disponibilidade", "Publicação", "Ações"]}
                message="Nenhuma oportunidade cadastrada ainda."
              />
            )}
            {estado === "ok" && oportunidades.length > 0 && (
              <div className="overflow-x-auto rounded-2xl border border-border bg-card">
                <table className="w-full min-w-max text-left text-sm">
                  <thead className="bg-muted text-muted-foreground">
                    <tr>
                      {["Oportunidade / projeto", "Duração", "Disponibilidade", "Publicação", "Ações"].map((c) => (
                        <th key={c} scope="col" className="px-4 py-4 sm:px-5">{c}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {oportunidades.map((o) => (
                      <tr key={o.id} className="border-t border-border">
                        <td className="px-4 py-4 sm:px-5">
                          <p className="font-medium">{o.titulo}</p>
                          {o.projeto && <p className="text-muted-foreground">{o.projeto}</p>}
                        </td>
                        <td className="px-4 py-4 sm:px-5">{o.duracao}</td>
                        <td className="px-4 py-4 sm:px-5">{o.disponibilidade}</td>
                        <td className="px-4 py-4 sm:px-5">
                          <span
                            className={cn(
                              "rounded-full px-3 py-1 text-xs font-medium",
                              o.aberta ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground",
                            )}
                          >
                            {o.aberta ? "Aberta" : "Pausada"}
                          </span>
                        </td>
                        <td className="px-4 py-4 sm:px-5">
                          <button
                            type="button"
                            disabled={alterando === o.id}
                            onClick={() => void alternar(o)}
                            className="font-medium text-primary hover:underline disabled:opacity-50"
                          >
                            {o.aberta ? "Pausar" : "Retomar"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section aria-labelledby="gestao-candidaturas">
            <h2 id="gestao-candidaturas" className="mb-5 font-serif text-3xl">Gestão de candidaturas</h2>
            {/*TODO (US16 e US18, ciclo 8): carregar candidaturas, filtros, paginação e revisão */}
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
            <UnavailableTable
              columns={["Candidato", "Oportunidade", "Recebida", "Status", "Revisão"]}
              message="As candidaturas estão indisponíveis no momento."
            />
            <div className="mt-8 rounded-2xl border border-border bg-card p-6">
              <h3 className="font-serif text-2xl">Revisar candidatura</h3>
              <p className="mt-3 text-sm text-muted-foreground">A revisão ficará disponível quando houver candidaturas para selecionar.</p>
            </div>
          </section>

          <footer className="mt-9 text-sm text-muted-foreground">IBRADA · Gestão interna</footer>
    </GestorShell>
  );
}
