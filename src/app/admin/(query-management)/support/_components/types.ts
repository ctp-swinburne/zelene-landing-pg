import type { RouterOutputs } from "~/trpc/react";

export type SupportRequest =
  RouterOutputs["adminQueryView"]["getSupportRequests"]["items"][0];

export enum Status {
  NEW = "NEW",
  IN_PROGRESS = "IN_PROGRESS",
  RESOLVED = "RESOLVED",
  CANCELLED = "CANCELLED",
}

export enum Priority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
}

export enum Category {
  ACCOUNT = "ACCOUNT",
  DEVICES = "DEVICES",
  PLATFORM = "PLATFORM",
  OTHER = "OTHER",
}
