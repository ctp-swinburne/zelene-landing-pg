"use client";

import { signOut } from "next-auth/react";
import Link from "next/link";
import { Card, Typography, Button } from "antd";

const { Title, Text } = Typography;

export default function SignOutPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4">
      <Card className="mx-auto w-full max-w-md">
        <div className="space-y-1">
          <Title level={2}>Sign out</Title>
          <Text type="secondary">Are you sure you want to sign out?</Text>
        </div>
        <div className="my-4 grid gap-4">
          <Button
            type="primary"
            block
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            Yes, sign me out
          </Button>
          <Link href="/">
            <Button block>No, take me back</Button>
          </Link>
        </div>
        <div>
          <Text type="secondary" className="text-sm">
            You can always sign back in later
          </Text>
        </div>
      </Card>
    </main>
  );
}
