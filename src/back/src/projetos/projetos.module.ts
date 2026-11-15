import { Module } from '@nestjs/common';
import { ProjetosService } from './projetos.service.js';
import { ProjetosController } from './projetos.controller.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [ProjetosController],
  providers: [ProjetosService],
  exports: [ProjetosService], // exportado para OportunidadesService validar projetoId
})
export class ProjetosModule {}
