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
} from '@nestjs/common';
import { ParceriasService } from './parcerias.service.js';
import { CreatePedidoParceriaDto } from './dto/create-pedido-parceria.dto.js';
import { UpdateStatusParceriaDto } from './dto/update-status-parceria.dto.js';
import { Public } from '../auth/public.decorator.js';
import { Roles } from '../auth/roles.decorator.js';
import { UserRole } from '../user/dto/create-user.dto.js';

@Controller('parcerias')
export class ParceriasController {
  private readonly logger = new Logger(ParceriasController.name);

  constructor(private readonly parceriasService: ParceriasService) {}

  /**
   * US19: Enviar solicitação de parceria (RF33).
   * Rota pública: qualquer organização ou representante pode enviar sem autenticação.
   */
  @Public()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreatePedidoParceriaDto) {
    this.logger.log(`Recebimento público de formulário de parceria da instituição: "${dto.organization}" (US19)`);
    return this.parceriasService.create(dto);
  }

  /**
   * US20: Visualizar lista de solicitações de parceria (RF34).
   * Rota restrita: apenas gestores autenticados do IBRADA podem acessar.
   */
  @Roles(UserRole.GESTOR)
  @Get()
  async findAll() {
    this.logger.log('Gestor consultou listagem de solicitações de parceria (US20)');
    return this.parceriasService.findAll();
  }

  /**
   * US20: Visualizar detalhes de uma solicitação de parceria por ID (RF34).
   * Rota restrita: apenas gestores autenticados do IBRADA podem acessar.
   */
  @Roles(UserRole.GESTOR)
  @Get(':id')
  async findById(@Param('id') id: string) {
    this.logger.log(`Gestor consultou detalhes da solicitação de parceria ID: ${id} (US20)`);
    return this.parceriasService.findById(id);
  }

  /**
   * US20: Atualizar status de acompanhamento da proposta de parceria.
   * Rota restrita: apenas gestores autenticados podem alterar o status do funil.
   */
  @Roles(UserRole.GESTOR)
  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateStatusParceriaDto,
  ) {
    this.logger.log(`Gestor alterou status da parceria ID: ${id} para ${dto.status} (US20)`);
    return this.parceriasService.updateStatus(id, dto);
  }
}
