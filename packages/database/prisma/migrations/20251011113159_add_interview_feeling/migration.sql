-- CreateEnum
CREATE TYPE "public"."InterviewFeeling" AS ENUM ('EXCELLENT', 'CONFIDENT', 'POSITIVE', 'NEUTRAL', 'UNCERTAIN', 'DIFFICULT', 'POOR');

-- AlterTable
ALTER TABLE "public"."interviews" ADD COLUMN     "feeling" "public"."InterviewFeeling";
