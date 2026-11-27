ALTER TABLE `Booking`
    ADD COLUMN `expiresAt` DATETIME(3) NULL,
    ADD COLUMN `revision` INTEGER NOT NULL DEFAULT 1,
    ADD COLUMN `checkoutConfirmedAt` DATETIME(3) NULL;

UPDATE `Booking`
SET `expiresAt` = DATE_ADD(`createdAt`, INTERVAL 30 MINUTE)
WHERE `status` = 'PENDING';

ALTER TABLE `Payment`
    ADD COLUMN `provider` VARCHAR(191) NULL,
    ADD COLUMN `checkoutUrl` TEXT NULL;
CREATE UNIQUE INDEX `Payment_provider_externalId_key` ON `Payment`(`provider`, `externalId`);

CREATE TABLE `PaymentWebhookEvent` (
    `provider` VARCHAR(191) NOT NULL,
    `eventId` VARCHAR(191) NOT NULL,
    `processedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    PRIMARY KEY (`provider`, `eventId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
