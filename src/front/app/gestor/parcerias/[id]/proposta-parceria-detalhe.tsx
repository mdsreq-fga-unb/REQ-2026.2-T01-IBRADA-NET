"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { GestorShell } from "@/components/gestor-shell";
import { ApiError } from "@/lib/api";
import { mensagemDeErro } from "@/lib/gestor-oportunidades";
import {
  STATUS_PARCERIA,
  atualizarStatusParceria,
  buscarParceria,
  formatarDataHora,
  rotuloStatusParceria,
  type PedidoParceriaDto,
  type StatusParceria,
} from "@/lib/parcerias";
import { cn } from "@/lib/utils";

type Aviso = { tipo: "sucesso" | "erro"; texto: string };

function Dado({ rotulo, children }: { rotulo: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-sm font-medium text-muted-foreground">{rotulo}</dt>
      <dd className="mt-1">{children}</dd>
    </div>
  );
}

export function PropostaParceriaDetalhe({ id }: { id: string }) {
  const [pedido, setPedido] = useState<PedidoParceriaDto | null>(null);
  const [estado, setEstado] = useState<"carregando" | "ok" | "nao-encontrada" | "erro">("carregando");
  const [erro, setErro] = useState("");
  const [status, setStatus] = useState<StatusParceria>("RECEIVED");
  const [salvando, setSalvando] = useState(false);
  const [aviso, setAviso] = useState<Aviso | null>(null);

  useEffect(() => {
    let ativo = true;
    buscarParceria(id)
      .then((dados) => {
        if (!ativo) return;
        setPedido(dados);
        setStatus(dados.status);
        setEstado("ok");
      })
      .catch((e) => {
        if (!ativo) return;
        if (e instanceof ApiError && e.status === 404) return setEstado("nao-encontrada");
        setErro(mensagemDeErro(e, "Não foi possível carregar a proposta."));
        setEstado("erro");
      });
    return () => {
      ativo = false;
    };
  }, [id]);

  async function salvarStatus() {
    if (!pedido || salvando) return;
    setSalvando(true);
    setAviso(null);
    try {
      const resposta = await atualizarStatusParceria(pedido.id, status);
      setPedido(resposta.data);
      setAviso({ tipo: "sucesso", texto: `Status alterado para "${rotuloStatusParceria(resposta.data.status)}".` });
    } catch (e) {
      setAviso({ tipo: "erro", texto: mensagemDeErro(e, "Não foi possível alterar o status da proposta.") });
    } finally {
      setSalvando(false);
    }
  }

  return (
    <GestorShell ativo="parcerias">
      <div className="max-w-4xl">
        <Link
          href="/gestor/parcerias"
          className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          Parcerias
        </Link>

        {estado === "carregando" && <p role="status" className="text-sm text-muted-foreground">Carregando proposta…</p>}
        {estado === "erro" && <p role="alert" className="text-sm text-destructive">{erro}</p>}
        {estado === "nao-encontrada" && (
          <p role="alert" className="text-sm text-destructive">Proposta não encontrada.</p>
        )}

        {estado === "ok" && pedido && (
          <>
            <h1 className="mb-8 font-serif text-4xl text-primary sm:text-5xl">{pedido.organization}</h1>

            <div className="grid gap-6">
              <section aria-labelledby="identificacao" className="rounded-2xl border border-border bg-card p-5 sm:p-8">
                <h2 id="identificacao" className="mb-5 font-serif text-2xl">Identificação e contato</h2>
                <dl className="grid gap-5 sm:grid-cols-2">
                  <Dado rotulo="Instituição">{pedido.organization}</Dado>
                  <Dado rotulo="CNPJ">{pedido.cnpj ?? "Não informado"}</Dado>
                  <Dado rotulo="Responsável">{pedido.contactName}</Dado>
                  <Dado rotulo="E-mail">
                    <a href={`mailto:${pedido.contactEmail}`} className="text-primary hover:underline">
                      {pedido.contactEmail}
                    </a>
                  </Dado>
                  <Dado rotulo="Telefone">{pedido.contactPhone ?? "Não informado"}</Dado>
                  <Dado rotulo="Enviada em">{formatarDataHora(pedido.createdAt)}</Dado>
                </dl>
              </section>

              <section aria-labelledby="proposta" className="rounded-2xl border border-border bg-card p-5 sm:p-8">
                <h2 id="proposta" className="mb-5 font-serif text-2xl">Proposta</h2>
                <p className="whitespace-pre-wrap leading-relaxed">{pedido.proposal}</p>
              </section>

              <section aria-labelledby="acompanhamento" className="rounded-2xl border border-border bg-card p-5 sm:p-8">
                <h2 id="acompanhamento" className="mb-5 font-serif text-2xl">Acompanhamento</h2>
                <div className="flex flex-wrap items-end gap-4">
                  <label className="grid gap-2 text-sm font-medium">
                    Status da proposta
                    <select
                      value={status}
                      disabled={salvando}
                      onChange={(e) => setStatus(e.target.value as StatusParceria)}
                      className="min-h-11 rounded-lg border border-input bg-card px-3"
                    >
                      {STATUS_PARCERIA.map((s) => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                      ))}
                    </select>
                  </label>
                  <button
                    type="button"
                    disabled={salvando || status === pedido.status}
                    onClick={() => void salvarStatus()}
                    className="h-11 rounded-xl bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                  >
                    {salvando ? "Salvando…" : "Salvar status"}
                  </button>
                </div>
                {aviso && (
                  <p
                    role={aviso.tipo === "erro" ? "alert" : "status"}
                    className={cn("mt-4 text-sm", aviso.tipo === "erro" ? "text-destructive" : "text-emerald-800")}
                  >
                    {aviso.texto}
                  </p>
                )}
              </section>
            </div>
          </>
        )}
      </div>
    </GestorShell>
  );
}
