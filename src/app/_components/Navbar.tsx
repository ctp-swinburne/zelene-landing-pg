"use client";

import Link from "next/link";
import { Layout, Menu, Button } from "antd";
import { signIn, useSession } from "next-auth/react";
import { type Session } from "next-auth";
import { useRouter } from "next/navigation";

const { Header } = Layout;

export function Navbar() {
  const router = useRouter();
  const { data: session } = useSession();

  const menuItems = [
    { key: "home", label: "Home", href: "/" },
    { key: "about", label: "About", href: "/about" },
    { key: "contact", label: "Contact", href: "/contact" },
  ];

  const handleAuthClick = async () => {
    try {
      if (session) {
        router.push("/auth/signout");
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
        <div className="flex items-center gap-4">
          <Menu
            mode="horizontal"
            selectedKeys={[]}
            style={{
              border: "none",
              lineHeight: "inherit",
            }}
            className="bg-transparent"
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
          <AuthButton session={session} />
        </div>
      </div>
    </Header>
  );
}
