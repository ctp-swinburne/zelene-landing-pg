"use client";

import { useEffect, useState } from "react";
import { type BuiltInProviderType } from "next-auth/providers";
import { type LiteralUnion, getProviders, signIn } from "next-auth/react";
import { z } from "zod";
import { FaGoogle, FaDiscord, FaGithub } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import { Button, Form, Input, Typography, Divider, App } from "antd";
import { useSearchParams } from "next/navigation";

const { Title, Text, Paragraph } = Typography;

const signInSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type SignInSchema = z.infer<typeof signInSchema>;

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
  const error = searchParams?.get("error");

  const [form] = Form.useForm();

  useEffect(() => {
    const fetchProviders = async () => {
      const providers = await getProviders();
      setProviders(providers);
    };
    fetchProviders().catch(console.error);
  }, []);

  if (!providers) {
    return null;
  }

  const oauthProviders = Object.values(providers).filter(
    (provider) => provider.type === "oauth" || provider.type === "oidc",
  );
  const credentialsProvider = Object.values(providers).find(
    (provider) => provider.type === "credentials",
  );

  const onSubmit = async (data: SignInSchema) => {
    try {
      const result = await signIn("credentials", {
        username: data.username,
        password: data.password,
        callbackUrl: "/",
        redirect: false,
      });

      if (result?.error) {
        message.error(
          result.error === "CredentialsSignin"
            ? "Invalid username or password"
            : "Something went wrong",
        );
      } else {
        message.success("Signed in successfully!");
        window.location.href = result?.url ?? "/";
      }
    } catch (error) {
      message.error("An unexpected error occurred");
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 py-8">
      <div className="max-w-l w-xl mx-auto my-8">
        <div className="space-y-4">
          <div className="flex justify-center">
            <Image
              src="/favicon.png"
              alt="Chiyu Lab Logo"
              width={64}
              height={64}
            />
          </div>
          <Title level={2} className="text-center">
            Join the Chiyu Lab DEV community
          </Title>
          <Paragraph type="secondary" className="text-center">
            Chiyu Lab is a community founded by 4 amazing student developers
          </Paragraph>
          {error && (
            <Text type="danger">
              {error === "CredentialsSignin"
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
              onClick={() =>
                void signIn(provider.id, {
                  callbackUrl: "/",
                  redirect: true,
                  error: "/auth/signin",
                })
              }
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
            <Form form={form} onFinish={onSubmit} layout="vertical">
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
              <Form.Item>
                <Button type="primary" htmlType="submit" block>
                  Sign in with username
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
            <Text type="secondary">New to Chiyu Developer Community?</Text>
            <Link
              href="/auth/signup"
              className="text-primary font-medium hover:underline"
            >
              Create account
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}