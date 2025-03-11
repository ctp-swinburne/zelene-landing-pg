"use client";
import React from "react";
import { Typography, Card, Layout, Steps, Collapse, Space, Divider, Alert } from "antd";
import { 
  BulbOutlined, 
  UserOutlined, 
  AppstoreOutlined, 
  TeamOutlined,
  MessageOutlined,
  HeartOutlined,
  ShoppingOutlined,
  QuestionOutlined,
  FileTextOutlined,
  SearchOutlined,
  BellOutlined,
  EditOutlined
} from "@ant-design/icons";

const { Title, Paragraph, Text } = Typography;
const { Content } = Layout;
const { Step } = Steps;
const { Panel } = Collapse;

const UserGuidePage = () => {
  return (
    <Layout className="min-h-screen bg-gray-50">
      <Content className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <Title level={1}>User Guide</Title>
            <Paragraph className="text-lg text-gray-600">
              Getting started with the Zelene community and product platform
            </Paragraph>
          </div>

          <Card className="mb-12 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-green-50 -mx-5 -mt-5 p-5 mb-8">
              <Title level={3} className="flex items-center gap-2">
                <BulbOutlined className="text-green-500" /> Getting Started
              </Title>
              <Paragraph>
                Welcome to Zelene! This guide will help you navigate our platform, connect with our 
                community, and discover our products.
              </Paragraph>
            </div>

            <Steps 
              direction="vertical" 
              current={-1}
              className="mb-8 px-4"
            >
              <Step 
                title="Account Setup" 
                description="Create your account and personalize your profile"
                icon={<UserOutlined />}
              />
              <Step 
                title="Community Exploration" 
                description="Discover posts, connect with others, and join discussions"
                icon={<TeamOutlined />}
              />
              <Step 
                title="Product Browsing" 
                description="Explore our product offerings and features"
                icon={<ShoppingOutlined />}
              />
              <Step 
                title="Participation" 
                description="Contribute to discussions and share your experiences"
                icon={<MessageOutlined />}
              />
              <Step 
                title="Staying Updated" 
                description="Get notifications about new content and products"
                icon={<BellOutlined />}
              />
            </Steps>

            <Alert
              message="Need Help?"
              description="If you need additional assistance, please contact our support team or visit the Help Center."
              type="info"
              showIcon
              className="mb-4"
            />
          </Card>

          <Title level={2} className="mb-6">
            <AppstoreOutlined className="mr-2 text-blue-500" />
            Platform Features
          </Title>

          <Collapse defaultActiveKey={['1']} className="mb-12">
            <Panel 
              header={
                <Text strong className="text-lg flex items-center">
                  <UserOutlined className="mr-2 text-blue-500" /> Account & Profile
                </Text>
              } 
              key="1"
            >
              <Space direction="vertical" className="w-full">
                <Paragraph>
                  Your profile is your identity within our community:
                </Paragraph>
                <ul className="list-disc ml-6 space-y-2">
                  <li>Upload a profile picture and add a bio to introduce yourself</li>
                  <li>Customize your display name and username</li>
                  <li>Add social media links to help others connect with you</li>
                  <li>Set privacy preferences to control what information is shared</li>
                </ul>
                <Paragraph>
                  To edit your profile, click on your avatar in the top right corner and select &quot;Settings&quot; 
                  or visit the profile settings page directly.
                </Paragraph>
              </Space>
            </Panel>

            <Panel 
              header={
                <Text strong className="text-lg flex items-center">
                  <TeamOutlined className="mr-2 text-green-500" /> Community Features
                </Text>
              } 
              key="2"
            >
              <Space direction="vertical" className="w-full">
                <Paragraph>
                  Engage with our vibrant community through:
                </Paragraph>
                <ul className="list-disc ml-6 space-y-2">
                  <li>Posts - Browse articles from official sources and community members</li>
                  <li>Comments - Share your thoughts on posts and respond to others</li>
                  <li>Likes - Show appreciation for content you enjoy</li>
                  <li>Tags - Follow topics that interest you</li>
                  <li>Discussions - Participate in conversations about products and topics</li>
                </ul>
                <Paragraph>
                  Our community thrives on respectful interaction. Please review our 
                  <a href="/code-of-conduct"> Code of Conduct</a> for guidelines on positive engagement.
                </Paragraph>
              </Space>
            </Panel>

            <Panel 
              header={
                <Text strong className="text-lg flex items-center">
                  <ShoppingOutlined className="mr-2 text-purple-500" /> Products & Solutions
                </Text>
              } 
              key="3"
            >
              <Space direction="vertical" className="w-full">
                <Paragraph>
                  Discover our innovative products and solutions:
                </Paragraph>
                <ul className="list-disc ml-6 space-y-2">
                  <li>Product catalog - Browse our complete range of offerings</li>
                  <li>Product pages - View detailed information, specifications, and features</li>
                  <li>Case studies - Learn how others have implemented our solutions</li>
                  <li>Request information - Contact us for detailed product information</li>
                  <li>Demo requests - Schedule demonstrations of our products</li>
                </ul>
                <Paragraph>
                  For specific product inquiries, you can use the &quot;Contact&quot; form to reach our product specialists.
                </Paragraph>
              </Space>
            </Panel>

            <Panel 
              header={
                <Text strong className="text-lg flex items-center">
                  <EditOutlined className="mr-2 text-orange-500" /> Creating Content
                </Text>
              } 
              key="4"
            >
              <Space direction="vertical" className="w-full">
                <Paragraph>
                  Share your expertise and experiences with the community:
                </Paragraph>
                <ul className="list-disc ml-6 space-y-2">
                  <li>Create posts - Share insights, experiences, and knowledge</li>
                  <li>Use formatting - Enhance your posts with Markdown formatting</li>
                  <li>Add tags - Help others discover your content by adding relevant tags</li>
                  <li>Draft feature - Save posts as drafts before publishing</li>
                  <li>Edit content - Update your published content as needed</li>
                </ul>
                <Paragraph>
                  To create a new post, click the &quot;Create Post&quot; button in the navigation bar or on your profile page.
                </Paragraph>
              </Space>
            </Panel>
          </Collapse>

          <Title level={2} className="mb-6">
            <HeartOutlined className="mr-2 text-red-500" />
            Tips for a Great Experience
          </Title>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <Card title={
              <span className="flex items-center gap-2">
                <SearchOutlined className="text-blue-500" /> Discover Content
              </span>
            }>
              <Paragraph>
                Use the search function and tags to find content that interests you. Follow topics and 
                active community members to see their contributions in your feed.
              </Paragraph>
              <Paragraph>
                Filter content by tags, popularity, or recency to find exactly what you&apos;re looking for.
              </Paragraph>
            </Card>

            <Card title={
              <span className="flex items-center gap-2">
                <BellOutlined className="text-orange-500" /> Stay Updated
              </span>
            }>
              <Paragraph>
                Configure your notification settings to receive alerts about new posts, comments on your content, 
                or updates to topics you follow.
              </Paragraph>
              <Paragraph>
                Subscribe to our newsletter for product announcements and community highlights.
              </Paragraph>
            </Card>

            <Card title={
              <span className="flex items-center gap-2">
                <TeamOutlined className="text-green-500" /> Build Connections
              </span>
            }>
              <Paragraph>
                Engage regularly by commenting on posts, participating in discussions, and sharing your 
                own experiences with products.
              </Paragraph>
              <Paragraph>
                Respond to comments on your posts to foster meaningful conversations.
              </Paragraph>
            </Card>

            <Card title={
              <span className="flex items-center gap-2">
                <FileTextOutlined className="text-purple-500" /> Quality Content
              </span>
            }>
              <Paragraph>
                When creating posts, include clear headings, concise descriptions, and relevant examples to 
                make your content valuable to others.
              </Paragraph>
              <Paragraph>
                Add appropriate tags to help your content reach interested community members.
              </Paragraph>
            </Card>
          </div>

          <Title level={2} className="mb-6">
            <QuestionOutlined className="mr-2 text-blue-500" />
            Frequently Asked Questions
          </Title>

          <Collapse className="mb-12">
            <Panel header="How do I update my profile information?" key="1">
              <Paragraph>
                Click on your avatar in the top right corner, select &quot;Settings,&quot; and navigate to the &quot;Profile&quot; tab. 
                Here you can update your personal information, bio, and profile picture.
              </Paragraph>
            </Panel>
            
            <Panel header="How do I create a post?" key="2">
              <Paragraph>
                Click the &quot;Create Post&quot; button in the navigation bar or on your profile page. You&apos;ll be taken to the 
                post editor where you can add a title, content, and tags before publishing.
              </Paragraph>
            </Panel>
            
            <Panel header="How do I follow specific topics?" key="3">
              <Paragraph>
                You can follow topics by clicking on tags that interest you and selecting &quot;Follow.&quot; You&apos;ll then 
                see content with these tags in your personalized feed.
              </Paragraph>
            </Panel>
            
            <Panel header="How do I contact support?" key="4">
              <Paragraph>
                For technical issues or questions, click on the &quot;Help&quot; link in the footer or navigate to the 
                &quot;Contact&quot; page to submit a support request.
              </Paragraph>
            </Panel>
            
            <Panel header="How do I request more information about products?" key="5">
              <Paragraph>
                On any product page, you&apos;ll find a &quot;Request Information&quot; button. Fill out the form, and our 
                team will contact you with detailed information about the product.
              </Paragraph>
            </Panel>
          </Collapse>

          <Divider />

          <div className="flex flex-col md:flex-row justify-between items-center bg-gray-100 p-6 rounded-lg">
            <div>
              <Title level={4}>Need Additional Assistance?</Title>
              <Paragraph className="mb-0">
                Our support team is available to help you get the most out of Zelene.
              </Paragraph>
            </div>
            <div className="mt-4 md:mt-0">
              <Space>
                <a href="/contact" className="ant-btn ant-btn-primary">Contact Support</a>
                <a href="/help" className="ant-btn">Help Center</a>
              </Space>
            </div>
          </div>
        </div>
      </Content>
    </Layout>
  );
};

export default UserGuidePage;