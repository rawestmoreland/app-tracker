/*
  Warnings:

  - You are about to drop the `application_custom_fields` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."application_custom_fields" DROP CONSTRAINT "application_custom_fields_applicationId_fkey";

-- DropTable
DROP TABLE "public"."application_custom_fields";

-- DropEnum
DROP TYPE "public"."CustomFieldType";
