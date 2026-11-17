"use client";

import { Suspense, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Compass, HandHeart, Handshake, LogOut, type LucideIcon } from "lucide-react";
import { FlashBanner } from "@/components/flash-banner";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";

export type SecaoGestor = "ecoturismo" | "voluntariado" | "parcerias";

const SECOES: Array<{ id: SecaoGestor; href: string; label: string; icon: LucideIcon }> = [
  { id: "ecoturismo", href: "/gestor/ecoturismo", label: "Ecoturismo", icon: Compass },
  { id: "voluntariado", href: "/gestor/voluntariado", label: "Voluntariado", icon: HandHeart },
  { id: "parcerias", href: "/gestor/parcerias", label: "Parcerias", icon: Handshake },
];

// Moldura das telas do gestor: cabeçalho, menu lateral e aviso de sucesso (FlashBanner).
// O acesso (perfil GESTOR) já é exigido por app/gestor/layout.tsx.
export function GestorShell({ ativo, children }: { ativo: SecaoGestor; children: ReactNode }) {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Aviso de sucesso vindo de um cadastro (Suspense: o banner lê a URL). */}
      <Suspense fallback={null}>
        <FlashBanner />
      </Suspense>
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-border px-6 py-5 lg:px-9">
        <div className="flex items-center gap-3">
          <Image src="/IBRADA_logo_Sfundo.png" alt="IBRADA" width={712} height={660} className="h-14 w-auto" />
          <p className="max-w-[12rem] text-xs text-muted-foreground sm:text-sm">Instituto Brasileiro do Direito Ambiental</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-muted px-4 py-2 text-sm font-medium text-muted-foreground">
            Ambiente administrativo
          </span>
          {user && <span className="text-sm font-medium">{user.name} · Gestor</span>}
        </div>
      </header>

      <div className="grid lg:min-h-[calc(100vh-85px)] lg:grid-cols-[17.5%_minmax(0,1fr)]">
        <aside className="bg-primary px-5 py-6 text-primary-foreground lg:py-10">
          <p className="mb-5 text-xs font-semibold uppercase tracking-widest text-primary-foreground/75">Gestão IBRADA</p>
          <nav aria-label="Gestão IBRADA" className="flex flex-wrap gap-3 lg:flex-col">
            {SECOES.map(({ id, href, label, icon: Icon }) => (
              <Link
                key={id}
                href={href}
                aria-current={id === ativo ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-4 py-3 text-sm",
                  id === ativo ? "bg-primary-foreground/15 font-medium" : "hover:bg-primary-foreground/10",
                )}
              >
                <Icon aria-hidden="true" className="size-5" />
                {label}
              </Link>
            ))}
            <Link href="/" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm hover:bg-primary-foreground/10">
              <ArrowUpRight aria-hidden="true" className="size-5" />
              Visitar site
            </Link>
            <button
              type="button"
              onClick={() => void logout()}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-left text-sm hover:bg-primary-foreground/10"
            >
              <LogOut aria-hidden="true" className="size-5" />
              Sair da administração
            </button>
          </nav>
        </aside>

        <div className="min-w-0 px-6 py-10 sm:px-10 lg:px-[3.5%]">{children}</div>
      </div>
    </div>
  );
}
