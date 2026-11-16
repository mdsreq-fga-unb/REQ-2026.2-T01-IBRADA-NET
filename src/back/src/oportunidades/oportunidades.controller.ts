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
  Query,
} from '@nestjs/common';
import { OportunidadesService } from './oportunidades.service.js';
import { CreateOportunidadeDto } from './dto/create-oportunidade.dto.js';
import { UpdateOportunidadeDto } from './dto/update-oportunidade.dto.js';
import { Public } from '../auth/public.decorator.js';
import { Roles } from '../auth/roles.decorator.js';
import { UserRole } from '../user/dto/create-user.dto.js';

@Controller('oportunidades')
export class OportunidadesController {
  private readonly logger = new Logger(OportunidadesController.name);

  constructor(private readonly oportunidadesService: OportunidadesService) {}

  // ===========================================================================
  // US21 — Consultar oportunidades abertas (rota pública)
  // ===========================================================================

  /**
   * GET /oportunidades
   * Rota pública: lista oportunidades abertas com informações resumidas.
   *
   * Query params opcionais:
   *   - categoriaId: filtra por área de atuação
   *   - busca: busca textual pelo título da vaga
   */
  @Public()
  @Get()
  async findAllOpen(
    @Query('categoriaId') categoriaId?: string,
    @Query('busca') busca?: string,
  ) {
    this.logger.log('Consulta pública às oportunidades abertas (US21)');
    return this.oportunidadesService.findAllOpen({ categoriaId, busca });
  }

  // ===========================================================================
  // RF19 — Painel do gestor: todas as oportunidades (abertas e fechadas)
  // ===========================================================================

  /**
   * GET /oportunidades/gestor
   * Rota restrita: lista todas as oportunidades, inclusive as fechadas, para o
   * gestor poder reabri-las. Precisa ficar antes de `:id`, senão "gestor" seria
   * tratado como um ID.
   */
  @Roles(UserRole.GESTOR)
  @Get('gestor')
  async findAllForGestor() {
    this.logger.log('Gestor solicitou a lista completa de oportunidades (RF19)');
    return this.oportunidadesService.findAllForGestor();
  }

  // ===========================================================================
  // US14 — Visualizar detalhes da oportunidade (rota pública)
  // ===========================================================================

  /**
   * GET /oportunidades/:id
   * Rota pública: retorna todos os detalhes de uma oportunidade.
   *
   * Inclui: projeto associado, atividades planejadas, duração,
   * disponibilidade, local de atuação e habilidades requeridas.
   * A flag `aceitandoCandidaturas` informa se o botão de candidatura
   * deve ficar habilitado.
   */
  @Public()
  @Get(':id')
  async findById(@Param('id') id: string) {
    this.logger.log(`Consulta pública ao detalhe da oportunidade ID: ${id} (US14)`);
    return this.oportunidadesService.findById(id);
  }

  // ===========================================================================
  // US13 — Cadastrar oportunidade (gestor autenticado)
  // ===========================================================================

  /**
   * POST /oportunidades
   * Rota restrita: apenas gestores autenticados podem cadastrar oportunidades.
   *
   * Campos obrigatórios: title, description, projetoId, categoriaId,
   * duracao, disponibilidade, habilidades (array).
   *
   * Opcional: criteriosFunil (RN05), atividades, localAtuacao, isOpen.
   */
  @Roles(UserRole.GESTOR)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateOportunidadeDto) {
    this.logger.log(
      `Gestor solicitou cadastro de oportunidade: "${dto.title}" (US13)`,
    );
    return this.oportunidadesService.create(dto);
  }

  // ===========================================================================
  // RF19 — Editar oportunidade (gestor autenticado)
  // ===========================================================================

  /**
   * PATCH /oportunidades/:id
   * Rota restrita: gestor pode editar dados e abrir/fechar a oportunidade.
   */
  @Roles(UserRole.GESTOR)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateOportunidadeDto) {
    this.logger.log(
      `Gestor solicitou edição da oportunidade ID: ${id} (RF19)`,
    );
    return this.oportunidadesService.update(id, dto);
  }
}
