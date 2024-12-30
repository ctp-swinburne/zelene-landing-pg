"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import Image from "next/image";
import { Button, Form, Input, Typography, App } from "antd";
import dynamic from "next/dynamic";
import {
  type RegisterInput,
  registerInputSchema,
} from "~/server/api/routers/user/schema";

const { Title, Paragraph } = Typography;
const ReCAPTCHA = dynamic(() => import("react-google-recaptcha"), {
  ssr: false,
});

export default function RegisterPage() {
  const router = useRouter();
  const { message } = App.useApp();
  const [form] = Form.useForm<RegisterInput>();
  const [showCaptcha, setShowCaptcha] = useState(false);

  const registerMutation = api.auth.register.useMutation({
    onSuccess: () => {
      message.success("Registration successful!");
      router.push("/auth/signin");
    },
    onError: (error) => {
      message.error(error.message);
    },
  });

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (!showCaptcha) {
        setShowCaptcha(true);
        return;
      }

      // Validate with Zod schema
      const validatedData = registerInputSchema.parse(values);
      registerMutation.mutate(validatedData);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Validation failed:", error);
      }
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
          <Form form={form} layout="vertical">
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
                  sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
                  onChange={(token) =>
                    form.setFieldValue("captchaToken", token)
                  }
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
