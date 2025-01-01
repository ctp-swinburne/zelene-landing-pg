"use client";

import { Card, Row, Col, Statistic } from "antd";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";

export default function DashboardStats() {
  const stats = [
    { title: "Active Users", value: 12538, trend: 12 },
    { title: "Open Queries", value: 28, trend: -5 },
    { title: "Pending Posts", value: 45, trend: 8 },
    { title: "Device Alerts", value: 3, trend: -15 },
  ];

  return (
    <Row gutter={16}>
      {stats.map((stat, idx) => (
        <Col span={6} key={idx}>
          <Card>
            <Statistic
              title={stat.title}
              value={stat.value}
              precision={0}
              valueStyle={{ color: stat.trend > 0 ? "#3f8600" : "#cf1322" }}
            />
            <div className="mt-2 text-sm">
              {stat.trend > 0 ? (
                <ArrowUpOutlined style={{ color: "#3f8600" }} />
              ) : (
                <ArrowDownOutlined style={{ color: "#cf1322" }} />
              )}
              <span style={{ color: stat.trend > 0 ? "#3f8600" : "#cf1322" }}>
                {Math.abs(stat.trend)}%
              </span>
            </div>
          </Card>
        </Col>
      ))}
    </Row>
  );
}
