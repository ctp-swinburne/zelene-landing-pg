"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "antd";

const SignInPage = dynamic(() => import("./signin-client"), {
  ssr: false,
  loading: () => (
    <main className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="mx-auto w-full max-w-md">
        <Skeleton.Input
          active
          block
          style={{ height: 600, borderRadius: "0.5rem" }}
        />
      </div>
    </main>
  ),
});

export default SignInPage;
