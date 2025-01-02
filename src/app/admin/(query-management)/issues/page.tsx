// admin/issues/page.tsx
"use client";

import React from "react";
import {
  Table,
  Tag,
  Card,
  Select,
  Button,
  Space,
  Badge,
  Alert,
  Progress,
} from "antd";
import type { TableProps } from "antd";
import {
  ExclamationCircleOutlined,
  FilterOutlined,
  SearchOutlined,
  PaperClipOutlined,
} from "@ant-design/icons";
import TechnicalIssueDrawer from "./_components/TechnicalIssueDrawer";

// Properly define the enums here since we can't directly import from Zod
const QueryStatus = {
  NEW: "NEW",
  IN_PROGRESS: "IN_PROGRESS",
  RESOLVED: "RESOLVED",
  CANCELLED: "CANCELLED",
} as const;

const IssueType = {
  DEVICE: "DEVICE",
  PLATFORM: "PLATFORM",
  CONNECTIVITY: "CONNECTIVITY",
  SECURITY: "SECURITY",
  OTHER: "OTHER",
} as const;

const IssueSeverity = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
  CRITICAL: "CRITICAL",
} as const;

type QueryStatus = (typeof QueryStatus)[keyof typeof QueryStatus];
type IssueType = (typeof IssueType)[keyof typeof IssueType];
type IssueSeverity = (typeof IssueSeverity)[keyof typeof IssueSeverity];

interface TechnicalIssue {
  id: string;
  deviceId?: string;
  issueType: IssueType;
  severity: IssueSeverity;
  title: string;
  description: string;
  stepsToReproduce: string;
  expectedBehavior: string;
  attachments?: string[];
  status: QueryStatus;
  createdAt: string;
  assignedTo?: string;
}

const severityColors = {
  LOW: "blue",
  MEDIUM: "orange",
  HIGH: "red",
  CRITICAL: "purple",
} as const;

const severityProgress = {
  LOW: 25,
  MEDIUM: 50,
  HIGH: 75,
  CRITICAL: 100,
} as const;

const issueTypeColors = {
  DEVICE: "cyan",
  PLATFORM: "blue",
  CONNECTIVITY: "green",
  SECURITY: "red",
  OTHER: "default",
} as const;

