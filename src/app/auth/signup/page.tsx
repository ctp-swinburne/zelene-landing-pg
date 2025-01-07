"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import Image from "next/image";
import { Button, Form, Input, Typography, App } from "antd";
import dynamic from "next/dynamic";
import { type RegisterInput, registerInputSchema } from "~/schema/users";

const { Title, Paragraph } = Typography;
const ReCAPTCHA = dynamic(() => import("react-google-recaptcha"), {
  ssr: false,
});

interface FieldData {
  touched?: boolean;
  value?: unknown;
  name: (string | number)[];
}

interface FormValues {
  username?: string;
  email?: string;
  name?: string;
  password?: string;
  captchaToken?: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const { message } = App.useApp();
  const [form] = Form.useForm<RegisterInput>();
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [shouldResetCaptcha, setShouldResetCaptcha] = useState(false);
  const lastValidValues = useRef<Partial<RegisterInput>>({});
  const isSubmitting = useRef(false);

  const registerMutation = api.auth.register.useMutation({
    onSuccess: () => {
      message.success("Registration successful!");
      router.push("/auth/signin");
    },
    onError: (error) => {
      message.error(error.message);
      resetCaptcha();
      isSubmitting.current = false;
    },
  });

  const resetCaptcha = () => {
    form.setFieldValue("captchaToken", undefined);
    setShouldResetCaptcha(prev => !prev);
  };

  const handleFormChange = (changedFields: FieldData[]) => {
    // Don't process if submitting
    if (isSubmitting.current) return;

    // Only care about actual value changes
    const changedFieldNames = changedFields
      .filter(field => field.touched && field.value !== undefined)
      .map(field => String(field.name[0]) as keyof RegisterInput);

    if (changedFieldNames.length === 0) return;

    // Get current form values
    const currentValues = form.getFieldsValue() as FormValues;

    const hasRealChanges = Object.entries(currentValues).some(([key, value]) => {
      return value !== lastValidValues.current[key as keyof RegisterInput] &&
             value !== undefined &&
             key !== 'captchaToken';
    });

    if (showCaptcha && 
        form.getFieldValue("captchaToken") && 
        hasRealChanges) {
      resetCaptcha();
      // Update last valid values after reset
      lastValidValues.current = form.getFieldsValue(['username', 'email', 'password', 'name']) as Partial<RegisterInput>;
    }
  };

  const handleSubmit = async () => {
    try {
      isSubmitting.current = true;
      const values = await form.validateFields() as RegisterInput;

      if (!showCaptcha) {
        setShowCaptcha(true);
        // Store initial valid values
        lastValidValues.current = form.getFieldsValue(['username', 'email', 'password', 'name']) as Partial<RegisterInput>;
        isSubmitting.current = false;
        return;
      }

      // Validate with Zod schema
      const validatedData = registerInputSchema.parse(values);
      registerMutation.mutate(validatedData);
    } catch (error) {
      isSubmitting.current = false;
      if (error instanceof Error) {
        console.error("Validation failed:", error);
        resetCaptcha();
      }
    }
  };

  const handleCaptchaChange = (token: string | null) => {
    if (token) {
      form.setFieldValue("captchaToken", token);
      // Update last valid values when captcha is completed
      lastValidValues.current = form.getFieldsValue(['username', 'email', 'password', 'name']) as Partial<RegisterInput>;
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 py-8">
      <div className="max-w-l w-xl mx-auto my-8">
        <div className="space-y-4">
          <div className="flex justify-center">
            <Image
              src="/favicon.png"
              alt="Zelene Platform Logo"
              width={64}
              height={64}
            />
          </div>
          <Title level={2} className="text-center">
            Join the Zelene Platform community
          </Title>
          <Paragraph type="secondary" className="text-center">
            Create your account to get started
          </Paragraph>
        </div>

        <div className="mt-8">
          <Form 
            form={form} 
            layout="vertical"
            onFieldsChange={handleFormChange}
          >
            <Form.Item
              label="Username"
              name="username"
              rules={[
                { required: true, message: "Username is required" },
                { min: 3, message: "Username must be at least 3 characters" },
              ]}
            >
              <Input placeholder="username" />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Email is required" },
                { type: "email", message: "Please enter a valid email" },
              ]}
            >
              <Input placeholder="your@email.com" />
            </Form.Item>

            <Form.Item
              label="Full Name"
              name="name"
              rules={[{ required: true, message: "Full name is required" }]}
            >
              <Input placeholder="Your full name" />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Password is required" },
                { min: 6, message: "Password must be at least 6 characters" },
              ]}
            >
              <Input.Password />
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
                htmlType="button"
                block
                loading={registerMutation.isPending}
                onClick={handleSubmit}
              >
                {showCaptcha ? "Complete Registration" : "Create Account"}
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </main>
  );
}