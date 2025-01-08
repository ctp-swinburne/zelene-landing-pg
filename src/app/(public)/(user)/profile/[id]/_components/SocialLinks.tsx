// SocialLinks.tsx
import { Card, Button, Space } from "antd";
import {
  GithubOutlined,
  TwitterOutlined,
  LinkedinOutlined,
  FacebookOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import type { RouterOutputs } from "~/trpc/react";

type SocialLinksProps = {
  profile: NonNullable<RouterOutputs["profile"]["getProfile"]>;
};

export function SocialLinks({ profile }: SocialLinksProps) {
  if (!profile.social) {
    return null;
  }

  const socialLinks = [
    {
      url: profile.social.github,
      icon: <GithubOutlined />,
      label: "GitHub",
    },
    {
      url: profile.social.twitter,
      icon: <TwitterOutlined />,
      label: "Twitter",
    },
    {
      url: profile.social.linkedin,
      icon: <LinkedinOutlined />,
      label: "LinkedIn",
    },
    {
      url: profile.social.facebook,
      icon: <FacebookOutlined />,
      label: "Facebook",
    },
    {
      url: profile.social.website,
      icon: <GlobalOutlined />,
      label: "Website",
    },
  ].filter((link) => link.url);

  if (socialLinks.length === 0) return null;

  return (
    <Card title="Social Links" className="mb-6">
      <Space direction="vertical" className="w-full">
        {socialLinks.map((link) => (
          <Button
            key={link.label}
            type="link"
            icon={link.icon}
            href={link.url!}
            target="_blank"
            className="w-full text-left"
          >
            {link.label}
          </Button>
        ))}
      </Space>
    </Card>
  );
}
