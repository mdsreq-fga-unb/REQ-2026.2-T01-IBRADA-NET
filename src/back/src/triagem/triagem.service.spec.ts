import { BadRequestException } from '@nestjs/common';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { perfis, TriagemService } from './triagem.service.js';

describe('TriagemService', () => {
  const create = vi.fn();
  const findFirst = vi.fn();
  const findUnique = vi.fn();
  const service = new TriagemService(
    { triagem: { create }, experiencia: { findFirst }, oportunidade: { findUnique } } as unknown as ConstructorParameters<typeof TriagemService>[0],
  );

  beforeEach(() => {
    vi.resetAllMocks();
    create.mockResolvedValue({ id: 'triagem-1' });
    findFirst.mockResolvedValue({ slug: 'trilha-1', title: 'Trilha do Cerrado' });
    findUnique.mockResolvedValue({ id: 'vaga-1' });
  });

  it.each([
    ['ecoturismo', 'disponiveis', undefined, '/ecoturismo', undefined],
    ['ecoturismo', 'trilha', 'trilha-1', '/ecoturismo/trilha-1', 'Ecoturismo (Trilha do Cerrado)'],
    ['voluntariado', 'conhecer', undefined, '/voluntariado', undefined],
    ['voluntariado', 'projeto', 'vaga-1', '/voluntariado/vaga-1', undefined],
    ['voluntariado', 'projeto', 'nao-encontrei', 'Olá, não encontrei o projeto de voluntariado desejado', 'Projeto'],
    ['voluntariado', 'duvidas', undefined, 'Olá, estou com dúvidas sobre voluntariado', 'Voluntariado'],
    ['parcerias', 'patrocinio', undefined, '/parcerias?tipoApoio=patrocinio', 'Patrocinadores e Apoiadores'],
    ['parcerias', 'doacao', undefined, '/parcerias?tipoApoio=doacao', 'Patrocinadores e Apoiadores'],
    ['parcerias', 'institucional', undefined, '/parcerias?tipoApoio=institucional', 'Patrocinadores e Apoiadores'],
    ['parcerias', 'avaliando', undefined, '/parcerias', 'Patrocinadores e Apoiadores'],
    ['apoio', 'tecnico', undefined, 'Olá, sou agricultor familiar ou faço parte de uma comunidade e busco assistência técnica', 'ATER (Ass. Téc. e Extensão Rural)'],
    ['apoio', 'regularizacao', undefined, '/atuacao', 'Regularização de Imóveis Rurais'],
    ['apoio', 'identificar', 'cultivo', 'Olá, sou agricultor familiar ou faço parte de uma comunidade e preciso de orientação para melhorar o meu cultivo', 'ATER (Ass. Téc. e Extensão Rural)'],
    ['apoio', 'identificar', 'terra', '/atuacao', 'Regularização de Imóveis Rurais'],
    ['apoio', 'identificar', 'duvida', 'Olá! Sou agricultor familiar ou faço parte de uma comunidade e preciso de ajuda para identificar qual atendimento devo solicitar.', 'ATER (Ass. Téc. e Extensão Rural)'],
    ['informacoes', 'instituto', undefined, '/quem-somos', undefined],
    ['informacoes', 'areas', undefined, '/atuacao', undefined],
    ['informacoes', 'regioes', undefined, '/atuacao', undefined],
    ['informacoes', 'contato', undefined, 'Olá, gostaria de falar com o atendimento institucional do IBRADA.', 'Atendimento institucional'],
  ] as const)('encaminha %s / %s (%s) e grava a triagem', async (perfil, tipoSolicitacao, escolha, destino, assunto) => {
    const resultado = await service.criar({ perfil, tipoSolicitacao, escolha });

    expect(resultado.assunto).toBe(assunto);
    if (destino.startsWith('/')) {
      expect(resultado.href).toBe(destino);
    } else {
      expect(resultado.href).toBeUndefined();
      expect(resultado.mensagem).toBe(destino);
    }
    expect(create).toHaveBeenCalledExactlyOnceWith({
      data: {
        perfil,
        tipoSolicitacao,
        departamento: perfis[perfil].departamento,
        respostas: { tipoSolicitacao, ...(escolha && { escolha }) },
      },
    });
  });

  it.each([
    ['apoio', 'trilha', 'trilha-1'],
    ['ecoturismo', 'trilha', undefined],
    ['voluntariado', 'projeto', undefined],
    ['apoio', 'identificar', 'invalida'],
    ['parcerias', 'avaliando', 'invalida'],
  ] as const)('rejeita %s / %s (%s) sem gravar', async (perfil, tipoSolicitacao, escolha) => {
    await expect(service.criar({ perfil, tipoSolicitacao, escolha })).rejects.toBeInstanceOf(BadRequestException);
    expect(create).not.toHaveBeenCalled();
  });

  it('rejeita trilha que deixou de estar disponível', async () => {
    findFirst.mockResolvedValue(null);
    await expect(service.criar({
      perfil: 'ecoturismo', tipoSolicitacao: 'trilha', escolha: 'trilha-1',
    })).rejects.toBeInstanceOf(BadRequestException);
    expect(create).not.toHaveBeenCalled();
  });

  it('rejeita oportunidade que deixou de estar aberta', async () => {
    findUnique.mockResolvedValue(null);
    await expect(service.criar({
      perfil: 'voluntariado', tipoSolicitacao: 'projeto', escolha: 'vaga-1',
    })).rejects.toBeInstanceOf(BadRequestException);
    expect(findUnique).toHaveBeenCalledWith({
      where: { id: 'vaga-1', isOpen: true }, select: { id: true },
    });
    expect(create).not.toHaveBeenCalled();
  });
});
