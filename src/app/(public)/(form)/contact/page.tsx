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
  Space,
  Alert,
  message,
} from "antd";
import type { FormProps } from 'antd';
import {
  MailOutlined,
  PhoneOutlined,
  GlobalOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import dynamic from "next/dynamic";
import { api } from "~/trpc/react";
import type { ContactQuery } from "~/schema/queries";

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

const ReCAPTCHA = dynamic(() => import("react-google-recaptcha"), { ssr: false });

type InquiryType = "PARTNERSHIP" | "SALES" | "MEDIA" | "GENERAL";
type QueryStatus = "NEW" | "IN_PROGRESS" | "RESOLVED" | "CANCELLED";

interface ContactFormValues {
  name: string;
  organization: string;
  email: string;
  phone: string;
  inquiryType: InquiryType;
  message: string;
  status: QueryStatus;
  captchaToken?: string;
}

type ContactFormFields = keyof ContactFormValues;
type ContactFormProps = FormProps<ContactFormValues>;

export default function ContactPage() {
  const [form] = Form.useForm<ContactFormValues>();
  const [messageApi, contextHolder] = message.useMessage();
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [shouldResetCaptcha, setShouldResetCaptcha] = useState(false);
  const lastValidValues = useRef<Partial<ContactFormValues>>({});
  const isSubmitting = useRef(false);

  const mutation = api.queries.submitContact.useMutation({
    onSuccess: () => {
      messageApi.success("Your message has been sent successfully!");
      form.resetFields();
      setShowCaptcha(false);
      setShouldResetCaptcha(prev => !prev);
      lastValidValues.current = {};
      isSubmitting.current = false;
    },
    onError: (error) => {
      messageApi.error("Failed to send message. Please try again.");
      console.error("Form submission error:", error);
      resetCaptcha();
      isSubmitting.current = false;
    },
  });

  const resetCaptcha = () => {
    form.setFieldValue("captchaToken", undefined);
    setShouldResetCaptcha(prev => !prev);
  };

  const handleFormChange: Required<ContactFormProps>['onFieldsChange'] = (changedFields) => {
    if (isSubmitting.current) return;

    const changedFieldNames = changedFields
      .filter(field => field.touched && field.value !== undefined)
      .map(field => {
        const name = Array.isArray(field.name) ? field.name[0] : field.name;
        return name as ContactFormFields;
      });

    if (changedFieldNames.length === 0) return;

    const formFields: ContactFormFields[] = [
      'name', 
      'organization', 
      'email', 
      'phone', 
      'inquiryType', 
      'message'
    ];
    
    const currentValues = form.getFieldsValue(formFields) as Record<ContactFormFields, unknown>;

    const hasRealChanges = Object.entries(currentValues as Record<string, unknown>).some(([key, value]) => {
      const typedKey = key as ContactFormFields;
      return value !== lastValidValues.current[typedKey] &&
             value !== undefined &&
             key !== 'captchaToken';
    });

    if (showCaptcha && 
        form.getFieldValue("captchaToken") && 
        hasRealChanges) {
      resetCaptcha();
      lastValidValues.current = currentValues as Partial<ContactFormValues>;
    }
  };

  const handleCaptchaChange = (token: string | null) => {
    if (token) {
      form.setFieldValue("captchaToken", token);
      const formFields: ContactFormFields[] = [
        'name', 
        'organization', 
        'email', 
        'phone', 
        'inquiryType', 
        'message'
      ];
      lastValidValues.current = form.getFieldsValue(formFields) as Partial<ContactFormValues>;
    }
  };

  const onFinish = (values: ContactFormValues) => {
    try {
      isSubmitting.current = true;

      if (!showCaptcha) {
        setShowCaptcha(true);
        const formFields: ContactFormFields[] = [
          'name', 
          'organization', 
          'email', 
          'phone', 
          'inquiryType', 
          'message'
        ];
        lastValidValues.current = form.getFieldsValue(formFields) as Partial<ContactFormValues>;
        isSubmitting.current = false;
        return;
      }

      const contactData: ContactQuery = { 
        ...values,
        status: "NEW" 
      };

      mutation.mutate(contactData);
    } catch (error) {
      isSubmitting.current = false;
      console.error("Form submission error:", error);
      resetCaptcha();
    }
  };

  const inquiryTypes = [
    { label: "Partnership Opportunities", value: "PARTNERSHIP" },
    { label: "Sales Inquiry", value: "SALES" },
    { label: "Media & Press", value: "MEDIA" },
    { label: "General Information", value: "GENERAL" },
  ] satisfies { label: string; value: InquiryType }[];

  return (
    <div className="min-h-screen bg-gray-50">
      {contextHolder}
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
                onFieldsChange={handleFormChange}
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
                    {
                      min: 10,
                      message: "Message must be at least 10 characters",
                    },
                  ]}
                >
                  <TextArea
                    placeholder="How can we help you?"
                    rows={6}
                    size="large"
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
                    icon={<TeamOutlined />}
                    className="w-full"
                    style={{ backgroundColor: "#0bdc84" }}
                    loading={mutation.isPending}
                  >
                    {mutation.isPending ? "Sending..." : (showCaptcha ? "Send Message" : "Continue")}
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