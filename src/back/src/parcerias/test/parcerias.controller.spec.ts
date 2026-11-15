import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ParceriasController } from '../parcerias.controller.js';
import { ParceriasService } from '../parcerias.service.js';
import { CreatePedidoParceriaDto } from '../dto/create-pedido-parceria.dto.js';
import {
  PartnershipStatus,
  UpdateStatusParceriaDto,
} from '../dto/update-status-parceria.dto.js';

describe('ParceriasController', () => {
  let controller: ParceriasController;
  let service: ParceriasService;

  const mockService = {
    create: vi.fn(),
    findAll: vi.fn(),
    findById: vi.fn(),
    updateStatus: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    service = mockService as unknown as ParceriasService;
    controller = new ParceriasController(service);
  });

  it('deve delegar chamada create para o service', async () => {
    const dto: CreatePedidoParceriaDto = {
      organization: 'Org',
      contactName: 'Resp',
      contactEmail: 'resp@org.com',
      proposal: 'Proposta',
    };
    mockService.create.mockResolvedValue({ message: 'Criado', data: dto });

    const result = await controller.create(dto);

    expect(result.message).toBe('Criado');
    expect(mockService.create).toHaveBeenCalledWith(dto);
  });

  it('deve delegar chamada findAll para o service', async () => {
    mockService.findAll.mockResolvedValue([{ id: 'p-1', organization: 'Org' }]);

    const result = await controller.findAll();

    expect(result).toHaveLength(1);
    expect(mockService.findAll).toHaveBeenCalled();
  });

  it('deve delegar chamada findById para o service com o id correto', async () => {
    mockService.findById.mockResolvedValue({ id: 'p-1', organization: 'Org' });

    const result = await controller.findById('p-1');

    expect(result.id).toBe('p-1');
    expect(mockService.findById).toHaveBeenCalledWith('p-1');
  });

  it('deve delegar chamada updateStatus para o service com id e dto', async () => {
    const dto: UpdateStatusParceriaDto = { status: PartnershipStatus.ACCEPTED };
    mockService.updateStatus.mockResolvedValue({ message: 'Atualizado' });

    const result = await controller.updateStatus('p-1', dto);

    expect(result.message).toBe('Atualizado');
    expect(mockService.updateStatus).toHaveBeenCalledWith('p-1', dto);
  });
});
