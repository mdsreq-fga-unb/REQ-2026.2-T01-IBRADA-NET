"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Plus,
  X,
  XCircle,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { GestorShell } from "@/components/gestor-shell";
import {
  alterarStatusOportunidade,
  atualizarOportunidade,
  listarOportunidadesGestor,
  mensagemDeErro,
} from "@/lib/gestor-oportunidades";
import {
  atualizarStatusCandidatura,
  ETAPA_LABELS,
  ETAPAS_FUNIL,
  listarCandidaturasGestor,
  type CandidaturaGestorItem,
  type EtapaCandidatura,
} from "@/lib/gestor-candidaturas";
import { NIVEL_EDUCACAO_OPTIONS, STATUS_EDUCACAO_OPTIONS } from "@/lib/brasil";
import { buscarOportunidade, type Oportunidade } from "@/lib/oportunidades";
import { cn } from "@/lib/utils";

const filterClass =
  "mt-2 min-h-11 w-full rounded-xl border border-input bg-card px-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/40";

const STATUS_BADGE_CLASS: Record<EtapaCandidatura, string> = {
  INSCRITO: "bg-secondary text-secondary-foreground",
  EM_ANALISE: "bg-amber-100 text-amber-900",
  ENTREVISTA: "bg-sky-100 text-sky-900",
  APROVADO: "bg-emerald-100 text-emerald-900",
  REJEITADO: "bg-rose-100 text-rose-900",
};

function formatarData(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "short" }).format(date);
}

function labelEducacao(nivel: string | null, completude: string | null): string {
  if (!nivel) return "Não informado";
  const nivelLabel = NIVEL_EDUCACAO_OPTIONS.find((o) => o.value === nivel)?.label ?? nivel;
  const compLabel = STATUS_EDUCACAO_OPTIONS.find((o) => o.value === completude)?.label;
  return compLabel ? `${nivelLabel} (${compLabel})` : nivelLabel;
}

