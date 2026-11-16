import { Body, Controller, Get, HttpCode, HttpStatus, Logger, Post } from '@nestjs/common';
import { CategoriaService } from './categoria.service.js';
import { CreateCategoriaDto } from './dto/create-categoria.dto.js';
import { Public } from '../auth/public.decorator.js';
import { Roles } from '../auth/roles.decorator.js';
import { UserRole } from '../user/dto/create-user.dto.js';

@Controller('categorias')
export class CategoriaController {
  private readonly logger = new Logger(CategoriaController.name);

  constructor(private readonly categoriaService: CategoriaService) {}

  // Listagem pública usada no cadastro de voluntário e na edição de perfil 
  @Public()
  @Get()
  findAll() {
    return this.categoriaService.findAll();
  }

  // Cadastro restrito ao gestor do IBRADA
  @Roles(UserRole.GESTOR)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateCategoriaDto) {
    this.logger.log(`Gestor cadastrou nova categoria: "${dto.nome}"`);
    return this.categoriaService.create(dto);
  }
}