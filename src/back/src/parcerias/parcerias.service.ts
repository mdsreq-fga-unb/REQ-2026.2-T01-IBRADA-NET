import {
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreatePedidoParceriaDto } from './dto/create-pedido-parceria.dto.js';
import {
  PartnershipStatus,
  UpdateStatusParceriaDto,
} from './dto/update-status-parceria.dto.js';

@Injectable()
export class ParceriasService {
  private readonly logger = new Logger(ParceriasService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * US19: Envio de proposta de parceria por representante de organização.
   * Rota pública (sem autenticação). Salva a proposta com status inicial 'RECEIVED' (Nova Solicitação).
   */
  async create(dto: CreatePedidoParceriaDto) {
    const pedido = await this.prisma.pedidoParceria.create({
      data: {
        organization: dto.organization.trim(),
        cnpj: dto.cnpj?.trim() || null,
        contactName: dto.contactName.trim(),
        contactEmail: dto.contactEmail.trim(),
        contactPhone: dto.contactPhone?.trim() || null,
        proposal: dto.proposal.trim(),
        status: PartnershipStatus.RECEIVED,
      },
    });

    this.logger.log(
      `Nova solicitação de parceria recebida: Organização "${pedido.organization}" (ID: ${pedido.id})`,
    );

    return {
      message: 'Sua solicitação de parceria foi enviada com sucesso! Nossa equipe entrará em contato.',
      data: pedido,
    };
  }

  /**
   * US20: Visualizar lista de todas as solicitações de parceria.
   * Rota restrita ao gestor do IBRADA. Ordena das mais recentes para as mais antigas.
   */
  async findAll() {
    return this.prisma.pedidoParceria.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * US20: Visualizar detalhes completos de uma solicitação de parceria pelo ID.
   * Rota restrita ao gestor. Permite analisar identificação, contato e proposta na íntegra.
   */
  async findById(id: string) {
    const pedido = await this.prisma.pedidoParceria.findUnique({
      where: { id },
    });

    if (!pedido) {
      throw new NotFoundException(`Solicitação de parceria com ID '${id}' não encontrada.`);
    }

    return pedido;
  }

  /**
   * US20 (Critério de acompanhamento): Gestor altera o status da proposta
   * para manter o controle interno (ex: RECEIVED -> IN_ANALYSIS -> ACCEPTED / DECLINED).
   */
  async updateStatus(id: string, dto: UpdateStatusParceriaDto) {
    const exists = await this.prisma.pedidoParceria.findUnique({
      where: { id },
    });

    if (!exists) {
      throw new NotFoundException(`Solicitação de parceria com ID '${id}' não encontrada.`);
    }

    const updated = await this.prisma.pedidoParceria.update({
      where: { id },
      data: { status: dto.status },
    });

    this.logger.log(
      `Status da parceria '${updated.organization}' (ID: ${id}) alterado para: ${updated.status}`,
    );

    return {
      message: `Status da solicitação alterado para ${updated.status} com sucesso!`,
      data: updated,
    };
  }
}
