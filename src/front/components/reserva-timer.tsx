"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Clock, AlertTriangle, AlertCircle, RefreshCcw } from "lucide-react";
import { Reserva, calcularSegundosRestantes, expirarReserva } from "@/lib/reservas";

interface ReservaTimerProps {
  reserva: Reserva;
  onExpire?: () => void;
}

export function ReservaTimer({ reserva, onExpire }: ReservaTimerProps) {
  const [segundosRestantes, setSegundosRestantes] = useState<number>(() =>
    calcularSegundosRestantes(reserva)
  );
  const [expirou, setExpirou] = useState<boolean>(() => segundosRestantes <= 0);

  useEffect(() => {
    if (reserva.status !== "PENDING") return;

    const intervalo = setInterval(() => {
      const restantes = calcularSegundosRestantes(reserva);
      setSegundosRestantes(restantes);

      if (restantes <= 0) {
        setExpirou(true);
        expirarReserva(reserva.id);
        onExpire?.();
        clearInterval(intervalo);
      }
    }, 1000);

    return () => clearInterval(intervalo);
  }, [reserva, onExpire]);

  if (reserva.status !== "PENDING") {
    return null;
  }

  const minutos = Math.floor(segundosRestantes / 60);
  const segundos = segundosRestantes % 60;
  const tempoFormatado = `${minutos.toString().padStart(2, "0")}:${segundos
    .toString()
    .padStart(2, "0")}`;

  const avisoUrgencia = segundosRestantes > 0 && segundosRestantes < 300; // menos de 5 minutos

  return (
    <>
      {/* Banner / Card do Contador Regressivo */}
      <div
        className={`rounded-xl border p-4 transition-colors ${
          expirou
            ? "border-red-300 bg-red-50 text-red-900"
            : avisoUrgencia
            ? "border-amber-300 bg-amber-50 text-amber-900 animate-pulse"
            : "border-primary/20 bg-primary/5 text-foreground"
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2.5">
            {expirou ? (
              <AlertCircle className="size-5 text-red-600 shrink-0" />
            ) : (
              <Clock
                className={`size-5 shrink-0 ${
                  avisoUrgencia ? "text-amber-600 animate-spin" : "text-primary"
                }`}
              />
            )}
            <div>
              <span className="text-xs uppercase tracking-wider font-semibold block text-muted-foreground">
                Reserva Temporária com Vaga Garantida
              </span>
              <p className="text-sm font-medium">
                {expirou
                  ? "O tempo limite de 30 minutos desta reserva expirou."
                  : avisoUrgencia
                  ? "Atenção: restam poucos minutos para concluir o pagamento!"
                  : "Suas vagas ficam reservadas por 30 minutos enquanto você conclui."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {!expirou ? (
              <div className="flex items-baseline gap-1 rounded-lg bg-background px-3 py-1.5 border shadow-2xs">
                <span className="text-xs text-muted-foreground">Expira em:</span>
                <span
                  className={`font-mono text-lg font-bold ${
                    avisoUrgencia ? "text-red-600" : "text-primary"
                  }`}
                >
                  {tempoFormatado}
                </span>
              </div>
            ) : (
              <Link
                href="/ecoturismo"
                className="inline-flex items-center gap-1.5 rounded-lg bg-red-700 px-3 py-1.5 text-xs font-bold text-white hover:bg-red-800"
              >
                <RefreshCcw className="size-3.5" />
                Nova Reserva
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Modal Bloqueante caso o tempo zere completamente durante a navegação */}
      {expirou && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
        >
          <div className="w-full max-w-md rounded-2xl bg-card p-6 shadow-2xl border text-center">
            <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-red-100 text-red-600">
              <AlertTriangle className="size-8" />
            </div>

            <h3 className="text-xl font-bold font-serif text-foreground">
              Tempo Limite Expirado
            </h3>

            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              O prazo de <strong>30 minutos</strong> para concluir o pagamento da sua reserva encerrou.
              Para assegurar a oportunidade a todos os visitantes, as vagas foram liberadas de volta ao catálogo.
            </p>

            <div className="mt-6 flex flex-col gap-2">
              <Link
                href="/ecoturismo"
                className="w-full rounded-xl bg-primary py-3 px-4 text-center text-sm font-bold text-primary-foreground hover:bg-primary/90"
              >
                Voltar ao Catálogo de Ecoturismo
              </Link>
              <Link
                href="/minha-conta"
                className="w-full rounded-xl border py-2.5 px-4 text-center text-sm font-medium text-foreground hover:bg-secondary"
              >
                Ir para Minha Conta
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
