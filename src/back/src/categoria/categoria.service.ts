import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateCategoriaDto } from './dto/create-categoria.dto.js';

const prismaCode = (error: unknown): string | undefined =>
  typeof error === 'object' && error !== null ? (error as { code?: string }).code : undefined;

@Injectable()
export class CategoriaService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.categoria.findMany({
      orderBy: { nome: 'asc' },
      select: { id: true, nome: true },
    });
  }

  async create(dto: CreateCategoriaDto) {
    const existing = await this.prisma.categoria.findUnique({
      where: { nome: dto.nome },
    });

    if (existing) {
      throw new ConflictException('Já existe uma categoria cadastrada com este nome.');
    }

    try {
      return await this.prisma.categoria.create({
        data: { nome: dto.nome },
        select: { id: true, nome: true },
      });
    } catch (error) {
      if (prismaCode(error) === 'P2002') {
        throw new ConflictException('Já existe uma categoria cadastrada com este nome.');
      }
      throw error;
    }
  }
}