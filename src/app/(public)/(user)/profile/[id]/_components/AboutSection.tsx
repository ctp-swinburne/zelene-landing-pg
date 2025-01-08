// AboutSection.tsx
import { Card, Typography, Descriptions } from "antd";
import {
  UserOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import type { RouterOutputs } from "~/trpc/react";

const { Text } = Typography;

type AboutSectionProps = {
  profile: NonNullable<RouterOutputs["profile"]["getProfile"]>;
};

export function AboutSection({ profile }: AboutSectionProps) {
  return (
    <Card
      title={
        <span className="flex items-center gap-2">
          <UserOutlined /> About
        </span>
      }
      className="mb-6"
    >
      <Descriptions column={1}>
        {profile.profile?.bio && (
          <Descriptions.Item label="Bio">
            <Text>{profile.profile.bio}</Text>
          </Descriptions.Item>
        )}
        <Descriptions.Item
          label={
            <span className="flex items-center gap-2">
              <EnvironmentOutlined /> Location
            </span>
          }
        >
          {profile.profile?.location || (
            <Text type="secondary">Location not set</Text>
          )}
        </Descriptions.Item>
        <Descriptions.Item
          label={
            <span className="flex items-center gap-2">
              <ClockCircleOutlined /> Member Since
            </span>
          }
        >
          {new Date(profile.joined).toLocaleDateString()}
        </Descriptions.Item>
        {profile.profile?.work && (
          <Descriptions.Item label="Work">
            {profile.profile.work}
          </Descriptions.Item>
        )}
        {profile.profile?.education && (
          <Descriptions.Item label="Education">
            {profile.profile.education}
          </Descriptions.Item>
        )}
      </Descriptions>
    </Card>
  );
}
