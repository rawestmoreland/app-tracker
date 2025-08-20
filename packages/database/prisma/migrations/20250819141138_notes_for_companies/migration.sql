-- AlterTable
ALTER TABLE "public"."notes" ADD COLUMN     "companyId" TEXT;

-- AddForeignKey
ALTER TABLE "public"."notes" ADD CONSTRAINT "notes_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "public"."companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;
