"use client";

import { type UploadFile } from "antd/es/upload/interface";
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
  message,
} from "antd";
import { UploadOutlined, BugOutlined } from "@ant-design/icons";
import { api } from "~/trpc/react";
import { useIssueStore } from "~/store/issueForm";
import { IssueTypeSchema, IssueSeveritySchema } from "~/schema/queries";
import dynamic from "next/dynamic";
import { useState } from "react";

const { Title, Paragraph } = Typography;
const { TextArea } = Input;

const ReCAPTCHA = dynamic(() => import("react-google-recaptcha"), { ssr: false });

type IssueType =
  (typeof IssueTypeSchema.enum)[keyof typeof IssueTypeSchema.enum];
type IssueSeverity =
  (typeof IssueSeveritySchema.enum)[keyof typeof IssueSeveritySchema.enum];

interface IssueFormData {
  deviceId?: string;
  issueType: IssueType;
  severity: IssueSeverity;
  title: string;
  description: string;
  stepsToReproduce: string;
  expectedBehavior: string;
  captchaToken?: string;
}

interface IssueSubmitData extends IssueFormData {
  attachments?: Array<{
    filename: string;
    contentType: string;
    size: number;
    base64Data: string;
  }>;
}

const issueTypes = Object.entries(IssueTypeSchema.enum).map(([value]) => ({
  label: (() => {
    switch (value) {
      case "DEVICE":
        return "Device - Hardware / Firmware issues";
      case "PLATFORM":
        return "Platform - Bugs discovered";
      case "CONNECTIVITY":
        return "Network - Connectivity problems";
      case "SECURITY":
        return "Security - Potential concerns / problems";
      case "OTHER":
        return "Other Technical Issue";
      default:
        return value;
    }
  })(),
  value,
}));

const severityLevels = Object.entries(IssueSeveritySchema.enum).map(
  ([value]) => ({
    label: (() => {
      switch (value) {
        case "CRITICAL":
          return "Critical - Service Down/Security Breach";
        case "HIGH":
          return "High - Major Feature Unavailable";
        case "MEDIUM":
          return "Medium - Feature Degraded";
        case "LOW":
          return "Low - Minor Impact";
        default:
          return value;
      }
    })(),
    value,
  }),
);

export default function ReportIssuePage() {
  const [form] = Form.useForm<IssueFormData>();
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const {
    currentStep,
    fileList,
    isSubmitting,
    setFormData,
    setFileList,
    setCurrentStep,
    setIsSubmitting,
    reset,
    getFormData,
    ...formState
  } = useIssueStore();

  const submitMutation = api.queries.submitTechnicalIssue.useMutation({
    onSuccess: () => {
      message.success("Issue reported successfully");
      form.resetFields();
      reset();
      setCurrentStep(0); // Reset to the first step
    },
    onError: (error) => {
      message.error(error.message ?? "Failed to submit issue");
      setIsSubmitting(false);
    },
  });

  const handleFileChange = async (file: UploadFile) => {
    if (!file.originFileObj) return false;

    const isValidType = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "application/pdf",
    ].includes(file.type ?? "");

    if (!isValidType) {
      message.error("You can only upload JPG/PNG/GIF/PDF files!");
      return false;
    }

    const isLt5M = (file.size ?? 0) / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error("File must be smaller than 5MB!");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      // Convert files to base64
      const filePromises = fileList.map(async (file) => {
        if (!file.originFileObj) return null;

        return new Promise<{
          filename: string;
          contentType: string;
          size: number;
          base64Data: string;
        }>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => {
            const result = reader.result;
            if (typeof result !== "string") return;

            const base64Data = result.split(",")[1];
            if (!base64Data) return;

            resolve({
              filename: file.name,
              contentType: file.type ?? "application/octet-stream",
              size: file.size ?? 0,
              base64Data,
            });
          };
          reader.readAsDataURL(file.originFileObj as Blob);
        });
      });

      const attachments = (await Promise.all(filePromises)).filter(
        (attachment): attachment is NonNullable<typeof attachment> =>
          attachment !== null,
      );

      const formData = getFormData() as IssueFormData;
      const submitData: IssueSubmitData = {
        ...formData,
        attachments: attachments.length > 0 ? attachments : undefined,
        captchaToken: captchaToken ?? undefined,
      };

      await submitMutation.mutateAsync(submitData);
    } catch (error) {
      console.error("Failed to submit issue:", error);
      setIsSubmitting(false);
    }
  };

  const next = async () => {
    try {
      const values = await form.validateFields();
      setFormData(currentStep, values);
      setCurrentStep(currentStep + 1);
    } catch {
      // Form validation will show errors
    }
  };

  const prev = () => {
    const values = form.getFieldsValue();
    setFormData(currentStep, values);
    setCurrentStep(currentStep - 1);
  };

  const steps = [
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
            rules={[
              {
                required: true,
                message:
                  "Please describe the issue with at least 10 characters",
                min: 10,
              },
            ]}
          >
            <TextArea rows={4} placeholder="Describe the issue in detail" />
          </Form.Item>

          <Form.Item
            name="stepsToReproduce"
            label="Steps to Reproduce"
            rules={[
              {
                required: true,
                message:
                  "Please provide reproduction steps with at least 10 characters",
                min: 10,
              },
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
              {
                required: true,
                message:
                  "Please describe expected behavior with at least 10 characters",
                min: 10,
              },
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
          <Form.Item label="Attachments">
            <Upload
              multiple
              fileList={fileList}
              onChange={({ fileList }) => setFileList(fileList)}
              beforeUpload={handleFileChange}
              maxCount={5}
            >
              <Button icon={<UploadOutlined />}>Add Files (Max: 5)</Button>
            </Upload>
            <div className="mt-2 text-sm text-gray-500">
              Supported formats: JPG, PNG, GIF, PDF (Max: 5MB each)
            </div>
          </Form.Item>

          {showCaptcha && (
            <Form.Item
              name="captchaToken"
              rules={[
                { required: true, message: "Please complete the captcha" },
              ]}
            >
              <ReCAPTCHA
                sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
                onChange={(token) => setCaptchaToken(token)}
              />
            </Form.Item>
          )}
        </>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="w-full bg-gradient-to-b from-[#fff0f0] to-white px-4 py-16">
        <div className="container mx-auto max-w-6xl text-center">
          <Title level={1} className="text-gray-800">
            Report Technical Issue
          </Title>
          <Paragraph className="mx-auto max-w-2xl text-lg text-gray-600">
            Help us improve by reporting any technical issues you encounter
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

          <Form form={form} layout="vertical" initialValues={formState}>
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
                  onClick={() => {
                    if (!captchaToken) {
                      setShowCaptcha(true);
                      return;
                    }
                    handleSubmit();
                  }}
                  icon={<BugOutlined />}
                  loading={Boolean(isSubmitting || submitMutation.isPending)}
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