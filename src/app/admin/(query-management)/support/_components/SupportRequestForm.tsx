// ~/components/support/SupportRequestForm.tsx
import React from "react";
import { Form, Input, Select } from "antd";
import type { FormInstance } from "antd";
import type { RouterOutputs } from "~/trpc/react";

const { TextArea } = Input;

type SupportRequest =
  RouterOutputs["adminQueryView"]["getSupportRequests"]["items"][0];

interface SupportRequestFormProps {
  form: FormInstance;
  onFinish: (values: SupportRequest) => void;
  isView?: boolean;
}

export const SupportRequestForm: React.FC<SupportRequestFormProps> = ({
  form,
  onFinish,
  isView = false,
}) => {
  return (
    <Form form={form} layout="vertical" onFinish={onFinish} className="h-full">
      <Form.Item name="subject" label="Subject">
        <Input disabled={isView} />
      </Form.Item>

      <Form.Item name="description" label="User's Description">
        <TextArea rows={4} disabled={isView} />
      </Form.Item>

      <Form.Item
        name="category"
        label="Category"
        rules={[{ required: true, message: "Please select a category" }]}
      >
        <Select
          disabled={isView}
          options={[
            { label: "Account Related", value: "ACCOUNT" },
            { label: "Device Issues", value: "DEVICES" },
            { label: "Platform Support", value: "PLATFORM" },
            { label: "Other Inquiries", value: "OTHER" },
          ]}
        />
      </Form.Item>

      <Form.Item
        name="priority"
        label="Priority"
        rules={[{ required: true, message: "Please select a priority" }]}
      >
        <Select
          options={[
            { label: "Low", value: "LOW" },
            { label: "Medium", value: "MEDIUM" },
            { label: "High", value: "HIGH" },
          ]}
        />
      </Form.Item>

      <Form.Item
        name="status"
        label="Status"
        rules={[{ required: true, message: "Please select a status" }]}
      >
        <Select
          options={[
            { label: "New", value: "NEW" },
            { label: "In Progress", value: "IN_PROGRESS" },
            { label: "Resolved", value: "RESOLVED" },
            { label: "Cancelled", value: "CANCELLED" },
          ]}
        />
      </Form.Item>

      <Form.Item
        name="response"
        label="Support Response"
        rules={[{ required: true, message: "Please enter your response" }]}
      >
        <TextArea
          rows={8}
          placeholder="Enter your response to the user's request..."
          className="font-mono"
        />
      </Form.Item>
    </Form>
  );
};
