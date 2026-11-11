import { ConflictException, ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateUserDto , UserRole } from './dto/create-user.dto.js';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto.js';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateUserDto) {
    if ((dto.role as string) === UserRole.GESTOR) {
      throw new ForbiddenException('Não é permitido criar um usuário com o papel de GESTOR via cadastro público.');
    }

    const userExists = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (userExists) {
      throw new ConflictException('Este email já está vinculado a uma conta.');
    }

    if (!dto.lgpdAccepted) {
      throw new ConflictException('Os termos de uso de dados devem ser aceitos.');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const roleStr = dto.role as any;

    return this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        passwordHash,
        phone: dto.phone,
        role: dto.role,
        consents: {
          create: {
            termVersion: dto.lgpdVersion,
          },
        },
        ...(dto.role === 'VOLUNTARIO' && {
          perfilVoluntario: {
            create: {
              bio: dto.bio,
              experiencias: dto.experiencias,
              interesses: dto.interesses,
              disponibilidade: dto.disponibilidade,
              outros: dto.outros,
              habilidades: dto.habilidadeIds ? {
                create: dto.habilidadeIds.map((id: string) => ({
                  habilidade: { connect: { id } }
                }))
              } : undefined
            }
          }
        })
      },
      select: { id: true, name: true, email: true, role: true }
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async update(userId: string, data: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id: userId },
      data,
      select: { id: true, name: true, phone: true }
    });
  }
}