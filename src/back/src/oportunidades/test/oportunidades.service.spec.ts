import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { OportunidadesService } from '../oportunidades.service.js';
import { CreateOportunidadeDto } from '../dto/create-oportunidade.dto.js';
import { UpdateOportunidadeDto } from '../dto/update-oportunidade.dto.js';
import { NivelEducacao } from '../../user/dto/create-user.dto.js';

const mockPrisma = {
  oportunidade: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
  },
  projeto: {
    findUnique: vi.fn(),
  },
  categoria: {
    findUnique: vi.fn(),
  },
  perfilVoluntario: {
    findUnique: vi.fn(),
  },
  candidatura: {
    findUnique: vi.fn(),
    create: vi.fn(),
  },
  criterioFunil: {
    create: vi.fn(),
    upsert: vi.fn(),
  },
  $transaction: vi.fn(),
};

const resetMockPrisma = () => {
  mockPrisma.oportunidade.findMany.mockReset();
  mockPrisma.oportunidade.findUnique.mockReset();
  mockPrisma.oportunidade.create.mockReset();
  mockPrisma.oportunidade.update.mockReset();
  mockPrisma.projeto.findUnique.mockReset();
  mockPrisma.categoria.findUnique.mockReset();
  mockPrisma.perfilVoluntario.findUnique.mockReset();
  mockPrisma.candidatura.findUnique.mockReset();
  mockPrisma.candidatura.create.mockReset();
  mockPrisma.criterioFunil.create.mockReset();
  mockPrisma.criterioFunil.upsert.mockReset();
  mockPrisma.$transaction.mockReset();
};

