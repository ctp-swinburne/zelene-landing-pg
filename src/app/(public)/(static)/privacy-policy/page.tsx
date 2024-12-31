"use client";
import React from "react";
import { Typography, Card, Layout, Space, List, Alert } from "antd";

const { Title, Paragraph, Text } = Typography;
const { Content } = Layout;

const PrivacyPolicy = () => {
  const dataCollected = [
    {
      title: "Device Data",
      items: [
        "Device identifiers and metadata",
        "Light intensity readings",
        "Power consumption metrics",
        "Operating status and health indicators",
        "Firmware versions and updates",
      ],
    },
    {
      title: "User Data",
      items: [
        "Login credentials and authentication data",
        "User activity logs and timestamps",
        "Access control permissions",
        "User preferences and settings",
      ],
    },
    {
      title: "System Data",
      items: [
        "Performance metrics and analytics",
        "Error logs and diagnostic information",
        "Network connectivity status",
        "System configuration data",
      ],
    },
  ];

  return (
    <Layout className="min-h-screen bg-gray-50">
      <Content className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <Title level={1}>Privacy Policy</Title>
            <Paragraph className="text-lg text-gray-600">
              Zelene Platform - Protecting Your Data in Smart City Lighting
            </Paragraph>
            <Text type="secondary">Effective Date: December 30, 2024</Text>
          </div>

          <Alert
            message="Important Notice"
            description="This privacy policy outlines how we collect, use, and protect data in the Zelene Platform. It applies to all users including city administrators, engineers, and data analysts."
            type="info"
            showIcon
            className="mb-8"
          />

          <Space direction="vertical" size="large" className="w-full">
            <Card title="1. Introduction">
              <Paragraph>
                The Zelene Platform (&quot;Platform&quot;) is committed to
                protecting the privacy and security of your data. This policy
                explains our practices concerning data collection, processing,
                and protection in accordance with applicable data protection
                laws and Viettel&apos;s standards.
              </Paragraph>
            </Card>

            <Card title="2. Data Collection">
              <Space direction="vertical">
                {dataCollected.map((category, index) => (
                  <div key={index} className="mb-4">
                    <Title level={5}>{category.title}</Title>
                    <List
                      size="small"
                      dataSource={category.items}
                      renderItem={(item) => (
                        <List.Item>
                          <Text>{item}</Text>
                        </List.Item>
                      )}
                    />
                  </div>
                ))}
              </Space>
            </Card>

            <Card title="3. Data Processing and Usage">
              <Space direction="vertical">
                <Paragraph>
                  <Text strong>3.1 Purpose of Processing: </Text>
                  We process collected data for:
                </Paragraph>
                <List
                  size="small"
                  dataSource={[
                    "Optimizing city lighting operations",
                    "Monitoring system performance and health",
                    "Analyzing energy consumption patterns",
                    "Maintaining system security",
                    "Generating usage reports and analytics",
                    "Emergency response management",
                  ]}
                  renderItem={(item) => (
                    <List.Item>
                      <Text>{item}</Text>
                    </List.Item>
                  )}
                />
              </Space>
            </Card>

            <Card title="4. Data Storage and Security">
              <Space direction="vertical">
                <Paragraph>
                  <Text strong>4.1 Storage Location: </Text>
                  All data is stored in secure AWS cloud infrastructure within
                  Vietnam.
                </Paragraph>

                <Paragraph>
                  <Text strong>4.2 Security Measures: </Text>
                </Paragraph>
                <List
                  size="small"
                  dataSource={[
                    "End-to-end encryption for data in transit",
                    "AES-256 encryption for stored data",
                    "Regular security audits and penetration testing",
                    "Access control and authentication mechanisms",
                    "Automated threat detection and prevention",
                  ]}
                  renderItem={(item) => (
                    <List.Item>
                      <Text>{item}</Text>
                    </List.Item>
                  )}
                />
              </Space>
            </Card>

            <Card title="5. Data Retention">
              <Space direction="vertical">
                <Paragraph>
                  We retain different types of data for varying periods:
                </Paragraph>
                <List
                  size="small"
                  dataSource={[
                    "Device telemetry data: 90 days",
                    "User activity logs: 12 months",
                    "System performance data: 6 months",
                    "Security incident logs: 24 months",
                  ]}
                  renderItem={(item) => (
                    <List.Item>
                      <Text>{item}</Text>
                    </List.Item>
                  )}
                />
              </Space>
            </Card>

            <Card title="6. Data Access and Control">
              <Paragraph>
                <Text strong>6.1 Access Rights: </Text>
                Authorized users have the right to:
              </Paragraph>
              <List
                size="small"
                dataSource={[
                  "Access their personal data",
                  "Request data corrections",
                  "Export their data in standard formats",
                  "Request data deletion (subject to retention requirements)",
                ]}
                renderItem={(item) => (
                  <List.Item>
                    <Text>{item}</Text>
                  </List.Item>
                )}
              />
            </Card>

            <Card title="7. Third-Party Sharing">
              <Paragraph>
                We share data only with authorized third parties:
              </Paragraph>
              <List
                size="small"
                dataSource={[
                  "Cloud service providers (AWS)",
                  "Authorized maintenance contractors",
                  "Government agencies (when legally required)",
                  "Emergency services (during incidents)",
                ]}
                renderItem={(item) => (
                  <List.Item>
                    <Text>{item}</Text>
                  </List.Item>
                )}
              />
            </Card>

            <Card title="8. Updates to Privacy Policy">
              <Paragraph>
                This privacy policy may be updated periodically. Users will be
                notified of significant changes through the Platform and via
                email. Continued use of the Platform after such changes
                constitutes acceptance of the updated policy.
              </Paragraph>
            </Card>

            <div className="mt-8 text-center text-sm text-gray-500">
              <Paragraph>
                For privacy-related inquiries, contact:
                privacy@zelene-platform.com
              </Paragraph>
              <Paragraph>Data Protection Officer: Truong Duc Sang</Paragraph>
              <Paragraph>
                Zelene Platform, Viettel 5G & IoT Innovation Lab
              </Paragraph>
            </div>
          </Space>
        </div>
      </Content>
    </Layout>
  );
};

export default PrivacyPolicy;
