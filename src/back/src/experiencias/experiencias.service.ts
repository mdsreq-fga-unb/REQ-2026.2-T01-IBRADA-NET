import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateExperienciaDto } from './dto/create-experiencia.dto.js';
import { UpdateDisponibilidadeDto } from './dto/update-disponibilidade.dto.js';
import { slugify } from './utils/slug.util.js';
import {
  centsToFormattedBrl,
  decimalStringToCents,
  parseCurrency,
} from './utils/currency.util.js';

const MAX_SLUG_ATTEMPTS = 5;

// P2002 = violação de restrição única no Prisma.
function isUniqueViolation(error: unknown): boolean {
  return typeof error === 'object' && error !== null && (error as { code?: string }).code === 'P2002';
}

@Injectable()
export class ExperienciasService {
  private readonly logger = new Logger(ExperienciasService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * US02: Lista pública de pacotes de ecoturismo no catálogo.
   * Calcula as vagas disponíveis (availableSeats = capacity até o ciclo 9),
   * sinaliza se está indisponível ou sem vagas e formata o preço com precisão monetária.
   */
  async findAllPublic() {
    const experiencias = await this.prisma.experiencia.findMany({
      orderBy: { startsAt: 'asc' },
    });

    return experiencias.map((exp) => {
      const availableSeats = exp.capacity;
      const isSoldOut = availableSeats <= 0;
      const priceDecimal = exp.price.toString();
      const priceCents = decimalStringToCents(priceDecimal);
      const priceFormatted = centsToFormattedBrl(priceCents);

      return {
        id: exp.id,
        slug: exp.slug,
        title: exp.title,
        description: exp.description,
        itinerary: exp.itinerary,
        price: Number(exp.price),      // Para compatibilidade com o front-end atual
        priceDecimal,                  // String decimal exata ("150.50")
        priceCents,                    // Inteiro em centavos (15050) para pagamentos / Dinero.js
        priceFormatted,                // Formatado em Real ("R$ 150,50")
        startsAt: exp.startsAt,
        endsAt: exp.endsAt,
        capacity: exp.capacity,
        availableSeats,
        isAvailable: exp.isAvailable,
        isSoldOut,
        createdAt: exp.createdAt,
        updatedAt: exp.updatedAt,
      };
    });
  }

  /**
   * US03: Detalhe público de um pacote de ecoturismo por slug.
   * Retorna roteiro, datas, vagas e representação financeira completa.
   */
  async findBySlug(slug: string) {
    const exp = await this.prisma.experiencia.findUnique({
      where: { slug },
    });

    if (!exp) {
      throw new NotFoundException(`Experiência com o slug '${slug}' não encontrada.`);
    }

    const availableSeats = exp.capacity;
    const isSoldOut = availableSeats <= 0;
    const priceDecimal = exp.price.toString();
    const priceCents = decimalStringToCents(priceDecimal);
    const priceFormatted = centsToFormattedBrl(priceCents);

    return {
      id: exp.id,
      slug: exp.slug,
      title: exp.title,
      description: exp.description,
      itinerary: exp.itinerary,
      price: Number(exp.price),
      priceDecimal,
      priceCents,
      priceFormatted,
      startsAt: exp.startsAt,
      endsAt: exp.endsAt,
      capacity: exp.capacity,
      availableSeats,
      isAvailable: exp.isAvailable,
      isSoldOut,
      createdAt: exp.createdAt,
      updatedAt: exp.updatedAt,
    };
  }

  /**
   * US11: Cadastro de nova pacote de ecoturismo por gestor.
   * Valida regras de negócio: startsAt < endsAt, capacity > 0,
   * converte o preço com precisão decimal exata e gera slug único.
   */
  async create(dto: CreateExperienciaDto) {
    const startsAt = new Date(dto.startsAt);
    const endsAt = new Date(dto.endsAt);

    if (endsAt <= startsAt) {
      throw new BadRequestException(
        'A data de término (endsAt) deve ser estritamente posterior à data de início (startsAt).',
      );
    }

    if (dto.capacity <= 0) {
      throw new BadRequestException('A capacidade de vagas deve ser maior que zero.');
    }

    // Normalização monetária sem perda binária IEEE 754
    const safePrice = parseCurrency(dto.price);

    // O Prisma aceita a string decimal exata (ex: "150.50"), repassando ao
    // DECIMAL(10, 2) do banco sem qualquer corrupção de arredondamento.
    // Se duas requisições gerarem o mesmo slug ao mesmo tempo, o índice único
    // do banco responde com P2002 e tentamos de novo com o próximo sufixo.
    let created;
    let startFrom = 1;

    for (let attempt = 1; attempt <= MAX_SLUG_ATTEMPTS; attempt++) {
      const { slug, suffix } = await this.generateUniqueSlug(dto.title, startFrom);
      try {
        created = await this.prisma.experiencia.create({
          data: {
            title: dto.title,
            slug,
            description: dto.description,
            itinerary: dto.itinerary,
            price: safePrice.decimalString,
            startsAt,
            endsAt,
            capacity: dto.capacity,
            isAvailable: dto.isAvailable,
          },
        });
        break;
      } catch (error) {
        if (isUniqueViolation(error) && attempt < MAX_SLUG_ATTEMPTS) {
          startFrom = suffix + 1;
          continue;
        }
        throw error;
      }
    }

    if (!created) {
      throw new ConflictException('Não foi possível gerar um slug único para a experiência.');
    }

    const priceDecimal = created.price.toString();
    const priceCents = decimalStringToCents(priceDecimal);
    const priceFormatted = centsToFormattedBrl(priceCents);

    this.logger.log(`Nova experiência criada com sucesso: ${created.title} (slug: ${created.slug})`);

    return {
      message: 'Experiência cadastrada com sucesso!',
      data: {
        ...created,
        price: Number(created.price),
        priceDecimal,
        priceCents,
        priceFormatted,
        availableSeats: created.capacity,
        isSoldOut: created.capacity <= 0,
      },
    };
  }

  /**
   * US12: Atualização de disponibilidade de pacote por gestor.
   * Habilita ou desabilita a oferta no catálogo sem alterar reservas anteriores.
   */
  async updateDisponibilidade(id: string, dto: UpdateDisponibilidadeDto) {
    const exists = await this.prisma.experiencia.findUnique({
      where: { id },
    });

    if (!exists) {
      throw new NotFoundException(`Experiência com ID '${id}' não encontrada.`);
    }

    const updated = await this.prisma.experiencia.update({
      where: { id },
      data: { isAvailable: dto.isAvailable },
    });

    const priceDecimal = updated.price.toString();
    const priceCents = decimalStringToCents(priceDecimal);
    const priceFormatted = centsToFormattedBrl(priceCents);

    this.logger.log(
      `Disponibilidade da experiência '${updated.title}' alterada para: ${updated.isAvailable}`,
    );

    return {
      message: `Disponibilidade atualizada para ${updated.isAvailable ? 'disponível' : 'indisponível'} com sucesso!`,
      data: {
        ...updated,
        price: Number(updated.price),
        priceDecimal,
        priceCents,
        priceFormatted,
      },
    };
  }

  /**
   * Gera um slug único no banco adicionando sufixos numéricos caso já exista colisão.
   * `startFrom` é o primeiro sufixo a testar (1 = slug sem sufixo).
   */
  private async generateUniqueSlug(
    title: string,
    startFrom = 1,
  ): Promise<{ slug: string; suffix: number }> {
    const baseSlug = slugify(title) || 'experiencia';
    let suffix = startFrom;
    let slug = suffix === 1 ? baseSlug : `${baseSlug}-${suffix}`;

    while (await this.prisma.experiencia.findUnique({ where: { slug } })) {
      suffix += 1;
      slug = `${baseSlug}-${suffix}`;
    }

    return { slug, suffix };
  }
}
