"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Users,
  Calendar,
  AlertTriangle,
  UserCheck,
  Plus,
  Minus,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { Experiencia, buscarExperienciaPorSlug } from "@/lib/ecoturismo";
import {
  Participante,
  atualizarDadosReserva,
  criarReserva,
  obterReserva,
} from "@/lib/reservas";

function ReservaFormContent() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, ready } = useAuth();

  const reservaIdParam = searchParams.get("reservaId");

  const [experiencia, setExperiencia] = useState<Experiencia | null>(null);
  const [loading, setLoading] = useState(true);
  const [vagas, setVagas] = useState<number>(1);
  const [participantes, setParticipantes] = useState<Participante[]>([]);
  const [erroVagas, setErroVagas] = useState<string>("");
  const [erroForm, setErroForm] = useState<string>("");
  const [submetendo, setSubmetendo] = useState<boolean>(false);

  // Redireciona para /login caso o usuário não esteja autenticado (Critério US08)
  useEffect(() => {
    if (ready && !user && params?.slug) {
      const destino = `/ecoturismo/${params.slug}/reserva`;
      router.push(`/login?redirect=${encodeURIComponent(destino)}`);
    }
  }, [user, ready, router, params?.slug]);

  // Carrega a experiência e dados prévios se vier de "Voltar e editar"
  useEffect(() => {
    if (!params?.slug) return;

    async function carregar() {
      const exp = await buscarExperienciaPorSlug(params.slug);
      setExperiencia(exp);

      if (reservaIdParam) {
        const existente = await obterReserva(reservaIdParam);
        if (existente) {
          setVagas(existente.seats);
          setParticipantes(existente.participantes);
          setLoading(false);
          return;
        }
      }

      // Inicializa participante 1 com os dados do usuário autenticado
      if (user) {
        setParticipantes([
          {
            nome: user.name ?? "",
            documento: "",
            telefone: "",
            observacoes: "",
          },
        ]);
      } else {
        setParticipantes([
          {
            nome: "",
            documento: "",
            telefone: "",
            observacoes: "",
          },
        ]);
      }

      setLoading(false);
    }

    carregar();
  }, [params?.slug, reservaIdParam, user]);

  // Ajusta a lista de participantes quando a quantidade de vagas mudar
  const alterarQuantidadeVagas = (novaQtd: number) => {
    if (!experiencia) return;

    // Tratamento de erro de vaga insuficiente (Critério US08)
    if (novaQtd > experiencia.availableSeats) {
      setErroVagas(
        `Vagas insuficientes! Restam apenas ${experiencia.availableSeats} ${
          experiencia.availableSeats === 1 ? "vaga disponível" : "vagas disponíveis"
        } para este pacote.`
      );
      return;
    }

    if (novaQtd < 1) {
      return;
    }

    setErroVagas("");
    setVagas(novaQtd);

    setParticipantes((antigos) => {
      const atualizados = [...antigos];
      if (novaQtd > antigos.length) {
        for (let i = antigos.length; i < novaQtd; i++) {
          atualizados.push({
            nome: "",
            documento: "",
            telefone: "",
            observacoes: "",
          });
        }
      } else if (novaQtd < antigos.length) {
        return atualizados.slice(0, novaQtd);
      }
      return atualizados;
    });
  };

  const atualizarCampoParticipante = (
    index: number,
    campo: keyof Participante,
    valor: string
  ) => {
    setParticipantes((antigos) => {
      const clone = [...antigos];
      clone[index] = { ...clone[index], [campo]: valor };
      return clone;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErroForm("");

    if (!user || !experiencia) return;

    // Validação de vagas suficientes no momento da submissão
    if (vagas > experiencia.availableSeats) {
      setErroVagas(
        `Não é possível prosseguir. O número de vagas solicitado (${vagas}) excede a capacidade disponível (${experiencia.availableSeats}).`
      );
      return;
    }

    // Validação dos nomes e documentos obrigatórios de cada participante
    for (let i = 0; i < participantes.length; i++) {
      const p = participantes[i];
      if (!p.nome.trim()) {
        setErroForm(`Por favor, preencha o nome completo do Participante ${i + 1}.`);
        return;
      }
      if (!p.documento.trim()) {
        setErroForm(`Por favor, preencha o documento (CPF ou RG) do Participante ${i + 1}.`);
        return;
      }
    }

    setSubmetendo(true);

    try {
      let reservaSalva;

      if (reservaIdParam) {
        reservaSalva = await atualizarDadosReserva(reservaIdParam, vagas, participantes);
      } else {
        reservaSalva = await criarReserva({
          userId: user.id,
          userName: user.name,
          userEmail: (user as { email?: string }).email ?? "",
          experienceId: experiencia.id,
          experienceSlug: experiencia.slug,
          experienceTitle: experiencia.title,
          experienceStartsAt: experiencia.startsAt,
          experienceEndsAt: experiencia.endsAt,
          seats: vagas,
          unitPrice: experiencia.price,
          participantes,
        });
      }

      if (reservaSalva) {
        router.push(`/reservas/${reservaSalva.id}/confirmacao`);
      }
    } catch (err) {
      setErroForm(err instanceof Error ? err.message : "Erro ao registrar dados da reserva.");
      setSubmetendo(false);
    }
  };

  if (loading || !ready) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center text-muted-foreground">
        Carregando formulário de reserva...
      </div>
    );
  }

  if (!experiencia) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center">
        <h2 className="text-xl font-bold">Experiência não encontrada</h2>
        <Link href="/ecoturismo" className="mt-4 text-primary underline">
          Voltar ao catálogo
        </Link>
      </div>
    );
  }

  const esgotado = experiencia.isSoldOut || experiencia.availableSeats <= 0;
  const valorTotal = vagas * experiencia.price;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
      {/* Navegação e breadcrumbs */}
      <Link
        href={`/ecoturismo/${experiencia.slug}`}
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="size-4" />
        Voltar para os detalhes do pacote
      </Link>

      {/* Indicador de passos do fluxo */}
      <div className="mb-8 flex items-center justify-between border-b pb-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            Passo 1 de 3
          </span>
          <h1 className="text-2xl font-bold font-serif text-foreground sm:text-3xl">
            Dados da Reserva
          </h1>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
          <span className="font-semibold text-primary">1. Dados</span>
          <span>→</span>
          <span>2. Revisão</span>
          <span>→</span>
          <span>3. Pagamento</span>
        </div>
      </div>

      {/* Alerta caso esteja esgotado */}
      {esgotado ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
          <AlertTriangle className="mx-auto size-10 text-red-600 mb-3" />
          <h2 className="text-lg font-bold text-red-800">Vagas Esgotadas</h2>
          <p className="mt-1 text-sm text-red-700">
            Lamentamos, mas não há mais vagas disponíveis para esta experiência nesta data.
          </p>
          <Link
            href="/ecoturismo"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800"
          >
            Escolher outro pacote
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Card Resumo do Pacote Selecionado */}
          <div className="rounded-2xl border bg-secondary/30 p-5 sm:p-6">
            <span className="text-xs font-semibold uppercase tracking-wider text-earth">
              Pacote Selecionado
            </span>
            <h2 className="text-xl font-bold text-foreground mt-1">{experiencia.title}</h2>
            <div className="mt-3 flex flex-wrap items-center gap-5 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Calendar className="size-4 text-primary" />
                <span>
                  {new Date(experiencia.startsAt).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="size-4 text-primary" />
                <span className="font-medium text-emerald-800">
                  {experiencia.availableSeats} vagas restantes
                </span>
              </div>
              <div>
                Valor unitário:{" "}
                <strong className="text-foreground">
                  R$ {experiencia.price.toFixed(2).replace(".", ",")}
                </strong>
              </div>
            </div>
          </div>

          {/* Seletor de Quantidade de Vagas (Tratamento de vaga insuficiente) */}
          <section className="rounded-2xl border bg-card p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-foreground">Quantidade de Vagas</h3>
                <p className="text-sm text-muted-foreground">
                  Selecione quantos participantes participarão deste passeio.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => alterarQuantidadeVagas(vagas - 1)}
                  disabled={vagas <= 1}
                  aria-label="Diminuir vagas"
                  className="size-10 rounded-lg border flex items-center justify-center text-foreground hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Minus className="size-4" />
                </button>

                <span className="min-w-12 text-center text-xl font-bold text-foreground">
                  {vagas}
                </span>

                <button
                  type="button"
                  onClick={() => alterarQuantidadeVagas(vagas + 1)}
                  disabled={vagas >= experiencia.availableSeats}
                  aria-label="Aumentar vagas"
                  className="size-10 rounded-lg border flex items-center justify-center text-foreground hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Plus className="size-4" />
                </button>
              </div>
            </div>

            {/* Mensagem de Erro de Vaga Insuficiente */}
            {erroVagas && (
              <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 border border-red-200 flex items-center gap-2">
                <AlertTriangle className="size-4 text-red-600 shrink-0" />
                <span>{erroVagas}</span>
              </div>
            )}
          </section>

          {/* Dados dos Participantes */}
          <section className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-foreground">
                Identificação dos Participantes
              </h3>
              <p className="text-sm text-muted-foreground">
                Informe os dados de cada pessoa para o seguro obrigatório de atividade e lista de presença.
              </p>
            </div>

            {participantes.map((part, index) => (
              <div
                key={index}
                className="rounded-2xl border bg-card p-5 sm:p-6 shadow-xs space-y-4"
              >
                <div className="flex items-center justify-between border-b pb-3">
                  <div className="flex items-center gap-2">
                    <UserCheck className="size-4 text-primary" />
                    <span className="font-semibold text-foreground">
                      Participante {index + 1}
                      {index === 0 && " (Titular da Reserva)"}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">Vaga {index + 1}</span>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-semibold text-foreground block mb-1">
                      Nome Completo *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Nome completo do participante"
                      value={part.nome}
                      onChange={(e) =>
                        atualizarCampoParticipante(index, "nome", e.target.value)
                      }
                      className="w-full rounded-lg border p-2.5 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/40"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-foreground block mb-1">
                      CPF ou Documento com foto *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="000.000.000-00 ou RG"
                      value={part.documento}
                      onChange={(e) =>
                        atualizarCampoParticipante(index, "documento", e.target.value)
                      }
                      className="w-full rounded-lg border p-2.5 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/40"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-foreground block mb-1">
                      Telefone / WhatsApp de Contato
                    </label>
                    <input
                      type="tel"
                      placeholder="(61) 99999-9999"
                      value={part.telefone ?? ""}
                      onChange={(e) =>
                        atualizarCampoParticipante(index, "telefone", e.target.value)
                      }
                      className="w-full rounded-lg border p-2.5 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/40"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-foreground block mb-1">
                      Restrições alimentares ou observações de saúde (opcional)
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Vegetariano, alérgico a abelhas, asmático..."
                      value={part.observacoes ?? ""}
                      onChange={(e) =>
                        atualizarCampoParticipante(index, "observacoes", e.target.value)
                      }
                      className="w-full rounded-lg border p-2.5 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/40"
                    />
                  </div>
                </div>
              </div>
            ))}
          </section>

          {/* Mensagem Geral de Erro do Formulário */}
          {erroForm && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700 border border-red-200 flex items-center gap-2">
              <AlertTriangle className="size-4 text-red-600 shrink-0" />
              <span>{erroForm}</span>
            </div>
          )}

          {/* Barra de Rodapé com Total e Ação de Avançar */}
          <div className="rounded-2xl border bg-card p-6 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <span className="text-xs text-muted-foreground block">
                Valor Total ({vagas} {vagas === 1 ? "vaga" : "vagas"})
              </span>
              <span className="text-3xl font-extrabold text-primary font-serif">
                R$ {valorTotal.toFixed(2).replace(".", ",")}
              </span>
            </div>

            <button
              type="submit"
              disabled={submetendo || !!erroVagas}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-base font-bold text-primary-foreground hover:bg-primary/90 transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-xs"
            >
              <span>{submetendo ? "Salvando..." : "Revisar e Confirmar"}</span>
              <ArrowRight className="size-4" />
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default function PaginaReserva() {
  return (
    <Suspense fallback={<div className="p-12 text-center">Carregando formulário...</div>}>
      <ReservaFormContent />
    </Suspense>
  );
}
