/*
  Warnings:

  - You are about to drop the `_ContactToInterview` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."_ContactToInterview" DROP CONSTRAINT "_ContactToInterview_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_ContactToInterview" DROP CONSTRAINT "_ContactToInterview_B_fkey";

-- AlterTable
ALTER TABLE "public"."contacts" ADD COLUMN     "interviewId" TEXT;

-- DropTable
DROP TABLE "public"."_ContactToInterview";

-- AddForeignKey
ALTER TABLE "public"."contacts" ADD CONSTRAINT "contacts_interviewId_fkey" FOREIGN KEY ("interviewId") REFERENCES "public"."interviews"("id") ON DELETE SET NULL ON UPDATE CASCADE;
