import { Module } from '@nestjs/common';
import { ExperienciasService } from './experiencias.service.js';
import { ExperienciasController } from './experiencias.controller.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [ExperienciasController],
  providers: [ExperienciasService],
  exports: [ExperienciasService],
})
export class ExperienciasModule {}
