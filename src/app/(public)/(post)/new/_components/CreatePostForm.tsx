"use client";

import { type FC } from "react";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { usePostStore } from "~/store/usePostStore";
import {
  Card,
  Input,
  Tag,
  Button,
  Space,
  Typography,
  Layout,
  Tooltip,
  Divider,
  Select,
  message,
} from "antd";
import {
  BoldOutlined,
  ItalicOutlined,
  UnderlineOutlined,
  OrderedListOutlined,
  UnorderedListOutlined,
  LinkOutlined,
  PictureOutlined,
  CodeOutlined,
  QuestionCircleOutlined,
  EyeOutlined,
  EditOutlined,
} from "@ant-design/icons";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";
import type { DetailedHTMLProps, HTMLAttributes } from "react";

const { Title, Text } = Typography;
const { Content, Sider } = Layout;
const { TextArea } = Input;

interface EditorCommand {
  prefix: string;
  suffix: string;
  placeholder?: string;
}

interface ToolbarButtonProps {
  icon: React.ReactNode;
  tooltip: string;
  command: EditorCommand;
  onExecute: (command: EditorCommand) => void;
}

const suggestions = {
  title: {
    title: "Writing an Effective Title",
    content:
      "A good post title should be clear, specific, and include relevant keywords. Consider starting with action words or numbers.",
  },
  tags: {
    title: "Choosing Relevant Tags",
    content:
      "Tags help others find your content. Include technical specifications, application areas, and skill levels.",
  },
  content: {
    title: "Structuring Your Content",
    content:
      "Start with a brief introduction explaining the problem or goal. Use headers to organize sections. Include code snippets, diagrams, or images where relevant.",
  },
};

const ToolbarButton: FC<ToolbarButtonProps> = ({
  icon,
  tooltip,
  command,
  onExecute,
}) => (
  <Tooltip title={tooltip}>
    <Button
      icon={icon}
      onClick={() => onExecute(command)}
      className="border-none"
    />
  </Tooltip>
);

const MarkdownComponents: Components = {
  code({
    inline,
    className,
    children,
    ...props
  }: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & {
    inline?: boolean;
  }) {
    const match = /language-(\w+)/.exec(className ?? "");
    return !inline && match ? (
      <SyntaxHighlighter style={vscDarkPlus} language={match[1]} PreTag="div">
        {String(children).replace(/\n$/, "")}
      </SyntaxHighlighter>
    ) : (
      <code className={className} {...props}>
        {children}
      </code>
    );
  },
};

