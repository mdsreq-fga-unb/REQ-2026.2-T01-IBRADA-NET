import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post, Req } from '@nestjs/common';
import type { AuthenticatedRequest } from '../auth/auth.types.js';
import { AlterarReservaDto, ConfirmarReservaDto } from './dto/reservas.dto.js';
import { PagamentosService } from './pagamentos.service.js';
import { ReservasService } from './reservas.service.js';

@Controller('reservas')
export class ReservasController {
  constructor(
    private readonly reservas: ReservasService,
    private readonly pagamentos: PagamentosService,
  ) {}

  @Get(':id')
  resumo(@Param('id') id: string, @Req() request: AuthenticatedRequest) {
    return this.reservas.resumo(id, request.user.sub);
  }

  @Patch(':id')
  alterar(
    @Param('id') id: string,
    @Req() request: AuthenticatedRequest,
    @Body() dto: AlterarReservaDto,
  ) {
    return this.reservas.alterarQuantidade(id, request.user.sub, dto.seats, dto.revision);
  }

  @Post(':id/confirmar')
  @HttpCode(HttpStatus.OK)
  confirmar(
    @Param('id') id: string,
    @Req() request: AuthenticatedRequest,
    @Body() dto: ConfirmarReservaDto,
  ) {
    return this.reservas.confirmar(id, request.user.sub, dto.revision);
  }

  @Post(':id/pagamentos')
  @HttpCode(HttpStatus.OK)
  iniciarPagamento(@Param('id') id: string, @Req() request: AuthenticatedRequest) {
    return this.pagamentos.iniciar(id, request.user.sub);
  }

  @Get(':id/comprovante')
  comprovante(@Param('id') id: string, @Req() request: AuthenticatedRequest) {
    return this.reservas.comprovante(id, request.user.sub);
  }
}
