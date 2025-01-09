"use client";

import Link from "next/link";
import { Layout, Menu, Button, Dropdown, Avatar, Tag } from "antd";
import { signIn, useSession, signOut } from "next-auth/react";
import { type Session } from "next-auth";
import { useRouter } from "next/navigation";
import {
  UserOutlined,
  SettingOutlined,
  PlusOutlined,
  DashboardOutlined,
  CrownOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";

const { Header } = Layout;

export function Navbar() {
  const router = useRouter();
  const { data: session } = useSession();

  const isAdmin =
    session?.user.role === "ADMIN" || session?.user.role === "TENANT_ADMIN";
  const isTenantAdmin = session?.user.role === "TENANT_ADMIN";

  // Different menu items based on user role
  const regularMenuItems = [
    { key: "home", label: "Home", href: "/" },
    { key: "about", label: "About", href: "/about" },
    { key: "contact", label: "Contact", href: "/contact" },
  ];

  const adminMenuItems = [
    {
      key: "dashboard",
      label: (
        <span className="flex items-center gap-2">
          <DashboardOutlined />
          Dashboard
        </span>
      ),
      href: "/admin",
    },
    {
      key: "posts",
      label: (
        <span className="flex items-center gap-2">
          <AppstoreOutlined />
          Posts
        </span>
      ),
      href: "/posts",
    },
  ];

  const menuItems = isAdmin ? adminMenuItems : regularMenuItems;

  const handleAuthClick = async () => {
    try {
      if (!session) {
        await signIn();
      }
    } catch (error) {
      console.error("Auth action failed:", error);
    }
  };

  const userDropdownItems: MenuProps["items"] = [
    {
      key: "profile",
      label: <Link href="/profile/me">Profile</Link>,
      icon: <UserOutlined />,
    },
    {
      key: "settings",
      label: <Link href="/settings">Settings</Link>,
      icon: <SettingOutlined />,
    },
    {
      key: "new",
      label: <Link href="/new">Create Post</Link>,
      icon: <PlusOutlined />,
    },
    {
      key: "signout",
      label: "Sign Out",
      onClick: () => void signOut(),
    },
  ];

  const AuthSection = ({ session }: { session: Session | null }) => {
    if (!session) {
      return (
        <Button type="primary" onClick={handleAuthClick}>
          Sign In
        </Button>
      );
    }

    return (
      <div className="flex items-center gap-3">
        {isAdmin && (
          <Tag color={isTenantAdmin ? "gold" : "blue"} icon={<CrownOutlined />}>
            {isTenantAdmin ? "Tenant Admin" : "Admin"}
          </Tag>
        )}
        <Dropdown
          menu={{ items: userDropdownItems }}
          placement="bottomRight"
          arrow={{ pointAtCenter: true }}
        >
          <Avatar
            src={session.user.image}
            icon={<UserOutlined />}
            className="cursor-pointer"
          />
        </Dropdown>
      </div>
    );
  };

  return (
    <Header
      style={{
        background: isAdmin ? "#001529" : "#fff",
        padding: "0 20px",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          height: "100%",
        }}
      >
        <Link
          href="/"
          className={`text-xl font-bold ${isAdmin ? "text-white" : "text-black"}`}
        >
          Zelene
        </Link>
        <div className="flex items-center gap-4">
          <Menu
            mode="horizontal"
            selectedKeys={[]}
            style={{
              border: "none",
              lineHeight: "inherit",
              background: isAdmin ? "#001529" : "transparent",
            }}
            theme={isAdmin ? "dark" : "light"}
          >
            {menuItems.map((item) => (
              <Menu.Item
                key={item.key}
                style={{
                  padding: "0 20px",
                  marginRight: "8px",
                  borderBottom: "none",
                }}
              >
                <Link
                  href={item.href}
                  style={{
                    textDecoration: "none",
                    position: "relative",
                  }}
                >
                  {item.label}
                </Link>
              </Menu.Item>
            ))}
          </Menu>
          <AuthSection session={session} />
        </div>
      </div>
    </Header>
  );
}
