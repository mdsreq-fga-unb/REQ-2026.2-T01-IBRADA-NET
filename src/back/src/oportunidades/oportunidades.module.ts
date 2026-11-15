import { Module } from '@nestjs/common';
import { OportunidadesService } from './oportunidades.service.js';
import { OportunidadesController } from './oportunidades.controller.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [OportunidadesController],
  providers: [OportunidadesService],
  exports: [OportunidadesService], // exportado para FunilModule
})
export class OportunidadesModule {}
