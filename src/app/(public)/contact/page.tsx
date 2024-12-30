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
  Alert,
} from "antd";
import {
  MailOutlined,
  PhoneOutlined,
  GlobalOutlined,
  TeamOutlined,
} from "@ant-design/icons";

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface ContactFormValues {
  name: string;
  organization: string;
  email: string;
  phone: string;
  inquiryType: string;
  message: string;
}

export default function ContactPage() {
  const [form] = Form.useForm();

  const onFinish = (values: ContactFormValues) => {
    console.log("Contact Form:", values);
    // Will use the same API endpoint with type: 'contact'
    form.resetFields();
  };

  const inquiryTypes = [
    { label: "Partnership Opportunities", value: "partnership" },
    { label: "Sales Inquiry", value: "sales" },
    { label: "Media & Press", value: "media" },
    { label: "General Information", value: "general" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="w-full bg-gradient-to-b from-[#d6e4e9] to-white px-4 py-16">
        <div className="container mx-auto max-w-6xl text-center">
          <Title level={1} className="text-gray-800">
            Contact Zelene Platform
          </Title>
          <Paragraph className="mx-auto max-w-2xl text-lg text-gray-600">
            Connect with our team to discuss how Zelene Platform can transform
            your city&apos;s infrastructure
          </Paragraph>
        </div>
      </section>

      <section className="container mx-auto max-w-6xl px-4 py-8">
        <Alert
          message="Looking for technical support?"
          description={
            <span>
              If you need technical assistance or want to report an issue,
              please visit our{" "}
              <a href="/help" className="text-blue-600">
                Help Center
              </a>{" "}
              or{" "}
              <a href="/report-issue" className="text-blue-600">
                Report an Issue
              </a>
              .
            </span>
          }
          type="info"
          showIcon
          className="mb-8"
        />

        <Row gutter={[48, 32]}>
          <Col xs={24} lg={16}>
            <Card title={<Title level={3}>Get in Touch</Title>}>
              <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                className="mt-4"
              >
                <Row gutter={16}>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      name="name"
                      label="Name"
                      rules={[
                        { required: true, message: "Please enter your name" },
                      ]}
                    >
                      <Input placeholder="Your name" size="large" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      name="organization"
                      label="Organization"
                      rules={[
                        {
                          required: true,
                          message: "Please enter your organization",
                        },
                      ]}
                    >
                      <Input placeholder="Your organization" size="large" />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      name="email"
                      label="Email"
                      rules={[
                        {
                          required: true,
                          type: "email",
                          message: "Please enter a valid email",
                        },
                      ]}
                    >
                      <Input placeholder="Your email" size="large" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      name="phone"
                      label="Phone"
                      rules={[
                        {
                          required: true,
                          message: "Please enter your phone number",
                        },
                      ]}
                    >
                      <Input placeholder="Your phone number" size="large" />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item
                  name="inquiryType"
                  label="Type of Inquiry"
                  rules={[
                    { required: true, message: "Please select inquiry type" },
                  ]}
                >
                  <Select
                    placeholder="Select the nature of your inquiry"
                    size="large"
                    options={inquiryTypes}
                  />
                </Form.Item>

                <Form.Item
                  name="message"
                  label="Message"
                  rules={[
                    { required: true, message: "Please enter your message" },
                  ]}
                >
                  <TextArea
                    placeholder="How can we help you?"
                    rows={6}
                    size="large"
                  />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    icon={<TeamOutlined />}
                    className="w-full"
                    style={{ backgroundColor: "#0bdc84" }}
                  >
                    Send Message
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            <Space direction="vertical" size="large" className="w-full">
              <Card title={<Title level={3}>Contact Information</Title>}>
                <Space direction="vertical" size="large">
                  <div>
                    <Text strong className="mb-2 block text-green-600">
                      <MailOutlined className="mr-2" /> Email
                    </Text>
                    <Text className="text-gray-600">
                      info@zelene.viettel.com.vn
                    </Text>
                  </div>
                  <div>
                    <Text strong className="mb-2 block text-green-600">
                      <PhoneOutlined className="mr-2" /> Phone
                    </Text>
                    <Text className="text-gray-600">+84 906 790 230</Text>
                  </div>
                  <div>
                    <Text strong className="mb-2 block text-green-600">
                      <GlobalOutlined className="mr-2" /> Location
                    </Text>
                    <Text className="text-gray-600">
                      Viettel 5G & IoT Innovation Lab
                      <br />
                      Ho Chi Minh City, Vietnam
                    </Text>
                  </div>
                </Space>
              </Card>

              <Card title={<Title level={3}>Office Hours</Title>}>
                <Paragraph>
                  Monday - Friday: 9:00 AM - 5:00 PM (GMT+7)
                  <br />
                  Saturday - Sunday: Closed
                </Paragraph>
              </Card>
            </Space>
          </Col>
        </Row>
      </section>
    </div>
  );
}
