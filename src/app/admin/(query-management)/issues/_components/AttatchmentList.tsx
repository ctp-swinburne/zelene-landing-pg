import React from "react";
import { Modal, Image } from "antd";
import {
  FileTextOutlined,
  VideoCameraOutlined,
  FileImageOutlined,
  FileOutlined,
} from "@ant-design/icons";

interface AttachmentViewerProps {
  url: string;
  visible: boolean;
  onClose: () => void;
}

const AttachmentViewer: React.FC<AttachmentViewerProps> = ({
  url,
  visible,
  onClose,
}) => {
  const getFileType = (url: string) => {
    try {
      const decodedUrl = decodeURIComponent(url);
      const extensionMatch = /\.([^./?]+)\?/.exec(decodedUrl);
      return extensionMatch?.[1]?.toLowerCase() ?? "";
    } catch (error) {
      console.error("Error getting file type:", error);
      return "";
    }
  };

  const fileType = getFileType(url);

  const renderContent = () => {
    const imageExts = ["jpg", "jpeg", "png", "gif", "webp"];
    const videoExts = ["mp4", "webm", "mov"];
    const textExts = ["txt", "md", "json", "csv"];
    const pdfExts = ["pdf"];

    if (imageExts.includes(fileType)) {
      return <Image src={url} style={{ width: "100%" }} />;
    }

    if (videoExts.includes(fileType)) {
      return (
        <video controls style={{ width: "100%" }}>
          <source src={url} type={`video/${fileType}`} />
        </video>
      );
    }

    if (textExts.includes(fileType)) {
      return (
        <iframe
          src={url}
          style={{ width: "100%", height: "600px", border: "none" }}
          sandbox="allow-same-origin"
        />
      );
    }

    if (pdfExts.includes(fileType)) {
      return (
        <iframe
          src={`https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`}
          style={{ width: "100%", height: "600px", border: "none" }}
        />
      );
    }

    return (
      <div className="p-8 text-center">
        <FileOutlined style={{ fontSize: "48px" }} />
        <p className="mt-4">Preview not available</p>
        <a
          href={url}
          download
          className="mt-2 text-blue-600 hover:text-blue-800"
        >
          Download File
        </a>
      </div>
    );
  };

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      width={800}
      footer={null}
      title="File Preview"
    >
      {renderContent()}
    </Modal>
  );
};

export const AttachmentList: React.FC<{
  attachments: string[];
}> = ({ attachments }) => {
  const [selectedUrl, setSelectedUrl] = React.useState<string>("");
  const [viewerVisible, setViewerVisible] = React.useState(false);

  const getFileInfo = (url: string) => {
    try {
      const decodedUrl = decodeURIComponent(url);
      const pathMatch = /\/([^/?]+\.[^/?]+)\?/.exec(decodedUrl);
      const fullName = pathMatch?.[1] ?? "";
      const ext = fullName.split(".").pop()?.toLowerCase() ?? "";
      const name = fullName.split(".").slice(0, -1).join(".");
      return { name, ext, fullName };
    } catch (error) {
      console.error("Error parsing URL:", error);
      return { name: "unknown", ext: "", fullName: "unknown" };
    }
  };

  const renderIcon = (ext: string) => {
    if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext))
      return <FileImageOutlined />;
    if (["mp4", "webm", "mov"].includes(ext)) return <VideoCameraOutlined />;
    if (["txt", "md", "json", "csv", "pdf"].includes(ext))
      return <FileTextOutlined />;
    return <FileOutlined />;
  };

  return (
    <div className="space-y-2">
      {attachments.map((url) => {
        const { name, ext, fullName } = getFileInfo(url);
        return (
          <div
            key={url}
            className="flex items-center justify-between rounded-md border p-2 hover:bg-gray-50"
          >
            <div className="flex items-center gap-2">
              {renderIcon(ext)}
              <span className="max-w-[300px] truncate">{fullName}</span>
            </div>
            <button
              onClick={() => {
                setSelectedUrl(url);
                setViewerVisible(true);
              }}
              className="text-blue-600 hover:text-blue-800"
            >
              View
            </button>
          </div>
        );
      })}

      <AttachmentViewer
        url={selectedUrl}
        visible={viewerVisible}
        onClose={() => setViewerVisible(false)}
      />
    </div>
  );
};
