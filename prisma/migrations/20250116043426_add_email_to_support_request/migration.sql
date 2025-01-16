/*
  Warnings:

  - Added the required column `email` to the `SupportRequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SupportRequest" ADD COLUMN     "email" TEXT NOT NULL;
