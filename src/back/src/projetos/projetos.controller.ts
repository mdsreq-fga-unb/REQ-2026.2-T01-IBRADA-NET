import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  Post,
} from '@nestjs/common';
import { ProjetosService } from './projetos.service.js';
import { CreateProjetoDto } from './dto/create-projeto.dto.js';
import { Roles } from '../auth/roles.decorator.js';
import { UserRole } from '../user/dto/create-user.dto.js';

@Controller('projetos')
export class ProjetosController {
  private readonly logger = new Logger(ProjetosController.name);

  constructor(private readonly projetosService: ProjetosService) {}

  /**
   * GET /projetos — Lista de projetos (gestor autenticado).
   * Necessário para popular o select de "projeto associado" ao cadastrar oportunidade.
   */
  @Roles(UserRole.GESTOR)
  @Get()
  async findAll() {
    this.logger.log('Gestor solicitou a lista de projetos');
    return this.projetosService.findAll();
  }

  /**
   * GET /projetos/:id — Detalhes de um projeto (gestor autenticado).
   */
  @Roles(UserRole.GESTOR)
  @Get(':id')
  async findById(@Param('id') id: string) {
    this.logger.log(`Gestor consultou o projeto ID: ${id}`);
    return this.projetosService.findById(id);
  }

  /**
   * POST /projetos — Cadastrar novo projeto (gestor autenticado).
   */
  @Roles(UserRole.GESTOR)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateProjetoDto) {
    this.logger.log(`Gestor solicitou cadastro de novo projeto: "${dto.title}"`);
    return this.projetosService.create(dto);
  }
}
