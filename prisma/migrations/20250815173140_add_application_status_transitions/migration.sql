-- CreateTable
CREATE TABLE "public"."application_status_transitions" (
    "id" TEXT NOT NULL,
    "fromStatus" "public"."ApplicationStatus",
    "toStatus" "public"."ApplicationStatus" NOT NULL,
    "transitionAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reason" TEXT,
    "isProgression" BOOLEAN NOT NULL DEFAULT true,
    "stageOrder" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "applicationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "application_status_transitions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."application_status_transitions" ADD CONSTRAINT "application_status_transitions_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "public"."applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."application_status_transitions" ADD CONSTRAINT "application_status_transitions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
