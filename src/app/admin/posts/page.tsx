"use client";

import React from "react";
import { Card, Button, Space, Drawer, Form, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { api } from "~/trpc/react";
import PostManagementTable from "./_components/PostManagementTable";
import PostForm from "./_components/PostForm";

interface FormData {
  title: string;
  excerpt: string;
  content: string;
  tags?: number[];
  relatedPosts?: number[];
}

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
  relatedTo?: {
    relatedPost: {
      id: number;
    };
  }[];
}

export default function PostManagementPage() {
  const [form] = Form.useForm<FormData>();
  const [drawerVisible, setDrawerVisible] = React.useState(false);
  const [editingPost, setEditingPost] = React.useState<Post | null>(null);

  const utils = api.useUtils();

  // Create post mutation
  const createMutation = api.post.create.useMutation({
    onSuccess: async () => {
      message.success("Post created successfully");
      setDrawerVisible(false);
      form.resetFields();
      await utils.post.getAll.invalidate();
    },
    onError: (error) => {
      message.error(error.message);
    },
  });

  // Update post mutation
  const updateMutation = api.post.update.useMutation({
    onSuccess: async () => {
      message.success("Post updated successfully");
      setDrawerVisible(false);
      form.resetFields();
      await utils.post.getAll.invalidate();
    },
    onError: (error) => {
      message.error(error.message);
    },
  });

  const handleSubmit = async (values: FormData) => {
    try {
      const formattedValues = {
        ...values,
        tags: values.tags?.map(String), // Chuyển đổi tags từ number[] sang string[]
      };

      if (editingPost) {
        await updateMutation.mutateAsync({
          id: editingPost.id,
          ...formattedValues,
        });
      } else {
        await createMutation.mutateAsync(formattedValues);
      }
    } catch {
      // Error handling is done in mutation callbacks
    }
  };

  const handleEdit = (post: Post) => {
    setEditingPost(post);
    form.setFieldsValue({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      tags: post.tags.map((t) => t.tag.id),
      relatedPosts: post.relatedTo?.map((r) => r.relatedPost.id),
    });
    setDrawerVisible(true);
  };

  return (
    <div className="space-y-4">
      <Card>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Post Management</h1>
            <p className="text-gray-500">
              Create and manage blog posts
            </p>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingPost(null);
              form.resetFields();
              setDrawerVisible(true);
            }}
          >
            Create Post
          </Button>
        </div>

        <PostManagementTable onEdit={handleEdit} />
      </Card>

      <Drawer
        title={editingPost ? "Edit Post" : "Create New Post"}
        width={720}
        onClose={() => {
          setDrawerVisible(false);
          setEditingPost(null);
          form.resetFields();
        }}
        open={drawerVisible}
        extra={
          <Space>
            <Button onClick={() => setDrawerVisible(false)}>Cancel</Button>
            <Button
              type="primary"
              onClick={() => form.submit()}
              loading={createMutation.isPending || updateMutation.isPending}
            >
              {editingPost ? "Update" : "Create"}
            </Button>
          </Space>
        }
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <PostForm 
            form={form}
            editingPost={editingPost}
          />
        </Form>
      </Drawer>
    </div>
  );
}