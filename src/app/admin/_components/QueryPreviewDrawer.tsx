import React from 'react';
import { Drawer, Tabs, Tag, Empty, Card, Space } from 'antd';
import type { TabsProps } from 'antd';
import { api } from "~/trpc/react";
import { useRouter } from 'next/navigation';

interface QueryPreviewDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function QueryPreviewDrawer({ open, onClose }: QueryPreviewDrawerProps) {
  const router = useRouter();
  
  // Fetch NEW queries
  const { data: contacts } = api.adminQueryView.getContacts.useQuery({
    page: 1,
    limit: 10,
    status: "NEW"
  });

  const { data: feedback } = api.adminQueryView.getFeedback.useQuery({
    page: 1,
    limit: 10,
    status: "NEW"
  });

  const { data: technicalIssues } = api.adminQueryView.getTechnicalIssues.useQuery({
    page: 1,
    limit: 10,
    status: "NEW"
  });

  const { data: supportRequests } = api.adminQueryView.getSupportRequests.useQuery({
    page: 1,
    limit: 10,
    status: "NEW"
  });

  const handleQueryClick = (type: string, id: string) => {
    // Map query type to corresponding route
    const routes = {
      contact: '/admin/contact',
      feedback: '/admin/feedback',
      technical: '/admin/issues',
      support: '/admin/support'
    };

    // Close the drawer
    onClose();

    // Navigate to the corresponding page
    // In the future, you might want to add query parameters to highlight the specific item
    router.push(routes[type as keyof typeof routes]);
  };

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: `Contact Queries (${contacts?.items.length ?? 0})`,
      children: contacts?.items.length ? (
        <div className="space-y-4 max-h-[600px] overflow-y-auto">
          {contacts.items.map((contact) => (
            <Card 
              key={contact.id} 
              size="small" 
              className="shadow-sm cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleQueryClick('contact', contact.id)}
            >
              <Space direction="vertical" className="w-full">
                <div>
                  <span className="font-medium">{contact.organization}</span>
                  <Tag color="blue" className="ml-2">{contact.inquiryType}</Tag>
                </div>
                <div className="text-sm text-gray-500">{contact.name}</div>
                <div className="text-sm">{contact.message}</div>
                <div className="text-xs text-gray-500">
                  Submitted on: {new Date(contact.createdAt).toLocaleDateString()}
                </div>
              </Space>
            </Card>
          ))}
        </div>
      ) : <Empty description="No new contact queries" />,
    },
    {
      key: '2',
      label: `Feedback (${feedback?.items.length ?? 0})`,
      children: feedback?.items.length ? (
        <div className="space-y-4 max-h-[600px] overflow-y-auto">
          {feedback.items.map((item) => (
            <Card 
              key={item.id} 
              size="small" 
              className="shadow-sm cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleQueryClick('feedback', item.id)}
            >
              <Space direction="vertical" className="w-full">
                <div>
                  <Tag color="purple">{item.category}</Tag>
                  <span className="ml-2">
                    Rating: {item.satisfaction}/5
                  </span>
                </div>
                <div className="text-sm">{item.improvements}</div>
                <div className="text-xs text-gray-500">
                  Submitted on: {new Date(item.createdAt).toLocaleDateString()}
                </div>
              </Space>
            </Card>
          ))}
        </div>
      ) : <Empty description="No new feedback" />,
    },
    {
      key: '3',
      label: `Technical Issues (${technicalIssues?.items.length ?? 0})`,
      children: technicalIssues?.items.length ? (
        <div className="space-y-4 max-h-[600px] overflow-y-auto">
          {technicalIssues.items.map((issue) => (
            <Card 
              key={issue.id} 
              size="small" 
              className="shadow-sm cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleQueryClick('technical', issue.id)}
            >
              <Space direction="vertical" className="w-full">
                <div>
                  <span className="font-medium">{issue.title}</span>
                  <Tag color="red" className="ml-2">{issue.severity}</Tag>
                  <Tag color="blue">{issue.issueType}</Tag>
                </div>
                <div className="text-sm">{issue.description}</div>
                <div className="text-xs text-gray-500">
                  Reported on: {new Date(issue.createdAt).toLocaleDateString()}
                </div>
              </Space>
            </Card>
          ))}
        </div>
      ) : <Empty description="No new technical issues" />,
    },
    {
      key: '4',
      label: `Support Requests (${supportRequests?.items.length ?? 0})`,
      children: supportRequests?.items.length ? (
        <div className="space-y-4 max-h-[600px] overflow-y-auto">
          {supportRequests.items.map((request) => (
            <Card 
              key={request.id} 
              size="small" 
              className="shadow-sm cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleQueryClick('support', request.id)}
            >
              <Space direction="vertical" className="w-full">
                <div>
                  <span className="font-medium">{request.subject}</span>
                  <Tag color="orange" className="ml-2">{request.priority}</Tag>
                  <Tag color="cyan">{request.category}</Tag>
                </div>
                <div className="text-sm">{request.description}</div>
                <div className="text-xs text-gray-500">
                  Submitted on: {new Date(request.createdAt).toLocaleDateString()}
                </div>
              </Space>
            </Card>
          ))}
        </div>
      ) : <Empty description="No new support requests" />,
    },
  ];

  return (
    <Drawer
      title="New Notifications"
      placement="right"
      width={600}
      open={open}
      onClose={onClose}
    >
      <Tabs 
        defaultActiveKey="1" 
        items={items}
        className="h-full"
      />
    </Drawer>
  );
}