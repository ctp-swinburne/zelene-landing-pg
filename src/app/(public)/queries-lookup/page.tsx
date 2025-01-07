"use client";
import { useState } from "react";
import { Input, Typography, Card, Tag, Descriptions, Empty, Steps } from "antd";
import { SearchOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { api } from "~/trpc/react";
import type { RouterOutputs } from "~/trpc/react";

const { Title, Text } = Typography;

const statusColors = {
  NEW: "blue",
  IN_PROGRESS: "processing",
  RESOLVED: "success",
  CANCELLED: "error",
} as const;

const typeLabels = {
  contact: "Contact Query",
  feedback: "Feedback",
  support: "Support Request",
  technical: "Technical Issue",
} as const;

const QueryDetails = ({
  result,
}: {
  result: NonNullable<RouterOutputs["queryLookup"]["getQueryById"]>;
}) => {
  const { type, data } = result;

  // Render different content based on query type
  const renderContent = () => {
    switch (type) {
      case "contact":
        return [
          { label: "Type", children: "Contact Query" },
          { label: "Name", children: data.name },
          { label: "Organization", children: data.organization },
          { label: "Email", children: data.email },
          { label: "Phone", children: data.phone },
          { label: "Inquiry Type", children: data.inquiryType },
          { label: "Message", span: 3, children: data.message },
        ];
      case "feedback":
        return [
          { label: "Type", children: "Feedback" },
          { label: "Category", children: data.category },
          { label: "Satisfaction", children: `${data.satisfaction}/5` },
          { label: "Features Used", children: data.features.join(", ") },
          { label: "Improvements", span: 3, children: data.improvements },
        ];
      case "support":
        return [
          { label: "Type", children: "Support Request" },
          { label: "Category", children: data.category },
          {
            label: "Priority",
            children: (
              <Tag color={data.priority === "HIGH" ? "error" : "default"}>
                {data.priority}
              </Tag>
            ),
          },
          { label: "Subject", children: data.subject },
          { label: "Description", span: 3, children: data.description },
        ];
      case "technical":
        return [
          { label: "Type", children: "Technical Issue" },
          { label: "Issue Type", children: data.issueType },
          {
            label: "Severity",
            children: (
              <Tag color={data.severity === "CRITICAL" ? "error" : "default"}>
                {data.severity}
              </Tag>
            ),
          },
          { label: "Title", children: data.title },
          { label: "Description", span: 3, children: data.description },
          {
            label: "Steps to Reproduce",
            span: 3,
            children: data.stepsToReproduce,
          },
          {
            label: "Expected Behavior",
            span: 3,
            children: data.expectedBehavior,
          },
        ];
    }
  };

  const commonItems = [
    {
      label: "Status",
      children: <Tag color={statusColors[data.status]}>{data.status}</Tag>,
    },
    {
      label: "Created",
      children: new Date(data.createdAt).toLocaleDateString(),
    },
    {
      label: "Last Updated",
      children: new Date(data.updatedAt).toLocaleDateString(),
    },
  ];

  const responseItem = data.response
    ? [
        {
          label: "Response",
          span: 3,
          children: (
            <Card size="small" className="bg-gray-50">
              {data.response}
            </Card>
          ),
        },
      ]
    : [];

  return (
    <Card className="mt-6">
      <Descriptions
        bordered
        column={3}
        items={[...commonItems, ...renderContent(), ...responseItem]}
      />
    </Card>
  );
};

const QueryLookupPage = () => {
  const [queryId, setQueryId] = useState("");
  const {
    data: result,
    error,
    isLoading,
  } = api.queryLookup.getQueryById.useQuery(
    { id: queryId },
    { enabled: queryId.length > 0, retry: false },
  );

  return (
    <div className="mx-auto max-w-5xl p-6">
      <Title level={2}>Query Lookup</Title>
      <Text type="secondary" className="mb-6 block">
        Enter your query ID to check its status and details
      </Text>

      <Input.Search
        size="large"
        placeholder="Enter your query ID"
        loading={isLoading}
        value={queryId}
        onChange={(e) => setQueryId(e.target.value)}
        status={error ? "error" : ""}
        className="max-w-xl"
      />

      {error && (
        <Text type="danger" className="mt-2 block">
          Invalid query ID
        </Text>
      )}

      {result ? (
        <QueryDetails result={result} />
      ) : queryId && !isLoading ? (
        <Empty className="mt-12" description="No query found with this ID" />
      ) : null}

      <Card
        title={
          <span className="flex items-center gap-2">
            <InfoCircleOutlined />
            Looking up a Query
          </span>
        }
        className="mt-8"
      >
        <ul className="list-disc space-y-2 pl-4">
          <li>Enter your full query ID in the search box above</li>
          <li>
            Your query status will be one of:
            <div className="mt-2 flex gap-2">
              {Object.entries(statusColors).map(([status, color]) => (
                <Tag key={status} color={color}>
                  {status}
                </Tag>
              ))}
            </div>
          </li>
          <li>
            Response times vary by query type and priority:
            <ul className="list-circle mt-2 pl-4">
              <li>Technical issues: 2-24 hours based on severity</li>
              <li>Support requests: 24-48 hours</li>
              <li>General inquiries: 2-3 business days</li>
            </ul>
          </li>
        </ul>
      </Card>
    </div>
  );
};

export default QueryLookupPage;
