// Cliente HTTP do front: guarda do token + api() para falar com o back (NestJS).
// Usa localStorage, então só funciona no navegador: chame a partir de componentes "use client".

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";
const TOKEN_KEY = "token";
const USER_KEY = "user";

// Disparado quando o back recusa o token (401): o AuthProvider escuta e limpa o estado.
export const AUTH_EXPIRED_EVENT = "auth:expired";

export type Role = "CLIENTE" | "VOLUNTARIO" | "GESTOR";
export type AuthUser = { id: string; name: string; role: Role };

export function getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
    localStorage.removeItem(TOKEN_KEY);
}

export function getStoredUser(): AuthUser | null {
    if (typeof window === "undefined") return null;
    try {
        const raw = localStorage.getItem(USER_KEY);
        return raw ? (JSON.parse(raw) as AuthUser) : null;
    } catch {
        return null;
    }
}

function setStoredUser(user: AuthUser) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
}

// Descarta token e usuário (logout ou sessão expirada).
export function clearSession() {
    clearToken();
    localStorage.removeItem(USER_KEY);
}

export class ApiError extends Error {
    constructor(
        public status: number,
        message: string,
    ) {
        super(message);
        this.name = "ApiError";
    }
}

type ApiOptions = {
    method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
    body?: unknown;
};

const FALLBACK_ERROR = "Não foi possível concluir a requisição.";

// O Nest devolve { message: string | string[] }; o ValidationPipe manda uma lista.
function getErrorMessage(body: unknown): string {
    const message = (body as { message?: unknown } | null)?.message;
    if (Array.isArray(message)) return message.join(" ");
    if (typeof message === "string" && message) return message;
    return FALLBACK_ERROR;
}

function parseJson(text: string): unknown {
    try {
        return JSON.parse(text);
    } catch {
        return null;
    }
}

export async function api<T = unknown>(path: string, { method = "GET", body }: ApiOptions = {}): Promise<T> {
    const token = getToken();

    let res: Response;
    try {
        res = await fetch(`${API_URL}${path}`, {
            method,
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            ...(body !== undefined && method !== "GET" ? { body: JSON.stringify(body) } : {}),
        });
    } catch {
        throw new ApiError(0, "Não foi possível conectar ao servidor. Tente novamente.");
    }

    const text = await res.text();
    const data = text ? parseJson(text) : null;

    if (!res.ok) {
        // Token enviado e recusado: expirou ou é inválido, então descartamos a sessão.
        if (res.status === 401 && token) {
            clearSession();
            window.dispatchEvent(new Event(AUTH_EXPIRED_EVENT));
        }
        throw new ApiError(res.status, getErrorMessage(data));
    }

    return data as T;
}

export type LoginResponse = {
    access_token: string;
    user: AuthUser;
};

// Faz o login e guarda o token. Devolve o usuário (o AuthProvider vai guardá-lo no estado).
export async function login(email: string, password: string) {
    const res = await api<LoginResponse>("/auth/login", {
        method: "POST",
        body: { email, password },
    });
    setToken(res.access_token);
    setStoredUser(res.user);
    return res.user;
}

// JWT é stateless: o encerramento efetivo é descartar o token aqui. A chamada ao back
// é só informativa, então uma falha nela não impede o logout.
export async function logout() {
    try {
        await api("/auth/logout", { method: "POST" });
    } catch {
        // ignorado de propósito
    }
    clearSession();
}

// Corpo de POST /auth/register (CreateUserDto do back).
export type RegisterPayload = {
    name: string;
    email: string;
    password: string;
    phone?: string;
    dataNascimento: string; // AAAA-MM-DD
    cidade: string;
    estado: string;
    lgpdAccepted: boolean;
    lgpdVersion: string;
    // TODO(voluntário): role: "VOLUNTARIO" + bio, outros, educacaoNivel,
    // educacaoCompletude e categoriaIds quando a aba de voluntário existir.
};

export async function register(payload: RegisterPayload) {
    return api<{ id: string; name: string; email: string; role: Role }>("/auth/register", {
        method: "POST",
        body: payload,
    });
}
