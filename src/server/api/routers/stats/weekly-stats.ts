// ~/server/api/routers/stats/weekly-stats.ts
import { createTRPCRouter } from "~/server/api/trpc";
import { adminProcedure } from "../../middlewares/auth";
import { startOfWeek, endOfWeek, subWeeks } from "date-fns";

export const weeklyStatsRouter = createTRPCRouter({
  getWeeklyStats: adminProcedure.query(async ({ ctx }) => {
    const now = new Date();
    
    // This week's range
    const thisWeekStart = startOfWeek(now);
    const thisWeekEnd = endOfWeek(now);
    
    // Last week's range
    const lastWeekStart = startOfWeek(subWeeks(now, 1));
    const lastWeekEnd = endOfWeek(subWeeks(now, 1));

    // Get total counts
    const [totalUsers, totalPosts] = await Promise.all([
      ctx.db.user.count(),
      ctx.db.post.count()
    ]);

    // Get this week's stats
    const [
      membersThisWeek,
      contactsThisWeek,
      feedbackThisWeek,
      supportRequestsThisWeek,
      technicalIssuesThisWeek,
      postsThisWeek
    ] = await Promise.all([
      ctx.db.user.count({
        where: {
          joined: {
            gte: thisWeekStart,
            lte: thisWeekEnd
          }
        }
      }),
      ctx.db.contactQuery.count({
        where: {
          createdAt: {
            gte: thisWeekStart,
            lte: thisWeekEnd
          }
        }
      }),
      ctx.db.feedback.count({
        where: {
          createdAt: {
            gte: thisWeekStart,
            lte: thisWeekEnd
          }
        }
      }),
      ctx.db.supportRequest.count({
        where: {
          createdAt: {
            gte: thisWeekStart,
            lte: thisWeekEnd
          }
        }
      }),
      ctx.db.technicalIssue.count({
        where: {
          createdAt: {
            gte: thisWeekStart,
            lte: thisWeekEnd
          }
        }
      }),
      ctx.db.post.count({
        where: {
          createdAt: {
            gte: thisWeekStart,
            lte: thisWeekEnd
          }
        }
      })
    ]);

    // Get last week's stats
    const [
      membersLastWeek,
      contactsLastWeek,
      feedbackLastWeek,
      supportRequestsLastWeek,
      technicalIssuesLastWeek,
      postsLastWeek
    ] = await Promise.all([
      ctx.db.user.count({
        where: {
          joined: {
            gte: lastWeekStart,
            lte: lastWeekEnd
          }
        }
      }),
      ctx.db.contactQuery.count({
        where: {
          createdAt: {
            gte: lastWeekStart,
            lte: lastWeekEnd
          }
        }
      }),
      ctx.db.feedback.count({
        where: {
          createdAt: {
            gte: lastWeekStart,
            lte: lastWeekEnd
          }
        }
      }),
      ctx.db.supportRequest.count({
        where: {
          createdAt: {
            gte: lastWeekStart,
            lte: lastWeekEnd
          }
        }
      }),
      ctx.db.technicalIssue.count({
        where: {
          createdAt: {
            gte: lastWeekStart,
            lte: lastWeekEnd
          }
        }
      }),
      ctx.db.post.count({
        where: {
          createdAt: {
            gte: lastWeekStart,
            lte: lastWeekEnd
          }
        }
      })
    ]);

    return {
      totalUsers,
      totalPosts,
      thisWeek: {
        members: membersThisWeek,
        queries: contactsThisWeek + feedbackThisWeek + supportRequestsThisWeek,
        posts: postsThisWeek,
        technicalIssues: technicalIssuesThisWeek
      },
      lastWeek: {
        members: membersLastWeek,
        queries: contactsLastWeek + feedbackLastWeek + supportRequestsLastWeek,
        posts: postsLastWeek,
        technicalIssues: technicalIssuesLastWeek
      }
    };
  })
});