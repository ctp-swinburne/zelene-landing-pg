"use client";
import { useState } from "react";
import type { RouterOutputs } from "~/trpc/react";
import { api } from "~/trpc/react";
import {
  Layout,
  Input,
  Card,
  Tag,
  Space,
  Typography,
  Avatar,
  Row,
  Col,
  Select,
  Divider,
  Button,
} from "antd";
import {
  UserOutlined,
  ClockCircleOutlined,
  EyeOutlined,
  LikeOutlined,
  MessageOutlined,
  SearchOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;
const { Content, Sider } = Layout;
const { Option } = Select;

// Mock data structure matching our post detail page
const mockPosts = [
  {
    id: "1",
    title: "Implementing MQTT Protocol in IoT Devices: A Comprehensive Guide",
    author: {
      name: "John Doe",
      role: "IoT Developer",
      avatar: null,
    },
    publishedAt: "2024-01-08",
    tags: ["MQTT", "IoT", "Protocol", "Tutorial", "Advanced"],
    excerpt:
      "MQTT (Message Queuing Telemetry Transport) is a lightweight messaging protocol designed for constrained devices and low-bandwidth, high-latency networks. In this comprehensive guide, we'll explore how to implement MQTT in IoT devices effectively.",
    stats: {
      views: 1234,
      likes: 89,
      comments: 23,
    },
  },
  {
    id: "2",
    title: "Understanding IoT Protocols: MQTT vs CoAP",
    author: {
      name: "Jane Smith",
      role: "Systems Architect",
      avatar: null,
    },
    publishedAt: "2024-01-07",
    tags: ["IoT", "Protocols", "Comparison", "MQTT", "CoAP"],
    excerpt:
      "When building IoT solutions, choosing the right protocol is crucial. This article compares two popular protocols: MQTT and CoAP, helping you make the right choice for your specific use case.",
    stats: {
      views: 856,
      likes: 67,
      comments: 15,
    },
  },
  {
    id: "3",
    title: "Security Best Practices in IoT Communications",
    author: {
      name: "Mike Johnson",
      role: "Security Engineer",
      avatar: null,
    },
    publishedAt: "2024-01-06",
    tags: ["Security", "IoT", "Best Practices"],
    excerpt:
      "Security is crucial in IoT deployments. Learn about the best practices for securing your IoT communications, including encryption, authentication, and secure boot processes.",
    stats: {
      views: 2341,
      likes: 156,
      comments: 45,
    },
  },
];

// All unique tags from posts
const allTags = Array.from(
  new Set(mockPosts.flatMap((post) => post.tags)),
).sort();

const BrowsePosts: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>("recent");

  const filteredPosts = mockPosts
    .filter((post) => {
      const matchesSearch = post.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.every((tag) => post.tags.includes(tag));
      return matchesSearch && matchesTags;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "views":
          return b.stats.views - a.stats.views;
        case "likes":
          return b.stats.likes - a.stats.likes;
        case "comments":
          return b.stats.comments - a.stats.comments;
        default:
          return (
            new Date(b.publishedAt).getTime() -
            new Date(a.publishedAt).getTime()
          );
      }
    });

  return (
    <Layout className="min-h-screen bg-gray-50">
      <Content className="px-4 py-8 md:px-6">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <Title level={2}>Browse IoT Articles</Title>
            <Text type="secondary" className="text-lg">
              Discover the latest articles about IoT development and best
              practices
            </Text>
          </div>

          <Row gutter={[32, 32]}>
            {/* Main Content */}
            <Col xs={24} lg={18}>
              {/* Search and Sort Controls */}
              <Card className="mb-6">
                <Row gutter={16} align="middle">
                  <Col flex="auto">
                    <Input
                      placeholder="Search articles..."
                      prefix={<SearchOutlined />}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      size="large"
                    />
                  </Col>
                  <Col>
                    <Select
                      value={sortBy}
                      onChange={setSortBy}
                      style={{ width: 140 }}
                      size="large"
                    >
                      <Option value="recent">Most Recent</Option>
                      <Option value="views">Most Viewed</Option>
                      <Option value="likes">Most Liked</Option>
                      <Option value="comments">Most Discussed</Option>
                    </Select>
                  </Col>
                </Row>
              </Card>

              {/* Posts List */}
              <Space direction="vertical" size={16} className="w-full">
                {filteredPosts.map((post) => (
                  <Card
                    key={post.id}
                    className="w-full cursor-pointer transition-shadow hover:shadow-md"
                  >
                    <Space direction="vertical" size={16} className="w-full">
                      {/* Tags */}
                      <Space wrap>
                        {post.tags.map((tag) => (
                          <Tag
                            key={tag}
                            className="rounded-full border-blue-100 bg-blue-50 px-3 py-1 text-blue-600"
                          >
                            {tag}
                          </Tag>
                        ))}
                      </Space>

                      {/* Title and Excerpt */}
                      <div>
                        <Title level={4} className="mb-2 hover:text-blue-600">
                          {post.title}
                        </Title>
                        <Text type="secondary" className="text-sm">
                          {post.excerpt}
                        </Text>
                      </div>

                      <Divider className="my-3" />

                      {/* Author and Stats */}
                      <Row justify="space-between" align="middle">
                        <Col>
                          <Space>
                            <Avatar icon={<UserOutlined />} />
                            <Space direction="vertical" size={0}>
                              <Text strong>{post.author.name}</Text>
                              <Text type="secondary" className="text-sm">
                                {post.author.role}
                              </Text>
                            </Space>
                            <Divider type="vertical" />
                            <Space>
                              <ClockCircleOutlined className="text-gray-400" />
                              <Text type="secondary" className="text-sm">
                                {post.publishedAt}
                              </Text>
                            </Space>
                          </Space>
                        </Col>
                        <Col>
                          <Space size="large">
                            <Space>
                              <EyeOutlined className="text-gray-400" />
                              <Text type="secondary">
                                {post.stats.views.toLocaleString()}
                              </Text>
                            </Space>
                            <Space>
                              <LikeOutlined className="text-gray-400" />
                              <Text type="secondary">{post.stats.likes}</Text>
                            </Space>
                            <Space>
                              <MessageOutlined className="text-gray-400" />
                              <Text type="secondary">
                                {post.stats.comments}
                              </Text>
                            </Space>
                          </Space>
                        </Col>
                      </Row>
                    </Space>
                  </Card>
                ))}
              </Space>
            </Col>

            {/* Sidebar */}
            <Col xs={24} lg={6}>
              <div className="sticky top-8">
                <Card>
                  <Title level={4} className="mb-4">
                    Filter by Tags
                  </Title>
                  <Space wrap>
                    {allTags.map((tag) => (
                      <Tag
                        key={tag}
                        className={`cursor-pointer rounded-full px-3 py-1 transition-colors ${
                          selectedTags.includes(tag)
                            ? "bg-blue-600 text-white"
                            : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                        }`}
                        onClick={() => {
                          setSelectedTags(
                            selectedTags.includes(tag)
                              ? selectedTags.filter((t) => t !== tag)
                              : [...selectedTags, tag],
                          );
                        }}
                      >
                        {tag}
                      </Tag>
                    ))}
                  </Space>
                </Card>
              </div>
            </Col>
          </Row>
        </div>
      </Content>
    </Layout>
  );
};

export default BrowsePosts;
