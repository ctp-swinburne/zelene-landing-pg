import React from 'react';
import { MessageCircle, AlertTriangle, ThumbsUp, HelpCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface NotificationListProps {
  contacts: number;
  technicalIssues: number;
  feedback: number;
  supportRequests: number;
  onItemClick?: () => void;
}

export default function NotificationList({ 
  contacts,
  technicalIssues, 
  feedback,
  supportRequests,
  onItemClick
}: NotificationListProps) {
  const router = useRouter();

  const notifications = [
    {
      type: "contacts",
      icon: <MessageCircle className="text-blue-500" />,
      title: "Contact Queries",
      count: contacts,
      path: "/admin/contact"
    },
    {
      type: "technicalIssues",
      icon: <AlertTriangle className="text-red-500" />,
      title: "Technical Issues",
      count: technicalIssues,
      path: "/admin/issues"
    },
    {
      type: "feedback",
      icon: <ThumbsUp className="text-green-500" />,
      title: "User Feedback",
      count: feedback,
      path: "/admin/feedback"
    },
    {
      type: "supportRequests", 
      icon: <HelpCircle className="text-purple-500" />,
      title: "Support Requests",
      count: supportRequests,
      path: "/admin/support"
    }
  ].filter(item => item.count > 0);

  const handleClick = (path: string) => {
    onItemClick?.();
    router.push(path);
  };

  return (
    <div className="w-80">
      <div className="divide-y divide-gray-200">
        {notifications.map((item) => (
          <div
            key={item.type}
            onClick={() => handleClick(item.path)}
            className="flex cursor-pointer items-center gap-3 p-3 transition-colors hover:bg-gray-50 active:bg-blue-100"
          >
            {item.icon}
            <div>
              <div className="font-medium text-gray-900">{item.title}</div>
              <div className="text-sm text-gray-500">
                {item.count} new {item.type.replace(/([A-Z])/g, ' $1').toLowerCase()}
              </div>
            </div>
          </div>
        ))}
      </div>

      {notifications.length === 0 && (
        <div className="p-4 text-center text-gray-500">
          No new notifications
        </div>
      )}
    </div>
  );
}