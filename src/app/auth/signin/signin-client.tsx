"use client";

import { useEffect, useState, useRef } from "react";
import { type BuiltInProviderType } from "next-auth/providers";
import { type LiteralUnion, getProviders, signIn } from "next-auth/react";
import { z } from "zod";
import { FaGoogle, FaDiscord, FaGithub } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import {
  Button,
  Form,
  Input,
  Typography,
  Divider,
  App,
  Card,
  Skeleton,
} from "antd";
import type { FormProps } from 'antd';
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";

const { Title, Text, Paragraph } = Typography;

const ReCAPTCHA = dynamic(() => import("react-google-recaptcha"), {
  ssr: false,
});

const signInSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
  captchaToken: z.string().optional(),
});

type SignInSchema = z.infer<typeof signInSchema>;
type SignInFormProps = FormProps<SignInSchema>;
type SignInFormFields = keyof SignInSchema;

const getProviderIcon = (providerId: string) => {
  switch (providerId) {
    case "google":
      return <FaGoogle className="mr-2 h-4 w-4" />;
    case "discord":
      return <FaDiscord className="mr-2 h-4 w-4" />;
    case "github":
      return <FaGithub className="mr-2 h-4 w-4" />;
    default:
      return null;
  }
};

export default function SignInClient() {
  const { message } = App.useApp();
  const [providers, setProviders] = useState<Record<
    LiteralUnion<BuiltInProviderType>,
    {
      id: string;
      name: string;
      type: string;
      signinUrl: string;
      callbackUrl: string;
    }
  > | null>(null);
  const searchParams = useSearchParams();
  const errorParam = searchParams?.get("error");

  const [form] = Form.useForm<SignInSchema>();
  const [isLoading, setIsLoading] = useState(true);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [shouldResetCaptcha, setShouldResetCaptcha] = useState(false);
  const lastValidValues = useRef<Partial<SignInSchema>>({});
  const isSubmitting = useRef(false);

  useEffect(() => {
    let mounted = true;

    const fetchProviders = async () => {
      try {
        const fetchedProviders = await getProviders();
        if (mounted) {
          setProviders(fetchedProviders);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error fetching providers:", error);
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    void fetchProviders();

    return () => {
      mounted = false;
    };
  }, []);

  const resetCaptcha = () => {
    form.setFieldValue("captchaToken", undefined);
    setShouldResetCaptcha(prev => !prev);
  };

  const handleFormChange: Required<SignInFormProps>['onFieldsChange'] = (changedFields) => {
    if (isSubmitting.current) return;

    const changedFieldNames = changedFields
      .filter(field => field.touched && field.value !== undefined)
      .map(field => {
        const name = Array.isArray(field.name) ? field.name[0] : field.name;
        return name as SignInFormFields;
      });

    if (changedFieldNames.length === 0) return;

    const formFields: SignInFormFields[] = ['username', 'password'];
    const currentValues = form.getFieldsValue(formFields) as Record<SignInFormFields, unknown>;

    const hasRealChanges = Object.entries(currentValues).some(([key, value]) => {
      const typedKey = key as SignInFormFields;
      return value !== lastValidValues.current[typedKey] &&
             value !== undefined &&
             key !== 'captchaToken';
    });

    if (showCaptcha && 
        form.getFieldValue("captchaToken") && 
        hasRealChanges) {
      resetCaptcha();
      lastValidValues.current = currentValues as Partial<SignInSchema>;
    }
  };

  const handleCaptchaChange = (token: string | null) => {
    if (token) {
      form.setFieldValue("captchaToken", token);
      const formFields: SignInFormFields[] = ['username', 'password'];
      lastValidValues.current = form.getFieldsValue(formFields) as Partial<SignInSchema>;
    }
  };

  const onSubmit = async (data: SignInSchema) => {
    try {
      isSubmitting.current = true;

      if (!showCaptcha) {
        setShowCaptcha(true);
        const formFields: SignInFormFields[] = ['username', 'password'];
        lastValidValues.current = form.getFieldsValue(formFields) as Partial<SignInSchema>;
        isSubmitting.current = false;
        return;
      }

      const validatedData = signInSchema.parse(data);

      const result = await signIn("credentials", {
        username: validatedData.username,
        password: validatedData.password,
        captchaToken: validatedData.captchaToken,
        redirect: false,
        callbackUrl: "/",
      });

      if (result?.error) {
        message.error(
          result.error === "CredentialsSignin"
            ? "Invalid username or password"
            : "Something went wrong",
        );
        resetCaptcha();
      } else {
        message.success("Signed in successfully!");
        window.location.href = result?.url ?? "/";
      }
    } catch (error) {
      message.error("An unexpected error occurred");
      resetCaptcha();
    } finally {
      isSubmitting.current = false;
    }
  };

  const handleOAuthSignIn = (providerId: string) => {
    void signIn(providerId, {
      callbackUrl: "/",
      redirect: true,
    });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4 py-8">
        <Card className="w-full max-w-md">
          <Skeleton active paragraph={{ rows: 8 }} />
        </Card>
      </div>
    );
  }

  if (!providers) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4 py-8">
        <Card className="w-full max-w-md">
          <div className="text-center">
            <Text type="secondary">Unable to load sign-in options</Text>
          </div>
        </Card>
      </div>
    );
  }

  const oauthProviders = Object.values(providers).filter(
    (provider) => provider.type === "oauth" || provider.type === "oidc",
  );
  const credentialsProvider = Object.values(providers).find(
    (provider) => provider.type === "credentials",
  );

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md">
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
            Zelene Platform is an IoT platform founded by 5 amazing student
            developers
          </Paragraph>
          {errorParam && (
            <Text type="danger">
              {errorParam === "CredentialsSignin"
                ? "Invalid username or password"
                : "Something went wrong"}
            </Text>
          )}
        </div>
        <div className="mt-8 grid gap-4">
          {oauthProviders.map((provider) => (
            <Button
              key={provider.id}
              block
              onClick={() => handleOAuthSignIn(provider.id)}
            >
              <div className="relative flex w-full items-center justify-center">
                <div className="absolute left-0">
                  {getProviderIcon(provider.id)}
                </div>
                <div>Continue with {provider.name}</div>
              </div>
            </Button>
          ))}

          {oauthProviders.length > 0 && credentialsProvider && (
            <Divider>Or continue with</Divider>
          )}

          {credentialsProvider && (
            <Form 
              form={form} 
              onFinish={onSubmit} 
              layout="vertical"
              onFieldsChange={handleFormChange}
            >
              <Form.Item
                label="Username"
                name="username"
                rules={[{ required: true, message: "Username is required" }]}
              >
                <Input placeholder="username" />
              </Form.Item>
              <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true, message: "Password is required" }]}
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
                  htmlType="submit" 
                  block
                >
                  {showCaptcha ? "Sign in" : "Continue"}
                </Button>
              </Form.Item>
            </Form>
          )}
          <Paragraph type="secondary" italic className="text-center text-sm">
            By signing in, you are agreeing to our{" "}
            <Link
              href="/privacy-policy"
              className="text-primary hover:underline"
            >
              privacy policy
            </Link>
            ,{" "}
            <Link href="/terms-of-use" className="text-primary hover:underline">
              terms of use,{" "}
            </Link>
            and{" "}
            <Link
              href="/code-of-conduct"
              className="text-primary hover:underline"
            >
              code of conduct
            </Link>
            .
          </Paragraph>
        </div>
        <div className="mt-8 flex flex-col items-center">
          <Divider />
          <div className="mt-4 flex flex-col items-center gap-2">
            <Text type="secondary">New to Zelene Platform Community?</Text>
            <Link
              href="/auth/signup"
              className="text-primary font-medium hover:underline"
            >
              Create account
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}