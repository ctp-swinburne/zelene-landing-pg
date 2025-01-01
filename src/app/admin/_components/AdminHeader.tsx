"use client";

import { Layout, Input, Badge, Avatar, Space } from "antd";
import { BellOutlined, SearchOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";

const { Header } = Layout;

export default function AdminHeader() {
  return (
    <Header className="flex items-center justify-between bg-white px-6">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold">IoT Platform</h1>
        <Input
          prefix={<SearchOutlined />}
          placeholder="Quick search..."
          className="w-64"
        />
      </div>

      <Space size="large">
        <Badge count={5} size="small">
          <BellOutlined className="text-xl" />
        </Badge>
        <Avatar>A</Avatar>
      </Space>
    </Header>
  );
}
