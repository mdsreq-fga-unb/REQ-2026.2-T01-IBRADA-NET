import type { Metadata } from "next";
import type { ReactNode } from "react";
import { RequireAuth } from "@/components/require-auth";

export const metadata: Metadata = {
  title: "Gestão IBRADA",
};

// Todas as rotas de /gestor exigem sessão com perfil GESTOR (o back também confere o papel).
export default function GestorLayout({ children }: { children: ReactNode }) {
  return <RequireAuth roles={["GESTOR"]}>{children}</RequireAuth>;
}
