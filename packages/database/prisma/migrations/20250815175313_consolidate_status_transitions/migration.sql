/*
  Warnings:

  - You are about to drop the `application_status_transitions` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."application_status_transitions" DROP CONSTRAINT "application_status_transitions_applicationId_fkey";

-- DropForeignKey
ALTER TABLE "public"."application_status_transitions" DROP CONSTRAINT "application_status_transitions_userId_fkey";

-- DropTable
DROP TABLE "public"."application_status_transitions";
