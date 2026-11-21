import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { atendeEducacaoMinima } from '../funil/funil.service.js';
import { StatusCandidatura } from '../generated/prisma/enums.js';
import { ListCandidaturasQueryDto } from './dto/list-candidaturas-query.dto.js';

function avaliarCriteriosFunil(params: {
  experienciaNaArea: boolean;
  educacaoNivel: string | null;
  outros: string | null;
  criterio: {
    exigeExperiencia: boolean;
    educacaoMinima: string | null;
    habilidadesExigidas: string | null;
  } | null;
}): { apto: boolean; motivos: string[] } {
  const { criterio } = params;
  if (!criterio) {
    return { apto: true, motivos: [] };
  }

  const motivos: string[] = [];

  if (criterio.exigeExperiencia && !params.experienciaNaArea) {
    motivos.push('Não possui experiência prática na área (exigida pelo gestor).');
  }

  if (criterio.educacaoMinima && !atendeEducacaoMinima(params.educacaoNivel, criterio.educacaoMinima)) {
    motivos.push(
      `Escolaridade abaixo do mínimo exigido (${criterio.educacaoMinima}).`,
    );
  }

  let habilidadesExigidas: string[] = [];
  if (criterio.habilidadesExigidas) {
    try {
      habilidadesExigidas = JSON.parse(criterio.habilidadesExigidas) as string[];
    } catch {
      habilidadesExigidas = [];
    }
  }

  if (habilidadesExigidas.length > 0) {
    const declaradas = new Set(
      (params.outros ?? '')
        .split(/[,;\n]/)
        .map((t) => t.trim().toLocaleLowerCase('pt-BR'))
        .filter(Boolean),
    );
    const faltantes = habilidadesExigidas.filter(
      (hab) => !declaradas.has(hab.trim().toLocaleLowerCase('pt-BR')),
    );
    if (faltantes.length > 0) {
      motivos.push(`Habilidades exigidas não declaradas: ${faltantes.join(', ')}.`);
    }
  }

  return { apto: motivos.length === 0, motivos };
}

@Injectable()
export class CandidaturasService {
  private readonly logger = new Logger(CandidaturasService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * US18: Lista candidaturas para o painel do gestor com filtros por oportunidade,
   * status, busca por nome/e-mail e paginação, além dos totais globais do funil.
   */
  async findAllForGestor(query: ListCandidaturasQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;
    const busca = query.busca?.trim();

    const where: Record<string, unknown> = {};
    if (query.oportunidadeId) {
      where.oportunidadeId = query.oportunidadeId;
    }
    if (query.status) {
      where.status = query.status;
    }
    if (busca) {
      where.perfil = {
        user: {
          OR: [
            { name: { contains: busca } },
            { email: { contains: busca } },
          ],
        },
      };
    }

    const [total, items, grouped] = await this.prisma.$transaction([
      this.prisma.candidatura.count({ where }),
      this.prisma.candidatura.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          oportunidade: {
            select: {
              id: true,
              title: true,
              isOpen: true,
              categoria: { select: { id: true, nome: true } },
              projeto: { select: { id: true, title: true } },
              criteriosFunil: true,
            },
          },
          perfil: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  phone: true,
                  cidade: true,
                  estado: true,
                },
              },
              interesses: {
                include: {
                  categoria: { select: { id: true, nome: true } },
                },
              },
            },
          },
        },
      }),
      this.prisma.candidatura.groupBy({
        by: ['status'],
        orderBy: { status: 'asc' },
        _count: { _all: true },
      }),
    ]);

    const porStatus: Record<StatusCandidatura, number> = {
      INSCRITO: 0,
      EM_ANALISE: 0,
      ENTREVISTA: 0,
      APROVADO: 0,
      REJEITADO: 0,
    };

    let totalGeral = 0;
    for (const row of grouped) {
      const count = typeof row._count === 'object' && row._count ? (row._count._all ?? 0) : 0;
      porStatus[row.status] = count;
      totalGeral += count;
    }

    const data = items.map((item) => {
      const triagemFunil = avaliarCriteriosFunil({
        experienciaNaArea: item.experienciaNaArea,
        educacaoNivel: item.perfil.educacaoNivel,
        outros: item.perfil.outros,
        criterio: item.oportunidade.criteriosFunil,
      });

      return {
        id: item.id,
        status: item.status,
        experienciaNaArea: item.experienciaNaArea,
        mensagem: item.mensagem,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        oportunidade: {
          id: item.oportunidade.id,
          title: item.oportunidade.title,
          isOpen: item.oportunidade.isOpen,
          categoria: item.oportunidade.categoria,
          projeto: item.oportunidade.projeto,
        },
        voluntario: {
          perfilId: item.perfil.id,
          userId: item.perfil.user.id,
          name: item.perfil.user.name,
          email: item.perfil.user.email,
          phone: item.perfil.user.phone,
          cidade: item.perfil.user.cidade,
          estado: item.perfil.user.estado,
          bio: item.perfil.bio,
          outros: item.perfil.outros,
          educacaoNivel: item.perfil.educacaoNivel,
          educacaoCompletude: item.perfil.educacaoCompletude,
          interesses: item.perfil.interesses.map((i) => i.categoria.nome),
        },
        triagemFunil,
      };
    });

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
      resumo: {
        total: totalGeral,
        porStatus,
      },
    };
  }

  /**
   * US18: Atualiza a etapa da candidatura no funil (INSCRITO, EM_ANALISE, ENTREVISTA,
   * APROVADO ou REJEITADO).
   */
  async updateStatus(id: string, status: StatusCandidatura) {
    const existing = await this.prisma.candidatura.findUnique({
      where: { id },
      select: { id: true, status: true },
    });

    if (!existing) {
      throw new NotFoundException(`Candidatura com ID '${id}' não encontrada.`);
    }

    const updated = await this.prisma.candidatura.update({
      where: { id },
      data: { status },
      select: {
        id: true,
        status: true,
        updatedAt: true,
      },
    });

    this.logger.log(
      `Candidatura ${id} movida de ${existing.status} para ${status} (US18)`,
    );

    return {
      message: 'Status da candidatura atualizado com sucesso.',
      data: updated,
    };
  }

  /**
   * US16 / US18: Retorna as candidaturas realizadas pelo voluntário autenticado.
   */
  async findMine(userId: string) {
    const perfil = await this.prisma.perfilVoluntario.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!perfil) {
      return [];
    }

    const candidaturas = await this.prisma.candidatura.findMany({
      where: { perfilId: perfil.id },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        status: true,
        experienciaNaArea: true,
        mensagem: true,
        createdAt: true,
        updatedAt: true,
        oportunidade: {
          select: {
            id: true,
            title: true,
            duracao: true,
            disponibilidade: true,
            isOpen: true,
            categoria: { select: { id: true, nome: true } },
            projeto: { select: { id: true, title: true } },
          },
        },
      },
    });

    return candidaturas;
  }
}