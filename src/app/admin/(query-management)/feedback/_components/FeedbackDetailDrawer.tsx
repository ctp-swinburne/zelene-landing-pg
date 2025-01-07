//admin/feedback/_components/FeedbackDetailDrawer.tsx
"use client";

import React from "react";
import { Drawer, Select, Space, Tag, Rate } from "antd";

const QueryStatus = {
  NEW: "NEW",
  IN_PROGRESS: "IN_PROGRESS",
  RESOLVED: "RESOLVED",
  CANCELLED: "CANCELLED",
} as const;

const FeedbackCategory = {
  UI: "UI",
  FEATURES: "FEATURES",
  PERFORMANCE: "PERFORMANCE",
  DOCUMENTATION: "DOCUMENTATION",
  GENERAL: "GENERAL",
} as const;

type QueryStatus = (typeof QueryStatus)[keyof typeof QueryStatus];
type FeedbackCategory =
  (typeof FeedbackCategory)[keyof typeof FeedbackCategory];

interface Feedback {
  id: string;
  category: FeedbackCategory;
  satisfaction: number;
  usability: number;
  features: string[];
  improvements: string;
  recommendation: boolean;
  comments?: string;
  status: QueryStatus;
  createdAt: string;
}

interface FeedbackDetailDrawerProps {
  feedback: Feedback | null;
  visible: boolean;
  onClose: () => void;
  onStatusChange: (id: string, status: QueryStatus) => void;
}

const categoryColors = {
  UI: "magenta",
  FEATURES: "blue",
  PERFORMANCE: "orange",
  DOCUMENTATION: "cyan",
  GENERAL: "purple",
} as const;

export default function FeedbackDetailDrawer({
  feedback,
  visible,
  onClose,
  onStatusChange,
}: FeedbackDetailDrawerProps) {
  if (!feedback) return null;

  return (
    <Drawer
      title={
        <div className="flex items-center justify-between">
          <span>Feedback Details</span>
          <Space>
            <Tag color={categoryColors[feedback.category]}>
              {feedback.category}
            </Tag>
            <Select
              value={feedback.status}
              style={{ width: 130 }}
              onChange={(value) =>
                onStatusChange(feedback.id, value as QueryStatus)
              }
              options={Object.values(QueryStatus).map((status) => ({
                label: status.replace("_", " "),
                value: status,
              }))}
            />
          </Space>
        </div>
      }
      placement="right"
      width={600}
      onClose={onClose}
      open={visible}
    >
      <div className="space-y-8">
        <section>
          <h3 className="mb-4 text-lg font-medium">Ratings</h3>
          <div className="space-y-4 rounded-lg border p-4">
            <div>
              <div className="mb-1 text-sm text-gray-500">
                Overall Satisfaction
              </div>
              <Rate disabled defaultValue={feedback.satisfaction} />
              <span className="ml-2 text-gray-500">
                {feedback.satisfaction}/5
              </span>
            </div>
            <div>
              <div className="mb-1 text-sm text-gray-500">Usability Rating</div>
              <Rate disabled defaultValue={feedback.usability} />
              <span className="ml-2 text-gray-500">{feedback.usability}/5</span>
            </div>
            <div>
              <div className="mb-1 text-sm text-gray-500">Would Recommend</div>
              <Tag color={feedback.recommendation ? "success" : "error"}>
                {feedback.recommendation ? "Yes" : "No"}
              </Tag>
            </div>
          </div>
        </section>

        <section>
          <h3 className="mb-4 text-lg font-medium">Features Feedback</h3>
          <div className="space-y-4 rounded-lg border p-4">
            <div>
              <div className="mb-2 text-sm text-gray-500">
                Features Discussed
              </div>
              <Space size={[0, 8]} wrap>
                {feedback.features.map((feature, index) => (
                  <Tag key={index}>{feature}</Tag>
                ))}
              </Space>
            </div>
            <div>
              <div className="mb-2 text-sm text-gray-500">
                Suggested Improvements
              </div>
              <div className="whitespace-pre-wrap rounded-md bg-gray-50 p-3">
                {feedback.improvements}
              </div>
            </div>
          </div>
        </section>

        {feedback.comments && (
          <section>
            <h3 className="mb-4 text-lg font-medium">Additional Comments</h3>
            <div className="whitespace-pre-wrap rounded-lg border p-4">
              {feedback.comments}
            </div>
          </section>
        )}

        <section>
          <h3 className="mb-4 text-lg font-medium">Metadata</h3>
          <div className="rounded-lg border p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-500">Submitted On</div>
                <div>{new Date(feedback.createdAt).toLocaleString()}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Status</div>
                <Tag
                  color={
                    feedback.status === "RESOLVED" ? "success" : "processing"
                  }
                >
                  {feedback.status.replace("_", " ")}
                </Tag>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Drawer>
  );
}
