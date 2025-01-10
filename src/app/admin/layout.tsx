// admin/layout.tsx
"use client";

import React, { useEffect } from "react";
import { Layout, Spin } from "antd";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import AdminHeader from "./_components/AdminHeader";
import AdminSidebar from "./_components/AdminSidebar";
import { AntAdminThemeProvider } from "../_components/AntAdminThemeProvider";

const { Content } = Layout;

const ALLOWED_ROLES = ["ADMIN", "TENANT_ADMIN"];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (
      status !== "loading" &&
      (!session?.user?.role || !ALLOWED_ROLES.includes(session.user.role))
    ) {
      router.push("/");
    }
  }, [session, status, router]);

  if (status === "loading") {
    return (
      <AntAdminThemeProvider>
        <div className="flex min-h-screen items-center justify-center">
          <Spin size="large" tip="Loading..." />
        </div>
      </AntAdminThemeProvider>
    );
  }

  if (!session?.user?.role || !ALLOWED_ROLES.includes(session.user.role)) {
    return null;
  }

  return (
    <AntAdminThemeProvider>
      <Layout className="min-h-screen">
        <AdminHeader />
        <Layout hasSider>
          <AdminSidebar />
          <Layout>
            <Content className="m-6">
              <div className="rounded-lg p-6">{children}</div>
            </Content>
          </Layout>
        </Layout>
      </Layout>
    </AntAdminThemeProvider>
  );
}
