// app/api/admin/user-stats/route.ts
import { NextResponse } from "next/server";
import { db } from "~/server/db";

export async function GET() {
  try {
    const now = new Date();
    
    const startOfThisWeek = new Date(now);
    startOfThisWeek.setHours(0, 0, 0, 0);
    startOfThisWeek.setDate(now.getDate() - now.getDay());
    
    const startOfLastWeek = new Date(startOfThisWeek);
    startOfLastWeek.setDate(startOfLastWeek.getDate() - 7);
    
    const endOfLastWeek = new Date(startOfThisWeek);
    endOfLastWeek.setMilliseconds(-1);

    // User stats
    const [activeThisWeek, activeLastWeek, totalUsers] = await Promise.all([
      db.user.count({
        where: {
          role: 'MEMBER',
          joined: {
            gte: startOfThisWeek,
            lt: now
          }
        }
      }),
      db.user.count({
        where: {
          role: 'MEMBER',
          joined: {
            gte: startOfLastWeek,
            lt: endOfLastWeek
          }
        }
      }),
      db.user.count({
        where: {
          role: 'MEMBER'
        }
      })
    ]);

    // Queries stats
    const [openQueriesThisWeek, openQueriesLastWeek] = await Promise.all([
      Promise.all([
        db.contactQuery.count({
          where: {
            status: { in: ['NEW', 'IN_PROGRESS'] },
            createdAt: { gte: startOfThisWeek }
          }
        }),
        db.feedback.count({
          where: {
            status: { in: ['NEW', 'IN_PROGRESS'] },
            createdAt: { gte: startOfThisWeek }
          }
        }),
        db.supportRequest.count({
          where: {
            status: { in: ['NEW', 'IN_PROGRESS'] },
            createdAt: { gte: startOfThisWeek }
          }
        }),
        db.technicalIssue.count({
          where: {
            status: { in: ['NEW', 'IN_PROGRESS'] },
            createdAt: { gte: startOfThisWeek }
          }
        })
      ]).then(counts => counts.reduce((a, b) => a + b, 0)),
      Promise.all([
        db.contactQuery.count({
          where: {
            status: { in: ['NEW', 'IN_PROGRESS'] },
            createdAt: { 
              gte: startOfLastWeek,
              lt: endOfLastWeek
            }
          }
        }),
        db.feedback.count({
          where: {
            status: { in: ['NEW', 'IN_PROGRESS'] },
            createdAt: { 
              gte: startOfLastWeek,
              lt: endOfLastWeek
            }
          }
        }),
        db.supportRequest.count({
          where: {
            status: { in: ['NEW', 'IN_PROGRESS'] },
            createdAt: { 
              gte: startOfLastWeek,
              lt: endOfLastWeek
            }
          }
        }),
        db.technicalIssue.count({
          where: {
            status: { in: ['NEW', 'IN_PROGRESS'] },
            createdAt: { 
              gte: startOfLastWeek,
              lt: endOfLastWeek
            }
          }
        })
      ]).then(counts => counts.reduce((a, b) => a + b, 0))
    ]);

    // Posts stats
    const [postsThisWeek, postsLastWeek] = await Promise.all([
      db.post.count({
        where: {
          publishedAt: {
            gte: startOfThisWeek,
            lt: now
          }
        }
      }),
      db.post.count({
        where: {
          publishedAt: {
            gte: startOfLastWeek,
            lt: endOfLastWeek
          }
        }
      })
    ]);

    // Device Alerts (Technical Issues) stats
    const [alertsThisWeek, alertsLastWeek] = await Promise.all([
      db.technicalIssue.count({
        where: {
          status: { not: 'RESOLVED' },
          createdAt: {
            gte: startOfThisWeek,
            lt: now
          }
        }
      }),
      db.technicalIssue.count({
        where: {
          status: { not: 'RESOLVED' },
          createdAt: {
            gte: startOfLastWeek,
            lt: endOfLastWeek
          }
        }
      })
    ]);

    return NextResponse.json({
      // User stats
      totalUsers,
      activeThisWeek,
      activeLastWeek,
      startOfThisWeek,
      startOfLastWeek,
      
      // Queries stats
      openQueriesThisWeek,
      openQueriesLastWeek,

      // Posts stats
      postsThisWeek,
      postsLastWeek,

      // Device Alerts stats
      alertsThisWeek,
      alertsLastWeek
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}