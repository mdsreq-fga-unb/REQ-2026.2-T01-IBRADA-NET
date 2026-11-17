"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { GestorShell } from "@/components/gestor-shell";
import { mensagemDeErro } from "@/lib/gestor-oportunidades";
import {
  atualizarDisponibilidadeExperiencia,
  formatarDataCurta,
  formatarPrecoExperiencia,
  listarExperiencias,
  type ExperienciaResponseDto,
} from "@/lib/experiencias";
import { cn } from "@/lib/utils";

const COLUNAS = ["Pacote", "Data", "Vagas", "Valor", "Publicação", "Ações"];

// Mensagem de sucesso ou erro da última alteração (US12).
type Aviso = { tipo: "sucesso" | "erro"; texto: string };

export default function GestaoEcoturismoPage() {
  const [pacotes, setPacotes] = useState<ExperienciaResponseDto[]>([]);
  const [estado, setEstado] = useState<"carregando" | "ok" | "erro">("carregando");
  const [erroLista, setErroLista] = useState("");
  const [alterando, setAlterando] = useState<string | null>(null);
  const [aviso, setAviso] = useState<Aviso | null>(null);

  const carregar = useCallback(async () => {
    try {
      setPacotes(await listarExperiencias());
      setEstado("ok");
    } catch (e) {
      setErroLista(mensagemDeErro(e, "Não foi possível carregar os pacotes."));
      setEstado("erro");
    }
  }, []);

  useEffect(() => {
    // carregamento inicial dos dados do painel
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void carregar();
  }, [carregar]);

  async function alternar(pacote: ExperienciaResponseDto) {
    setAlterando(pacote.id);
    setAviso(null);
    try {
      const resposta = await atualizarDisponibilidadeExperiencia(pacote.id, { isAvailable: !pacote.isAvailable });
      setPacotes((atuais) => atuais.map((p) => (p.id === pacote.id ? { ...p, ...resposta.data } : p)));
      setAviso({ tipo: "sucesso", texto: resposta.message });
    } catch (e) {
      setAviso({ tipo: "erro", texto: mensagemDeErro(e, "Não foi possível alterar a disponibilidade do pacote.") });
    } finally {
      setAlterando(null);
    }
  }

  const ok = estado === "ok";
  const disponiveis = pacotes.filter((p) => p.isAvailable);
  // Reservas ainda não existem (US08 a US10, incremento 4): "vagas ofertadas" é a capacidade dos pacotes disponíveis.
  const indicadores: Array<{ label: string; value: number | null }> = [
    { label: "Pacotes cadastrados", value: ok ? pacotes.length : null },
    { label: "Pacotes disponíveis", value: ok ? disponiveis.length : null },
    { label: "Pacotes indisponíveis", value: ok ? pacotes.length - disponiveis.length : null },
    { label: "Vagas ofertadas", value: ok ? disponiveis.reduce((soma, p) => soma + p.capacity, 0) : null },
  ];

  return (
    <GestorShell ativo="ecoturismo">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-5">
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-earth">Administração</p>
          <h1 className="font-serif text-4xl sm:text-5xl">Ecoturismo comunitário</h1>
          <p className="mt-3 text-muted-foreground">Gerencie os pacotes e a disponibilidade da oferta.</p>
        </div>
        <Link href="/gestor/ecoturismo/novo" className={cn(buttonVariants(), "h-11 gap-2 rounded-xl px-5")}>
          <Plus aria-hidden="true" className="size-4" />
          Criar pacote
        </Link>
      </header>

      <dl className="mb-9 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {indicadores.map(({ label, value }) => (
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

      <section aria-labelledby="pacotes-e-disponibilidade">
        <h2 id="pacotes-e-disponibilidade" className="mb-4 font-serif text-3xl">Pacotes e disponibilidade</h2>
        {aviso && (
          <p
            role={aviso.tipo === "erro" ? "alert" : "status"}
            className={cn(
              "mb-3 rounded-lg border px-4 py-3 text-sm",
              aviso.tipo === "erro"
                ? "border-destructive/30 text-destructive"
                : "border-emerald-200 bg-emerald-50 text-emerald-950",
            )}
          >
            {aviso.texto}
          </p>
        )}
        <div className="overflow-x-auto rounded-2xl border border-border bg-card">
          <table className="w-full min-w-max text-left text-sm">
            <thead className="bg-muted text-muted-foreground">
              <tr>
                {COLUNAS.map((c) => (
                  <th key={c} scope="col" className="px-4 py-4 sm:px-5">{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {estado !== "ok" || pacotes.length === 0 ? (
                <tr className="border-t border-border">
                  <td colSpan={COLUNAS.length} className="px-4 py-7 text-muted-foreground sm:px-5">
                    {estado === "carregando" && "Carregando pacotes…"}
                    {estado === "erro" && <span role="alert" className="text-destructive">{erroLista}</span>}
                    {ok && "Nenhum pacote cadastrado ainda."}
                  </td>
                </tr>
              ) : (
                pacotes.map((p) => (
                  <tr key={p.id} className="border-t border-border">
                    <td className="px-4 py-4 sm:px-5">
                      <p className="font-medium">{p.title}</p>
                    </td>
                    <td className="px-4 py-4 sm:px-5">
                      {formatarDataCurta(p.startsAt)}
                      {formatarDataCurta(p.endsAt) !== formatarDataCurta(p.startsAt) && ` a ${formatarDataCurta(p.endsAt)}`}
                    </td>
                    <td className="px-4 py-4 sm:px-5">{p.availableSeats ?? p.capacity}</td>
                    <td className="px-4 py-4 sm:px-5">{formatarPrecoExperiencia(p.priceDecimal ?? p.price)}</td>
                    <td className="px-4 py-4 sm:px-5">
                      <span
                        className={cn(
                          "rounded-full px-3 py-1 text-xs font-medium",
                          p.isAvailable ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground",
                        )}
                      >
                        {p.isAvailable ? "Disponível" : "Indisponível"}
                      </span>
                    </td>
                    <td className="px-4 py-4 sm:px-5">
                      <div className="flex flex-wrap items-center gap-4">
                        <button
                          type="button"
                          disabled={alterando === p.id}
                          onClick={() => void alternar(p)}
                          className="font-medium text-primary hover:underline disabled:opacity-50"
                        >
                          {p.isAvailable ? "Tornar indisponível" : "Tornar disponível"}
                        </button>
                        <Link href={`/ecoturismo/${p.slug}`} className="text-muted-foreground hover:underline">
                          Ver página
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          Pacote indisponível continua no catálogo, sinalizado, e não aceita novas reservas. Reservas já feitas são mantidas.
        </p>
      </section>

      <footer className="mt-9 text-sm text-muted-foreground">IBRADA · Gestão interna</footer>
    </GestorShell>
  );
}
