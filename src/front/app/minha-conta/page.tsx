"use client";

import { useAuth } from "@/lib/auth-context";

// TODO: dados da conta e aba "Perfil de voluntário" (US05/US15) .
export default function MinhaConta() {
    const { user } = useAuth();
    return (
        <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
            <h1 className="text-3xl font-bold">Minha Conta</h1>
            <p className="mt-2 text-gray-600">Olá, {user?.name}.</p>
        </div>
    );
}
