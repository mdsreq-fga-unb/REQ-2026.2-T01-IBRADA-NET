import { Module } from '@nestjs/common';
import { TriagemController } from './triagem.controller.js';
import { TriagemService } from './triagem.service.js';

@Module({
  controllers: [TriagemController],
  providers: [TriagemService],
})
export class TriagemModule {}
