import React, { useState, useEffect } from 'react';
import { Card, Tabs, List, Tag, Button, Space, Typography, Badge, message, Tooltip, Input, Row, Col } from 'antd';
import { 
  ApiOutlined, 
  SyncOutlined, 
  DisconnectOutlined, 
  SettingOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  SearchOutlined,
  AppstoreOutlined,
  RobotOutlined,
  ToolOutlined,
  HomeOutlined
} from '@ant-design/icons';
import WorkflowActions from '../../components/workflow/WorkflowActions';
import api from '../../utils/axios';

const { TabPane } = Tabs;
const { Title, Text } = Typography;
const { Search } = Input;

const IntegrationTools = () => {
  const [connectedTools, setConnectedTools] = useState([]);
  const [loading, setLoading] = useState(false);
  const [syncingTool, setSyncingTool] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);

  const topApps = [
    { name: 'ActiveCampaign', icon: '📧', category: 'Email Marketing' },
    { name: 'Facebook Pages', icon: '👥', category: 'Social Media' },
    { name: 'Google Calendar', icon: '📅', category: 'Productivity' },
    { name: 'Google Contacts', icon: '👤', category: 'CRM' },
    { name: 'Google Docs', icon: '📄', category: 'Documents' },
    { name: 'Google Drive', icon: '💾', category: 'Storage' },
    { name: 'Gmail', icon: '✉️', category: 'Email' },
    { name: 'HubSpot', icon: '🎯', category: 'CRM' },
    { name: 'Twilio', icon: '📱', category: 'Communication' },
    { name: 'Google Sheets', icon: '📊', category: 'Spreadsheets' },
    { name: 'Slack', icon: '💬', category: 'Communication' },
    { name: 'Notion', icon: '📝', category: 'Productivity' }
  ];

  const builtInTools = [
    { name: 'AI by Zapier', icon: '🤖', description: 'Use AI to automate tasks' },
    { name: 'Filter', icon: '🔍', description: 'Filter data in your workflows' },
    { name: 'Formatter', icon: '✨', description: 'Format your data' },
    { name: 'Paths', icon: '🔀', description: 'Create conditional paths' },
    { name: 'Delay', icon: '⏰', description: 'Add delays to your workflows' },
    { name: 'Webhooks', icon: '🔗', description: 'Create and manage webhooks' },
    { name: 'Code', icon: '💻', description: 'Run custom code' }
  ];

  const zapierProducts = [
    { name: 'Chatbots', icon: '🤖', description: 'Build AI-powered chatbots' },
    { name: 'Interfaces', icon: '🖥️', description: 'Create custom interfaces' },
    { name: 'Tables', icon: '📊', description: 'Manage data in tables' }
  ];

  useEffect(() => {
    fetchConnectedTools();
  }, []);

  const fetchConnectedTools = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/api/integrations/tools');
      setConnectedTools(data);
    } catch (error) {
      message.error('Failed to fetch connected tools');
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async (toolId) => {
    try {
      setSyncingTool(toolId);
      await api.post(`/api/integrations/${toolId}/sync`);
      message.success('Tool synchronized successfully');
      fetchConnectedTools();
    } catch (error) {
      message.error('Failed to synchronize tool');
    } finally {
      setSyncingTool(null);
    }
  };

  const handleDisconnect = async (toolId) => {
    try {
      await api.post(`/api/integrations/${toolId}/disconnect`);
      message.success('Tool disconnected successfully');
      fetchConnectedTools();
    } catch (error) {
      message.error('Failed to disconnect tool');
    }
  };

  const handleSearch = async (value) => {
    try {
      setSearching(true);
      const response = await api.post('/api/integrations/perplexity-search', {
        query: value,
        key: '90320e7d-56ee-4748-8b2d-cc2b44ee9c8d'
      });
      setSearchResults(response.data.results);
      message.success('Search completed successfully');
    } catch (error) {
      message.error('Failed to perform search');
    } finally {
      setSearching(false);
    }
  };

  const renderToolStatus = (status) => {
    const statusColors = {
      connected: '#52c41a',
      disconnected: '#ff4d4f',
      error: '#faad14'
    };

    return (
      <Badge 
        status="processing" 
        color={statusColors[status.toLowerCase()]} 
        text={status} 
      />
    );
  };

  const renderLastSync = (lastSync) => {
    if (!lastSync) return 'Never';
    const date = new Date(lastSync);
    return date.toLocaleString();
  };

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <Tabs defaultActiveKey="tools">
          <TabPane 
            tab={
              <span>
                <ApiOutlined /> Connected Tools
              </span>
            }
            key="tools"
          >
            <div style={{ marginBottom: 24 }}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Title level={4}>Integration Tools</Title>
                <Text type="secondary">
                  Manage your connected tools and their workflow actions
                </Text>
              </Space>
            </div>

            <List
              loading={loading}
              dataSource={connectedTools}
              renderItem={tool => (
                <List.Item
                  actions={[
                    <Tooltip title="Sync tool">
                      <Button
                        icon={<SyncOutlined spin={syncingTool === tool.id} />}
                        onClick={() => handleSync(tool.id)}
                      >
                        Sync
                      </Button>
                    </Tooltip>,
                    <Tooltip title="Tool settings">
                      <Button icon={<SettingOutlined />}>
                        Settings
                      </Button>
                    </Tooltip>,
                    <Tooltip title="Disconnect tool">
                      <Button 
                        danger
                        icon={<DisconnectOutlined />}
                        onClick={() => handleDisconnect(tool.id)}
                      >
                        Disconnect
                      </Button>
                    </Tooltip>
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <img 
                        src={tool.icon} 
                        alt={tool.name} 
                        style={{ width: 40, height: 40 }} 
                      />
                    }
                    title={
                      <Space>
                        {tool.name}
                        {renderToolStatus(tool.status)}
                      </Space>
                    }
                    description={
                      <Space direction="vertical">
                        <Text>Category: {tool.category}</Text>
                        <Text>Last Sync: {renderLastSync(tool.lastSync)}</Text>
                        <Text>Available Actions: {tool.actions?.length || 0}</Text>
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          </TabPane>

          <TabPane
            tab={
              <span>
                <CheckCircleOutlined /> Workflow Actions
              </span>
            }
            key="actions"
          >
            <div style={{ marginBottom: 24 }}>
              <Search
                placeholder="Search 7,000+ apps and tools..."
                enterButton={<SearchOutlined />}
                size="large"
                style={{ maxWidth: 800 }}
              />
              <div style={{ marginTop: 16 }}>
                <Space size={16}>
                  <Button icon={<HomeOutlined />}>Apps</Button>
                  <Button icon={<ApiOutlined />}>Zapier products</Button>
                  <Button icon={<ToolOutlined />}>Built-in tools</Button>
                  <Button icon={<RobotOutlined />}>AI</Button>
                </Space>
              </div>
            </div>

            <Row gutter={[24, 24]}>
              <Col span={16}>
                <Card title="Your top apps" size="small">
                  <List
                    grid={{ gutter: 16, column: 4 }}
                    dataSource={topApps}
                    renderItem={app => (
                      <List.Item>
                        <Card hoverable size="small" style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: 24, marginBottom: 8 }}>{app.icon}</div>
                          <div style={{ fontSize: 12 }}>{app.name}</div>
                        </Card>
                      </List.Item>
                    )}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card title="Popular built-in tools" size="small">
                  <List
                    size="small"
                    dataSource={builtInTools}
                    renderItem={tool => (
                      <List.Item>
                        <Space>
                          <span style={{ fontSize: 16 }}>{tool.icon}</span>
                          <span>{tool.name}</span>
                        </Space>
                      </List.Item>
                    )}
                  />
                </Card>
              </Col>
            </Row>

            <Card title="New Zapier products" style={{ marginTop: 24 }} size="small">
              <List
                grid={{ gutter: 16, column: 3 }}
                dataSource={zapierProducts}
                renderItem={product => (
                  <List.Item>
                    <Card hoverable size="small">
                      <Space>
                        <span style={{ fontSize: 24 }}>{product.icon}</span>
                        <div>
                          <div style={{ fontWeight: 'bold' }}>{product.name}</div>
                          <div style={{ fontSize: 12, color: '#666' }}>{product.description}</div>
                        </div>
                      </Space>
                    </Card>
                  </List.Item>
                )}
              />
            </Card>

            <WorkflowActions />
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default IntegrationTools; 