import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Patch,
  Query,
  Request,
} from '@nestjs/common';
import { CandidaturasService } from './candidaturas.service.js';
import { ListCandidaturasQueryDto } from './dto/list-candidaturas-query.dto.js';
import { UpdateStatusCandidaturaDto } from './dto/update-status-candidatura.dto.js';
import { Roles } from '../auth/roles.decorator.js';
import { UserRole } from '../user/dto/create-user.dto.js';
import type { AuthenticatedRequest } from '../auth/auth.types.js';

@Controller('candidaturas')
export class CandidaturasController {
  private readonly logger = new Logger(CandidaturasController.name);

  constructor(private readonly candidaturasService: CandidaturasService) {}

  /**
   * Consulta das próprias candidaturas pelo voluntário autenticado.
   */
  @Get('minhas')
  async findMine(@Request() req: AuthenticatedRequest) {
    this.logger.log(`Usuário ${req.user.email} consultou suas candidaturas (US16)`);
    return this.candidaturasService.findMine(req.user.sub);
  }

  /**
   * US18: Listagem paginada de candidaturas para o gestor, com filtros por
   * oportunidade, status e busca por candidato.
   */
  @Roles(UserRole.GESTOR)
  @Get()
  async findAllForGestor(@Query() query: ListCandidaturasQueryDto) {
    this.logger.log('Gestor consultou lista de candidaturas do funil (US18)');
    return this.candidaturasService.findAllForGestor(query);
  }

  /**
   * Atualiza a etapa da candidatura no funil (EM_ANALISE, ENTREVISTA, APROVADO, REJEITADO).
   */
  @Roles(UserRole.GESTOR)
  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateStatusCandidaturaDto,
  ) {
    this.logger.log(`Gestor alterou status da candidatura ${id} para ${dto.status} (US18)`);
    return this.candidaturasService.updateStatus(id, dto.status);
  }
}