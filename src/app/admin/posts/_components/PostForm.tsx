import React from 'react';
import { Form, Input, Select } from 'antd';
import type { FormInstance } from 'antd';
import { api } from "~/trpc/react";

const { TextArea } = Input;

interface Post {
  id: number;
  title: string;
  excerpt: string;
  content: string;
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

interface FormData {
  title: string;
  excerpt: string;
  content: string;
  tags?: number[];
  relatedPosts?: number[];
}

interface PostFormProps {
  form: FormInstance<FormData>;
  editingPost: Post | null;
}

export default function PostForm({ editingPost }: PostFormProps) {
  // Get all posts for the related posts select
  const { data: posts } = api.post.getAll.useQuery({
    limit: 100,
    cursor: null
  });

  // Create options for related posts select
  const postOptions = posts?.items
    .filter(post => post.id !== editingPost?.id) // Exclude current post
    .map(post => ({
      label: post.title,
      value: post.id,
    })) ?? [];

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900">
          {editingPost ? 'Edit Post' : 'Create New Post'}
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          {editingPost 
            ? 'Update your post content and settings' 
            : 'Fill in the information below to create a new post'}
        </p>
      </div>

      <Form.Item
        name="title"
        label="Title"
        rules={[
          { required: true, message: 'Please enter a title' },
          { max: 255, message: 'Title cannot be longer than 255 characters' }
        ]}
      >
        <Input placeholder="Enter post title" />
      </Form.Item>

      <Form.Item
        name="excerpt"
        label="Excerpt"
        rules={[
          { required: true, message: 'Please enter an excerpt' },
          { max: 500, message: 'Excerpt cannot be longer than 500 characters' }
        ]}
      >
        <TextArea 
          placeholder="Enter a brief excerpt"
          rows={3}
          showCount
          maxLength={500}
        />
      </Form.Item>

      <Form.Item
        name="content"
        label="Content"
        rules={[{ required: true, message: 'Please enter content' }]}
      >
        <TextArea 
          placeholder="Enter post content"
          rows={10}
          className="font-mono"
        />
      </Form.Item>

      <Form.Item
        name="tags"
        label="Tags"
      >
        <Select
          mode="multiple"
          placeholder="Select tags"
          options={[]} // You'll need to fetch tags from your backend
          className="w-full"
        />
      </Form.Item>

      <Form.Item
        name="relatedPosts"
        label="Related Posts"
      >
        <Select
          mode="multiple"
          placeholder="Select related posts"
          options={postOptions}
          className="w-full"
        />
      </Form.Item>
    </div>
  );
}