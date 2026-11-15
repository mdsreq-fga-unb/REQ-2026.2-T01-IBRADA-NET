import { BadRequestException, NotFoundException } from '@nestjs/common';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ExperienciasService } from '../experiencias.service.js';
import { CreateExperienciaDto } from '../dto/create-experiencia.dto.js';

const mockPrisma = {
  experiencia: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
  },
};

const resetMockPrisma = () => {
  mockPrisma.experiencia.findMany.mockReset();
  mockPrisma.experiencia.findUnique.mockReset();
  mockPrisma.experiencia.create.mockReset();
  mockPrisma.experiencia.update.mockReset();
};

describe('ExperienciasService (US02, US03, US11, US12)', () => {
  let service: ExperienciasService;

  beforeEach(() => {
    resetMockPrisma();
    service = new ExperienciasService(mockPrisma as never);
  });

  describe('findAllPublic (US02 - Catálogo)', () => {
    it('deve listar experiências sinalizando vagas disponíveis, indisponibilidade e formatos monetários', async () => {
      mockPrisma.experiencia.findMany.mockResolvedValue([
        {
          id: 'exp-1',
          slug: 'trilha-do-sol',
          title: 'Trilha do Sol',
          description: 'Caminhada ecológica',
          itinerary: 'Saída às 8h',
          price: '150.00',
          startsAt: new Date('2026-12-01T08:00:00Z'),
          endsAt: new Date('2026-12-01T17:00:00Z'),
          capacity: 10,
          isAvailable: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'exp-2',
          slug: 'cachoeira-esgotada',
          title: 'Cachoeira Esgotada',
          description: 'Banho de rio',
          itinerary: null,
          price: '80.00',
          startsAt: new Date('2026-12-05T09:00:00Z'),
          endsAt: new Date('2026-12-05T15:00:00Z'),
          capacity: 0,
          isAvailable: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);

      const result = await service.findAllPublic();

      expect(result).toHaveLength(2);
      expect(result[0].availableSeats).toBe(10);
      expect(result[0].isSoldOut).toBe(false);
      expect(result[0].isAvailable).toBe(true);
      expect(result[0].price).toBe(150);
      expect(result[0].priceDecimal).toBe('150.00');
      expect(result[0].priceCents).toBe(15000);
      expect(result[0].priceFormatted).toBe('R$ 150,00');

      expect(result[1].availableSeats).toBe(0);
      expect(result[1].isSoldOut).toBe(true);
      expect(result[1].isAvailable).toBe(false);
      expect(result[1].priceCents).toBe(8000);
    });
  });

  describe('findBySlug (US03 - Detalhes do pacote)', () => {
    it('deve retornar os detalhes do pacote pelo slug com representação monetária completa', async () => {
      mockPrisma.experiencia.findUnique.mockResolvedValue({
        id: 'exp-1',
        slug: 'vivencia-quilombola',
        title: 'Vivência Quilombola',
        description: 'Imersão cultural com a comunidade',
        itinerary: 'Visita à horta, almoço típico e roda de conversa',
        price: '200.00',
        startsAt: new Date('2026-12-10T08:00:00Z'),
        endsAt: new Date('2026-12-10T18:00:00Z'),
        capacity: 15,
        isAvailable: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await service.findBySlug('vivencia-quilombola');

      expect(result.slug).toBe('vivencia-quilombola');
      expect(result.itinerary).toBe('Visita à horta, almoço típico e roda de conversa');
      expect(result.availableSeats).toBe(15);
      expect(result.isSoldOut).toBe(false);
      expect(result.priceDecimal).toBe('200.00');
      expect(result.priceCents).toBe(20000);
      expect(result.priceFormatted).toBe('R$ 200,00');
    });

    it('deve lançar NotFoundException (404) quando o slug não existir', async () => {
      mockPrisma.experiencia.findUnique.mockResolvedValue(null);

      await expect(service.findBySlug('slug-inexistente')).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });

  describe('create (US11 - Cadastro de experiência)', () => {
    const validDto: CreateExperienciaDto = {
      title: 'Passeio Histórico & Botânico',
      description: 'Conhecendo a flora e a história local',
      itinerary: 'Ponto de encontro na praça central',
      price: 120.5,
      startsAt: '2026-12-01T08:00:00.000Z',
      endsAt: '2026-12-01T18:00:00.000Z',
      capacity: 20,
      isAvailable: true,
    };

    it('deve cadastrar uma experiência com sucesso repassando string decimal exata ao Prisma', async () => {
      mockPrisma.experiencia.findUnique.mockResolvedValue(null);
      mockPrisma.experiencia.create.mockResolvedValue({
        id: 'exp-novo',
        slug: 'passeio-historico-botanico',
        title: validDto.title,
        description: validDto.description,
        itinerary: validDto.itinerary,
        price: '120.50',
        startsAt: new Date(validDto.startsAt),
        endsAt: new Date(validDto.endsAt),
        capacity: 20,
        isAvailable: true,
      });

      const response = await service.create(validDto);

      expect(response.message).toBe('Experiência cadastrada com sucesso!');
      expect(mockPrisma.experiencia.create).toHaveBeenCalledWith({
        data: {
          title: validDto.title,
          slug: 'passeio-historico-botanico',
          description: validDto.description,
          itinerary: validDto.itinerary,
          price: '120.50', // Enviado como string decimal exata para DECIMAL(10, 2)
          startsAt: new Date(validDto.startsAt),
          endsAt: new Date(validDto.endsAt),
          capacity: 20,
          isAvailable: true,
        },
      });
      expect(response.data.priceCents).toBe(12050);
      expect(response.data.priceFormatted).toBe('R$ 120,50');
    });

    it('deve aceitar preço em string brasileira com vírgula ("150,50")', async () => {
      mockPrisma.experiencia.findUnique.mockResolvedValue(null);
      mockPrisma.experiencia.create.mockResolvedValue({
        id: 'exp-br',
        slug: 'passeio-historico-botanico',
        title: validDto.title,
        price: '150.50',
        startsAt: new Date(validDto.startsAt),
        endsAt: new Date(validDto.endsAt),
        capacity: 20,
        isAvailable: true,
      });

      const dtoComVirgula = { ...validDto, price: '150,50' };
      const response = await service.create(dtoComVirgula);

      expect(mockPrisma.experiencia.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ price: '150.50' }),
        }),
      );
      expect(response.data.priceCents).toBe(15050);
    });

    it('deve tratar número float IEEE 754 perigoso (19.99) com exatidão sem perder 1 centavo', async () => {
      mockPrisma.experiencia.findUnique.mockResolvedValue(null);
      mockPrisma.experiencia.create.mockResolvedValue({
        id: 'exp-float',
        slug: 'passeio-historico-botanico',
        title: validDto.title,
        price: '19.99',
        startsAt: new Date(validDto.startsAt),
        endsAt: new Date(validDto.endsAt),
        capacity: 20,
        isAvailable: true,
      });

      const dtoFloat = { ...validDto, price: 19.99 };
      const response = await service.create(dtoFloat);

      expect(mockPrisma.experiencia.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ price: '19.99' }),
        }),
      );
      expect(response.data.priceCents).toBe(1999);
      expect(response.data.priceFormatted).toBe('R$ 19,99');
    });

    it('deve resolver colisão de slug adicionando sufixo numérico', async () => {
      mockPrisma.experiencia.findUnique
        .mockResolvedValueOnce({ id: 'exp-antiga' })
        .mockResolvedValueOnce(null);

      mockPrisma.experiencia.create.mockResolvedValue({
        id: 'exp-novo',
        slug: 'passeio-historico-botanico-2',
        title: validDto.title,
        price: '120.50',
        startsAt: new Date(validDto.startsAt),
        endsAt: new Date(validDto.endsAt),
        capacity: 20,
        isAvailable: true,
      });

      await service.create(validDto);

      expect(mockPrisma.experiencia.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            slug: 'passeio-historico-botanico-2',
          }),
        }),
      );
    });

    it('deve tentar de novo com o próximo sufixo quando o banco rejeitar o slug (P2002)', async () => {
      mockPrisma.experiencia.findUnique.mockResolvedValue(null);
      mockPrisma.experiencia.create
        .mockRejectedValueOnce({ code: 'P2002' })
        .mockResolvedValueOnce({
          id: 'exp-novo',
          slug: 'passeio-historico-botanico-2',
          title: validDto.title,
          price: '120.50',
          startsAt: new Date(validDto.startsAt),
          endsAt: new Date(validDto.endsAt),
          capacity: 20,
          isAvailable: true,
        });

      const response = await service.create(validDto);

      expect(mockPrisma.experiencia.create).toHaveBeenCalledTimes(2);
      expect(mockPrisma.experiencia.create).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          data: expect.objectContaining({ slug: 'passeio-historico-botanico' }),
        }),
      );
      expect(mockPrisma.experiencia.create).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({
          data: expect.objectContaining({ slug: 'passeio-historico-botanico-2' }),
        }),
      );
      expect(response.data.slug).toBe('passeio-historico-botanico-2');
    });

    it('deve propagar erros do banco que não sejam de slug duplicado', async () => {
      mockPrisma.experiencia.findUnique.mockResolvedValue(null);
      mockPrisma.experiencia.create.mockRejectedValue(new Error('falha de conexão'));

      await expect(service.create(validDto)).rejects.toThrow('falha de conexão');
      expect(mockPrisma.experiencia.create).toHaveBeenCalledTimes(1);
    });

    it('deve lançar BadRequestException se endsAt <= startsAt', async () => {
      const invalidDatesDto: CreateExperienciaDto = {
        ...validDto,
        startsAt: '2026-12-02T10:00:00.000Z',
        endsAt: '2026-12-01T10:00:00.000Z',
      };

      await expect(service.create(invalidDatesDto)).rejects.toBeInstanceOf(
        BadRequestException,
      );
      expect(mockPrisma.experiencia.create).not.toHaveBeenCalled();
    });

    it('deve lançar BadRequestException se capacity for <= 0', async () => {
      const invalidCapacityDto: CreateExperienciaDto = {
        ...validDto,
        capacity: 0,
      };

      await expect(service.create(invalidCapacityDto)).rejects.toBeInstanceOf(
        BadRequestException,
      );
      expect(mockPrisma.experiencia.create).not.toHaveBeenCalled();
    });
  });

  describe('updateDisponibilidade (US12 - Controle de disponibilidade)', () => {
    it('deve alterar a disponibilidade de um pacote com sucesso', async () => {
      mockPrisma.experiencia.findUnique.mockResolvedValue({
        id: 'exp-1',
        title: 'Trilha da Lua',
        isAvailable: true,
      });

      mockPrisma.experiencia.update.mockResolvedValue({
        id: 'exp-1',
        title: 'Trilha da Lua',
        isAvailable: false,
        price: '100.00',
      });

      const result = await service.updateDisponibilidade('exp-1', { isAvailable: false });

      expect(result.message).toContain('indisponível');
      expect(mockPrisma.experiencia.update).toHaveBeenCalledWith({
        where: { id: 'exp-1' },
        data: { isAvailable: false },
      });
      expect(result.data.isAvailable).toBe(false);
      expect(result.data.priceCents).toBe(10000);
      expect(result.data.priceFormatted).toBe('R$ 100,00');
    });

    it('deve lançar NotFoundException ao tentar alterar experiência inexistente', async () => {
      mockPrisma.experiencia.findUnique.mockResolvedValue(null);

      await expect(
        service.updateDisponibilidade('id-invalido', { isAvailable: false }),
      ).rejects.toBeInstanceOf(NotFoundException);

      expect(mockPrisma.experiencia.update).not.toHaveBeenCalled();
    });
  });
});
