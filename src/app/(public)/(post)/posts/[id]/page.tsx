"use client";
import { useState } from "react";
import type { RouterOutputs } from "~/trpc/react";
import { api } from "~/trpc/react";
import { Typography, Layout, Space, Tag, Avatar, Row, Col, Card } from "antd";
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

const { Title, Text, Paragraph } = Typography;
const { Content } = Layout;

type Post = RouterOutputs["post"]["getById"];

// Placeholder data
const mockPost = {
  title: "Implementing MQTT Protocol in IoT Devices: A Comprehensive Guide",
  author: {
    name: "John Doe",
    avatar: null,
    role: "IoT Developer",
  },
  publishedAt: "2024-01-08",
  tags: ["MQTT", "IoT", "Protocol", "Tutorial", "Advanced"],
  content: `
# Introduction

MQTT (Message Queuing Telemetry Transport) is a lightweight messaging protocol designed for constrained devices and low-bandwidth, high-latency networks. In this comprehensive guide, we'll explore how to implement MQTT in IoT devices effectively.

## Why MQTT?

MQTT offers several advantages for IoT applications:

* Low overhead and efficient data distribution
* Support for unreliable networks
* Real-time messaging capabilities
* Scalable architecture

## Implementation Steps

1. First, set up your MQTT broker
2. Configure your client settings
3. Implement the connection logic
4. Handle message publishing and subscribing

\`\`\`python
import paho.mqtt.client as mqtt

def on_connect(client, userdata, flags, rc):
    print("Connected with result code "+str(rc))
    client.subscribe("iot/sensors/#")

def on_message(client, userdata, msg):
    print(msg.topic+" "+str(msg.payload))

client = mqtt.Client()
client.on_connect = on_connect
client.on_message = on_message

client.connect("mqtt.eclipse.org", 1883, 60)
client.loop_forever()
\`\`\`

## Best Practices

When implementing MQTT in your IoT devices, consider these best practices:

1. **Security First**: Always use TLS/SSL for secure communication
2. **Topic Design**: Create a logical and scalable topic hierarchy
3. **QoS Levels**: Choose appropriate Quality of Service levels
4. **Error Handling**: Implement robust error handling and reconnection logic

## Conclusion

MQTT is a powerful protocol for IoT communications when implemented correctly. By following these guidelines, you can create reliable and efficient IoT systems.
`,
  stats: {
    views: 1234,
    likes: 89,
    comments: 23,
  },
  relatedPosts: [
    {
      title: "Understanding IoT Protocols: MQTT vs CoAP",
      tags: ["IoT", "Protocols", "Comparison"],
    },
    {
      title: "Security Best Practices in IoT Communications",
      tags: ["Security", "IoT", "Best Practices"],
    },
  ],
};

const PostDetails: React.FC = () => {
  return (
    <Layout className="min-h-screen bg-white">
      <Content className="px-4 py-8 md:px-6">
        <Row gutter={[32, 32]} justify="center">
          {/* Main Content */}
          <Col xs={24} lg={16}>
            {/* Article Header */}
            <div className="mb-8">
              <Title className="mb-6 text-[32px] leading-tight">
                {mockPost.title}
              </Title>

              <Space className="mb-6" size={24}>
                <Space>
                  <Avatar size={40} icon={<UserOutlined />} />
                  <Space direction="vertical" size={0}>
                    <Text strong className="text-lg">
                      {mockPost.author.name}
                    </Text>
                    <Text type="secondary">{mockPost.author.role}</Text>
                  </Space>
                </Space>

                <Space>
                  <ClockCircleOutlined className="text-gray-400" />
                  <Text type="secondary">{mockPost.publishedAt}</Text>
                </Space>
              </Space>

              <Space wrap className="mb-6">
                {mockPost.tags.map((tag) => (
                  <Tag
                    key={tag}
                    className="rounded-full border-blue-100 bg-blue-50 px-3 py-1 text-blue-600"
                  >
                    {tag}
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
                        {mockPost.stats.views.toLocaleString()}
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
                        {mockPost.stats.likes}
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
                        {mockPost.stats.comments}
                      </div>
                      <div className="text-sm text-gray-500">Comments</div>
                    </div>
                  </Space>
                </Col>
              </Row>
            </div>

            {/* Article Content */}
            <article className="prose prose-lg prose-headings:font-normal prose-h1:text-2xl prose-h1:text-gray-800 prose-h1:mt-8 prose-h1:mb-4 prose-h2:text-xl prose-h2:text-gray-700 prose-h2:mt-6 prose-h2:mb-4 max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1({ node, children, ...props }) {
                    return (
                      <h1
                        className="mb-4 mt-8 text-2xl font-normal text-gray-800"
                        {...props}
                      >
                        {children}
                      </h1>
                    );
                  },
                  h2({ node, children, ...props }) {
                    return (
                      <h2
                        className="mb-4 mt-6 text-xl font-normal text-gray-700"
                        {...props}
                      >
                        {children}
                      </h2>
                    );
                  },
                  code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || "");
                    return !inline && match ? (
                      <SyntaxHighlighter
                        style={vscDarkPlus}
                        language={match[1]}
                        PreTag="div"
                        {...props}
                      >
                        {String(children).replace(/\n$/, "")}
                      </SyntaxHighlighter>
                    ) : (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {mockPost.content}
              </ReactMarkdown>
            </article>
          </Col>

          {/* Sidebar */}
          <Col xs={24} lg={6}>
            <div className="sticky top-8">
              {/* Related Posts */}
              <Card className="mb-6">
                <Title level={4} className="mb-4">
                  Related Posts
                </Title>
                <Space direction="vertical" className="w-full" size={16}>
                  {mockPost.relatedPosts.map((post, index) => (
                    <div
                      key={index}
                      className="border-b pb-4 last:border-b-0 last:pb-0"
                    >
                      <Text
                        strong
                        className="mb-2 block cursor-pointer hover:text-blue-600"
                      >
                        {post.title}
                      </Text>
                      <Space wrap>
                        {post.tags.map((tag) => (
                          <Tag
                            key={tag}
                            className="rounded-full border-gray-100 bg-gray-50 px-2 py-0.5 text-gray-600"
                          >
                            {tag}
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
