import React from 'react';
import { MessageCircle, AlertTriangle, ThumbsUp, HelpCircle } from 'lucide-react';
import { List, Typography } from 'antd';

const { Text } = Typography;

interface NotificationListProps {
  contacts: number;
  technicalIssues: number;
  feedback: number;
  supportRequests: number;
  onItemClick: () => void;
}

export default function NotificationList({ 
  contacts,
  technicalIssues, 
  feedback,
  supportRequests,
  onItemClick
}: NotificationListProps) {
  const notifications = [
    {
      type: "contacts",
      icon: <MessageCircle className="text-blue-500" />,
      title: "Contact Queries",
      count: contacts,
      description: "New contact queries requiring attention"
    },
    {
      type: "technicalIssues",
      icon: <AlertTriangle className="text-red-500" />,
      title: "Technical Issues",
      count: technicalIssues,
      description: "New technical issues reported"
    },
    {
      type: "feedback",
      icon: <ThumbsUp className="text-green-500" />,
      title: "User Feedback",
      count: feedback,
      description: "New user feedback received"
    },
    {
      type: "supportRequests", 
      icon: <HelpCircle className="text-purple-500" />,
      title: "Support Requests",
      count: supportRequests,
      description: "New support requests waiting"
    }
  ].filter(item => item.count > 0);

  return (
    <div className="w-80">
      {notifications.length > 0 ? (
        <List
          className="divide-y divide-gray-200"
          dataSource={notifications}
          renderItem={(item) => (
            <List.Item 
              className="cursor-pointer hover:bg-gray-50 p-4"
              onClick={onItemClick}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">{item.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <Text strong>{item.title}</Text>
                    <Text className="text-blue-600">{item.count}</Text>
                  </div>
                  <Text className="text-sm text-gray-500">{item.description}</Text>
                </div>
              </div>
            </List.Item>
          )}
        />
      ) : (
        <div className="text-center p-4 text-gray-500">
          No new notifications
        </div>
      )}
    </div>
  );
}