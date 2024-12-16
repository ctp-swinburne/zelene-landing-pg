"use client";

import { useEffect, useState } from "react";
import { type BuiltInProviderType } from "next-auth/providers";
import { type LiteralUnion, getProviders, signIn } from "next-auth/react";
import { Button, Typography, Divider } from "antd";
import Image from "next/image";
import Link from "next/link";
import { FaGoogle, FaDiscord, FaGithub } from "react-icons/fa";

const { Title, Paragraph } = Typography;

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

export default function SignUpOptions() {
  const [providers, setProviders] = useState<Record<
    LiteralUnion<BuiltInProviderType>,
    any
  > | null>(null);

  useEffect(() => {
    getProviders().then(setProviders);
  }, []);

  if (!providers) return null;

  const oauthProviders = Object.values(providers).filter(
    (provider) => provider.type === "oauth" || provider.type === "oidc"
  );

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
            Choose how you want to create your account
          </Paragraph>
        </div>

        <div className="mt-8 grid gap-4">
          {oauthProviders.map((provider) => (
            <Button
              key={provider.id}
              block
              onClick={() => 
                signIn(provider.id, {
                  callbackUrl: "/",
                  redirect: true,
                  error: "/auth/signin"
                })
              }
            >
              <div className="relative flex w-full items-center justify-center">
                <div className="absolute left-0">
                  {getProviderIcon(provider.id)}
                </div>
                <div>Sign up with {provider.name}</div>
              </div>
            </Button>
          ))}

          <Divider>Or</Divider>

          <Link href="/auth/signup">
            <Button type="primary" block>
              Create new account
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
} 