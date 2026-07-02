/*
  Warnings:

  - Added the required column `fileName` to the `EventMedia` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fileSize` to the `EventMedia` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mimeType` to the `EventMedia` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "EventMedia" ADD COLUMN     "fileName" TEXT NOT NULL,
ADD COLUMN     "fileSize" INTEGER NOT NULL,
ADD COLUMN     "mimeType" TEXT NOT NULL;