export const CreatePostForm: FC = () => {
  const router = useRouter();
  const store = usePostStore();

  const createPost = api.post.create.useMutation({
    onSuccess: () => {
      message.success("Post created successfully!");
      store.reset();
      router.push("/posts");
    },
    onError: (error) => {
      message.error(error.message);
    },
  });

  const executeCommand = (command: EditorCommand) => {
    const { prefix, suffix, placeholder = "text" } = command;
    const { selectionStart: start, selectionEnd: end } = store;

    const beforeSelection = store.content.substring(0, start);
    const selection = store.content.substring(start, end) || placeholder;
    const afterSelection = store.content.substring(end);

    store.setContent(
      `${beforeSelection}${prefix}${selection}${suffix}${afterSelection}`,
    );
  };

  const headerOptions = [
    { value: "# ", label: "Heading 1" },
    { value: "## ", label: "Heading 2" },
    { value: "### ", label: "Heading 3" },
  ];

  const toolbarCommands = [
    {
      icon: <BoldOutlined />,
      tooltip: "Bold (Ctrl+B)",
      command: { prefix: "**", suffix: "**" },
    },
    {
      icon: <ItalicOutlined />,
      tooltip: "Italic (Ctrl+I)",
      command: { prefix: "_", suffix: "_" },
    },
    {
      icon: <UnderlineOutlined />,
      tooltip: "Underline",
      command: { prefix: "<u>", suffix: "</u>" },
    },
    {
      icon: <OrderedListOutlined />,
      tooltip: "Numbered List",
      command: { prefix: "1. ", suffix: "\n" },
    },
    {
      icon: <UnorderedListOutlined />,
      tooltip: "Bullet List",
      command: { prefix: "* ", suffix: "\n" },
    },
    {
      icon: <LinkOutlined />,
      tooltip: "Insert Link",
      command: { prefix: "[", suffix: "](url)", placeholder: "link text" },
    },
    {
      icon: <PictureOutlined />,
      tooltip: "Insert Image",
      command: { prefix: "![", suffix: "](url)", placeholder: "image alt" },
    },
    {
      icon: <CodeOutlined />,
      tooltip: "Code Block",
      command: { prefix: "```\n", suffix: "\n```" },
    },
  ];

  const handlePublish = () => {
    if (!store.title || !store.content) {
      message.error("Please fill in all required fields");
      return;
    }

    createPost.mutate({
      title: store.title,
      content: store.content,
      excerpt: store.content.slice(0, 200) + "...",
      tags: [], // Convert string tags to IDs based on your schema
    });
  };

  return (
    <Layout className="min-h-screen">
      <Content className="p-6">
        <div className="mx-auto max-w-4xl">
          <div className="mb-6 flex items-center justify-between">
            <Title level={2}>Create New Post</Title>
            <Button
              icon={store.isPreview ? <EditOutlined /> : <EyeOutlined />}
              onClick={store.togglePreview}
            >
              {store.isPreview ? "Edit" : "Preview"}
            </Button>
          </div>

          {store.isPreview ? (
            <Card>
              <article className="prose prose-lg max-w-none">
                <Title>{store.title}</Title>
                <Space wrap className="mb-6">
                  {store.tags.map((tag) => (
                    <Tag
                      key={tag}
                      className="rounded-full border-blue-100 bg-blue-50 px-3 py-1 text-blue-600"
                    >
                      {tag}
                    </Tag>
                  ))}
                </Space>
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={MarkdownComponents}
                >
                  {store.content}
                </ReactMarkdown>
              </article>
            </Card>
          ) : (
            <>
              <div className="mb-6">
                <Input
                  placeholder="Enter post title"
                  size="large"
                  value={store.title}
                  onChange={(e) => store.setTitle(e.target.value)}
                  onFocus={() => store.setActiveSuggestion("title")}
                  className="mb-4"
                />
              </div>

              <div className="mb-6">
                <Space className="w-full" direction="vertical">
                  <Input
                    placeholder="Add tags"
                    value={store.currentTag}
                    onChange={(e) => store.setCurrentTag(e.target.value)}
                    onPressEnter={() =>
                      store.currentTag && store.addTag(store.currentTag)
                    }
                    onFocus={() => store.setActiveSuggestion("tags")}
                  />
                  <div className="mt-2">
                    {store.tags.map((tag) => (
                      <Tag
                        key={tag}
                        closable
                        onClose={() => store.removeTag(tag)}
                        className="mb-2 mr-2"
                      >
                        {tag}
                      </Tag>
                    ))}
                  </div>
                </Space>
              </div>

              <Card
                className="mb-6"
                onFocus={() => store.setActiveSuggestion("content")}
              >
                <div className="mb-3 border-b pb-3">
                  <Space>
                    <Select
                      options={headerOptions}
                      placeholder="Heading"
                      style={{ width: 120 }}
                      onChange={(value: string) =>
                        executeCommand({ prefix: value, suffix: " " })
                      }
                    />
                    <Divider type="vertical" />
                    {toolbarCommands.map((cmd, index) => (
                      <ToolbarButton
                        key={index}
                        icon={cmd.icon}
                        tooltip={cmd.tooltip}
                        command={cmd.command}
                        onExecute={executeCommand}
                      />
                    ))}
                    <Divider type="vertical" />
                    <Tooltip title="Formatting Help">
                      <Button
                        icon={<QuestionCircleOutlined />}
                        className="border-none"
                      />
                    </Tooltip>
                  </Space>
                </div>
                <TextArea
                  value={store.content}
                  onChange={(e) => store.setContent(e.target.value)}
                  onSelect={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    store.setSelectionRange(
                      target.selectionStart,
                      target.selectionEnd,
                    );
                  }}
                  placeholder="Write your post content here..."
                  autoSize={{ minRows: 15 }}
                  className="border-none focus:shadow-none"
                />
              </Card>

              <Space>
                <Button
                  type="primary"
                  size="large"
                  onClick={handlePublish}
                  loading={createPost.isPending}
                >
                  Publish Post
                </Button>
                <Button size="large" onClick={store.reset}>
                  Reset
                </Button>
              </Space>
            </>
          )}
        </div>
      </Content>

      <Sider width={300} style={{ background: "#fff" }} className="p-4">
        {store.activeSuggestion && (
          <Card>
            <Title level={4}>{suggestions[store.activeSuggestion].title}</Title>
            <Text>{suggestions[store.activeSuggestion].content}</Text>
          </Card>
        )}
      </Sider>
    </Layout>
  );
};
