"use client";

import { Layout, Menu } from "antd";
import { useRouter } from "next/navigation";
import {
  FileTextOutlined,
  MessageOutlined,
  AlertOutlined,
  LikeOutlined,
  QuestionCircleOutlined,
  UserOutlined,
  SettingOutlined,
} from "@ant-design/icons";

const { Sider } = Layout;

const menuItems = [
  {
    key: "content",
    icon: <FileTextOutlined />,
    label: "Content",
    children: [
      { key: "/admin/news", label: "Official News" },
      { key: "/admin/blog", label: "Tech Blog" },
    ],
  },
  {
    key: "support",
    icon: <MessageOutlined />,
    label: "Support",
    children: [
      { key: "/admin/contact", label: "Contact Queries" },
      { key: "/admin/issues", label: "Technical Issues" },
      { key: "/admin/feedback", label: "User Feedback" },
      { key: "/admin/help", label: "Help Center" },
    ],
  },
  {
    key: "admin",
    icon: <SettingOutlined />,
    label: "Administration",
    children: [
      { key: "/admin/users", label: "User Management" },
      { key: "/admin/settings", label: "Settings" },
    ],
  },
];

export default function AdminSidebar() {
  const router = useRouter();

  return (
    <Sider width={200} className="bg-white">
      <Menu
        mode="inline"
        defaultSelectedKeys={["/admin"]}
        defaultOpenKeys={["content", "support", "admin"]}
        style={{ height: "100%", borderRight: 0 }}
        items={menuItems}
        onClick={({ key }) => router.push(key)}
      />
    </Sider>
  );
}
