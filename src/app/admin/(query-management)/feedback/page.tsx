//admin/feedback/page.tsx
"use client";

import React from "react";
import { Table, Tag, Card, Button, Space } from "antd";
import type { TableProps } from "antd";
import { FilterFilled, SearchOutlined, StarFilled } from "@ant-design/icons";
import { api } from "~/trpc/react";
import type { RouterOutputs } from "~/trpc/react";
import FeedbackDetailDrawer from "./_components/FeedbackDetailDrawer";
import FeedbackMetrics from "./_components/FeedbackMetrics";
import { FeedbackSchema } from "~/schema/admin-query-schema";

type FeedbackData = RouterOutputs["adminQueryView"]["getFeedback"];
type FeedbackItem = FeedbackData["items"][0];

const categoryColors: Record<FeedbackItem["category"], string> = {
  UI: "magenta",
  FEATURES: "blue",
  PERFORMANCE: "orange",
  DOCUMENTATION: "cyan",
  GENERAL: "purple",
};

export default function FeedbackPage() {
  const [selectedFeedback, setSelectedFeedback] =
    React.useState<FeedbackItem | null>(null);
  const [drawerVisible, setDrawerVisible] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);

  const { data, isLoading } = api.adminQueryView.getFeedback.useQuery({
    page: currentPage,
    limit: pageSize,
  });

  const columns: TableProps<FeedbackItem>["columns"] = [
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (category: FeedbackItem["category"]) => (
        <Tag color={categoryColors[category]}>{category}</Tag>
      ),
      filters: Object.entries(FeedbackSchema.shape.category.enum).map(
        ([key]) => ({
          text: key,
          value: key,
        }),
      ),
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
      render: (status: FeedbackItem["status"]) => {
        const colors = {
          NEW: "blue",
          IN_PROGRESS: "processing",
          RESOLVED: "success",
          CANCELLED: "error",
        };
        return <Tag color={colors[status]}>{status.replace("_", " ")}</Tag>;
      },
      filters: Object.entries(FeedbackSchema.shape.status.enum).map(
        ([key]) => ({
          text: key.replace("_", " "),
          value: key,
        }),
      ),
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: Date) => new Date(date).toLocaleString(),
      sorter: (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
    {
      title: "Action",
      key: "action",
      width: 100,
      render: (_, record: FeedbackItem) => (
        <Button type="link" onClick={() => handleView(record)}>
          View
        </Button>
      ),
    },
  ];

  const handleView = (record: FeedbackItem) => {
    setSelectedFeedback(record);
    setDrawerVisible(true);
  };

  return (
    <div className="space-y-4">
      {data?.items && <FeedbackMetrics feedbackData={data.items} />}

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
          dataSource={data?.items}
          rowKey="id"
          loading={isLoading}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: data?.totalPages ? data.totalPages * pageSize : 0,
            showSizeChanger: true,
            showQuickJumper: true,
            onChange: (page, size) => {
              setCurrentPage(page);
              setPageSize(size);
            },
          }}
        />
      </Card>

      <FeedbackDetailDrawer
        feedback={selectedFeedback}
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
      />
    </div>
  );
}
