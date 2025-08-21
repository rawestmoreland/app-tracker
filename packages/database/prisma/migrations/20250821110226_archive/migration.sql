/*
  Warnings:

  - Made the column `archived` on table `applications` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."applications" ALTER COLUMN "archived" SET NOT NULL,
ALTER COLUMN "archived" SET DEFAULT false;
