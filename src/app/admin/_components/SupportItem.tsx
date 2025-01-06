// components/SupportItem.tsx
import { Card } from "antd";
import Link from "next/link";

interface SupportItemProps {
  title: string;
  desc: string;
  path: string;
  badge?: string;
}

export const SupportItem = ({ title, desc, path, badge }: SupportItemProps) => (
  <Link href={path} className="block h-full">
    <Card
      title={title}
      extra={badge && <span className="text-blue-600">{badge}</span>}
      hoverable
      className="flex h-full flex-col"
      bodyStyle={{ flex: 1 }}
    >
      <p className="text-gray-500">{desc}</p>
    </Card>
  </Link>
);

export default SupportItem;
