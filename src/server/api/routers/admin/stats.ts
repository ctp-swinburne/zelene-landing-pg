// stats.ts
import { z } from "zod";
import { createTRPCRouter } from "~/server/api/trpc";
import { adminProcedure } from "../../middlewares/auth";
import { startOfDay, subDays, endOfDay, format } from "date-fns";

interface DayStats {
  date: string;
  newMembers: number;
  openQueries: number;
  newPosts: number;
  technicalIssues: number;
}

export const adminStatsRouter = createTRPCRouter({
  getDailyStats: adminProcedure
    .input(
      z.object({
        days: z.number().min(1).max(30).default(7),
      })
    )
    .query(async ({ ctx, input }): Promise<DayStats[]> => {
      const stats: DayStats[] = [];

      // Generate dates for the last n days
      for (let i = input.days - 1; i >= 0; i--) {
        const currentDate = subDays(new Date(), i);
        const startDate = startOfDay(currentDate);
        const endDate = endOfDay(currentDate);
        const formattedDate = format(startDate, 'yyyy-MM-dd');

        // Get current day stats
        const [
          newMembers,
          contactQueries,
          feedbackQueries,
          supportRequests,
          technicalIssues,
          posts,
        ] = await Promise.all([
          // Total regular members (excluding admins) up to this date
          ctx.db.user.count({
            where: {
              joined: {
                lte: endDate,
              },
              role: "MEMBER", // Only count users with MEMBER role
            },
          }),

          // Total active contact queries up to this date
          ctx.db.contactQuery.count({
            where: {
              createdAt: {
                lte: endDate,
              },
              status: {
                in: ["NEW", "IN_PROGRESS"]
              }
            },
          }),

          // Total active feedback up to this date
          ctx.db.feedback.count({
            where: {
              createdAt: {
                lte: endDate,
              },
              status: {
                in: ["NEW", "IN_PROGRESS"]
              }
            },
          }),

          // Total active support requests up to this date
          ctx.db.supportRequest.count({
            where: {
              createdAt: {
                lte: endDate,
              },
              status: {
                in: ["NEW", "IN_PROGRESS"]
              }
            },
          }),

          // Total active technical issues up to this date
          ctx.db.technicalIssue.count({
            where: {
              createdAt: {
                lte: endDate,
              },
              status: {
                in: ["NEW", "IN_PROGRESS"]
              }
            },
          }),

          // Total posts up to this date
          ctx.db.post.count({
            where: {
              createdAt: {
                lte: endDate,
              },
            },
          }),
        ]);

        // Calculate total active queries
        const totalActiveQueries = contactQueries + feedbackQueries + supportRequests + technicalIssues;

        stats.push({
          date: formattedDate,
          newMembers,          // Total regular members up to this date (excluding admins)
          openQueries: totalActiveQueries,  // Total active queries up to this date
          newPosts: posts,     // Total posts up to this date
          technicalIssues,     // Total active technical issues up to this date
        });
      }

      return stats;
    }),
});