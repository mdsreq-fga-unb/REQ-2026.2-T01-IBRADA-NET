"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";

const classes = cn(buttonVariants({ variant: "outline", size: "lg" }), "mt-2 h-11 w-fit bg-card px-5");

// O destino depende da sessão: quem já é voluntário não volta para o cadastro.
export function BancoVoluntariosButton() {
  const { user, ready } = useAuth();

  // Gestor não participa do banco de voluntários.
  if (ready && user?.role === "GESTOR") return null;

  if (ready && user?.role === "VOLUNTARIO") {
    return (
      <Link href="/minha-conta#perfil-voluntario" className={classes}>
        Ver meu perfil de voluntário
      </Link>
    );
  }

  if (ready && user) {
    // Cliente logado: completa o perfil na mesma conta, sem novo cadastro.
    return (
      <Link href="/minha-conta#perfil-voluntario" className={classes}>
        Criar meu perfil de voluntário
      </Link>
    );
  }

  return (
    <Link href="/cadastro" className={classes}>
      Cadastrar no banco de voluntários
    </Link>
  );
}
