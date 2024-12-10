"use client";

import dynamic from "next/dynamic";
import { Skeleton, Card } from "antd";

const SignInClient = dynamic(() => import("./signin-client"), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <Skeleton active paragraph={{ rows: 8 }} />
      </Card>
    </div>
  ),
});

export default function SignInPage() {
  return <SignInClient />;
}
