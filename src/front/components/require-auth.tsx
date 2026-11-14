"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import type { Role } from "@/lib/api";

export function RequireAuth({ roles, children }: { roles?: Role[]; children: ReactNode }) {
    const { user, ready } = useAuth();
    const router = useRouter();
    const allowed = !!user && (!roles || roles.includes(user.role));

    useEffect(() => {
        if (!ready) return;
        if (!user) router.replace("/login");
        else if (!allowed) router.replace("/");
    }, [ready, user, allowed, router]);

    if (!ready || !allowed) return null;
    return <>{children}</>;
}
