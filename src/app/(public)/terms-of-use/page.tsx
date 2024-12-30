"use client";
import React from "react";
import { Typography, Card, Layout, Space, Divider } from "antd";

const { Title, Paragraph, Text } = Typography;
const { Content } = Layout;

const TermsOfUse = () => {
  return (
    <Layout className="min-h-screen bg-gray-50">
      <Content className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <Title level={1}>Terms of Use</Title>
            <Paragraph className="text-lg text-gray-600">
              Zelene Platform - Smart City Lighting Control System
            </Paragraph>
            <Text type="secondary">Last Updated: December 30, 2024</Text>
          </div>

          <Space direction="vertical" size="large" className="w-full">
            <Card title="1. Acceptance of Terms">
              <Paragraph>
                By accessing or using the Zelene Platform
                (&quot;Platform&quot;), you agree to be bound by these Terms of
                Use (&quot;Terms&quot;). The Platform is operated by Zelene
                (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) in
                collaboration with Viettel 5G & IoT Innovation lab. If you do
                not agree to these Terms, do not use the Platform.
              </Paragraph>
            </Card>

            <Card title="2. Platform Access and Security">
              <Space direction="vertical">
                <Paragraph>
                  <Text strong>2.1 Authorized Users: </Text>
                  Access to the Platform is restricted to authorized personnel
                  including traffic management engineers, city data analysts,
                  and approved administrators. Each user must have valid
                  credentials issued by the system administrator.
                </Paragraph>

                <Paragraph>
                  <Text strong>2.2 Security Responsibilities: </Text>
                  Users must:
                </Paragraph>
                <ul className="list-disc pl-8">
                  <li>
                    Maintain the confidentiality of their login credentials
                  </li>
                  <li>
                    Use secure, organization-approved devices to access the
                    Platform
                  </li>
                  <li>Log out after each session</li>
                  <li>Report any suspected security breaches immediately</li>
                </ul>
              </Space>
            </Card>

            <Card title="3. Acceptable Use">
              <Space direction="vertical">
                <Paragraph>
                  <Text strong>3.1 Permitted Use: </Text>
                  The Platform may only be used for:
                </Paragraph>
                <ul className="list-disc pl-8">
                  <li>Managing and monitoring city lighting infrastructure</li>
                  <li>Analyzing energy consumption data</li>
                  <li>Implementing authorized lighting strategies</li>
                  <li>Emergency response management</li>
                </ul>

                <Paragraph>
                  <Text strong>3.2 Prohibited Activities: </Text>
                  Users must not:
                </Paragraph>
                <ul className="list-disc pl-8">
                  <li>
                    Share access credentials with unauthorized individuals
                  </li>
                  <li>Attempt to bypass security measures</li>
                  <li>Use the Platform for any unauthorized purpose</li>
                  <li>Interfere with the Platform&apos;s normal operation</li>
                </ul>
              </Space>
            </Card>

            <Card title="4. Data Usage and Privacy">
              <Space direction="vertical">
                <Paragraph>
                  <Text strong>4.1 Data Collection: </Text>
                  The Platform collects and processes:
                </Paragraph>
                <ul className="list-disc pl-8">
                  <li>Device telemetry data</li>
                  <li>Energy consumption metrics</li>
                  <li>User activity logs</li>
                  <li>System performance data</li>
                </ul>

                <Paragraph>
                  <Text strong>4.2 Data Retention: </Text>
                  Data is retained according to Viettel&apos;s standards, with
                  operational data kept for 90 days and essential records
                  maintained for up to 12 months.
                </Paragraph>
              </Space>
            </Card>

            <Card title="5. Intellectual Property">
              <Paragraph>
                All intellectual property rights in the Platform, including
                software, designs, and documentation, are owned by Zelene and
                its licensors. Users are granted a limited license to use the
                Platform for its intended purpose only.
              </Paragraph>
            </Card>

            <Card title="6. Liability and Disclaimers">
              <Space direction="vertical">
                <Paragraph>
                  <Text strong>6.1 Service Availability: </Text>
                  While we strive for 99.9% uptime, we do not guarantee
                  uninterrupted access to the Platform. Scheduled maintenance
                  will be communicated in advance.
                </Paragraph>

                <Paragraph>
                  <Text strong>6.2 Limitation of Liability: </Text>
                  We shall not be liable for any indirect, incidental, special,
                  consequential, or punitive damages resulting from your use of
                  or inability to use the Platform.
                </Paragraph>
              </Space>
            </Card>

            <Card title="7. Modifications to Terms">
              <Paragraph>
                We reserve the right to modify these Terms at any time. Users
                will be notified of significant changes and continued use of the
                Platform constitutes acceptance of modified Terms.
              </Paragraph>
            </Card>

            <Card title="8. Governing Law">
              <Paragraph>
                These Terms are governed by the laws of Vietnam. Any disputes
                shall be subject to the exclusive jurisdiction of the courts in
                Ho Chi Minh City.
              </Paragraph>
            </Card>

            <div className="mt-8 text-center text-sm text-gray-500">
              <Paragraph>
                For questions about these Terms, contact:
                legal@zelene-platform.com
              </Paragraph>
              <Paragraph>
                Zelene Platform - A product of Viettel 5G & IoT Innovation Lab
              </Paragraph>
            </div>
          </Space>
        </div>
      </Content>
    </Layout>
  );
};

export default TermsOfUse;
