import { Controller, Patch, Body, Param, Request, ForbiddenException, Logger } from '@nestjs/common';
import { UserService } from './user.service.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import type { AuthenticatedRequest } from '../auth/auth.types.js';

@Controller('users')
export class UserController {
  // logger para atender ao RNF04
  private readonly logger = new Logger(UserController.name);

  constructor(private readonly userService: UserService) {}

  // A autenticação (JWT) e a validação do corpo (ValidationPipe com
  // forbidNonWhitelisted) são globais; ver AuthModule e main.ts.
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateData: UpdateUserDto, @Request() req: AuthenticatedRequest) {
    // Cada usuário só edita o próprio perfil (nem o gestor edita a conta de outra pessoa).
    if (req.user.sub !== id) {
      this.logger.warn(
        `Acesso negado: usuário ${req.user.email} tentou editar o perfil de outro usuário em ${req.method} ${req.url}`,
      );
      throw new ForbiddenException('Você só tem permissão para alterar o seu próprio perfil.');
    }

    return this.userService.update(id, updateData);
  }
}
