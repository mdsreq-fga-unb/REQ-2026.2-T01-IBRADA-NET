import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  Patch,
  Post,
  Request,
} from '@nestjs/common';
import { ExperienciasService } from './experiencias.service.js';
import { CreateExperienciaDto } from './dto/create-experiencia.dto.js';
import { UpdateDisponibilidadeDto } from './dto/update-disponibilidade.dto.js';
import { Public } from '../auth/public.decorator.js';
import { Roles } from '../auth/roles.decorator.js';
import { UserRole } from '../user/dto/create-user.dto.js';
import type { AuthenticatedRequest } from '../auth/auth.types.js';

@Controller('experiencias')
export class ExperienciasController {
  private readonly logger = new Logger(ExperienciasController.name);

  constructor(private readonly experienciasService: ExperienciasService) {}

  /**
   * US02: Visualizar catálogo de ecoturismo (RF06).
   * Rota pública: acessível por qualquer visitante sem necessidade de login.
   */
  @Public()
  @Get()
  async findAll() {
    this.logger.log('Consulta pública ao catálogo de ecoturismo (US02)');
    return this.experienciasService.findAllPublic();
  }

  /**
   * US11/US12: lista do gestor, com quem cadastrou cada pacote.
   * Declarada antes de ':slug' para 'gestor' não ser lido como slug.
   */
  @Roles(UserRole.GESTOR)
  @Get('gestor')
  async findAllGestor() {
    this.logger.log('Gestor consultou a lista de pacotes (US11/US12)');
    return this.experienciasService.findAllGestor();
  }

  /**
   * US03: Visualizar detalhes de pacote de ecoturismo (RF07).
   * Rota pública: acessível por qualquer visitante através do slug do pacote.
   */
  @Public()
  @Get(':slug')
  async findBySlug(@Param('slug') slug: string) {
    this.logger.log(`Consulta pública aos detalhes do pacote pelo slug: ${slug} (US03)`);
    return this.experienciasService.findBySlug(slug);
  }

  /**
   * US11: Cadastrar pacote de ecoturismo (RF15).
   * Rota restrita: apenas gestores autenticados podem cadastrar pacotes.
   */
  @Roles(UserRole.GESTOR)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateExperienciaDto, @Request() req: AuthenticatedRequest) {
    this.logger.log(`Gestor solicitou cadastro de novo pacote: "${dto.title}" (US11)`);
    return this.experienciasService.create(dto, req.user.sub);
  }

  /**
   * US12: Controlar disponibilidade de pacotes (RF17).
   * Rota restrita: apenas gestores autenticados podem habilitar ou desabilitar a oferta.
   */
  @Roles(UserRole.GESTOR)
  @Patch(':id/disponibilidade')
  async updateDisponibilidade(
    @Param('id') id: string,
    @Body() dto: UpdateDisponibilidadeDto,
  ) {
    this.logger.log(`Gestor alterou disponibilidade do pacote ID: ${id} para ${dto.isAvailable} (US12)`);
    return this.experienciasService.updateDisponibilidade(id, dto);
  }
}
