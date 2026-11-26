"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  QrCode,
  CreditCard,
  Lock,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Copy,
  Check,
  Loader2,
  Calendar,
  Users,
} from "lucide-react";
import {
  Reserva,
  obterReserva,
  processarPagamento,
  StatusPagamento,
} from "@/lib/reservas";
import { ReservaTimer } from "@/components/reserva-timer";

export default function TelaPagamento() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [reserva, setReserva] = useState<Reserva | null>(null);
  const [loading, setLoading] = useState(true);

  // Método de pagamento selecionado: PIX ou Cartão
  const [metodo, setMetodo] = useState<"PIX" | "CREDIT_CARD">("PIX");

  // Dados simulados do cartão
  const [numeroCartao, setNumeroCartao] = useState("4532 •••• •••• 8892");
  const [nomeCartao, setNomeCartao] = useState("");
  const [validadeCartao, setValidadeCartao] = useState("12/28");
  const [cvvCartao, setCvvCartao] = useState("321");

  // Controle de simulação do retorno do gateway (US10: Aprovado, Pendente ou Recusado)
  const [simulacaoResultado, setSimulacaoResultado] = useState<
    "APROVADO" | "PENDENTE" | "RECUSADO"
  >("APROVADO");

  // Estado do placeholder de redirecionamento para o gateway externo
  const [processandoGateway, setProcessandoGateway] = useState(false);
  const [statusRetornado, setStatusRetornado] = useState<StatusPagamento | null>(null);
  const [mensagemStatus, setMensagemStatus] = useState("");
  const [pixCopiado, setPixCopiado] = useState(false);

  useEffect(() => {
    if (params?.id) {
      obterReserva(params.id).then((dados) => {
        setReserva(dados);
        if (dados) {
          setNomeCartao(dados.userName);
        }
        setLoading(false);
      });
    }
  }, [params?.id]);

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center text-muted-foreground">
        Carregando ambiente de pagamento...
      </div>
    );
  }

  if (!reserva) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center">
        <h2 className="text-xl font-bold">Reserva não encontrada</h2>
        <Link href="/ecoturismo" className="mt-4 inline-block text-primary underline">
          Voltar ao catálogo
        </Link>
      </div>
    );
  }

  const chavePixSimulada = `00020126580014br.gov.bcb.pix0136${reserva.id}-ibrada5204000053039865406${reserva.totalAmount.toFixed(
    2
  )}5802BR5925INSTITUTO BRASILEIRO DE D6008BRASILIA62070503***6304`;

  const copiarChavePix = () => {
    navigator.clipboard.writeText(chavePixSimulada);
    setPixCopiado(true);
    setTimeout(() => setPixCopiado(false), 3000);
  };

  /**
   * FLUXO DO GATEWAY EXTERNO (US10):
   * 1. Exibe placeholder de redirecionamento para o gateway externo seguro.
   * 2. Simula o processamento assíncrono via API externa (2 segundos).
   * 3. Trata os 3 retornos do gateway:
   *    - APROVADO: redireciona para a tela de comprovante.
   *    - PENDENTE: exibe a tela de status de aguardo (PIX).
   *    - RECUSADO: redireciona para a tela de erro com opção de tentar de novo.
   */
  const handlePagar = async () => {
    setProcessandoGateway(true);
    setMensagemStatus("");

    setTimeout(async () => {
      try {
        const resultado = await processarPagamento(reserva.id, {
          metodo,
          cartao:
            metodo === "CREDIT_CARD"
              ? {
                  numero: numeroCartao,
                  nome: nomeCartao,
                  validade: validadeCartao,
                  cvv: cvvCartao,
                  parcelas: 1,
                }
              : undefined,
          simulacaoResultado,
        });

        setProcessandoGateway(false);
        setStatusRetornado(resultado.status);
        setMensagemStatus(resultado.mensagem);

        if (resultado.status === "PAID") {
          router.push(`/reservas/${reserva.id}/comprovante`);
        } else if (resultado.status === "FAILED") {
          router.push(`/reservas/${reserva.id}/erro`);
        }
      } catch (err) {
        setProcessandoGateway(false);
        setMensagemStatus(err instanceof Error ? err.message : "Falha no processamento.");
      }
    }, 2200);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
      {/* Navegação e Progresso */}
      <div className="mb-8 flex items-center justify-between border-b pb-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            Passo 3 de 3
          </span>
          <h1 className="text-2xl font-bold font-serif text-foreground sm:text-3xl">
            Pagamento da Reserva
          </h1>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
          <span>1. Dados</span>
          <span>→</span>
          <span>2. Revisão</span>
          <span>→</span>
          <span className="font-semibold text-primary">3. Pagamento</span>
        </div>
      </div>

      {/* Contador Regressivo de 30 minutos (Requisito 4) */}
      <div className="mb-6">
        <ReservaTimer
          reserva={reserva}
          onExpire={() => {
            setReserva((antiga) => (antiga ? { ...antiga, status: "CANCELED" } : null));
          }}
        />
      </div>

      {/* Resumo do Pedido */}
      <div className="mb-8 rounded-2xl border bg-secondary/30 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold block">
            Reserva #{reserva.id}
          </span>
          <h2 className="text-lg font-bold text-foreground mt-0.5">{reserva.experienceTitle}</h2>
          <div className="mt-1 flex items-center gap-4 text-xs text-muted-foreground">
            <span>
              {new Date(reserva.experienceStartsAt).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </span>
            <span>·</span>
            <span>{reserva.seats} participante(s)</span>
          </div>
        </div>

        <div className="sm:text-right">
          <span className="text-xs text-muted-foreground block">Total a pagar:</span>
          <span className="text-2xl sm:text-3xl font-extrabold text-primary font-serif">
            R$ {reserva.totalAmount.toFixed(2).replace(".", ",")}
          </span>
        </div>
      </div>

      {/* Status Pendente exibido em tela caso o PIX tenha sido gerado */}
      {statusRetornado === "PENDING" && (
        <div className="mb-8 rounded-2xl border border-amber-300 bg-amber-50 p-6 text-amber-950">
          <div className="flex items-center gap-3 mb-3">
            <div className="rounded-full bg-amber-200 p-2 text-amber-800">
              <QrCode className="size-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Pagamento Pendente via PIX</h3>
              <p className="text-xs text-amber-800">
                Aponte a câmera do seu aplicativo de banco para o QR Code ou copie o código abaixo.
              </p>
            </div>
          </div>

          <div className="mt-4 flex flex-col items-center justify-center p-6 bg-white rounded-xl border border-amber-200">
            <div className="size-48 bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg mb-3">
              <QrCode className="size-36 text-gray-800" />
            </div>
            <span className="text-xs text-gray-500">QR Code válido por 30 minutos</span>
          </div>

          <div className="mt-4">
            <label className="text-xs font-semibold block mb-1">Código PIX Copia e Cola:</label>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={chavePixSimulada}
                className="w-full rounded-lg border bg-white p-2.5 text-xs font-mono text-gray-700 select-all"
              />
              <button
                type="button"
                onClick={copiarChavePix}
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-bold text-white hover:bg-primary/90"
              >
                {pixCopiado ? <Check className="size-4" /> : <Copy className="size-4" />}
                <span>{pixCopiado ? "Copiado!" : "Copiar"}</span>
              </button>
            </div>
          </div>

          <p className="mt-4 text-xs text-amber-900">
            Assim que o pagamento for identificado, sua vaga será confirmada e o comprovante será liberado.
          </p>
        </div>
      )}

      {/* Escolha da Forma de Pagamento */}
      <div className="rounded-2xl border bg-card p-6 shadow-xs space-y-6">
        <div>
          <h3 className="text-lg font-bold text-foreground">Escolha a Forma de Pagamento</h3>
          <p className="text-sm text-muted-foreground">
            Ambiente seguro integrado à infraestrutura do IBRADA.
          </p>
        </div>

        {/* Abas dos Meios de Pagamento */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setMetodo("PIX")}
            className={`flex items-center justify-center gap-2.5 rounded-xl border-2 p-4 font-semibold text-sm transition-all ${
              metodo === "PIX"
                ? "border-primary bg-primary/5 text-primary shadow-2xs"
                : "border-border text-muted-foreground hover:border-gray-400"
            }`}
          >
            <QrCode className="size-5" />
            <span>PIX Instantâneo</span>
          </button>

          <button
            type="button"
            onClick={() => setMetodo("CREDIT_CARD")}
            className={`flex items-center justify-center gap-2.5 rounded-xl border-2 p-4 font-semibold text-sm transition-all ${
              metodo === "CREDIT_CARD"
                ? "border-primary bg-primary/5 text-primary shadow-2xs"
                : "border-border text-muted-foreground hover:border-gray-400"
            }`}
          >
            <CreditCard className="size-5" />
            <span>Cartão de Crédito</span>
          </button>
        </div>

        {/* Formulário do Cartão de Crédito */}
        {metodo === "CREDIT_CARD" && (
          <div className="space-y-4 rounded-xl bg-secondary/30 p-5 border">
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">
                Número do Cartão
              </label>
              <input
                type="text"
                value={numeroCartao}
                onChange={(e) => setNumeroCartao(e.target.value)}
                placeholder="0000 0000 0000 0000"
                className="w-full rounded-lg border bg-white p-2.5 text-sm"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">
                Nome Impresso no Cartão
              </label>
              <input
                type="text"
                value={nomeCartao}
                onChange={(e) => setNomeCartao(e.target.value)}
                placeholder="Nome como no cartão"
                className="w-full rounded-lg border bg-white p-2.5 text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-foreground block mb-1">
                  Validade (MM/AA)
                </label>
                <input
                  type="text"
                  value={validadeCartao}
                  onChange={(e) => setValidadeCartao(e.target.value)}
                  placeholder="12/28"
                  className="w-full rounded-lg border bg-white p-2.5 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-foreground block mb-1">CVV</label>
                <input
                  type="text"
                  value={cvvCartao}
                  onChange={(e) => setCvvCartao(e.target.value)}
                  placeholder="123"
                  className="w-full rounded-lg border bg-white p-2.5 text-sm"
                />
              </div>
            </div>
          </div>
        )}

        {/* Seletor de Simulação do Gateway (US10 - sem gateway real) */}
        <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50/70 p-4">
          <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-wider text-gray-700">
            <ExternalLink className="size-4 text-primary" />
            <span>Simulação de Resposta do Gateway Externo (US10)</span>
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            Como o gateway financeiro real ainda não foi integrado, selecione o comportamento que deseja testar:
          </p>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setSimulacaoResultado("APROVADO")}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                simulacaoResultado === "APROVADO"
                  ? "bg-emerald-700 text-white shadow-2xs"
                  : "bg-white border text-gray-700 hover:bg-gray-100"
              }`}
            >
              ✓ Simular Aprovado (Sucesso)
            </button>

            <button
              type="button"
              onClick={() => setSimulacaoResultado("PENDENTE")}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                simulacaoResultado === "PENDENTE"
                  ? "bg-amber-600 text-white shadow-2xs"
                  : "bg-white border text-gray-700 hover:bg-gray-100"
              }`}
            >
              ⏳ Simular Pendente (PIX)
            </button>

            <button
              type="button"
              onClick={() => setSimulacaoResultado("RECUSADO")}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                simulacaoResultado === "RECUSADO"
                  ? "bg-red-700 text-white shadow-2xs"
                  : "bg-white border text-gray-700 hover:bg-gray-100"
              }`}
            >
              ✕ Simular Recusado (Erro)
            </button>
          </div>
        </div>

        {/* Botão de Finalização */}
        <button
          type="button"
          disabled={processandoGateway || reserva.status === "CANCELED"}
          onClick={handlePagar}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary py-4 px-6 text-base font-bold text-primary-foreground hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
        >
          <Lock className="size-4" />
          <span>
            {metodo === "PIX"
              ? `Gerar PIX e Pagar R$ ${reserva.totalAmount.toFixed(2).replace(".", ",")}`
              : `Pagar R$ ${reserva.totalAmount.toFixed(2).replace(".", ",")} no Cartão`}
          </span>
        </button>

        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <ShieldCheck className="size-4 text-emerald-700" />
          <span>Transação criptografada de ponta a ponta (SSL 256 bits).</span>
        </div>
      </div>

      {/* PLACEHOLDER DE REDIRECIONAMENTO PARA O GATEWAY EXTERNO (US10) */}
      {processandoGateway && (
        <div
          role="status"
          aria-live="polite"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
        >
          <div className="w-full max-w-md rounded-2xl bg-card p-8 shadow-2xl border text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Loader2 className="size-9 animate-spin" />
            </div>

            <h3 className="text-xl font-bold font-serif text-foreground">
              Conectando ao Gateway Externo
            </h3>

            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              Você está sendo redirecionado para o ambiente seguro de processamento de pagamentos...
            </p>

            <div className="mt-6 w-full bg-secondary rounded-full h-2 overflow-hidden">
              <div className="bg-primary h-2 rounded-full animate-pulse w-3/4"></div>
            </div>

            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Lock className="size-3.5 text-primary" />
              <span>Ambiente PCI-DSS Compliant</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
