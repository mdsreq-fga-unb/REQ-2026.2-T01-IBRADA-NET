import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module.js';
import { CategoriaController } from './categoria.controller.js';
import { CategoriaService } from './categoria.service.js';

@Module({
  imports: [PrismaModule],
  controllers: [CategoriaController],
  providers: [CategoriaService],
  exports: [CategoriaService],
})
export class CategoriaModule {}