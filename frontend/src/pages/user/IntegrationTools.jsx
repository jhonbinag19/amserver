import React, { useState, useEffect } from 'react';
import { Card, Tabs, List, Tag, Button, Space, Typography, Badge, message, Tooltip, Input, Row, Col, Modal, Steps, Select, Divider } from 'antd';
import { 
  ApiOutlined, 
  SyncOutlined, 
  DisconnectOutlined, 
  SettingOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  SearchOutlined,
  PlusOutlined,
  ArrowRightOutlined
} from '@ant-design/icons';
import WorkflowActions from '../../components/workflow/WorkflowActions';
import api from '../../utils/axios';

const { TabPane } = Tabs;
const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;
const { Step } = Steps;

const IntegrationTools = () => {
  const [connectedTools, setConnectedTools] = useState([]);
  const [loading, setLoading] = useState(false);
  const [syncingTool, setSyncingTool] = useState(null);
  const [workflowModalVisible, setWorkflowModalVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedTool, setSelectedTool] = useState(null);
  const [selectedTrigger, setSelectedTrigger] = useState(null);
  const [selectedAction, setSelectedAction] = useState(null);

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

  // Sample triggers and actions for each tool
  const toolActions = {
    'Facebook Lead Ads': {
      triggers: [
        { name: 'New Comment on Ad', description: 'Triggers when a new comment on an Ad is created', type: 'polling' },
        { name: 'New Lead', description: 'Triggers when a new lead is created', type: 'instant' }
      ],
      actions: [
        { name: 'Create Lead', description: 'Creates a new lead in Facebook' },
        { name: 'Update Lead', description: 'Updates an existing lead' }
      ]
    },
    'Flodesk': {
      triggers: [
        { name: 'New Subscriber', description: 'Triggers when a new subscriber is added' },
        { name: 'Form Submission', description: 'Triggers when a form is submitted' }
      ],
      actions: [
        { name: 'Add to Segment', description: 'Adds a subscriber to a segment' },
        { name: 'Create/Update Subscriber', description: 'Creates or updates a subscriber' },
        { name: 'Remove from Segment', description: 'Removes a subscriber from a segment' }
      ]
    },
    'Twilio': {
      triggers: [
        { name: 'New SMS Received', description: 'Triggers when a new SMS is received' },
        { name: 'Call Status Change', description: 'Triggers when a call status changes' }
      ],
      actions: [
        { name: 'Send SMS', description: 'Sends an SMS message' },
        { name: 'Make Call', description: 'Initiates a phone call' }
      ]
    }
  };

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

  const handleCreateWorkflow = () => {
    setWorkflowModalVisible(true);
    setCurrentStep(0);
  };

  const renderTriggerSelection = () => {
    if (!selectedTool) return null;
    const tool = toolActions[selectedTool];
    if (!tool) return null;

    return (
      <div style={{ marginTop: 16 }}>
        <Title level={5}>Select Trigger Event</Title>
        <Search
          placeholder="Search events"
          style={{ marginBottom: 16 }}
        />
        <List
          dataSource={tool.triggers}
          renderItem={trigger => (
            <List.Item
              className={selectedTrigger?.name === trigger.name ? 'selected-item' : ''}
              onClick={() => setSelectedTrigger(trigger)}
              style={{ cursor: 'pointer', padding: '12px' }}
            >
              <List.Item.Meta
                title={trigger.name}
                description={trigger.description}
              />
              {trigger.type && (
                <Tag color={trigger.type === 'instant' ? 'green' : 'blue'}>
                  {trigger.type}
                </Tag>
              )}
            </List.Item>
          )}
        />
      </div>
    );
  };

  const renderActionSelection = () => {
    if (!selectedTool) return null;
    const tool = toolActions[selectedTool];
    if (!tool) return null;

    return (
      <div style={{ marginTop: 16 }}>
        <Title level={5}>Select Action Event</Title>
        <Search
          placeholder="Search actions"
          style={{ marginBottom: 16 }}
        />
        <List
          dataSource={tool.actions}
          renderItem={action => (
            <List.Item
              className={selectedAction?.name === action.name ? 'selected-item' : ''}
              onClick={() => setSelectedAction(action)}
              style={{ cursor: 'pointer', padding: '12px' }}
            >
              <List.Item.Meta
                title={action.name}
                description={action.description}
              />
            </List.Item>
          )}
        />
      </div>
    );
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
              <Space direction="vertical" style={{ width: '100%' }}>
                <Space>
                  <Button 
                    type="primary" 
                    icon={<PlusOutlined />}
                    onClick={handleCreateWorkflow}
                  >
                    Create Workflow
                  </Button>
                  <Search
                    placeholder="Search workflows..."
                    style={{ width: 300 }}
                  />
                </Space>
                <Text type="secondary">
                  Create and manage your automated workflows using your connected tools
                </Text>
              </Space>
            </div>

            <List
              grid={{ gutter: 16, column: 3 }}
              dataSource={connectedTools}
              renderItem={tool => (
                <List.Item>
                  <Card size="small" hoverable>
                    <Space align="start">
                      <img 
                        src={tool.icon} 
                        alt={tool.name} 
                        style={{ width: 40, height: 40 }} 
                      />
                      <div>
                        <div style={{ fontWeight: 'bold' }}>{tool.name}</div>
                        <Text type="secondary">
                          {toolActions[tool.name]?.triggers.length || 0} Triggers, {' '}
                          {toolActions[tool.name]?.actions.length || 0} Actions
                        </Text>
                      </div>
                    </Space>
                  </Card>
                </List.Item>
              )}
            />
          </TabPane>
        </Tabs>
      </Card>

      <Modal
        title="Create New Workflow"
        open={workflowModalVisible}
        onCancel={() => {
          setWorkflowModalVisible(false);
          setSelectedTool(null);
          setSelectedTrigger(null);
          setSelectedAction(null);
          setCurrentStep(0);
        }}
        width={800}
        footer={[
          <Button key="back" onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}>
            Previous
          </Button>,
          <Button 
            key="next" 
            type="primary"
            onClick={() => setCurrentStep(currentStep + 1)}
            disabled={
              (currentStep === 0 && !selectedTool) ||
              (currentStep === 1 && !selectedTrigger) ||
              (currentStep === 2 && !selectedAction)
            }
          >
            {currentStep === 2 ? 'Create' : 'Next'}
          </Button>
        ]}
      >
        <Steps current={currentStep} style={{ marginBottom: 24 }}>
          <Step title="Select Tool" />
          <Step title="Choose Trigger" />
          <Step title="Add Action" />
        </Steps>

        {currentStep === 0 && (
          <div>
            <Title level={5}>Select Tool</Title>
            <Select
              style={{ width: '100%' }}
              placeholder="Choose a tool"
              value={selectedTool}
              onChange={setSelectedTool}
            >
              {connectedTools.map(tool => (
                <Option key={tool.name} value={tool.name}>
                  <Space>
                    <img 
                      src={tool.icon} 
                      alt={tool.name} 
                      style={{ width: 20, height: 20 }} 
                    />
                    {tool.name}
                  </Space>
                </Option>
              ))}
            </Select>
            {renderTriggerSelection()}
          </div>
        )}

        {currentStep === 1 && renderTriggerSelection()}
        {currentStep === 2 && renderActionSelection()}
      </Modal>
    </div>
  );
};

export default IntegrationTools; 