"use client";

import Link from "next/link";
import { Typography, Button, Card, Row, Col, Space } from "antd";
import {
  FaLightbulb,
  FaShieldAlt,
  FaUsers,
  FaHandshake,
  FaChartLine,
  FaCogs,
} from "react-icons/fa";
import { IoMdAnalytics } from "react-icons/io";

const { Title, Paragraph } = Typography;

export default function AboutPage() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-white">
      {/* Hero Section */}
      <section className="w-full bg-gradient-to-b from-[#d6e4e9] to-white px-4 py-20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center">
            <Title level={1} className="mb-6" style={{ color: "#2c3e50" }}>
              About Zelene Platform
            </Title>
            <Paragraph
              className="mx-auto mb-8 max-w-3xl text-xl"
              style={{ color: "#88b2b8" }}
            >
              A collaboration between innovative minds at Viettel 5G & IoT
              Innovation Lab to revolutionize urban infrastructure management
            </Paragraph>
          </div>
        </div>
      </section>

      {/* Project Overview */}
      <section className="w-full px-4 py-16">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-16">
            <Title
              level={2}
              className="mb-6 text-center"
              style={{ color: "#2c3e50" }}
            >
              Project Overview
            </Title>
            <Paragraph className="text-lg" style={{ color: "#88b2b8" }}>
              Zelene Platform emerged from a collaboration with Viettel 5G & IoT
              Innovation Lab, aimed at addressing critical challenges in urban
              lighting infrastructure. Our platform integrates cutting-edge IoT
              technology with practical city management solutions, focusing on
              energy efficiency, maintenance optimization, and smart city
              integration.
            </Paragraph>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="w-full bg-[#f7fafc] px-4 py-16">
        <div className="container mx-auto max-w-6xl">
          <Title
            level={2}
            className="mb-12 text-center"
            style={{ color: "#2c3e50" }}
          >
            Our Team
          </Title>
          <Row gutter={[32, 32]}>
            <Col xs={24} md={8}>
              <Card className="h-full text-center" bordered={false}>
                <FaCogs
                  className="mx-auto mb-4 text-4xl"
                  style={{ color: "#0bdc84" }}
                />
                <Title level={3}>Solution Architecture</Title>
                <Paragraph style={{ color: "#88b2b8" }}>
                  Led by skilled engineers with expertise in IoT platforms and
                  smart city solutions
                </Paragraph>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card className="h-full text-center" bordered={false}>
                <IoMdAnalytics
                  className="mx-auto mb-4 text-4xl"
                  style={{ color: "#0bdc84" }}
                />
                <Title level={3}>Development Team</Title>
                <Paragraph style={{ color: "#88b2b8" }}>
                  Full-stack developers specializing in IoT data processing and
                  visualization
                </Paragraph>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card className="h-full text-center" bordered={false}>
                <FaShieldAlt
                  className="mx-auto mb-4 text-4xl"
                  style={{ color: "#0bdc84" }}
                />
                <Title level={3}>Quality Assurance</Title>
                <Paragraph style={{ color: "#88b2b8" }}>
                  Dedicated to ensuring platform reliability and security
                  compliance
                </Paragraph>
              </Card>
            </Col>
          </Row>
        </div>
      </section>

      {/* Core Values */}
      <section className="w-full px-4 py-16">
        <div className="container mx-auto max-w-6xl">
          <Title
            level={2}
            className="mb-12 text-center"
            style={{ color: "#2c3e50" }}
          >
            Our Core Values
          </Title>
          <Row gutter={[32, 32]}>
            <Col xs={24} md={6}>
              <Card className="h-full" bordered={false}>
                <FaLightbulb
                  className="mb-4 text-4xl"
                  style={{ color: "#0bdc84" }}
                />
                <Title level={3}>Innovation</Title>
                <Paragraph style={{ color: "#88b2b8" }}>
                  Pioneering smart solutions for urban lighting challenges
                </Paragraph>
              </Card>
            </Col>
            <Col xs={24} md={6}>
              <Card className="h-full" bordered={false}>
                <FaHandshake
                  className="mb-4 text-4xl"
                  style={{ color: "#0bdc84" }}
                />
                <Title level={3}>Collaboration</Title>
                <Paragraph style={{ color: "#88b2b8" }}>
                  Working closely with city planners and infrastructure teams
                </Paragraph>
              </Card>
            </Col>
            <Col xs={24} md={6}>
              <Card className="h-full" bordered={false}>
                <FaChartLine
                  className="mb-4 text-4xl"
                  style={{ color: "#0bdc84" }}
                />
                <Title level={3}>Efficiency</Title>
                <Paragraph style={{ color: "#88b2b8" }}>
                  Optimizing resource usage and operational costs
                </Paragraph>
              </Card>
            </Col>
            <Col xs={24} md={6}>
              <Card className="h-full" bordered={false}>
                <FaUsers
                  className="mb-4 text-4xl"
                  style={{ color: "#0bdc84" }}
                />
                <Title level={3}>Community</Title>
                <Paragraph style={{ color: "#88b2b8" }}>
                  Creating solutions that benefit urban communities
                </Paragraph>
              </Card>
            </Col>
          </Row>
        </div>
      </section>

      {/* Partnership Section */}
      <section className="w-full bg-[#f7fafc] px-4 py-16">
        <div className="container mx-auto max-w-4xl text-center">
          <Title level={2} className="mb-6" style={{ color: "#2c3e50" }}>
            Our Partnership
          </Title>
          <Paragraph className="mb-8 text-lg" style={{ color: "#88b2b8" }}>
            In collaboration with Viettel 5G & IoT Innovation Lab, we&apos;re
            developing next-generation solutions for smart city infrastructure.
            This partnership combines academic innovation with industry
            expertise to create practical, scalable solutions for urban lighting
            challenges.
          </Paragraph>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full bg-[#2c3e50] px-4 py-16">
        <div className="container mx-auto max-w-6xl text-center">
          <Title level={2} className="mb-6" style={{ color: "#ffffff" }}>
            Join Us in Transforming Urban Infrastructure
          </Title>
          <Space size="large">
            <Button type="primary" size="large" shape="round">
              <Link href="/contact">Contact Us</Link>
            </Button>
            <Button size="large" shape="round">
              <Link href="/">Back to Home</Link>
            </Button>
          </Space>
        </div>
      </section>
    </main>
  );
}
