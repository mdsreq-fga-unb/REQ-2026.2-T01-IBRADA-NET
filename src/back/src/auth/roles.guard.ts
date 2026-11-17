import { Injectable, CanActivate, ExecutionContext, ForbiddenException, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator.js';
import { UserRole } from '../user/dto/create-user.dto.js';

@Injectable()
export class RolesGuard implements CanActivate {
  // logger para atender ao RNF04
  private readonly logger = new Logger(RolesGuard.name);

  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    
    // Se a rota não tem o @Roles, ela está liberada
    if (!requiredRoles) {
      return true; 
    }
    
    const request = context.switchToHttp().getRequest();
    const user = request.user; // Esse user foi injetado pelo JwtAuthGuard

    if (!user) {
      this.logger.warn(`Acesso negado: requisição sem usuário autenticado em ${request.method} ${request.url}`);
      throw new ForbiddenException('Usuário não autenticado.');
    }

    const hasRole = requiredRoles.includes(user.role);
    
    if (!hasRole) {
      this.logger.warn(`Acesso negado: Usuário ${user.email} (Role: ${user.role}) tentou acessar rota restrita [${requiredRoles.join(', ')}] na url: ${request.url}`);
      throw new ForbiddenException('Você não tem permissão para acessar este recurso.');
    }

    return true;
  }
}