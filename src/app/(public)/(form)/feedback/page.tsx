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
  Rate,
  Radio,
  Space,
  Tag,
  message,
} from "antd";
import {
  SmileOutlined,
  HeartOutlined,
  BulbOutlined,
  StarOutlined,
} from "@ant-design/icons";
import { api } from "~/trpc/react";
import type { Feedback, FeedbackCategory } from "~/schema/queries";

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

type FeedbackFormValues = Omit<Feedback, "status">;

export default function FeedbackPage() {
  const [form] = Form.useForm<FeedbackFormValues>();
  const [messageApi, contextHolder] = message.useMessage();

  const mutation = api.queries.submitFeedback.useMutation({
    onSuccess: () => {
      messageApi.success("Thank you for your feedback!");
      form.resetFields();
    },
    onError: (error) => {
      messageApi.error("Failed to submit feedback. Please try again.");
      console.error("Form submission error:", error);
    },
  });

  const onFinish = (values: Omit<FeedbackFormValues, "status">) => {
    const feedbackData: Feedback = {
      ...values,
      status: "NEW",
    };

    mutation.mutate(feedbackData);
  };

  const feedbackCategories = [
    { label: "User Interface", value: "UI" },
    { label: "Features & Functionality", value: "FEATURES" },
    { label: "Performance", value: "PERFORMANCE" },
    { label: "Documentation", value: "DOCUMENTATION" },
    { label: "General Experience", value: "GENERAL" },
  ] satisfies { label: string; value: FeedbackCategory }[];

  const featuresList = [
    "Device Management",
    "Data Analytics",
    "Reporting Tools",
    "Alert System",
    "Dashboard",
    "API Integration",
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {contextHolder}
      <section className="w-full bg-gradient-to-b from-[#f0f5ff] to-white px-4 py-16">
        <div className="container mx-auto max-w-6xl text-center">
          <Title level={1} className="text-gray-800">
            Share Your Feedback
          </Title>
          <Paragraph className="mx-auto max-w-2xl text-lg text-gray-600">
            Help us improve the Zelene Platform by sharing your experience and
            suggestions
          </Paragraph>
        </div>
      </section>

      <section className="container mx-auto max-w-4xl px-4 py-8">
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={16}>
            <Card bordered={false}>
              <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                className="mt-4"
              >
                <Form.Item
                  name="category"
                  label="What area would you like to give feedback on?"
                  rules={[
                    { required: true, message: "Please select a category" },
                  ]}
                >
                  <Select options={feedbackCategories} size="large" />
                </Form.Item>

                <Form.Item
                  name="satisfaction"
                  label={
                    <span>
                      Overall satisfaction with the platform{" "}
                      <SmileOutlined className="text-blue-400" />
                    </span>
                  }
                  rules={[
                    {
                      required: true,
                      message: "Please rate your satisfaction",
                    },
                  ]}
                >
                  <Rate allowHalf />
                </Form.Item>

                <Form.Item
                  name="usability"
                  label={
                    <span>
                      How easy is it to use the platform?{" "}
                      <StarOutlined className="text-yellow-400" />
                    </span>
                  }
                  rules={[
                    { required: true, message: "Please rate the usability" },
                  ]}
                >
                  <Rate allowHalf />
                </Form.Item>

                <Form.Item
                  name="features"
                  label="Which features do you find most valuable?"
                  rules={[
                    {
                      required: true,
                      message: "Please select at least one feature",
                    },
                  ]}
                >
                  <Select
                    mode="multiple"
                    placeholder="Select features"
                    style={{ width: "100%" }}
                  >
                    {featuresList.map((feature) => (
                      <Option key={feature} value={feature}>
                        {feature}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item
                  name="improvements"
                  label={
                    <span>
                      What could we improve?{" "}
                      <BulbOutlined className="text-yellow-500" />
                    </span>
                  }
                  rules={[
                    {
                      required: true,
                      message: "Please provide improvement suggestions",
                    },
                    {
                      min: 10,
                      message:
                        "Improvement details must be at least 10 characters",
                    },
                  ]}
                >
                  <TextArea
                    rows={4}
                    placeholder="Share your suggestions for improvement"
                  />
                </Form.Item>

                <Form.Item
                  name="recommendation"
                  label="Would you recommend the Zelene Platform to others?"
                  rules={[
                    { required: true, message: "Please select an option" },
                  ]}
                >
                  <Radio.Group>
                    <Space direction="vertical">
                      <Radio value={true}>Yes, definitely</Radio>
                      <Radio value={false}>No, not at this time</Radio>
                    </Space>
                  </Radio.Group>
                </Form.Item>

                <Form.Item name="comments" label="Additional Comments">
                  <TextArea
                    rows={4}
                    placeholder="Any other thoughts you'd like to share?"
                  />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    icon={<HeartOutlined />}
                    className="w-full"
                    style={{ backgroundColor: "#722ed1" }}
                    loading={mutation.isPending}
                  >
                    {mutation.isPending ? "Submitting..." : "Submit Feedback"}
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            <Space direction="vertical" size="large" className="w-full">
              <Card bordered={false}>
                <Title level={4}>Why Your Feedback Matters</Title>
                <Paragraph className="text-gray-600">
                  Your feedback helps us:
                </Paragraph>
                <ul className="list-disc space-y-2 pl-4 text-gray-600">
                  <li>Improve platform features</li>
                  <li>Enhance user experience</li>
                  <li>Prioritize development</li>
                  <li>Better serve our community</li>
                </ul>
              </Card>

              <Card bordered={false}>
                <Title level={4}>Recent Improvements</Title>
                <Space size={[0, 8]} wrap>
                  <Tag color="blue">Enhanced Analytics</Tag>
                  <Tag color="green">Faster Loading</Tag>
                  <Tag color="gold">New Features</Tag>
                  <Tag color="purple">Better UI</Tag>
                  <Tag color="cyan">Mobile Support</Tag>
                </Space>
              </Card>

              <Card bordered={false}>
                <Title level={4}>Need Help?</Title>
                <Space direction="vertical">
                  <Button type="link" href="/help">
                    Visit Help Center
                  </Button>
                  <Button type="link" href="/report-issue">
                    Report an Issue
                  </Button>
                  <Button type="link" href="/contact">
                    Contact Support
                  </Button>
                </Space>
              </Card>
            </Space>
          </Col>
        </Row>
      </section>
    </div>
  );
}
