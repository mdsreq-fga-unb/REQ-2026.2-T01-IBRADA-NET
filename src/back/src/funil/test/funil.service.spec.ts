import { NotFoundException } from '@nestjs/common';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FunilService, atendeEducacaoMinima } from '../funil.service.js';
import { NivelEducacao } from '../../user/dto/create-user.dto.js';

const mockPrisma = {
  oportunidade: {
    findUnique: vi.fn(),
  },
  candidatura: {
    findMany: vi.fn(),
  },
};

const resetMockPrisma = () => {
  mockPrisma.oportunidade.findUnique.mockReset();
  mockPrisma.candidatura.findMany.mockReset();
};

describe('FunilService — Regra de Negócio RN05 (Filtro de Candidatos)', () => {
  let service: FunilService;

  beforeEach(() => {
    resetMockPrisma();
    service = new FunilService(mockPrisma as never);
  });

  // ===========================================================================
  // Testes da função auxiliar de hierarquia de escolaridade
  // ===========================================================================
  describe('atendeEducacaoMinima (Hierarquia de escolaridade)', () => {
    it('deve aprovar quando o candidato tem nível igual ou superior ao exigido', () => {
      expect(atendeEducacaoMinima(NivelEducacao.GRADUACAO, NivelEducacao.GRADUACAO)).toBe(true);
      expect(atendeEducacaoMinima(NivelEducacao.MESTRADO, NivelEducacao.GRADUACAO)).toBe(true);
      expect(atendeEducacaoMinima(NivelEducacao.DOUTORADO, NivelEducacao.MEDIO)).toBe(true);
    });

    it('deve reprovar quando o candidato tem nível inferior ao exigido ou não informado', () => {
      expect(atendeEducacaoMinima(NivelEducacao.MEDIO, NivelEducacao.GRADUACAO)).toBe(false);
      expect(atendeEducacaoMinima(NivelEducacao.FUNDAMENTAL, NivelEducacao.MEDIO)).toBe(false);
      expect(atendeEducacaoMinima(null, NivelEducacao.FUNDAMENTAL)).toBe(false);
      expect(atendeEducacaoMinima(undefined, NivelEducacao.MEDIO)).toBe(false);
    });
  });

  // ===========================================================================
  // Testes do método filtrarCandidatos
  // ===========================================================================
  describe('filtrarCandidatos (RN05)', () => {
    const oportunidadeId = 'op-123';

    it('deve considerar todos os candidatos como aptos caso a oportunidade não possua critérios de funil cadastrados', async () => {
      mockPrisma.oportunidade.findUnique.mockResolvedValue({
        id: oportunidadeId,
        title: 'Mutirão de Limpeza do Rio',
        criteriosFunil: null, // Sem critérios
      });

      mockPrisma.candidatura.findMany.mockResolvedValue([
        {
          id: 'cand-1',
          perfilId: 'perfil-1',
          experienciaNaArea: false,
          perfil: {
            educacaoNivel: NivelEducacao.FUNDAMENTAL,
            outros: null,
            user: { name: 'João Silva', email: 'joao@email.com' },
            interesses: [],
          },
        },
        {
          id: 'cand-2',
          perfilId: 'perfil-2',
          experienciaNaArea: true,
          perfil: {
            educacaoNivel: NivelEducacao.GRADUACAO,
            outros: 'Primeiros socorros',
            user: { name: 'Maria Souza', email: 'maria@email.com' },
            interesses: [{ categoria: { nome: 'Meio Ambiente' } }],
          },
        },
      ]);

      const resultados = await service.filtrarCandidatos(oportunidadeId);

      expect(resultados).toHaveLength(2);
      expect(resultados[0].apto).toBe(true);
      expect(resultados[0].motivos).toHaveLength(0);
      expect(resultados[1].apto).toBe(true);
      expect(resultados[1].motivos).toHaveLength(0);
    });

    it('deve filtrar candidatos reprovando quem não possui experiência quando exigeExperiencia = true', async () => {
      mockPrisma.oportunidade.findUnique.mockResolvedValue({
        id: oportunidadeId,
        title: 'Manejo de Fauna Silvestre',
        criteriosFunil: {
          exigeExperiencia: true,
          educacaoMinima: null,
          habilidadesExigidas: null,
        },
      });

      mockPrisma.candidatura.findMany.mockResolvedValue([
        {
          id: 'cand-sem-exp',
          perfilId: 'perfil-1',
          experienciaNaArea: false, // NÃO possui experiência
          perfil: {
            educacaoNivel: NivelEducacao.GRADUACAO,
            outros: '',
            user: { name: 'Candidato Sem Experiência', email: 'sem@exp.com' },
            interesses: [],
          },
        },
        {
          id: 'cand-com-exp',
          perfilId: 'perfil-2',
          experienciaNaArea: true, // POSSUI experiência
          perfil: {
            educacaoNivel: NivelEducacao.MEDIO,
            outros: '',
            user: { name: 'Candidato Com Experiência', email: 'com@exp.com' },
            interesses: [],
          },
        },
      ]);

      const resultados = await service.filtrarCandidatos(oportunidadeId);

      const semExp = resultados.find((r) => r.candidaturaId === 'cand-sem-exp')!;
      const comExp = resultados.find((r) => r.candidaturaId === 'cand-com-exp')!;

      expect(semExp.apto).toBe(false);
      expect(semExp.motivos).toContain('Não possui experiência na área (exigida pelo gestor).');

      expect(comExp.apto).toBe(true);
      expect(comExp.motivos).toHaveLength(0);
    });

    it('deve filtrar candidatos reprovando quem não atinge o nível mínimo de escolaridade', async () => {
      mockPrisma.oportunidade.findUnique.mockResolvedValue({
        id: oportunidadeId,
        title: 'Pesquisa Botânica',
        criteriosFunil: {
          exigeExperiencia: false,
          educacaoMinima: NivelEducacao.GRADUACAO,
          habilidadesExigidas: null,
        },
      });

      mockPrisma.candidatura.findMany.mockResolvedValue([
        {
          id: 'cand-medio',
          perfilId: 'perfil-1',
          experienciaNaArea: true,
          perfil: {
            educacaoNivel: NivelEducacao.MEDIO, // Inferior a GRADUACAO
            outros: '',
            user: { name: 'Ana Nível Médio', email: 'ana@email.com' },
            interesses: [],
          },
        },
        {
          id: 'cand-mestrado',
          perfilId: 'perfil-2',
          experienciaNaArea: false,
          perfil: {
            educacaoNivel: NivelEducacao.MESTRADO, // Superior a GRADUACAO
            outros: '',
            user: { name: 'Lucas Mestrado', email: 'lucas@email.com' },
            interesses: [],
          },
        },
      ]);

      const resultados = await service.filtrarCandidatos(oportunidadeId);

      const ana = resultados.find((r) => r.candidaturaId === 'cand-medio')!;
      const lucas = resultados.find((r) => r.candidaturaId === 'cand-mestrado')!;

      expect(ana.apto).toBe(false);
      expect(ana.motivos[0]).toContain('Nível de educação insuficiente');
      expect(ana.motivos[0]).toContain('GRADUACAO');

      expect(lucas.apto).toBe(true);
    });

    it('deve filtrar candidatos pelas tags/habilidades exigidas tanto nos interesses quanto no campo outros', async () => {
      mockPrisma.oportunidade.findUnique.mockResolvedValue({
        id: oportunidadeId,
        title: 'Oficina Agroecológica',
        criteriosFunil: {
          exigeExperiencia: false,
          educacaoMinima: null,
          habilidadesExigidas: JSON.stringify(['Agroecologia', 'Compostagem']),
        },
      });

      mockPrisma.candidatura.findMany.mockResolvedValue([
        {
          id: 'cand-completo',
          perfilId: 'p-1',
          experienciaNaArea: false,
          perfil: {
            educacaoNivel: NivelEducacao.GRADUACAO,
            outros: 'Prática em compostagem e minhocário', // Tem compostagem aqui
            user: { name: 'Clara Silva', email: 'clara@email.com' },
            interesses: [{ categoria: { nome: 'Agroecologia Comunitária' } }], // Tem agroecologia aqui
          },
        },
        {
          id: 'cand-incompleto',
          perfilId: 'p-2',
          experienciaNaArea: false,
          perfil: {
            educacaoNivel: NivelEducacao.GRADUACAO,
            outros: 'Fotografia da natureza',
            user: { name: 'Bruno Dias', email: 'bruno@email.com' },
            interesses: [{ categoria: { nome: 'Artesanato' } }],
          },
        },
      ]);

      const resultados = await service.filtrarCandidatos(oportunidadeId);

      const clara = resultados.find((r) => r.candidaturaId === 'cand-completo')!;
      const bruno = resultados.find((r) => r.candidaturaId === 'cand-incompleto')!;

      expect(clara.apto).toBe(true);
      expect(clara.motivos).toHaveLength(0);

      expect(bruno.apto).toBe(false);
      expect(bruno.motivos[0]).toContain('Habilidades não atendidas: Agroecologia, Compostagem');
    });

    it('deve acumular todos os motivos de reprovação quando o candidato falhar em múltiplos critérios', async () => {
      mockPrisma.oportunidade.findUnique.mockResolvedValue({
        id: oportunidadeId,
        title: 'Coordenação Científica de Campo',
        criteriosFunil: {
          exigeExperiencia: true,
          educacaoMinima: NivelEducacao.POS_GRADUACAO,
          habilidadesExigidas: JSON.stringify(['Geoprocessamento']),
        },
      });

      mockPrisma.candidatura.findMany.mockResolvedValue([
        {
          id: 'cand-falha-tudo',
          perfilId: 'p-1',
          experienciaNaArea: false, // Falha 1
          perfil: {
            educacaoNivel: NivelEducacao.MEDIO, // Falha 2
            outros: 'Sem dados', // Falha 3
            user: { name: 'João Totalmente Inapto', email: 'inapto@email.com' },
            interesses: [],
          },
        },
      ]);

      const resultados = await service.filtrarCandidatos(oportunidadeId);
      const falha = resultados[0];

      expect(falha.apto).toBe(false);
      expect(falha.motivos).toHaveLength(3);
      expect(falha.motivos[0]).toContain('Não possui experiência na área');
      expect(falha.motivos[1]).toContain('Nível de educação insuficiente');
      expect(falha.motivos[2]).toContain('Habilidades não atendidas: Geoprocessamento');
    });

    it('deve lançar NotFoundException (404) quando a oportunidade não for encontrada', async () => {
      mockPrisma.oportunidade.findUnique.mockResolvedValue(null);

      await expect(service.filtrarCandidatos('id-inexistente')).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });
});
