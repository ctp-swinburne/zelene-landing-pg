"use client";

import { useState } from "react";
import type { UploadFile } from "antd/es/upload/interface";
import {
  Button,
  Form,
  Input,
  Select,
  Typography,
  Card,
  Row,
  Col,
  Alert,
  Upload,
  Steps,
} from "antd";
import { UploadOutlined, BugOutlined } from "@ant-design/icons";
import type { FormInstance } from "antd/es/form";

const { Title, Paragraph } = Typography;
const { TextArea } = Input;

type IssueType = "device" | "platform" | "connectivity" | "security" | "other";
type SeverityLevel = "low" | "medium" | "high" | "critical";

interface IssueFormValues {
  deviceId?: string;
  issueType: IssueType;
  severity: SeverityLevel;
  title: string;
  description: string;
  stepsToReproduce: string;
  expectedBehavior: string;
  attachments?: UploadFile[];
}

interface FormStep {
  title: string;
  content: JSX.Element;
}

export default function ReportIssuePage() {
  const [form] = Form.useForm<IssueFormValues>();
  const [currentStep, setCurrentStep] = useState<number>(0);

  const onFinish = async (values: IssueFormValues) => {
    try {
      console.log("Issue Report:", values);
      // Will use the same API endpoint with type: 'technical-issue'
      form.resetFields();
    } catch (error) {
      console.error("Failed to submit issue:", error);
      // You might want to add proper error handling here
    }
  };

  const issueTypes = [
    { label: "Device Malfunction", value: "device" },
    { label: "Platform Issues", value: "platform" },
    { label: "Connectivity Problems", value: "connectivity" },
    { label: "Security Concerns", value: "security" },
    { label: "Other", value: "other" },
  ] satisfies Array<{ label: string; value: IssueType }>;

  const severityLevels = [
    { label: "Low - Minor Impact", value: "low" },
    { label: "Medium - Moderate Impact", value: "medium" },
    { label: "High - Significant Impact", value: "high" },
    { label: "Critical - Service Disruption", value: "critical" },
  ] satisfies Array<{ label: string; value: SeverityLevel }>;

  const steps: FormStep[] = [
    {
      title: "Issue Details",
      content: (
        <>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item name="deviceId" label="Device ID (if applicable)">
                <Input placeholder="Enter device ID" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="issueType"
                label="Issue Type"
                rules={[
                  { required: true, message: "Please select issue type" },
                ]}
              >
                <Select options={issueTypes} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="severity"
            label="Severity Level"
            rules={[
              { required: true, message: "Please select severity level" },
            ]}
          >
            <Select options={severityLevels} />
          </Form.Item>

          <Form.Item
            name="title"
            label="Issue Title"
            rules={[{ required: true, message: "Please provide a title" }]}
          >
            <Input placeholder="Brief description of the issue" />
          </Form.Item>
        </>
      ),
    },
    {
      title: "Description",
      content: (
        <>
          <Form.Item
            name="description"
            label="Detailed Description"
            rules={[{ required: true, message: "Please describe the issue" }]}
          >
            <TextArea rows={4} placeholder="Describe the issue in detail" />
          </Form.Item>

          <Form.Item
            name="stepsToReproduce"
            label="Steps to Reproduce"
            rules={[
              { required: true, message: "Please provide reproduction steps" },
            ]}
          >
            <TextArea
              rows={4}
              placeholder="List the steps to reproduce this issue"
            />
          </Form.Item>

          <Form.Item
            name="expectedBehavior"
            label="Expected Behavior"
            rules={[
              { required: true, message: "Please describe expected behavior" },
            ]}
          >
            <TextArea rows={4} placeholder="What should happen instead?" />
          </Form.Item>
        </>
      ),
    },
    {
      title: "Additional Info",
      content: (
        <>
          <Form.Item name="attachments" label="Attachments">
            <Upload>
              <Button icon={<UploadOutlined />}>Add Screenshots or Logs</Button>
            </Upload>
          </Form.Item>
        </>
      ),
    },
  ];

  const next = async () => {
    try {
      await form.validateFields();
      setCurrentStep((prev) => prev + 1);
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  const prev = () => {
    setCurrentStep((prev) => prev - 1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="w-full bg-gradient-to-b from-[#fff0f0] to-white px-4 py-16">
        <div className="container mx-auto max-w-6xl text-center">
          <Title level={1} className="text-gray-800">
            Report Technical Issue
          </Title>
          <Paragraph className="mx-auto max-w-2xl text-lg text-gray-600">
            Help us improve by reporting any technical issues you encounter with
            the Zelene Platform
          </Paragraph>
        </div>
      </section>

      <section className="container mx-auto max-w-4xl px-4 py-8">
        <Alert
          message="Before Reporting"
          description="Please check our known issues page and ensure you're reporting a new issue."
          type="info"
          showIcon
          className="mb-8"
        />

        <Card>
          <Steps current={currentStep} items={steps} className="mb-8" />

          <Form<IssueFormValues>
            form={form}
            layout="vertical"
            onFinish={onFinish}
          >
            <div>{steps[currentStep]?.content}</div>

            <div className="mt-8 flex justify-between">
              {currentStep > 0 && <Button onClick={prev}>Previous</Button>}
              {currentStep < steps.length - 1 && (
                <Button type="primary" onClick={next}>
                  Next
                </Button>
              )}
              {currentStep === steps.length - 1 && (
                <Button
                  type="primary"
                  danger
                  htmlType="submit"
                  icon={<BugOutlined />}
                >
                  Submit Issue Report
                </Button>
              )}
            </div>
          </Form>
        </Card>
      </section>
    </div>
  );
}
