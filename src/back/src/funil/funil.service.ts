import {
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

// ---------------------------------------------------------------------------
// Ordenação dos níveis de educação para comparação (RN05)
// ---------------------------------------------------------------------------

const NIVEL_EDUCACAO_ORDEM: Record<string, number> = {
  FUNDAMENTAL: 0,
  MEDIO: 1,
  GRADUACAO: 2,
  POS_GRADUACAO: 3,
  MESTRADO: 4,
  DOUTORADO: 5,
};

/** Retorna `true` se o nível do candidato atende ao mínimo exigido. */
function atendeEducacaoMinima(
  nivelCandidato: string | null | undefined,
  minimoExigido: string,
): boolean {
  if (!nivelCandidato) return false;
  const ordemCandidato = NIVEL_EDUCACAO_ORDEM[nivelCandidato];
  const ordemMinimo = NIVEL_EDUCACAO_ORDEM[minimoExigido];
  if (ordemCandidato === undefined || ordemMinimo === undefined) return false;
  return ordemCandidato >= ordemMinimo;
}

// ---------------------------------------------------------------------------
// Tipos de retorno
// ---------------------------------------------------------------------------

export interface ResultadoFiltragem {
  candidaturaId: string;
  perfilId: string;
  nomeVoluntario: string;
  emailVoluntario: string;
  apto: boolean;
  motivos: string[]; // razões pelas quais NÃO foi considerado apto (vazio se apto)
}

// ---------------------------------------------------------------------------
// FunilService
// ---------------------------------------------------------------------------

/**
 * Implementa a regra de negócio RN05 — Filtro de candidatos.
 *
 * O sistema filtra candidatos aptos a uma oportunidade de voluntariado
 * com base em critérios objetivos definidos pelo gestor no cadastro
 * da oportunidade (CriterioFunil). Os critérios suportados são:
 *
 *   1. **exigeExperiencia** — candidato deve ter marcado `experienciaNaArea = true`
 *   2. **educacaoMinima** — nível mínimo de educação (ordem hierárquica)
 *   3. **habilidadesExigidas** — tags declaradas no campo de habilidades extras
 *      (`outros`), comparadas integralmente e sem diferenciar maiúsculas
 *
 * Se a oportunidade não possuir CriterioFunil, todos os candidatos são
 * considerados aptos (sem filtragem).
 */
@Injectable()
export class FunilService {
  private readonly logger = new Logger(FunilService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Filtra os candidatos de uma oportunidade segundo os critérios do funil (RN05).
   *
   * Retorna a lista completa de candidaturas com o flag `apto` e os `motivos`
   * (quando não apto), permitindo ao front/gestor visualizar quem passa ou não.
   */
  async filtrarCandidatos(oportunidadeId: string): Promise<ResultadoFiltragem[]> {
    // 1. Buscar a oportunidade e seus critérios
    const oportunidade = await this.prisma.oportunidade.findUnique({
      where: { id: oportunidadeId },
      include: { criteriosFunil: true },
    });

    if (!oportunidade) {
      throw new NotFoundException(
        `Oportunidade com ID '${oportunidadeId}' não encontrada.`,
      );
    }

    // 2. Buscar candidaturas com perfil completo
    const candidaturas = await this.prisma.candidatura.findMany({
      where: { oportunidadeId },
      include: {
        perfil: {
          include: {
            user: { select: { name: true, email: true } },
          },
        },
      },
    });

    const criterio = oportunidade.criteriosFunil;

    // 3. Se não há critérios, todos são aptos
    if (!criterio) {
      this.logger.log(
        `Oportunidade ${oportunidadeId}: sem critérios de funil — todos os ${candidaturas.length} candidato(s) são aptos.`,
      );
      return candidaturas.map((c) => ({
        candidaturaId: c.id,
        perfilId: c.perfilId,
        nomeVoluntario: c.perfil.user.name,
        emailVoluntario: c.perfil.user.email,
        apto: true,
        motivos: [],
      }));
    }

    // 4. Parse das habilidades exigidas
    let habilidadesExigidas: string[] = [];
    if (criterio.habilidadesExigidas) {
      try {
        habilidadesExigidas = JSON.parse(criterio.habilidadesExigidas);
      } catch {
        habilidadesExigidas = [];
      }
    }

    // 5. Aplicar filtragem
    const resultados: ResultadoFiltragem[] = candidaturas.map((candidatura) => {
      const motivos: string[] = [];

      // Critério 1: experiência na área
      if (criterio.exigeExperiencia && !candidatura.experienciaNaArea) {
        motivos.push('Não possui experiência na área (exigida pelo gestor).');
      }

      // Critério 2: educação mínima
      if (criterio.educacaoMinima) {
        if (
          !atendeEducacaoMinima(
            candidatura.perfil.educacaoNivel,
            criterio.educacaoMinima,
          )
        ) {
          motivos.push(
            `Nível de educação insuficiente. Mínimo exigido: ${criterio.educacaoMinima}; ` +
              `candidato: ${candidatura.perfil.educacaoNivel ?? 'não informado'}.`,
          );
        }
      }

      // Critério 3: habilidades / tags exigidas
      if (habilidadesExigidas.length > 0) {
        // `outros` contém habilidades declaradas, separadas por vírgula,
        // ponto e vírgula ou quebra de linha. Interesses não comprovam habilidade.
        const habilidadesCandidato = new Set(
          (candidatura.perfil.outros ?? '')
            .split(/[,;\n]/)
            .map((tag) => tag.trim().toLocaleLowerCase('pt-BR'))
            .filter(Boolean),
        );
        const habilidadesFaltantes = habilidadesExigidas.filter(
          (hab) => !habilidadesCandidato.has(hab.trim().toLocaleLowerCase('pt-BR')),
        );

        if (habilidadesFaltantes.length > 0) {
          motivos.push(
            `Habilidades não atendidas: ${habilidadesFaltantes.join(', ')}.`,
          );
        }
      }

      return {
        candidaturaId: candidatura.id,
        perfilId: candidatura.perfilId,
        nomeVoluntario: candidatura.perfil.user.name,
        emailVoluntario: candidatura.perfil.user.email,
        apto: motivos.length === 0,
        motivos,
      };
    });

    const aptos = resultados.filter((r) => r.apto).length;
    this.logger.log(
      `Funil RN05 aplicado à oportunidade ${oportunidadeId}: ` +
        `${aptos}/${resultados.length} candidato(s) apto(s).`,
    );

    return resultados;
  }
}

// Exportar utilitários para teste
export { atendeEducacaoMinima, NIVEL_EDUCACAO_ORDEM };
