"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
  Spin,
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
const { Content } = Layout;
const { Option } = Select;

type PostList = RouterOutputs["post"]["getAll"]["items"][0];

const BrowsePosts: React.FC = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [sortBy, setSortBy] = useState<string>("recent");

  // Fetch posts with pagination
  const {
    data: postsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = api.post.getAll.useInfiniteQuery(
    {
      limit: 10,
      tags: selectedTags.length > 0 ? selectedTags : undefined,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );

  // Fetch all tags
  // const { data: tagsData } = api.tag.getAll.useQuery();

  const allPosts = postsData?.pages.flatMap((page) => page.items) ?? [];

  // Filter posts based on search term
  const filteredPosts = allPosts.filter((post) =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Layout className="min-h-screen bg-gray-50">
      <Content className="px-4 py-8 md:px-6">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <Title level={2}>Browse Articles</Title>
            <Text type="secondary" className="text-lg">
              Discover the latest articles and insights
            </Text>
          </div>

          <Row gutter={[32, 32]}>
            {/* Main Content */}
            <Col xs={24} lg={18}>
              {/* Search Controls */}
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
                </Row>
              </Card>

              {/* Posts List */}
              <Space direction="vertical" size={16} className="w-full">
                {filteredPosts.map((post) => (
                  <Card
                    key={post.id}
                    className="w-full cursor-pointer transition-shadow hover:shadow-md"
                    onClick={() => router.push(`/posts/${post.id}`)}
                  >
                    <Space direction="vertical" size={16} className="w-full">
                      {/* Tags */}
                      <Space wrap>
                        {post.tags.map(({ tag }) => (
                          <Tag
                            key={tag.id}
                            className="rounded-full border-blue-100 bg-blue-50 px-3 py-1 text-blue-600"
                          >
                            {tag.name}
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
                            <Avatar
                              src={post.createdBy.image}
                              icon={<UserOutlined />}
                            />
                            <Space direction="vertical" size={0}>
                              <Text strong>{post.createdBy.name}</Text>
                            </Space>
                            <Divider type="vertical" />
                            <Space>
                              <ClockCircleOutlined className="text-gray-400" />
                              <Text type="secondary" className="text-sm">
                                {new Date(
                                  post.publishedAt,
                                ).toLocaleDateString()}
                              </Text>
                            </Space>
                          </Space>
                        </Col>
                        <Col>
                          <Space size="large">
                            <Space>
                              <EyeOutlined className="text-gray-400" />
                              <Text type="secondary">
                                {post.viewCount.toLocaleString()}
                              </Text>
                            </Space>
                            <Space>
                              <LikeOutlined className="text-gray-400" />
                              <Text type="secondary">{post.likeCount}</Text>
                            </Space>
                            <Space>
                              <MessageOutlined className="text-gray-400" />
                              <Text type="secondary">{post.commentCount}</Text>
                            </Space>
                          </Space>
                        </Col>
                      </Row>
                    </Space>
                  </Card>
                ))}

                {/* Load More Button */}
                {hasNextPage && (
                  <div className="flex justify-center">
                    <Button
                      onClick={() => fetchNextPage()}
                      loading={isFetchingNextPage}
                      size="large"
                    >
                      Load More
                    </Button>
                  </div>
                )}
              </Space>
            </Col>
            {/* Sidebar
            <Col xs={24} lg={6}>
              <div className="sticky top-8">
                <Card>
                  <Title level={4} className="mb-4">
                    Filter by Tags
                  </Title>
                  <Space wrap>
                    {tagsData?.map((tag) => (
                      <Tag
                        key={tag.id}
                        className={`cursor-pointer rounded-full px-3 py-1 transition-colors ${
                          selectedTags.includes(tag.id)
                            ? "bg-blue-600 text-white"
                            : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                        }`}
                        onClick={() => {
                          setSelectedTags(
                            selectedTags.includes(tag.id)
                              ? selectedTags.filter((t) => t !== tag.id)
                              : [...selectedTags, tag.id],
                          );
                        }}
                      >
                        {tag.name}
                      </Tag>
                    ))}
                  </Space>
                </Card>
              </div>
            </Col> */}
          </Row>
        </div>
      </Content>
    </Layout>
  );
};

export default BrowsePosts;