describe('OportunidadesService (US13, US14, US21, RF19)', () => {
  let service: OportunidadesService;

  beforeEach(() => {
    resetMockPrisma();
    // Configuração padrão do $transaction para executar a função recebida com tx = mockPrisma
    mockPrisma.$transaction.mockImplementation(async (callback: (tx: any) => Promise<any>) => {
      return callback(mockPrisma);
    });
    service = new OportunidadesService(mockPrisma as never);
  });

  // ===========================================================================
  // US21 — Consultar oportunidades abertas (RF21)
  // ===========================================================================
  describe('findAllOpen (US21 - Listagem pública de abertas)', () => {
    it('deve listar oportunidades abertas retornando apenas dados resumidos', async () => {
      mockPrisma.oportunidade.findMany.mockResolvedValue([
        {
          id: 'op-1',
          title: 'Monitoria Ambiental na Trilha',
          duracao: '3 meses',
          disponibilidade: 'Sábados pela manhã',
          categoriaId: 'cat-bio',
          categoria: { id: 'cat-bio', nome: 'Educação Ambiental' },
          createdAt: new Date('2026-11-15T10:00:00Z'),
        },
        {
          id: 'op-2',
          title: 'Auxiliar de Agroecologia Comunitária',
          duracao: '6 meses',
          disponibilidade: 'Tardes (flexível)',
          categoriaId: 'cat-agro',
          categoria: { id: 'cat-agro', nome: 'Agroecologia' },
          createdAt: new Date('2026-11-14T15:00:00Z'),
        },
      ]);

      const result = await service.findAllOpen();

      expect(result).toHaveLength(2);
      expect(result[0].title).toBe('Monitoria Ambiental na Trilha');
      expect(result[0].duracao).toBe('3 meses');
      expect(result[0].disponibilidade).toBe('Sábados pela manhã');
      expect(mockPrisma.oportunidade.findMany).toHaveBeenCalledWith({
        where: { isOpen: true },
        orderBy: { createdAt: 'desc' },
        select: expect.objectContaining({
          id: true,
          title: true,
          duracao: true,
          disponibilidade: true,
        }),
      });
    });

    it('deve aplicar filtros opcionais por categoriaId e busca textual por título', async () => {
      mockPrisma.oportunidade.findMany.mockResolvedValue([
        {
          id: 'op-1',
          title: 'Monitoria Ambiental na Trilha',
          duracao: '3 meses',
          disponibilidade: 'Sábados',
          categoriaId: 'cat-bio',
          categoria: { id: 'cat-bio', nome: 'Educação Ambiental' },
          createdAt: new Date(),
        },
      ]);

      await service.findAllOpen({ categoriaId: 'cat-bio', busca: 'Monitoria' });

      expect(mockPrisma.oportunidade.findMany).toHaveBeenCalledWith({
        where: {
          isOpen: true,
          categoriaId: 'cat-bio',
          title: { contains: 'Monitoria' },
        },
        orderBy: { createdAt: 'desc' },
        select: expect.any(Object),
      });
    });

    it('deve retornar lista vazia se nenhuma oportunidade estiver aberta', async () => {
      mockPrisma.oportunidade.findMany.mockResolvedValue([]);

      const result = await service.findAllOpen();

      expect(result).toEqual([]);
    });
  });

  describe('findAllForGestor (RF19 - Painel do gestor)', () => {
    it('deve listar todas as oportunidades, sem filtrar por isOpen', async () => {
      mockPrisma.oportunidade.findMany.mockResolvedValue([
        { id: 'op-1', title: 'Aberta', isOpen: true },
        { id: 'op-2', title: 'Fechada', isOpen: false },
      ]);

      const result = await service.findAllForGestor();

      expect(result).toHaveLength(2);
      const args = mockPrisma.oportunidade.findMany.mock.calls[0][0];
      expect(args.where).toBeUndefined();
      expect(args.select.isOpen).toBe(true);
    });
  });

  // ===========================================================================
  // US14 — Visualizar detalhes da oportunidade (RF22)
  // ===========================================================================
  describe('findById (US14 - Detalhes da oportunidade)', () => {
    it('deve retornar todos os detalhes da oportunidade incluindo projeto, atividades, duração, disponibilidade e habilidades', async () => {
      mockPrisma.oportunidade.findUnique.mockResolvedValue({
        id: 'op-1',
        title: 'Manejo de Trilha Agroflorestal',
        description: 'Auxílio na restauração ecológica da trilha principal.',
        atividades: 'Poda de contenção, catalogação de mudas e apoio a visitantes.',
        duracao: '4 meses',
        disponibilidade: '2 dias na semana (terças e quintas)',
        habilidades: JSON.stringify(['Agroecologia', 'Trabalho em equipe', 'Botânica']),
        localAtuacao: 'Sede Rural do IBRADA - Chapada dos Veadeiros',
        isOpen: true,
        createdAt: new Date('2026-11-10T12:00:00Z'),
        updatedAt: new Date('2026-11-10T12:00:00Z'),
        projeto: {
          id: 'proj-1',
          title: 'Restauração da Mata Ciliar',
          description: 'Recuperação de nascentes do cerrado.',
        },
        categoria: {
          id: 'cat-1',
          nome: 'Meio Ambiente',
        },
        criteriosFunil: {
          exigeExperiencia: true,
          educacaoMinima: 'GRADUACAO',
          habilidadesExigidas: JSON.stringify(['Agroecologia']),
        },
      });

      const result = await service.findById('op-1');

      expect(result.id).toBe('op-1');
      expect(result.title).toBe('Manejo de Trilha Agroflorestal');
      expect(result.projeto.title).toBe('Restauração da Mata Ciliar');
      expect(result.atividades).toBe('Poda de contenção, catalogação de mudas e apoio a visitantes.');
      expect(result.duracao).toBe('4 meses');
      expect(result.disponibilidade).toBe('2 dias na semana (terças e quintas)');
      expect(result.habilidades).toEqual(['Agroecologia', 'Trabalho em equipe', 'Botânica']);
      expect(result.localAtuacao).toBe('Sede Rural do IBRADA - Chapada dos Veadeiros');
      expect(result.isOpen).toBe(true);
      expect(result.aceitandoCandidaturas).toBe(true);
      expect(result.criteriosFunil).toEqual({
        exigeExperiencia: true,
        educacaoMinima: 'GRADUACAO',
        habilidadesExigidas: ['Agroecologia'],
      });
    });

    it('deve sinalizar aceitandoCandidaturas como false quando a oportunidade estiver fechada (isOpen: false)', async () => {
      mockPrisma.oportunidade.findUnique.mockResolvedValue({
        id: 'op-fechada',
        title: 'Vaga Encerrada',
        description: 'Vaga preenchida.',
        atividades: 'Atividades já encerradas.',
        duracao: '1 mês',
        disponibilidade: 'Finais de semana',
        habilidades: JSON.stringify(['Comunicação']),
        localAtuacao: 'Online',
        isOpen: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        projeto: { id: 'proj-1', title: 'Projeto', description: 'Desc' },
        categoria: { id: 'cat-1', nome: 'Geral' },
        criteriosFunil: null,
      });

      const result = await service.findById('op-fechada');

      expect(result.isOpen).toBe(false);
      expect(result.aceitandoCandidaturas).toBe(false);
    });

    it('deve lançar NotFoundException (404) quando a oportunidade não existir', async () => {
      mockPrisma.oportunidade.findUnique.mockResolvedValue(null);

      await expect(service.findById('id-inexistente')).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  // ===========================================================================
  // US13 — Cadastrar oportunidade (RF18)
  // ===========================================================================
  describe('create (US13 - Cadastro de oportunidade pelo gestor)', () => {
    const validDto: CreateOportunidadeDto = {
      title: 'Educador Ambiental Voluntário',
      description: 'Condução de oficinas para escolas da comunidade.',
      projetoId: 'proj-educa',
      categoriaId: 'cat-educa',
      duracao: '6 meses',
      disponibilidade: 'Fins de semana',
      habilidades: ['Pedagogia', 'Comunicação oral', 'Educação ambiental'],
      atividades: 'Ministrar oficinas, preparar materiais didáticos',
      localAtuacao: 'Centro Comunitário IBRADA',
      isOpen: true,
      criteriosFunil: {
        exigeExperiencia: true,
        educacaoMinima: NivelEducacao.GRADUACAO,
        habilidadesExigidas: ['Pedagogia'],
      },
    };

    it('deve cadastrar uma oportunidade com sucesso com todos os campos obrigatórios e critérios de funil', async () => {
      mockPrisma.projeto.findUnique.mockResolvedValue({ id: 'proj-educa', title: 'Projeto Educa' });
      mockPrisma.categoria.findUnique.mockResolvedValue({ id: 'cat-educa', nome: 'Educação' });

      const opCriada = {
        id: 'op-nova-1',
        title: validDto.title,
        description: validDto.description,
        projetoId: validDto.projetoId,
        categoriaId: validDto.categoriaId,
        duracao: validDto.duracao,
        disponibilidade: validDto.disponibilidade,
        habilidades: JSON.stringify(validDto.habilidades),
        atividades: validDto.atividades,
        localAtuacao: validDto.localAtuacao,
        isOpen: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockPrisma.oportunidade.create.mockResolvedValue(opCriada);
      mockPrisma.criterioFunil.create.mockResolvedValue({
        id: 'crit-1',
        oportunidadeId: opCriada.id,
        exigeExperiencia: true,
        educacaoMinima: 'GRADUACAO',
        habilidadesExigidas: JSON.stringify(['Pedagogia']),
      });

      const response = await service.create(validDto);

      expect(response.message).toContain('inscrições abertas com sucesso');
      expect(response.data.title).toBe('Educador Ambiental Voluntário');
      expect(response.data.habilidades).toEqual(validDto.habilidades);
      expect(mockPrisma.oportunidade.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          title: validDto.title,
          projetoId: 'proj-educa',
          categoriaId: 'cat-educa',
          duracao: '6 meses',
          disponibilidade: 'Fins de semana',
          habilidades: JSON.stringify(validDto.habilidades),
          isOpen: true,
        }),
      });
      expect(mockPrisma.criterioFunil.create).toHaveBeenCalledWith({
        data: {
          oportunidadeId: 'op-nova-1',
          exigeExperiencia: true,
          educacaoMinima: 'GRADUACAO',
          habilidadesExigidas: JSON.stringify(['Pedagogia']),
        },
      });
    });

    it('deve permitir cadastrar já fechada (isOpen: false) e exibir mensagem condizente', async () => {
      mockPrisma.projeto.findUnique.mockResolvedValue({ id: 'proj-educa' });
      mockPrisma.categoria.findUnique.mockResolvedValue({ id: 'cat-educa' });

      const dtoFechada: CreateOportunidadeDto = {
        ...validDto,
        isOpen: false,
        criteriosFunil: undefined,
      };

      mockPrisma.oportunidade.create.mockResolvedValue({
        id: 'op-fechada',
        ...dtoFechada,
        habilidades: JSON.stringify(dtoFechada.habilidades),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const response = await service.create(dtoFechada);

      expect(response.message).toContain('inscrições fechadas com sucesso');
      expect(mockPrisma.criterioFunil.create).not.toHaveBeenCalled();
    });

    it('deve lançar BadRequestException se o projeto associado não existir no banco', async () => {
      mockPrisma.projeto.findUnique.mockResolvedValue(null);

      await expect(service.create(validDto)).rejects.toBeInstanceOf(BadRequestException);
      expect(mockPrisma.oportunidade.create).not.toHaveBeenCalled();
    });

    it('deve lançar BadRequestException se a categoria associada não existir no banco', async () => {
      mockPrisma.projeto.findUnique.mockResolvedValue({ id: 'proj-educa' });
      mockPrisma.categoria.findUnique.mockResolvedValue(null);

      await expect(service.create(validDto)).rejects.toBeInstanceOf(BadRequestException);
      expect(mockPrisma.oportunidade.create).not.toHaveBeenCalled();
    });
  });

  // ===========================================================================
  // RF19 — Editar oportunidade (abrir/fechar e alterar dados)
  // ===========================================================================
  describe('update (RF19 - Alteração de oportunidade pelo gestor)', () => {
    it('deve atualizar campos da oportunidade e fechar para candidaturas (isOpen: false)', async () => {
      mockPrisma.oportunidade.findUnique.mockResolvedValue({
        id: 'op-1',
        title: 'Monitor de Trilha',
        duracao: '2 meses',
        disponibilidade: 'Manhãs',
        habilidades: JSON.stringify(['Trilha']),
        isOpen: true,
      });

      mockPrisma.oportunidade.update.mockResolvedValue({
        id: 'op-1',
        title: 'Monitor de Trilha Sênior',
        duracao: '4 meses',
        disponibilidade: 'Finais de semana',
        habilidades: JSON.stringify(['Trilha', 'Primeiros socorros']),
        isOpen: false,
      });

      const dtoUpdate: UpdateOportunidadeDto = {
        title: 'Monitor de Trilha Sênior',
        duracao: '4 meses',
        disponibilidade: 'Finais de semana',
        habilidades: ['Trilha', 'Primeiros socorros'],
        isOpen: false,
      };

      const result = await service.update('op-1', dtoUpdate);

      expect(result.message).toContain('Oportunidade fechada para novas candidaturas');
      expect(result.data.isOpen).toBe(false);
      expect(result.data.title).toBe('Monitor de Trilha Sênior');
      expect(result.data.habilidades).toEqual(['Trilha', 'Primeiros socorros']);
      expect(mockPrisma.oportunidade.update).toHaveBeenCalledWith({
        where: { id: 'op-1' },
        data: {
          title: 'Monitor de Trilha Sênior',
          duracao: '4 meses',
          disponibilidade: 'Finais de semana',
          habilidades: JSON.stringify(['Trilha', 'Primeiros socorros']),
          isOpen: false,
        },
      });
    });

    it('deve reabrir a oportunidade (isOpen: true) com mensagem de status condizente', async () => {
      mockPrisma.oportunidade.findUnique.mockResolvedValue({
        id: 'op-1',
        isOpen: false,
      });

      mockPrisma.oportunidade.update.mockResolvedValue({
        id: 'op-1',
        isOpen: true,
        habilidades: JSON.stringify(['Manejo florestal']),
      });

      const result = await service.update('op-1', { isOpen: true });

      expect(result.message).toContain('Oportunidade aberta para candidaturas');
      expect(result.data.isOpen).toBe(true);
    });

    it('deve fazer upsert dos critérios do funil quando informados no update', async () => {
      mockPrisma.oportunidade.findUnique.mockResolvedValue({
        id: 'op-1',
        isOpen: true,
      });

      mockPrisma.oportunidade.update.mockResolvedValue({
        id: 'op-1',
        isOpen: true,
        habilidades: JSON.stringify(['Habilidade']),
      });

      const dtoComFunil: UpdateOportunidadeDto = {
        criteriosFunil: {
          exigeExperiencia: true,
          educacaoMinima: NivelEducacao.MESTRADO,
          habilidadesExigidas: ['Pesquisa de campo'],
        },
      };

      await service.update('op-1', dtoComFunil);

      expect(mockPrisma.criterioFunil.upsert).toHaveBeenCalledWith({
        where: { oportunidadeId: 'op-1' },
        create: {
          oportunidadeId: 'op-1',
          exigeExperiencia: true,
          educacaoMinima: 'MESTRADO',
          habilidadesExigidas: JSON.stringify(['Pesquisa de campo']),
        },
        update: {
          exigeExperiencia: true,
          educacaoMinima: 'MESTRADO',
          habilidadesExigidas: JSON.stringify(['Pesquisa de campo']),
        },
      });
    });

    it('deve lançar NotFoundException (404) ao tentar atualizar oportunidade inexistente', async () => {
      mockPrisma.oportunidade.findUnique.mockResolvedValue(null);

      await expect(service.update('id-fantasma', { title: 'Novo Título' })).rejects.toBeInstanceOf(
        NotFoundException,
      );
      expect(mockPrisma.oportunidade.update).not.toHaveBeenCalled();
    });
  });
  it('preserva os critérios omitidos no PATCH parcial', async () => {
    mockPrisma.oportunidade.findUnique.mockResolvedValue({ id: 'op-1' });
    mockPrisma.oportunidade.update.mockResolvedValue({ id: 'op-1', habilidades: '[]' });
    await service.update('op-1', { criteriosFunil: { exigeExperiencia: true } });
    expect(mockPrisma.criterioFunil.upsert).toHaveBeenCalledWith(expect.objectContaining({
      update: { exigeExperiencia: true },
    }));
  });

  it('remove critérios quando educacaoMinima = null e habilidadesExigidas = []', async () => {
    mockPrisma.oportunidade.findUnique.mockResolvedValue({ id: 'op-1' });
    mockPrisma.oportunidade.update.mockResolvedValue({ id: 'op-1', habilidades: '[]' });
    await service.update('op-1', { criteriosFunil: { educacaoMinima: null, habilidadesExigidas: [] } });
    expect(mockPrisma.criterioFunil.upsert).toHaveBeenCalledWith(expect.objectContaining({
      update: { educacaoMinima: null, habilidadesExigidas: null },
    }));
  });

});

describe('OportunidadesService — candidatura (US16)', () => {
  let service: OportunidadesService;

  beforeEach(() => {
    resetMockPrisma();
    service = new OportunidadesService(mockPrisma as never);
  });

  it('registra candidatura com status INSCRITO', async () => {
    mockPrisma.oportunidade.findUnique.mockResolvedValue({ id: 'op1', isOpen: true });
    mockPrisma.perfilVoluntario.findUnique.mockResolvedValue({ id: 'pf1' });
    mockPrisma.candidatura.findUnique.mockResolvedValue(null);
    mockPrisma.candidatura.create.mockResolvedValue({ id: 'c1', status: 'INSCRITO' });

    const res = await service.candidatar('u1', 'op1');

    expect(res.status).toBe('INSCRITO');
    expect(mockPrisma.candidatura.create).toHaveBeenCalledWith(
      expect.objectContaining({ data: { perfilId: 'pf1', oportunidadeId: 'op1' } }),
    );
  });

  it('retorna 404 se a oportunidade não existe', async () => {
    mockPrisma.oportunidade.findUnique.mockResolvedValue(null);
    await expect(service.candidatar('u1', 'x')).rejects.toBeInstanceOf(NotFoundException);
  });

  it('bloqueia candidatura em oportunidade encerrada', async () => {
    mockPrisma.oportunidade.findUnique.mockResolvedValue({ id: 'op1', isOpen: false });
    await expect(service.candidatar('u1', 'op1')).rejects.toBeInstanceOf(BadRequestException);
    expect(mockPrisma.candidatura.create).not.toHaveBeenCalled();
  });

  it('retorna 403 se o usuário não tem perfil de voluntário', async () => {
    mockPrisma.oportunidade.findUnique.mockResolvedValue({ id: 'op1', isOpen: true });
    mockPrisma.perfilVoluntario.findUnique.mockResolvedValue(null);
    await expect(service.candidatar('u1', 'op1')).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('impede candidatura duplicada (409)', async () => {
    mockPrisma.oportunidade.findUnique.mockResolvedValue({ id: 'op1', isOpen: true });
    mockPrisma.perfilVoluntario.findUnique.mockResolvedValue({ id: 'pf1' });
    mockPrisma.candidatura.findUnique.mockResolvedValue({ id: 'c1' });
    await expect(service.candidatar('u1', 'op1')).rejects.toBeInstanceOf(ConflictException);
  });

  it('jaCandidatou informa temPerfil e candidatado', async () => {
    mockPrisma.perfilVoluntario.findUnique.mockResolvedValue(null);
    expect(await service.jaCandidatou('u1', 'op1')).toEqual({ candidatado: false, temPerfil: false });

    mockPrisma.perfilVoluntario.findUnique.mockResolvedValue({ id: 'pf1' });
    mockPrisma.candidatura.findUnique.mockResolvedValue({ id: 'c1' });
    expect(await service.jaCandidatou('u1', 'op1')).toEqual({ candidatado: true, temPerfil: true });
  });
});
