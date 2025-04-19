import React, { useState, useEffect } from 'react';
import { Card, Tabs, List, Tag, Button, Space, Typography, Badge, message, Tooltip, Input, Row, Col, Modal, Steps, Select, Divider, Collapse } from 'antd';
import { 
  ApiOutlined, 
  SyncOutlined, 
  DisconnectOutlined, 
  SettingOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  SearchOutlined,
  PlusOutlined
} from '@ant-design/icons';
import api from '../../utils/axios';

const { TabPane } = Tabs;
const { Title, Text } = Typography;
const { Search } = Input;
const { Panel } = Collapse;

const BUILT_IN_ACTIONS = {
  'Flodesk': [
    { 
      name: 'Add Subscriber',
      description: 'Add a new subscriber to a Flodesk list',
      type: 'action',
      fields: ['email', 'firstName', 'lastName', 'listId'],
      tool: 'flodesk'
    },
    { 
      name: 'Update Subscriber',
      description: 'Update subscriber information',
      type: 'action',
      fields: ['email', 'updateFields'],
      tool: 'flodesk'
    },
    { 
      name: 'Remove Subscriber',
      description: 'Remove a subscriber from a list',
      type: 'action',
      fields: ['email', 'listId'],
      tool: 'flodesk'
    },
    { 
      name: 'Add Tag',
      description: 'Add a tag to a subscriber',
      type: 'action',
      fields: ['email', 'tag'],
      tool: 'flodesk'
    },
    { 
      name: 'Remove Tag',
      description: 'Remove a tag from a subscriber',
      type: 'action',
      fields: ['email', 'tag'],
      tool: 'flodesk'
    }
  ],
  'ActiveCampaign': [
    {
      name: 'Create Contact',
      description: 'Create a new contact in ActiveCampaign',
      type: 'action',
      fields: ['email', 'firstName', 'lastName', 'phone', 'tags'],
      tool: 'activecampaign'
    },
    {
      name: 'Update Contact',
      description: 'Update an existing contact',
      type: 'action',
      fields: ['email', 'updateFields'],
      tool: 'activecampaign'
    },
    {
      name: 'Add Contact to List',
      description: 'Add a contact to a specific list',
      type: 'action',
      fields: ['email', 'listId'],
      tool: 'activecampaign'
    },
    {
      name: 'Add Contact to Automation',
      description: 'Add a contact to an automation',
      type: 'action',
      fields: ['email', 'automationId'],
      tool: 'activecampaign'
    },
    {
      name: 'Add Tag to Contact',
      description: 'Add a tag to a contact',
      type: 'action',
      fields: ['email', 'tag'],
      tool: 'activecampaign'
    }
  ],
  'Instantly.ai': [
    {
      name: 'Create Lead',
      description: 'Create a new lead in Instantly.ai',
      type: 'action',
      fields: ['email', 'firstName', 'lastName', 'company', 'customFields'],
      tool: 'instantly'
    },
    {
      name: 'Update Lead',
      description: 'Update an existing lead',
      type: 'action',
      fields: ['email', 'updateFields'],
      tool: 'instantly'
    },
    {
      name: 'Add Lead to Campaign',
      description: 'Add a lead to a specific campaign',
      type: 'action',
      fields: ['email', 'campaignId'],
      tool: 'instantly'
    },
    {
      name: 'Update Lead Status',
      description: 'Update the status of a lead',
      type: 'action',
      fields: ['email', 'status'],
      tool: 'instantly'
    }
  ],
  'ConvertKit': [
    {
      name: 'Add Subscriber',
      description: 'Add a new subscriber to ConvertKit',
      type: 'action',
      fields: ['email', 'firstName', 'lastName', 'tags'],
      tool: 'convertkit'
    },
    {
      name: 'Update Subscriber',
      description: 'Update subscriber information',
      type: 'action',
      fields: ['email', 'updateFields'],
      tool: 'convertkit'
    },
    {
      name: 'Add Tag',
      description: 'Add a tag to a subscriber',
      type: 'action',
      fields: ['email', 'tag'],
      tool: 'convertkit'
    },
    {
      name: 'Remove Tag',
      description: 'Remove a tag from a subscriber',
      type: 'action',
      fields: ['email', 'tag'],
      tool: 'convertkit'
    },
    {
      name: 'Add to Sequence',
      description: 'Add a subscriber to a sequence',
      type: 'action',
      fields: ['email', 'sequenceId'],
      tool: 'convertkit'
    }
  ],
  'Klaviyo': [
    {
      name: 'Create Profile',
      description: 'Create a new profile in Klaviyo',
      type: 'action',
      fields: ['email', 'firstName', 'lastName', 'phone', 'customProperties'],
      tool: 'klaviyo'
    },
    {
      name: 'Update Profile',
      description: 'Update an existing profile',
      type: 'action',
      fields: ['email', 'updateFields'],
      tool: 'klaviyo'
    },
    {
      name: 'Add to List',
      description: 'Add a profile to a list',
      type: 'action',
      fields: ['email', 'listId'],
      tool: 'klaviyo'
    },
    {
      name: 'Add to Segment',
      description: 'Add a profile to a segment',
      type: 'action',
      fields: ['email', 'segmentId'],
      tool: 'klaviyo'
    },
    {
      name: 'Track Event',
      description: 'Track a custom event',
      type: 'action',
      fields: ['email', 'eventName', 'eventProperties'],
      tool: 'klaviyo'
    }
  ]
};

