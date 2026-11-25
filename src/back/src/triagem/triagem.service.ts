import { BadRequestException, Injectable } from '@nestjs/common';
import { ProjetosService } from '../projetos/projetos.service.js';
import { PrismaService } from '../prisma/prisma.service.js';

export const perfis = {
  ecoturismo: { departamento: 'Ecoturismo', opcoes: ['disponiveis', 'trilha'] },
  voluntariado: { departamento: 'Voluntariado', opcoes: ['conhecer', 'projeto', 'duvidas'] },
  parcerias: {
    departamento: 'Parcerias',
    opcoes: ['patrocinio', 'doacao', 'institucional', 'avaliando'],
  },
  apoio: {
    departamento: 'Apoio técnico e regularização fundiária',
    opcoes: ['tecnico', 'regularizacao', 'identificar'],
  },
  informacoes: {
    departamento: 'Atendimento institucional',
    opcoes: ['instituto', 'areas', 'regioes', 'contato'],
  },
};

const produtor = 'Olá, sou agricultor familiar ou faço parte de uma comunidade';
const mensagens = {
  voluntariado: 'Olá, estou com dúvidas sobre voluntariado',
  projeto: 'Olá, não encontrei o projeto de voluntariado desejado',
  tecnico: `${produtor} e busco apoio técnico`,
  cultivo: `${produtor} e preciso de orientação para melhorar o meu cultivo`,
  identificar: 'Olá! Sou agricultor familiar ou faço parte de uma comunidade e preciso de ajuda para identificar qual atendimento devo solicitar.',
  contato: 'Olá, gostaria de falar com o atendimento institucional do IBRADA.',
};

@Injectable()
export class TriagemService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly projetos: ProjetosService,
  ) {}

  async criar({
    perfil,
    tipoSolicitacao,
    escolha,
  }: {
    perfil: keyof typeof perfis;
    tipoSolicitacao: string;
    escolha?: string;
  }) {
    const { departamento, opcoes } = perfis[perfil];
    if (!opcoes.includes(tipoSolicitacao)) {
      throw new BadRequestException('Selecione um tipo de solicitação compatível com o seu perfil.');
    }

    const { href, mensagem } = await this.destino(perfil, tipoSolicitacao, escolha);
    const numero = process.env[`TRIAGEM_WHATSAPP_${perfil.toUpperCase()}`] || '5561981150274';
    const whatsappUrl = `https://wa.me/${numero}?text=${encodeURIComponent(mensagem ?? `Olá, gostaria de falar com o setor de ${departamento} do IBRADA.`)}`;
    const registro = await this.prisma.triagem.create({
      data: {
        perfil,
        tipoSolicitacao,
        departamento,
        respostas: { tipoSolicitacao, ...(escolha === undefined ? {} : { escolha }) },
      },
    });

    return { id: registro.id, departamento, href: href ?? whatsappUrl, whatsappUrl };
  }

  private async destino(
    perfil: keyof typeof perfis,
    tipo: string,
    escolha?: string,
  ): Promise<{ href?: string; mensagem?: string }> {
    const requerEscolha = ['trilha', 'projeto', 'identificar'].includes(tipo);
    if (requerEscolha && !escolha) {
      throw new BadRequestException('Selecione uma opção na terceira etapa para continuar.');
    }
    if (!requerEscolha && escolha !== undefined) {
      throw new BadRequestException('Esta solicitação não possui uma escolha na terceira etapa.');
    }

    switch (perfil) {
      case 'ecoturismo': {
        if (tipo === 'disponiveis') return { href: '/ecoturismo' };
        const trilha = await this.prisma.experiencia.findFirst({
          where: { slug: escolha, isAvailable: true },
          select: { slug: true },
        });
        if (!trilha) throw new BadRequestException('Selecione uma trilha disponível.');
        return { href: `/ecoturismo/${encodeURIComponent(trilha.slug)}` };
      }
      case 'voluntariado': {
        if (tipo === 'conhecer') return { href: '/voluntariado' };
        if (tipo === 'duvidas') return { mensagem: mensagens.voluntariado };
        if (escolha === 'nao-encontrei') return { mensagem: mensagens.projeto };
        const projeto = await this.projetos.buscarComVagas(escolha!);
        return { href: `/voluntariado/projetos/${encodeURIComponent(projeto.id)}` };
      }
      case 'parcerias':
        return { href: tipo === 'avaliando' ? '/parcerias' : `/parcerias?tipoApoio=${tipo}` };
      case 'apoio':
        if (tipo === 'regularizacao' || escolha === 'terra') return { href: '/atuacao' };
        if (tipo === 'tecnico') return { mensagem: mensagens.tecnico };
        if (escolha === 'cultivo') return { mensagem: mensagens.cultivo };
        if (escolha === 'duvida') return { mensagem: mensagens.identificar };
        throw new BadRequestException('Selecione a situação que mais se parece com a sua.');
      case 'informacoes':
        if (tipo === 'contato') return { mensagem: mensagens.contato };
        if (tipo === 'instituto') return { href: '/quem-somos' };
        return { href: '/atuacao' };
    }
  }
}
