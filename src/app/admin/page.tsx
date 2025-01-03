// admin/page.tsx
"use client";

import { type NextPage } from "next";
import { Card, Row, Col, Alert, Space } from "antd";
import Link from "next/link";
import DashboardStats from "./_components/DashboardStats";
import { api } from "~/trpc/react";

const SupportItem = ({
  title,
  desc,
  path,
  badge,
}: {
  title: string;
  desc: string;
  path: string;
  badge?: string;
}) => (
  <Link href={path}>
    <Card
      title={title}
      extra={badge && <span className="text-blue-600">{badge}</span>}
      hoverable
    >
      <p className="text-gray-500">{desc}</p>
    </Card>
  </Link>
);

const AdminPage: NextPage = () => {
  const { data: newItemsCounts } = api.adminQueryView.getQueryCounts.useQuery({
    status: "NEW",
  });
  console.log(newItemsCounts);
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

  const sections = [
    {
      title: "Support & Inquiries",
      items: [
        {
          title: "Contact Queries",
          desc: "Partnership, Sales, Media & General",
          path: "/admin/contact",
          badge: newItemsCounts?.contacts
            ? `${newItemsCounts.contacts} unread`
            : "0 unread",
        },
        {
          title: "Technical Issues",
          desc: "Device, Platform & Security reports",
          path: "/admin/issues",
          badge: newItemsCounts?.technicalIssues
            ? `${newItemsCounts.technicalIssues} unread`
            : "0 unread",
        },
        {
          title: "User Feedback",
          desc: "Platform & feature feedback",
          path: "/admin/feedback",
          badge: newItemsCounts?.feedback
            ? `${newItemsCounts.feedback} unread`
            : "0 unread",
        },
        {
          title: "Help Center",
          desc: "Support documentation & guides",
          path: "/admin/help",
          badge: newItemsCounts?.supportRequests
            ? `${newItemsCounts.supportRequests} unread`
            : "0 unread",
        },
      ],
    },
  ];

  return (
    <>
      <DashboardStats />

      <Row gutter={[16, 16]} className="mt-6">
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

      {sections.map((section, idx) => (
        <div key={idx} className="mt-8">
          <h2 className="mb-4 text-xl font-semibold">{section.title}</h2>
          <Row gutter={[16, 16]}>
            {section.items.map((item, itemIdx) => (
              <Col span={6} key={itemIdx}>
                <SupportItem {...item} />
              </Col>
            ))}
          </Row>
        </div>
      ))}
    </>
  );
};

export default AdminPage;
