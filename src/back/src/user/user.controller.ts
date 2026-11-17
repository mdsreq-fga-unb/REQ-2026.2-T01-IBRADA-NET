import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  Patch,
  Post,
  Request,
} from '@nestjs/common';
import { UserService } from './user.service.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { CreatePerfilVoluntarioDto } from './dto/create-perfil-voluntario.dto.js';
import type { AuthenticatedRequest } from '../auth/auth.types.js';

@Controller('users')
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(private readonly userService: UserService) {}

  @Get('me')
  findMe(@Request() req: AuthenticatedRequest) {
    return this.userService.findMe(req.user.sub);
  }

  @Post('me/perfil-voluntario')
  @HttpCode(HttpStatus.CREATED)
  createPerfilVoluntario(
    @Body() dto: CreatePerfilVoluntarioDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.userService.createPerfilVoluntario(req.user.sub, dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateData: UpdateUserDto, @Request() req: AuthenticatedRequest) {
    if (req.user.sub !== id) {
      this.logger.warn(
        `Acesso negado: usuário ${req.user.email} tentou editar o perfil de outro usuário em ${req.method} ${req.url}`,
      );
      throw new ForbiddenException('Você só tem permissão para alterar o seu próprio perfil.');
    }

    return this.userService.update(id, updateData);
  }
}