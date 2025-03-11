"use client";
import React from "react";
import { Typography, Card, Layout, Space, Table, Tag, Progress, Statistic, Row, Col, Timeline, Alert, Spin } from "antd";
import { 
  CheckCircleOutlined, 
  ExclamationCircleOutlined, 
  ClockCircleOutlined,
  CloudOutlined,
  GlobalOutlined,
  SafetyOutlined,
  HistoryOutlined,
  LaptopOutlined,
  MobileOutlined,
  FileTextOutlined,
  TeamOutlined,
  MailOutlined,
  MessageOutlined,
  SecurityScanOutlined,
  ApiOutlined,
  AppstoreOutlined,
  PictureOutlined
} from "@ant-design/icons";

const { Title, Paragraph, Text } = Typography;
const { Content } = Layout;

// Component types for the platform
type PlatformComponent = {
  name: string;
  status: 'operational' | 'degraded' | 'maintenance' | 'outage';
  uptime: number;
  lastIncident: string;
};

// Incident type for platform issues
type Incident = {
  date: string;
  title: string;
  description: string;
  status: 'Resolved' | 'In Progress' | 'Investigating';
  duration: string;
};

// This would be replaced with an API call in production
const fetchPlatformComponents = async (): Promise<PlatformComponent[]> => {
  // In a real implementation, this would be an API call
  // return await fetch('/api/status/components').then(res => res.json());
  
  // For now, return empty array as we'll implement API later
  return [];
};

// This would be replaced with an API call in production
const fetchRecentIncidents = async (): Promise<Incident[]> => {
  // In a real implementation, this would be an API call
  // return await fetch('/api/status/incidents').then(res => res.json());
  
  // For now, return empty array as we'll implement API later
  return [];
};

