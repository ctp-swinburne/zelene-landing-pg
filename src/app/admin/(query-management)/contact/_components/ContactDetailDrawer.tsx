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
} from "antd";
import type { RouterOutputs } from "~/trpc/react";

const { TextArea } = Input;

type ContactQuery = RouterOutputs["adminQueryView"]["getContacts"]["items"][0];

const QUERY_STATUSES = {
  NEW: "NEW",
  IN_PROGRESS: "IN_PROGRESS",
  RESOLVED: "RESOLVED",
  CANCELLED: "CANCELLED",
} as const;

interface ContactDetailDrawerProps {
  query: ContactQuery | null;
  visible: boolean;
  onClose: () => void;
  onStatusChange: (id: string, status: keyof typeof QUERY_STATUSES) => void;
}

const statusColors = {
  NEW: "blue",
  IN_PROGRESS: "orange",
  RESOLVED: "green",
  CANCELLED: "red",
} as const;

export default function ContactDetailDrawer({
  query,
  visible,
  onClose,
  onStatusChange,
}: ContactDetailDrawerProps) {
  const [response, setResponse] = React.useState("");

  if (!query) return null;

  const handleSubmitResponse = () => {
    // TODO: Implement response mutation
    console.log("Submit response:", response);
    setResponse("");
  };

  return (
    <Drawer
      title="Contact Query Details"
      placement="right"
      width={640}
      onClose={onClose}
      open={visible}
      extra={
        <Space>
          <Select
            value={query.status}
            style={{ width: 120 }}
            onChange={(value) => onStatusChange(query.id, value)}
            options={Object.values(QUERY_STATUSES).map((status) => ({
              label: status.replace("_", " "),
              value: status,
            }))}
          />
          <Button type="primary" onClick={handleSubmitResponse}>
            Send Response
          </Button>
        </Space>
      }
    >
      <div className="space-y-6">
        <Descriptions column={2} bordered>
          <Descriptions.Item label="Organization" span={2}>
            {query.organization}
          </Descriptions.Item>
          <Descriptions.Item label="Contact Name" span={2}>
            {query.name}
          </Descriptions.Item>
          <Descriptions.Item label="Email">{query.email}</Descriptions.Item>
          <Descriptions.Item label="Phone">{query.phone}</Descriptions.Item>
          <Descriptions.Item label="Type" span={2}>
            <Tag color="blue">{query.inquiryType}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Status" span={2}>
            <Tag color={statusColors[query.status]}>
              {query.status.replace("_", " ")}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Message" span={2}>
            {query.message}
          </Descriptions.Item>
        </Descriptions>

        <div>
          <h3 className="mb-4 text-lg font-medium">Communication History</h3>
          <Timeline
            items={[
              {
                children: `Query received on ${query.createdAt.toLocaleDateString()}`,
                color: "blue",
                dot: <div className="h-2 w-2 rounded-full bg-blue-500" />,
              },
              // TODO: Add actual communication history from API
            ]}
          />
        </div>

        <div>
          <h3 className="mb-2 text-lg font-medium">Send Response</h3>
          <TextArea
            rows={4}
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            placeholder="Type your response here..."
          />
          <div className="mt-2 text-right">
            <Button type="primary" onClick={handleSubmitResponse}>
              Send Response
            </Button>
          </div>
        </div>
      </div>
    </Drawer>
  );
}
