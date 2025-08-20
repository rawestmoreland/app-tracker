/*
  Warnings:

  - Made the column `userId` on table `notes` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."notes" ALTER COLUMN "userId" SET NOT NULL;
