//admin/_components/AdminSidebar.tsx
"use client";

import { Layout, Menu, App, Button } from "antd";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  FileTextOutlined,
  MessageOutlined,
  UserOutlined,
  LogoutOutlined,
  ExclamationCircleFilled,
  EditOutlined,
  CrownOutlined,
} from "@ant-design/icons";

const { Sider } = Layout;

const menuItems = [
  {
    key: "content",
    icon: <FileTextOutlined />,
    label: "Content",
    children: [
      { key: "/admin/posts", label: "Posts", icon: <EditOutlined /> },
      { key: "/admin/news", label: "Official News", icon: <CrownOutlined /> },
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
      { key: "/admin/support", label: "Support Center" },
    ],
  },
  {
    key: "admin",
    icon: <UserOutlined />,
    label: "Administration",
    children: [
      { key: "/admin/users", label: "User Management" },
      { 
        key: "signout", 
        label: "Sign out",
        icon: <LogoutOutlined />,
        danger: true,
      },
    ],
  },
];

export default function AdminSidebar() {
  const router = useRouter();
  const { modal } = App.useApp();

  const showSignOutConfirm = () => {
    modal.confirm({
      title: 'Are you sure you want to sign out?',
      icon: <ExclamationCircleFilled />,
      content: 'You will need to sign in again to access the admin panel.',
      okText: 'Sign out',
      okType: 'danger',
      cancelText: 'Cancel',
      async onOk() {
        try {
          await signOut({ 
            redirect: true,
            callbackUrl: "/"
          });
        } catch (error) {
          console.error('Error signing out:', error);
        }
      },
    });
  };

  const handleMenuClick = (info: { key: string }) => {
    if (info.key === "signout") {
      showSignOutConfirm();
    } else {
      router.push(info.key);
    }
  };

  return (
    <Sider width={200} className="bg-white">
      <Menu
        mode="inline"
        defaultSelectedKeys={["/admin"]}
        defaultOpenKeys={["content", "support", "admin"]}
        style={{ height: "100%", borderRight: 0 }}
        items={menuItems}
        onClick={handleMenuClick}
      />
    </Sider>
  );
}