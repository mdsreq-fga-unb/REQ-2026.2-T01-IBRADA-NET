-- AlterTable: adiciona saldo de vagas disponíveis na Experiencia (inicializado com capacity)
ALTER TABLE `Experiencia` ADD COLUMN `availableSeats` INTEGER NOT NULL DEFAULT 0;
UPDATE `Experiencia` SET `availableSeats` = `capacity`;
ALTER TABLE `Experiencia` MODIFY COLUMN `availableSeats` INTEGER NOT NULL;

-- AlterTable: adiciona prazo de expiração (30 min) na Booking (backfill seguro para linhas existentes)
ALTER TABLE `Booking` ADD COLUMN `expiresAt` DATETIME(3) NULL;
UPDATE `Booking` SET `expiresAt` = DATE_ADD(`createdAt`, INTERVAL 30 MINUTE) WHERE `expiresAt` IS NULL;
ALTER TABLE `Booking` MODIFY COLUMN `expiresAt` DATETIME(3) NOT NULL;

-- CreateIndex: acelera o job agendado de cancelamento de reservas PENDING vencidas
CREATE INDEX `Booking_status_expiresAt_idx` ON `Booking`(`status`, `expiresAt`);
