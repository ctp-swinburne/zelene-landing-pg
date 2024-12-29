"use client";

import Link from "next/link";
import { Button, Card, Typography, Row, Col, Space } from "antd";
import {
  FaLightbulb,
  FaChartLine,
  FaShieldAlt,
  FaCity,
  FaLeaf,
  FaSolarPanel,
  FaWifi,
  FaCogs,
} from "react-icons/fa";
import { IoMdAnalytics } from "react-icons/io";

const { Title, Paragraph, Text } = Typography;

export default function LandingPage() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-white">
      {/* Hero Section */}
      <section className="w-full bg-gradient-to-b from-[#d6e4e9] to-white px-4 py-20">
        <div className="container mx-auto max-w-6xl text-center">
          <Title level={1} className="mb-6" style={{ color: "#2c3e50" }}>
            Zelene IoT Platform
          </Title>
          <Paragraph
            className="mx-auto mb-8 max-w-3xl text-xl"
            style={{ color: "#88b2b8" }}
          >
            Revolutionizing city infrastructure with smart lighting solutions.
            Efficient, sustainable, and intelligent urban management powered by
            IoT technology.
          </Paragraph>
          <Space size="large">
            <Button
              type="primary"
              size="large"
              shape="round"
              style={{ backgroundColor: "#0bdc84" }}
            >
              <Link href="/contact">Request Demo</Link>
            </Button>
            <Button
              size="large"
              shape="round"
              style={{ borderColor: "#0bdc84", color: "#0bdc84" }}
            >
              <Link href="/documentation">View Documentation</Link>
            </Button>
          </Space>
        </div>
      </section>

      {/* Stats Section */}
      <section className="w-full bg-white px-4 py-16">
        <div className="container mx-auto max-w-6xl">
          <Row gutter={[32, 32]} justify="center">
            <Col xs={24} sm={8}>
              <Card className="text-center" bordered={false}>
                <Title level={2} style={{ color: "#0bdc84", marginBottom: 0 }}>
                  30%
                </Title>
                <Text style={{ color: "#88b2b8" }}>Energy Savings</Text>
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card className="text-center" bordered={false}>
                <Title level={2} style={{ color: "#0bdc84", marginBottom: 0 }}>
                  5min
                </Title>
                <Text style={{ color: "#88b2b8" }}>Response Time</Text>
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card className="text-center" bordered={false}>
                <Title level={2} style={{ color: "#0bdc84", marginBottom: 0 }}>
                  99.9%
                </Title>
                <Text style={{ color: "#88b2b8" }}>Uptime</Text>
              </Card>
            </Col>
          </Row>
        </div>
      </section>

      {/* Main Features Section */}
      <section className="w-full bg-[#f7fafc] px-4 py-16">
        <div className="container mx-auto max-w-6xl">
          <Title
            level={2}
            className="mb-12 text-center"
            style={{ color: "#2c3e50" }}
          >
            Comprehensive IoT Platform Features
          </Title>
          <Row gutter={[32, 32]}>
            <Col xs={24} md={8}>
              <Card className="h-full" bordered={false}>
                <FaLightbulb
                  className="mb-4 text-4xl"
                  style={{ color: "#0bdc84" }}
                />
                <Title level={3}>Smart Light Control</Title>
                <Paragraph style={{ color: "#88b2b8" }}>
                  Advanced control system for city lighting infrastructure with
                  real-time monitoring and automated adjustments based on
                  environmental conditions.
                </Paragraph>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card className="h-full" bordered={false}>
                <IoMdAnalytics
                  className="mb-4 text-4xl"
                  style={{ color: "#0bdc84" }}
                />
                <Title level={3}>Data Analytics</Title>
                <Paragraph style={{ color: "#88b2b8" }}>
                  Comprehensive analytics dashboard for energy consumption
                  patterns, performance metrics, and predictive maintenance
                  insights.
                </Paragraph>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card className="h-full" bordered={false}>
                <FaShieldAlt
                  className="mb-4 text-4xl"
                  style={{ color: "#0bdc84" }}
                />
                <Title level={3}>Security First</Title>
                <Paragraph style={{ color: "#88b2b8" }}>
                  Enterprise-grade security with encrypted communications, OAuth
                  2.0 authentication, and comprehensive audit trails.
                </Paragraph>
              </Card>
            </Col>
          </Row>
        </div>
      </section>

      {/* Technical Features */}
      <section className="w-full px-4 py-16">
        <div className="container mx-auto max-w-6xl">
          <Title
            level={2}
            className="mb-12 text-center"
            style={{ color: "#2c3e50" }}
          >
            Technical Capabilities
          </Title>
          <Row gutter={[32, 32]}>
            <Col xs={24} sm={12} md={6}>
              <Card className="h-full text-center" bordered={false}>
                <FaWifi
                  className="mx-auto mb-4 text-3xl"
                  style={{ color: "#0bdc84" }}
                />
                <Title level={4}>TCP Support</Title>
                <Paragraph style={{ color: "#88b2b8" }}>
                  Optimized for cellular devices with reliable TCP connectivity
                </Paragraph>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card className="h-full text-center" bordered={false}>
                <FaCogs
                  className="mx-auto mb-4 text-3xl"
                  style={{ color: "#0bdc84" }}
                />
                <Title level={4}>MQTT Protocol</Title>
                <Paragraph style={{ color: "#88b2b8" }}>
                  Efficient messaging for IoT devices
                </Paragraph>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card className="h-full text-center" bordered={false}>
                <FaChartLine
                  className="mx-auto mb-4 text-3xl"
                  style={{ color: "#0bdc84" }}
                />
                <Title level={4}>Real-time Data</Title>
                <Paragraph style={{ color: "#88b2b8" }}>
                  Instant monitoring and control
                </Paragraph>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card className="h-full text-center" bordered={false}>
                <FaCity
                  className="mx-auto mb-4 text-3xl"
                  style={{ color: "#0bdc84" }}
                />
                <Title level={4}>Smart City Ready</Title>
                <Paragraph style={{ color: "#88b2b8" }}>
                  Built for urban infrastructure
                </Paragraph>
              </Card>
            </Col>
          </Row>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="w-full bg-[#f7fafc] px-4 py-16">
        <div className="container mx-auto max-w-6xl">
          <Title
            level={2}
            className="mb-12 text-center"
            style={{ color: "#2c3e50" }}
          >
            Key Benefits
          </Title>
          <Row gutter={[32, 32]}>
            <Col xs={24} md={12}>
              <Card className="h-full" bordered={false}>
                <Space align="start">
                  <FaLeaf className="text-3xl" style={{ color: "#0bdc84" }} />
                  <div>
                    <Title level={4}>Energy Efficiency</Title>
                    <Paragraph style={{ color: "#88b2b8" }}>
                      Reduce energy consumption by up to 30% through smart
                      lighting controls and automated dimming strategies.
                    </Paragraph>
                  </div>
                </Space>
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card className="h-full" bordered={false}>
                <Space align="start">
                  <FaSolarPanel
                    className="text-3xl"
                    style={{ color: "#0bdc84" }}
                  />
                  <div>
                    <Title level={4}>Sustainable Infrastructure</Title>
                    <Paragraph style={{ color: "#88b2b8" }}>
                      Future-proof your city with scalable IoT infrastructure
                      that supports multiple smart city initiatives.
                    </Paragraph>
                  </div>
                </Space>
              </Card>
            </Col>
          </Row>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full bg-[#2c3e50] px-4 py-16">
        <div className="container mx-auto max-w-6xl text-center">
          <Title level={2} className="mb-6" style={{ color: "#ffffff" }}>
            Ready to Transform Your City Infrastructure?
          </Title>
          <Paragraph className="mb-8" style={{ color: "#d6e4e9" }}>
            Join Viettel 5G & IoT Innovation Lab in building smarter, more
            sustainable cities
          </Paragraph>
          <Space size="large">
            <Button
              type="primary"
              size="large"
              shape="round"
              style={{ backgroundColor: "#0bdc84" }}
            >
              <Link href="/contact">Schedule a Demo</Link>
            </Button>
            <Button
              size="large"
              shape="round"
              style={{ borderColor: "#ffffff", color: "#ffffff" }}
            >
              <Link href="/about">Learn More</Link>
            </Button>
          </Space>
        </div>
      </section>
    </main>
  );
}
