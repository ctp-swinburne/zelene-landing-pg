// admin/issues/_components/TechnicalIssueDrawer.tsx
"use client";

import React from "react";
import {
  Drawer,
  Descriptions,
  Timeline,
  Button,
  Select,
  Input,
  Space,
  Tag,
  Divider,
  Upload,
  Progress,
  Alert,
} from "antd";
import {
  PaperClipOutlined,
  UploadOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";

const QueryStatus = {
  NEW: "NEW",
  IN_PROGRESS: "IN_PROGRESS",
  RESOLVED: "RESOLVED",
  CANCELLED: "CANCELLED",
} as const;

const IssueSeverity = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
  CRITICAL: "CRITICAL",
} as const;

type QueryStatus = (typeof QueryStatus)[keyof typeof QueryStatus];
type IssueSeverity = (typeof IssueSeverity)[keyof typeof IssueSeverity];

interface TechnicalIssue {
  id: string;
  deviceId?: string;
  issueType: string;
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

const { TextArea } = Input;

interface TechnicalIssueDrawerProps {
  issue: TechnicalIssue | null;
  visible: boolean;
  onClose: () => void;
  onStatusChange: (id: string, status: QueryStatus) => void;
}

const severityColor = {
  LOW: "blue",
  MEDIUM: "orange",
  HIGH: "red",
  CRITICAL: "purple",
} as const;

export default function TechnicalIssueDrawer({
  issue,
  visible,
  onClose,
  onStatusChange,
}: TechnicalIssueDrawerProps) {
  const [response, setResponse] = React.useState("");
  const [assignedTo, setAssignedTo] = React.useState(issue?.assignedTo ?? "");

  if (!issue) return null;

  const handleSubmitResponse = () => {
    // Implement response submission logic
    console.log("Submit response:", response);
    setResponse("");
  };

  const handleAssign = () => {
    // Implement assignment logic
    console.log("Assign to:", assignedTo);
  };

  return (
    <Drawer
      title={
        <div className="flex items-center justify-between">
          <span>Technical Issue Details</span>
          <Tag color={severityColor[issue.severity]} className="ml-2">
            {issue.severity}
          </Tag>
        </div>
      }
      placement="right"
      width={720}
      onClose={onClose}
      open={visible}
      extra={
        <Space>
          <Select
            value={issue.status}
            style={{ width: 120 }}
            onChange={(value) => onStatusChange(issue.id, value as QueryStatus)}
            options={Object.values(QueryStatus).map((status) => ({
              label: status.replace("_", " "),
              value: status,
            }))}
          />
          <Button type="primary" onClick={handleSubmitResponse}>
            Update Issue
          </Button>
        </Space>
      }
    >
      <div className="space-y-6">
        {issue.severity === "CRITICAL" && (
          <Alert
            message="Critical Issue"
            description="This issue requires immediate attention due to its critical severity level."
            type="error"
            showIcon
            icon={<ExclamationCircleOutlined />}
          />
        )}

        <Descriptions column={2} bordered>
          <Descriptions.Item label="Device ID" span={2}>
            {issue.deviceId ?? "N/A"}
          </Descriptions.Item>
          <Descriptions.Item label="Type" span={1}>
            <Tag color="blue">{issue.issueType}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Status" span={1}>
            <Tag color="green">{issue.status}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Title" span={2}>
            {issue.title}
          </Descriptions.Item>
          <Descriptions.Item label="Description" span={2}>
            {issue.description}
          </Descriptions.Item>
        </Descriptions>

        <div>
          <h3 className="mb-2 text-lg font-medium">Steps to Reproduce</h3>
          <div className="rounded-md bg-gray-50 p-4">
            <pre className="whitespace-pre-wrap">{issue.stepsToReproduce}</pre>
          </div>
        </div>

        <div>
          <h3 className="mb-2 text-lg font-medium">Expected Behavior</h3>
          <div className="rounded-md bg-gray-50 p-4">
            <pre className="whitespace-pre-wrap">{issue.expectedBehavior}</pre>
          </div>
        </div>

        {issue.attachments && issue.attachments.length > 0 && (
          <div>
            <h3 className="mb-2 text-lg font-medium">Attachments</h3>
            <div className="space-y-2">
              {issue.attachments.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-md border p-2"
                >
                  <div className="flex items-center">
                    <PaperClipOutlined className="mr-2" />
                    <span>{file}</span>
                  </div>
                  <Button size="small" type="link">
                    Download
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        <Divider />

        <div>
          <h3 className="mb-4 text-lg font-medium">Assignment</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Input
                placeholder="Assign to (email)"
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                style={{ flex: 1 }}
              />
              <Button onClick={handleAssign} type="primary">
                Assign
              </Button>
            </div>
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-lg font-medium">Activity Timeline</h3>
          <Timeline
            items={[
              {
                color: "red",
                children: (
                  <>
                    <p className="font-medium">Issue Reported</p>
                    <p className="text-sm text-gray-500">
                      Initial report received with{" "}
                      {issue.severity.toLowerCase()} severity
                    </p>
                  </>
                ),
              },
              {
                color: "blue",
                children: (
                  <>
                    <p className="font-medium">Investigation Started</p>
                    <p className="text-sm text-gray-500">
                      Technical team began investigation
                    </p>
                  </>
                ),
              },
              {
                color: "green",
                children: (
                  <>
                    <p className="font-medium">Status Updated</p>
                    <p className="text-sm text-gray-500">
                      Current status:{" "}
                      {issue.status.replace("_", " ").toLowerCase()}
                    </p>
                  </>
                ),
              },
            ]}
          />
        </div>

        <Divider />

        <div>
          <h3 className="mb-2 text-lg font-medium">Add Response</h3>
          <div className="space-y-4">
            <TextArea
              rows={4}
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              placeholder="Add your response or update..."
            />
            <Upload>
              <Button icon={<UploadOutlined />}>Attach Files</Button>
            </Upload>
            <div className="text-right">
              <Button type="primary" onClick={handleSubmitResponse}>
                Submit Response
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Drawer>
  );
}
