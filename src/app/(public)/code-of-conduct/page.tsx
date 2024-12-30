"use client";
import React from "react";
import { Typography, Card, Layout, Space, List } from "antd";

const { Title, Paragraph, Text } = Typography;
const { Content } = Layout;

const CodeOfConduct = () => {
  const responsibilities = [
    "Maintain confidentiality of access credentials and system information",
    "Report security vulnerabilities or system malfunctions promptly",
    "Follow established protocols for lighting adjustments and emergency responses",
    "Document all significant system changes and maintenance activities",
    "Participate in required training and stay updated on system updates",
  ];

  const violations = [
    "Temporary suspension of system access",
    "Required additional training",
    "Permanent revocation of access privileges",
    "Legal action in cases of severe violations",
  ];

  const principles = [
    {
      title: "Safety First",
      description:
        "Prioritize public safety in all decisions regarding lighting control and management.",
    },
    {
      title: "Data Responsibility",
      description:
        "Handle all system data with utmost care and in accordance with privacy regulations.",
    },
    {
      title: "Professional Conduct",
      description:
        "Maintain professional behavior when using the platform and interacting with other users.",
    },
    {
      title: "Sustainable Operations",
      description:
        "Promote energy-efficient practices while maintaining essential lighting services.",
    },
  ];

  return (
    <Layout className="min-h-screen bg-gray-50">
      <Content className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <Title level={1}>Zelene Platform Code of Conduct</Title>
            <Paragraph className="text-lg text-gray-600">
              Guidelines for our IoT Smart City Lighting Community
            </Paragraph>
          </div>

          <Space direction="vertical" size="large" className="w-full">
            <Card title="1. Purpose and Scope">
              <Paragraph>
                This Code of Conduct outlines our expectations for all users of
                the Zelene Platform, including but not limited to city
                administrators, traffic management engineers, data analysts, and
                technical staff interacting with our IoT-enabled city lighting
                infrastructure.
              </Paragraph>
            </Card>

            <Card title="2. Core Principles">
              <List
                dataSource={principles}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      title={item.title}
                      description={item.description}
                    />
                  </List.Item>
                )}
              />
            </Card>

            <Card title="3. User Responsibilities">
              <Paragraph strong>All users must:</Paragraph>
              <List
                dataSource={responsibilities}
                renderItem={(item) => (
                  <List.Item>
                    <Text>{item}</Text>
                  </List.Item>
                )}
              />
            </Card>

            <Card title="4. Compliance and Reporting">
              <Paragraph>
                Violations of this Code of Conduct should be reported to the
                system administrators. Reports will be handled confidentially
                and investigated promptly.
              </Paragraph>
              <Paragraph strong className="mt-4">
                Consequences for violations may include:
              </Paragraph>
              <List
                dataSource={violations}
                renderItem={(item) => (
                  <List.Item>
                    <Text>{item}</Text>
                  </List.Item>
                )}
              />
            </Card>

            <Card title="5. Updates and Amendments">
              <Paragraph>
                This Code of Conduct may be updated periodically to reflect new
                requirements or best practices. Users will be notified of
                significant changes and may be required to acknowledge updated
                terms.
              </Paragraph>
            </Card>

            <div className="mt-8 text-center text-sm text-gray-500">
              <Paragraph>Last updated: December 2024</Paragraph>
              <Paragraph>
                For questions or concerns, contact: support@zelene-platform.com
              </Paragraph>
            </div>
          </Space>
        </div>
      </Content>
    </Layout>
  );
};

export default CodeOfConduct;
