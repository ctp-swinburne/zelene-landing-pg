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
  Tooltip,
  Empty,
} from "antd";
import {
  UserOutlined,
  ClockCircleOutlined,
  EyeOutlined,
  LikeOutlined,
  MessageOutlined,
  SearchOutlined,
  CrownOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import { useSession } from "next-auth/react";

const { Title, Text } = Typography;
const { Content } = Layout;
const { Option } = Select;

type PostList = RouterOutputs["post"]["getAll"]["items"][0];

const BrowsePosts: React.FC = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>("latest");
  const [pageSize] = useState(10);

  // Fetch posts with pagination
  const {
    data: postsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = api.post.getAll.useInfiniteQuery(
    {
      limit: pageSize,
      tags: selectedTags,
      orderBy: sortBy as "latest" | "popular" | "official",
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );

  // Fetch all tags
  const { data: tagsData } = api.tag.getAll.useQuery({
    limit: 50,
  });

  const allPosts = postsData?.pages.flatMap((page) => page.items) ?? [];

  // Filter posts based on search term
  const filteredPosts = allPosts.filter((post) =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleTagClick = (tagName: string) => {
    if (!selectedTags.includes(tagName)) {
      setSelectedTags([...selectedTags, tagName]);
    }
  };

  const handleRemoveTag = (tagName: string) => {
    setSelectedTags(selectedTags.filter(tag => tag !== tagName));
  };

  const renderPostCard = (post: PostList) => (
    <Card
      key={post.id}
      className={`w-full cursor-pointer transition-shadow hover:shadow-md ${
        post.isOfficial ? 'border-yellow-400' : ''
      }`}
      onClick={() => router.push(`/posts/${post.id}`)}
    >
      <Space direction="vertical" size={16} className="w-full">
        {/* Official Badge */}
        {post.isOfficial && (
          <div className="flex items-center gap-2 text-yellow-600">
            <CrownOutlined />
            <span className="font-medium">Official Post</span>
          </div>
        )}

        {/* Tags */}
        <Space wrap>
          {post.tags.map(({ tag }) => (
            <Tag
              key={tag.id}
              className={`rounded-full px-3 py-1 ${
                tag.isOfficial
                  ? 'border-yellow-400 bg-yellow-50 text-yellow-600'
                  : 'border-blue-100 bg-blue-50 text-blue-600'
              }`}
              onClick={(e) => {
                e.stopPropagation();
                handleTagClick(tag.name);
              }}
            >
              {tag.isOfficial && <CrownOutlined className="mr-1" />}
              {tag.name}
            </Tag>
          ))}
        </Space>

        {/* Title and Excerpt */}
        <div>
          <Title level={4} className={`mb-2 hover:text-blue-600 ${
            post.isOfficial ? 'text-yellow-800' : ''
          }`}>
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
                className={post.isOfficial ? 'border-2 border-yellow-400' : ''}
              />
              <Space direction="vertical" size={0}>
                <Text strong>{post.createdBy.name}</Text>
                <Text type="secondary" className="text-xs">
                  {post.isOfficial ? 'Official Contributor' : 'Member'}
                </Text>
              </Space>
              <Divider type="vertical" />
              <Space>
                <ClockCircleOutlined className="text-gray-400" />
                <Text type="secondary" className="text-sm">
                  {new Date(post.publishedAt).toLocaleDateString()}
                </Text>
              </Space>
            </Space>
          </Col>
          <Col>
            <Space size="large">
              <Tooltip title="Views">
                <Space>
                  <EyeOutlined className="text-gray-400" />
                  <Text type="secondary">{post.viewCount.toLocaleString()}</Text>
                </Space>
              </Tooltip>
              <Tooltip title="Likes">
                <Space>
                  <LikeOutlined className="text-gray-400" />
                  <Text type="secondary">{post.likeCount}</Text>
                </Space>
              </Tooltip>
              <Tooltip title="Comments">
                <Space>
                  <MessageOutlined className="text-gray-400" />
                  <Text type="secondary">{post.commentCount}</Text>
                </Space>
              </Tooltip>
            </Space>
          </Col>
        </Row>
      </Space>
    </Card>
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
              {/* Search and Filter Controls */}
              <Card className="mb-6">
                <Row gutter={16} align="middle">
                  <Col flex="auto">
                    <Input
                      placeholder="Search articles..."
                      prefix={<SearchOutlined />}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      size="large"
                      allowClear
                    />
                  </Col>
                  <Col>
                    <Select
                      value={sortBy}
                      style={{ width: 120 }}
                      onChange={setSortBy}
                    >
                      <Option value="latest">Latest</Option>
                      <Option value="popular">Popular</Option>
                      <Option value="official">Official</Option>
                    </Select>
                  </Col>
                </Row>
              </Card>

              {/* Active Filters */}
              {selectedTags.length > 0 && (
                <div className="mb-4">
                  <Space wrap>
                    {selectedTags.map(tag => (
                      <Tag
                        key={tag}
                        closable
                        onClose={() => handleRemoveTag(tag)}
                      >
                        {tag}
                      </Tag>
                    ))}
                    <Button 
                      type="link" 
                      onClick={() => setSelectedTags([])}
                    >
                      Clear all
                    </Button>
                  </Space>
                </div>
              )}

              {/* Posts List */}
              <Space direction="vertical" size={16} className="w-full">
                {filteredPosts.length > 0 ? (
                  <>
                    {filteredPosts.map(renderPostCard)}
                    
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
                  </>
                ) : (
                  <Empty 
                    description={
                      <Text type="secondary">
                        No posts found. Try adjusting your search or filters.
                      </Text>
                    }
                  />
                )}
              </Space>
            </Col>

            {/* Sidebar */}
            <Col xs={24} lg={6}>
              <div className="sticky top-8">
                <Card>
                  <Title level={4} className="mb-4 flex items-center gap-2">
                    <FilterOutlined />
                    Filter by Tags
                  </Title>
                  <Space wrap>
                    {tagsData?.items.map((tag) => (
                      <Tag
                        key={tag.id}
                        className={`cursor-pointer rounded-full px-3 py-1 transition-colors ${
                          selectedTags.includes(tag.name)
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                        } ${
                          tag.isOfficial
                            ? 'border-yellow-400' 
                            : ''
                        }`}
                        onClick={() => handleTagClick(tag.name)}
                      >
                        {tag.isOfficial && (
                          <CrownOutlined className="mr-1" />
                        )}
                        {tag.name}
                        <span className="ml-1 text-xs">
                          ({tag.postCount})
                        </span>
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