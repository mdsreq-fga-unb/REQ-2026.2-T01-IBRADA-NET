"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { GestorShell } from "@/components/gestor-shell";
import { mensagemDeErro } from "@/lib/gestor-oportunidades";
import {
  formatarDataHora,
  listarParcerias,
  rotuloStatusParceria,
  type PedidoParceriaDto,
} from "@/lib/parcerias";
import { cn } from "@/lib/utils";

const COLUNAS = ["Enviada em", "Instituição", "Contato", "Status", "Ações"];

export default function GestaoParceriasPage() {
  const [pedidos, setPedidos] = useState<PedidoParceriaDto[]>([]);
  const [estado, setEstado] = useState<"carregando" | "ok" | "erro">("carregando");
  const [erro, setErro] = useState("");

  const carregar = useCallback(async () => {
    try {
      setPedidos(await listarParcerias());
      setEstado("ok");
    } catch (e) {
      setErro(mensagemDeErro(e, "Não foi possível carregar as solicitações de parceria."));
      setEstado("erro");
    }
  }, []);

  useEffect(() => {
    // carregamento inicial dos dados do painel
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void carregar();
  }, [carregar]);

  return (
    <GestorShell ativo="parcerias">
      <header className="mb-8">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-earth">Administração</p>
        <h1 className="font-serif text-4xl sm:text-5xl">Parcerias</h1>
        <p className="mt-3 text-muted-foreground">Solicitações de parceria recebidas, das mais recentes para as mais antigas.</p>
      </header>

      <section aria-labelledby="solicitacoes-recebidas">
        <h2 id="solicitacoes-recebidas" className="mb-4 font-serif text-3xl">Solicitações recebidas</h2>
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
              {estado !== "ok" || pedidos.length === 0 ? (
                <tr className="border-t border-border">
                  <td colSpan={COLUNAS.length} className="px-4 py-7 text-muted-foreground sm:px-5">
                    {estado === "carregando" && "Carregando solicitações…"}
                    {estado === "erro" && <span role="alert" className="text-destructive">{erro}</span>}
                    {estado === "ok" && "Nenhuma solicitação de parceria recebida ainda."}
                  </td>
                </tr>
              ) : (
                pedidos.map((p) => (
                  <tr key={p.id} className="border-t border-border">
                    <td className="px-4 py-4 sm:px-5">{formatarDataHora(p.createdAt)}</td>
                    <td className="px-4 py-4 font-medium sm:px-5">{p.organization}</td>
                    <td className="px-4 py-4 sm:px-5">
                      <p>{p.contactName}</p>
                      <p className="text-muted-foreground">{p.contactEmail}</p>
                    </td>
                    <td className="px-4 py-4 sm:px-5">
                      <span
                        className={cn(
                          "rounded-full px-3 py-1 text-xs font-medium",
                          p.status === "RECEIVED" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground",
                        )}
                      >
                        {rotuloStatusParceria(p.status)}
                      </span>
                    </td>
                    <td className="px-4 py-4 sm:px-5">
                      <Link href={`/gestor/parcerias/${p.id}`} className="font-medium text-primary hover:underline">
                        Ver proposta
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </GestorShell>
  );
}
