// admin/_components/AdminHeader.tsx
"use client";

import { Layout, Input, Badge, Avatar, Space, Button } from "antd";
import {
  BellOutlined,
  SearchOutlined,
  SunOutlined,
  MoonOutlined,
} from "@ant-design/icons";
import { useTheme } from "~/app/_components/AntAdminThemeProvider";

const { Header } = Layout;

export default function AdminHeader() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <Header className="flex items-center justify-between px-6 transition-colors duration-200">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold">Zelene IoT Platform</h1>
        <Input
          prefix={<SearchOutlined />}
          placeholder="Quick search..."
          className="w-64"
        />
      </div>

      <Space size="large">
        <Button
          type="text"
          icon={isDark ? <SunOutlined /> : <MoonOutlined />}
          onClick={toggleTheme}
          className="flex items-center justify-center"
        />
        <Badge count={5} size="small">
          <BellOutlined className="text-xl" />
        </Badge>
        <Avatar>A</Avatar>
      </Space>
    </Header>
  );
}
