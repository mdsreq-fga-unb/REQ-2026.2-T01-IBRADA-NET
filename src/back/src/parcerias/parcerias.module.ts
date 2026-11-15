import { Module } from '@nestjs/common';
import { ParceriasService } from './parcerias.service.js';
import { ParceriasController } from './parcerias.controller.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [ParceriasController],
  providers: [ParceriasService],
  exports: [ParceriasService],
})
export class ParceriasModule {}
