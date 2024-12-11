"use client";

import Link from "next/link";
import { Button, Card, Typography, Row, Col } from "antd";
import { FaLeaf, FaUsers, FaGlobeAmericas } from "react-icons/fa";

const { Title, Paragraph } = Typography;

export default function LandingPage() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-white">
      {/* Hero Section */}
      <section className="w-full bg-gradient-to-b from-blue-50 to-white px-4 py-20">
        <div className="container mx-auto max-w-6xl text-center">
          <Title level={1} className="mb-6">
            Welcome to Zelene
          </Title>
          <Paragraph className="mx-auto mb-8 max-w-2xl text-xl">
            Empowering sustainable solutions for a better tomorrow
          </Paragraph>
          <Button
            type="primary"
            size="large"
            shape="round"
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Link href="/contact">Get Started</Link>
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full px-4 py-16">
        <div className="container mx-auto max-w-6xl">
          <Row gutter={[32, 32]}>
            <Col xs={24} md={8}>
              <Card className="h-full text-center" bordered={false}>
                <FaLeaf className="mx-auto mb-4 text-4xl text-green-600" />
                <Title level={3}>Sustainable Solutions</Title>
                <Paragraph>
                  Innovative approaches to environmental challenges
                </Paragraph>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card className="h-full text-center" bordered={false}>
                <FaUsers className="mx-auto mb-4 text-4xl text-green-600" />
                <Title level={3}>Expert Team</Title>
                <Paragraph>
                  Dedicated professionals committed to excellence
                </Paragraph>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card className="h-full text-center" bordered={false}>
                <FaGlobeAmericas className="mx-auto mb-4 text-4xl text-green-600" />
                <Title level={3}>Global Impact</Title>
                <Paragraph>
                  Making a difference across communities worldwide
                </Paragraph>
              </Card>
            </Col>
          </Row>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full bg-gray-50 px-4 py-16">
        <div className="container mx-auto max-w-6xl text-center">
          <Title level={2} className="mb-6">
            Ready to Join Us?
          </Title>
          <Button
            type="primary"
            size="large"
            shape="round"
            className="bg-gray-900 hover:bg-gray-800"
          >
            <Link href="/about">Learn More</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
