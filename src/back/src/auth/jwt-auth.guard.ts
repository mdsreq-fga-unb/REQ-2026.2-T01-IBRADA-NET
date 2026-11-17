import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from './public.decorator.js';

// Guard global (ver AuthModule): exige JWT válido em toda rota que não seja @Public().
@Injectable()
export class JwtAuthGuard implements CanActivate {
  // logger para atender ao RNF04
  private readonly logger = new Logger(JwtAuthGuard.name);

  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      this.logger.warn(`Acesso negado: Token ausente em ${request.method} ${request.url}`);
      throw new UnauthorizedException('Token de acesso não fornecido.');
    }

    try {
      // O segredo vem da configuração do JwtModule (getJwtSecret).
      const payload = await this.jwtService.verifyAsync(token);
      request['user'] = payload;
    } catch (error) {
      this.logger.warn(`Acesso negado: Token inválido em ${request.method} ${request.url} - Erro: ${error instanceof Error ? error.message : String(error)}`);
      throw new UnauthorizedException('Token inválido ou expirado.');
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
