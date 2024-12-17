"use client";

import Link from "next/link";
import { Layout, Menu, Button, Drawer } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import { useState } from "react";

const { Header } = Layout;

export function Navbar() {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const menuItems = [
    { key: "home", label: "Home", href: "/" },
    { key: "about", label: "About", href: "/about" },
    { key: "contact", label: "Contact", href: "/contact" },
  ];

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
          <Button type="primary">
            <Link href="/auth/signin">Sign In</Link>
          </Button>
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
            <Menu.Item key="signin">
              <Link href="/auth/signin">Sign In</Link>
            </Menu.Item>
          </Menu>
        </Drawer>
      </div>
    </Header>
  );
}
