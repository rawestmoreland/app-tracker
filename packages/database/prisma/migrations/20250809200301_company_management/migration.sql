/*
  Warnings:

  - The values [OFFER] on the enum `ApplicationStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateEnum
CREATE TYPE "public"."CompanyVisibility" AS ENUM ('PUBLIC', 'PRIVATE', 'GLOBAL');

-- CreateEnum
CREATE TYPE "public"."EventType" AS ENUM ('APPLICATION_SUBMITTED', 'CONFIRMATION_RECEIVED', 'RESUME_REVIEWED', 'PHONE_SCREEN_INVITE', 'PHONE_SCREEN_COMPLETED', 'TECHNICAL_INVITE', 'TECHNICAL_COMPLETED', 'ONSITE_INVITE', 'ONSITE_COMPLETED', 'REFERENCE_CHECK', 'OFFER_RECEIVED', 'OFFER_ACCEPTED', 'REJECTION_RECEIVED', 'POSITION_FILLED', 'WITHDRAWN', 'FOLLOW_UP_SENT', 'FOLLOW_UP_RECEIVED', 'NEGOTIATION_STARTED', 'CONTRACT_SENT', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."EventSource" AS ENUM ('EMAIL', 'PHONE_CALL', 'LINKEDIN', 'JOB_PORTAL', 'IN_PERSON', 'TEXT_MESSAGE', 'VIDEO_CALL', 'RECRUITER', 'REFERRAL', 'OTHER');

-- AlterEnum
BEGIN;
CREATE TYPE "public"."ApplicationStatus_new" AS ENUM ('DRAFT', 'APPLIED', 'CONFIRMATION_RECEIVED', 'UNDER_REVIEW', 'PHONE_SCREEN', 'TECHNICAL_INTERVIEW', 'ONSITE_INTERVIEW', 'REFERENCE_CHECK', 'OFFER_RECEIVED', 'OFFER_NEGOTIATING', 'ACCEPTED', 'REJECTED', 'WITHDRAWN', 'GHOSTED', 'POSITION_FILLED');
ALTER TABLE "public"."applications" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "public"."applications" ALTER COLUMN "status" TYPE "public"."ApplicationStatus_new" USING ("status"::text::"public"."ApplicationStatus_new");
ALTER TYPE "public"."ApplicationStatus" RENAME TO "ApplicationStatus_old";
ALTER TYPE "public"."ApplicationStatus_new" RENAME TO "ApplicationStatus";
DROP TYPE "public"."ApplicationStatus_old";
ALTER TABLE "public"."applications" ALTER COLUMN "status" SET DEFAULT 'APPLIED';
COMMIT;

-- AlterTable
ALTER TABLE "public"."applications" ADD COLUMN     "finalDecisionAt" TIMESTAMP(3),
ADD COLUMN     "firstInterviewAt" TIMESTAMP(3),
ADD COLUMN     "firstResponseAt" TIMESTAMP(3),
ADD COLUMN     "interviewInviteAt" TIMESTAMP(3),
ADD COLUMN     "interviewTimeHours" INTEGER,
ADD COLUMN     "lastContactAt" TIMESTAMP(3),
ADD COLUMN     "responseTimeHours" INTEGER,
ADD COLUMN     "totalProcessHours" INTEGER;

-- AlterTable
ALTER TABLE "public"."companies" ADD COLUMN     "createdBy" TEXT,
ADD COLUMN     "isGlobal" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "visibility" "public"."CompanyVisibility" NOT NULL DEFAULT 'PRIVATE';

-- CreateTable
CREATE TABLE "public"."application_events" (
    "id" TEXT NOT NULL,
    "type" "public"."EventType" NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT,
    "occurredAt" TIMESTAMP(3) NOT NULL,
    "source" "public"."EventSource" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "applicationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "application_events_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."companies" ADD CONSTRAINT "companies_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."application_events" ADD CONSTRAINT "application_events_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "public"."applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."application_events" ADD CONSTRAINT "application_events_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
