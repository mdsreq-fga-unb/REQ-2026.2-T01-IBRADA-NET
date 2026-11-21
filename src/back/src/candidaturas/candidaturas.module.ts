import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module.js';
import { CandidaturasController } from './candidaturas.controller.js';
import { CandidaturasService } from './candidaturas.service.js';

@Module({
  imports: [PrismaModule],
  controllers: [CandidaturasController],
  providers: [CandidaturasService],
  exports: [CandidaturasService],
})
export class CandidaturasModule {}