import { Card, Row, Col, Statistic } from "antd";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import { api } from "~/trpc/react";

export default function DashboardStats() {
  // Get total counts
  const { data: totalCounts } = api.adminQueryView.getQueryCounts.useQuery({});
  
  // Get total active counts
  const { data: activeCounts } = api.adminQueryView.getQueryCounts.useQuery({
    excludeResolved: true
  });
  
  // Get weekly stats for trends
  const { data: weeklyStats, isLoading } = api.weeklyStats.getWeeklyStats.useQuery();

  const calculateGrowth = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Number(((current - previous) / previous * 100).toFixed(1));
  };

  const dashboardStats = [
    {
      title: "Total Users",
      value: weeklyStats?.totalUsers ?? 0,
      weekValue: weeklyStats?.thisWeek.members ?? 0,
      lastWeekValue: weeklyStats?.lastWeek.members ?? 0,
      description: "Total registered users"
    },
    {
      title: "Active Queries",
      value: activeCounts ? (
        activeCounts.contacts + 
        activeCounts.technicalIssues + 
        activeCounts.feedback + 
        activeCounts.supportRequests
      ) : 0,
      weekValue: weeklyStats?.thisWeek.queries ?? 0,
      lastWeekValue: weeklyStats?.lastWeek.queries ?? 0,
      description: "All active queries"
    },
    {
      title: "Total Posts",
      value: weeklyStats?.totalPosts ?? 0,
      weekValue: weeklyStats?.thisWeek.posts ?? 0,
      lastWeekValue: weeklyStats?.lastWeek.posts ?? 0,
      description: "Published posts"
    },
    {
      title: "Technical Issues",
      value: activeCounts?.technicalIssues ?? 0,
      weekValue: weeklyStats?.thisWeek.technicalIssues ?? 0,
      lastWeekValue: weeklyStats?.lastWeek.technicalIssues ?? 0,
      description: "Active technical issues"
    },
  ];

  return (
    <Row gutter={16}>
      {dashboardStats.map((stat, idx) => {
        const trend = calculateGrowth(stat.weekValue, stat.lastWeekValue);
        
        return (
          <Col span={6} key={idx}>
            <Card>
              <Statistic
                title={stat.title}
                value={stat.value}
                precision={0}
                valueStyle={{ color: trend > 0 ? "#3f8600" : "#cf1322" }}
                loading={isLoading}
              />
              {stat.description && (
                <div className="mt-1 text-xs text-gray-500">
                  {stat.description}
                </div>
              )}
              <div className="mt-2 flex items-center justify-between">
                <div className="text-sm">
                  {trend > 0 ? (
                    <ArrowUpOutlined style={{ color: "#3f8600" }} />
                  ) : trend < 0 ? (
                    <ArrowDownOutlined style={{ color: "#cf1322" }} />
                  ) : (
                    <span style={{ color: "#d4b106" }}>0%</span>
                  )}
                  {trend !== 0 && (
                    <span style={{ color: trend > 0 ? "#3f8600" : "#cf1322" }}>
                      {Math.abs(trend)}%
                    </span>
                  )}
                  <span className="ml-1 text-xs text-gray-500">vs last week</span>
                </div>
                <div className="text-sm font-medium">
                  This week: {stat.weekValue}
                </div>
              </div>
            </Card>
          </Col>
        );
      })}
    </Row>
  );
}