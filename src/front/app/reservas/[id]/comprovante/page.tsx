"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2,
  Printer,
  Calendar,
  Users,
  MapPin,
  Clock,
  ArrowRight,
  ShieldCheck,
  QrCode,
  FileCheck,
} from "lucide-react";
import { Reserva, obterReserva } from "@/lib/reservas";

export default function ComprovanteReserva() {
  const params = useParams<{ id: string }>();
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
      <div className="mx-auto max-w-3xl px-4 py-20 text-center text-muted-foreground">
        Carregando comprovante...
      </div>
    );
  }

  if (!reserva) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h2 className="text-xl font-bold">Reserva não encontrada</h2>
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

  const formatarDataHora = (iso?: string) => {
    if (!iso) return "Hoje";
    try {
      return new Date(iso).toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return iso;
    }
  };

  const handleImprimir = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      {/* Mensagem de Sucesso */}
      <div className="text-center mb-8">
        <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
          <CheckCircle2 className="size-10" />
        </div>
        <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
          Pagamento Aprovado pelo Gateway
        </span>
        <h1 className="text-3xl font-bold font-serif text-foreground sm:text-4xl mt-1">
          Reserva Confirmada com Sucesso!
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Sua vaga no ecoturismo comunitário está garantida. Guarde este comprovante para apresentação no dia do passeio.
        </p>
      </div>

      {/* Cartão Oficial do Comprovante (Formatado para impressão) */}
      <div className="rounded-2xl border bg-card p-6 sm:p-8 shadow-md print:border-none print:shadow-none space-y-6">
        {/* Cabeçalho do Comprovante */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-6 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Instituto Brasileiro de Direito Ambiental — IBRADA
            </span>
            <h2 className="text-xl font-bold text-foreground mt-0.5">
              Comprovante Oficial de Reserva
            </h2>
            <span className="text-xs text-muted-foreground block">
              CNPJ: 06.984.927/0001-90 · Brasília/DF
            </span>
          </div>

          <div className="sm:text-right">
            <span className="text-xs text-muted-foreground block">Código da Reserva:</span>
            <span className="font-mono text-base font-extrabold text-foreground">
              {reserva.id}
            </span>
            <span className="text-xs text-muted-foreground block mt-1">
              Transação: {reserva.transactionId ?? "TX-IBRADA-PAY"}
            </span>
          </div>
        </div>

        {/* Dados da Experiência e Vagas */}
        <div className="rounded-xl bg-secondary/30 p-5">
          <span className="text-xs font-semibold uppercase tracking-wider text-earth">
            Experiência de Ecoturismo
          </span>
          <h3 className="text-xl font-bold text-foreground mt-1">{reserva.experienceTitle}</h3>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="size-4 text-primary shrink-0" />
              <span>Início: {formatarData(reserva.experienceStartsAt)}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="size-4 text-primary shrink-0" />
              <span>Término: {formatarData(reserva.experienceEndsAt)}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="size-4 text-primary shrink-0" />
              <span>
                {reserva.seats} vaga(s) confirmada(s)
              </span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <ShieldCheck className="size-4 text-emerald-700 shrink-0" />
              <span>Status: Pago & Vagas Garantidas</span>
            </div>
          </div>
        </div>

        {/* Relação dos Participantes */}
        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-foreground mb-3">
            Participantes Registrados
          </h4>
          <div className="divide-y rounded-xl border bg-background text-sm">
            {reserva.participantes.map((p, idx) => (
              <div key={idx} className="p-3 flex justify-between items-center text-xs sm:text-sm">
                <span className="font-medium text-foreground">
                  {idx + 1}. {p.nome}
                </span>
                <span className="text-muted-foreground font-mono">Doc: {p.documento}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Resumo Financeiro */}
        <div className="border-t pt-4 space-y-2 text-sm">
          <div className="flex justify-between text-muted-foreground">
            <span>Método de Pagamento:</span>
            <span className="font-semibold text-foreground">
              {reserva.paymentMethod === "PIX" ? "PIX Instantâneo" : "Cartão de Crédito"}
            </span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Data e Hora da Aprovação:</span>
            <span className="text-foreground">{formatarDataHora(reserva.paidAt)}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Valor Unitário por Vaga:</span>
            <span className="text-foreground">
              R$ {reserva.unitPrice.toFixed(2).replace(".", ",")}
            </span>
          </div>
          <div className="flex justify-between items-baseline pt-2 border-t">
            <span className="text-base font-bold text-foreground">Valor Total Quitado:</span>
            <span className="text-2xl font-extrabold text-primary font-serif">
              R$ {reserva.totalAmount.toFixed(2).replace(".", ",")}
            </span>
          </div>
        </div>

        {/* Informações de Embarque e Validação */}
        <div className="rounded-xl border border-dashed p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-muted-foreground leading-relaxed">
            <strong className="text-foreground block mb-1">Ponto de Encontro e Orientações:</strong>
            Apresente este comprovante (impresso ou em seu smartphone) ao condutor credenciado do IBRADA no local de saída.
            Recomendamos chegar com 15 minutos de antecedência portando calçado para trilha e garrafa de água.
          </div>
          <div className="size-20 bg-gray-100 flex items-center justify-center rounded-lg border shrink-0">
            <QrCode className="size-16 text-gray-800" />
          </div>
        </div>
      </div>

      {/* Botões de Ação */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 print:hidden">
        <button
          type="button"
          onClick={handleImprimir}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-all shadow-xs"
        >
          <Printer className="size-4" />
          Imprimir Comprovante
        </button>

        <Link
          href="/minha-conta"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-border px-6 py-3 text-sm font-semibold text-foreground hover:bg-secondary transition-colors"
        >
          <FileCheck className="size-4" />
          Ver em Minhas Reservas
        </Link>

        <Link
          href="/ecoturismo"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-transparent px-4 py-3 text-sm font-semibold text-muted-foreground hover:text-foreground"
        >
          Voltar ao Catálogo
        </Link>
      </div>
    </div>
  );
}
