"use client";

import React from "react";
import { Table, Tag, Card, Badge, Alert, Button, Space } from "antd";
import type { TableProps } from "antd";
import {
  ExclamationCircleOutlined,
  FilterOutlined,
  SearchOutlined,
  PaperClipOutlined,
} from "@ant-design/icons";
import { api } from "~/trpc/react";
import TechnicalIssueDrawer from "./_components/TechnicalIssueDrawer";
import type { TechnicalIssue } from "./_components/technical-issues.types";
import {
  severityColors,
  severityProgress,
  issueTypeColors,
} from "./_components/technical-issues.types";

export default function TechnicalIssuesPage() {
  const [selectedSeverity, setSelectedSeverity] = React.useState<
    TechnicalIssue["severity"] | "ALL"
  >("ALL");
  const [selectedIssue, setSelectedIssue] =
    React.useState<TechnicalIssue | null>(null);
  const [drawerVisible, setDrawerVisible] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);

  const { data, isLoading } = api.adminQueryView.getTechnicalIssues.useQuery({
    page: currentPage,
    limit: 10,
  });

  const issues = data?.items ?? [];
  const totalPages = data?.totalPages ?? 0;

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
      render: (type: TechnicalIssue["issueType"]) => (
        <Tag color={issueTypeColors[type]}>{type.replace("_", " ")}</Tag>
      ),
    },
    {
      title: "Severity",
      dataIndex: "severity",
      key: "severity",
      render: (severity: TechnicalIssue["severity"]) => (
        <Tag color={severityColors[severity]}>{severity}</Tag>
      ),
      sorter: (a, b) =>
        severityProgress[a.severity] - severityProgress[b.severity],
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: TechnicalIssue["status"]) => (
        <Tag color={status === "RESOLVED" ? "green" : "blue"}>
          {status.replace("_", " ")}
        </Tag>
      ),
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
      render: (_: unknown, record: TechnicalIssue) => (
        <Button type="link" onClick={() => handleView(record)}>
          View
        </Button>
      ),
    },
  ];

  const handleView = (record: TechnicalIssue) => {
    setSelectedIssue(record);
    setDrawerVisible(true);
  };

  const filteredIssues =
    selectedSeverity === "ALL"
      ? issues
      : issues.filter((issue) => issue.severity === selectedSeverity);

  const criticalIssues = issues.filter(
    (issue) => issue.severity === "CRITICAL" && issue.status !== "RESOLVED",
  );

  const severityTyping = {
    LOW: "LOW",
    MEDIUM: "MEDIUM",
    HIGH: "HIGH",
    CRITICAL: "CRITICAL",
  } as const;

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
          {Object.entries(severityTyping).map(([key, severity]) => (
            <Badge
              key={key}
              count={issues.filter((item) => item.severity === severity).length}
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
          <Badge count={issues.length} className="cursor-pointer">
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
          dataSource={filteredIssues}
          rowKey="id"
          loading={isLoading}
          pagination={{
            total: totalPages * 10,
            pageSize: 10,
            current: currentPage,
            onChange: (page) => setCurrentPage(page),
            showSizeChanger: false,
          }}
        />
      </Card>

      <TechnicalIssueDrawer
        issue={selectedIssue}
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
      />
    </div>
  );
}
