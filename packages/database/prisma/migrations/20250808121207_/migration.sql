/*
  Warnings:

  - You are about to drop the column `salary` on the `applications` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."applications" DROP COLUMN "salary",
ADD COLUMN     "currency" TEXT NOT NULL DEFAULT 'USD',
ADD COLUMN     "highSalary" INTEGER,
ADD COLUMN     "lowSalary" INTEGER;
