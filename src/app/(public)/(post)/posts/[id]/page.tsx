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
  Badge,
  Button,
  Affix,
  Divider,
  Tooltip,
} from "antd";
import {
  UserOutlined,
  ClockCircleOutlined,
  EyeOutlined,
  LikeOutlined,
  MessageOutlined,
  CrownOutlined,
  ShareAltOutlined,
  BookOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import type { CSSProperties } from "react";
import type { Components } from "react-markdown";
import type { DetailedHTMLProps, HTMLAttributes, AnchorHTMLAttributes, ImgHTMLAttributes } from "react";
import Link from "next/link";

const { Title, Text, Paragraph } = Typography;
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
    <h1 className="mb-6 mt-10 text-3xl font-semibold text-gray-800" {...props}>
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
    <h2 className="mb-5 mt-8 text-2xl font-medium text-gray-700" {...props}>
      {children}
    </h2>
  ),
  h3: ({
    children,
    ...props
  }: DetailedHTMLProps<
    HTMLAttributes<HTMLHeadingElement>,
    HTMLHeadingElement
  >) => (
    <h3 className="mb-4 mt-6 text-xl font-medium text-gray-700" {...props}>
      {children}
    </h3>
  ),
  p: ({
    children,
    ...props
  }: DetailedHTMLProps<
    HTMLAttributes<HTMLParagraphElement>,
    HTMLParagraphElement
  >) => (
    <p className="mb-4 leading-relaxed text-gray-700" {...props}>
      {children}
    </p>
  ),
  ul: ({
    children,
    ...props
  }: DetailedHTMLProps<
    HTMLAttributes<HTMLUListElement>,
    HTMLUListElement
  >) => (
    <ul className="mb-6 ml-6 list-disc space-y-2 text-gray-700" {...props}>
      {children}
    </ul>
  ),
  ol: ({
    children,
    ...props
  }: DetailedHTMLProps<
    HTMLAttributes<HTMLOListElement>,
    HTMLOListElement
  >) => (
    <ol className="mb-6 ml-6 list-decimal space-y-2 text-gray-700" {...props}>
      {children}
    </ol>
  ),
  li: ({
    children,
    ...props
  }: DetailedHTMLProps<HTMLAttributes<HTMLLIElement>, HTMLLIElement>) => (
    <li className="pl-2" {...props}>
      {children}
    </li>
  ),
  blockquote: ({
    children,
    ...props
  }: DetailedHTMLProps<
    HTMLAttributes<HTMLQuoteElement>,
    HTMLQuoteElement
  >) => (
    <blockquote
      className="mb-6 border-l-4 border-green-500 bg-gray-50 p-4 text-gray-700 italic"
      {...props}
    >
      {children}
    </blockquote>
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
        <div className="mb-6 mt-4 overflow-hidden rounded-lg shadow-md">
          <div className="bg-gray-800 px-4 py-2 text-xs text-gray-200">
            {match[1]?.toUpperCase() ?? "CODE"}
          </div>
          <SyntaxHighlighter
            style={vscDarkPlus as SyntaxHighlighterStyle}
            language={match[1]}
            PreTag="div"
            className="rounded-b-lg"
          >
            {String(children).replace(/\n$/, "")}
          </SyntaxHighlighter>
        </div>
      );
    }
    return (
      <code
        className={`${
          inline
            ? "rounded bg-gray-100 px-1 py-0.5 font-mono text-sm text-green-600"
            : "block overflow-auto rounded bg-gray-100 p-4 font-mono text-sm"
        }`}
        {...props}
      >
        {children}
      </code>
    );
  },
  a: ({
    children,
    href,
    ...props
  }: DetailedHTMLProps<
    AnchorHTMLAttributes<HTMLAnchorElement>,
    HTMLAnchorElement
  >) => (
    <a
      href={href}
      className="text-blue-600 hover:text-blue-800 hover:underline"
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    >
      {children}
    </a>
  ),
  img: ({
    src,
    alt,
    ...props
  }: DetailedHTMLProps<
    ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
  >) => (
    <img
      src={src}
      alt={alt}
      className="mx-auto my-6 max-h-96 max-w-full rounded shadow-md"
      {...props}
    />
  ),
  table: ({
    children,
    ...props
  }: DetailedHTMLProps<
    HTMLAttributes<HTMLTableElement>,
    HTMLTableElement
  >) => (
    <div className="mb-6 overflow-x-auto">
      <table
        className="w-full border-collapse rounded-lg border border-gray-200"
        {...props}
      >
        {children}
      </table>
    </div>
  ),
  th: ({
    children,
    ...props
  }: DetailedHTMLProps<
    HTMLAttributes<HTMLTableHeaderCellElement>,
    HTMLTableHeaderCellElement
  >) => (
    <th
      className="border border-gray-200 bg-gray-50 px-4 py-2 text-left font-medium"
      {...props}
    >
      {children}
    </th>
  ),
  td: ({
    children,
    ...props
  }: DetailedHTMLProps<
    HTMLAttributes<HTMLTableCellElement>,
    HTMLTableCellElement
  >) => (
    <td className="border border-gray-200 px-4 py-2" {...props}>
      {children}
    </td>
  ),
  hr: () => <hr className="my-8 border-t border-gray-200" />,
  
  // Thêm component u với kiểu dữ liệu chính xác
  u: ({
    children,
    ...props
  }: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>) => (
    <u className="underline" {...props}>
      {children}
    </u>
  ),
  
  // Thêm components khác với kiểu dữ liệu chính xác
  strong: ({
    children,
    ...props
  }: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>) => (
    <strong className="font-bold" {...props}>
      {children}
    </strong>
  ),
  
  em: ({
    children,
    ...props
  }: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>) => (
    <em className="italic" {...props}>
      {children}
    </em>
  ),
  
  // Sửa kiểu dữ liệu cho del (HTMLModElement thay vì HTMLElement)
  del: ({
    children,
    ...props
  }: DetailedHTMLProps<HTMLAttributes<HTMLModElement>, HTMLModElement>) => (
    <del className="line-through" {...props}>
      {children}
    </del>
  ),
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

  const renderOfficialPostBanner = () => {
    if (!post.isOfficial) return null;

    return (
      <div className="mb-8 overflow-hidden rounded-lg bg-gradient-to-r from-yellow-50 to-yellow-100 shadow-md">
        <div className="flex items-center border-b border-yellow-200 bg-yellow-500/10 px-6 py-3">
          <CrownOutlined className="mr-2 text-xl text-yellow-500" />
          <Text strong className="text-lg text-yellow-700">
            Official Platform Announcement
          </Text>
        </div>
        <div className="px-6 py-4">
          <Paragraph className="mb-0 text-yellow-700">
            This is an official announcement from the Zelene Platform team. These posts contain important information about platform updates, features, and policies.
          </Paragraph>
        </div>
      </div>
    );
  };

  return (
    <Layout className={`min-h-screen ${post.isOfficial ? 'bg-yellow-50/20' : 'bg-white'}`}>
      <Content className="px-4 py-8 md:px-6 lg:py-12">
        <Row gutter={[32, 32]} justify="center">
          {/* Main Content */}
          <Col xs={24} md={20} lg={16} xl={14}>
            {/* Official Banner */}
            {renderOfficialPostBanner()}

            {/* Article Header */}
            <Card 
              bordered={false} 
              className={`mb-8 overflow-hidden ${post.isOfficial ? 'border-l-4 border-l-yellow-400 shadow-md' : 'shadow'}`}
            >
              <div className="mb-6">
                {post.isOfficial && (
                  <div className="mb-4 flex items-center">
                    <Badge 
                      status="processing" 
                      color="gold" 
                      text={
                        <Text className="text-yellow-700 font-medium">
                          Official Post
                        </Text>
                      }
                    />
                  </div>
                )}

                <Title 
                  level={1} 
                  className={`mb-6 ${post.isOfficial ? 'text-yellow-800' : 'text-gray-800'}`}
                >
                  {post.title}
                </Title>

                <Row align="middle" gutter={[16, 16]}>
                  <Col>
                    <Space size="middle">
                      <Avatar
                        size={48}
                        src={post.createdBy.image}
                        icon={<UserOutlined />}
                        className={post.isOfficial ? 'border-2 border-yellow-400' : ''}
                      />
                      <Space direction="vertical" size={0}>
                        <Text strong className="text-lg">
                          {post.createdBy.name}
                        </Text>
                        <Text type="secondary" className="text-sm">
                          {post.isOfficial ? 'Official Contributor' : 'Member'}
                        </Text>
                      </Space>
                    </Space>
                  </Col>
                  <Col>
                    <Divider type="vertical" style={{ height: '32px' }} />
                  </Col>
                  <Col>
                    <Space>
                      <ClockCircleOutlined className="text-gray-400" />
                      <Text type="secondary">
                        {new Date(post.publishedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </Text>
                    </Space>
                  </Col>
                </Row>
              </div>

              <Divider />

              <div className="mb-4 flex flex-wrap gap-2">
                {post.tags.map((tagOnPost) => (
                  <Tag
                    key={tagOnPost.tag.id}
                    className={`rounded-full px-3 py-1.5 text-sm ${
                      tagOnPost.tag.isOfficial
                        ? 'border-yellow-400 bg-yellow-50 text-yellow-700'
                        : 'border-blue-100 bg-blue-50 text-blue-600'
                    }`}
                  >
                    {tagOnPost.tag.isOfficial && <CrownOutlined className="mr-1" />}
                    {tagOnPost.tag.name}
                  </Tag>
                ))}
              </div>
            </Card>

            {/* Article Content */}
            <Card 
              bordered={false} 
              className={`mb-8 ${post.isOfficial ? 'shadow-md' : 'shadow'}`}
              bodyStyle={{ padding: '32px' }}
            >
              <article className="prose prose-lg max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]} // Để xử lý HTML
                  components={MarkdownComponents}
                >
                  {post.content}
                </ReactMarkdown>
              </article>
            </Card>

            {/* Post Stats and Actions */}
            <Card bordered={false} className="mb-8 shadow">
              <Row gutter={24} align="middle" justify="space-between">
                <Col>
                  <Space size="large">
                    <Space>
                      <EyeOutlined className="text-gray-400" />
                      <Text className="font-medium">
                        {post.viewCount.toLocaleString()} Views
                      </Text>
                    </Space>
                    <Space>
                      <LikeOutlined className="text-gray-400" />
                      <Text className="font-medium">
                        {post.likeCount} Likes
                      </Text>
                    </Space>
                    <Space>
                      <MessageOutlined className="text-gray-400" />
                      <Text className="font-medium">
                        {post.commentCount} Comments
                      </Text>
                    </Space>
                  </Space>
                </Col>
                <Col>
                  <Space>
                    <Button icon={<ShareAltOutlined />}>Share</Button>
                    <Button icon={<BookOutlined />}>Save</Button>
                  </Space>
                </Col>
              </Row>
            </Card>
          </Col>

          {/* Sidebar */}
          <Col xs={24} md={20} lg={8} xl={6}>
            <Affix offsetTop={20}>
              <div className="space-y-6">
                {/* About Author Card */}
                <Card 
                  bordered={false} 
                  className="shadow"
                  title={
                    <Space>
                      <UserOutlined />
                      <span>About the Author</span>
                    </Space>
                  }
                >
                  <div className="flex items-center gap-4">
                    <Avatar 
                      size={64} 
                      src={post.createdBy.image} 
                      icon={<UserOutlined />}
                      className={post.isOfficial ? 'border-2 border-yellow-400' : ''}
                    />
                    <div>
                      <Text strong className="block text-lg">
                        {post.createdBy.name}
                      </Text>
                      <Text type="secondary" className="block">
                        {post.isOfficial ? 'Official Contributor' : 'Member'}
                      </Text>
                      <Button type="link" size="small" className="p-0">
                        View Profile
                      </Button>
                    </div>
                  </div>
                </Card>

                {/* Related Posts */}
                <Card 
                  bordered={false} 
                  className="shadow"
                  title={
                    <Space>
                      <BookOutlined />
                      <span>Related Posts</span>
                    </Space>
                  }
                >
                  <Space direction="vertical" className="w-full" size={16}>
                    {post.relatedTo.length > 0 ? (
                      post.relatedTo.map((relation) => (
                        <div
                          key={relation.relatedPost.id}
                          className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0"
                        >
                          <Link href={`/posts/${relation.relatedPost.id}`}>
                            <Text
                              strong
                              className="mb-2 block hover:text-blue-600"
                            >
                              {relation.relatedPost.title}
                            </Text>
                          </Link>
                          <Space wrap>
                            {relation.relatedPost.tags.slice(0, 3).map((tagOnPost) => (
                              <Tag
                                key={tagOnPost.tag.id}
                                className={`rounded-full px-2 py-0.5 ${
                                  tagOnPost.tag.isOfficial
                                    ? 'border-yellow-400 bg-yellow-50 text-yellow-600'
                                    : 'border-gray-100 bg-gray-50 text-gray-600'
                                }`}
                              >
                                {tagOnPost.tag.isOfficial && <CrownOutlined className="mr-1" />}
                                {tagOnPost.tag.name}
                              </Tag>
                            ))}
                            {relation.relatedPost.tags.length > 3 && (
                              <Text type="secondary" className="text-xs">
                                +{relation.relatedPost.tags.length - 3} more
                              </Text>
                            )}
                          </Space>
                        </div>
                      ))
                    ) : (
                      <Text type="secondary" italic>
                        No related posts available
                      </Text>
                    )}
                  </Space>
                </Card>

                {/* Call to Action Card */}
                <Card 
                  bordered={false}
                  className={post.isOfficial ? 'bg-gradient-to-br from-yellow-50 to-yellow-100 shadow-md' : 'bg-blue-50 shadow'}
                >
                  <Space direction="vertical" size="middle" className="w-full">
                    <Title level={4} className={post.isOfficial ? 'text-yellow-800' : 'text-blue-800'}>
                      {post.isOfficial
                        ? "Stay Updated with Zelene"
                        : "Join the Discussion"}
                    </Title>
                    <Paragraph className={post.isOfficial ? 'text-yellow-700' : 'text-blue-700'}>
                      {post.isOfficial
                        ? "Get the latest updates and announcements about Zelene Platform features and capabilities."
                        : "Share your thoughts and connect with other community members."}
                    </Paragraph>
                    <Button 
                      type="primary" 
                      block
                      icon={post.isOfficial ? <CheckCircleOutlined /> : <MessageOutlined />}
                      style={{
                        backgroundColor: post.isOfficial ? '#d97706' : '#1890ff',
                      }}
                    >
                      {post.isOfficial ? "Subscribe to Updates" : "Comment on Post"}
                    </Button>
                  </Space>
                </Card>
              </div>
            </Affix>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default PostDetails;