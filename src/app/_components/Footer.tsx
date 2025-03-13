// src/app/_components/Footer.tsx
"use client";

import { type FC } from "react";
import { Layout, Row, Col, Typography, Space, Divider } from "antd";
import {
  GithubOutlined,
  MailOutlined,
  GlobalOutlined,
} from "@ant-design/icons";

const { Link, Text, Title } = Typography;

interface FooterSection {
  title: string;
  items: Array<{
    label: string;
    href: string;
  }>;
}

const footerSections: FooterSection[] = [
  {
    title: "Platform",
    items: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Device Management", href: "/devices" },
      { label: "Analytics", href: "/analytics" },
      { label: "Documentation", href: "/docs" },
    ],
  },
  {
    title: "Resources",
    items: [
      { label: "User Guide", href: "/guide" },
      { label: "System Status", href: "/status" },
      { label: "Security", href: "/security" },
    ],
  },
  {
    title: "Support",
    items: [
      { label: "Help Center", href: "/help" },
      { label: "Contact Support", href: "/contact" },
      { label: "Report Issue", href: "/issues" },
      { label: "Feedback", href: "/feedback" },
      { label: "Query Lookup", href: "/queries-lookup" },
    ],
  },
];

export const AppFooter: FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Layout.Footer
      style={{
        background: "#ffffff",
        padding: "48px 24px 24px",
        color: "#2c3e50",
      }}
    >
      <Row gutter={[32, 32]} justify="space-between">
        {/* Brand Section */}
        <Col xs={24} sm={24} md={8}>
          <Title level={4} style={{ color: "#0bdc84", marginBottom: 16 }}>
            Zelene Platform
          </Title>
          <Text style={{ color: "#88b2b8" }}>
            Smart city lighting control solution powered by IoT technology.
            Efficient, sustainable, and intelligent urban infrastructure
            management.
          </Text>
          <Space direction="vertical" style={{ marginTop: 24 }}>
            <Text strong>Viettel 5G & IoT Innovation Lab</Text>
            <Link
              href="mailto:info@zelene.viettel.com.vn"
              style={{ color: "#04bd6c" }}
            >
              <MailOutlined /> info@zelene.viettel.com.vn
            </Link>
          </Space>
        </Col>

        {/* Navigation Sections */}
        {footerSections.map((section) => (
          <Col key={section.title} xs={24} sm={8} md={5}>
            <Title level={5} style={{ color: "#2c3e50", marginBottom: 16 }}>
              {section.title}
            </Title>
            <Space direction="vertical">
              {section.items.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  style={{ color: "#88b2b8" }}
                >
                  {item.label}
                </Link>
              ))}
            </Space>
          </Col>
        ))}
      </Row>

      <Divider style={{ borderColor: "#d6e4e9", margin: "32px 0" }} />

      {/* Bottom Section */}
      <Row justify="space-between" align="middle">
        <Col>
          <Text style={{ color: "#88b2b8" }}>
            © {currentYear} Zelene Platform. All rights reserved.
          </Text>
        </Col>
        <Col>
          <Space size="large">
            <Link
              href="https://github.com/zelene-platform"
              style={{ color: "#88b2b8" }}
            >
              <GithubOutlined style={{ fontSize: 20 }} />
            </Link>
            <Link
              href="https://zelene.viettel.com.vn"
              style={{ color: "#88b2b8" }}
            >
              <GlobalOutlined style={{ fontSize: 20 }} />
            </Link>
          </Space>
        </Col>
      </Row>
    </Layout.Footer>
  );
};
