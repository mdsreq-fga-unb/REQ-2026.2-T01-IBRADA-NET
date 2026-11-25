import { Module } from '@nestjs/common';
import { ProjetosModule } from '../projetos/projetos.module.js';
import { TriagemController } from './triagem.controller.js';
import { TriagemService } from './triagem.service.js';

@Module({
  imports: [ProjetosModule],
  controllers: [TriagemController],
  providers: [TriagemService],
})
export class TriagemModule {}
