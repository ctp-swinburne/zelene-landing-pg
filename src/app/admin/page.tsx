// admin/page.tsx
"use client";

import { type NextPage } from "next";
import { Card, Row, Col, Alert, Space } from "antd";
import DashboardStats from "./_components/DashboardStats";
import { api } from "~/trpc/react";
import { type RouterOutputs } from "~/trpc/react";
import SupportItem from "./_components/SupportItem";

type QueryCounts = RouterOutputs["adminQueryView"]["getQueryCounts"];

const AdminPage: NextPage = () => {
  const { data: newItemsCounts } = api.adminQueryView.getQueryCounts.useQuery({
    status: "NEW",
  });

  const notifications = [
    {
      type: "error" as const,
      message: "Critical device failure reported in Region EU-1",
    },
    { type: "warning" as const, message: "5 new posts pending review" },
    {
      type: "info" as const,
      message: "System maintenance scheduled for tomorrow",
    },
  ];

  const supportItems = [
    {
      title: "Contact Queries",
      desc: "Partnership, Sales, Media & General",
      path: "/admin/contact",
      badge: `${newItemsCounts?.contacts ?? 0} unread`,
    },
    {
      title: "Technical Issues",
      desc: "Device, Platform & Security reports",
      path: "/admin/issues",
      badge: `${newItemsCounts?.technicalIssues ?? 0} unread`,
    },
    {
      title: "User Feedback",
      desc: "Platform & feature feedback",
      path: "/admin/feedback",
      badge: `${newItemsCounts?.feedback ?? 0} unread`,
    },
    {
      title: "Support Center",
      desc: "Support documentation & guides",
      path: "/admin/support",
      badge: `${newItemsCounts?.supportRequests ?? 0} unread`,
    },
  ];

  return (
    <div className="space-y-8">
      <DashboardStats />

      {/* Notifications */}
      <Row gutter={[16, 16]}>
        <Col span={16}>
          <Space direction="vertical" className="w-full">
            {notifications.map((notif, idx) => (
              <Alert
                key={idx}
                message={notif.message}
                type={notif.type}
                showIcon
              />
            ))}
          </Space>
        </Col>
      </Row>

      {/* Support Items */}
      <div>
        <h2 className="mb-4 text-xl font-semibold">Support & Inquiries</h2>
        <Row gutter={[16, 16]}>
          {supportItems.map((item, idx) => (
            <Col xs={24} sm={12} md={6} key={idx}>
              <SupportItem {...item} />
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default AdminPage;
