//admin/help/page.tsx
"use client";

import React from "react";
import {
  Table,
  Tag,
  Card,
  Button,
  Space,
  Drawer,
  Input,
  Select,
  Form,
} from "antd";
import type { TableProps } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const { TextArea } = Input;

// Using the schema-defined support categories
const supportCategories = {
  ACCOUNT: "ACCOUNT",
  DEVICES: "DEVICES",
  PLATFORM: "PLATFORM",
  OTHER: "OTHER",
} as const;

const supportPriorities = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
} as const;

type SupportCategory =
  (typeof supportCategories)[keyof typeof supportCategories];
type SupportPriority =
  (typeof supportPriorities)[keyof typeof supportPriorities];

interface HelpArticle {
  id: string;
  category: SupportCategory;
  title: string;
  content: string;
  priority: SupportPriority;
  status: "DRAFT" | "PUBLISHED";
  lastUpdated: string;
}

export default function HelpPage() {
  const [drawerVisible, setDrawerVisible] = React.useState(false);
  const [form] = Form.useForm();

  const columns: TableProps<HelpArticle>["columns"] = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      sorter: (a, b) => a.title.localeCompare(b.title),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      width: 120,
      render: (category: SupportCategory) => <Tag>{category}</Tag>,
      filters: Object.values(supportCategories).map((category) => ({
        text: category,
        value: category,
      })),
      onFilter: (value, record) => record.category === value,
    },
    {
      title: "Priority",
      dataIndex: "priority",
      key: "priority",
      width: 100,
      render: (priority: SupportPriority) => {
        const colors = {
          LOW: "blue",
          MEDIUM: "orange",
          HIGH: "red",
        };
        return <Tag color={colors[priority]}>{priority}</Tag>;
      },
      filters: Object.values(supportPriorities).map((priority) => ({
        text: priority,
        value: priority,
      })),
      onFilter: (value, record) => record.priority === value,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (status: string) => (
        <Tag color={status === "PUBLISHED" ? "success" : "default"}>
          {status}
        </Tag>
      ),
      filters: [
        { text: "DRAFT", value: "DRAFT" },
        { text: "PUBLISHED", value: "PUBLISHED" },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "Last Updated",
      dataIndex: "lastUpdated",
      key: "lastUpdated",
      width: 150,
      render: (date: string) => new Date(date).toLocaleDateString(),
      sorter: (a, b) =>
        new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime(),
    },
    {
      title: "Action",
      key: "action",
      width: 100,
      render: (_, record: HelpArticle) => (
        <Button type="link" onClick={() => handleEdit(record)}>
          Edit
        </Button>
      ),
    },
  ];

  const handleEdit = (record?: HelpArticle) => {
    if (record) {
      form.setFieldsValue(record);
    } else {
      form.resetFields();
    }
    setDrawerVisible(true);
  };

  const handleSave = async (values: unknown) => {
    console.log("Save article:", values);
    setDrawerVisible(false);
    form.resetFields();
  };

  // Mock data
  const mockData: HelpArticle[] = [
    {
      id: "1",
      category: "DEVICES",
      title: "How to Connect Your Device",
      content: "Step-by-step guide for device connection...",
      priority: "HIGH",
      status: "PUBLISHED",
      lastUpdated: "2024-01-15T10:00:00Z",
    },
    {
      id: "2",
      category: "ACCOUNT",
      title: "Managing Your Account Settings",
      content: "Learn how to update your account preferences...",
      priority: "MEDIUM",
      status: "PUBLISHED",
      lastUpdated: "2024-01-16T09:30:00Z",
    },
    {
      id: "3",
      category: "PLATFORM",
      title: "Platform Features Overview",
      content: "Explore the key features of our platform...",
      priority: "HIGH",
      status: "DRAFT",
      lastUpdated: "2024-01-17T14:20:00Z",
    },
  ];

  return (
    <div className="space-y-4">
      <Card>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Help Center</h1>
            <p className="text-gray-500">
              Manage help articles and documentation
            </p>
          </div>
          <Space>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => handleEdit()}
            >
              New Article
            </Button>
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={mockData}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
          }}
        />
      </Card>

      <Drawer
        title={form.getFieldValue("id") ? "Edit Article" : "New Article"}
        placement="right"
        width={600}
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        extra={
          <Space>
            <Button onClick={() => setDrawerVisible(false)}>Cancel</Button>
            <Button type="primary" onClick={() => form.submit()}>
              Save
            </Button>
          </Space>
        }
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
          className="h-full"
        >
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: "Please enter the title" }]}
          >
            <Input placeholder="Enter article title" />
          </Form.Item>

          <Form.Item
            name="category"
            label="Category"
            rules={[{ required: true, message: "Please select a category" }]}
          >
            <Select
              options={Object.values(supportCategories).map((category) => ({
                label: category,
                value: category,
              }))}
            />
          </Form.Item>

          <Form.Item
            name="priority"
            label="Priority"
            rules={[{ required: true, message: "Please select a priority" }]}
          >
            <Select
              options={Object.values(supportPriorities).map((priority) => ({
                label: priority,
                value: priority,
              }))}
            />
          </Form.Item>

          <Form.Item
            name="content"
            label="Content"
            rules={[{ required: true, message: "Please enter the content" }]}
          >
            <TextArea
              rows={12}
              placeholder="Enter article content"
              className="font-mono"
            />
          </Form.Item>

          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: "Please select a status" }]}
          >
            <Select
              options={[
                { label: "Draft", value: "DRAFT" },
                { label: "Published", value: "PUBLISHED" },
              ]}
            />
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
}
