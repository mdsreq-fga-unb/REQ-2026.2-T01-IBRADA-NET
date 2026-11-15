import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ExperienciasController } from '../experiencias.controller.js';
import { ExperienciasService } from '../experiencias.service.js';
import { CreateExperienciaDto } from '../dto/create-experiencia.dto.js';
import { UpdateDisponibilidadeDto } from '../dto/update-disponibilidade.dto.js';

describe('ExperienciasController', () => {
  let controller: ExperienciasController;
  let service: ExperienciasService;

  const mockService = {
    findAllPublic: vi.fn(),
    findBySlug: vi.fn(),
    create: vi.fn(),
    updateDisponibilidade: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    service = mockService as unknown as ExperienciasService;
    controller = new ExperienciasController(service);
  });

  it('deve delegar chamada findAll para o service', async () => {
    mockService.findAllPublic.mockResolvedValue([{ id: 'exp-1', title: 'Trilha' }]);

    const result = await controller.findAll();

    expect(result).toHaveLength(1);
    expect(mockService.findAllPublic).toHaveBeenCalled();
  });

  it('deve delegar chamada findBySlug para o service com o slug correto', async () => {
    mockService.findBySlug.mockResolvedValue({ id: 'exp-1', slug: 'trilha' });

    const result = await controller.findBySlug('trilha');

    expect(result.slug).toBe('trilha');
    expect(mockService.findBySlug).toHaveBeenCalledWith('trilha');
  });

  it('deve delegar chamada create para o service com o dto correto', async () => {
    const dto: CreateExperienciaDto = {
      title: 'Passeio',
      description: 'Desc',
      itinerary: 'Roteiro',
      price: 50,
      startsAt: '2026-12-01T08:00:00Z',
      endsAt: '2026-12-01T12:00:00Z',
      capacity: 5,
      isAvailable: true,
    };
    mockService.create.mockResolvedValue({ message: 'Criado', data: dto });

    const result = await controller.create(dto);

    expect(result.message).toBe('Criado');
    expect(mockService.create).toHaveBeenCalledWith(dto);
  });

  it('deve delegar chamada updateDisponibilidade para o service com id e dto', async () => {
    const dto: UpdateDisponibilidadeDto = { isAvailable: false };
    mockService.updateDisponibilidade.mockResolvedValue({ message: 'Atualizado' });

    const result = await controller.updateDisponibilidade('exp-1', dto);

    expect(result.message).toBe('Atualizado');
    expect(mockService.updateDisponibilidade).toHaveBeenCalledWith('exp-1', dto);
  });
});
