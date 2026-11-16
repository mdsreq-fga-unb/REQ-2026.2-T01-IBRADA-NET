import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateProjetoDto } from './dto/create-projeto.dto.js';

@Injectable()
export class ProjetosService {
  private readonly logger = new Logger(ProjetosService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Lista todos os projetos (gestor).
   * Retorna apenas id e título — o mínimo que o front precisa para
   * popular o select de "projeto associado" ao cadastrar oportunidade (US13).
   */
  async findAll() {
    this.logger.log('Listando todos os projetos');
    return this.prisma.projeto.findMany({
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
  }

  /**
   * Busca um projeto pelo ID.
   */
  async findById(id: string) {
    const projeto = await this.prisma.projeto.findUnique({ where: { id } });
    if (!projeto) {
      throw new NotFoundException(`Projeto com ID '${id}' não encontrado.`);
    }
    return projeto;
  }

  /**
   * Cria um novo projeto (gestor).
   */
  async create(dto: CreateProjetoDto) {
    // Validação: se ambas as datas forem informadas, endDate > startDate
    if (dto.startDate && dto.endDate) {
      const start = new Date(dto.startDate);
      const end = new Date(dto.endDate);
      if (end <= start) {
        throw new BadRequestException(
          'A data de término deve ser posterior à data de início.',
        );
      }
    }

    const projeto = await this.prisma.projeto.create({
      data: {
        title: dto.title,
        description: dto.description,
        startDate: dto.startDate ? new Date(dto.startDate) : null,
        endDate: dto.endDate ? new Date(dto.endDate) : null,
      },
    });

    this.logger.log(`Projeto criado com sucesso: "${projeto.title}" (${projeto.id})`);

    return {
      message: 'Projeto cadastrado com sucesso!',
      data: projeto,
    };
  }
}