export default function GestaoVoluntariadoPage() {
  // === Oportunidades (US13 / RF19) ===
  const [oportunidades, setOportunidades] = useState<Oportunidade[]>([]);
  const [estadoOps, setEstadoOps] = useState<"carregando" | "ok" | "erro">("carregando");
  const [erroOps, setErroOps] = useState("");
  const [alterandoOpId, setAlterandoOpId] = useState<string | null>(null);

  // Modal/painel de edição rápida da oportunidade (PATCH /oportunidades/:id)
  const [editandoOp, setEditandoOp] = useState<Oportunidade | null>(null);
  const [salvandoEdicao, setSalvandoEdicao] = useState(false);

  // === Candidaturas & Funil (US18) ===
  const [candidaturas, setCandidaturas] = useState<CandidaturaGestorItem[]>([]);
  const [estadoCands, setEstadoCands] = useState<"carregando" | "ok" | "erro">("carregando");
  const [erroCands, setErroCands] = useState("");
  const [busca, setBusca] = useState("");
  const [filtroOportunidadeId, setFiltroOportunidadeId] = useState("");
  const [filtroStatus, setFiltroStatus] = useState<EtapaCandidatura | "">("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalFiltrado, setTotalFiltrado] = useState(0);
  const [resumo, setResumo] = useState<{
    total: number;
    porStatus: Record<EtapaCandidatura, number>;
  } | null>(null);

  const [selecionada, setSelecionada] = useState<CandidaturaGestorItem | null>(null);
  const [atualizandoStatus, setAtualizandoStatus] = useState(false);
  const [feedbackStatus, setFeedbackStatus] = useState("");

  const carregarOportunidades = useCallback(async () => {
    try {
      setOportunidades(await listarOportunidadesGestor());
      setEstadoOps("ok");
    } catch (e) {
      setErroOps(mensagemDeErro(e, "Não foi possível carregar as oportunidades."));
      setEstadoOps("erro");
    }
  }, []);

  const carregarCandidaturas = useCallback(async () => {
    setEstadoCands("carregando");
    setErroCands("");
    try {
      const res = await listarCandidaturasGestor({
        oportunidadeId: filtroOportunidadeId || undefined,
        status: filtroStatus || undefined,
        busca: busca || undefined,
        page,
        limit: 10,
      });
      setCandidaturas(res.data);
      setTotalPages(res.meta.totalPages);
      setTotalFiltrado(res.meta.total);
      setResumo(res.resumo);
      setEstadoCands("ok");

      // Mantém a candidatura selecionada sincronizada se estiver na página atual
      setSelecionada((atual) => {
        if (!atual) return null;
        return res.data.find((item) => item.id === atual.id) ?? atual;
      });
    } catch (e) {
      setErroCands(mensagemDeErro(e, "Não foi possível carregar as candidaturas."));
      setEstadoCands("erro");
    }
  }, [filtroOportunidadeId, filtroStatus, busca, page]);

  useEffect(() => {
    void carregarOportunidades();
  }, [carregarOportunidades]);

  useEffect(() => {
    void carregarCandidaturas();
  }, [carregarCandidaturas]);

  async function alternarPublicacao(oportunidade: Oportunidade) {
    setAlterandoOpId(oportunidade.id);
    setErroOps("");
    try {
      await alterarStatusOportunidade(oportunidade.id, !oportunidade.aberta);
      await carregarOportunidades();
    } catch (e) {
      setErroOps(mensagemDeErro(e, "Não foi possível alterar o status da oportunidade."));
    } finally {
      setAlterandoOpId(null);
    }
  }

  async function abrirEdicaoOportunidade(id: string) {
    setErroOps("");
    try {
      const detalhe = await buscarOportunidade(id);
      if (detalhe) setEditandoOp(detalhe);
    } catch (e) {
      setErroOps(mensagemDeErro(e, "Não foi possível carregar os dados da oportunidade."));
    }
  }

  async function salvarEdicaoOportunidade(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editandoOp) return;
    setSalvandoEdicao(true);
    setErroOps("");
    try {
      await atualizarOportunidade(editandoOp.id, {
        title: editandoOp.titulo,
        description: editandoOp.descricao,
        duracao: editandoOp.duracao,
        disponibilidade: editandoOp.disponibilidade,
        atividades: editandoOp.atividades.join("\n"),
        localAtuacao: editandoOp.local,
      });
      setEditandoOp(null);
      await carregarOportunidades();
    } catch (err) {
      setErroOps(mensagemDeErro(err, "Não foi possível salvar a edição da oportunidade."));
    } finally {
      setSalvandoEdicao(false);
    }
  }

  async function moverEtapa(candidaturaId: string, novaEtapa: EtapaCandidatura) {
    setAtualizandoStatus(true);
    setFeedbackStatus("");
    setErroCands("");
    try {
      await atualizarStatusCandidatura(candidaturaId, novaEtapa);
      setSelecionada((prev) => (prev && prev.id === candidaturaId ? { ...prev, status: novaEtapa } : prev));
      setFeedbackStatus(`Candidatura atualizada para "${ETAPA_LABELS[novaEtapa]}".`);
      await carregarCandidaturas();
    } catch (err) {
      setErroCands(mensagemDeErro(err, "Não foi possível atualizar a etapa da candidatura."));
    } finally {
      setAtualizandoStatus(false);
    }
  }

  const abertas = oportunidades.filter((o) => o.aberta).length;
  const indicators: Array<{ label: string; value: number | null }> = [
    { label: "Oportunidades abertas", value: estadoOps === "ok" ? abertas : null },
    { label: "Candidaturas recebidas", value: resumo ? resumo.total : null },
    { label: "Aprovadas", value: resumo ? resumo.porStatus.APROVADO : null },
  ];

  return (
    <GestorShell ativo="voluntariado">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-5">
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-earth">
            Administração
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl">Voluntariado</h1>
          <p className="mt-3 text-muted-foreground">
            Oportunidades que conectam pessoas, comunidades e conservação.
          </p>
        </div>
        <Link
          href="/gestor/voluntariado/nova"
          className={cn(buttonVariants(), "h-11 gap-2 rounded-xl px-5")}
        >
          <Plus aria-hidden="true" className="size-4" />
          Criar oportunidade
        </Link>
      </header>

      {/* Indicadores do Painel */}
      <dl className="mb-9 grid gap-4 sm:grid-cols-3">
        {indicators.map(({ label, value }) => (
          <div key={label} className="rounded-2xl border border-border bg-card p-5 sm:p-6">
            <dt className="font-medium text-muted-foreground">{label}</dt>
            <dd className="mt-3 font-serif text-5xl font-semibold">
              {value === null ? (
                <>
                  <span aria-hidden="true">—</span>
                  <span className="sr-only">Carregando contagem</span>
                </>
              ) : (
                value
              )}
            </dd>
          </div>
        ))}
      </dl>

      {/* Seção 1: Oportunidades publicadas (US13 / RF19) */}
      <section aria-labelledby="oportunidades-publicadas" className="mb-10">
        <h2 id="oportunidades-publicadas" className="mb-4 font-serif text-3xl">
          Oportunidades publicadas
        </h2>

        {erroOps && (
          <p role="alert" className="mb-3 text-sm text-destructive">
            {erroOps}
          </p>
        )}

        {editandoOp && (
          <form
            onSubmit={salvarEdicaoOportunidade}
            className="mb-6 rounded-2xl border border-primary/40 bg-card p-5 shadow-sm sm:p-6"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-serif text-xl font-semibold">
                Editar oportunidade: {editandoOp.titulo}
              </h3>
              <button
                type="button"
                onClick={() => setEditandoOp(null)}
                aria-label="Fechar edição"
                className="rounded-lg p-1 text-muted-foreground hover:bg-muted"
              >
                <X className="size-4" />
              </button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-1.5 text-sm font-medium sm:col-span-2">
                Título
                <input
                  required
                  value={editandoOp.titulo}
                  onChange={(e) => setEditandoOp({ ...editandoOp, titulo: e.target.value })}
                  className="min-h-10 rounded-lg border border-input bg-background px-3 text-sm"
                />
              </label>
              <label className="grid gap-1.5 text-sm font-medium">
                Duração
                <input
                  required
                  value={editandoOp.duracao}
                  onChange={(e) => setEditandoOp({ ...editandoOp, duracao: e.target.value })}
                  className="min-h-10 rounded-lg border border-input bg-background px-3 text-sm"
                />
              </label>
              <label className="grid gap-1.5 text-sm font-medium">
                Disponibilidade
                <input
                  required
                  value={editandoOp.disponibilidade}
                  onChange={(e) =>
                    setEditandoOp({ ...editandoOp, disponibilidade: e.target.value })
                  }
                  className="min-h-10 rounded-lg border border-input bg-background px-3 text-sm"
                />
              </label>
              <label className="grid gap-1.5 text-sm font-medium sm:col-span-2">
                Descrição
                <textarea
                  rows={2}
                  required
                  value={editandoOp.descricao ?? ""}
                  onChange={(e) => setEditandoOp({ ...editandoOp, descricao: e.target.value })}
                  className="rounded-lg border border-input bg-background p-3 text-sm"
                />
              </label>
            </div>
            <div className="mt-4 flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setEditandoOp(null)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={salvandoEdicao}>
                {salvandoEdicao ? "Salvando..." : "Salvar alterações"}
              </Button>
            </div>
          </form>
        )}

        {estadoOps === "carregando" && (
          <p role="status" className="text-sm text-muted-foreground">
            Carregando oportunidades…
          </p>
        )}

        {estadoOps === "ok" && oportunidades.length === 0 && (
          <div className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">
            Nenhuma oportunidade cadastrada ainda.
          </div>
        )}

        {estadoOps === "ok" && oportunidades.length > 0 && (
          <div className="overflow-x-auto rounded-2xl border border-border bg-card">
            <table className="w-full min-w-max text-left text-sm">
              <thead className="bg-muted text-muted-foreground">
                <tr>
                  {["Oportunidade / projeto", "Duração", "Disponibilidade", "Publicação", "Ações"].map(
                    (c) => (
                      <th key={c} scope="col" className="px-4 py-4 sm:px-5">
                        {c}
                      </th>
                    ),
                  )}
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
                          o.aberta
                            ? "bg-primary/10 text-primary"
                            : "bg-muted text-muted-foreground",
                        )}
                      >
                        {o.aberta ? "Aberta" : "Pausada"}
                      </span>
                    </td>
                    <td className="px-4 py-4 sm:px-5">
                      <div className="flex items-center gap-4">
                        <button
                          type="button"
                          onClick={() => void abrirEdicaoOportunidade(o.id)}
                          className="inline-flex items-center gap-1 font-medium text-foreground/80 hover:text-primary hover:underline cursor-pointer"
                        >
                          <Pencil className="size-3.5" aria-hidden="true" />
                          Editar
                        </button>
                        <button
                          type="button"
                          disabled={alterandoOpId === o.id}
                          onClick={() => void alternarPublicacao(o)}
                          className="font-medium text-primary hover:underline disabled:opacity-50 cursor-pointer"
                        >
                          {o.aberta ? "Pausar" : "Retomar"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Seção 2: Gestão de candidaturas — Funil (US18) */}
      <section aria-labelledby="gestao-candidaturas">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 id="gestao-candidaturas" className="font-serif text-3xl">
              Gestão de candidaturas
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Filtre por oportunidade ou etapa do funil e avalie o perfil dos candidatos.
            </p>
          </div>
          {estadoCands === "ok" && (
            <p className="text-sm text-muted-foreground" aria-live="polite">
              {totalFiltrado}{" "}
              {totalFiltrado === 1 ? "candidatura encontrada" : "candidaturas encontradas"}
            </p>
          )}
        </div>

        {/* Filtros */}
        <div className="mb-5 grid gap-4 sm:grid-cols-3">
          <label className="text-sm font-medium">
            Buscar candidato
            <input
              type="search"
              value={busca}
              onChange={(e) => {
                setBusca(e.target.value);
                setPage(1);
              }}
              placeholder="Nome ou e-mail"
              className={filterClass}
            />
          </label>
          <label className="text-sm font-medium">
            Oportunidade
            <select
              value={filtroOportunidadeId}
              onChange={(e) => {
                setFiltroOportunidadeId(e.target.value);
                setPage(1);
              }}
              className={filterClass}
            >
              <option value="">Todas as oportunidades</option>
              {oportunidades.map((op) => (
                <option key={op.id} value={op.id}>
                  {op.titulo}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm font-medium">
            Status da candidatura
            <select
              value={filtroStatus}
              onChange={(e) => {
                setFiltroStatus(e.target.value as EtapaCandidatura | "");
                setPage(1);
              }}
              className={filterClass}
            >
              <option value="">Todos os status</option>
              {ETAPAS_FUNIL.map((etapa) => (
                <option key={etapa} value={etapa}>
                  {ETAPA_LABELS[etapa]}
                </option>
              ))}
            </select>
          </label>
        </div>

        {erroCands && (
          <p role="alert" className="mb-4 text-sm text-destructive">
            {erroCands}
          </p>
        )}

        {/* Tabela de Candidaturas */}
        <div className="overflow-x-auto rounded-2xl border border-border bg-card">
          <table className="w-full min-w-max text-left text-sm">
            <thead className="bg-muted text-muted-foreground">
              <tr>
                {["Candidato", "Oportunidade", "Recebida", "Status", "Revisão"].map((col) => (
                  <th key={col} scope="col" className="px-4 py-4 sm:px-5">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {estadoCands === "carregando" && (
                <tr className="border-t border-border">
                  <td colSpan={5} className="px-4 py-7 text-muted-foreground sm:px-5">
                    Carregando candidaturas…
                  </td>
                </tr>
              )}
              {estadoCands === "ok" && candidaturas.length === 0 && (
                <tr className="border-t border-border">
                  <td colSpan={5} className="px-4 py-7 text-muted-foreground sm:px-5">
                    Nenhuma candidatura encontrada para os filtros selecionados.
                  </td>
                </tr>
              )}
              {estadoCands === "ok" &&
                candidaturas.map((item) => {
                  const isSelected = selecionada?.id === item.id;
                  return (
                    <tr
                      key={item.id}
                      className={cn(
                        "border-t border-border transition-colors",
                        isSelected && "bg-secondary/40",
                      )}
                    >
                      <td className="px-4 py-4 sm:px-5">
                        <p className="font-medium text-foreground">{item.voluntario.name}</p>
                        <p className="text-xs text-muted-foreground">{item.voluntario.email}</p>
                      </td>
                      <td className="px-4 py-4 sm:px-5">
                        <p className="font-medium">{item.oportunidade.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.oportunidade.projeto.title}
                        </p>
                      </td>
                      <td className="px-4 py-4 text-muted-foreground sm:px-5">
                        {formatarData(item.createdAt)}
                      </td>
                      <td className="px-4 py-4 sm:px-5">
                        <span
                          className={cn(
                            "inline-flex rounded-full px-3 py-1 text-xs font-medium",
                            STATUS_BADGE_CLASS[item.status],
                          )}
                        >
                          {ETAPA_LABELS[item.status]}
                        </span>
                      </td>
                      <td className="px-4 py-4 sm:px-5">
                        <button
                          type="button"
                          onClick={() => {
                            setSelecionada(item);
                            setFeedbackStatus("");
                          }}
                          className="font-medium text-primary hover:underline cursor-pointer"
                        >
                          {isSelected ? "Em revisão" : "Revisar"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>

        {/* Paginação */}
        {estadoCands === "ok" && totalPages > 1 && (
          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              Página {page} de {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeft className="size-4" aria-hidden="true" />
                Anterior
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                Próxima
                <ChevronRight className="size-4" aria-hidden="true" />
              </Button>
            </div>
          </div>
        )}

        {/* Painel Revisar candidatura (US18) */}
        <div className="mt-8 rounded-2xl border border-border bg-card p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="font-serif text-2xl">Revisar candidatura</h3>
            {selecionada && (
              <span
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-semibold",
                  STATUS_BADGE_CLASS[selecionada.status],
                )}
              >
                Etapa atual: {ETAPA_LABELS[selecionada.status]}
              </span>
            )}
          </div>

          {!selecionada ? (
            <p className="mt-3 text-sm text-muted-foreground">
              Selecione uma candidatura na tabela acima clicando em <strong>Revisar</strong> para ver o perfil completo do voluntário e atualizar sua etapa no funil.
            </p>
          ) : (
            <div className="mt-6 space-y-6">
              {/* Dados do candidato + vaga */}
              <div className="grid gap-6 rounded-xl border border-border/80 bg-background/60 p-5 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold tracking-wider text-earth uppercase">
                    Candidato(a)
                  </p>
                  <p className="mt-1 text-lg font-semibold text-foreground">
                    {selecionada.voluntario.name}
                  </p>
                  <p className="text-sm text-muted-foreground">{selecionada.voluntario.email}</p>
                  {selecionada.voluntario.phone && (
                    <p className="text-sm text-muted-foreground">
                      Tel: {selecionada.voluntario.phone}
                    </p>
                  )}
                  {(selecionada.voluntario.cidade || selecionada.voluntario.estado) && (
                    <p className="text-sm text-muted-foreground">
                      Local:{" "}
                      {[selecionada.voluntario.cidade, selecionada.voluntario.estado]
                        .filter(Boolean)
                        .join(" / ")}
                    </p>
                  )}
                </div>

                <div>
                  <p className="text-xs font-semibold tracking-wider text-earth uppercase">
                    Vaga e Triagem
                  </p>
                  <p className="mt-1 font-semibold text-foreground">
                    {selecionada.oportunidade.title}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Escolaridade:{" "}
                    {labelEducacao(
                      selecionada.voluntario.educacaoNivel,
                      selecionada.voluntario.educacaoCompletude,
                    )}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Experiência prática na área:{" "}
                    <strong>{selecionada.experienciaNaArea ? "Sim" : "Não informada"}</strong>
                  </p>
                  <div className="mt-2">
                    {selecionada.triagemFunil.apto ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700">
                        <CheckCircle2 className="size-4" aria-hidden="true" />
                        Atende aos critérios objetivos da vaga
                      </span>
                    ) : (
                      <div className="space-y-1 text-xs text-amber-800">
                        <p className="inline-flex items-center gap-1.5 font-medium">
                          <XCircle className="size-4" aria-hidden="true" />
                          Observações dos critérios do funil:
                        </p>
                        <ul className="list-disc pl-5">
                          {selecionada.triagemFunil.motivos.map((m) => (
                            <li key={m}>{m}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                {selecionada.voluntario.bio && (
                  <div className="sm:col-span-2">
                    <p className="text-xs font-semibold text-muted-foreground uppercase">
                      Apresentação e disponibilidade
                    </p>
                    <p className="mt-1 text-sm leading-relaxed">{selecionada.voluntario.bio}</p>
                  </div>
                )}

                {selecionada.mensagem && (
                  <div className="sm:col-span-2">
                    <p className="text-xs font-semibold text-muted-foreground uppercase">
                      Mensagem enviada na candidatura
                    </p>
                    <p className="mt-1 text-sm leading-relaxed">{selecionada.mensagem}</p>
                  </div>
                )}

                {selecionada.voluntario.outros && (
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase">
                      Outras habilidades declaradas
                    </p>
                    <p className="mt-1 text-sm">{selecionada.voluntario.outros}</p>
                  </div>
                )}

                {selecionada.voluntario.interesses.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase">
                      Áreas de interesse
                    </p>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {selecionada.voluntario.interesses.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Controles de Etapa do Funil (US18) */}
              <div>
                <p className="mb-3 text-sm font-semibold text-foreground">
                  Mover candidatura no funil de seleção:
                </p>
                <div className="flex flex-wrap gap-2.5">
                  {ETAPAS_FUNIL.map((etapa) => {
                    const ativa = selecionada.status === etapa;
                    const isAprovar = etapa === "APROVADO";
                    const isRecusar = etapa === "REJEITADO";

                    return (
                      <Button
                        key={etapa}
                        type="button"
                        disabled={atualizandoStatus || ativa}
                        variant={
                          isAprovar
                            ? "default"
                            : isRecusar
                              ? "destructive"
                              : ativa
                                ? "secondary"
                                : "outline"
                        }
                        onClick={() => void moverEtapa(selecionada.id, etapa)}
                      >
                        {ETAPA_LABELS[etapa]}
                      </Button>
                    );
                  })}
                </div>

                {feedbackStatus && (
                  <p role="status" className="mt-3 text-sm font-medium text-primary">
                    {feedbackStatus}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      <footer className="mt-9 text-sm text-muted-foreground">IBRADA · Gestão interna</footer>
    </GestorShell>
  );
}