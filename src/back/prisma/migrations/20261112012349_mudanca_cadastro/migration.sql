/*
  Warnings:

  - You are about to drop the column `disponibilidade` on the `Oportunidade` table. All the data in the column will be lost.
  - You are about to drop the column `disponibilidade` on the `PerfilVoluntario` table. All the data in the column will be lost.
  - You are about to drop the column `experiencias` on the `PerfilVoluntario` table. All the data in the column will be lost.
  - You are about to drop the column `interesses` on the `PerfilVoluntario` table. All the data in the column will be lost.
  - You are about to drop the `Habilidade` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `HabilidadeDaOportunidade` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `HabilidadeDoVoluntario` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `categoriaId` to the `Oportunidade` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `HabilidadeDaOportunidade` DROP FOREIGN KEY `HabilidadeDaOportunidade_habilidadeId_fkey`;

-- DropForeignKey
ALTER TABLE `HabilidadeDaOportunidade` DROP FOREIGN KEY `HabilidadeDaOportunidade_oportunidadeId_fkey`;

-- DropForeignKey
ALTER TABLE `HabilidadeDoVoluntario` DROP FOREIGN KEY `HabilidadeDoVoluntario_habilidadeId_fkey`;

-- DropForeignKey
ALTER TABLE `HabilidadeDoVoluntario` DROP FOREIGN KEY `HabilidadeDoVoluntario_perfilId_fkey`;

-- AlterTable
ALTER TABLE `Candidatura` ADD COLUMN `experienciaNaArea` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `Oportunidade` DROP COLUMN `disponibilidade`,
    ADD COLUMN `categoriaId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `PerfilVoluntario` DROP COLUMN `disponibilidade`,
    DROP COLUMN `experiencias`,
    DROP COLUMN `interesses`,
    ADD COLUMN `educacaoCompletude` ENUM('COMPLETO', 'EM_ANDAMENTO', 'INCOMPLETO') NULL,
    ADD COLUMN `educacaoNivel` ENUM('FUNDAMENTAL', 'MEDIO', 'GRADUACAO', 'POS_GRADUACAO', 'MESTRADO', 'DOUTORADO') NULL;

-- DropTable
DROP TABLE `Habilidade`;

-- DropTable
DROP TABLE `HabilidadeDaOportunidade`;

-- DropTable
DROP TABLE `HabilidadeDoVoluntario`;

-- CreateTable
CREATE TABLE `Categoria` (
    `id` VARCHAR(191) NOT NULL,
    `nome` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Categoria_nome_key`(`nome`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `InteresseVoluntario` (
    `idCategoria` VARCHAR(191) NOT NULL,
    `idVoluntario` VARCHAR(191) NOT NULL,

    INDEX `InteresseVoluntario_idVoluntario_idx`(`idVoluntario`),
    PRIMARY KEY (`idCategoria`, `idVoluntario`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `Oportunidade_categoriaId_idx` ON `Oportunidade`(`categoriaId`);

-- AddForeignKey
ALTER TABLE `InteresseVoluntario` ADD CONSTRAINT `InteresseVoluntario_idCategoria_fkey` FOREIGN KEY (`idCategoria`) REFERENCES `Categoria`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InteresseVoluntario` ADD CONSTRAINT `InteresseVoluntario_idVoluntario_fkey` FOREIGN KEY (`idVoluntario`) REFERENCES `PerfilVoluntario`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Oportunidade` ADD CONSTRAINT `Oportunidade_categoriaId_fkey` FOREIGN KEY (`categoriaId`) REFERENCES `Categoria`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
