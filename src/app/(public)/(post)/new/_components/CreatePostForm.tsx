"use client";

import { type FC } from "react";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { usePostStore } from "~/store/usePostStore";
import {
  Card,
  Input,
  Button,
  Space,
  Typography,
  Layout,
  Tooltip,
  Divider,
  Select,
  message,
  Tag,
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
import rehypeRaw from "rehype-raw";
import type { Components } from "react-markdown";
import type { DetailedHTMLProps, HTMLAttributes } from "react";
import { TagInput } from "./TagInput";
import { useSession } from "next-auth/react";

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
      "Tags help others find your content. Start with # to add tags. Admins can create official tags by including 'official' in the tag name.",
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

// Đã cải thiện các MarkdownComponents để xử lý đúng các thẻ Markdown
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
  p: ({children}) => <p className="mb-4">{children}</p>,
  // Đảm bảo cấu hình đúng cho thẻ strong
  strong: ({children}) => <strong className="font-bold">{children}</strong>,
  em: ({children}) => <em className="italic">{children}</em>,
  del: ({children}) => <del className="line-through">{children}</del>,
  u: ({children}) => <u className="underline">{children}</u>,
  // Thêm các thẻ header để đảm bảo định dạng đúng
  h1: ({children}) => <h1 className="mb-4 mt-6 text-2xl font-bold">{children}</h1>,
  h2: ({children}) => <h2 className="mb-3 mt-5 text-xl font-bold">{children}</h2>,
  h3: ({children}) => <h3 className="mb-2 mt-4 text-lg font-bold">{children}</h3>,
  // Thêm cấu hình cho danh sách
  ul: ({children}) => <ul className="mb-4 ml-6 list-disc">{children}</ul>,
  ol: ({children}) => <ol className="mb-4 ml-6 list-decimal">{children}</ol>,
  li: ({children}) => <li className="mb-1">{children}</li>,
};

export const CreatePostForm: FC = () => {
  const router = useRouter();
  const store = usePostStore();
  const { data: session } = useSession();

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
    const textArea = document.querySelector('textarea');
    if (!textArea) return;

    const start = textArea.selectionStart;
    const end = textArea.selectionEnd;
    const beforeSelection = store.content.substring(0, start);
    const selection = store.content.substring(start, end);
    const afterSelection = store.content.substring(end);

    // Nếu không có text được chọn, sử dụng placeholder
    const textToWrap = selection || placeholder;
    
    // Cập nhật nội dung và vị trí con trỏ
    const newContent = `${beforeSelection}${prefix}${textToWrap}${suffix}${afterSelection}`;
    store.setContent(newContent);
    
    // Đặt lại vị trí con trỏ sau khi cập nhật
    setTimeout(() => {
      textArea.focus();
      if (selection) {
        // Nếu có text được chọn, giữ nguyên selection sau khi thêm format
        textArea.setSelectionRange(
          start + prefix.length,
          end + prefix.length
        );
      } else {
        // Nếu không có text được chọn, đặt con trỏ vào giữa prefix và suffix
        const cursorPosition = start + prefix.length + placeholder.length;
        textArea.setSelectionRange(cursorPosition, cursorPosition);
      }
    }, 0);
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
      tags: store.tags,
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
                {/* Sửa lỗi hiển thị tags */}
                <Space wrap className="mb-6">
                  {store.tags.map((tag) => (
                    <Tag key={tag} className="rounded-full px-3 py-1">
                      #{tag}
                    </Tag>
                  ))}
                </Space>
                {/* Đã cải thiện cấu hình ReactMarkdown để xử lý đúng các thẻ định dạng */}
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
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
                <TagInput 
                  value={store.tags}
                  onChange={store.setTags}
                  className="mb-4"
                />
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
        {store.activeSuggestion === "tags" && session?.user.role === "ADMIN" && (
          <Card className="mt-4">
            <Title level={4}>Admin Tag Feature</Title>
            <Text>
              As an admin, you can create official tags by including &apos;official&apos; in
              the tag name (e.g., #news-official). Official tags will be highlighted
              and posts with these tags will appear first in listings.
            </Text>
          </Card>
        )}
      </Sider>
    </Layout>
  );
};