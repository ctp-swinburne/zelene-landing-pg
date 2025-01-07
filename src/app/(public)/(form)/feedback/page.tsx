"use client";

import { useState, useRef } from "react";
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
import type { FormProps } from 'antd';
import {
  SmileOutlined,
  HeartOutlined,
  BulbOutlined,
  StarOutlined,
} from "@ant-design/icons";
import dynamic from "next/dynamic";
import { api } from "~/trpc/react";
import type { Feedback, FeedbackCategory } from "~/schema/queries";

const { Title, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const ReCAPTCHA = dynamic(() => import("react-google-recaptcha"), { ssr: false });

interface FeedbackFormValues {
  category: FeedbackCategory;
  satisfaction: number;
  usability: number;
  features: string[];
  improvements: string;
  recommendation: boolean;
  comments?: string;
  captchaToken?: string;
}

type FeedbackFormFields = keyof FeedbackFormValues;
type FeedbackFormProps = FormProps<FeedbackFormValues>;

export default function FeedbackPage() {
  const [form] = Form.useForm<FeedbackFormValues>();
  const [messageApi, contextHolder] = message.useMessage();
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [shouldResetCaptcha, setShouldResetCaptcha] = useState(false);
  const lastValidValues = useRef<Partial<FeedbackFormValues>>({});
  const isSubmitting = useRef(false);

  const mutation = api.queries.submitFeedback.useMutation({
    onSuccess: () => {
      messageApi.success("Thank you for your feedback!");
      form.resetFields();
      setShowCaptcha(false);
      setShouldResetCaptcha(prev => !prev);
      lastValidValues.current = {};
      isSubmitting.current = false;
    },
    onError: (error) => {
      messageApi.error("Failed to submit feedback. Please try again.");
      console.error("Form submission error:", error);
      resetCaptcha();
      isSubmitting.current = false;
    },
  });

  const resetCaptcha = () => {
    form.setFieldValue("captchaToken", undefined);
    setShouldResetCaptcha(prev => !prev);
  };

  const handleFormChange: Required<FeedbackFormProps>['onFieldsChange'] = (changedFields) => {
    if (isSubmitting.current) return;

    const changedFieldNames = changedFields
      .filter(field => field.touched && field.value !== undefined)
      .map(field => {
        const name = Array.isArray(field.name) ? field.name[0] : field.name;
        return name as FeedbackFormFields;
      });

    if (changedFieldNames.length === 0) return;

    const formFields: FeedbackFormFields[] = [
      'category', 
      'satisfaction', 
      'usability', 
      'features',
      'improvements', 
      'recommendation', 
      'comments'
    ];

    const currentValues = form.getFieldsValue(formFields) as Record<FeedbackFormFields, unknown>;

    const hasRealChanges = Object.entries(currentValues as Record<string, unknown>).some(([key, value]) => {
      const typedKey = key as FeedbackFormFields;
      return value !== lastValidValues.current[typedKey] &&
             value !== undefined &&
             key !== 'captchaToken';
    });

    if (showCaptcha && 
        form.getFieldValue("captchaToken") && 
        hasRealChanges) {
      resetCaptcha();
      lastValidValues.current = currentValues as Partial<FeedbackFormValues>;
    }
  };

  const handleCaptchaChange = (token: string | null) => {
    if (token) {
      form.setFieldValue("captchaToken", token);
      const formFields: FeedbackFormFields[] = [
        'category', 
        'satisfaction', 
        'usability', 
        'features',
        'improvements', 
        'recommendation', 
        'comments'
      ];
      lastValidValues.current = form.getFieldsValue(formFields) as Partial<FeedbackFormValues>;
    }
  };

  const onFinish = (values: FeedbackFormValues) => {
    try {
      isSubmitting.current = true;

      if (!showCaptcha) {
        setShowCaptcha(true);
        const formFields: FeedbackFormFields[] = [
          'category', 
          'satisfaction', 
          'usability', 
          'features',
          'improvements', 
          'recommendation', 
          'comments'
        ];
        lastValidValues.current = form.getFieldsValue(formFields) as Partial<FeedbackFormValues>;
        isSubmitting.current = false;
        return;
      }

      const { captchaToken, ...formValues } = values;
      const feedbackData: Feedback = {
        ...formValues,
        status: "NEW",
        captchaToken
      };

      mutation.mutate(feedbackData);
    } catch (error) {
      isSubmitting.current = false;
      console.error("Form submission error:", error);
      resetCaptcha();
    }
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
                onFieldsChange={handleFormChange}
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
                      message: "Improvement details must be at least 10 characters",
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
                  rules={[{ required: true, message: "Please select an option" }]}
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

                {showCaptcha && (
                  <Form.Item
                    name="captchaToken"
                    rules={[
                      { required: true, message: "Please complete the captcha" },
                    ]}
                  >
                    <ReCAPTCHA
                      key={String(shouldResetCaptcha)}
                      sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
                      onChange={handleCaptchaChange}
                    />
                  </Form.Item>
                )}

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
                    {mutation.isPending ? "Submitting..." : (showCaptcha ? "Submit Feedback" : "Continue")}
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