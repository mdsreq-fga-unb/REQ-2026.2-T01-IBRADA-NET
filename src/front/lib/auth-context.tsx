"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
    AUTH_EXPIRED_EVENT,
    getStoredUser,
    getToken,
    login as apiLogin,
    logout as apiLogout,
    type AuthUser,
} from "@/lib/api";

type AuthContextValue = {
    user: AuthUser | null;
    // false até lermos o localStorage no navegador (evita piscar "visitante" e redirecionar cedo demais).
    ready: boolean;
    login: (email: string, password: string) => Promise<AuthUser>;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        // Só há sessão se existirem token E usuário guardados.
        setUser(getToken() ? getStoredUser() : null);
        setReady(true);

        const onExpired = () => setUser(null);
        window.addEventListener(AUTH_EXPIRED_EVENT, onExpired);
        return () => window.removeEventListener(AUTH_EXPIRED_EVENT, onExpired);
    }, []);

    const login = useCallback(async (email: string, password: string) => {
        const loggedUser = await apiLogin(email, password);
        setUser(loggedUser);
        return loggedUser;
    }, []);

    const logout = useCallback(async () => {
        await apiLogout();
        setUser(null);
    }, []);

    const value = useMemo(() => ({ user, ready, login, logout }), [user, ready, login, logout]);
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth deve ser usado dentro de <AuthProvider>.");
    return ctx;
}
