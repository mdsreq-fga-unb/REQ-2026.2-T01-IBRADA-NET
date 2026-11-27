-- AlterTable
ALTER TABLE `Experiencia` ADD COLUMN `location` VARCHAR(191) NULL,
    ADD COLUMN `community` VARCHAR(191) NULL,
    ADD COLUMN `biome` VARCHAR(191) NULL,
    ADD COLUMN `difficulty` VARCHAR(191) NULL,
    ADD COLUMN `meetingPoint` VARCHAR(191) NULL,
    ADD COLUMN `meetingTime` VARCHAR(191) NULL,
    ADD COLUMN `includedItems` JSON NULL,
    ADD COLUMN `rules` JSON NULL,
    ADD COLUMN `clothingTips` JSON NULL,
    ADD COLUMN `communityImpact` TEXT NULL,
    ADD COLUMN `guideName` VARCHAR(191) NULL,
    ADD COLUMN `guideRole` VARCHAR(191) NULL,
    ADD COLUMN `maxPerBooking` INTEGER NOT NULL DEFAULT 6;
