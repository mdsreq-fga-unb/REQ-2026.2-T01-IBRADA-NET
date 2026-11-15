import { NotFoundException } from '@nestjs/common';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ParceriasService } from '../parcerias.service.js';
import { CreatePedidoParceriaDto } from '../dto/create-pedido-parceria.dto.js';
import { PartnershipStatus } from '../dto/update-status-parceria.dto.js';

const mockPrisma = {
  pedidoParceria: {
    create: vi.fn(),
    findMany: vi.fn(),
    findUnique: vi.fn(),
    update: vi.fn(),
  },
};

const resetMockPrisma = () => {
  mockPrisma.pedidoParceria.create.mockReset();
  mockPrisma.pedidoParceria.findMany.mockReset();
  mockPrisma.pedidoParceria.findUnique.mockReset();
  mockPrisma.pedidoParceria.update.mockReset();
};

describe('ParceriasService (US19, US20)', () => {
  let service: ParceriasService;

  beforeEach(() => {
    resetMockPrisma();
    service = new ParceriasService(mockPrisma as never);
  });

  describe('create (US19 - Envio público de parceria)', () => {
    it('deve registrar uma solicitação de parceria com status RECEIVED', async () => {
      const dto: CreatePedidoParceriaDto = {
        organization: 'Instituto Terra Viva',
        contactName: 'Carlos Silva',
        contactEmail: 'carlos@terraviva.org',
        contactPhone: '(61) 98765-4321',
        proposal: 'Gostaríamos de propor oficinas de sustentabilidade comunitária.',
      };

      mockPrisma.pedidoParceria.create.mockResolvedValue({
        id: 'parceria-1',
        ...dto,
        status: PartnershipStatus.RECEIVED,
        createdAt: new Date(),
      });

      const response = await service.create(dto);

      expect(response.message).toContain('enviada com sucesso');
      expect(mockPrisma.pedidoParceria.create).toHaveBeenCalledWith({
        data: {
          organization: 'Instituto Terra Viva',
          contactName: 'Carlos Silva',
          contactEmail: 'carlos@terraviva.org',
          contactPhone: '(61) 98765-4321',
          proposal: 'Gostaríamos de propor oficinas de sustentabilidade comunitária.',
          status: PartnershipStatus.RECEIVED,
        },
      });
      expect(response.data.status).toBe(PartnershipStatus.RECEIVED);
    });

    it('deve formatar e incluir o CNPJ no texto da proposta quando fornecido', async () => {
      const dtoComCnpj: CreatePedidoParceriaDto = {
        organization: 'Empresa Verde S.A.',
        cnpj: '12.345.678/0001-90',
        contactName: 'Mariana Costa',
        contactEmail: 'mariana@empresa.com',
        proposal: 'Proposta de apoio financeiro e capacitação.',
      };

      mockPrisma.pedidoParceria.create.mockResolvedValue({
        id: 'parceria-2',
        ...dtoComCnpj,
        proposal: `[CNPJ: 12.345.678/0001-90]\n\nProposta de apoio financeiro e capacitação.`,
        status: PartnershipStatus.RECEIVED,
        createdAt: new Date(),
      });

      await service.create(dtoComCnpj);

      expect(mockPrisma.pedidoParceria.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            proposal: expect.stringContaining('[CNPJ: 12.345.678/0001-90]'),
          }),
        }),
      );
    });
  });

  describe('findAll (US20 - Listagem para gestor)', () => {
    it('deve listar todas as parcerias ordenadas por data de criação decrescente', async () => {
      mockPrisma.pedidoParceria.findMany.mockResolvedValue([
        {
          id: 'p-1',
          organization: 'Org Recente',
          contactName: 'Alice',
          contactEmail: 'alice@org.com',
          status: PartnershipStatus.RECEIVED,
          createdAt: new Date('2026-11-14'),
        },
        {
          id: 'p-2',
          organization: 'Org Antiga',
          contactName: 'Bob',
          contactEmail: 'bob@org.com',
          status: PartnershipStatus.IN_ANALYSIS,
          createdAt: new Date('2026-11-10'),
        },
      ]);

      const list = await service.findAll();

      expect(list).toHaveLength(2);
      expect(mockPrisma.pedidoParceria.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: 'desc' },
      });
    });
  });

  describe('findById (US20 - Detalhes da parceria)', () => {
    it('deve retornar os detalhes de uma proposta de parceria pelo ID', async () => {
      const mockParceria = {
        id: 'p-1',
        organization: 'EcoAção',
        contactName: 'Fernanda',
        contactEmail: 'fernanda@ecoacao.org',
        contactPhone: '6199999999',
        proposal: 'Projeto de reflorestamento conjunto.',
        status: PartnershipStatus.RECEIVED,
        createdAt: new Date(),
      };
      mockPrisma.pedidoParceria.findUnique.mockResolvedValue(mockParceria);

      const result = await service.findById('p-1');

      expect(result).toEqual(mockParceria);
      expect(mockPrisma.pedidoParceria.findUnique).toHaveBeenCalledWith({
        where: { id: 'p-1' },
      });
    });

    it('deve lançar NotFoundException (404) quando o ID não for encontrado', async () => {
      mockPrisma.pedidoParceria.findUnique.mockResolvedValue(null);

      await expect(service.findById('id-inexistente')).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });

  describe('updateStatus (US20 - Acompanhamento do funil pelo gestor)', () => {
    it('deve atualizar o status da parceria com sucesso', async () => {
      mockPrisma.pedidoParceria.findUnique.mockResolvedValue({
        id: 'p-1',
        organization: 'BioPlan',
        status: PartnershipStatus.RECEIVED,
      });

      mockPrisma.pedidoParceria.update.mockResolvedValue({
        id: 'p-1',
        organization: 'BioPlan',
        status: PartnershipStatus.IN_ANALYSIS,
      });

      const result = await service.updateStatus('p-1', {
        status: PartnershipStatus.IN_ANALYSIS,
      });

      expect(result.message).toContain('IN_ANALYSIS');
      expect(mockPrisma.pedidoParceria.update).toHaveBeenCalledWith({
        where: { id: 'p-1' },
        data: { status: PartnershipStatus.IN_ANALYSIS },
      });
      expect(result.data.status).toBe(PartnershipStatus.IN_ANALYSIS);
    });

    it('deve lançar NotFoundException ao tentar alterar status de parceria inexistente', async () => {
      mockPrisma.pedidoParceria.findUnique.mockResolvedValue(null);

      await expect(
        service.updateStatus('id-inexistente', { status: PartnershipStatus.ACCEPTED }),
      ).rejects.toBeInstanceOf(NotFoundException);

      expect(mockPrisma.pedidoParceria.update).not.toHaveBeenCalled();
    });
  });
});
