-- CreateEnum
CREATE TYPE "TestimonialStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'PENDING');

-- CreateTable
CREATE TABLE "CustomerReview" (
    "id" SERIAL NOT NULL,
    "category" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "quote" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "mainImage" TEXT NOT NULL,
    "avatarImage" TEXT,
    "status" "TestimonialStatus" NOT NULL DEFAULT 'PENDING',
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdBy" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomerReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VideoReview" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "quote" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "thumbnailImage" TEXT NOT NULL,
    "videoUrl" TEXT,
    "status" "TestimonialStatus" NOT NULL DEFAULT 'PENDING',
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdBy" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VideoReview_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CustomerReview_status_idx" ON "CustomerReview"("status");

-- CreateIndex
CREATE INDEX "CustomerReview_category_idx" ON "CustomerReview"("category");

-- CreateIndex
CREATE INDEX "CustomerReview_displayOrder_idx" ON "CustomerReview"("displayOrder");

-- CreateIndex
CREATE INDEX "CustomerReview_createdBy_idx" ON "CustomerReview"("createdBy");

-- CreateIndex
CREATE INDEX "VideoReview_status_idx" ON "VideoReview"("status");

-- CreateIndex
CREATE INDEX "VideoReview_displayOrder_idx" ON "VideoReview"("displayOrder");

-- CreateIndex
CREATE INDEX "VideoReview_createdBy_idx" ON "VideoReview"("createdBy");

-- AddForeignKey
ALTER TABLE "CustomerReview" ADD CONSTRAINT "CustomerReview_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VideoReview" ADD CONSTRAINT "VideoReview_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
