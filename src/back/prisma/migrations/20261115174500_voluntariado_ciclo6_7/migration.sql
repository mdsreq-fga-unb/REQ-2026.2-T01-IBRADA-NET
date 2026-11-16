-- Migration: voluntariado_ciclo6_7
-- Ciclo 6 (US14, US21) + Ciclo 7 (US13, RN05) — Pessoa 5
-- Compatível com MySQL 8.0 / MariaDB (datasource provider = "mysql")

-- ---------------------------------------------------------------------------
-- 1. Adicionar colunas novas à tabela Oportunidade
-- ---------------------------------------------------------------------------

-- US13: disponibilidade e habilidades são obrigatórias no cadastro.
-- Sem default: o schema.prisma também não define (o DTO garante o preenchimento).
ALTER TABLE `Oportunidade`
  ADD COLUMN `disponibilidade` VARCHAR(191) NOT NULL,
  ADD COLUMN `habilidades` TEXT NOT NULL,
  ADD COLUMN `atividades` TEXT NULL,
  ADD COLUMN `localAtuacao` VARCHAR(191) NULL;

-- Índice para acelerar a listagem pública (US21: WHERE isOpen = true)
CREATE INDEX `Oportunidade_isOpen_idx` ON `Oportunidade`(`isOpen`);

-- ---------------------------------------------------------------------------
-- 2. Criar tabela CriterioFunil (Ciclo 7 / RN05)
-- ---------------------------------------------------------------------------

CREATE TABLE `CriterioFunil` (
    `id` VARCHAR(191) NOT NULL,
    `oportunidadeId` VARCHAR(191) NOT NULL,
    `exigeExperiencia` BOOLEAN NOT NULL DEFAULT false,
    `educacaoMinima` ENUM('FUNDAMENTAL', 'MEDIO', 'GRADUACAO', 'POS_GRADUACAO', 'MESTRADO', 'DOUTORADO') NULL,
    `habilidadesExigidas` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `CriterioFunil_oportunidadeId_key`(`oportunidadeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- FK: CriterioFunil → Oportunidade (CASCADE on delete)
ALTER TABLE `CriterioFunil`
  ADD CONSTRAINT `CriterioFunil_oportunidadeId_fkey`
  FOREIGN KEY (`oportunidadeId`) REFERENCES `Oportunidade`(`id`)
  ON DELETE CASCADE ON UPDATE CASCADE;
