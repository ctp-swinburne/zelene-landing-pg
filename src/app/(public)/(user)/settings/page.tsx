"use client";

import { useState } from "react";
import {
  Card,
  Typography,
  Form,
  Input,
  Button,
  Tabs,
  Switch,
  message,
  Row,
  Col,
} from "antd";
import {
  EditOutlined,
  UserOutlined,
  LinkOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import type { RouterOutputs } from "~/trpc/react";

const { Title } = Typography;
const { TabPane } = Tabs;

// You would use these in a real implementation
// import { api } from "~/trpc/react";
// import { type UpdateProfileInput } from "~/schema/profile";

type SettingsFormData = RouterOutputs["profile"]["getCurrentProfile"];

// Basic Info Form Component
function BasicInfoForm({ initialData }: { initialData?: SettingsFormData }) {
  return (
    <Form layout="vertical" initialValues={initialData}>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="Name"
            name={["user", "name"]}
            rules={[{ required: true, message: "Please input your name!" }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Your name" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Username"
            name={["user", "username"]}
            rules={[
              { required: true, message: "Please input your username!" },
              { min: 3, message: "Username must be at least 3 characters" },
              { max: 20, message: "Username must be at most 20 characters" },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="Username" />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item
        label="Email"
        name={["user", "email"]}
        rules={[
          { required: true, message: "Please input your email!" },
          { type: "email", message: "Please enter a valid email!" },
        ]}
      >
        <Input prefix={<UserOutlined />} placeholder="Email" type="email" />
      </Form.Item>
    </Form>
  );
}

// Profile Form Component
function ProfileForm({ initialData }: { initialData?: SettingsFormData }) {
  return (
    <Form layout="vertical" initialValues={initialData?.profile ?? undefined}>
      <Form.Item
        label="Bio"
        name={["bio"]}
        rules={[{ max: 500, message: "Bio must be at most 500 characters" }]}
      >
        <Input.TextArea
          placeholder="Tell us about yourself"
          autoSize={{ minRows: 3, maxRows: 6 }}
        />
      </Form.Item>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="Location"
            name={["location"]}
            rules={[
              { max: 100, message: "Location must be at most 100 characters" },
            ]}
          >
            <Input placeholder="Your location" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Work"
            name={["work"]}
            rules={[
              { max: 200, message: "Work must be at most 200 characters" },
            ]}
          >
            <Input placeholder="Your current work" />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="Education"
            name={["education"]}
            rules={[
              { max: 200, message: "Education must be at most 200 characters" },
            ]}
          >
            <Input placeholder="Your education" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Skills"
            name={["skills"]}
            rules={[
              { max: 200, message: "Skills must be at most 200 characters" },
            ]}
          >
            <Input placeholder="Your skills (comma separated)" />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="Current Project"
            name={["currentProject"]}
            rules={[
              {
                max: 200,
                message: "Project description must be at most 200 characters",
              },
            ]}
          >
            <Input placeholder="What are you working on?" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Currently Learning"
            name={["currentLearning"]}
            rules={[
              {
                max: 200,
                message: "Learning description must be at most 200 characters",
              },
            ]}
          >
            <Input placeholder="What are you learning?" />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item
        label="Available For"
        name={["availableFor"]}
        rules={[
          { max: 200, message: "Available for must be at most 200 characters" },
        ]}
      >
        <Input placeholder="What opportunities are you open to?" />
      </Form.Item>
      <Form.Item
        label="Show Pronouns"
        name={["pronouns"]}
        valuePropName="checked"
      >
        <Switch />
      </Form.Item>
    </Form>
  );
}

// Social Links Form Component
function SocialLinksForm({ initialData }: { initialData?: SettingsFormData }) {
  return (
    <Form layout="vertical" initialValues={initialData?.social ?? undefined}>
      {[
        { name: "website", label: "Website" },
        { name: "twitter", label: "Twitter" },
        { name: "github", label: "GitHub" },
        { name: "linkedin", label: "LinkedIn" },
        { name: "facebook", label: "Facebook" },
      ].map((link) => (
        <Form.Item
          key={link.name}
          label={link.label}
          name={[link.name]}
          rules={[{ type: "url", message: "Please enter a valid URL!" }]}
        >
          <Input
            prefix={<LinkOutlined />}
            placeholder={`Your ${link.label} URL`}
          />
        </Form.Item>
      ))}
    </Form>
  );
}

// Main Settings Page Component
export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("1");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    message.success("Settings updated successfully!");
    setLoading(false);
  };

  return (
    <div className="container mx-auto p-6">
      <Card>
        <Title level={2} className="mb-6">
          <EditOutlined className="mr-2" />
          Profile Settings
        </Title>

        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane
            tab={
              <span>
                <UserOutlined />
                Basic Info
              </span>
            }
            key="1"
          >
            <BasicInfoForm />
          </TabPane>

          <TabPane
            tab={
              <span>
                <InfoCircleOutlined />
                Profile Details
              </span>
            }
            key="2"
          >
            <ProfileForm />
          </TabPane>

          <TabPane
            tab={
              <span>
                <LinkOutlined />
                Social Links
              </span>
            }
            key="3"
          >
            <SocialLinksForm />
          </TabPane>
        </Tabs>

        <div className="mt-6 flex justify-end">
          <Button type="primary" loading={loading} onClick={handleSubmit}>
            Save Changes
          </Button>
        </div>
      </Card>
    </div>
  );
}
