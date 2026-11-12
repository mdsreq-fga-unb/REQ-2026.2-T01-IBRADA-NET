// Cliente HTTP do front: guarda do token + api() para falar com o back (NestJS).
// Usa localStorage, então só funciona no navegador: chame a partir de componentes "use client".

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";
const TOKEN_KEY = "token";

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


// TODO:revisar isso
function getErrorMessage(body: unknown, status: number): string {
    if(Array.isArray((body as { message: string[] }).message)) {
        return (body as { message: string[] }).message.join(", ");
    }
    return (body as { message: string }).message || "Não foi possível concluir a requisição.";
    
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
        // Token enviado e recusado: expirou ou é inválido, então descartamos.
        if (res.status === 401 && token) clearToken();
        throw new ApiError(res.status, getErrorMessage(data, res.status));
    }

    return data as T;
}

export type LoginResponse = {
    access_token: string;
    user: { id: string; name: string; role: "CLIENTE" | "VOLUNTARIO" | "GESTOR" };
};

// Faz o login e guarda o token. Devolve o usuário (o AuthProvider vai guardá-lo no estado).
export async function login(email: string, password: string) {
    const res = await api<LoginResponse>("/auth/login", {
        method: "POST",
        body: { email, password },
    });
    setToken(res.access_token);
    return res.user;
}
