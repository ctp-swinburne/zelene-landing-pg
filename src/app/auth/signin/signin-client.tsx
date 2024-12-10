"use client";

import { useEffect, useState } from "react";
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
import { useSearchParams, useRouter } from "next/navigation";

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
  const router = useRouter();
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
  const [isLoading, setIsLoading] = useState(true);

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

  const onSubmit = async (data: SignInSchema) => {
    try {
      const result = await signIn("credentials", {
        username: data.username,
        password: data.password,
        redirect: true,
        callbackUrl: "/",
      });

      if (result?.error) {
        message.error(
          result.error === "CredentialsSignin"
            ? "Invalid username or password"
            : "Something went wrong",
        );
      }
    } catch (error) {
      message.error("An unexpected error occurred");
    }
  };

  // For OAuth providers
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
      </Card>
    </div>
  );
}
