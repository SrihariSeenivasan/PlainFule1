/*
  Warnings:

  - You are about to drop the column `accentWord` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `badges` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `benefits` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `grayWord` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `headline` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `highlight` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `images` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `nutrients` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `persuade` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `stock` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `subtitle` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `tag` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `tagline` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `variants` on the `Product` table. All the data in the column will be lost.
  - Made the column `reviewCount` on table `Product` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "accentWord",
DROP COLUMN "badges",
DROP COLUMN "benefits",
DROP COLUMN "grayWord",
DROP COLUMN "headline",
DROP COLUMN "highlight",
DROP COLUMN "images",
DROP COLUMN "nutrients",
DROP COLUMN "persuade",
DROP COLUMN "price",
DROP COLUMN "stock",
DROP COLUMN "subtitle",
DROP COLUMN "tag",
DROP COLUMN "tagline",
DROP COLUMN "variants",
ALTER COLUMN "reviewCount" SET NOT NULL;
