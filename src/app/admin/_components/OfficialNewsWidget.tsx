import React from 'react';
import { Card, List, Tag, Spin, Button, Empty } from 'antd';
import { CrownOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";

export default function OfficialNewsWidget() {
  const router = useRouter();
  
  // Fetch the latest 5 official news items
  const { data: news, isLoading } = api.post.getAll.useQuery({
    limit: 5,
    isOfficial: true,
  });
  
  if (isLoading) {
    return (
      <Card title="Official News" className="h-full">
        <div className="flex h-48 items-center justify-center">
          <Spin />
        </div>
      </Card>
    );
  }
  
  const hasNews = news?.items && news.items.length > 0;
  
  return (
    <Card 
      title={
        <div className="flex items-center">
          <CrownOutlined className="mr-2 text-yellow-500" />
          <span>Official News</span>
        </div>
      }
      extra={
        <Button 
          type="link" 
          onClick={() => router.push('/admin/news')}
          icon={<ArrowRightOutlined />}
        >
          Manage
        </Button>
      }
      className="h-full"
    >
      {hasNews ? (
        <List
          itemLayout="horizontal"
          dataSource={news.items}
          renderItem={(item) => (
            <List.Item
              actions={[
                <Button 
                  key="view" 
                  type="link" 
                  size="small"
                  onClick={() => window.open(`/posts/${item.id}`, '_blank')}
                >
                  View
                </Button>
              ]}
            >
              <List.Item.Meta
                title={
                  <div className="flex items-center">
                    <span className="mr-2">{item.title}</span>
                    <Tag color="gold" className="m-0">
                      Official
                    </Tag>
                  </div>
                }
                description={
                  <div>
                    <div className="mb-1 text-gray-500 text-sm truncate max-w-md">
                      {item.excerpt}
                    </div>
                    <div className="text-xs text-gray-400">
                      {new Date(item.publishedAt).toLocaleDateString()}
                    </div>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      ) : (
        <Empty 
          description="No official news published yet" 
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        >
          <Button 
            type="primary" 
            onClick={() => router.push('/admin/news')}
          >
            Create News
          </Button>
        </Empty>
      )}
    </Card>
  );
}