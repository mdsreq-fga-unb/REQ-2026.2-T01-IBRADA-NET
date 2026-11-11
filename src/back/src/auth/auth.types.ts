import type { Request } from 'express';

// Payload do JWT emitido em /auth/login (ver AuthService.login).
export interface AuthenticatedUser {
  sub: string;
  email: string;
  role: string;
}

export type AuthenticatedRequest = Request & { user: AuthenticatedUser };
