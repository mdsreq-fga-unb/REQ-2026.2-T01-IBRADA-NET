import { Body, Controller, HttpCode, HttpStatus, Logger, Post, Request } from '@nestjs/common';
import { ReservasService } from './reservas.service.js';
import { CreateReservaDto } from './dto/create-reserva.dto.js';
import type { AuthenticatedRequest } from '../auth/auth.types.js';

@Controller('reservas')
export class ReservasController {
  private readonly logger = new Logger(ReservasController.name);

  constructor(private readonly reservasService: ReservasService) {}

  /**
   * US08: Reservar pacote de ecoturismo (RF12 / RNF02).
   * Rota autenticada (protegida pelo JwtAuthGuard global): exige login prévio.
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Request() req: AuthenticatedRequest, @Body() dto: CreateReservaDto) {
    this.logger.log(
      `Usuário ${req.user.email} solicitou reserva de ${dto.seats} vaga(s) na experiência ${dto.experienceId} (US08)`,
    );
    return this.reservasService.create(req.user.sub, dto);
  }
}
