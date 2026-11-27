"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { CheckCircle2, X } from "lucide-react";
import { consumeFlashMessage } from "@/lib/api";

const FLASH_DURATION_MS = 5000;

export function FlashBanner() {
  const pathname = usePathname();
  const [message, setMessage] = useState<string | null>(null);
  // Em modo desenvolvimento o React roda o efeito duas vezes na mesma rota; a segunda leitura
  // vem vazia (a primeira já consumiu a mensagem) e apagaria o aviso. Guardamos o que foi lido.
  const lido = useRef<{ rota: string; mensagem: string | null } | null>(null);

  // A cada troca de rota: mostra a mensagem pendente (se houver) ou limpa a anterior,
  // para o aviso aparecer só na página de destino do redirecionamento.
  useEffect(() => {
    if (lido.current?.rota !== pathname) {
      lido.current = { rota: pathname, mensagem: consumeFlashMessage() };
    }
    setMessage(lido.current.mensagem);
  }, [pathname]);

  // Fecha sozinho após alguns segundos.
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(null), FLASH_DURATION_MS);
    return () => clearTimeout(timer);
  }, [message]);

  if (!message) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="border-b border-emerald-200 bg-emerald-50 text-emerald-950"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 text-sm sm:px-6">
        <div className="flex items-center gap-2.5">
          <CheckCircle2 className="size-4 shrink-0 text-emerald-700" aria-hidden="true" />
          <p className="font-medium">{message}</p>
        </div>
        <button
          type="button"
          onClick={() => setMessage(null)}
          aria-label="Fechar aviso"
          className="rounded-md p-1 text-emerald-800 hover:bg-emerald-100"
        >
          <X className="size-4" />
        </button>
      </div>
    </div>
  );
}