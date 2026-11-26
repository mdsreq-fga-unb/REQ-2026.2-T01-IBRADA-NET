"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  XCircle,
  RefreshCw,
  ArrowLeft,
  AlertTriangle,
  CreditCard,
  QrCode,
  ShieldAlert,
} from "lucide-react";
import { Reserva, obterReserva } from "@/lib/reservas";
import { ReservaTimer } from "@/components/reserva-timer";

export default function ErroPagamentoReserva() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [reserva, setReserva] = useState<Reserva | null>(null);
  const [loading, setLoading] = useState(true);

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
      <div className="mx-auto max-w-2xl px-4 py-20 text-center text-muted-foreground">
        Carregando informações do erro...
      </div>
    );
  }

  if (!reserva) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <h2 className="text-xl font-bold">Reserva não encontrada</h2>
        <Link href="/ecoturismo" className="mt-4 inline-block text-primary underline">
          Voltar ao catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-12">
      {/* Contador Regressivo de 30 minutos (Requisito 4) */}
      <div className="mb-6">
        <ReservaTimer
          reserva={reserva}
          onExpire={() => {
            setReserva((antiga) => (antiga ? { ...antiga, status: "CANCELED" } : null));
          }}
        />
      </div>

      {/* Cartão de Erro do Gateway (US10) */}
      <div className="rounded-2xl border border-red-200 bg-card p-6 sm:p-8 shadow-xs text-center space-y-6">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-red-100 text-red-600">
          <XCircle className="size-10" />
        </div>

        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-red-600">
            Retorno do Gateway Externo
          </span>
          <h1 className="text-2xl font-bold font-serif text-foreground sm:text-3xl mt-1">
            Pagamento Não Autorizado
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            A operadora ou o gateway de pagamento recusou a transação.
            <strong className="block text-red-700 mt-1">
              Sua vaga NÃO foi confirmada até o momento.
            </strong>
          </p>
        </div>

        {/* Detalhe do Motivo do Erro */}
        <div className="rounded-xl bg-red-50 p-4 border border-red-100 text-left text-xs sm:text-sm text-red-950 space-y-2">
          <div className="flex items-center gap-2 font-bold text-red-800">
            <ShieldAlert className="size-4 shrink-0" />
            <span>Motivo informado:</span>
          </div>
          <p className="leading-relaxed">
            {reserva.paymentError ??
              "A transação foi recusada pela instituição financeira (código: REC-05 - Não autorizada pelo emissor). Pode se tratar de saldo insuficiente, bloqueio preventivo de segurança ou dados do cartão digitados incorretamente."}
          </p>
        </div>

        {/* Resumo da Reserva Pendente */}
        <div className="rounded-xl bg-secondary/30 p-4 text-left text-xs text-muted-foreground space-y-1.5 border">
          <div className="flex justify-between">
            <span>Pacote:</span>
            <strong className="text-foreground">{reserva.experienceTitle}</strong>
          </div>
          <div className="flex justify-between">
            <span>Vagas:</span>
            <span className="text-foreground">{reserva.seats} pessoa(s)</span>
          </div>
          <div className="flex justify-between">
            <span>Valor Total:</span>
            <strong className="text-primary font-semibold">
              R$ {reserva.totalAmount.toFixed(2).replace(".", ",")}
            </strong>
          </div>
          <div className="flex justify-between border-t pt-1.5">
            <span>Status da Vaga:</span>
            <span className="text-amber-800 font-semibold">
              Aguardando novo pagamento (30 min)
            </span>
          </div>
        </div>

        {/* Ações: Opção de Tentar de Novo (US10) */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            disabled={reserva.status === "CANCELED"}
            onClick={() => router.push(`/reservas/${reserva.id}/pagamento`)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-all shadow-xs disabled:opacity-50"
          >
            <RefreshCw className="size-4" />
            Tentar Pagamento Novamente
          </button>

          <Link
            href={`/ecoturismo/${reserva.experienceSlug}/reserva?reservaId=${reserva.id}`}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-border px-5 py-3.5 text-sm font-semibold text-foreground hover:bg-secondary transition-colors"
          >
            <ArrowLeft className="size-4" />
            Alterar Dados da Reserva
          </Link>
        </div>

        <div className="border-t pt-4">
          <Link
            href="/minha-conta"
            className="text-xs text-muted-foreground hover:text-foreground underline"
          >
            Ver minhas reservas pendentes
          </Link>
        </div>
      </div>
    </div>
  );
}
