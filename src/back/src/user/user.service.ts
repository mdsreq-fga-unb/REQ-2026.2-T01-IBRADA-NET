import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
  Optional,
  type OnApplicationBootstrap,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateUserDto, UserRole } from './dto/create-user.dto.js';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { CreatePerfilVoluntarioDto } from './dto/create-perfil-voluntario.dto.js';

const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

const prismaCode = (error: unknown): string | undefined =>
  typeof error === 'object' && error !== null ? (error as { code?: string }).code : undefined;

const PERFIL_VOLUNTARIO_SELECT = {
  id: true,
  bio: true,
  outros: true,
  educacaoNivel: true,
  educacaoCompletude: true,
  createdAt: true,
  updatedAt: true,
  interesses: {
    select: {
      categoria: {
        select: {
          id: true,
          nome: true,
        },
      },
    },
  },
} as const;

@Injectable()
export class UserService implements OnApplicationBootstrap {
  private readonly logger = new Logger(UserService.name);

  constructor(
    private prisma: PrismaService,
    @Optional() private jwtService?: JwtService,
  ) {}

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

    const dataNascimento = this.parseDataNascimento(dto.dataNascimento);
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

  private parseDataNascimento(value: string): Date {
    const data = new Date(value);
    if (data.getTime() > Date.now()) {
      throw new BadRequestException('A data de nascimento não pode estar no futuro.');
    }
    return data;
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  // US05 / US15: retorna os dados pessoais do usuário logado e seu perfil de voluntário (se existir).
  async findMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        dataNascimento: true,
        cidade: true,
        estado: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        perfilVoluntario: {
          select: PERFIL_VOLUNTARIO_SELECT,
        },
      },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    return user;
  }

  // US15: cria o perfil de voluntário para uma conta já existente (apenas uma vez).
  async createPerfilVoluntario(userId: string, dto: CreatePerfilVoluntarioDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        perfilVoluntario: { select: { id: true } },
      },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    if (user.perfilVoluntario) {
      throw new ConflictException('Este usuário já possui um perfil de voluntário cadastrado.');
    }

    // Promove CLIENTE para VOLUNTARIO; se for GESTOR, mantém GESTOR.
    const nextRole = user.role === UserRole.CLIENTE ? UserRole.VOLUNTARIO : user.role;

    try {
      const updated = await this.prisma.user.update({
        where: { id: userId },
        data: {
          role: nextRole,
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
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          perfilVoluntario: {
            select: PERFIL_VOLUNTARIO_SELECT,
          },
        },
      });

      const payload = { sub: updated.id, email: updated.email, role: updated.role };
      const access_token = this.jwtService ? this.jwtService.sign(payload) : undefined;

      return {
        ...(access_token && { access_token }),
        user: { id: updated.id, name: updated.name, role: updated.role },
        perfilVoluntario: updated.perfilVoluntario,
      };
    } catch (error) {
      if (prismaCode(error) === 'P2002') {
        throw new ConflictException('Este usuário já possui um perfil de voluntário cadastrado.');
      }
      if (prismaCode(error) === 'P2025') {
        throw new BadRequestException('Uma das categorias de interesse informadas não existe.');
      }
      throw error;
    }
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
          ...(dataNascimento !== undefined && { dataNascimento: this.parseDataNascimento(dataNascimento) }),
          ...(editaPerfil && {
            perfilVoluntario: {
              update: {
                ...perfilData,
                ...(categoriaIds !== undefined && {
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
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          phone: true,
          dataNascimento: true,
          cidade: true,
          estado: true,
        },
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