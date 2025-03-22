"use client";

import Link from "next/link";
import { Layout, Menu, Button, Dropdown, Avatar, Tag, Space } from "antd";
import { signIn, useSession, signOut } from "next-auth/react";
import { type Session } from "next-auth";
import { useRouter } from "next/navigation";
import {
  UserOutlined,
  SettingOutlined,
  PlusOutlined,
  DashboardOutlined,
  CrownOutlined,
  DownOutlined,
  AppstoreOutlined,
  FileTextOutlined,
  ReadOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";

const { Header } = Layout;

export function Navbar() {
  const router = useRouter();
  const { data: session } = useSession();

  const isAdmin =
    session?.user.role === "ADMIN" || session?.user.role === "TENANT_ADMIN";
  const isTenantAdmin = session?.user.role === "TENANT_ADMIN";

  // Posts dropdown menu for all users
  const postsMenu = {
    items: [
      {
        key: 'all-posts',
        label: 'All Posts',
        icon: <FileTextOutlined />,
        onClick: () => router.push('/posts'),
      },
      {
        key: 'official-posts',
        label: 'Official Posts',
        icon: <CrownOutlined />,
        onClick: () => router.push('/posts?official=true'),
      },
    ],
  };

  // Regular menu items - now includes Posts
  const regularMenuItems = [
    { key: "home", label: "Home", href: "/" },
    { key: "about", label: "About", href: "/about" },
    { 
      key: "posts", 
      label: (
        <Dropdown menu={postsMenu} trigger={['hover']}>
          <span className="flex items-center gap-2 cursor-pointer">
            <ReadOutlined />
            Posts
            <DownOutlined style={{ fontSize: '12px' }} />
          </span>
        </Dropdown>
      ),
    },
    { key: "contact", label: "Contact", href: "/contact" },
  ];

  // Admin menu items with dashboard access
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
        <Dropdown menu={postsMenu} trigger={['hover']}>
          <span className="flex items-center gap-2 cursor-pointer">
            <AppstoreOutlined />
            Posts
            <DownOutlined style={{ fontSize: '12px' }} />
          </span>
        </Dropdown>
      ),
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

  // User dropdown items - Create Post is available to all authenticated users
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
                {item.href ? (
                  <Link
                    href={item.href}
                    style={{
                      textDecoration: "none",
                      position: "relative",
                    }}
                  >
                    {item.label}
                  </Link>
                ) : (
                  item.label
                )}
              </Menu.Item>
            ))}
          </Menu>
          <AuthSection session={session} />
        </div>
      </div>
    </Header>
  );
}