/*
  Warnings:

  - You are about to alter the column `title` on the `position` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(1))`.

*/
-- AlterTable
ALTER TABLE `position` ADD COLUMN `titleDetail` VARCHAR(191) NULL,
    MODIFY `title` ENUM('DIRETOR', 'VICE_DIRETOR', 'COORDENADOR', 'PROFESSOR', 'CORPO_TECNICO') NOT NULL,
    MODIFY `imageUrl` VARCHAR(191) NULL;
