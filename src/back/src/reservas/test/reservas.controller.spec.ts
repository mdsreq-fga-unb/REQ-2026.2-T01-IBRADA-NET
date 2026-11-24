import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ReservasController } from '../reservas.controller.js';
import { ReservasService } from '../reservas.service.js';
import { CreateReservaDto } from '../dto/create-reserva.dto.js';
import { IS_PUBLIC_KEY } from '../../auth/public.decorator.js';
import type { AuthenticatedRequest } from '../../auth/auth.types.js';

describe('ReservasController (US08)', () => {
  let controller: ReservasController;
  let service: ReservasService;

  const mockService = {
    create: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    service = mockService as unknown as ReservasService;
    controller = new ReservasController(service);
  });

  it('não deve marcar a rota nem o controller como @Public() (exige autenticação)', () => {
    const classIsPublic = Reflect.getMetadata(IS_PUBLIC_KEY, ReservasController);
    const createDescriptor = Object.getOwnPropertyDescriptor(
      ReservasController.prototype,
      'create',
    );
    const handlerIsPublic = Reflect.getMetadata(IS_PUBLIC_KEY, createDescriptor?.value);

    expect(classIsPublic).toBeUndefined();
    expect(handlerIsPublic).toBeUndefined();
  });

  it('deve delegar criação de reserva para ReservasService com user.sub e dto', async () => {
    const req = {
      user: {
        sub: 'user-123',
        email: 'cliente@exemplo.com',
        role: 'CLIENTE',
      },
    } as AuthenticatedRequest;

    const dto: CreateReservaDto = {
      experienceId: 'exp-1',
      seats: 2,
    };

    const expected = {
      message: 'Reserva criada com sucesso!',
      data: { id: 'booking-1', status: 'PENDING', seats: 2 },
    };
    mockService.create.mockResolvedValue(expected);

    const result = await controller.create(req, dto);

    expect(mockService.create).toHaveBeenCalledWith('user-123', dto);
    expect(result).toEqual(expected);
  });
});
