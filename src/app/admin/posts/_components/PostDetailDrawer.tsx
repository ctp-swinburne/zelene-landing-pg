import React from 'react';
import { Drawer, Descriptions, Tag, Space, Divider, Typography } from 'antd';
import { 
  EyeOutlined, 
  LikeOutlined, 
  MessageOutlined, 
  ClockCircleOutlined, 
  UserOutlined 
} from '@ant-design/icons';

const { Text } = Typography;

interface Post {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  publishedAt: Date;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  createdBy: {
    name: string | null;
  };
  tags: {
    tag: {
      id: number;
      name: string;
    };
  }[];
}

interface PostDetailDrawerProps {
  post: Post | null;
  visible: boolean;
  onClose: () => void;
}

export default function PostDetailDrawer({ post, visible, onClose }: PostDetailDrawerProps) {
  if (!post) return null;

  return (
    <Drawer
      title={
        <div className="flex items-center justify-between">
          <span className="text-xl font-medium">{post.title}</span>
        </div>
      }
      placement="right"
      width={800}
      onClose={onClose}
      open={visible}
    >
      <div className="space-y-6">
        {/* Meta Information */}
        <div className="rounded-lg border p-4">
          <Space size={16} wrap>
            <Space>
              <UserOutlined />
              <Text>{post.createdBy.name ?? 'Anonymous'}</Text>
            </Space>
            <Space>
              <ClockCircleOutlined />
              <Text>{new Date(post.publishedAt).toLocaleDateString()}</Text>
            </Space>
            <Space>
              <EyeOutlined />
              <Text>{post.viewCount} views</Text>
            </Space>
            <Space>
              <LikeOutlined />
              <Text>{post.likeCount} likes</Text>
            </Space>
            <Space>
              <MessageOutlined />
              <Text>{post.commentCount} comments</Text>
            </Space>
          </Space>
        </div>

        {/* Tags */}
        <div>
          <Text strong className="mb-2 block">Tags:</Text>
          <Space size={[0, 8]} wrap>
            {post.tags.map((tag) => (
              <Tag key={tag.tag.id} color="blue">
                {tag.tag.name}
              </Tag>
            ))}
          </Space>
        </div>

        <Divider />

        {/* Excerpt */}
        <div>
          <Text strong className="mb-2 block">Excerpt:</Text>
          <Text italic className="text-gray-600">
            {post.excerpt}
          </Text>
        </div>

        <Divider />

        {/* Content */}
        <div>
          <Text strong className="mb-4 block">Content:</Text>
          <div 
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>

        {/* Post Statistics */}
        <Divider />
        <Descriptions title="Post Statistics" bordered column={2}>
          <Descriptions.Item label="Views">
            {post.viewCount}
          </Descriptions.Item>
          <Descriptions.Item label="Likes">
            {post.likeCount}
          </Descriptions.Item>
          <Descriptions.Item label="Comments">
            {post.commentCount}
          </Descriptions.Item>
          <Descriptions.Item label="Published Date">
            {new Date(post.publishedAt).toLocaleString()}
          </Descriptions.Item>
        </Descriptions>
      </div>
    </Drawer>
  );
}