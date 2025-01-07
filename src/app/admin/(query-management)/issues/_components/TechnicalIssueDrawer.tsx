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
  message,
} from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import type { TechnicalIssue } from "./technical-issues.types";
import { severityColors } from "./technical-issues.types";
import { AttachmentList } from "./AttatchmentList";
import { Alert } from "antd";
import { api } from "~/trpc/react";
import type { QueryResponseSchema } from "~/schema/admin-query-mutations";
import type { z } from "zod";

const { TextArea } = Input;

interface TechnicalIssueDrawerProps {
  issue: TechnicalIssue | null;
  visible: boolean;
  onClose: () => void;
  onStatusUpdate?: (
    id: string,
    status: z.infer<typeof QueryResponseSchema>["status"],
  ) => void;
}

export default function TechnicalIssueDrawer({
  issue,
  visible,
  onClose,
  onStatusUpdate,
}: TechnicalIssueDrawerProps) {
  const [response, setResponse] = React.useState("");
  const [status, setStatus] =
    React.useState<z.infer<typeof QueryResponseSchema>["status"]>("NEW");
  const utils = api.useContext();

  const updateIssueMutation =
    api.adminQueryMutations.updateTechnicalIssue.useMutation({
      onSuccess: () => {
        message.success("Issue updated successfully");
        utils.adminQueryView.getTechnicalIssues.invalidate().catch((error) => {
          console.error("Failed to invalidate query:", error);
          message.error("Failed to refresh data");
        });
        if (issue && onStatusUpdate) {
          onStatusUpdate(issue.id, status);
        }
        onClose();
      },
      onError: (error) => {
        message.error(error.message || "Failed to update issue");
      },
    });

  React.useEffect(() => {
    if (issue) {
      setStatus(issue.status);
      setResponse(issue.response ?? "");
    }
  }, [issue]);

  if (!issue) return null;

  const handleSubmit = () => {
    if (!issue) return;

    updateIssueMutation.mutate({
      id: issue.id,
      status,
      response,
    });
  };

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

    if (issue.response) {
      items.push({
        color: "blue",
        children: (
          <>
            <p className="font-medium">Response Added</p>
            <p className="text-sm text-gray-500">{issue.response}</p>
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
      extra={
        <Space>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            type="primary"
            onClick={handleSubmit}
            loading={updateIssueMutation.isPending}
          >
            Save Changes
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
            <Select
              value={status}
              onChange={(value) => setStatus(value)}
              style={{ width: "100%" }}
            >
              <Select.Option value="NEW">New</Select.Option>
              <Select.Option value="IN_PROGRESS">In Progress</Select.Option>
              <Select.Option value="RESOLVED">Resolved</Select.Option>
              <Select.Option value="CANCELLED">Cancelled</Select.Option>
            </Select>
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
          <h3 className="mb-2 text-lg font-medium">Response</h3>
          <div className="space-y-4">
            <TextArea
              rows={4}
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              placeholder="Add your response or update..."
            />
          </div>
        </div>
      </div>
    </Drawer>
  );
}
