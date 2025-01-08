// CurrentSection.tsx
import { Card, Typography, Space } from "antd";
import { RocketOutlined, BookOutlined, TeamOutlined } from "@ant-design/icons";
import type { RouterOutputs } from "~/trpc/react";

const { Text } = Typography;

type CurrentSectionProps = {
  profile: NonNullable<RouterOutputs["profile"]["getProfile"]>;
};

export function CurrentSection({ profile }: CurrentSectionProps) {
  if (
    !profile.profile?.currentProject &&
    !profile.profile?.currentLearning &&
    !profile.profile?.availableFor
  ) {
    return null;
  }

  return (
    <Card className="mb-6">
      <Space direction="vertical" className="w-full">
        {profile.profile?.currentProject && (
          <div>
            <Text strong className="flex items-center gap-2">
              <RocketOutlined /> Current Project
            </Text>
            <Text>{profile.profile.currentProject}</Text>
          </div>
        )}
        {profile.profile?.currentLearning && (
          <div>
            <Text strong className="flex items-center gap-2">
              <BookOutlined /> Learning
            </Text>
            <Text>{profile.profile.currentLearning}</Text>
          </div>
        )}
        {profile.profile?.availableFor && (
          <div>
            <Text strong className="flex items-center gap-2">
              <TeamOutlined /> Available For
            </Text>
            <Text>{profile.profile.availableFor}</Text>
          </div>
        )}
      </Space>
    </Card>
  );
}
