import React from "react";
import { Form, Input, Select, Alert, Table, Tag } from "antd";
import type { FormInstance } from "antd";
import type { RouterOutputs } from "~/trpc/react";
import { Status, Priority, Category } from "./types";
import type { QueryResponseInput } from "~/schema/admin-query-mutations";

const { TextArea } = Input;

type SupportRequest =
  RouterOutputs["adminQueryView"]["getSupportRequests"]["items"][0];

interface SupportRequestFormProps {
  form: FormInstance<SupportRequest>;
  onFinish: (values: SupportRequest) => void;
  isView?: boolean;
}

interface RequestDetailItem {
  key: string;
  label: string;
  value: React.ReactNode;
}

export const SupportRequestForm: React.FC<SupportRequestFormProps> = ({
  form,
  onFinish,
  isView = false,
}) => {
  const status = Form.useWatch<Status>(["status"], form);

  const getPriorityColor = (priority: Priority): string => {
    const colorMap: Record<Priority, string> = {
      [Priority.LOW]: "blue",
      [Priority.MEDIUM]: "orange",
      [Priority.HIGH]: "red",
    };
    return colorMap[priority] || "default";
  };

  const getCategoryColor = (category: Category): string => {
    const colorMap: Record<Category, string> = {
      [Category.ACCOUNT]: "purple",
      [Category.DEVICES]: "cyan",
      [Category.PLATFORM]: "geekblue",
      [Category.OTHER]: "default",
    };
    return colorMap[category] || "default";
  };

  const subject = form.getFieldValue("subject") as string;
  const description = form.getFieldValue("description") as string;
  const category = form.getFieldValue("category") as Category;
  const priority = form.getFieldValue("priority") as Priority;

  const requestDetails: RequestDetailItem[] = [
    {
      key: "subject",
      label: "Subject",
      value: subject,
    },
    {
      key: "description",
      label: "Description",
      value: description,
    },
    {
      key: "category",
      label: "Category",
      value: category ? (
        <Tag color={getCategoryColor(category)}>
          {category.replace("_", " ")}
        </Tag>
      ) : null,
    },
    {
      key: "priority",
      label: "Priority",
      value: priority ? (
        <Tag color={getPriorityColor(priority)}>{priority}</Tag>
      ) : null,
    },
  ];

  const columns = [
    {
      title: "Field",
      dataIndex: "label",
      key: "label",
      width: "20%",
      className: "font-medium",
    },
    {
      title: "Details",
      dataIndex: "value",
      key: "value",
      render: (value: React.ReactNode) => (
        <div className="whitespace-pre-wrap">{value}</div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-4 text-lg font-medium">Request Details</h3>
        <Table
          columns={columns}
          dataSource={requestDetails}
          pagination={false}
          size="small"
          className="mb-6"
          bordered
        />
      </div>

      <Form form={form} layout="vertical" onFinish={onFinish}>
        {status === Status.CANCELLED && (
          <Alert
            type="warning"
            className="mb-4"
            message="This request has been cancelled"
            description="You can still update the response, but the request will remain cancelled."
          />
        )}

        <Form.Item
          name="status"
          label="Status"
          required
          rules={[{ required: true, message: "Please select a status" }]}
        >
          <Select
            options={[
              { label: "New", value: Status.NEW },
              { label: "In Progress", value: Status.IN_PROGRESS },
              { label: "Resolved", value: Status.RESOLVED },
              { label: "Cancelled", value: Status.CANCELLED },
            ]}
          />
        </Form.Item>

        <Form.Item
          name="response"
          label="Support Response"
          required
          rules={[{ required: true, message: "Please enter your response" }]}
        >
          <TextArea
            rows={8}
            placeholder="Enter your response to the user's request..."
            className="font-mono"
          />
        </Form.Item>
      </Form>
    </div>
  );
};
