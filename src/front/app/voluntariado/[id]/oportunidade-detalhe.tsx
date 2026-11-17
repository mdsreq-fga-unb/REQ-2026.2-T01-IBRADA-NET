"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, CalendarDays, Check, Clock3, FolderOpen, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { ApiError } from "@/lib/api";
import {
  buscarOportunidade,
  candidatar,
  guardarRetornoCandidatura,
  statusCandidatura,
  type Oportunidade,
  type StatusCandidatura,
} from "@/lib/oportunidades";

type Estado =
  | { tipo: "carregando" }
  | { tipo: "erro" }
  | { tipo: "nao-encontrada" }
  | { tipo: "ok"; oportunidade: Oportunidade };

const voltar = (
  <Link
    href="/voluntariado"
    className="mb-7 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
  >
    <ArrowLeft aria-hidden="true" className="size-4" />
    Todas as oportunidades
  </Link>
);

export function OportunidadeDetalhe({ id }: { id: string }) {
  const [estado, setEstado] = useState<Estado>({ tipo: "carregando" });
  const { user } = useAuth();
  const router = useRouter();
  const [status, setStatus] = useState<StatusCandidatura | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [feedback, setFeedback] = useState<{ tipo: "sucesso" | "erro"; texto: string } | null>(null);

  useEffect(() => {
    let ativo = true;
    buscarOportunidade(id)
      .then((oportunidade) => {
        if (!ativo) return;
        setEstado(oportunidade ? { tipo: "ok", oportunidade } : { tipo: "nao-encontrada" });
      })
      .catch(() => ativo && setEstado({ tipo: "erro" }));
    return () => {
      ativo = false;
    };
  }, [id]);

  // US16: descobre se o usuário logado já se candidatou / tem perfil de voluntário.
  useEffect(() => {
    if (!user) {
      setStatus(null);
      return;
    }
    let ativo = true;
    statusCandidatura(id)
      .then((resultado) => ativo && setStatus(resultado))
      .catch(() => ativo && setStatus(null));
    return () => {
      ativo = false;
    };
  }, [id, user]);

  function irParaPerfil() {
    guardarRetornoCandidatura(`/voluntariado/${id}`);
    router.push("/minha-conta#perfil-voluntario");
  }

  async function handleCandidatar() {
    setFeedback(null);
    // Sem perfil de voluntário (cliente): completa o perfil e volta para esta vaga.
    if (status ? !status.temPerfil : user?.role === "CLIENTE") {
      irParaPerfil();
      return;
    }

    setEnviando(true);
    try {
      await candidatar(id);
      setStatus({ candidatado: true, temPerfil: true });
      setFeedback({ tipo: "sucesso", texto: "Candidatura enviada com sucesso! O gestor poderá acompanhá-la." });
    } catch (erro) {
      if (erro instanceof ApiError && erro.status === 403) {
        irParaPerfil();
        return;
      }
      if (erro instanceof ApiError && erro.status === 409) {
        setStatus({ candidatado: true, temPerfil: true });
      }
      setFeedback({
        tipo: "erro",
        texto: erro instanceof Error ? erro.message : "Não foi possível enviar a candidatura.",
      });
    } finally {
      setEnviando(false);
    }
  }

  if (estado.tipo !== "ok") {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        {voltar}
        {estado.tipo === "carregando" && (
          <p role="status" className="text-sm text-muted-foreground">Carregando oportunidade…</p>
        )}
        {estado.tipo === "erro" && (
          <p role="alert" className="text-sm text-destructive">
            Não foi possível carregar a oportunidade. Tente novamente mais tarde.
          </p>
        )}
        {estado.tipo === "nao-encontrada" && (
          <p role="alert" className="text-sm text-muted-foreground">Oportunidade não encontrada.</p>
        )}
      </div>
    );
  }

  const { oportunidade } = estado;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
      {voltar}

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start lg:gap-10">
        <div>
          {oportunidade.categoria && (
            <div className="mb-3 flex flex-wrap gap-2">
              <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
                {oportunidade.categoria}
              </span>
            </div>
          )}

          <h1 className="max-w-3xl text-3xl leading-tight font-semibold tracking-tight sm:text-4xl lg:text-[2.75rem]">
            {oportunidade.titulo}
          </h1>

          {oportunidade.projeto && (
            <section
              aria-label="Projeto beneficiado"
              className="mt-7 rounded-2xl bg-secondary/75 p-5 sm:p-6"
            >
              <p className="mb-2 text-xs font-semibold tracking-wide text-earth uppercase">
                Projeto beneficiado: {oportunidade.projeto}
              </p>
              {oportunidade.projetoDescricao && (
                <p className="text-sm leading-relaxed sm:text-base">{oportunidade.projetoDescricao}</p>
              )}
            </section>
          )}

          {oportunidade.atividades.length > 0 && (
            <section className="mt-8">
              <h2 className="text-xl font-semibold">O que você vai fazer</h2>
              <ul className="mt-3 space-y-2.5">
                {oportunidade.atividades.map((atividade) => (
                  <li key={atividade} className="flex items-start gap-2.5 text-sm leading-relaxed">
                    <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-primary" strokeWidth={2} />
                    <span>{atividade}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {oportunidade.habilidades.length > 0 && (
            <section className="mt-8">
              <h2 className="text-xl font-semibold">Habilidades requeridas</h2>
              <ul className="mt-3 space-y-2.5">
                {oportunidade.habilidades.map((habilidade) => (
                  <li key={habilidade} className="flex items-start gap-2.5 text-sm leading-relaxed">
                    <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-earth" />
                    <span>{habilidade}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <aside className="rounded-2xl border border-border bg-card p-5 shadow-lg shadow-foreground/10 lg:sticky lg:top-24">
          <dl className="space-y-4">
            {oportunidade.projeto && (
              <div className="flex items-start gap-3">
                <FolderOpen aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-primary" />
                <div>
                  <dt className="text-xs text-muted-foreground">Projeto</dt>
                  <dd className="text-sm font-medium">{oportunidade.projeto}</dd>
                </div>
              </div>
            )}
            <div className="flex items-start gap-3">
              <Clock3 aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-primary" />
              <div>
                <dt className="text-xs text-muted-foreground">Duração</dt>
                <dd className="text-sm font-medium">{oportunidade.duracao}</dd>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CalendarDays aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-primary" />
              <div>
                <dt className="text-xs text-muted-foreground">Disponibilidade</dt>
                <dd className="text-sm font-medium">{oportunidade.disponibilidade}</dd>
              </div>
            </div>
          </dl>

          {oportunidade.aberta && !user ? (
            // Visitante: segue para o login.
            <Link
              href={`/login?next=${encodeURIComponent(`/voluntariado/${oportunidade.id}`)}`}
              className="mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              Candidatar-se
            </Link>
          ) : oportunidade.aberta ? (
            // US16: envia a candidatura (status inicial INSCRITO).
            <>
              <button
                type="button"
                onClick={handleCandidatar}
                disabled={enviando || status?.candidatado}
                className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-60"
              >
                {enviando && <Loader2 aria-hidden="true" className="size-4 animate-spin" />}
                {status?.candidatado ? "Candidatura enviada" : "Candidatar-se"}
              </button>
              {feedback && (
                <p
                  role={feedback.tipo === "erro" ? "alert" : "status"}
                  className={`mt-3 text-sm ${feedback.tipo === "erro" ? "text-destructive" : "text-primary"}`}
                >
                  {feedback.texto}
                </p>
              )}
              {!feedback && status?.candidatado && (
                <p role="status" className="mt-3 text-sm text-muted-foreground">
                  Você já se candidatou a esta oportunidade.
                </p>
              )}
            </>
          ) : (
            <>
              <button
                type="button"
                disabled
                aria-describedby="candidatura-bloqueada"
                className="mt-5 inline-flex min-h-11 w-full cursor-not-allowed items-center justify-center rounded-lg bg-muted px-4 py-2 text-sm font-medium text-muted-foreground"
              >
                Candidatar-se
              </button>
              <p id="candidatura-bloqueada" className="mt-3 text-sm text-muted-foreground">
                Esta oportunidade não está aceitando candidaturas no momento.
              </p>
            </>
          )}
        </aside>
      </div>
    </div>
  );
}