const BUILT_IN_TRIGGERS = {
  'Flodesk': [
    {
      name: 'New Subscriber',
      description: 'Triggers when a new subscriber is added',
      type: 'trigger',
      fields: ['listId'],
      tool: 'flodesk'
    },
    {
      name: 'Subscriber Tagged',
      description: 'Triggers when a subscriber is tagged',
      type: 'trigger',
      fields: ['tag'],
      tool: 'flodesk'
    }
  ],
  'ActiveCampaign': [
    {
      name: 'New Contact',
      description: 'Triggers when a new contact is created',
      type: 'trigger',
      fields: ['listId'],
      tool: 'activecampaign'
    },
    {
      name: 'Contact Tagged',
      description: 'Triggers when a contact is tagged',
      type: 'trigger',
      fields: ['tag'],
      tool: 'activecampaign'
    },
    {
      name: 'Automation Started',
      description: 'Triggers when an automation starts',
      type: 'trigger',
      fields: ['automationId'],
      tool: 'activecampaign'
    }
  ],
  'Instantly.ai': [
    {
      name: 'New Lead',
      description: 'Triggers when a new lead is created',
      type: 'trigger',
      fields: ['campaignId'],
      tool: 'instantly'
    },
    {
      name: 'Lead Status Changed',
      description: 'Triggers when lead status changes',
      type: 'trigger',
      fields: ['status'],
      tool: 'instantly'
    }
  ],
  'ConvertKit': [
    {
      name: 'New Subscriber',
      description: 'Triggers when a new subscriber is added',
      type: 'trigger',
      fields: ['formId'],
      tool: 'convertkit'
    },
    {
      name: 'Subscriber Tagged',
      description: 'Triggers when a subscriber is tagged',
      type: 'trigger',
      fields: ['tag'],
      tool: 'convertkit'
    }
  ],
  'Klaviyo': [
    {
      name: 'New Profile',
      description: 'Triggers when a new profile is created',
      type: 'trigger',
      fields: ['listId'],
      tool: 'klaviyo'
    },
    {
      name: 'Profile Updated',
      description: 'Triggers when a profile is updated',
      type: 'trigger',
      fields: ['updateFields'],
      tool: 'klaviyo'
    },
    {
      name: 'Custom Event',
      description: 'Triggers when a custom event occurs',
      type: 'trigger',
      fields: ['eventName'],
      tool: 'klaviyo'
    }
  ]
};

