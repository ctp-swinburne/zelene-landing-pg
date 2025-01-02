// admin/contact/page.tsx
"use client";

import React from "react";
import { Table, Tag, Card, Select, Button, Space, Badge, Input } from "antd";
import ContactDetailDrawer from "./_components/ContactDetailDrawer";
import type { TableProps } from "antd";
import { SearchOutlined, FilterOutlined } from "@ant-design/icons";
import type { QueryStatus, InquiryType } from "~/schema/queries";

const INQUIRY_TYPES = {
  PARTNERSHIP: "PARTNERSHIP",
  SALES: "SALES",
  MEDIA: "MEDIA",
  GENERAL: "GENERAL",
} as const;

const QUERY_STATUSES = {
  NEW: "NEW",
  IN_PROGRESS: "IN_PROGRESS",
  RESOLVED: "RESOLVED",
  CANCELLED: "CANCELLED",
} as const;

export interface ContactQuery {
  id: string;
  name: string;
  organization: string;
  email: string;
  phone: string;
  inquiryType: InquiryType;
  message: string;
  status: QueryStatus;
  createdAt: string;
}

const statusColors = {
  NEW: "blue",
  IN_PROGRESS: "orange",
  RESOLVED: "green",
  CANCELLED: "red",
};

const inquiryTypeColors = {
  PARTNERSHIP: "purple",
  SALES: "green",
  MEDIA: "blue",
  GENERAL: "gray",
};

export default function ContactQueriesPage() {
  const columns: TableProps<ContactQuery>["columns"] = [
    {
      title: "Organization",
      dataIndex: "organization",
      key: "organization",
      render: (text: string, record: ContactQuery) => (
        <div>
          <div className="font-medium">{text}</div>
          <div className="text-sm text-gray-500">{record.name}</div>
        </div>
      ),
      sorter: (a, b) => a.organization.localeCompare(b.organization),
    },
    {
      title: "Contact",
      dataIndex: "contact",
      key: "contact",
      render: (_: unknown, record: ContactQuery) => (
        <div>
          <div>{record.email}</div>
          <div className="text-sm text-gray-500">{record.phone}</div>
        </div>
      ),
    },
    {
      title: "Type",
      dataIndex: "inquiryType",
      key: "inquiryType",
      render: (type: InquiryType) => (
        <Tag color={inquiryTypeColors[type]}>{type}</Tag>
      ),
      filters: Object.values(INQUIRY_TYPES).map((type) => ({
        text: type,
        value: type,
      })),
      onFilter: (value, record) => record.inquiryType === value,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: QueryStatus) => (
        <Tag color={statusColors[status]}>{status.replace("_", " ")}</Tag>
      ),
      filters: Object.values(QUERY_STATUSES).map((status) => ({
        text: status.replace("_", " "),
        value: status,
      })),
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => new Date(date).toLocaleDateString(),
      sorter: (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record: ContactQuery) => (
        <Space size="middle">
          <Button type="link" onClick={() => handleView(record)}>
            View
          </Button>
          <Select
            defaultValue={record.status}
            style={{ width: 120 }}
            onChange={(value) => handleStatusChange(record.id, value)}
            options={Object.values(QUERY_STATUSES).map((status) => ({
              label: status.replace("_", " "),
              value: status,
            }))}
          />
        </Space>
      ),
    },
  ];

  const [selectedQuery, setSelectedQuery] = React.useState<ContactQuery | null>(
    null,
  );
  const [drawerVisible, setDrawerVisible] = React.useState(false);

  const handleView = (record: ContactQuery) => {
    setSelectedQuery(record);
    setDrawerVisible(true);
  };

  const handleStatusChange = (id: string, status: QueryStatus) => {
    // Implement status update logic
    console.log("Update status:", id, status);
  };

  // Mock data for demonstration
  const mockData: ContactQuery[] = [
    {
      id: "1",
      name: "John Doe",
      organization: "Tech Corp",
      email: "john@techcorp.com",
      phone: "+1234567890",
      inquiryType: "PARTNERSHIP",
      message: "Interested in partnership opportunities",
      status: "NEW",
      createdAt: "2024-01-15T10:00:00Z",
    },
    // Add more mock data as needed
  ];

  return (
    <div className="space-y-4">
      <Card>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Contact Queries</h1>
            <p className="text-gray-500">
              Manage and respond to incoming contact requests
            </p>
          </div>
          <Space>
            <Button icon={<FilterOutlined />}>Filter</Button>
            <Button icon={<SearchOutlined />}>Search</Button>
          </Space>
        </div>

        <div className="mb-4 flex gap-4">
          {Object.entries(QUERY_STATUSES).map(([key, status]) => (
            <Badge
              key={key}
              count={mockData.filter((item) => item.status === status).length}
              color={statusColors[status]}
              className="cursor-pointer"
            >
              <Card size="small">{status.replace("_", " ")}</Card>
            </Badge>
          ))}
        </div>

        <Table
          columns={columns}
          dataSource={mockData}
          rowKey="id"
          pagination={{
            total: mockData.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
          }}
        />
      </Card>

      <ContactDetailDrawer
        query={selectedQuery}
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}
