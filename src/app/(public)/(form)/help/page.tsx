"use client";

import { useState } from "react";
import {
  Button,
  Form,
  Input,
  Select,
  Typography,
  Card,
  Row,
  Col,
  Space,
  Collapse,
  Divider,
  Tag,
  message,
} from "antd";
import {
  QuestionCircleOutlined,
  SearchOutlined,
  BookOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import { api } from "~/trpc/react";
import type {
  SupportRequest,
  SupportCategory,
  SupportPriority,
} from "~/schema/queries";

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;
const { Panel } = Collapse;

type SupportRequestValues = Omit<SupportRequest, "status">;

export default function HelpCenterPage() {
  const [form] = Form.useForm<SupportRequestValues>();
  const [searchQuery, setSearchQuery] = useState("");
  const [messageApi, contextHolder] = message.useMessage();

  const mutation = api.queries.submitSupportRequest.useMutation({
    onSuccess: () => {
      messageApi.success("Support request submitted successfully!");
      form.resetFields();
    },
    onError: (error) => {
      messageApi.error("Failed to submit support request. Please try again.");
      console.error("Form submission error:", error);
    },
  });

  const onFinish = (values: Omit<SupportRequestValues, "status">) => {
    const supportData: SupportRequest = {
      ...values,
      status: "NEW",
    };

    mutation.mutate(supportData);
  };

  const supportCategories = [
    { label: "Account & Access", value: "ACCOUNT" },
    { label: "Device Management", value: "DEVICES" },
    { label: "Platform Usage", value: "PLATFORM" },
    { label: "Other", value: "OTHER" },
  ] satisfies { label: string; value: SupportCategory }[];

  const priorityLevels = [
    { label: "Low - General Question", value: "LOW" },
    { label: "Medium - Need Help Soon", value: "MEDIUM" },
    { label: "High - Urgent Assistance", value: "HIGH" },
  ] satisfies { label: string; value: SupportPriority }[];

  const faqCategories = [
    {
      title: "Getting Started",
      items: [
        { q: "How do I access the platform?", a: "Access is provided..." },
        {
          q: "What are the system requirements?",
          a: "The platform requires...",
        },
      ],
    },
    {
      title: "Device Management",
      items: [
        { q: "How do I add a new device?", a: "To add a new device..." },
        { q: "How to group devices?", a: "Device grouping can be done..." },
      ],
    },
    {
      title: "Common Issues",
      items: [
        { q: "Device is offline", a: "If a device appears offline..." },
        { q: "Data isn't updating", a: "When data doesn't update..." },
      ],
    },
  ];

  return (
    <main className="flex min-h-screen flex-col items-center bg-white">
      {contextHolder}
      <section className="w-full bg-gradient-to-b from-[#e6f7ff] to-white px-4 py-16">
        <div className="container mx-auto max-w-6xl text-center">
          <Title level={1} style={{ color: "#2c3e50" }}>
            Help Center
          </Title>
          <Paragraph
            className="mx-auto max-w-2xl text-lg"
            style={{ color: "#666" }}
          >
            Find answers, get support, and learn more about using the Zelene
            Platform
          </Paragraph>

          <Input
            size="large"
            placeholder="Search for help articles..."
            prefix={<SearchOutlined />}
            className="mt-8 max-w-xl"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </section>

      <section className="w-full px-4 py-8">
        <div className="container mx-auto max-w-6xl">
          <Row gutter={[32, 32]}>
            <Col xs={24} lg={16}>
              <Card bordered={false}>
                <Title level={2}>
                  <BookOutlined className="mr-2" />
                  Frequently Asked Questions
                </Title>

                <div className="mt-8">
                  {faqCategories.map((category, idx) => (
                    <div key={idx} className="mb-8">
                      <Title level={4}>{category.title}</Title>
                      <Collapse ghost>
                        {category.items.map((item, i) => (
                          <Panel header={item.q} key={i}>
                            <Paragraph>{item.a}</Paragraph>
                          </Panel>
                        ))}
                      </Collapse>
                    </div>
                  ))}
                </div>
              </Card>
            </Col>

            <Col xs={24} lg={8}>
              <Card bordered={false}>
                <Title level={2}>
                  <MessageOutlined className="mr-2" />
                  Need More Help?
                </Title>

                <Form
                  form={form}
                  layout="vertical"
                  onFinish={onFinish}
                  className="mt-8"
                >
                  <Form.Item
                    name="category"
                    label="Help Category"
                    rules={[
                      { required: true, message: "Please select a category" },
                    ]}
                  >
                    <Select options={supportCategories} />
                  </Form.Item>

                  <Form.Item
                    name="subject"
                    label="Subject"
                    rules={[
                      { required: true, message: "Please enter a subject" },
                    ]}
                  >
                    <Input placeholder="Brief description of your question" />
                  </Form.Item>

                  <Form.Item
                    name="description"
                    label="Description"
                    rules={[
                      {
                        required: true,
                        message: "Please provide a description",
                      },
                      {
                        min: 10,
                        message: "Description must be at least 10 characters",
                      },
                    ]}
                  >
                    <TextArea
                      rows={4}
                      placeholder="Provide more details about your question"
                    />
                  </Form.Item>

                  <Form.Item
                    name="priority"
                    label="Priority"
                    rules={[
                      {
                        required: true,
                        message: "Please select a priority level",
                      },
                    ]}
                  >
                    <Select options={priorityLevels} />
                  </Form.Item>

                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      size="large"
                      style={{ backgroundColor: "#1890ff" }}
                      className="w-full"
                      loading={mutation.isPending}
                    >
                      {mutation.isPending
                        ? "Submitting..."
                        : "Submit Support Request"}
                    </Button>
                  </Form.Item>
                </Form>
              </Card>

              <Card bordered={false} className="mt-4">
                <Title level={3}>Quick Links</Title>
                <Space direction="vertical" className="w-full">
                  <Button type="link" icon={<BookOutlined />}>
                    Documentation
                  </Button>
                  <Button type="link" icon={<QuestionCircleOutlined />}>
                    Video Tutorials
                  </Button>
                  <Button type="link" icon={<MessageOutlined />}>
                    Community Forum
                  </Button>
                </Space>
              </Card>
            </Col>
          </Row>
        </div>
      </section>
    </main>
  );
}
