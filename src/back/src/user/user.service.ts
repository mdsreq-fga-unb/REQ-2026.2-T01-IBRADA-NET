import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
  type OnApplicationBootstrap,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateUserDto , UserRole } from './dto/create-user.dto.js';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto.js';

const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

const prismaCode = (error: unknown): string | undefined =>
  typeof error === 'object' && error !== null ? (error as { code?: string }).code : undefined;

@Injectable()
export class UserService implements OnApplicationBootstrap {
  private readonly logger = new Logger(UserService.name);

  constructor(private prisma: PrismaService) {}

  async create(dto: CreateUserDto) {
    if ((dto.role as string) === UserRole.GESTOR) {
      throw new ForbiddenException('Não é permitido criar um usuário com o papel de GESTOR via cadastro público.');
    }

    if (!dto.lgpdAccepted) {
      throw new BadRequestException('Os termos de uso de dados devem ser aceitos.');
    }

    const userExists = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (userExists) {
      throw new ConflictException('Este email já está vinculado a uma conta.');
    }

    const dataNascimento = new Date(dto.dataNascimento);
    if (dataNascimento.getTime() > Date.now()) {
      throw new BadRequestException('A data de nascimento não pode estar no futuro.');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    try {
      return await this.prisma.user.create({
        data: {
          name: dto.name,
          email: dto.email,
          passwordHash,
          phone: dto.phone,
          dataNascimento,
          cidade: dto.cidade,
          estado: dto.estado,
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
                outros: dto.outros,
                educacaoNivel: dto.educacaoNivel,
                educacaoCompletude: dto.educacaoCompletude,
                interesses: dto.categoriaIds
                  ? {
                      create: dto.categoriaIds.map((id: string) => ({
                        categoria: { connect: { id } },
                      })),
                    }
                  : undefined,
              },
            },
          }),
        },
        select: { id: true, name: true, email: true, role: true },
      });
    } catch (error) {
      if (prismaCode(error) === 'P2002') {
        throw new ConflictException('Este email já está vinculado a uma conta.');
      }
      if (prismaCode(error) === 'P2025') {
        throw new BadRequestException('Uma das categorias de interesse informadas não existe.');
      }
      throw error;
    }
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async update(userId: string, data: UpdateUserDto) {
    const { name, phone, dataNascimento, cidade, estado, categoriaIds, ...perfil } = data;
    const perfilData = Object.fromEntries(
      Object.entries(perfil).filter(([, value]) => value !== undefined),
    );
    const editaPerfil = Object.keys(perfilData).length > 0 || categoriaIds !== undefined;

    if (editaPerfil) {
      const perfilExiste = await this.prisma.perfilVoluntario.findUnique({ where: { userId } });
      if (!perfilExiste) {
        throw new BadRequestException('Esta conta não possui perfil de voluntário para editar.');
      }
    }

    try {
      return await this.prisma.user.update({
        where: { id: userId },
        data: {
          name,
          phone,
          cidade,
          estado,
          ...(dataNascimento !== undefined && { dataNascimento: new Date(dataNascimento) }),
          ...(editaPerfil && {
            perfilVoluntario: {
              update: {
                ...perfilData,
                ...(categoriaIds !== undefined && {
                  // Substitui a lista de interesses pela enviada.
                  interesses: {
                    deleteMany: {},
                    create: categoriaIds.map((id: string) => ({
                      categoria: { connect: { id } },
                    })),
                  },
                }),
              },
            },
          }),
        },
        select: { id: true, name: true, phone: true },
      });
    } catch (error) {
      if (prismaCode(error) === 'P2025') {
        throw new NotFoundException('Usuário ou categoria informada não encontrada.');
      }
      throw error;
    }
  }

  async onApplicationBootstrap() {
    const email = process.env.GESTOR_EMAIL;
    const password = process.env.GESTOR_PASSWORD;
    if (!email || !password) return;

    try {
      if (!PASSWORD_REGEX.test(password)) {
        this.logger.error('GESTOR_PASSWORD não cumpre a regra de senha; gestor inicial não foi criado.');
        return;
      }

      const existing = await this.prisma.user.findUnique({ where: { email } });
      if (existing) {
        if (existing.role !== UserRole.GESTOR) {
          this.logger.warn(`GESTOR_EMAIL (${email}) já pertence a uma conta que não é gestor; nenhuma alteração feita.`);
        }
        return;
      }

      await this.prisma.user.create({
        data: {
          name: process.env.GESTOR_NAME || 'Gestor IBRADA',
          email,
          passwordHash: await bcrypt.hash(password, 10),
          role: UserRole.GESTOR,
        },
      });
      this.logger.log(`Gestor inicial criado: ${email}`);
    } catch (error) {
      this.logger.error(`Falha ao criar o gestor inicial: ${String(error)}`);
    }
  }
}
