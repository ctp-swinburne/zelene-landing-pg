// ProfileHeader.tsx
import { Avatar, Button, Card, Typography } from "antd";
import { EditOutlined, UserOutlined } from "@ant-design/icons";
import Link from "next/link";
import type { RouterOutputs } from "~/trpc/react";

const { Title, Text } = Typography;

type ProfileHeaderProps = {
  profile: NonNullable<RouterOutputs["profile"]["getProfile"]>;
  isOwnProfile: boolean;
};

export function ProfileHeader({ profile, isOwnProfile }: ProfileHeaderProps) {
  return (
    <Card className="mb-6">
      <div className="flex flex-col items-center text-center">
        <Avatar
          size={128}
          src={profile.image}
          icon={!profile.image ? <UserOutlined /> : undefined}
          className="mb-4 border-2 border-solid border-blue-100"
        />
        <div className="mb-4">
          <Title level={2} className="!mb-1">
            {profile.name || "Unnamed User"}
          </Title>
          <Text type="secondary" className="text-lg">
            @{profile.username}
          </Text>
        </div>
        {isOwnProfile && (
          <Button type="primary" icon={<EditOutlined />}>
            <Link href="/settings">Edit Profile</Link>
          </Button>
        )}
      </div>
    </Card>
  );
}
