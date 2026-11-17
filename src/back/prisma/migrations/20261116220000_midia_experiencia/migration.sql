-- CreateTable
CREATE TABLE `MidiaExperiencia` (
    `id` VARCHAR(191) NOT NULL,
    `experienciaId` VARCHAR(191) NOT NULL,
    `tipo` ENUM('FOTO', 'VIDEO') NOT NULL,
    `url` VARCHAR(2048) NOT NULL,
    `ordem` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `MidiaExperiencia_experienciaId_idx`(`experienciaId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `MidiaExperiencia` ADD CONSTRAINT `MidiaExperiencia_experienciaId_fkey` FOREIGN KEY (`experienciaId`) REFERENCES `Experiencia`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
