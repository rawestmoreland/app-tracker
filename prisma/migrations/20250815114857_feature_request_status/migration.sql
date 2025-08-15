-- CreateEnum
CREATE TYPE "public"."FeatureRequestStatus" AS ENUM ('PENDING', 'IMPLEMENTED', 'REJECTED');

-- AlterTable
ALTER TABLE "public"."feature_requests" ADD COLUMN     "status" "public"."FeatureRequestStatus" NOT NULL DEFAULT 'PENDING';
