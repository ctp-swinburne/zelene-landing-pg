"use client";
import Link from "next/link";
import { Layout, Menu, Button, Drawer } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { type Session } from "next-auth";
import { useRouter } from "next/navigation"; // Changed this line

const { Header } = Layout;

export function Navbar() {
  const router = useRouter();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const { data: session, status } = useSession();

  const menuItems = [
    { key: "home", label: "Home", href: "/" },
    { key: "about", label: "About", href: "/about" },
    { key: "contact", label: "Contact", href: "/contact" },
  ];

  const handleAuthClick = async () => {
    try {
      if (session) {
        router.push("/auth/signout"); // Changed to use router.push without await
      } else {
        await signIn();
      }
    } catch (error) {
      console.error("Auth action failed:", error);
    }
  };

  const AuthButton = ({
    session,
    className,
  }: {
    session: Session | null;
    className?: string;
  }) => (
    <Button type="primary" onClick={handleAuthClick} className={className}>
      {session ? "Sign Out" : "Sign In"}
    </Button>
  );

  return (
    <Header style={{ background: "#fff", padding: "0 20px" }}>
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
        <Link href="/" className="text-xl font-bold">
          Zelene
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-4 md:flex">
          <Menu mode="horizontal" selectedKeys={[]} style={{ border: "none" }}>
            {menuItems.map((item) => (
              <Menu.Item key={item.key}>
                <Link href={item.href}>{item.label}</Link>
              </Menu.Item>
            ))}
          </Menu>
          <AuthButton session={session} />
        </div>

        {/* Mobile Menu Button */}
        <Button
          className="md:hidden"
          type="text"
          icon={<MenuOutlined />}
          onClick={() => setMobileDrawerOpen(true)}
        />

        {/* Mobile Drawer */}
        <Drawer
          title="Menu"
          placement="right"
          onClose={() => setMobileDrawerOpen(false)}
          open={mobileDrawerOpen}
          bodyStyle={{ padding: 0 }}
        >
          <Menu mode="vertical" style={{ border: "none" }}>
            {menuItems.map((item) => (
              <Menu.Item key={item.key}>
                <Link href={item.href}>{item.label}</Link>
              </Menu.Item>
            ))}
            <Menu.Item key="auth">
              <AuthButton session={session} className="w-full" />
            </Menu.Item>
          </Menu>
        </Drawer>
      </div>
    </Header>
  );
}
