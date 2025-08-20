/*
  Warnings:

  - A unique constraint covering the columns `[userId,configName]` on the table `user_preferences` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."user_preferences_userId_key";

-- CreateIndex
CREATE UNIQUE INDEX "user_preferences_userId_configName_key" ON "public"."user_preferences"("userId", "configName");
