import { BadRequestException, Injectable } from '@nestjs/common';
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

const assuntoAter = 'ATER (Ass. Téc. e Extensão Rural)';
const produtor = 'Olá, sou agricultor familiar ou faço parte de uma comunidade';
const mensagens = {
  voluntariado: 'Olá, estou com dúvidas sobre voluntariado',
  projeto: 'Olá, não encontrei o projeto de voluntariado desejado',
  tecnico: `${produtor} e busco assistência técnica`,
  cultivo: `${produtor} e preciso de orientação para melhorar o meu cultivo`,
  identificar: 'Olá! Sou agricultor familiar ou faço parte de uma comunidade e preciso de ajuda para identificar qual atendimento devo solicitar.',
  contato: 'Olá, gostaria de falar com o atendimento institucional do IBRADA.',
};

@Injectable()
export class TriagemService {
  constructor(private readonly prisma: PrismaService) {}

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

    const { href, assunto, mensagem } = await this.destino(perfil, tipoSolicitacao, escolha);
    const registro = await this.prisma.triagem.create({
      data: {
        perfil,
        tipoSolicitacao,
        departamento,
        respostas: { tipoSolicitacao, ...(escolha === undefined ? {} : { escolha }) },
      },
    });

    return { id: registro.id, departamento, href, assunto, mensagem };
  }

  private async destino(
    perfil: keyof typeof perfis,
    tipo: string,
    escolha?: string,
  ): Promise<{ href?: string; assunto?: string; mensagem?: string }> {
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
          select: { slug: true, title: true },
        });
        if (!trilha) throw new BadRequestException('Selecione uma trilha disponível.');
        return { href: `/ecoturismo/${encodeURIComponent(trilha.slug)}`, assunto: `Ecoturismo (${trilha.title})` };
      }
      case 'voluntariado': {
        if (tipo === 'conhecer') return { href: '/voluntariado' };
        if (tipo === 'duvidas') return { assunto: 'Voluntariado', mensagem: mensagens.voluntariado };
        if (escolha === 'nao-encontrei') return { assunto: 'Projeto', mensagem: mensagens.projeto };
        const oportunidade = await this.prisma.oportunidade.findUnique({
          where: { id: escolha, isOpen: true },
          select: { title: true },
        });
        if (!oportunidade) throw new BadRequestException('Selecione um projeto de voluntariado com inscrições abertas.');
        return { assunto: `Projeto (${oportunidade.title})` };
      }
      case 'parcerias':
        return tipo === 'avaliando'
          ? { assunto: 'Patrocinadores e Apoiadores' }
          : { href: '/parcerias' };
      case 'apoio':
        if (tipo === 'regularizacao' || escolha === 'terra') return { href: '/atuacao', assunto: 'Regularização de Imóveis Rurais' };
        if (tipo === 'tecnico') return { assunto: assuntoAter, mensagem: mensagens.tecnico };
        if (escolha === 'cultivo') return { assunto: assuntoAter, mensagem: mensagens.cultivo };
        if (escolha === 'duvida') return { assunto: assuntoAter, mensagem: mensagens.identificar };
        throw new BadRequestException('Selecione a situação que mais se parece com a sua.');
      case 'informacoes':
        if (tipo === 'contato') return { assunto: 'Atendimento institucional', mensagem: mensagens.contato };
        if (tipo === 'instituto') return { href: '/quem-somos' };
        return { href: '/atuacao' };
    }
  }
}
