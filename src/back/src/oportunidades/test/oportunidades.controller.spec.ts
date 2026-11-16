import { beforeEach, describe, expect, it, vi } from 'vitest';
import { OportunidadesController } from '../oportunidades.controller.js';
import { OportunidadesService } from '../oportunidades.service.js';
import { CreateOportunidadeDto } from '../dto/create-oportunidade.dto.js';
import { UpdateOportunidadeDto } from '../dto/update-oportunidade.dto.js';

describe('OportunidadesController (US13, US14, US21, RF19)', () => {
  let controller: OportunidadesController;
  let service: OportunidadesService;

  const mockService = {
    findAllOpen: vi.fn(),
    findAllForGestor: vi.fn(),
    findById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    service = mockService as unknown as OportunidadesService;
    controller = new OportunidadesController(service);
  });

  describe('findAllOpen (US21 - Rota pública)', () => {
    it('deve repassar filtros de categoriaId e busca textual ao service', async () => {
      mockService.findAllOpen.mockResolvedValue([
        { id: 'op-1', title: 'Guia de Trilha', duracao: '3 meses', disponibilidade: 'Finais de semana' },
      ]);

      const result = await controller.findAllOpen('cat-1', 'Trilha');

      expect(mockService.findAllOpen).toHaveBeenCalledWith({
        categoriaId: 'cat-1',
        busca: 'Trilha',
      });
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Guia de Trilha');
    });

    it('deve chamar sem filtros quando nenhum parâmetro for informado', async () => {
      mockService.findAllOpen.mockResolvedValue([]);

      await controller.findAllOpen(undefined, undefined);

      expect(mockService.findAllOpen).toHaveBeenCalledWith({
        categoriaId: undefined,
        busca: undefined,
      });
    });
  });

  describe('findAllForGestor (RF19 - Rota gestor)', () => {
    it('deve chamar service.findAllForGestor e devolver abertas e fechadas', async () => {
      mockService.findAllForGestor.mockResolvedValue([
        { id: 'op-1', title: 'Aberta', isOpen: true },
        { id: 'op-2', title: 'Fechada', isOpen: false },
      ]);

      const result = await controller.findAllForGestor();

      expect(mockService.findAllForGestor).toHaveBeenCalledTimes(1);
      expect(result).toHaveLength(2);
    });
  });

  describe('findById (US14 - Rota pública)', () => {
    it('deve chamar service.findById com o ID recebido nos parâmetros', async () => {
      mockService.findById.mockResolvedValue({
        id: 'op-1',
        title: 'Manejo de Trilha',
        atividades: 'Poda e manutenção',
        duracao: '3 meses',
        disponibilidade: 'Sábados',
        habilidades: ['Trilha'],
        aceitandoCandidaturas: true,
      });

      const result = await controller.findById('op-1');

      expect(mockService.findById).toHaveBeenCalledWith('op-1');
      expect(result.id).toBe('op-1');
      expect(result.aceitandoCandidaturas).toBe(true);
    });
  });

  describe('create (US13 - Rota gestor)', () => {
    it('deve chamar service.create com o DTO recebido no corpo da requisição', async () => {
      const dto: CreateOportunidadeDto = {
        title: 'Oficina de Educação Ambiental',
        description: 'Auxílio na aplicação de oficinas.',
        projetoId: 'proj-1',
        categoriaId: 'cat-1',
        duracao: '2 meses',
        disponibilidade: 'Manhãs de quarta',
        habilidades: ['Comunicação', 'Didática'],
      };

      mockService.create.mockResolvedValue({
        message: 'Oportunidade cadastrada com inscrições abertas com sucesso!',
        data: { id: 'op-1', ...dto },
      });

      const result = await controller.create(dto);

      expect(mockService.create).toHaveBeenCalledWith(dto);
      expect(result.message).toContain('inscrições abertas com sucesso');
    });
  });

  describe('update (RF19 - Rota gestor)', () => {
    it('deve chamar service.update com o id e o DTO de atualização', async () => {
      const dto: UpdateOportunidadeDto = {
        isOpen: false,
        duracao: '4 meses',
      };

      mockService.update.mockResolvedValue({
        message: 'Oportunidade atualizada com sucesso! Oportunidade fechada para novas candidaturas.',
        data: { id: 'op-1', isOpen: false, duracao: '4 meses' },
      });

      const result = await controller.update('op-1', dto);

      expect(mockService.update).toHaveBeenCalledWith('op-1', dto);
      expect(result.data.isOpen).toBe(false);
    });
  });
});
