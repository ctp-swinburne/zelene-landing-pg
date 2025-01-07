"use client";

import { useParams } from "next/navigation";
import { api } from "~/trpc/react";
import type { RouterOutputs } from "~/trpc/react";
import {
  Button,
  Card,
  Avatar,
  Typography,
  Descriptions,
  Space,
  Skeleton,
} from "antd";
import { EditOutlined, UserOutlined } from "@ant-design/icons";
import Link from "next/link";

const { Title, Text } = Typography;

type ProfileData = RouterOutputs["profile"]["getProfile"];

export default function ProfilePage() {
  const params = useParams();

  // Log params to see what we're getting
  console.log("URL Parameters:", params);

  // Assuming the route is something like /profile/[id]
  const userId = typeof params?.id === "string" ? params.id : null;

  // Fetch profile data with proper error handling
  const {
    data: profile,
    isLoading,
    error,
  } = api.profile.getProfile.useQuery(
    { userId: userId! },
    {
      enabled: !!userId,
      retry: 1, // Limit retries to avoid infinite loops
    },
  );

  // Fetch current user's profile
  const { data: currentProfile } = api.profile.getCurrentProfile.useQuery(
    undefined,
    {
      enabled: !!userId,
    },
  );

  const isOwnProfile = currentProfile?.id === profile?.id;

  // Show loading state
  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <Skeleton active avatar paragraph={{ rows: 4 }} />
      </div>
    );
  }

  // Show error state
  if (!userId) {
    return (
      <div className="container mx-auto p-6">
        <Title level={4}>Invalid profile URL</Title>
      </div>
    );
  }

  // Show error state with more details
  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Title level={4}>Error loading profile: {error.message}</Title>
      </div>
    );
  }

  // Show not found state
  if (!profile) {
    return (
      <div className="container mx-auto p-6">
        <Title level={4}>Profile not found for ID: {userId}</Title>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <Card>
        <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
          <Avatar
            size={128}
            src={profile.image}
            icon={!profile.image ? <UserOutlined /> : undefined}
          />

          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <Title level={2}>{profile.name}</Title>
                <Text type="secondary">@{profile.username}</Text>
              </div>

              {isOwnProfile && (
                <Link href="/settings">
                  <Button type="primary" icon={<EditOutlined />}>
                    Edit Profile
                  </Button>
                </Link>
              )}
            </div>

            <Descriptions column={1} className="mt-6">
              {profile.profile && (
                <>
                  {profile.profile.bio && (
                    <Descriptions.Item label="Bio">
                      {profile.profile.bio}
                    </Descriptions.Item>
                  )}
                  {profile.profile.location && (
                    <Descriptions.Item label="Location">
                      {profile.profile.location}
                    </Descriptions.Item>
                  )}
                </>
              )}
              <Descriptions.Item label="Joined">
                {new Date(profile.joined).toLocaleDateString()}
              </Descriptions.Item>
            </Descriptions>

            {profile.social && (
              <Card size="small" title="Social Links" className="mt-6">
                <Space direction="vertical">
                  {profile.social.twitter && (
                    <Text>
                      Twitter:{" "}
                      <a
                        href={`https://twitter.com/${profile.social.twitter}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        @{profile.social.twitter}
                      </a>
                    </Text>
                  )}
                  {profile.social.github && (
                    <Text>
                      GitHub:{" "}
                      <a
                        href={`https://github.com/${profile.social.github}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {profile.social.github}
                      </a>
                    </Text>
                  )}
                  {profile.social.website && (
                    <Text>
                      Website:{" "}
                      <a
                        href={profile.social.website}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {profile.social.website}
                      </a>
                    </Text>
                  )}
                </Space>
              </Card>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
