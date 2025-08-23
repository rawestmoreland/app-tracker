/*
  Warnings:

  - You are about to drop the column `resume` on the `applications` table. All the data in the column will be lost.
  - You are about to drop the column `resumeName` on the `applications` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."applications" DROP COLUMN "resume",
DROP COLUMN "resumeName";
