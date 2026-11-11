import { Controller, Patch, Body, Param, UseGuards, Request,
  ForbiddenException,
  UsePipes,
  ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { UpdateUserDto } from './dto/update-user.dto.js';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  update(@Param('id') id: string, @Body() updateData: UpdateUserDto, @Request() req) {
    
    // O utilizador só pode editar o próprio perfil
    // (A menos que seja um GESTOR, que tem passe livre)
    if (req.user.sub !== id && req.user.role !== 'GESTOR') {
      throw new ForbiddenException('Você só tem permissão para alterar o seu próprio perfil.');
    }

    return this.userService.update(id, updateData);
  }
}