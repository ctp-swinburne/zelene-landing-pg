"use client";

import { Card, Row, Col, Statistic } from "antd";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";

interface DashboardStats {
  totalUsers: number;
  activeThisWeek: number;
  activeLastWeek: number;
  startOfThisWeek: string;
  startOfLastWeek: string;
  openQueriesThisWeek: number;
  openQueriesLastWeek: number;
  postsThisWeek: number;
  postsLastWeek: number;
  alertsThisWeek: number;
  alertsLastWeek: number;
}

export default function DashboardStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/admin/user-stats');
        const data = (await response.json()) as DashboardStats;
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    void fetchStats();
  }, []);

  const calculateGrowth = (current: number, previous: number) => {
    if (!current || !previous) return 0;
    
    if (previous === 0 && current > 0) return 100;
    
    if (previous === 0 && current === 0) return 0;
    
    const growth = ((current - previous) / previous) * 100;
    return Number(growth.toFixed(1));
  };

  const dashboardStats = [
    {
      title: "New Members This Week",
      value: stats?.activeThisWeek ?? 0,
      trend: calculateGrowth(stats?.activeThisWeek ?? 0, stats?.activeLastWeek ?? 0),
      description: stats ? `From ${new Date(stats.startOfThisWeek).toLocaleDateString()}` : ''
    },
    {
      title: "Open Queries",
      value: stats?.openQueriesThisWeek ?? 0,
      trend: calculateGrowth(stats?.openQueriesThisWeek ?? 0, stats?.openQueriesLastWeek ?? 0),
      description: "Including all types of queries"
    },
    {
      title: "New Posts",
      value: stats?.postsThisWeek ?? 0,
      trend: calculateGrowth(stats?.postsThisWeek ?? 0, stats?.postsLastWeek ?? 0),
      description: "Posts published this week"
    },
    {
      title: "Technical Issues",
      value: stats?.alertsThisWeek ?? 0,
      trend: calculateGrowth(stats?.alertsThisWeek ?? 0, stats?.alertsLastWeek ?? 0),
      description: "Unresolved device issues"
    },
  ];

  return (
    <Row gutter={16}>
      {dashboardStats.map((stat, idx) => (
        <Col span={6} key={idx}>
          <Card>
            <Statistic
              title={stat.title}
              value={stat.value}
              precision={0}
              valueStyle={{ color: stat.trend > 0 ? "#3f8600" : "#cf1322" }}
              loading={loading}
            />
            {stat.description && (
              <div className="text-xs text-gray-500 mt-1">
                {stat.description}
              </div>
            )}
            <div className="mt-2 text-sm">
              {stat.trend > 0 ? (
                <ArrowUpOutlined style={{ color: "#3f8600" }} />
              ) : stat.trend < 0 ? (
                <ArrowDownOutlined style={{ color: "#cf1322" }} />
              ) : (
                <span style={{ color: "#d4b106" }}>0%</span>
              )}
              {stat.trend !== 0 && (
                <span style={{ color: stat.trend > 0 ? "#3f8600" : "#cf1322" }}>
                  {Math.abs(stat.trend)}%
                </span>
              )}
              <span className="text-gray-500 text-xs ml-1">vs last week</span>
            </div>
          </Card>
        </Col>
      ))}
    </Row>
  );
}