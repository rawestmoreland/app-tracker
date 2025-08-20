-- CreateEnum
CREATE TYPE "public"."CustomFieldType" AS ENUM ('TEXT', 'TEXTAREA', 'NUMBER', 'EMAIL', 'URL', 'DATE', 'PHONE', 'SELECT', 'CHECKBOX', 'FILE');

-- CreateTable
CREATE TABLE "public"."application_custom_fields" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "public"."CustomFieldType" NOT NULL,
    "value" TEXT,
    "isRequired" BOOLEAN NOT NULL DEFAULT false,
    "placeholder" TEXT,
    "description" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "applicationId" TEXT NOT NULL,

    CONSTRAINT "application_custom_fields_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "application_custom_fields_applicationId_name_key" ON "public"."application_custom_fields"("applicationId", "name");

-- AddForeignKey
ALTER TABLE "public"."application_custom_fields" ADD CONSTRAINT "application_custom_fields_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "public"."applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;
