-- CreateEnum
CREATE TYPE "public"."ResponseType" AS ENUM ('HUMAN', 'AUTOMATED');

-- AlterTable
ALTER TABLE "public"."application_events" ADD COLUMN     "responseType" "public"."ResponseType";
