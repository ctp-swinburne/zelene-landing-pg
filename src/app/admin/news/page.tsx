"use client";

import React, { useState } from "react";
import { Card, Button, Table, Tag, Space, Modal, Form, Input, message, Select, Row, Col } from "antd";
import { PlusOutlined, CrownOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { api } from "~/trpc/react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import type { ColumnsType } from "antd/es/table";

const { TextArea } = Input;
const { confirm } = Modal;

interface OfficialNewsFormData {
  title: string;
  excerpt: string;
  content: string;
  tags: string[];
}

interface PostData {
  id: number;
  title: string;
  excerpt: string;
  isOfficial: boolean;
  publishedAt: Date;
}

export default function OfficialNewsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPostId, setEditingPostId] = useState<number | null>(null);
  const [form] = Form.useForm<OfficialNewsFormData>();
  
  // Query for fetching posts with official filter
  const { data: posts, isLoading, refetch } = api.post.getAll.useQuery({
    limit: 100,
    isOfficial: true,
  });

  // Create post mutation
  const createPostMutation = api.post.create.useMutation({
    onSuccess: () => {
      message.success("Official news created successfully");
      setIsModalOpen(false);
      form.resetFields();
      void refetch();
    },
    onError: (error) => {
      message.error(error.message || "Failed to create news");
    },
  });

  // Update post mutation
  const updatePostMutation = api.post.update.useMutation({
    onSuccess: () => {
      message.success("Official news updated successfully");
      setIsModalOpen(false);
      form.resetFields();
      void refetch();
    },
    onError: (error) => {
      message.error(error.message || "Failed to update news");
    },
  });

  // Delete post mutation
  const deletePostMutation = api.post.delete.useMutation({
    onSuccess: () => {
      message.success("Official news deleted successfully");
      void refetch();
    },
    onError: (error) => {
      message.error(error.message || "Failed to delete news");
    },
  });

  // Handle form submission
  const handleSubmit = async (values: OfficialNewsFormData) => {
    // Ensure that the "official" tag is included
    const tagsWithOfficial = [...values.tags];
    if (!tagsWithOfficial.some(tag => tag.includes('official'))) {
      tagsWithOfficial.push('news-official');
    }

    try {
      if (editingPostId) {
        // Update existing post
        await updatePostMutation.mutateAsync({
          id: editingPostId,
          title: values.title,
          excerpt: values.excerpt,
          content: values.content,
          tags: tagsWithOfficial,
          isOfficial: true,
        });
      } else {
        // Create new post
        await createPostMutation.mutateAsync({
          title: values.title,
          excerpt: values.excerpt,
          content: values.content,
          tags: tagsWithOfficial,
          isOfficial: true,
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  // Open modal for creating new post
  const showCreateModal = () => {
    setEditingPostId(null);
    form.resetFields();
    form.setFieldsValue({
      tags: ['news-official']
    });
    setIsModalOpen(true);
  };

  // Open modal for editing post
  const showEditModal = (post: PostData) => {
    setEditingPostId(post.id);
    
    // Set initial values with available information
    form.setFieldsValue({
      title: post.title,
      excerpt: post.excerpt,
      content: "Loading content...",
      tags: ['news-official']
    });
    
    // Open modal immediately
    setIsModalOpen(true);
  };

  // Confirm delete dialog
  const showDeleteConfirm = (id: number) => {
    confirm({
      title: 'Are you sure you want to delete this official news?',
      icon: <ExclamationCircleOutlined />,
      content: 'This action cannot be undone.',
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk() {
        void deletePostMutation.mutateAsync({ id });
      },
    });
  };

  // Table columns
  const columns: ColumnsType<PostData> = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (text: string, record) => (
        <Space direction="vertical" size={0}>
          <span className="font-medium">{text}</span>
          <span className="text-xs text-gray-500">
            {new Date(record.publishedAt).toLocaleDateString()}
          </span>
        </Space>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      width: 120,
      render: () => (
        <Tag icon={<CrownOutlined />} color="gold">
          Official
        </Tag>
      ),
    },
    {
      title: 'Preview',
      dataIndex: 'excerpt',
      key: 'excerpt',
      render: (text: string) => (
        <div className="max-w-md truncate">
          {text.length > 100 ? `${text.substring(0, 100)}...` : text}
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 200,
      render: (_, record) => (
        <Space>
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            onClick={() => showEditModal(record)}
          >
            Edit
          </Button>
          <Button 
            danger 
            icon={<DeleteOutlined />} 
            onClick={() => showDeleteConfirm(record.id)}
          >
            Delete
          </Button>
          <Link href={`/posts/${record.id}`} target="_blank">
            <Button>View</Button>
          </Link>
        </Space>
      ),
    },
  ];

  // Check if user can create official tags (should be admin or tenant admin)
  const canCreateOfficialTags = true; // Normally you should check user permissions here

  return (
    <div className="space-y-6">
      <Card className="shadow">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Official News Management</h1>
            <p className="text-gray-500">
              Create and manage official platform announcements and news
            </p>
          </div>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={showCreateModal}
          >
            Create Official News
          </Button>
        </div>

        <Table 
          columns={columns} 
          dataSource={posts?.items} 
          rowKey="id" 
          loading={isLoading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      {/* Create/Edit Modal */}
      <Modal
        title={editingPostId ? "Edit Official News" : "Create Official News"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ tags: ['news-official'] }}
        >
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: 'Please enter a title' }]}
          >
            <Input placeholder="Enter news title" />
          </Form.Item>

          <Form.Item
            name="excerpt"
            label="Excerpt/Summary"
            rules={[{ required: true, message: 'Please enter an excerpt' }]}
          >
            <TextArea 
              rows={3} 
              placeholder="Enter a brief summary of the news"
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="content"
                label="Content (Markdown)"
                rules={[{ required: true, message: 'Please enter content' }]}
              >
                <TextArea
                  rows={15}
                  placeholder="Write your news content using Markdown..."
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Preview">
                <div className="border border-gray-200 h-64 overflow-auto p-4 rounded">
                  <ReactMarkdown>
                    {form.getFieldValue('content') || '*Preview will appear here*'}
                  </ReactMarkdown>
                </div>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="tags"
            label="Tags"
            rules={[{ required: true, message: 'Please add at least one tag' }]}
            extra="At least one tag with 'official' is required"
          >
            <Select
              mode="tags"
              style={{ width: '100%' }}
              placeholder="Enter tags (press enter to add)"
              disabled={!canCreateOfficialTags}
            />
          </Form.Item>

          <div className="flex justify-end gap-2 mt-4">
            <Button onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              type="primary" 
              htmlType="submit"
              loading={createPostMutation.isPending || updatePostMutation.isPending}
            >
              {editingPostId ? 'Update News' : 'Publish News'}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}