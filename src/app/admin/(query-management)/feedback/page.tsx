//admin/feedback/page.tsx
"use client";

import React from "react";
import { Table, Tag, Card, Select, Button, Space } from "antd";
import type { TableProps } from "antd";
import { FilterFilled, SearchOutlined, StarFilled } from "@ant-design/icons";
import FeedbackDetailDrawer from "./_components/FeedbackDetailDrawer";
import FeedbackMetrics from "./_components/FeedbackMetrics";
const FeedbackCategory = {
  UI: "UI",
  FEATURES: "FEATURES",
  PERFORMANCE: "PERFORMANCE",
  DOCUMENTATION: "DOCUMENTATION",
  GENERAL: "GENERAL",
} as const;

const QueryStatus = {
  NEW: "NEW",
  IN_PROGRESS: "IN_PROGRESS",
  RESOLVED: "RESOLVED",
  CANCELLED: "CANCELLED",
} as const;

type QueryStatus = (typeof QueryStatus)[keyof typeof QueryStatus];
type FeedbackCategory =
  (typeof FeedbackCategory)[keyof typeof FeedbackCategory];

interface Feedback {
  id: string;
  category: FeedbackCategory;
  satisfaction: number;
  usability: number;
  features: string[];
  improvements: string;
  recommendation: boolean;
  comments?: string;
  status: QueryStatus;
  createdAt: string;
}

const categoryColors = {
  UI: "magenta",
  FEATURES: "blue",
  PERFORMANCE: "orange",
  DOCUMENTATION: "cyan",
  GENERAL: "purple",
} as const;

export default function FeedbackPage() {
  const [selectedFeedback, setSelectedFeedback] =
    React.useState<Feedback | null>(null);
  const [drawerVisible, setDrawerVisible] = React.useState(false);

  const columns: TableProps<Feedback>["columns"] = [
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (category: FeedbackCategory) => (
        <Tag color={categoryColors[category]}>{category}</Tag>
      ),
      filters: Object.values(FeedbackCategory).map((category) => ({
        text: category,
        value: category,
      })),
      onFilter: (value, record) => record.category === value,
    },
    {
      title: "Satisfaction",
      dataIndex: "satisfaction",
      key: "satisfaction",
      width: 140,
      render: (satisfaction: number) => (
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, index) => (
            <StarFilled
              key={index}
              style={{ color: index < satisfaction ? "#fadb14" : "#d9d9d9" }}
            />
          ))}
          <span className="ml-2 text-gray-500">{satisfaction}/5</span>
        </div>
      ),
      sorter: (a, b) => a.satisfaction - b.satisfaction,
    },
    {
      title: "Usability",
      dataIndex: "usability",
      key: "usability",
      width: 140,
      render: (usability: number) => (
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, index) => (
            <StarFilled
              key={index}
              style={{ color: index < usability ? "#fadb14" : "#d9d9d9" }}
            />
          ))}
          <span className="ml-2 text-gray-500">{usability}/5</span>
        </div>
      ),
      sorter: (a, b) => a.usability - b.usability,
    },
    {
      title: "Features",
      dataIndex: "features",
      key: "features",
      render: (features: string[]) => (
        <Space size={[0, 4]} wrap>
          {features.map((feature, index) => (
            <Tag key={index}>{feature}</Tag>
          ))}
        </Space>
      ),
    },
    {
      title: "Recommend",
      dataIndex: "recommendation",
      key: "recommendation",
      width: 120,
      render: (recommendation: boolean) => (
        <Tag color={recommendation ? "success" : "error"}>
          {recommendation ? "Yes" : "No"}
        </Tag>
      ),
      filters: [
        { text: "Yes", value: true },
        { text: "No", value: false },
      ],
      onFilter: (value, record) => record.recommendation === value,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status: QueryStatus) => {
        const colors = {
          NEW: "blue",
          IN_PROGRESS: "processing",
          RESOLVED: "success",
          CANCELLED: "error",
        };
        return <Tag color={colors[status]}>{status.replace("_", " ")}</Tag>;
      },
      filters: Object.values(QueryStatus).map((status) => ({
        text: status.replace("_", " "),
        value: status,
      })),
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "Action",
      key: "action",
      width: 100,
      render: (_, record: Feedback) => (
        <Button type="link" onClick={() => handleView(record)}>
          View
        </Button>
      ),
    },
  ];

  const handleView = (record: Feedback) => {
    setSelectedFeedback(record);
    setDrawerVisible(true);
  };

  const handleStatusChange = (id: string, status: QueryStatus) => {
    // Implement status update logic
    console.log("Update status:", id, status);
  };

  // Mock data for demonstration
  const mockData: Feedback[] = [
    {
      id: "1",
      category: "UI",
      satisfaction: 4,
      usability: 4,
      features: ["Dashboard", "Analytics"],
      improvements:
        "The dashboard could use better data visualization options. Charts are good but more customization would be helpful.",
      recommendation: true,
      comments: "Overall great product!",
      status: "NEW",
      createdAt: "2024-01-15T10:00:00Z",
    },
    {
      id: "2",
      category: "PERFORMANCE",
      satisfaction: 3,
      usability: 4,
      features: ["Data Processing", "Real-time Updates"],
      improvements:
        "Real-time updates could be faster. Sometimes there's a noticeable delay.",
      recommendation: true,
      status: "NEW",
      createdAt: "2024-01-16T09:30:00Z",
    },
    {
      id: "3",
      category: "FEATURES",
      satisfaction: 5,
      usability: 5,
      features: ["Export", "Reporting"],
      improvements: "Would love to see more export formats supported.",
      recommendation: true,
      status: "IN_PROGRESS",
      createdAt: "2024-01-16T14:20:00Z",
    },
    {
      id: "4",
      category: "DOCUMENTATION",
      satisfaction: 2,
      usability: 3,
      features: ["API Docs", "Tutorials"],
      improvements:
        "API documentation needs more examples and better organization.",
      recommendation: false,
      status: "NEW",
      createdAt: "2024-01-17T11:15:00Z",
    },
  ];

  return (
    <div className="space-y-4">
      <FeedbackMetrics feedbackData={mockData} />

      <Card>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">User Feedback</h1>
            <p className="text-gray-500">
              Review and manage user feedback and suggestions
            </p>
          </div>
          <Space>
            <Button icon={<FilterFilled />}>Filter</Button>
            <Button icon={<SearchOutlined />}>Search</Button>
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={mockData}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
          }}
        />
      </Card>

      <FeedbackDetailDrawer
        feedback={selectedFeedback}
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}
