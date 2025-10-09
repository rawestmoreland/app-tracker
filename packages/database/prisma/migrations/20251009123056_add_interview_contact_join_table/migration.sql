-- CreateTable
CREATE TABLE "interview_contacts" (
    "id" TEXT NOT NULL,
    "interviewId" TEXT NOT NULL,
    "contactId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "interview_contacts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "interview_contacts_interviewId_contactId_key" ON "interview_contacts"("interviewId", "contactId");

-- Migrate existing data: Create InterviewContact records for contacts that have an interviewId
INSERT INTO "interview_contacts" ("id", "interviewId", "contactId", "createdAt")
SELECT
    gen_random_uuid()::text,
    "interviewId",
    "id",
    CURRENT_TIMESTAMP
FROM "contacts"
WHERE "interviewId" IS NOT NULL;

-- Drop existing foreign key constraint if it exists
ALTER TABLE "contacts" DROP CONSTRAINT IF EXISTS "contacts_companyId_fkey";

-- AlterTable: Make companyId required and drop interviewId
ALTER TABLE "contacts" ALTER COLUMN "companyId" SET NOT NULL;
ALTER TABLE "contacts" DROP COLUMN "interviewId";

-- AddForeignKey with CASCADE delete
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interview_contacts" ADD CONSTRAINT "interview_contacts_interviewId_fkey" FOREIGN KEY ("interviewId") REFERENCES "interviews"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interview_contacts" ADD CONSTRAINT "interview_contacts_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "contacts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
