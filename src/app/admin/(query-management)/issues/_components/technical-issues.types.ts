import { z } from "zod";
import type { RouterOutputs } from "~/trpc/react";

export type TechnicalIssue =
  RouterOutputs["adminQueryView"]["getTechnicalIssues"]["items"][0];
export type TechnicalIssuesResponse =
  RouterOutputs["adminQueryView"]["getTechnicalIssues"];

export const severityColors = {
  LOW: "blue",
  MEDIUM: "orange",
  HIGH: "red",
  CRITICAL: "purple",
} as const;

export const severityProgress = {
  LOW: 25,
  MEDIUM: 50,
  HIGH: 75,
  CRITICAL: 100,
} as const;

export const issueTypeColors = {
  DEVICE: "cyan",
  PLATFORM: "blue",
  CONNECTIVITY: "green",
  SECURITY: "red",
  OTHER: "default",
} as const;
