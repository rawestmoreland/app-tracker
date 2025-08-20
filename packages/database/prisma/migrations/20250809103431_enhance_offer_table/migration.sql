-- CreateEnum
CREATE TYPE "public"."OfferStatus" AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED', 'NEGOTIATING', 'EXPIRED', 'WITHDRAWN', 'COUNTERED');

-- CreateEnum
CREATE TYPE "public"."SalaryType" AS ENUM ('ANNUAL', 'HOURLY', 'CONTRACT', 'COMMISSION', 'MONTHLY', 'WEEKLY', 'DAILY');

-- CreateEnum
CREATE TYPE "public"."BonusType" AS ENUM ('FIXED', 'PERFORMANCE', 'TARGET', 'RETENTION', 'RELOCATION', 'ANNUAL', 'QUARTERLY');

-- CreateEnum
CREATE TYPE "public"."EquityType" AS ENUM ('STOCK_OPTIONS', 'RSU', 'ESPP', 'PHANTOM_STOCK', 'PROFIT_SHARING', 'EQUITY_GRANT', 'WARRANTS', 'CARRY');

-- CreateTable
CREATE TABLE "public"."offers" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" "public"."OfferStatus" NOT NULL DEFAULT 'PENDING',
    "baseSalary" INTEGER,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "salaryType" "public"."SalaryType" NOT NULL DEFAULT 'ANNUAL',
    "signingBonus" INTEGER,
    "annualBonus" INTEGER,
    "bonusType" "public"."BonusType",
    "bonusDetails" TEXT,
    "hasEquity" BOOLEAN NOT NULL DEFAULT false,
    "equityType" "public"."EquityType",
    "equityAmount" INTEGER,
    "equityValue" INTEGER,
    "equityVesting" TEXT,
    "strikePrice" INTEGER,
    "location" TEXT,
    "remote" "public"."RemoteType",
    "startDate" TIMESTAMP(3),
    "department" TEXT,
    "reportingTo" TEXT,
    "healthInsurance" BOOLEAN NOT NULL DEFAULT false,
    "dentalInsurance" BOOLEAN NOT NULL DEFAULT false,
    "visionInsurance" BOOLEAN NOT NULL DEFAULT false,
    "retirement401k" BOOLEAN NOT NULL DEFAULT false,
    "retirementMatch" TEXT,
    "paidTimeOff" TEXT,
    "sickLeave" TEXT,
    "parentalLeave" TEXT,
    "lifeInsurance" BOOLEAN NOT NULL DEFAULT false,
    "disabilityInsurance" BOOLEAN NOT NULL DEFAULT false,
    "flexibleSchedule" BOOLEAN NOT NULL DEFAULT false,
    "workFromHome" BOOLEAN NOT NULL DEFAULT false,
    "professionalDevelopment" TEXT,
    "gymMembership" BOOLEAN NOT NULL DEFAULT false,
    "commuter" TEXT,
    "meals" TEXT,
    "equipment" TEXT,
    "otherBenefits" TEXT[],
    "receivedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "respondedAt" TIMESTAMP(3),
    "acceptedAt" TIMESTAMP(3),
    "declinedAt" TIMESTAMP(3),
    "notes" TEXT,
    "negotiationNotes" TEXT,
    "comparisonNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,

    CONSTRAINT "offers_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."offers" ADD CONSTRAINT "offers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."offers" ADD CONSTRAINT "offers_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "public"."applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;
