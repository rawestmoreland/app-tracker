-- CreateEnum
CREATE TYPE "public"."SignupReason" AS ENUM ('BETWEEN_JOBS', 'JUST_GRADUATED', 'EMPLOYED_AND_LOOKING', 'OTHER');

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "isDonor" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "signupReason" "public"."SignupReason" DEFAULT 'OTHER';
