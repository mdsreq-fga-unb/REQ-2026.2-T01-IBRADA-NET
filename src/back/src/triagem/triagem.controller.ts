import { Body, Controller, Post } from '@nestjs/common';
import { IsIn, IsString, Matches, ValidateIf } from 'class-validator';
import { Public } from '../auth/public.decorator.js';
import { TriagemService, perfis } from './triagem.service.js';

class CriarTriagemDto {
  @IsIn(Object.keys(perfis), { message: 'Selecione um perfil de atendimento válido.' })
  perfil: keyof typeof perfis;

  @IsString({ message: 'Selecione o tipo de solicitação.' })
  tipoSolicitacao: string;

  @ValidateIf((_, valor) => valor !== undefined)
  @Matches(/^[a-zA-Z0-9_-]{1,191}$/, { message: 'Selecione uma opção válida na terceira etapa.' })
  escolha?: string;
}

@Controller('triagem')
export class TriagemController {
  constructor(private readonly triagem: TriagemService) {}

  @Public()
  @Post()
  criar(@Body() dto: CriarTriagemDto) {
    return this.triagem.criar(dto);
  }
}
