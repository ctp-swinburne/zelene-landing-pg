// admin/layout.tsx
"use client";

import React from "react";
import { Layout } from "antd";
import AdminHeader from "./_components/AdminHeader";
import AdminSidebar from "./_components/AdminSidebar";

const { Content } = Layout;

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Layout className="min-h-screen">
      <AdminHeader />
      <Layout>
        <AdminSidebar />
        <Layout>
          <Content className="m-6 rounded-lg bg-white p-6">{children}</Content>
        </Layout>
      </Layout>
    </Layout>
  );
}
