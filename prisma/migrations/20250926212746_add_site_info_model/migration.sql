-- CreateTable
CREATE TABLE `SiteInfo` (
    `id` INTEGER NOT NULL DEFAULT 1,
    `aboutText` TEXT NOT NULL,
    `contactPhone1` VARCHAR(191) NOT NULL,
    `contactPhone2` VARCHAR(191) NULL,
    `contactEmail` VARCHAR(191) NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
