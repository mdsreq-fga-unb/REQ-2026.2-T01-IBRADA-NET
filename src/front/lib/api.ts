// Cliente HTTP do front: guarda do token + api() para falar com o back (NestJS).
// Usa localStorage, então só funciona no navegador: chame a partir de componentes "use client".

import type { NivelEducacao, StatusEducacao } from "@/lib/brasil";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";
const TOKEN_KEY = "token";
const USER_KEY = "user";
const FLASH_KEY = "ibrada:flash_success";

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

export function setStoredUser(user: AuthUser) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

// Descarta token e usuário (logout ou sessão expirada).
export function clearSession() {
  clearToken();
  localStorage.removeItem(USER_KEY);
}

export function setFlashMessage(message: string) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(FLASH_KEY, message);
}

export function consumeFlashMessage(): string | null {
  if (typeof window === "undefined") return null;
  const msg = sessionStorage.getItem(FLASH_KEY);
  if (msg) sessionStorage.removeItem(FLASH_KEY);
  return msg;
}

type ApiOptions = { method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE"; body?: unknown };

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}



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

export async function login(email: string, password: string) {
  const res = await api<LoginResponse>("/auth/login", {
    method: "POST",
    body: { email, password },
  });
  setToken(res.access_token);
  setStoredUser(res.user);
  return res.user;
}

export async function logout() {
  try {
    await api("/auth/logout", { method: "POST" });
  } catch {
    // ignorado de propósito
  }
  clearSession();
}

// === Categorias / Áreas de atuação (US15) ===

export type Categoria = {
  id: string;
  nome: string;
};

export async function getCategorias(): Promise<Categoria[]> {
  return api<Categoria[]>("/categorias");
}

// === Cadastro e Perfil do Usuário (US04, US05, US15, US23) ===

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
  phone?: string;
  dataNascimento: string; // AAAA-MM-DD
  cidade: string;
  estado: string;
  role?: "CLIENTE" | "VOLUNTARIO";
  lgpdAccepted: boolean;
  lgpdVersion: string;
  bio?: string;
  outros?: string;
  educacaoNivel?: NivelEducacao;
  educacaoCompletude?: StatusEducacao;
  categoriaIds?: string[];
};

export async function register(payload: RegisterPayload) {
  return api<{ id: string; name: string; email: string; role: Role }>("/auth/register", {
    method: "POST",
    body: payload,
  });
}


export type PerfilVoluntario = {
  id: string;
  bio: string | null;
  outros: string | null;
  educacaoNivel: NivelEducacao | null;
  educacaoCompletude: StatusEducacao | null;
  createdAt: string;
  updatedAt: string;
  interesses: {
    categoria: Categoria;
  }[];
};

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  dataNascimento: string | null;
  cidade: string | null;
  estado: string | null;
  role: Role;
  createdAt: string;
  updatedAt: string;
  perfilVoluntario: PerfilVoluntario | null;
};

export async function getMe(): Promise<UserProfile> {
  return api<UserProfile>("/users/me");
}

export type UpdateUserPayload = {
  name?: string;
  phone?: string;
  dataNascimento?: string;
  cidade?: string;
  estado?: string;
  bio?: string;
  outros?: string;
  educacaoNivel?: NivelEducacao;
  educacaoCompletude?: StatusEducacao;
  categoriaIds?: string[];
};

export async function updateUser(userId: string, payload: UpdateUserPayload) {
  return api<{
    id: string;
    name: string;
    email: string;
    role: Role;
    phone: string | null;
    dataNascimento: string | null;
    cidade: string | null;
    estado: string | null;
  }>(`/users/${userId}`, {
    method: "PATCH",
    body: payload,
  });
}

export type CreatePerfilVoluntarioPayload = {
  bio?: string;
  outros?: string;
  educacaoNivel?: NivelEducacao;
  educacaoCompletude?: StatusEducacao;
  categoriaIds?: string[];
};

export type CreatePerfilVoluntarioResponse = {
  access_token?: string;
  user: AuthUser;
  perfilVoluntario: PerfilVoluntario;
};

export async function createPerfilVoluntario(
  payload: CreatePerfilVoluntarioPayload,
): Promise<CreatePerfilVoluntarioResponse> {
  const res = await api<CreatePerfilVoluntarioResponse>("/users/me/perfil-voluntario", {
    method: "POST",
    body: payload,
  });
  if (res.access_token) {
    setToken(res.access_token);
  }
  setStoredUser(res.user);
  return res;
}