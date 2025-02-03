import { Layout, Input, Badge, Avatar, Space, Button, Popover, Tag } from "antd";
import {
  BellOutlined,
  SearchOutlined,
  SunOutlined,
  MoonOutlined,
  UserOutlined,
  CrownOutlined,
} from "@ant-design/icons";
import { useTheme } from "~/app/_components/AntAdminThemeProvider";
import { useSession } from "next-auth/react";
import NotificationList from "./NotificationList";
import QueryPreviewDrawer from "./QueryPreviewDrawer";
import { api } from "~/trpc/react";
import { useState } from "react";

const { Header } = Layout;

export default function AdminHeader() {
  const { isDark, toggleTheme } = useTheme();
  const { data: session } = useSession();
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  
  // Get total count of new queries
  const { data: newQueries } = api.adminQueryView.getQueryCounts.useQuery({
    status: "NEW",
  });

  const totalNotifications = newQueries
    ? Object.values(newQueries).reduce((sum, count) => sum + count, 0)
    : 0;

  const isTenantAdmin = session?.user.role === "TENANT_ADMIN";
  const isAdmin = session?.user.role === "ADMIN" || isTenantAdmin;

  const handleNotificationClick = () => {
    setNotificationOpen(false);
    setDrawerOpen(true);
  };

  const avatarContent = (
    <div className="flex flex-col gap-2 min-w-[200px]">
      <div className="font-medium">Hello, {session?.user.name}</div>
      <div className="text-gray-500">
        {isTenantAdmin ? "Tenant Administrator" : "Administrator"}
      </div>
      {isAdmin && (
        <Tag color={isTenantAdmin ? "gold" : "blue"} icon={<CrownOutlined />}>
          {isTenantAdmin ? "Tenant Admin" : "Admin"}
        </Tag>
      )}
      <hr className="my-2" />
    </div>
  );

  return (
    <>
      <Header className="flex items-center justify-between px-6 transition-colors duration-200">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold">Zelene IoT Platform</h1>
          <Input
            prefix={<SearchOutlined />}
            placeholder="Quick search..."
            className="w-64"
          />
        </div>

        <Space size="middle" align="center">
          <Button
            type="text"
            icon={isDark ? <SunOutlined /> : <MoonOutlined />}
            className="flex h-8 w-8 items-center justify-center !p-0"
            onClick={toggleTheme}
          />
          
          <Popover
            content={
              newQueries && (
                <NotificationList
                  contacts={newQueries.contacts}
                  technicalIssues={newQueries.technicalIssues}
                  feedback={newQueries.feedback}
                  supportRequests={newQueries.supportRequests}
                  onItemClick={handleNotificationClick}
                />
              )
            }
            trigger="click"
            placement="bottomRight"
            arrow={{ pointAtCenter: true }}
            open={notificationOpen}
            onOpenChange={setNotificationOpen}
          >
            <Button 
              type="text" 
              className="flex h-8 w-8 items-center justify-center !p-0"
            >
              <Badge count={totalNotifications} size="small">
                <BellOutlined className="text-lg" />
              </Badge>
            </Button>
          </Popover>

          <Popover 
            content={avatarContent}
            trigger="click"
            placement="bottomRight"
          >
            <Avatar
              src={session?.user.image}
              icon={<UserOutlined />}
              style={{ cursor: 'pointer' }}
              className="flex h-8 w-8 items-center justify-center bg-blue-500"
            >
              {!session?.user.image && session?.user.name?.[0]}
            </Avatar>
          </Popover>
        </Space>
      </Header>

      {/* Query Preview Drawer */}
      <QueryPreviewDrawer 
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </>
  );
}