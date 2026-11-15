import { BadRequestException, NotFoundException } from '@nestjs/common';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ProjetosService } from '../projetos.service.js';
import { CreateProjetoDto } from '../dto/create-projeto.dto.js';

const mockPrisma = {
  projeto: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
  },
};

const resetMockPrisma = () => {
  mockPrisma.projeto.findMany.mockReset();
  mockPrisma.projeto.findUnique.mockReset();
  mockPrisma.projeto.create.mockReset();
};

describe('ProjetosService (Módulo Projetos Mínimo)', () => {
  let service: ProjetosService;

  beforeEach(() => {
    resetMockPrisma();
    service = new ProjetosService(mockPrisma as never);
  });

  describe('findAll (Listagem para Gestor)', () => {
    it('deve listar todos os projetos ordenados por data de criação desc', async () => {
      mockPrisma.projeto.findMany.mockResolvedValue([
        {
          id: 'proj-1',
          title: 'Restauração da Mata Atlântica',
          description: 'Plantio de mudas nativas',
          startDate: new Date('2026-01-01'),
          endDate: new Date('2026-12-31'),
          createdAt: new Date('2026-11-10'),
        },
        {
          id: 'proj-2',
          title: 'Educação Ambiental nas Escolas',
          description: 'Palestras para jovens',
          startDate: null,
          endDate: null,
          createdAt: new Date('2026-11-01'),
        },
      ]);

      const result = await service.findAll();

      expect(result).toHaveLength(2);
      expect(result[0].title).toBe('Restauração da Mata Atlântica');
      expect(mockPrisma.projeto.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          description: true,
          startDate: true,
          endDate: true,
          createdAt: true,
        },
      });
    });
  });

  describe('findById (Busca por ID)', () => {
    it('deve retornar o projeto correspondente ao ID informado', async () => {
      const mockProj = {
        id: 'proj-1',
        title: 'Horta Comunitária',
        description: 'Cultivo agroecológico',
        startDate: new Date('2026-03-01'),
        endDate: null,
      };
      mockPrisma.projeto.findUnique.mockResolvedValue(mockProj);

      const result = await service.findById('proj-1');

      expect(result).toEqual(mockProj);
      expect(mockPrisma.projeto.findUnique).toHaveBeenCalledWith({
        where: { id: 'proj-1' },
      });
    });

    it('deve lançar NotFoundException quando o projeto não for encontrado', async () => {
      mockPrisma.projeto.findUnique.mockResolvedValue(null);

      await expect(service.findById('id-inexistente')).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });

  describe('create (Cadastro de Projeto pelo Gestor)', () => {
    const validDto: CreateProjetoDto = {
      title: 'Preservação de Nascentes',
      description: 'Mapeamento e cercamento de áreas de preservação permanente.',
      startDate: '2026-05-01T00:00:00.000Z',
      endDate: '2026-11-30T00:00:00.000Z',
    };

    it('deve cadastrar um projeto com sucesso quando os dados forem válidos', async () => {
      mockPrisma.projeto.create.mockResolvedValue({
        id: 'proj-criado',
        title: validDto.title,
        description: validDto.description,
        startDate: new Date(validDto.startDate!),
        endDate: new Date(validDto.endDate!),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const response = await service.create(validDto);

      expect(response.message).toContain('cadastrado com sucesso');
      expect(response.data.title).toBe(validDto.title);
      expect(mockPrisma.projeto.create).toHaveBeenCalledWith({
        data: {
          title: validDto.title,
          description: validDto.description,
          startDate: new Date(validDto.startDate!),
          endDate: new Date(validDto.endDate!),
        },
      });
    });

    it('deve permitir cadastro sem datas de início e término', async () => {
      const dtoSemDatas: CreateProjetoDto = {
        title: 'Projeto Contínuo',
        description: 'Ação permanente de apoio comunitário.',
      };

      mockPrisma.projeto.create.mockResolvedValue({
        id: 'proj-continuo',
        title: dtoSemDatas.title,
        description: dtoSemDatas.description,
        startDate: null,
        endDate: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const response = await service.create(dtoSemDatas);

      expect(response.data.startDate).toBeNull();
      expect(mockPrisma.projeto.create).toHaveBeenCalledWith({
        data: {
          title: dtoSemDatas.title,
          description: dtoSemDatas.description,
          startDate: null,
          endDate: null,
        },
      });
    });

    it('deve lançar BadRequestException se endDate for anterior ou igual a startDate', async () => {
      const datasInvalidasDto: CreateProjetoDto = {
        title: 'Projeto Datas Invertidas',
        description: 'Datas erradas',
        startDate: '2026-10-01T00:00:00.000Z',
        endDate: '2026-09-01T00:00:00.000Z',
      };

      await expect(service.create(datasInvalidasDto)).rejects.toBeInstanceOf(
        BadRequestException,
      );
      expect(mockPrisma.projeto.create).not.toHaveBeenCalled();
    });
  });
});
