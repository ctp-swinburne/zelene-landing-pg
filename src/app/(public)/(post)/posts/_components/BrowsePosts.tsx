"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { RouterOutputs } from "~/trpc/react";
import { api } from "~/trpc/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw"; // Import rehypeRaw to parse HTML
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

const { Title, Text } = Typography;
const { Content } = Layout;
const { Option } = Select;

type PostList = RouterOutputs["post"]["getAll"]["items"][0];

export default function BrowsePosts() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>("latest");
  const [pageSize] = useState(10);
  const [isOfficialOnly, setIsOfficialOnly] = useState(false);

  // Get the official parameter from URL and set state
  useEffect(() => {
    const officialParam = searchParams.get("official");
    setIsOfficialOnly(officialParam === "true");
  }, [searchParams]);

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
      isOfficial: isOfficialOnly ? true : undefined,
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

  // Update filter handling
  const handleOfficialFilter = (showOfficial: boolean) => {
    setIsOfficialOnly(showOfficial);
    // Update URL
    if (showOfficial) {
      router.push("/posts?official=true");
    } else {
      router.push("/posts");
    }
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
          <Text type="secondary" className="text-sm prose prose-sm max-w-none">
            {/* Use rehypeRaw to parse HTML in the excerpt */}
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
              components={{
                p: ({children}) => <span>{children}</span>,
                strong: ({children}) => <span className="font-bold">{children}</span>,
                em: ({children}) => <span className="italic">{children}</span>,
                code: ({children}) => <code className="bg-gray-100 rounded px-1">{children}</code>,
                // Allow underline tags to be rendered properly
                u: ({children}) => <span className="underline">{children}</span>
              }}
            >
              {post.excerpt}
            </ReactMarkdown>
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
            <Title level={2}>
              {isOfficialOnly ? "Official Articles" : "Browse Articles"}
            </Title>
            <Text type="secondary" className="text-lg">
              {isOfficialOnly 
                ? "Official announcements and important updates" 
                : "Discover the latest articles and insights"}
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
                    <Space>
                      <Select
                        value={sortBy}
                        style={{ width: 120 }}
                        onChange={setSortBy}
                      >
                        <Option value="latest">Latest</Option>
                        <Option value="popular">Popular</Option>
                        <Option value="official">Official</Option>
                      </Select>
                      <Button
                        type={isOfficialOnly ? "primary" : "default"}
                        icon={<CrownOutlined />}
                        onClick={() => handleOfficialFilter(!isOfficialOnly)}
                      >
                        Official Only
                      </Button>
                    </Space>
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
}