const IntegrationTools = () => {
  const [connectedTools, setConnectedTools] = useState([]);
  const [loading, setLoading] = useState(false);
  const [syncingTool, setSyncingTool] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);

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

  const renderActionCard = (action) => (
    <Card 
      size="small" 
      title={action.name}
      extra={<Tag color={action.type === 'trigger' ? 'blue' : 'green'}>{action.type}</Tag>}
      style={{ marginBottom: 16 }}
    >
      <p>{action.description}</p>
      {action.fields.length > 0 && (
        <div style={{ marginTop: 8 }}>
          <Text type="secondary">Required fields: </Text>
          {action.fields.map(field => (
            <Tag key={field}>{field}</Tag>
          ))}
        </div>
      )}
    </Card>
  );

  const getFilteredActions = () => {
    const filtered = searchQuery
      ? Object.entries(BUILT_IN_ACTIONS).reduce((acc, [category, actions]) => {
          const filtered = actions.filter(action => 
            (action.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            action.description.toLowerCase().includes(searchQuery.toLowerCase())) &&
            connectedTools.some(tool => tool.name.toLowerCase() === action.tool.toLowerCase())
          );
          if (filtered.length > 0) {
            acc[category] = filtered;
          }
          return acc;
        }, {})
      : Object.entries(BUILT_IN_ACTIONS).reduce((acc, [category, actions]) => {
          const filtered = actions.filter(action => 
            connectedTools.some(tool => tool.name.toLowerCase() === action.tool.toLowerCase())
          );
          if (filtered.length > 0) {
            acc[category] = filtered;
          }
          return acc;
        }, {});

    return filtered;
  };

  const getFilteredTriggers = () => {
    const filtered = searchQuery
      ? Object.entries(BUILT_IN_TRIGGERS).reduce((acc, [category, triggers]) => {
          const filtered = triggers.filter(trigger => 
            (trigger.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            trigger.description.toLowerCase().includes(searchQuery.toLowerCase())) &&
            connectedTools.some(tool => tool.name.toLowerCase() === trigger.tool.toLowerCase())
          );
          if (filtered.length > 0) {
            acc[category] = filtered;
          }
          return acc;
        }, {})
      : Object.entries(BUILT_IN_TRIGGERS).reduce((acc, [category, triggers]) => {
          const filtered = triggers.filter(trigger => 
            connectedTools.some(tool => tool.name.toLowerCase() === trigger.tool.toLowerCase())
          );
          if (filtered.length > 0) {
            acc[category] = filtered;
          }
          return acc;
        }, {});

    return filtered;
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
                        <Badge 
                          status={tool.status === 'connected' ? 'success' : 'error'} 
                          text={tool.status} 
                        />
                      </Space>
                    }
                    description={
                      <Space direction="vertical">
                        <Text>Category: {tool.category}</Text>
                        <Text>Last Sync: {tool.lastSync ? new Date(tool.lastSync).toLocaleString() : 'Never'}</Text>
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
                  <Search
                    placeholder="Search actions and triggers..."
                    onChange={e => setSearchQuery(e.target.value)}
                    style={{ width: 300 }}
                  />
                </Space>
                <Text type="secondary">
                  Built-in actions and triggers that automatically sync with connected tools
                </Text>
              </Space>
            </div>

            <Row gutter={24}>
              <Col span={12}>
                <Title level={4}>Actions</Title>
                <Collapse defaultActiveKey={Object.keys(BUILT_IN_ACTIONS)}>
                  {Object.entries(getFilteredActions()).map(([category, actions]) => (
                    <Panel header={category} key={category}>
                      {actions.map(action => renderActionCard(action))}
                    </Panel>
                  ))}
                </Collapse>
              </Col>
              <Col span={12}>
                <Title level={4}>Triggers</Title>
                <Collapse defaultActiveKey={Object.keys(BUILT_IN_TRIGGERS)}>
                  {Object.entries(getFilteredTriggers()).map(([category, triggers]) => (
                    <Panel header={category} key={category}>
                      {triggers.map(trigger => renderActionCard(trigger))}
                    </Panel>
                  ))}
                </Collapse>
              </Col>
            </Row>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default IntegrationTools; 