"use client";
import React from "react";
import { Typography, Card, Layout, Space, Collapse, Alert, Divider, Steps, List } from "antd";
import { 
  SafetyOutlined, 
  LockOutlined, 
  AuditOutlined, 
  KeyOutlined,
  FileProtectOutlined,
  UserSwitchOutlined,
  EyeInvisibleOutlined,
  AlertOutlined,
  CloudOutlined,
  SafetyCertificateOutlined,
  TeamOutlined,
  MailOutlined,
  SecurityScanOutlined
} from "@ant-design/icons";

const { Title, Paragraph, Text } = Typography;
const { Content } = Layout;
const { Panel } = Collapse;
const { Step } = Steps;

// Security practices
const securityPractices = [
  {
    title: 'Secure User Accounts',
    description: 'We implement robust password policies and offer secure account recovery options to protect your account.',
    icon: <LockOutlined className="text-blue-500 text-2xl" />,
  },
  {
    title: 'Data Privacy',
    description: 'We only collect essential information and provide clear controls over how your data is used and shared.',
    icon: <EyeInvisibleOutlined className="text-purple-500 text-2xl" />,
  },
  {
    title: 'Content Moderation',
    description: 'Our community content is moderated to ensure a safe, respectful environment for all users.',
    icon: <SafetyCertificateOutlined className="text-orange-500 text-2xl" />,
  },
  {
    title: 'Secure Communications',
    description: 'All communications between your browser and our servers are encrypted using industry-standard protocols.',
    icon: <MailOutlined className="text-green-500 text-2xl" />,
  },
  {
    title: 'Regular Security Updates',
    description: 'We regularly update our systems to address emerging security threats and vulnerabilities.',
    icon: <AlertOutlined className="text-red-500 text-2xl" />,
  },
  {
    title: 'Reliable Hosting',
    description: 'Our website is hosted on secure, reliable infrastructure with regular backups and monitoring.',
    icon: <CloudOutlined className="text-blue-500 text-2xl" />,
  },
];

const SecurityPage = () => {
  return (
    <Layout className="min-h-screen bg-gray-50">
      <Content className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <Title level={1}>
              <SafetyOutlined className="mr-2 text-green-600" />
              Security & Privacy
            </Title>
            <Paragraph className="text-lg text-gray-600">
              How we protect your data and keep our community safe
            </Paragraph>
          </div>

          {/* Security Overview Section */}
          <Card className="mb-12 shadow overflow-hidden">
            <div className="bg-gradient-to-r from-green-50 to-blue-50 -mx-5 -mt-5 p-5 mb-8">
              <Title level={3}>Our Commitment to Security</Title>
              <Paragraph className="text-lg">
                At Zelene, we take the security and privacy of our community members seriously. 
                We implement various measures to ensure your information remains safe while you 
                connect with others and explore our products.
              </Paragraph>
            </div>
            
            <Alert
              message="Your Security Matters"
              description="We continuously work to maintain a secure platform where you can engage with confidence."
              type="success"
              showIcon
              icon={<SafetyCertificateOutlined />}
              className="mb-8"
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {securityPractices.slice(0, 3).map((practice, index) => (
                <Card key={index} className="h-full">
                  <div className="flex flex-col items-center text-center">
                    {practice.icon}
                    <Text strong className="mt-3 mb-2 text-lg">{practice.title}</Text>
                    <Paragraph type="secondary">{practice.description}</Paragraph>
                  </div>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {securityPractices.slice(3).map((practice, index) => (
                <Card key={index} className="h-full">
                  <div className="flex flex-col items-center text-center">
                    {practice.icon}
                    <Text strong className="mt-3 mb-2 text-lg">{practice.title}</Text>
                    <Paragraph type="secondary">{practice.description}</Paragraph>
                  </div>
                </Card>
              ))}
            </div>
          </Card>

          {/* Security Measures */}
          <Card 
            title={
              <Space>
                <SecurityScanOutlined className="text-blue-500" /> 
                <span>How We Protect You</span>
              </Space>
            }
            className="mb-12 shadow"
          >
            <Steps 
              direction="vertical" 
              current={-1}
              className="mb-8"
            >
              <Step 
                title="Secure Account Access" 
                description="We implement strong password requirements and secure authentication methods."
                icon={<UserSwitchOutlined />}
              />
              <Step 
                title="Data Protection" 
                description="Your personal information is encrypted and securely stored according to industry standards."
                icon={<FileProtectOutlined />}
              />
              <Step 
                title="Community Guidelines" 
                description="Clear policies and active moderation to maintain a positive community environment."
                icon={<TeamOutlined />}
              />
              <Step 
                title="Transparent Practices" 
                description="We&apos;re open about how we use your data and provide options to control your privacy."
                icon={<AuditOutlined />}
              />
              <Step 
                title="Regular Security Reviews" 
                description="We conduct regular reviews of our security practices to address emerging threats."
                icon={<SafetyOutlined />}
              />
            </Steps>
          </Card>

          {/* Privacy Controls */}
          <Card 
            title={
              <Space>
                <KeyOutlined className="text-green-500" /> 
                <span>Your Privacy Controls</span>
              </Space>
            }
            className="mb-12 shadow"
          >
            <Paragraph>
              We believe you should have control over your information and how it&apos;s used:
            </Paragraph>
            
            <List
              itemLayout="horizontal"
              className="mt-4"
              dataSource={[
                {
                  title: "Profile Privacy",
                  description: "Control what information is visible to other community members."
                },
                {
                  title: "Communication Preferences",
                  description: "Choose how and when you receive notifications and updates from us."
                },
                {
                  title: "Data Access",
                  description: "Request a copy of your data or ask for information about how it's used."
                },
                {
                  title: "Account Management",
                  description: "Update or delete your account information at any time."
                }
              ]}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    title={<Text strong>{item.title}</Text>}
                    description={<Text type="secondary">{item.description}</Text>}
                  />
                </List.Item>
              )}
            />
            
            <Alert
              message="Managing Your Privacy"
              description="You can adjust your privacy settings at any time through your account settings page."
              type="info"
              showIcon
              className="mt-6"
            />
          </Card>

          {/* Reporting Security Issues */}
          <Card 
            title={
              <Space>
                <AlertOutlined className="text-red-500" /> 
                <span>Reporting Security Issues</span>
              </Space>
            }
            className="mb-8 shadow"
          >
            <Paragraph>
              We appreciate the community&apos;s help in keeping Zelene secure. If you discover a potential 
              security issue or vulnerability, please let us know immediately.
            </Paragraph>
            
            <Collapse className="mt-4">
              <Panel header="How to Report a Security Concern" key="1">
                <Space direction="vertical" className="w-full">
                  <Paragraph>
                    If you believe you&apos;ve found a security vulnerability or have concerns about 
                    your account security, please contact us immediately at:
                  </Paragraph>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <Text strong>Email: </Text>
                    <Text copyable>security@zelene-platform.com</Text>
                  </div>
                  <Paragraph>
                    Please include as much detail as possible about the potential issue. Our security 
                    team will investigate promptly and work to address any valid concerns.
                  </Paragraph>
                </Space>
              </Panel>
            </Collapse>
          </Card>
          
          <Divider />
          
          <div className="text-center">
            <Paragraph type="secondary">
              Have questions about our security practices? Please contact us at{" "}
              <a href="mailto:info@zelene-platform.com">info@zelene-platform.com</a>
            </Paragraph>
          </div>
        </div>
      </Content>
    </Layout>
  );
};

export default SecurityPage;