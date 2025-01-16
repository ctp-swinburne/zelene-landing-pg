/*
  Warnings:

  - Added the required column `email` to the `Feedback` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `TechnicalIssue` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Feedback" ADD COLUMN     "email" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "TechnicalIssue" ADD COLUMN     "email" TEXT NOT NULL;
