import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateOportunidadeDto } from './dto/create-oportunidade.dto.js';
import { UpdateOportunidadeDto } from './dto/update-oportunidade.dto.js';

@Injectable()
export class OportunidadesService {
  private readonly logger = new Logger(OportunidadesService.name);

  constructor(private readonly prisma: PrismaService) {}

  // ===========================================================================
  // US21 — Consultar oportunidades abertas (rota pública)
  // ===========================================================================

  /**
   * Lista pública de oportunidades abertas.
   *
   * Retorna informações resumidas: nome, duração e disponibilidade.
   * Suporta filtros opcionais:
   *   - `categoriaId`: filtra por área de atuação
   *   - `busca`: busca textual pelo título (LIKE %busca%)
   *
   * Se não houver vagas abertas, retorna array vazio (front exibe mensagem acolhedora).
   */
  async findAllOpen(filtros?: { categoriaId?: string; busca?: string }) {
    const where: Record<string, unknown> = { isOpen: true };

    if (filtros?.categoriaId) {
      where.categoriaId = filtros.categoriaId;
    }

    if (filtros?.busca) {
      where.title = { contains: filtros.busca };
    }

    const oportunidades = await this.prisma.oportunidade.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        duracao: true,
        disponibilidade: true,
        categoriaId: true,
        categoria: { select: { id: true, nome: true } },
        createdAt: true,
      },
    });

    this.logger.log(
      `Listagem pública de oportunidades abertas: ${oportunidades.length} resultado(s)`,
    );

    return oportunidades;
  }

  // ===========================================================================
  // RF19 — Painel do gestor: todas as oportunidades (abertas e fechadas)
  // ===========================================================================

  /**
   * Lista todas as oportunidades, abertas ou fechadas, para o painel do gestor.
   * Sem filtros: a lista pública (US21) é que mostra só as abertas.
   */
  async findAllForGestor() {
    return this.prisma.oportunidade.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        duracao: true,
        disponibilidade: true,
        isOpen: true,
        categoria: { select: { id: true, nome: true } },
        projeto: { select: { id: true, title: true } },
        createdAt: true,
      },
    });
  }

  // ===========================================================================
  // US16 — Candidatar-se a uma oportunidade (voluntário autenticado)
  // ===========================================================================

  /**
   * Registra a candidatura do usuário logado em uma oportunidade aberta,
   * com status inicial INSCRITO (entrada do funil, US18).
   *
   * - 404: oportunidade inexistente
   * - 400: oportunidade encerrada
   * - 403: usuário sem perfil de voluntário (o front leva para Minha Conta)
   * - 409: já existe candidatura do voluntário nessa vaga
   */
  async candidatar(userId: string, oportunidadeId: string) {
    const oportunidade = await this.prisma.oportunidade.findUnique({
      where: { id: oportunidadeId },
      select: { id: true, isOpen: true },
    });

    if (!oportunidade) {
      throw new NotFoundException(`Oportunidade com ID '${oportunidadeId}' não encontrada.`);
    }

    if (!oportunidade.isOpen) {
      throw new BadRequestException('Esta oportunidade não está aceitando candidaturas no momento.');
    }

    const perfil = await this.prisma.perfilVoluntario.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!perfil) {
      throw new ForbiddenException(
        'Complete seu perfil de voluntário para se candidatar a uma oportunidade.',
      );
    }

    const existente = await this.prisma.candidatura.findUnique({
      where: { perfilId_oportunidadeId: { perfilId: perfil.id, oportunidadeId } },
      select: { id: true },
    });

    if (existente) {
      throw new ConflictException('Você já se candidatou a esta oportunidade.');
    }

    const candidatura = await this.prisma.candidatura.create({
      data: { perfilId: perfil.id, oportunidadeId },
      select: { id: true, status: true, createdAt: true },
    });

    this.logger.log(`Candidatura ${candidatura.id} registrada na oportunidade ${oportunidadeId} (US16)`);
    return candidatura;
  }

  /** Informa se o usuário logado já se candidatou à oportunidade (desabilita o botão no front). */
  async jaCandidatou(userId: string, oportunidadeId: string) {
    const perfil = await this.prisma.perfilVoluntario.findUnique({
      where: { userId },
      select: { id: true },
    });
    if (!perfil) return { candidatado: false, temPerfil: false };

    const existente = await this.prisma.candidatura.findUnique({
      where: { perfilId_oportunidadeId: { perfilId: perfil.id, oportunidadeId } },
      select: { id: true },
    });
    return { candidatado: !!existente, temPerfil: true };
  }

  // ===========================================================================
  // US14 — Visualizar detalhes da oportunidade (rota pública)
  // ===========================================================================

  /**
   * Retorna todos os dados de uma oportunidade, incluindo projeto associado,
   * atividades planejadas, duração, disponibilidade, habilidades e local de atuação.
   *
   * A flag `aceitandoCandidaturas` indica se o botão "Candidatar-se" deve
   * estar habilitado (US14 critério 2).
   */
  async findById(id: string) {
    const oportunidade = await this.prisma.oportunidade.findUnique({
      where: { id },
      include: {
        projeto: {
          select: { id: true, title: true, description: true },
        },
        categoria: {
          select: { id: true, nome: true },
        },
        criteriosFunil: true,
      },
    });

    if (!oportunidade) {
      throw new NotFoundException(`Oportunidade com ID '${id}' não encontrada.`);
    }

    // Parse habilidades de JSON para array
    let habilidades: string[] = [];
    try {
      habilidades = JSON.parse(oportunidade.habilidades);
    } catch {
      habilidades = [];
    }

    // Parse criterios habilidadesExigidas
    let criterioHabilidades: string[] = [];
    if (oportunidade.criteriosFunil?.habilidadesExigidas) {
      try {
        criterioHabilidades = JSON.parse(oportunidade.criteriosFunil.habilidadesExigidas);
      } catch {
        criterioHabilidades = [];
      }
    }

    this.logger.log(`Consulta pública ao detalhe da oportunidade ID: ${id}`);

    return {
      id: oportunidade.id,
      title: oportunidade.title,
      description: oportunidade.description,
      atividades: oportunidade.atividades,
      duracao: oportunidade.duracao,
      disponibilidade: oportunidade.disponibilidade,
      habilidades,
      localAtuacao: oportunidade.localAtuacao,
      isOpen: oportunidade.isOpen,
      aceitandoCandidaturas: oportunidade.isOpen, // US14: bloqueado se fechada
      projeto: oportunidade.projeto,
      categoria: oportunidade.categoria,
      criteriosFunil: oportunidade.criteriosFunil
        ? {
            exigeExperiencia: oportunidade.criteriosFunil.exigeExperiencia,
            educacaoMinima: oportunidade.criteriosFunil.educacaoMinima,
            habilidadesExigidas: criterioHabilidades,
          }
        : null,
      createdAt: oportunidade.createdAt,
      updatedAt: oportunidade.updatedAt,
    };
  }

  // ===========================================================================
  // US13 — Cadastrar oportunidade (gestor autenticado)
  // ===========================================================================

  /**
   * Cria uma nova oportunidade de voluntariado.
   *
   * Valida:
   *   - Existência do projeto associado
   *   - Existência da categoria
   *   - Campos obrigatórios (class-validator + verificação extra)
   *
   * Se `criteriosFunil` for informado, cria o registro CriterioFunil
   * associado dentro da mesma transação.
   *
   * `isOpen` padrão = `true` (inscrições abertas). `false` cadastra a vaga já fechada.
   */
  async create(dto: CreateOportunidadeDto) {
    // 1. Validar projeto
    const projeto = await this.prisma.projeto.findUnique({
      where: { id: dto.projetoId },
    });
    if (!projeto) {
      throw new BadRequestException(
        `Projeto com ID '${dto.projetoId}' não encontrado. Selecione um projeto válido.`,
      );
    }

    // 2. Validar categoria
    const categoria = await this.prisma.categoria.findUnique({
      where: { id: dto.categoriaId },
    });
    if (!categoria) {
      throw new BadRequestException(
        `Categoria com ID '${dto.categoriaId}' não encontrada. Selecione uma categoria válida.`,
      );
    }

    // 3. Montar dados da oportunidade
    const habilidadesJson = JSON.stringify(dto.habilidades);

    // 4. Criar oportunidade (+ critérios do funil, se houver) em transação
    const oportunidade = await this.prisma.$transaction(async (tx) => {
      const op = await tx.oportunidade.create({
        data: {
          title: dto.title,
          description: dto.description,
          projetoId: dto.projetoId,
          categoriaId: dto.categoriaId,
          duracao: dto.duracao,
          disponibilidade: dto.disponibilidade,
          habilidades: habilidadesJson,
          atividades: dto.atividades ?? null,
          localAtuacao: dto.localAtuacao ?? null,
          isOpen: dto.isOpen ?? true,
        },
      });

      // Ciclo 7 / RN05: salvar critérios do funil
      if (dto.criteriosFunil) {
        await tx.criterioFunil.create({
          data: {
            oportunidadeId: op.id,
            exigeExperiencia: dto.criteriosFunil.exigeExperiencia ?? false,
            educacaoMinima: dto.criteriosFunil.educacaoMinima ?? null,
            habilidadesExigidas: dto.criteriosFunil.habilidadesExigidas?.length
              ? JSON.stringify(dto.criteriosFunil.habilidadesExigidas)
              : null,
          },
        });
      }

      return op;
    });

    this.logger.log(
      `Oportunidade criada: "${oportunidade.title}" (${oportunidade.id}) — ` +
        `inscrições: ${oportunidade.isOpen ? 'abertas' : 'fechadas'}`,
    );

    return {
      message: oportunidade.isOpen
        ? 'Oportunidade cadastrada com inscrições abertas com sucesso!'
        : 'Oportunidade cadastrada com inscrições fechadas com sucesso!',
      data: {
        ...oportunidade,
        habilidades: dto.habilidades,
      },
    };
  }

  // ===========================================================================
  // RF19 — Editar oportunidade (gestor autenticado)
  // ===========================================================================

  /**
   * Atualiza parcialmente uma oportunidade existente.
   * Permite editar dados e também abrir/fechar a oportunidade (isOpen).
   * Se `criteriosFunil` for informado, faz upsert no CriterioFunil associado.
   */
  async update(id: string, dto: UpdateOportunidadeDto) {
    // 1. Verificar existência
    const existing = await this.prisma.oportunidade.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException(`Oportunidade com ID '${id}' não encontrada.`);
    }

    // 2. Montar objeto de atualização (apenas campos informados)
    const data: Record<string, unknown> = {};

    if (dto.title !== undefined) data.title = dto.title;
    if (dto.description !== undefined) data.description = dto.description;
    if (dto.duracao !== undefined) data.duracao = dto.duracao;
    if (dto.disponibilidade !== undefined) data.disponibilidade = dto.disponibilidade;
    if (dto.atividades !== undefined) data.atividades = dto.atividades;
    if (dto.localAtuacao !== undefined) data.localAtuacao = dto.localAtuacao;
    if (dto.isOpen !== undefined) data.isOpen = dto.isOpen;
    if (dto.habilidades !== undefined) {
      data.habilidades = JSON.stringify(dto.habilidades);
    }

    // 3. Atualizar oportunidade (+ upsert do funil, se necessário) em transação
    const updated = await this.prisma.$transaction(async (tx) => {
      const op = await tx.oportunidade.update({
        where: { id },
        data,
      });

      // Ciclo 7 / RN05: upsert dos critérios do funil
      if (dto.criteriosFunil) {
        await tx.criterioFunil.upsert({
          where: { oportunidadeId: id },
          create: {
            oportunidadeId: id,
            exigeExperiencia: dto.criteriosFunil.exigeExperiencia ?? false,
            educacaoMinima: dto.criteriosFunil.educacaoMinima ?? null,
            habilidadesExigidas: dto.criteriosFunil.habilidadesExigidas?.length
              ? JSON.stringify(dto.criteriosFunil.habilidadesExigidas)
              : null,
          },
          update: {
            ...(dto.criteriosFunil.exigeExperiencia !== undefined && {
              exigeExperiencia: dto.criteriosFunil.exigeExperiencia,
            }),
            ...(dto.criteriosFunil.educacaoMinima !== undefined && {
              educacaoMinima: dto.criteriosFunil.educacaoMinima,
            }),
            ...(dto.criteriosFunil.habilidadesExigidas !== undefined && {
              // null ou lista vazia removem o critério
              habilidadesExigidas: dto.criteriosFunil.habilidadesExigidas?.length
                ? JSON.stringify(dto.criteriosFunil.habilidadesExigidas)
                : null,
            }),
          },
        });
      }

      return op;
    });

    // Parse habilidades para a resposta
    let habilidades: string[] = [];
    try {
      habilidades = JSON.parse(updated.habilidades);
    } catch {
      habilidades = [];
    }

    const statusMsg =
      dto.isOpen === true
        ? ' Oportunidade aberta para candidaturas.'
        : dto.isOpen === false
          ? ' Oportunidade fechada para novas candidaturas.'
          : '';

    this.logger.log(
      `Oportunidade atualizada: "${updated.title}" (${updated.id})${statusMsg}`,
    );

    return {
      message: `Oportunidade atualizada com sucesso!${statusMsg}`,
      data: {
        ...updated,
        habilidades,
      },
    };
  }
}
