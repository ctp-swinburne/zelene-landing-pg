// SkillsSection.tsx
import { Card, Typography, Tag } from "antd";
import { ToolOutlined } from "@ant-design/icons";
import type { RouterOutputs } from "~/trpc/react";

const { Text } = Typography;

type SkillsSectionProps = {
  profile: NonNullable<RouterOutputs["profile"]["getProfile"]>;
};

export function SkillsSection({ profile }: SkillsSectionProps) {
  if (!profile.profile?.skills) {
    return null;
  }

  const skillsList = profile.profile.skills
    .split(",")
    .map((skill) => skill.trim());

  return (
    <Card
      title={
        <span className="flex items-center gap-2">
          <ToolOutlined /> Skills
        </span>
      }
      className="mb-6"
    >
      <div className="flex flex-wrap gap-2">
        {skillsList.map((skill) => (
          <Tag key={skill} color="blue">
            {skill}
          </Tag>
        ))}
      </div>
    </Card>
  );
}
