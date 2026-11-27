-- AlterTable
ALTER TABLE `Experiencia` ADD COLUMN `createdById` VARCHAR(191) NULL;

-- CreateIndex
CREATE INDEX `Experiencia_createdById_idx` ON `Experiencia`(`createdById`);

-- AddForeignKey
ALTER TABLE `Experiencia` ADD CONSTRAINT `Experiencia_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
