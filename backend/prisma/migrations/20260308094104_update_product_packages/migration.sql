/*
  Warnings:

  - You are about to drop the column `duration` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `origPrice` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `savePct` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `subscribePrice` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "duration",
DROP COLUMN "origPrice",
DROP COLUMN "savePct",
DROP COLUMN "subscribePrice",
ADD COLUMN     "packages" JSONB;
