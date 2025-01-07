import React from "react";
import { Table, Tag, Button } from "antd";
import type { TableProps } from "antd";
import { type RouterOutputs } from "~/trpc/react";

type SupportRequest =
  RouterOutputs["adminQueryView"]["getSupportRequests"]["items"][0];

interface SupportRequestTableProps {
  data: SupportRequest[];
  loading?: boolean;
  onEdit: (record: SupportRequest) => void;
  pagination: {
    current: number;
    pageSize: number;
    total: number;
    onChange: (page: number, pageSize: number) => void;
  };
}

export enum Status {
  NEW = "NEW",
  IN_PROGRESS = "IN_PROGRESS",
  RESOLVED = "RESOLVED",
  CANCELLED = "CANCELLED",
}

export enum Priority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
}

export enum Category {
  ACCOUNT = "ACCOUNT",
  DEVICES = "DEVICES",
  PLATFORM = "PLATFORM",
  OTHER = "OTHER",
}

export const SupportRequestTable: React.FC<SupportRequestTableProps> = ({
  data,
  loading,
  onEdit,
  pagination,
}) => {
  const columns: TableProps<SupportRequest>["columns"] = [
    {
      title: "Subject",
      dataIndex: "subject",
      key: "subject",
      sorter: (a, b) => a.subject.localeCompare(b.subject),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      width: 120,
      render: (category: Category) => <Tag>{category}</Tag>,
      filters: [
        { text: "Account", value: Category.ACCOUNT },
        { text: "Devices", value: Category.DEVICES },
        { text: "Platform", value: Category.PLATFORM },
        { text: "Other", value: Category.OTHER },
      ],
      onFilter: (value, record) => record.category === value,
    },
    {
      title: "Priority",
      dataIndex: "priority",
      key: "priority",
      width: 100,
      render: (priority: Priority) => {
        const colors: Record<Priority, string> = {
          [Priority.LOW]: "blue",
          [Priority.MEDIUM]: "orange",
          [Priority.HIGH]: "red",
        };
        return <Tag color={colors[priority]}>{priority}</Tag>;
      },
      filters: [
        { text: "Low", value: Priority.LOW },
        { text: "Medium", value: Priority.MEDIUM },
        { text: "High", value: Priority.HIGH },
      ],
      onFilter: (value, record) => record.priority === value,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (status: Status) => {
        const colors: Record<Status, string> = {
          [Status.NEW]: "processing",
          [Status.IN_PROGRESS]: "warning",
          [Status.RESOLVED]: "success",
          [Status.CANCELLED]: "default",
        };
        return <Tag color={colors[status]}>{status}</Tag>;
      },
      filters: [
        { text: "New", value: Status.NEW },
        { text: "In Progress", value: Status.IN_PROGRESS },
        { text: "Resolved", value: Status.RESOLVED },
        { text: "Cancelled", value: Status.CANCELLED },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 150,
      render: (date: Date) => new Date(date).toLocaleDateString(),
      sorter: (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
    {
      title: "Updated At",
      dataIndex: "updatedAt",
      key: "updatedAt",
      width: 150,
      render: (date: Date) => new Date(date).toLocaleDateString(),
      sorter: (a, b) =>
        new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime(),
    },
    {
      title: "Action",
      key: "action",
      width: 100,
      render: (_, record) => (
        <Button type="link" onClick={() => onEdit(record)}>
          Respond
        </Button>
      ),
    },
  ];

  return (
    <Table<SupportRequest>
      columns={columns}
      dataSource={data}
      rowKey="id"
      loading={loading}
      pagination={{
        ...pagination,
        showSizeChanger: true,
      }}
    />
  );
};
