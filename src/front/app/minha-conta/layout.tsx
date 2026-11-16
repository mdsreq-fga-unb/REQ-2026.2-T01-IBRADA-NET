"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { RequireAuth } from "@/components/require-auth";
import { useAuth } from "@/lib/auth-context";

// O gestor não tem perfil de cliente/voluntário: a "conta" dele é a área de gestão.
function RedirecionaGestor({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    const router = useRouter();
    const isGestor = user?.role === "GESTOR";

    useEffect(() => {
        if (isGestor) router.replace("/gestor/voluntariado");
    }, [isGestor, router]);

    return isGestor ? null : <>{children}</>;
}

export default function MinhaContaLayout({ children }: { children: ReactNode }) {
    return (
        <RequireAuth>
            <RedirecionaGestor>{children}</RedirecionaGestor>
        </RequireAuth>
    );
}
