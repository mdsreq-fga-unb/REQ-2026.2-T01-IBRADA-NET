import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module.js';
import { ReservasController } from './reservas.controller.js';
import { ReservasService } from './reservas.service.js';
import { ReservasScheduler } from './reservas.scheduler.js';

@Module({
  imports: [PrismaModule],
  controllers: [ReservasController],
  providers: [ReservasService, ReservasScheduler],
  exports: [ReservasService],
})
export class ReservasModule {}
