//(public) / (post) / posts / [id] / page.tsx

"use client";

import { type FC } from "react";
import { useParams } from "next/navigation";
import type { RouterOutputs } from "~/trpc/react";
import { api } from "~/trpc/react";
import {
  Typography,
  Layout,
  Space,
  Tag,
  Avatar,
  Row,
  Col,
  Card,
  Spin,
  Alert,
} from "antd";
import {
  UserOutlined,
  ClockCircleOutlined,
  EyeOutlined,
  LikeOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";
import remarkGfm from "remark-gfm";
import type { CSSProperties } from "react";
import type { Components } from "react-markdown";
import type { DetailedHTMLProps, HTMLAttributes } from "react";

const { Title, Text } = Typography;
const { Content } = Layout;

type SyntaxHighlighterStyle = Record<string, CSSProperties>;
type PostOutput = RouterOutputs["post"]["getById"];

const MarkdownComponents: Components = {
  h1: ({
    children,
    ...props
  }: DetailedHTMLProps<
    HTMLAttributes<HTMLHeadingElement>,
    HTMLHeadingElement
  >) => (
    <h1 className="mb-4 mt-8 text-2xl font-normal text-gray-800" {...props}>
      {children}
    </h1>
  ),
  h2: ({
    children,
    ...props
  }: DetailedHTMLProps<
    HTMLAttributes<HTMLHeadingElement>,
    HTMLHeadingElement
  >) => (
    <h2 className="mb-4 mt-6 text-xl font-normal text-gray-700" {...props}>
      {children}
    </h2>
  ),
  code: ({
    inline,
    className,
    children,
    ...props
  }: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & {
    inline?: boolean;
  }) => {
    const match = /language-(\w+)/.exec(className ?? "");
    if (!inline && match) {
      return (
        <SyntaxHighlighter
          style={vscDarkPlus as SyntaxHighlighterStyle}
          language={match[1]}
          PreTag="div"
        >
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
      );
    }
    return (
      <code className={className} {...props}>
        {children}
      </code>
    );
  },
};

const PostDetails: FC = () => {
  const params = useParams();
  const postId = Number(params.id);

  const {
    data: post,
    isLoading,
    error,
  } = api.post.getById.useQuery(
    { id: postId },
    {
      enabled: !isNaN(postId),
      retry: false,
    },
  );

  if (isLoading) {
    return (
      <Layout className="min-h-screen bg-white">
        <Content className="flex items-center justify-center px-4 py-8 md:px-6">
          <Spin size="large" />
        </Content>
      </Layout>
    );
  }

  if (error || !post) {
    return (
      <Layout className="min-h-screen bg-white">
        <Content className="px-4 py-8 md:px-6">
          <Alert
            message="Error"
            description={error?.message ?? "Post not found"}
            type="error"
            showIcon
          />
        </Content>
      </Layout>
    );
  }

  return (
    <Layout className="min-h-screen bg-white">
      <Content className="px-4 py-8 md:px-6">
        <Row gutter={[32, 32]} justify="center">
          {/* Main Content */}
          <Col xs={24} lg={16}>
            {/* Article Header */}
            <div className="mb-8">
              <Title className="mb-6 text-[32px] leading-tight">
                {post.title}
              </Title>

              <Space className="mb-6" size={24}>
                <Space>
                  <Avatar
                    size={40}
                    src={post.createdBy.image}
                    icon={<UserOutlined />}
                  />
                  <Space direction="vertical" size={0}>
                    <Text strong className="text-lg">
                      {post.createdBy.name}
                    </Text>
                  </Space>
                </Space>

                <Space>
                  <ClockCircleOutlined className="text-gray-400" />
                  <Text type="secondary">
                    {new Date(post.publishedAt).toLocaleDateString()}
                  </Text>
                </Space>
              </Space>

              <Space wrap className="mb-6">
                {post.tags.map((tagOnPost) => (
                  <Tag
                    key={tagOnPost.tag.id}
                    className="rounded-full border-blue-100 bg-blue-50 px-3 py-1 text-blue-600"
                  >
                    {tagOnPost.tag.name}
                  </Tag>
                ))}
              </Space>

              {/* Post Stats */}
              <Row gutter={48} className="border-b border-t py-4">
                <Col span={8}>
                  <Space>
                    <EyeOutlined className="text-gray-400" />
                    <div>
                      <div className="font-medium text-gray-900">
                        {post.viewCount.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500">Views</div>
                    </div>
                  </Space>
                </Col>
                <Col span={8}>
                  <Space>
                    <LikeOutlined className="text-gray-400" />
                    <div>
                      <div className="font-medium text-gray-900">
                        {post.likeCount}
                      </div>
                      <div className="text-sm text-gray-500">Likes</div>
                    </div>
                  </Space>
                </Col>
                <Col span={8}>
                  <Space>
                    <MessageOutlined className="text-gray-400" />
                    <div>
                      <div className="font-medium text-gray-900">
                        {post.commentCount}
                      </div>
                      <div className="text-sm text-gray-500">Comments</div>
                    </div>
                  </Space>
                </Col>
              </Row>
            </div>

            {/* Article Content */}
            <article className="prose prose-lg prose-headings:font-normal prose-h1:mb-4 prose-h1:mt-8 prose-h1:text-2xl prose-h1:text-gray-800 prose-h2:mb-4 prose-h2:mt-6 prose-h2:text-xl prose-h2:text-gray-700 max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={MarkdownComponents}
              >
                {post.content}
              </ReactMarkdown>
            </article>
          </Col>

          {/* Sidebar */}
          <Col xs={24} lg={6}>
            <div className="sticky top-8">
              <Card className="mb-6">
                <Title level={4} className="mb-4">
                  Related Posts
                </Title>
                <Space direction="vertical" className="w-full" size={16}>
                  {post.relatedTo.map((relation) => (
                    <div
                      key={relation.relatedPost.id}
                      className="border-b pb-4 last:border-b-0 last:pb-0"
                    >
                      <Text
                        strong
                        className="mb-2 block cursor-pointer hover:text-blue-600"
                      >
                        {relation.relatedPost.title}
                      </Text>
                      <Space wrap>
                        {relation.relatedPost.tags.map((tagOnPost) => (
                          <Tag
                            key={tagOnPost.tag.id}
                            className="rounded-full border-gray-100 bg-gray-50 px-2 py-0.5 text-gray-600"
                          >
                            {tagOnPost.tag.name}
                          </Tag>
                        ))}
                      </Space>
                    </div>
                  ))}
                </Space>
              </Card>
            </div>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default PostDetails;
