import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ReservasService } from './reservas.service.js';

@Injectable()
export class ReservasScheduler {
  private readonly logger = new Logger(ReservasScheduler.name);
  private isRunning = false;

  constructor(private readonly reservasService: ReservasService) {}

  @Cron(CronExpression.EVERY_MINUTE, { name: 'cancelar-reservas-expiradas' })
  async handleExpiredBookings(): Promise<void> {
    if (this.isRunning) {
      this.logger.warn('Execução anterior de cancelamento de reservas expiradas ainda em andamento.');
      return;
    }

    this.isRunning = true;
    try {
      await this.reservasService.cancelarReservasExpiradas();
    } catch (error) {
      this.logger.error(
        `Erro ao cancelar reservas expiradas no agendador: ${error instanceof Error ? error.message : String(error)}`,
      );
    } finally {
      this.isRunning = false;
    }
  }
}
