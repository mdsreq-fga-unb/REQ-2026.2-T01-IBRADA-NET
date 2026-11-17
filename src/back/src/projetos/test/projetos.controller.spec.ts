import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ProjetosController } from '../projetos.controller.js';
import { ProjetosService } from '../projetos.service.js';
import { CreateProjetoDto } from '../dto/create-projeto.dto.js';

describe('ProjetosController (Módulo Projetos Mínimo)', () => {
  let controller: ProjetosController;
  let service: ProjetosService;

  const mockService = {
    findAll: vi.fn(),
    findById: vi.fn(),
    create: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    service = mockService as unknown as ProjetosService;
    controller = new ProjetosController(service);
  });

  describe('findAll', () => {
    it('deve chamar service.findAll e retornar a lista de projetos', async () => {
      mockService.findAll.mockResolvedValue([
        { id: 'proj-1', title: 'Projeto 1' },
      ]);

      const result = await controller.findAll();

      expect(mockService.findAll).toHaveBeenCalledTimes(1);
      expect(result).toHaveLength(1);
    });
  });

  describe('findById', () => {
    it('deve chamar service.findById com o ID recebido', async () => {
      mockService.findById.mockResolvedValue({ id: 'proj-1', title: 'Projeto 1' });

      const result = await controller.findById('proj-1');

      expect(mockService.findById).toHaveBeenCalledWith('proj-1');
      expect(result.id).toBe('proj-1');
    });
  });

  describe('create', () => {
    it('deve chamar service.create com o DTO recebido', async () => {
      const dto: CreateProjetoDto = {
        title: 'Novo Projeto',
        description: 'Descrição do projeto',
      };

      mockService.create.mockResolvedValue({
        message: 'Projeto cadastrado com sucesso!',
        data: { id: 'proj-1', ...dto },
      });

      const result = await controller.create(dto);

      expect(mockService.create).toHaveBeenCalledWith(dto);
      expect(result.message).toContain('cadastrado com sucesso');
    });
  });
});
