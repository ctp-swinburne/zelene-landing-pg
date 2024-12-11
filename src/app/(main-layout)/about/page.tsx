"use client";

import Link from "next/link";
import { Typography, Button, Card, Row, Col } from "antd";
import { FaLightbulb, FaLeaf, FaUsers } from "react-icons/fa";

const { Title, Paragraph } = Typography;

export default function AboutPage() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-white">
      {/* Hero Section */}
      <section className="w-full bg-gradient-to-b from-green-50 to-white px-4 py-20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center">
            <Title level={1} className="mb-6">
              About Zelene
            </Title>
            <Paragraph className="mx-auto mb-8 max-w-2xl text-xl">
              Driving innovation in sustainability and environmental solutions
            </Paragraph>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="w-full px-4 py-16">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-16 text-center">
            <Title level={2} className="mb-6">
              Our Mission
            </Title>
            <Paragraph className="text-lg">
              At Zelene, we&apos;re committed to creating sustainable solutions
              that make a real difference in the world. Our mission is to
              innovate and implement environmentally conscious practices that
              benefit both people and planet.
            </Paragraph>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="w-full bg-gray-50 px-4 py-16">
        <div className="container mx-auto max-w-6xl">
          <Title level={2} className="mb-12 text-center">
            Our Values
          </Title>
          <Row gutter={[32, 32]}>
            <Col xs={24} md={8}>
              <Card className="h-full" bordered={false}>
                <FaLightbulb className="mb-4 text-4xl text-green-600" />
                <Title level={3}>Innovation</Title>
                <Paragraph>
                  Constantly pushing boundaries to find better solutions
                </Paragraph>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card className="h-full" bordered={false}>
                <FaLeaf className="mb-4 text-4xl text-green-600" />
                <Title level={3}>Sustainability</Title>
                <Paragraph>
                  Making choices that benefit our environment&apos;s future
                </Paragraph>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card className="h-full" bordered={false}>
                <FaUsers className="mb-4 text-4xl text-green-600" />
                <Title level={3}>Community</Title>
                <Paragraph>
                  Building strong relationships with our stakeholders
                </Paragraph>
              </Card>
            </Col>
          </Row>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full px-4 py-16">
        <div className="container mx-auto max-w-6xl text-center">
          <Title level={2} className="mb-6">
            Join Us in Making a Difference
          </Title>
          <Button
            type="primary"
            size="large"
            shape="round"
            className="bg-green-600 hover:bg-green-700"
          >
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
