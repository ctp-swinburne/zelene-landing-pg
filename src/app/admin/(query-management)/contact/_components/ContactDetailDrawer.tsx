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
  message,
} from "antd";
import type { RouterOutputs } from "~/trpc/react";
import { api } from "~/trpc/react";
import type { TimelineItemProps } from "antd/lib/timeline";

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
}: ContactDetailDrawerProps) {
  const [response, setResponse] = React.useState("");
  const utils = api.useContext();

  // Mutation for updating contact query
  const updateMutation = api.adminQueryMutations.updateContactQuery.useMutation(
    {
      onSuccess: async () => {
        message.success("Response updated successfully");
        await utils.adminQueryView.getContacts.invalidate();
        onClose();
        setResponse("");
      },
      onError: (error) => {
        message.error(`Failed to update response: ${error.message}`);
      },
    },
  );

  if (!query) return null;

  const handleSubmitResponse = () => {
    if (!response.trim()) {
      message.warning("Please enter a response");
      return;
    }

    void updateMutation.mutate({
      id: query.id,
      response: response,
      status: query.status,
    });
  };

  const handleStatusChange = (status: keyof typeof QUERY_STATUSES) => {
    void updateMutation.mutate({
      id: query.id,
      response: query.response,
      status,
    });
  };

  // Generate timeline items based on query history
  const generateTimelineItems = (): TimelineItemProps[] => {
    const items: TimelineItemProps[] = [
      {
        children: `Query received on ${query.createdAt.toLocaleDateString()}`,
        color: "blue",
        dot: <div className="h-2 w-2 rounded-full bg-blue-500" />,
      },
    ];

    if (query.response) {
      items.push({
        children: (
          <div className="text-gray-600">
            <div className="font-medium">Response:</div>
            <div>{query.response}</div>
          </div>
        ) as unknown as string, // Type assertion for Timeline compatibility
        color: "green",
        dot: <div className="h-2 w-2 rounded-full bg-green-500" />,
      });
    }

    return items;
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
            onChange={handleStatusChange}
            options={Object.values(QUERY_STATUSES).map((status) => ({
              label: status.replace("_", " "),
              value: status,
            }))}
          />
          <Button
            type="primary"
            onClick={handleSubmitResponse}
            loading={updateMutation.isPending}
          >
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
          {query.response && (
            <Descriptions.Item label="Current Response" span={2}>
              {query.response}
            </Descriptions.Item>
          )}
        </Descriptions>

        <div>
          <h3 className="mb-4 text-lg font-medium">Communication History</h3>
          <Timeline items={generateTimelineItems()} />
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
            <Button
              type="primary"
              onClick={handleSubmitResponse}
              loading={updateMutation.isPending}
            >
              Send Response
            </Button>
          </div>
        </div>
      </div>
    </Drawer>
  );
}
