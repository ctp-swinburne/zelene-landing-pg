/*
  Warnings:

  - Added the required column `updatedAt` to the `Tag` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Post_publishedAt_idx";

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "isOfficial" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "priority" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Tag" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "isOfficial" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE INDEX "Post_isOfficial_priority_publishedAt_idx" ON "Post"("isOfficial", "priority", "publishedAt");

-- CreateIndex
CREATE INDEX "Tag_isOfficial_name_idx" ON "Tag"("isOfficial", "name");
