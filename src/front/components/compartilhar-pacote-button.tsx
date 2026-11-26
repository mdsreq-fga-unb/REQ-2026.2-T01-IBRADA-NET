"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";
import { Check, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface CompartilharPacoteButtonProps {
  titulo: string;
  descricao?: string;
  slug: string;
  className?: string;
}

type EstadoFeedback = "ocioso" | "copiado" | "erro";

const LIMITE_DESCRICAO = 140;

// Resumo curto da descrição (US24: nome e descrição resumida identificam o pacote).
function resumirDescricao(descricao?: string): string {
  const limpa = (descricao ?? "").replace(/\s+/g, " ").trim();
  if (limpa.length <= LIMITE_DESCRICAO) return limpa;
  return `${limpa.slice(0, LIMITE_DESCRICAO - 1).trimEnd()}…`;
}

async function copiarParaAreaDeTransferencia(texto: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(texto);
    return true;
  } catch {
    // Contexto sem HTTPS ou permissão negada: tenta o método legado.
  }

  try {
    const campo = document.createElement("textarea");
    campo.value = texto;
    campo.setAttribute("readonly", "");
    campo.style.position = "fixed";
    campo.style.opacity = "0";
    document.body.appendChild(campo);
    campo.select();
    const copiou = document.execCommand("copy");
    document.body.removeChild(campo);
    return copiou;
  } catch {
    return false;
  }
}

export function CompartilharPacoteButton({
  titulo,
  descricao,
  slug,
  className,
}: CompartilharPacoteButtonProps): React.JSX.Element {
  const [feedback, setFeedback] = useState<EstadoFeedback>("ocioso");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const mostrarFeedback = (estado: EstadoFeedback): void => {
    setFeedback(estado);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setFeedback("ocioso"), 3000);
  };

  const compartilhar = async (): Promise<void> => {
    const resumo = resumirDescricao(descricao);
    const texto = resumo ? `${titulo} — ${resumo}` : `Conheça o pacote "${titulo}" do IBRADA.`;
    const url = `${window.location.origin}/ecoturismo/${encodeURIComponent(slug)}`;

    if (typeof navigator.share === "function") {
      try {
        await navigator.share({
          title: titulo,
          text: texto,
          url,
        });
        return;
      } catch (erro) {
        // Cancelar a folha de compartilhamento não é erro.
        if (erro instanceof DOMException && erro.name === "AbortError") return;
        // Outras falhas caem no fallback de copiar o link.
      }
    }

    const copiou = await copiarParaAreaDeTransferencia(`${texto}\n${url}`);
    mostrarFeedback(copiou ? "copiado" : "erro");
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <button
        type="button"
        onClick={() => void compartilhar()}
        className="inline-flex min-h-9 items-center gap-1.5 rounded-full bg-white/95 px-3.5 py-1.5 text-xs font-medium text-foreground shadow-xs transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:text-sm"
      >
        {feedback === "copiado" ? (
          <Check aria-hidden="true" className="size-4" />
        ) : (
          <Share2 aria-hidden="true" className="size-4" />
        )}
        {feedback === "copiado" ? "Link copiado!" : "Compartilhar pacote"}
      </button>
      <span role="status" aria-live="polite" className="sr-only">
        {feedback === "copiado" && "Link do pacote copiado para a área de transferência."}
        {feedback === "erro" && "Não foi possível copiar o link."}
      </span>
      {feedback === "erro" && (
        <span aria-hidden="true" className="text-xs font-medium text-white">
          Não foi possível copiar o link.
        </span>
      )}
    </div>
  );
}
