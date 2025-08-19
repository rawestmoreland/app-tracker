/*
  Warnings:

  - You are about to drop the column `applicationsTableConfig` on the `user_preferences` table. All the data in the column will be lost.
  - Added the required column `configName` to the `user_preferences` table without a default value. This is not possible if the table is not empty.
  - Added the required column `configValue` to the `user_preferences` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."user_preferences" DROP COLUMN "applicationsTableConfig",
ADD COLUMN     "configName" TEXT NOT NULL,
ADD COLUMN     "configValue" JSONB NOT NULL;
