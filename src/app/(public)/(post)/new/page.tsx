"use client";
import { useState } from "react";
import type { RouterOutputs } from "~/trpc/react";
import { api } from "~/trpc/react";
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
} from "@ant-design/icons";

const { Title, Paragraph } = Typography;
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

const ToolbarButton: React.FC<ToolbarButtonProps> = ({
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

const CreatePost: React.FC = () => {
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [content, setContent] = useState("");
  const [currentTag, setCurrentTag] = useState("");
  const [selectionStart, setSelectionStart] = useState(0);
  const [selectionEnd, setSelectionEnd] = useState(0);
  const [activeSuggestion, setActiveSuggestion] = useState<
    "title" | "tags" | "content" | null
  >(null);

  const suggestions = {
    title: {
      title: "Writing an Effective Title",
      content:
        "A good IoT post title should be clear, specific, and include relevant keywords. Consider starting with action words or numbers, e.g., '5 Ways to Optimize IoT Sensor Data' or 'How to Implement MQTT in Edge Devices'.",
    },
    tags: {
      title: "Choosing Relevant Tags",
      content:
        "Tags help others find your content. Include technical specifications (e.g., 'MQTT', 'Arduino'), application areas (e.g., 'Smart Home', 'Industrial IoT'), and skill levels (e.g., 'Beginner', 'Advanced').",
    },
    content: {
      title: "Structuring Your Content",
      content:
        "Start with a brief introduction explaining the problem or goal. Use headers to organize sections. Include code snippets, diagrams, or images where relevant. End with a conclusion or next steps.",
    },
  };

  const handleAddTag = () => {
    if (currentTag && !tags.includes(currentTag)) {
      setTags([...tags, currentTag]);
      setCurrentTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSelect = (e: React.MouseEvent<HTMLTextAreaElement>) => {
    const textarea = e.target as HTMLTextAreaElement;
    setSelectionStart(textarea.selectionStart);
    setSelectionEnd(textarea.selectionEnd);
  };

  const executeCommand = (command: EditorCommand) => {
    const prefix = command.prefix;
    const suffix = command.suffix;
    const placeholder = command.placeholder ?? "text";

    const beforeSelection = content.substring(0, selectionStart);
    const selection =
      content.substring(selectionStart, selectionEnd) || placeholder;
    const afterSelection = content.substring(selectionEnd);

    const newContent = `${beforeSelection}${prefix}${selection}${suffix}${afterSelection}`;
    setContent(newContent);
  };

  // Header options for dropdown
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

  return (
    <Layout className="min-h-screen">
      <Content className="p-6">
        <div className="mx-auto max-w-4xl">
          <Title level={2}>Create New Post</Title>

          <div className="mb-6">
            <Input
              placeholder="Enter post title"
              size="large"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onFocus={() => setActiveSuggestion("title")}
              className="mb-4"
            />
          </div>

          <div className="mb-6">
            <Space className="w-full" direction="vertical">
              <Input
                placeholder="Add tags"
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onPressEnter={handleAddTag}
                onFocus={() => setActiveSuggestion("tags")}
              />
              <div className="mt-2">
                {tags.map((tag) => (
                  <Tag
                    key={tag}
                    closable
                    onClose={() => handleRemoveTag(tag)}
                    className="mb-2 mr-2"
                  >
                    {tag}
                  </Tag>
                ))}
              </div>
            </Space>
          </div>

          <Card className="mb-6" onFocus={() => setActiveSuggestion("content")}>
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
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onMouseUp={handleSelect}
              placeholder="Write your post content here..."
              autoSize={{ minRows: 15 }}
              className="border-none focus:shadow-none"
            />
          </Card>

          <Space>
            <Button type="primary" size="large">
              Publish Post
            </Button>
            <Button size="large">Save Draft</Button>
          </Space>
        </div>
      </Content>

      <Sider width={300} style={{ background: "#fff" }} className="p-4">
        {activeSuggestion && (
          <Card>
            <Title level={4}>{suggestions[activeSuggestion].title}</Title>
            <Paragraph>{suggestions[activeSuggestion].content}</Paragraph>
          </Card>
        )}
      </Sider>
    </Layout>
  );
};

export default CreatePost;
