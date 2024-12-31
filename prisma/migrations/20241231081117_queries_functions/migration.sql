-- CreateEnum
CREATE TYPE "QueryStatus" AS ENUM ('NEW', 'IN_PROGRESS', 'RESOLVED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "InquiryType" AS ENUM ('PARTNERSHIP', 'SALES', 'MEDIA', 'GENERAL');

-- CreateEnum
CREATE TYPE "FeedbackCategory" AS ENUM ('UI', 'FEATURES', 'PERFORMANCE', 'DOCUMENTATION', 'GENERAL');

-- CreateEnum
CREATE TYPE "IssueType" AS ENUM ('DEVICE', 'PLATFORM', 'CONNECTIVITY', 'SECURITY', 'OTHER');

-- CreateEnum
CREATE TYPE "IssueSeverity" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "SupportCategory" AS ENUM ('ACCOUNT', 'DEVICES', 'PLATFORM', 'OTHER');

-- CreateEnum
CREATE TYPE "SupportPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateTable
CREATE TABLE "ContactQuery" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "organization" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "inquiryType" "InquiryType" NOT NULL,
    "message" TEXT NOT NULL,
    "status" "QueryStatus" NOT NULL DEFAULT 'NEW',

    CONSTRAINT "ContactQuery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Feedback" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "category" "FeedbackCategory" NOT NULL,
    "satisfaction" DOUBLE PRECISION NOT NULL,
    "usability" DOUBLE PRECISION NOT NULL,
    "features" TEXT[],
    "improvements" TEXT NOT NULL,
    "recommendation" BOOLEAN NOT NULL,
    "comments" TEXT,
    "status" "QueryStatus" NOT NULL DEFAULT 'NEW',

    CONSTRAINT "Feedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupportRequest" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "category" "SupportCategory" NOT NULL,
    "subject" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "priority" "SupportPriority" NOT NULL,
    "status" "QueryStatus" NOT NULL DEFAULT 'NEW',

    CONSTRAINT "SupportRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TechnicalIssue" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deviceId" TEXT,
    "issueType" "IssueType" NOT NULL,
    "severity" "IssueSeverity" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "stepsToReproduce" TEXT NOT NULL,
    "expectedBehavior" TEXT NOT NULL,
    "attachments" TEXT[],
    "status" "QueryStatus" NOT NULL DEFAULT 'NEW',

    CONSTRAINT "TechnicalIssue_pkey" PRIMARY KEY ("id")
);
