// admin/_components/AdminHeader.tsx
"use client";

import { Layout, Input, Badge, Avatar, Space, Button, Popover, Tag } from "antd";
import {
  BellOutlined,
  SearchOutlined,
  SunOutlined,
  MoonOutlined,
  UserOutlined,
  CrownOutlined,
} from "@ant-design/icons";
import { useTheme } from "~/app/_components/AntAdminThemeProvider";
import { useSession } from "next-auth/react";

const { Header } = Layout;

export default function AdminHeader() {
  const { isDark, toggleTheme } = useTheme();
  const { data: session } = useSession();

  const isTenantAdmin = session?.user.role === "TENANT_ADMIN";
  const isAdmin = session?.user.role === "ADMIN" || isTenantAdmin;

  const avatarContent = (
    <div className="flex flex-col gap-2 min-w-[200px]">
      <div className="font-medium">Hello, {session?.user.name}</div>
      <div className="text-gray-500">
        {isTenantAdmin ? "Tenant Administrator" : "Administrator"}
      </div>
      {isAdmin && (
        <Tag color={isTenantAdmin ? "gold" : "blue"} icon={<CrownOutlined />}>
          {isTenantAdmin ? "Tenant Admin" : "Admin"}
        </Tag>
      )}
      <hr className="my-2" />
    </div>
  );

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
        <Popover 
          content={avatarContent}
          trigger="click"
          placement="bottomRight"
        >
          <Avatar
            src={session?.user.image}
            icon={<UserOutlined />}
            style={{ cursor: 'pointer' }}
            className="bg-blue-500"
          >
            {!session?.user.image && session?.user.name?.[0]}
          </Avatar>
        </Popover>
      </Space>
    </Header>
  );
}