import { Module } from '@nestjs/common';
import { FunilService } from './funil.service.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  providers: [FunilService],
  exports: [FunilService],
})
export class FunilModule {}