const PlatformStatusPage = () => {
  const [platformComponents, setPlatformComponents] = React.useState<PlatformComponent[]>([]);
  const [recentIncidents, setRecentIncidents] = React.useState<Incident[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  
  React.useEffect(() => {
    // Load data when component mounts
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [componentsData, incidentsData] = await Promise.all([
          fetchPlatformComponents(),
          fetchRecentIncidents()
        ]);
        
        setPlatformComponents(componentsData);
        setRecentIncidents(incidentsData);
      } catch (err) {
        setError('Failed to load status data. Please try again later.');
        console.error('Error loading status data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    void loadData();
  }, []);

  // Function to render status indicators
  const renderStatus = (status: string) => {
    switch (status) {
      case 'operational':
        return <Tag icon={<CheckCircleOutlined />} color="success">Operational</Tag>;
      case 'degraded':
        return <Tag icon={<ExclamationCircleOutlined />} color="warning">Degraded</Tag>;
      case 'maintenance':
        return <Tag icon={<ClockCircleOutlined />} color="processing">Maintenance</Tag>;
      case 'outage':
        return <Tag icon={<ExclamationCircleOutlined />} color="error">Outage</Tag>;
      default:
        return <Tag>Unknown</Tag>;
    }
  };

  // Table columns for platform components
  const columns = [
    {
      title: 'Component',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => renderStatus(status),
    },
    {
      title: 'Uptime (30 days)',
      dataIndex: 'uptime',
      key: 'uptime',
      render: (uptime: number) => (
        <div className="w-40">
          <Progress 
            percent={uptime} 
            size="small" 
            status={uptime < 99 ? "exception" : uptime < 99.9 ? "normal" : "success"}
            format={(percent) => `${percent?.toFixed(2)}%`}
          />
        </div>
      ),
    },
    {
      title: 'Last Incident',
      dataIndex: 'lastIncident',
      key: 'lastIncident',
    },
  ];

  // Calculate overall platform status
  const calculateOverallStatus = (): {
    status: string;
    color: string;
    icon: JSX.Element;
  } => {
    if (platformComponents.length === 0) {
      return { 
        status: 'Unknown', 
        color: '#d9d9d9',
        icon: <ExclamationCircleOutlined />
      };
    }
    
    const hasOutage = platformComponents.some(comp => comp.status === 'outage');
    if (hasOutage) {
      return { 
        status: 'Major Outage', 
        color: '#f5222d',
        icon: <ExclamationCircleOutlined />
      };
    }
    
    const hasDegraded = platformComponents.some(comp => comp.status === 'degraded');
    const hasMaintenance = platformComponents.some(comp => comp.status === 'maintenance');
    
    if (hasDegraded) {
      return { 
        status: 'Degraded Performance', 
        color: '#faad14',
        icon: <ExclamationCircleOutlined />
      };
    }
    
    if (hasMaintenance) {
      return { 
        status: 'Maintenance In Progress', 
        color: '#1890ff',
        icon: <ClockCircleOutlined />
      };
    }
    
    return { 
      status: 'All Systems Operational', 
      color: '#52c41a',
      icon: <CheckCircleOutlined />
    };
  };
  
  // Get counts of operational components
  const getOperationalCounts = () => {
    const total = platformComponents.length;
    const operational = platformComponents.filter(comp => comp.status === 'operational').length;
    return { operational, total };
  };
  
  // Get active incidents count
  const getActiveIncidentsCount = () => {
    return recentIncidents.filter(
      incident => incident.status === 'In Progress' || incident.status === 'Investigating'
    ).length;
  };
  
  // Calculate average uptime
  const getAverageUptime = () => {
    if (platformComponents.length === 0) return 0;
    
    const sum = platformComponents.reduce((acc, comp) => acc + comp.uptime, 0);
    return (sum / platformComponents.length).toFixed(2);
  };

  const { status, color, icon } = calculateOverallStatus();
  const { operational, total } = getOperationalCounts();
  const activeIncidents = getActiveIncidentsCount();
  const averageUptime = getAverageUptime();
  const lastUpdated = new Date().toLocaleString();

  return (
    <Layout className="min-h-screen bg-gray-50">
      <Content className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <Title level={1}>Platform Status</Title>
            <Paragraph className="text-lg text-gray-600">
              Current status of the Zelene IoT Community Platform
            </Paragraph>
            <Text type="secondary">Last updated: {lastUpdated}</Text>
          </div>
          
          {error && (
            <Alert
              message="Error Loading Status"
              description={error}
              type="error"
              showIcon
              className="mb-8"
            />
          )}

          {/* Platform Status Overview */}
          <Card className="mb-8 shadow">
            <Row gutter={[24, 24]}>
              <Col xs={24} md={6}>
                <Statistic 
                  title={<span className="text-base">Overall Status</span>}
                  value={status}
                  valueStyle={{ color }}
                  prefix={icon}
                />
              </Col>
              <Col xs={24} md={6}>
                <Statistic 
                  title={<span className="text-base">Features</span>}
                  value={operational}
                  suffix={<span className="text-sm">/{total} available</span>}
                  valueStyle={{ color: '#1890ff' }}
                  prefix={<AppstoreOutlined />}
                />
              </Col>
              <Col xs={24} md={6}>
                <Statistic 
                  title={<span className="text-base">Active Incidents</span>}
                  value={activeIncidents}
                  valueStyle={{ color: activeIncidents > 0 ? '#faad14' : '#52c41a' }}
                  prefix={<ExclamationCircleOutlined />}
                />
              </Col>
              <Col xs={24} md={6}>
                <Statistic 
                  title={<span className="text-base">Platform Uptime</span>}
                  value={averageUptime}
                  suffix="%"
                  valueStyle={{ color: '#52c41a' }}
                  prefix={<SafetyOutlined />}
                />
              </Col>
            </Row>
          </Card>

          {/* Service Status Table */}
          <Card 
            title={
              <Space>
                <CloudOutlined />
                <span>Community Platform Components</span>
              </Space>
            } 
            className="mb-8 shadow"
          >
            {isLoading ? (
              <div className="py-16 text-center">
                <Spin size="large" />
                <div className="mt-4 text-gray-500">Loading status information...</div>
              </div>
            ) : platformComponents.length === 0 ? (
              <Alert
                message="No Data Available"
                description="Platform component status information is not yet available. Please check back later."
                type="info"
                showIcon
              />
            ) : (
              <Table 
                dataSource={platformComponents} 
                columns={columns} 
                rowKey="name"
                pagination={false}
              />
            )}
          </Card>

          <Row gutter={[24, 24]}>
            {/* Recent Incidents */}
            <Col xs={24} lg={12}>
              <Card 
                title={
                  <Space>
                    <HistoryOutlined />
                    <span>Recent Incidents</span>
                  </Space>
                } 
                className="mb-8 shadow h-full"
              >
                {isLoading ? (
                  <div className="py-16 text-center">
                    <Spin size="large" />
                  </div>
                ) : recentIncidents.length === 0 ? (
                  <Alert
                    message="No Recent Incidents"
                    description="There have been no reported incidents in the recent period."
                    type="success"
                    showIcon
                  />
                ) : (
                  <Timeline mode="left">
                    {recentIncidents.map((incident, index) => (
                      <Timeline.Item 
                        key={index}
                        color={
                          incident.status === 'Resolved' ? 'green' : 
                          incident.status === 'In Progress' ? 'blue' : 'yellow'
                        }
                        label={incident.date}
                      >
                        <div className="mb-4">
                          <Text strong>{incident.title}</Text>
                          <Tag 
                            className="ml-2"
                            color={
                              incident.status === 'Resolved' ? 'success' : 
                              incident.status === 'In Progress' ? 'processing' : 'warning'
                            }
                          >
                            {incident.status}
                          </Tag>
                          <Paragraph className="mt-1 mb-1">
                            {incident.description}
                          </Paragraph>
                          <Text type="secondary" className="text-xs">
                            {incident.duration}
                          </Text>
                        </div>
                      </Timeline.Item>
                    ))}
                  </Timeline>
                )}
              </Card>
            </Col>

            {/* Platform Information */}
            <Col xs={24} lg={12}>
              <Card 
                title={
                  <Space>
                    <GlobalOutlined />
                    <span>Platform Features</span>
                  </Space>
                } 
                className="mb-8 shadow"
              >
                <Space direction="vertical" className="w-full">
                  <Card 
                    size="small" 
                    title={
                      <Space>
                        <TeamOutlined />
                        <span>Community & Forum</span>
                      </Space>
                    }
                  >
                    <Paragraph>
                      Discussion forums, user posts, comments, and all community engagement features.
                    </Paragraph>
                    <Text type="success">Check current status in the table above</Text>
                  </Card>

                  <Card 
                    size="small" 
                    title={
                      <Space>
                        <MobileOutlined />
                        <span>Mobile Experience</span>
                      </Space>
                    }
                  >
                    <Paragraph>
                      The mobile version of our community platform.
                    </Paragraph>
                    <Text type="success">Check current status in the table above</Text>
                  </Card>

                  <Card 
                    size="small" 
                    title={
                      <Space>
                        <PictureOutlined />
                        <span>Media & File Sharing</span>
                      </Space>
                    }
                  >
                    <Paragraph>
                      Our media upload and sharing system.
                    </Paragraph>
                    <Text type="success">Check current status in the table above</Text>
                  </Card>
                </Space>
              </Card>
            </Col>
          </Row>

          <Card 
            title={
              <Space>
                <MailOutlined />
                <span>Status Notifications</span>
              </Space>
            } 
            className="mb-8 shadow"
          >
            <Space direction="vertical" className="w-full">
              <Paragraph>
                Stay informed about platform status changes and scheduled maintenance by subscribing
                to our status updates. We provide notifications via:
              </Paragraph>
              <ul className="list-disc ml-6 mb-4">
                <li>Email alerts for major outages and scheduled maintenance</li>
                <li>Status updates on our social media channels</li>
                <li>In-platform notifications for logged-in users</li>
              </ul>
              <Row gutter={16}>
                <Col>
                  <a href="/contact" className="ant-btn ant-btn-primary">
                    Subscribe to Updates
                  </a>
                </Col>
                <Col>
                  <a href="/help" className="ant-btn">
                    Report an Issue
                  </a>
                </Col>
              </Row>
            </Space>
          </Card>
        </div>
      </Content>
    </Layout>
  );
};

export default PlatformStatusPage;