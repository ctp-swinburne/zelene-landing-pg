-- CreateEnum
CREATE TYPE "SubmissionType" AS ENUM ('SUPPORT_REQUEST', 'CONTACT', 'FEEDBACK', 'ISSUE_REPORT');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('UNREAD', 'READ', 'IN_PROGRESS', 'WAITING_RESPONSE', 'NEEDS_REVIEW', 'RESOLVED', 'CLOSED', 'REOPENED', 'ARCHIVED', 'SPAM', 'DUPLICATE');

-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT', 'CRITICAL');

-- CreateTable
CREATE TABLE "Submission" (
    "id" TEXT NOT NULL,
    "type" "SubmissionType" NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'UNREAD',
    "priority" "Priority" NOT NULL DEFAULT 'LOW',
    "metadata" JSONB NOT NULL,
    "email" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "readAt" TIMESTAMP(3),
    "resolvedAt" TIMESTAMP(3),
    "closedAt" TIMESTAMP(3),
    "reopenedAt" TIMESTAMP(3),
    "lastResponseAt" TIMESTAMP(3),
    "adminNotes" TEXT,
    "assignedTo" TEXT,
    "duplicateOf" TEXT,
    "responsesSent" INTEGER NOT NULL DEFAULT 0,
    "statusHistory" JSONB[],
    "hasAttachments" BOOLEAN NOT NULL DEFAULT false,
    "isSpam" BOOLEAN NOT NULL DEFAULT false,
    "awaitingResponse" BOOLEAN NOT NULL DEFAULT false,
    "lastResponseFrom" TEXT,

    CONSTRAINT "Submission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Submission_type_status_priority_idx" ON "Submission"("type", "status", "priority");

-- CreateIndex
CREATE INDEX "Submission_status_createdAt_idx" ON "Submission"("status", "createdAt");

-- CreateIndex
CREATE INDEX "Submission_assignedTo_status_idx" ON "Submission"("assignedTo", "status");

-- CreateIndex
CREATE INDEX "Submission_email_type_idx" ON "Submission"("email", "type");

-- CreateIndex
CREATE INDEX "Submission_duplicateOf_idx" ON "Submission"("duplicateOf");

-- CreateIndex
CREATE INDEX "Submission_awaitingResponse_lastResponseAt_idx" ON "Submission"("awaitingResponse", "lastResponseAt");
