"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Calendar,
  Users,
  CheckCircle,
  FileText,
  AlertCircle,
  ArrowLeft,
  CreditCard,
  UserCheck,
  ShieldAlert,
} from "lucide-react";
import { Reserva, confirmarReserva, obterReserva } from "@/lib/reservas";
import { ReservaTimer } from "@/components/reserva-timer";

export default function ResumoConfirmacaoReserva() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [reserva, setReserva] = useState<Reserva | null>(null);
  const [loading, setLoading] = useState(true);
  const [concordouCondicoes, setConcordouCondicoes] = useState(false);
  const [confirmando, setConfirmando] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    if (params?.id) {
      obterReserva(params.id).then((dados) => {
        setReserva(dados);
        setLoading(false);
      });
    }
  }, [params?.id]);

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center text-muted-foreground">
        Carregando resumo da reserva...
      </div>
    );
  }

  if (!reserva) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center">
        <h2 className="text-xl font-bold">Reserva não encontrada</h2>
        <p className="mt-2 text-muted-foreground">
          Não localizamos uma reserva com o código fornecido.
        </p>
        <Link href="/ecoturismo" className="mt-4 inline-block text-primary underline">
          Voltar ao catálogo
        </Link>
      </div>
    );
  }

  const formatarData = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
    } catch {
      return iso;
    }
  };

  /**
   * CONFIRMAÇÃO EXPLÍCITA (US09):
   * O sistema só prossegue para o pagamento após a confirmação explícita
   * dos dados e aceite das condições pelo cliente.
   */
  const handleConfirmarEIrParaPagamento = async () => {
    if (!concordouCondicoes) {
      setErro("É necessário concordar com as condições do ecoturismo para prosseguir.");
      return;
    }

    setConfirmando(true);
    setErro("");

    try {
      await confirmarReserva(reserva.id);
      router.push(`/reservas/${reserva.id}/pagamento`);
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao confirmar reserva.");
      setConfirmando(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
      {/* Navegação e Progresso */}
      <div className="mb-8 flex items-center justify-between border-b pb-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            Passo 2 de 3
          </span>
          <h1 className="text-2xl font-bold font-serif text-foreground sm:text-3xl">
            Revisão e Confirmação da Reserva
          </h1>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
          <span>1. Dados</span>
          <span>→</span>
          <span className="font-semibold text-primary">2. Revisão</span>
          <span>→</span>
          <span>3. Pagamento</span>
        </div>
      </div>

      {/* Contador Regressivo de 30 Minutos (Requisito 4) */}
      <div className="mb-6">
        <ReservaTimer
          reserva={reserva}
          onExpire={() => {
            setReserva((antiga) => (antiga ? { ...antiga, status: "CANCELED" } : null));
          }}
        />
      </div>

      <div className="space-y-6">
        {/* Resumo do Pacote e Datas (US09) */}
        <section className="rounded-2xl border bg-card p-6 shadow-xs">
          <div className="flex items-center justify-between border-b pb-4 mb-4">
            <h2 className="text-lg font-bold text-foreground">Pacote e Período</h2>
            <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-primary">
              Código: {reserva.id}
            </span>
          </div>

          <h3 className="text-xl font-bold text-primary font-serif">
            {reserva.experienceTitle}
          </h3>

          <div className="mt-4 grid gap-4 sm:grid-cols-2 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="size-4 text-primary shrink-0" />
              <span>Data de Início: {formatarData(reserva.experienceStartsAt)}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="size-4 text-primary shrink-0" />
              <span>Data de Término: {formatarData(reserva.experienceEndsAt)}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="size-4 text-primary shrink-0" />
              <span>
                Total de vagas: {reserva.seats} {reserva.seats === 1 ? "pessoa" : "pessoas"}
              </span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <FileText className="size-4 text-primary shrink-0" />
              <span>Titular: {reserva.userName}</span>
            </div>
          </div>
        </section>

        {/* Lista de Participantes Cadastrados */}
        <section className="rounded-2xl border bg-card p-6 shadow-xs">
          <h2 className="text-lg font-bold text-foreground mb-4">Participantes Registrados</h2>
          <div className="divide-y text-sm">
            {reserva.participantes.map((p, idx) => (
              <div key={idx} className="py-3 flex flex-col sm:flex-row sm:justify-between gap-1">
                <div className="flex items-center gap-2 font-medium text-foreground">
                  <UserCheck className="size-4 text-primary shrink-0" />
                  <span>
                    {idx + 1}. {p.nome}
                  </span>
                </div>
                <div className="text-muted-foreground text-xs sm:text-sm">
                  Doc: {p.documento} {p.telefone ? `· Tel: ${p.telefone}` : ""}
                  {p.observacoes && ` · Obs: ${p.observacoes}`}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Discriminação de Valores */}
        <section className="rounded-2xl border bg-card p-6 shadow-xs">
          <h2 className="text-lg font-bold text-foreground mb-4">Detalhamento Financeiro</h2>
          <div className="space-y-2 text-sm border-b pb-4">
            <div className="flex justify-between text-muted-foreground">
              <span>
                Valor por vaga ({reserva.seats}x R${" "}
                {reserva.unitPrice.toFixed(2).replace(".", ",")})
              </span>
              <span>R$ {reserva.totalAmount.toFixed(2).replace(".", ",")}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Taxa de preservação ambiental comunitária</span>
              <span className="text-emerald-700 font-medium">Inclusa</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Seguro atividade e condutores locais</span>
              <span className="text-emerald-700 font-medium">Incluso</span>
            </div>
          </div>

          <div className="mt-4 flex justify-between items-baseline">
            <span className="text-base font-bold text-foreground">Valor Total da Reserva</span>
            <span className="text-2xl sm:text-3xl font-extrabold text-primary font-serif">
              R$ {reserva.totalAmount.toFixed(2).replace(".", ",")}
            </span>
          </div>
        </section>

        {/* Condições e Políticas de Cancelamento (US09) */}
        <section className="rounded-2xl border bg-amber-50/50 border-amber-200/80 p-6">
          <div className="flex items-center gap-2 text-amber-900 font-bold mb-2">
            <ShieldAlert className="size-5 text-amber-700" />
            <h3>Condições e Políticas do Ecoturismo</h3>
          </div>
          <ul className="space-y-2 text-xs sm:text-sm text-amber-950 list-disc list-inside leading-relaxed">
            <li>
              <strong>Cancelamento e Reembolso:</strong> Reembolso integral para cancelamentos solicitados até 7 dias corridos antes da data da vivência.
            </li>
            <li>
              <strong>Conduta Ambiental:</strong> Proibido deixar qualquer tipo de lixo nas trilhas e nascentes, alimentar a fauna silvestre ou recolher espécimes botânicos.
            </li>
            <li>
              <strong>Segurança:</strong> É obrigatório o uso de calçados fechados e adequados para caminhada e seguir as orientações dos guias credenciados.
            </li>
          </ul>

          <div className="mt-5 pt-4 border-t border-amber-200">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={concordouCondicoes}
                onChange={(e) => setConcordouCondicoes(e.target.checked)}
                className="size-5 rounded-md mt-0.5 accent-primary cursor-pointer"
              />
              <span className="text-sm font-medium text-foreground">
                Eu revisei todos os dados da reserva e concordo expressamente com os valores e com as condições gerais do ecoturismo.
              </span>
            </label>
          </div>
        </section>

        {erro && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700 border border-red-200 flex items-center gap-2">
            <AlertCircle className="size-4 text-red-600 shrink-0" />
            <span>{erro}</span>
          </div>
        )}

        {/* Botões de Ação Exigidos na US09 */}
        <div className="rounded-2xl border bg-card p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Botão "Voltar e editar" */}
          <Link
            href={`/ecoturismo/${reserva.experienceSlug}/reserva?reservaId=${reserva.id}`}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-border px-5 py-3 text-sm font-semibold text-foreground hover:bg-secondary transition-colors"
          >
            <ArrowLeft className="size-4" />
            Voltar e editar dados
          </Link>

          {/* Botão "Confirmar e ir para o pagamento" */}
          <button
            type="button"
            disabled={!concordouCondicoes || confirmando || reserva.status === "CANCELED"}
            onClick={handleConfirmarEIrParaPagamento}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-7 py-3 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xs"
          >
            <CreditCard className="size-4" />
            <span>
              {confirmando
                ? "Confirmando..."
                : "Confirmar e ir para o pagamento"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