export default function TechnicalIssuesPage() {
  const [selectedSeverity, setSelectedSeverity] = React.useState<
    IssueSeverity | "ALL"
  >("ALL");
  const [selectedIssue, setSelectedIssue] =
    React.useState<TechnicalIssue | null>(null);
  const [drawerVisible, setDrawerVisible] = React.useState(false);

  const columns: TableProps<TechnicalIssue>["columns"] = [
    {
      title: "Issue",
      dataIndex: "title",
      key: "title",
      render: (text: string, record: TechnicalIssue) => (
        <div>
          <div className="font-medium">{text}</div>
          <div className="text-sm text-gray-500">
            {record.deviceId && (
              <span className="mr-2">Device: {record.deviceId}</span>
            )}
            {record.attachments && record.attachments.length > 0 && (
              <span className="text-blue-500">
                <PaperClipOutlined /> {record.attachments.length} files
              </span>
            )}
          </div>
        </div>
      ),
    },
    {
      title: "Type",
      dataIndex: "issueType",
      key: "issueType",
      render: (type: IssueType) => (
        <Tag color={issueTypeColors[type]}>{type.replace("_", " ")}</Tag>
      ),
      filters: Object.values(IssueType).map((type) => ({
        text: type.replace("_", " "),
        value: type,
      })),
      onFilter: (value, record) => record.issueType === value,
    },
    {
      title: "Severity",
      dataIndex: "severity",
      key: "severity",
      render: (severity: IssueSeverity) => (
        <Tag color={severityColors[severity]}>{severity}</Tag>
      ),
      filters: Object.values(IssueSeverity).map((severity) => ({
        text: severity,
        value: severity,
      })),
      onFilter: (value, record) => record.severity === value,
      sorter: (a, b) =>
        severityProgress[a.severity] - severityProgress[b.severity],
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: QueryStatus) => (
        <Tag color={status === "RESOLVED" ? "green" : "blue"}>
          {status.replace("_", " ")}
        </Tag>
      ),
      filters: Object.values(QueryStatus).map((status) => ({
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
      render: (_, record: TechnicalIssue) => (
        <Space size="middle">
          <Button type="link" onClick={() => handleView(record)}>
            View
          </Button>
          <Select
            defaultValue={record.status}
            style={{ width: 120 }}
            onChange={(value) =>
              handleStatusChange(record.id, value as QueryStatus)
            }
            options={Object.values(QueryStatus).map((status) => ({
              label: status.replace("_", " "),
              value: status,
            }))}
          />
        </Space>
      ),
    },
  ];

  const handleView = (record: TechnicalIssue) => {
    setSelectedIssue(record);
    setDrawerVisible(true);
  };

  const handleStatusChange = (id: string, status: QueryStatus) => {
    // Implement status update logic
    console.log("Update status:", id, status);
  };

  // Mock data for demonstration
  const mockData: TechnicalIssue[] = [
    {
      id: "1",
      deviceId: "DEV-001",
      issueType: "DEVICE",
      severity: "CRITICAL",
      title: "Device offline in production environment",
      description: "Device suddenly went offline during peak hours",
      stepsToReproduce: "1. Monitor device status\n2. Observe connection drops",
      expectedBehavior: "Device should maintain stable connection",
      attachments: ["logs.txt", "diagnostics.json"],
      status: "NEW",
      createdAt: "2024-01-15T10:00:00Z",
      assignedTo: "tech.support@company.com",
    },
    {
      id: "2",
      deviceId: "DEV-002",
      issueType: "CONNECTIVITY",
      severity: "HIGH",
      title: "Intermittent connection issues",
      description: "Users reporting frequent disconnections",
      stepsToReproduce:
        "1. Connect to network\n2. Monitor connection stability",
      expectedBehavior: "Stable connection without drops",
      status: "IN_PROGRESS",
      createdAt: "2024-01-16T09:30:00Z",
    },
    {
      id: "3",
      deviceId: "DEV-003",
      issueType: "SECURITY",
      severity: "CRITICAL",
      title: "Unauthorized access attempts detected",
      description: "Multiple failed login attempts from unknown IP",
      stepsToReproduce: "1. Check security logs\n2. Analyze access patterns",
      expectedBehavior: "No unauthorized access attempts",
      attachments: ["security_logs.txt"],
      status: "IN_PROGRESS",
      createdAt: "2024-01-16T14:20:00Z",
      assignedTo: "security@company.com",
    },
    {
      id: "4",
      deviceId: "DEV-004",
      issueType: "PLATFORM",
      severity: "MEDIUM",
      title: "Dashboard loading slowly",
      description: "Users experiencing delays in dashboard updates",
      stepsToReproduce: "1. Open dashboard\n2. Wait for data load",
      expectedBehavior: "Dashboard should load within 2 seconds",
      status: "NEW",
      createdAt: "2024-01-17T11:15:00Z",
    },
    {
      id: "5",
      deviceId: "DEV-005",
      issueType: "DEVICE",
      severity: "LOW",
      title: "Minor display glitch",
      description: "Status indicator showing wrong color",
      stepsToReproduce: "1. Check device status\n2. Compare with actual state",
      expectedBehavior: "Status indicator matches actual state",
      status: "NEW",
      createdAt: "2024-01-17T16:45:00Z",
    },
  ];

  const filteredData =
    selectedSeverity === "ALL"
      ? mockData
      : mockData.filter((issue) => issue.severity === selectedSeverity);

  const criticalIssues = mockData.filter(
    (issue) => issue.severity === "CRITICAL" && issue.status !== "RESOLVED",
  );

  return (
    <div className="space-y-4">
      {criticalIssues.length > 0 && (
        <Alert
          message={`${criticalIssues.length} Critical Issues Require Immediate Attention`}
          type="error"
          showIcon
          icon={<ExclamationCircleOutlined />}
          action={
            <Button size="small" danger>
              View Critical Issues
            </Button>
          }
        />
      )}

      <Card>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Technical Issues</h1>
            <p className="text-gray-500">
              Manage and track technical issues and device problems
            </p>
          </div>
          <Space>
            <Button icon={<FilterOutlined />}>Filter</Button>
            <Button icon={<SearchOutlined />}>Search</Button>
          </Space>
        </div>

        <div className="mb-4 flex gap-4">
          {Object.entries(IssueSeverity).map(([key, severity]) => (
            <Badge
              key={key}
              count={
                mockData.filter((item) => item.severity === severity).length
              }
              color={severityColors[severity]}
              className="cursor-pointer"
            >
              <Card
                size="small"
                className={
                  selectedSeverity === severity
                    ? "border-2 border-blue-500"
                    : ""
                }
                onClick={() => setSelectedSeverity(severity)}
              >
                {severity}
              </Card>
            </Badge>
          ))}
          <Badge count={mockData.length} className="cursor-pointer">
            <Card
              size="small"
              className={
                selectedSeverity === "ALL" ? "border-2 border-blue-500" : ""
              }
              onClick={() => setSelectedSeverity("ALL")}
            >
              ALL
            </Card>
          </Badge>
        </div>

        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          pagination={{
            total: filteredData.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
          }}
        />
      </Card>

      <TechnicalIssueDrawer
        issue={selectedIssue}
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}
