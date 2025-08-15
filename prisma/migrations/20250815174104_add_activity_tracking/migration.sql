-- CreateEnum
CREATE TYPE "public"."ActivityType" AS ENUM ('ACCOUNT_CREATED', 'PROFILE_UPDATED', 'SETTINGS_CHANGED', 'PASSWORD_CHANGED', 'APPLICATION_CREATED', 'APPLICATION_UPDATED', 'APPLICATION_DELETED', 'APPLICATION_VIEWED', 'APPLICATION_STATUS_CHANGED', 'APPLICATION_ARCHIVED', 'COMPANY_CREATED', 'COMPANY_UPDATED', 'COMPANY_DELETED', 'COMPANY_VIEWED', 'CONTACT_CREATED', 'CONTACT_UPDATED', 'CONTACT_DELETED', 'CONTACT_VIEWED', 'INTERVIEW_CREATED', 'INTERVIEW_UPDATED', 'INTERVIEW_DELETED', 'INTERVIEW_COMPLETED', 'INTERVIEW_SCHEDULED', 'INTERVIEW_RESCHEDULED', 'INTERVIEW_CANCELLED', 'NOTE_CREATED', 'NOTE_UPDATED', 'NOTE_DELETED', 'NOTE_VIEWED', 'OFFER_CREATED', 'OFFER_UPDATED', 'OFFER_DELETED', 'OFFER_ACCEPTED', 'OFFER_DECLINED', 'OFFER_NEGOTIATED', 'RESUME_UPLOADED', 'RESUME_UPDATED', 'RESUME_DELETED', 'DOCUMENT_VIEWED', 'DASHBOARD_VIEWED', 'ANALYTICS_VIEWED', 'REPORT_GENERATED', 'DATA_EXPORTED', 'FEATURE_REQUEST_CREATED', 'FEATURE_REQUEST_UPDATED', 'LOGIN', 'LOGOUT', 'SESSION_EXPIRED', 'DATA_SHARED', 'PERMISSIONS_CHANGED', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."EntityType" AS ENUM ('USER', 'APPLICATION', 'COMPANY', 'CONTACT', 'INTERVIEW', 'NOTE', 'OFFER', 'FEATURE_REQUEST', 'DOCUMENT', 'DASHBOARD', 'SETTINGS', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."Platform" AS ENUM ('WEB', 'MOBILE_IOS', 'MOBILE_ANDROID', 'API', 'OTHER');

-- CreateTable
CREATE TABLE "public"."activities" (
    "id" TEXT NOT NULL,
    "type" "public"."ActivityType" NOT NULL,
    "action" TEXT NOT NULL,
    "entityType" "public"."EntityType" NOT NULL,
    "entityId" TEXT NOT NULL,
    "entityName" TEXT,
    "description" TEXT NOT NULL,
    "metadata" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "platform" "public"."Platform",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "applicationId" TEXT,
    "companyId" TEXT,
    "contactId" TEXT,
    "interviewId" TEXT,
    "noteId" TEXT,
    "offerId" TEXT,

    CONSTRAINT "activities_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "activities_userId_createdAt_idx" ON "public"."activities"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "activities_userId_entityType_createdAt_idx" ON "public"."activities"("userId", "entityType", "createdAt");

-- CreateIndex
CREATE INDEX "activities_userId_type_createdAt_idx" ON "public"."activities"("userId", "type", "createdAt");

-- AddForeignKey
ALTER TABLE "public"."activities" ADD CONSTRAINT "activities_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."activities" ADD CONSTRAINT "activities_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "public"."applications"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."activities" ADD CONSTRAINT "activities_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."activities" ADD CONSTRAINT "activities_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "public"."contacts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."activities" ADD CONSTRAINT "activities_interviewId_fkey" FOREIGN KEY ("interviewId") REFERENCES "public"."interviews"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."activities" ADD CONSTRAINT "activities_noteId_fkey" FOREIGN KEY ("noteId") REFERENCES "public"."notes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."activities" ADD CONSTRAINT "activities_offerId_fkey" FOREIGN KEY ("offerId") REFERENCES "public"."offers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
