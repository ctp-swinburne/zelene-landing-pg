// MainProfile.tsx
"use client";

import { useParams } from "next/navigation";
import { api } from "~/trpc/react";
import type { RouterOutputs } from "~/trpc/react";
import { Typography, Skeleton, Row, Col } from "antd";
import { useSession } from "next-auth/react";
import { ProfileHeader } from "./_components/ProfileHeader";
import { AboutSection } from "./_components/AboutSection";
import { CurrentSection } from "./_components/CurrentSection";
import { SkillsSection } from "./_components/SkillsSection";
import { SocialLinks } from "./_components/SocialLinks";

const { Title } = Typography;

export default function ProfilePage() {
  const params = useParams();
  const { data: session } = useSession();
  const userId = typeof params?.id === "string" ? params.id : null;

  const {
    data: profile,
    isLoading,
    error,
  } = api.profile.getProfile.useQuery(
    { userId: userId! },
    {
      enabled: !!userId,
      retry: 1,
    },
  );

  const isOwnProfile = session?.user?.id === profile?.id;

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <Skeleton active avatar paragraph={{ rows: 4 }} />
      </div>
    );
  }

  if (!userId || error || !profile) {
    return (
      <div className="container mx-auto p-6">
        <Title level={4}>
          {!userId
            ? "Invalid profile URL"
            : error
              ? `Error loading profile: ${error.message}`
              : `Profile not found for ID: ${userId}`}
        </Title>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <Row gutter={[24, 24]}>
        {/* Left Column */}
        <Col xs={24} lg={8}>
          <ProfileHeader profile={profile} isOwnProfile={isOwnProfile} />
          <SkillsSection profile={profile} />
          <SocialLinks profile={profile} />
        </Col>

        {/* Right Column */}
        <Col xs={24} lg={16}>
          <AboutSection profile={profile} />
          <CurrentSection profile={profile} />
        </Col>
      </Row>
    </div>
  );
}
