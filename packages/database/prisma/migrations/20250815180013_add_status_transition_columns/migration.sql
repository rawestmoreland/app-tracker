-- AlterTable
ALTER TABLE "public"."activities" ADD COLUMN     "fromStatus" "public"."ApplicationStatus",
ADD COLUMN     "isProgression" BOOLEAN,
ADD COLUMN     "stageOrder" INTEGER,
ADD COLUMN     "toStatus" "public"."ApplicationStatus";

-- CreateIndex
CREATE INDEX "activities_userId_fromStatus_toStatus_idx" ON "public"."activities"("userId", "fromStatus", "toStatus");

-- CreateIndex
CREATE INDEX "activities_userId_toStatus_createdAt_idx" ON "public"."activities"("userId", "toStatus", "createdAt");

-- CreateIndex
CREATE INDEX "activities_applicationId_type_createdAt_idx" ON "public"."activities"("applicationId", "type", "createdAt");

-- CreateIndex
CREATE INDEX "activities_type_fromStatus_toStatus_idx" ON "public"."activities"("type", "fromStatus", "toStatus");
