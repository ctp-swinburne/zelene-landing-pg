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
} from "antd";
import { MailOutlined, PhoneOutlined, GlobalOutlined } from "@ant-design/icons";

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

export default function ContactPage() {
  const [form] = Form.useForm();

  interface ContactFormValues {
    name: string;
    organization: string;
    email: string;
    phone: string;
    interest:
      | "smart-lighting"
      | "energy-management"
      | "infrastructure"
      | "data-analytics"
      | "other";
    message: string;
  }

  const onFinish = (values: ContactFormValues) => {
    console.log("Form values:", values);
    // Placeholder for form submission
    form.resetFields();
  };

  return (
    <main className="flex min-h-screen flex-col items-center bg-white">
      {/* Hero Section */}
      <section className="w-full bg-gradient-to-b from-[#d6e4e9] to-white px-4 py-16">
        <div className="container mx-auto max-w-6xl text-center">
          <Title level={1} style={{ color: "#2c3e50" }}>
            Contact Zelene Platform
          </Title>
          <Paragraph
            className="mx-auto max-w-2xl text-lg"
            style={{ color: "#88b2b8" }}
          >
            Get in touch with our team to learn more about implementing smart
            lighting solutions for your city infrastructure
          </Paragraph>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="w-full px-4 py-16">
        <div className="container mx-auto max-w-6xl">
          <Row gutter={[48, 32]} align="top">
            <Col xs={24} md={16}>
              <Card bordered={false} className="h-full">
                <Title level={2} style={{ color: "#2c3e50" }}>
                  Send us a Message
                </Title>
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={onFinish}
                  className="mt-8"
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
                            message: "Please enter your email",
                          },
                          {
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
                    name="interest"
                    label="Area of Interest"
                    rules={[
                      {
                        required: true,
                        message: "Please select your area of interest",
                      },
                    ]}
                  >
                    <Select
                      placeholder="Select your area of interest"
                      size="large"
                    >
                      <Option value="smart-lighting">
                        Smart City Lighting
                      </Option>
                      <Option value="energy-management">
                        Energy Management
                      </Option>
                      <Option value="infrastructure">
                        Infrastructure Integration
                      </Option>
                      <Option value="data-analytics">Data Analytics</Option>
                      <Option value="other">Other</Option>
                    </Select>
                  </Form.Item>

                  <Form.Item
                    name="message"
                    label="Message"
                    rules={[
                      { required: true, message: "Please enter your message" },
                    ]}
                  >
                    <TextArea
                      placeholder="Tell us about your project or inquiry"
                      rows={6}
                    />
                  </Form.Item>

                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      size="large"
                      style={{ backgroundColor: "#0bdc84" }}
                    >
                      Send Message
                    </Button>
                  </Form.Item>
                </Form>
              </Card>
            </Col>

            <Col xs={24} md={8}>
              <Card bordered={false} className="h-full">
                <Title level={2} style={{ color: "#2c3e50" }}>
                  Contact Information
                </Title>
                <Space direction="vertical" size="large" className="mt-8">
                  <div>
                    <Text
                      strong
                      style={{
                        color: "#0bdc84",
                        display: "block",
                        marginBottom: 8,
                      }}
                    >
                      <MailOutlined className="mr-2" /> Email
                    </Text>
                    <Text style={{ color: "#88b2b8" }}>
                      info@zelene.viettel.com.vn
                    </Text>
                  </div>
                  <div>
                    <Text
                      strong
                      style={{
                        color: "#0bdc84",
                        display: "block",
                        marginBottom: 8,
                      }}
                    >
                      <PhoneOutlined className="mr-2" /> Phone
                    </Text>
                    <Text style={{ color: "#88b2b8" }}>+84 906 790 230</Text>
                  </div>
                  <div>
                    <Text
                      strong
                      style={{
                        color: "#0bdc84",
                        display: "block",
                        marginBottom: 8,
                      }}
                    >
                      <GlobalOutlined className="mr-2" /> Location
                    </Text>
                    <Text style={{ color: "#88b2b8" }}>
                      Viettel 5G & IoT Innovation Lab
                      <br />
                      Ho Chi Minh City, Vietnam
                    </Text>
                  </div>
                </Space>
              </Card>
            </Col>
          </Row>
        </div>
      </section>
    </main>
  );
}
