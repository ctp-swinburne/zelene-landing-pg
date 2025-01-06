"use client";

import React from "react";
import { Table, Tag, Card, Select, Button, Space, Badge, Input } from "antd";
import ContactDetailDrawer from "./_components/ContactDetailDrawer";
import type { TableProps } from "antd";
import { SearchOutlined, FilterOutlined } from "@ant-design/icons";
import { api } from "~/trpc/react";
import type { RouterOutputs } from "~/trpc/react";
import { useState } from "react";

type ContactQuery = RouterOutputs["adminQueryView"]["getContacts"]["items"][0];

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

const statusColors = {
  NEW: "blue",
  IN_PROGRESS: "orange",
  RESOLVED: "green",
  CANCELLED: "red",
} as const;

const inquiryTypeColors = {
  PARTNERSHIP: "purple",
  SALES: "green",
  MEDIA: "blue",
  GENERAL: "gray",
} as const;

export default function ContactQueriesPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [statusFilter, setStatusFilter] = useState<
    (typeof QUERY_STATUSES)[keyof typeof QUERY_STATUSES] | undefined
  >();

  // Fetch contacts using tRPC
  const { data, isLoading } = api.adminQueryView.getContacts.useQuery({
    page,
    limit: pageSize,
    status: statusFilter,
  });

  // Fetch query counts for each status
  const { data: allCounts } = api.adminQueryView.getQueryCounts.useQuery({});
  const { data: newCounts } = api.adminQueryView.getQueryCounts.useQuery({
    status: "NEW",
  });
  const { data: inProgressCounts } = api.adminQueryView.getQueryCounts.useQuery(
    { status: "IN_PROGRESS" },
  );
  const { data: resolvedCounts } = api.adminQueryView.getQueryCounts.useQuery({
    status: "RESOLVED",
  });
  const { data: cancelledCounts } = api.adminQueryView.getQueryCounts.useQuery({
    status: "CANCELLED",
  });

  const getCountForStatus = (
    status: keyof typeof QUERY_STATUSES | undefined,
  ) => {
    switch (status) {
      case "NEW":
        return newCounts?.contacts ?? 0;
      case "IN_PROGRESS":
        return inProgressCounts?.contacts ?? 0;
      case "RESOLVED":
        return resolvedCounts?.contacts ?? 0;
      case "CANCELLED":
        return cancelledCounts?.contacts ?? 0;
      default:
        return allCounts?.contacts ?? 0;
    }
  };

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
      render: (type: keyof typeof INQUIRY_TYPES) => (
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
      render: (status: keyof typeof QUERY_STATUSES) => (
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
      render: (date: Date) => date.toLocaleDateString(),
      sorter: (a, b) => a.createdAt.getTime() - b.createdAt.getTime(),
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

  const [selectedQuery, setSelectedQuery] = useState<ContactQuery | null>(null);
  const [drawerVisible, setDrawerVisible] = useState(false);

  const handleView = (record: ContactQuery) => {
    setSelectedQuery(record);
    setDrawerVisible(true);
  };

  const handleStatusChange = (
    id: string,
    status: keyof typeof QUERY_STATUSES,
  ) => {
    // TODO: Implement status update mutation
    console.log("Update status:", id, status);
  };

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
          {/* All category */}
          <Badge
            count={getCountForStatus(undefined)}
            color="default"
            className="cursor-pointer"
            onClick={() => setStatusFilter(undefined)}
          >
            <Card
              size="small"
              className={
                statusFilter === undefined ? "border-2 border-blue-500" : ""
              }
            >
              ALL
            </Card>
          </Badge>

          {Object.entries(QUERY_STATUSES).map(([key, status]) => (
            <Badge
              key={key}
              count={getCountForStatus(status)}
              color={statusColors[status]}
              className="cursor-pointer"
              onClick={() => setStatusFilter(status)}
            >
              <Card
                size="small"
                className={
                  statusFilter === status ? "border-2 border-blue-500" : ""
                }
              >
                {status.replace("_", " ")}
              </Card>
            </Badge>
          ))}
        </div>

        <Table
          columns={columns}
          dataSource={data?.items}
          rowKey="id"
          loading={isLoading}
          pagination={{
            current: page,
            pageSize: pageSize,
            total: (data?.totalPages ?? 0) * pageSize,
            showSizeChanger: true,
            showQuickJumper: true,
            onChange: (page, pageSize) => {
              setPage(page);
              setPageSize(pageSize);
            },
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
