/*
  Warnings:

  - You are about to drop the column `packages` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "packages";

-- CreateTable
CREATE TABLE "Package" (
    "id" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "daysCount" INTEGER NOT NULL,
    "pouches" INTEGER NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "origPrice" DECIMAL(10,2),
    "savePct" TEXT,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "tag" TEXT,
    "subtitle" TEXT,
    "headline" TEXT,
    "accentWord" TEXT,
    "grayWord" TEXT,
    "persuade" TEXT,
    "tagline" TEXT,
    "highlight" TEXT,
    "images" JSONB,
    "benefits" JSONB,
    "badges" JSONB,
    "variants" JSONB,
    "nutrients" JSONB,
    "productId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Package_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Package_productId_idx" ON "Package"("productId");

-- AddForeignKey
ALTER TABLE "Package" ADD CONSTRAINT "Package_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
