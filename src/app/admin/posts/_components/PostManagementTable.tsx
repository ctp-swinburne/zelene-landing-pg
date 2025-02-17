import React from 'react';
import { Table, Tag, Button, Space, Popconfirm, message } from 'antd';
import type { TableProps } from 'antd';
import { api } from "~/trpc/react";
import PostDetailDrawer from './PostDetailDrawer';

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

interface PostTableProps {
  onEdit: (post: Post) => void;
}

export default function PostManagementTable({ onEdit }: PostTableProps) {
  const [selectedPost, setSelectedPost] = React.useState<Post | null>(null);
  const [detailDrawerVisible, setDetailDrawerVisible] = React.useState(false);
  const utils = api.useUtils();

  // Query posts
  const { data, isLoading } = api.post.getAll.useQuery({
    limit: 100,
    cursor: null
  });

  // Delete mutation
  const deleteMutation = api.post.delete.useMutation({
    onSuccess: () => {
      message.success('Post deleted successfully');
      void utils.post.getAll.invalidate();
    },
    onError: (error) => {
      message.error(error.message);
    },
  });

  const handleDelete = async (id: number) => {
    try {
      await deleteMutation.mutateAsync({ id });
    } catch {
      // Error handling is done in mutation callbacks
    }
  };

  const columns: TableProps<Post>['columns'] = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (text: string, record: Post) => (
        <div>
          <div className="font-medium">{text}</div>
          <div className="text-sm text-gray-500">{record.excerpt}</div>
        </div>
      ),
      sorter: (a, b) => a.title.localeCompare(b.title),
    },
    {
      title: 'Author',
      dataIndex: ['createdBy', 'name'],
      key: 'author',
    },
    {
      title: 'Tags',
      key: 'tags',
      dataIndex: 'tags',
      render: (tags: Post['tags']) => (
        <Space size={[0, 8]} wrap>
          {tags.map((tag) => (
            <Tag key={tag.tag.id} color="blue">
              {tag.tag.name}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: 'Stats',
      key: 'stats',
      render: (_, record: Post) => (
        <Space size="middle">
          <span title="Views">👁️ {record.viewCount}</span>
          <span title="Likes">❤️ {record.likeCount}</span>
          <span title="Comments">💬 {record.commentCount}</span>
        </Space>
      ),
    },
    {
      title: 'Published',
      dataIndex: 'publishedAt',
      key: 'publishedAt',
      render: (date: Date) => new Date(date).toLocaleDateString(),
      sorter: (a, b) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime(),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record: Post) => (
        <Space size="middle">
          <Button 
            type="link" 
            onClick={() => {
              setSelectedPost(record);
              setDetailDrawerVisible(true);
            }}
          >
            View
          </Button>
          <Button type="link" onClick={() => onEdit(record)}>
            Edit
          </Button>
          <Popconfirm
            title="Delete post"
            description="Are you sure you want to delete this post?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        dataSource={data?.items ?? []}
        rowKey="id"
        loading={isLoading}
      />
      
      <PostDetailDrawer
        post={selectedPost}
        visible={detailDrawerVisible}
        onClose={() => {
          setDetailDrawerVisible(false);
          setSelectedPost(null);
        }}
      />
    </>
  );
}