import { BadRequestException } from '@nestjs/common';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { perfis, TriagemService } from './triagem.service.js';

describe('TriagemService', () => {
  const create = vi.fn();
  const findFirst = vi.fn();
  const buscarComVagas = vi.fn();
  const service = new TriagemService(
    { triagem: { create }, experiencia: { findFirst } } as unknown as ConstructorParameters<typeof TriagemService>[0],
    { buscarComVagas } as unknown as ConstructorParameters<typeof TriagemService>[1],
  );

  beforeEach(() => {
    vi.resetAllMocks();
    create.mockResolvedValue({ id: 'triagem-1' });
    findFirst.mockResolvedValue({ slug: 'trilha-1' });
    buscarComVagas.mockResolvedValue({ id: 'projeto-1' });
  });

  it.each([
    ['ecoturismo', 'disponiveis', undefined, '/ecoturismo'],
    ['ecoturismo', 'trilha', 'trilha-1', '/ecoturismo/trilha-1'],
    ['voluntariado', 'conhecer', undefined, '/voluntariado'],
    ['voluntariado', 'projeto', 'projeto-1', '/voluntariado/projetos/projeto-1'],
    ['voluntariado', 'projeto', 'nao-encontrei', 'Olá, não encontrei o projeto de voluntariado desejado'],
    ['voluntariado', 'duvidas', undefined, 'Olá, estou com dúvidas sobre voluntariado'],
    ['parcerias', 'patrocinio', undefined, '/parcerias?tipoApoio=patrocinio'],
    ['parcerias', 'doacao', undefined, '/parcerias?tipoApoio=doacao'],
    ['parcerias', 'institucional', undefined, '/parcerias?tipoApoio=institucional'],
    ['parcerias', 'avaliando', undefined, '/parcerias'],
    ['apoio', 'tecnico', undefined, 'Olá, sou agricultor familiar ou faço parte de uma comunidade e busco apoio técnico'],
    ['apoio', 'regularizacao', undefined, '/atuacao'],
    ['apoio', 'identificar', 'cultivo', 'Olá, sou agricultor familiar ou faço parte de uma comunidade e preciso de orientação para melhorar o meu cultivo'],
    ['apoio', 'identificar', 'terra', '/atuacao'],
    ['apoio', 'identificar', 'duvida', 'Olá! Sou agricultor familiar ou faço parte de uma comunidade e preciso de ajuda para identificar qual atendimento devo solicitar.'],
    ['informacoes', 'instituto', undefined, '/quem-somos'],
    ['informacoes', 'areas', undefined, '/atuacao'],
    ['informacoes', 'regioes', undefined, '/atuacao'],
    ['informacoes', 'contato', undefined, 'Olá, gostaria de falar com o atendimento institucional do IBRADA.'],
  ] as const)('encaminha %s / %s (%s) e grava a triagem', async (perfil, tipoSolicitacao, escolha, destino) => {
    const resultado = await service.criar({ perfil, tipoSolicitacao, escolha });

    if (destino.startsWith('/')) {
      expect(resultado.href).toBe(destino);
    } else {
      const whatsapp = new URL(resultado.href);
      expect(whatsapp.origin).toBe('https://wa.me');
      expect(whatsapp.searchParams.get('text')).toBe(destino);
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
});
