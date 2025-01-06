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
} from "antd";
import {
  PaperClipOutlined,
  UploadOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import type { TechnicalIssue } from "./technical-issues.types";
import { severityColors } from "./technical-issues.types";
import { AttachmentList } from "./AttatchmentList";
import { Alert } from "antd";

const { TextArea } = Input;

interface TechnicalIssueDrawerProps {
  issue: TechnicalIssue | null;
  visible: boolean;
  onClose: () => void;
}

export default function TechnicalIssueDrawer({
  issue,
  visible,
  onClose,
}: TechnicalIssueDrawerProps) {
  const [response, setResponse] = React.useState("");

  if (!issue) return null;

  const getTimelineItems = () => {
    const items = [
      {
        color: "blue",
        children: (
          <>
            <p className="font-medium">Issue Reported</p>
            <p className="text-sm text-gray-500">
              Initial report received with {issue.severity.toLowerCase()}{" "}
              severity
            </p>
          </>
        ),
      },
    ];

    if (issue.status !== "NEW") {
      items.push({
        color: "green",
        children: (
          <>
            <p className="font-medium">Status Updated</p>
            <p className="text-sm text-gray-500">
              Current status: {issue.status.replace("_", " ").toLowerCase()}
            </p>
          </>
        ),
      });
    }

    return items;
  };

  return (
    <Drawer
      title={
        <div className="flex items-center justify-between">
          <span>Technical Issue Details</span>
          <Tag color={severityColors[issue.severity]} className="ml-2">
            {issue.severity}
          </Tag>
        </div>
      }
      placement="right"
      width={720}
      onClose={onClose}
      open={visible}
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
            <AttachmentList attachments={issue.attachments} />
          </div>
        )}

        <Divider />

        <div>
          <h3 className="mb-4 text-lg font-medium">Activity Timeline</h3>
          <Timeline items={getTimelineItems()} />
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
          </div>
        </div>
      </div>
    </Drawer>
  );
}
