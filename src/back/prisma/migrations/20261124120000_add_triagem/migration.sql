CREATE TABLE `Triagem` (
    `id` VARCHAR(191) NOT NULL,
    `tipoSolicitacao` VARCHAR(191) NOT NULL,
    `perfil` VARCHAR(191) NOT NULL,
    `departamento` VARCHAR(191) NOT NULL,
    `respostas` JSON NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `PedidoParceria` ADD COLUMN `tipoApoio` VARCHAR(191) NULL;
