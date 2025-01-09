"use client";

import { useEffect } from "react";
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
  Space,
} from "antd";
import {
  EditOutlined,
  UserOutlined,
  LinkOutlined,
  InfoCircleOutlined,
  EnvironmentOutlined,
  BankOutlined,
  BookOutlined,
  ToolOutlined,
  ProjectOutlined,
  ReadOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { api } from "~/trpc/react";
import type { RouterOutputs } from "~/trpc/react";
import { useSettingsStore, prepareUpdateData } from "~/store/settings";

const { Title } = Typography;
const { TabPane } = Tabs;

function BasicInfoForm() {
  const { userInfo, updateUserInfo } = useSettingsStore();

  return (
    <div className="max-w-3xl">
      <Row gutter={[24, 24]}>
        <Col xs={24} md={12}>
          <Form.Item
            label="Name"
            required
            tooltip="Your display name"
            className="mb-0"
          >
            <Input
              size="large"
              prefix={<UserOutlined className="text-gray-400" />}
              placeholder="Your name"
              value={userInfo.name || ""}
              onChange={(e) => updateUserInfo("name", e.target.value)}
            />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            label="Username"
            required
            tooltip="Your unique username"
            className="mb-0"
          >
            <Input
              size="large"
              prefix={<UserOutlined className="text-gray-400" />}
              placeholder="Username"
              value={userInfo.username || ""}
              onChange={(e) => updateUserInfo("username", e.target.value)}
            />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item label="Email" className="mb-0">
            <Input
              size="large"
              prefix={<UserOutlined className="text-gray-400" />}
              placeholder="Email"
              type="email"
              value={userInfo.email || ""}
              onChange={(e) => updateUserInfo("email", e.target.value)}
            />
          </Form.Item>
        </Col>
      </Row>
    </div>
  );
}

function ProfileForm() {
  const { profileInfo, updateProfileInfo } = useSettingsStore();

  return (
    <div className="max-w-4xl">
      <Form layout="vertical" className="w-full">
        <Form.Item label="Bio:" className="mb-6">
          <Input.TextArea
            size="large"
            placeholder="Tell us about yourself"
            autoSize={{ minRows: 3, maxRows: 6 }}
            value={profileInfo.bio || ""}
            onChange={(e) => updateProfileInfo("bio", e.target.value)}
          />
        </Form.Item>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Form.Item label="Location:" className="mb-0">
            <Input
              size="large"
              prefix={<EnvironmentOutlined className="text-gray-400" />}
              placeholder="Your location"
              value={profileInfo.location || ""}
              onChange={(e) => updateProfileInfo("location", e.target.value)}
            />
          </Form.Item>

          <Form.Item label="Work:" className="mb-0">
            <Input
              size="large"
              prefix={<BankOutlined className="text-gray-400" />}
              placeholder="Your current work"
              value={profileInfo.work || ""}
              onChange={(e) => updateProfileInfo("work", e.target.value)}
            />
          </Form.Item>

          <Form.Item label="Education:" className="mb-0">
            <Input
              size="large"
              prefix={<BookOutlined className="text-gray-400" />}
              placeholder="Your education"
              value={profileInfo.education || ""}
              onChange={(e) => updateProfileInfo("education", e.target.value)}
            />
          </Form.Item>

          <Form.Item label="Skills:" className="mb-0">
            <Input
              size="large"
              prefix={<ToolOutlined className="text-gray-400" />}
              placeholder="Your skills"
              value={profileInfo.skills || ""}
              onChange={(e) => updateProfileInfo("skills", e.target.value)}
            />
          </Form.Item>

          <Form.Item label="Current Project:" className="mb-0">
            <Input
              size="large"
              prefix={<ProjectOutlined className="text-gray-400" />}
              placeholder="What are you working on?"
              value={profileInfo.currentProject || ""}
              onChange={(e) =>
                updateProfileInfo("currentProject", e.target.value)
              }
            />
          </Form.Item>

          <Form.Item label="Currently Learning:" className="mb-0">
            <Input
              size="large"
              prefix={<ReadOutlined className="text-gray-400" />}
              placeholder="What are you learning?"
              value={profileInfo.currentLearning || ""}
              onChange={(e) =>
                updateProfileInfo("currentLearning", e.target.value)
              }
            />
          </Form.Item>
        </div>

        <Form.Item label="Available For:" className="mb-6 mt-6">
          <Input
            size="large"
            prefix={<CalendarOutlined className="text-gray-400" />}
            placeholder="What opportunities are you open to?"
            value={profileInfo.availableFor || ""}
            onChange={(e) => updateProfileInfo("availableFor", e.target.value)}
          />
        </Form.Item>

        <Form.Item label="Show Pronouns:" className="mb-0">
          <Switch
            checked={profileInfo.pronouns || false}
            onChange={(checked) => updateProfileInfo("pronouns", checked)}
          />
        </Form.Item>
      </Form>
    </div>
  );
}

function SocialLinksForm() {
  const { socialInfo, updateSocialInfo } = useSettingsStore();

  const socialLinks = [
    { key: "website" as const, label: "Website:", value: socialInfo.website },
    { key: "twitter" as const, label: "Twitter:", value: socialInfo.twitter },
    { key: "github" as const, label: "GitHub:", value: socialInfo.github },
    {
      key: "linkedin" as const,
      label: "LinkedIn:",
      value: socialInfo.linkedin,
    },
    {
      key: "facebook" as const,
      label: "Facebook:",
      value: socialInfo.facebook,
    },
  ] as const;

  return (
    <div className="max-w-4xl">
      <Form layout="vertical">
        <div className="grid grid-cols-1 gap-6">
          {socialLinks.map(({ key, label, value }) => (
            <Form.Item key={key} label={label} className="mb-0">
              <Input
                size="large"
                prefix={<LinkOutlined className="text-gray-400" />}
                placeholder={`Your ${label.replace(":", "")} URL`}
                value={value || ""}
                onChange={(e) => updateSocialInfo(key, e.target.value)}
              />
            </Form.Item>
          ))}
        </div>
      </Form>
    </div>
  );
}

export default function SettingsPage() {
  const {
    ui: { activeTab, isLoading, isDirty },
    setActiveTab,
    setIsLoading,
    initializeFromProfile,
    reset,
  } = useSettingsStore();

  const [messageApi, contextHolder] = message.useMessage();

  const query = api.profile.getCurrentProfile.useQuery(undefined, {
    retry: 1,
    retryDelay: 1000,
  });

  const { data: profileData, isLoading: isLoadingProfile } = query;

  // Handle success
  useEffect(() => {
    if (profileData) {
      initializeFromProfile(profileData);
    }
  }, [profileData]);

  // Handle error
  useEffect(() => {
    if (query.error) {
      messageApi.error(query.error.message);
    }
  }, [query.error, messageApi]);

  const updateProfileMutation = api.profile.updateProfile.useMutation({
    onSuccess: (data) => {
      messageApi.success("Settings updated successfully!");
      setIsLoading(false);
      initializeFromProfile(data);
    },
    onError: (error) => {
      console.error("Update error:", error);
      messageApi.error(error.message);
      setIsLoading(false);
    },
  });

  const handleSubmit = async () => {
    const state = useSettingsStore.getState();
    console.log("Submitting state:", state);

    if (!state.userInfo.name || !state.userInfo.username) {
      messageApi.error("Name and username are required!");
      return;
    }

    setIsLoading(true);
    const updateData = prepareUpdateData(state);
    await updateProfileMutation.mutateAsync(updateData);
  };

  if (isLoadingProfile) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {contextHolder}
      <Card className="shadow-md">
        <div className="mb-8">
          <Title level={2} className="m-0 flex items-center gap-2">
            <EditOutlined />
            Profile Settings
          </Title>
        </div>

        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane
            tab={
              <span className="flex items-center gap-2">
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
              <span className="flex items-center gap-2">
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
              <span className="flex items-center gap-2">
                <LinkOutlined />
                Social Links
              </span>
            }
            key="3"
          >
            <SocialLinksForm />
          </TabPane>
        </Tabs>

        <div className="mt-8 flex justify-end">
          <Button
            type="primary"
            size="large"
            loading={isLoading}
            onClick={handleSubmit}
            disabled={!isDirty}
          >
            Save Changes
          </Button>
        </div>
      </Card>
    </div>
  );
}
