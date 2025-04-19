import React, { useState, useEffect } from 'react';
import {
  Card,
  Form,
  Input,
  Button,
  message,
  Space,
  Divider,
  Typography,
  Tabs,
  Alert,
  Tag,
  Select,
  Row,
  Col,
  Collapse,
  Checkbox,
  Radio,
  Badge
} from 'antd';
import {
  LinkOutlined,
  DisconnectOutlined,
  SaveOutlined,
  SearchOutlined,
  FilterOutlined,
  StarOutlined,
  StarFilled
} from '@ant-design/icons';
import axios from 'axios';

const { Title } = Typography;
const { TabPane } = Tabs;

const AUTH_TYPES = {
  API_KEY: 'api_key',
  OAUTH: 'oauth',
  API_KEY_SECRET: 'api_key_secret',
  BASIC_AUTH: 'basic_auth',
  WEBHOOK: 'webhook',
  CUSTOM: 'custom',
  BOT_TOKEN: 'bot_token'
};

const CATEGORIES = {
  'Marketing Tools': {
    icon: '📧',
    subcategories: ['Email Marketing', 'Marketing Automation']
  }
};

const INTEGRATION_OPTIONS = [
  {
    value: 'flodesk',
    label: 'Flodesk',
    category: 'Marketing Tools',
    subcategory: 'Email Marketing',
    authType: AUTH_TYPES.API_KEY,
    fields: [
      {
        name: 'api_key',
        label: 'API Key',
        type: 'password',
        required: true
      }
    ]
  },
  {
    value: 'instantly',
    label: 'Instantly.ai',
    category: 'Marketing Tools',
    subcategory: 'Email Marketing',
    authType: AUTH_TYPES.API_KEY,
    fields: [
      {
        name: 'api_key',
        label: 'API Key',
        type: 'password',
        required: true
      }
    ]
  },
  {
    value: 'convertkit',
    label: 'ConvertKit',
    category: 'Marketing Tools',
    subcategory: 'Email Marketing',
    authType: AUTH_TYPES.API_KEY,
    fields: [
      {
        name: 'api_key',
        label: 'API Key',
        type: 'password',
        required: true
      }
    ]
  },
  {
    value: 'klaviyo',
    label: 'Klaviyo',
    category: 'Marketing Tools',
    subcategory: 'Email Marketing',
    authType: AUTH_TYPES.API_KEY,
    fields: [
      {
        name: 'api_key',
        label: 'API Key',
        type: 'password',
        required: true
      }
    ]
  },
  {
    value: 'activecampaign',
    label: 'ActiveCampaign',
    category: 'Marketing Tools',
    subcategory: 'Marketing Automation',
    authType: AUTH_TYPES.API_KEY,
    fields: [
      {
        name: 'api_key',
        label: 'API Key',
        type: 'password',
        required: true
      },
      {
        name: 'api_url',
        label: 'API URL',
        type: 'text',
        required: true
      }
    ]
  }
];

const ApiConnection = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [selectedIntegration, setSelectedIntegration] = useState(null);
  const [authType, setAuthType] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [connectedTools, setConnectedTools] = useState([]);
  const [toolsLoading, setToolsLoading] = useState(false);

  useEffect(() => {
    checkConnection();
    fetchConnectedTools();
  }, []);

  const checkConnection = async () => {
    try {
      const response = await axios.get('/api/users/integrations/connection/status');
      setConnectionStatus(response.data);
    } catch (error) {
      message.error('Failed to check connection status');
    }
  };

  const fetchConnectedTools = async () => {
    try {
      setToolsLoading(true);
      const response = await axios.get('/api/users/integrations/tools');
      setConnectedTools(response.data);
    } catch (error) {
      message.error('Failed to fetch connected tools');
    } finally {
      setToolsLoading(false);
    }
  };

  const handleIntegrationSelect = (value) => {
    const integration = INTEGRATION_OPTIONS.find(opt => opt.value === value);
    setSelectedIntegration(integration);
    setAuthType(integration.authType);
  };

  const handleApiSubmit = async (values) => {
    try {
      setLoading(true);
      const response = await axios.post('/api/users/integrations/connect', {
        ...values,
        integration_type: selectedIntegration.value,
        auth_type: authType
      });
      message.success('Connection established successfully');
      checkConnection();
      fetchConnectedTools();
    } catch (error) {
      message.error('Failed to establish connection');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthConnect = async () => {
    try {
      const response = await axios.get(`/api/users/integrations/oauth/authorize?integration=${selectedIntegration.value}`);
      window.location.href = response.data.authorizationUrl;
    } catch (error) {
      message.error('Failed to initiate OAuth connection');
    }
  };

  const handleDisconnect = async () => {
    try {
      await axios.post('/api/users/integrations/disconnect');
      message.success('Connection disconnected successfully');
      setConnectionStatus(null);
      setConnectedTools([]);
    } catch (error) {
      message.error('Failed to disconnect');
    }
  };

  const renderAuthForm = () => {
    if (!selectedIntegration) return null;

    if (authType === AUTH_TYPES.OAUTH) {
      return (
        <Space direction="vertical" style={{ width: '100%' }}>
          <Alert
            message="OAuth Connection"
            description={`Connect your ${selectedIntegration.label} account using OAuth for secure authentication.`}
            type="info"
            showIcon
          />
          <Button
            type="primary"
            icon={<LinkOutlined />}
            onClick={handleOAuthConnect}
          >
            Connect with OAuth
          </Button>
        </Space>
      );
    }

    return (
      <Form
        form={form}
        layout="vertical"
        onFinish={handleApiSubmit}
      >
        {selectedIntegration.fields.map(field => (
          <Form.Item
            key={field.name}
            name={field.name}
            label={field.label}
            rules={[{ required: field.required, message: `Please enter ${field.label}` }]}
          >
            <Input.Password placeholder={`Enter your ${selectedIntegration.label} ${field.label}`} />
          </Form.Item>
        ))}
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            icon={<LinkOutlined />}
            loading={loading}
          >
            Connect
          </Button>
        </Form.Item>
      </Form>
    );
  };

  const filteredIntegrations = INTEGRATION_OPTIONS.filter(integration => {
    const matchesSearch = integration.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      integration.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      integration.subcategory.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = !selectedCategory || integration.category === selectedCategory;
    const matchesSubcategory = !selectedSubcategory || integration.subcategory === selectedSubcategory;
    const matchesFavorites = !showFavorites || favorites.includes(integration.value);

    return matchesSearch && matchesCategory && matchesSubcategory && matchesFavorites;
  });

  const getAuthTypeColor = (type) => {
    const colors = {
      [AUTH_TYPES.OAUTH]: 'green',
      [AUTH_TYPES.API_KEY]: 'blue',
      [AUTH_TYPES.API_KEY_SECRET]: 'purple',
      [AUTH_TYPES.BASIC_AUTH]: 'orange',
      [AUTH_TYPES.WEBHOOK]: 'cyan',
      [AUTH_TYPES.CUSTOM]: 'magenta',
      [AUTH_TYPES.BOT_TOKEN]: 'gold'
    };
    return colors[type] || 'default';
  };

  const renderCategorySection = (category) => {
    const integrations = filteredIntegrations.filter(integration => 
      integration.category === category
    );

    if (integrations.length === 0) return null;

    const subcategories = [...new Set(integrations.map(i => i.subcategory))];

    return (
      <div key={category} className="category-section">
        <div className="category-header">
          <span className="category-icon">{CATEGORIES[category].icon}</span>
          <h3>{category}</h3>
          <div className="subcategory-tags">
            {subcategories.map(subcat => (
              <Tag
                key={subcat}
                color={selectedSubcategory === subcat ? 'blue' : 'default'}
                onClick={() => setSelectedSubcategory(subcat === selectedSubcategory ? null : subcat)}
              >
                {subcat}
              </Tag>
            ))}
          </div>
        </div>
        <Row gutter={[16, 16]}>
          {integrations.map(integration => (
            <Col xs={24} sm={12} md={8} lg={6} key={integration.value}>
              <Card
                hoverable
                className="integration-card"
                onClick={() => handleIntegrationSelect(integration.value)}
              >
                <div className="card-header">
                  <span className="integration-name">{integration.label}</span>
                  <Button
                    type="text"
                    icon={favorites.includes(integration.value) ? <StarFilled /> : <StarOutlined />}
                    onClick={(e) => {
                      e.stopPropagation();
                      setFavorites(prev => 
                        prev.includes(integration.value)
                          ? prev.filter(id => id !== integration.value)
                          : [...prev, integration.value]
                      );
                    }}
                  />
                </div>
                <div className="auth-type">
                  <Tag color={getAuthTypeColor(integration.authType)}>
                    {integration.authType}
                  </Tag>
                </div>
                <div className="subcategory">
                  <Tag color="default">{integration.subcategory}</Tag>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    );
  };

  return (
    <div className="api-connection-container">
      <Card>
        <div className="header-section">
          <Title level={4}>Integration Connection</Title>
          <div className="header-actions">
            <Input.Search
              placeholder="Search integrations..."
              onChange={e => setSearchQuery(e.target.value)}
              prefix={<SearchOutlined />}
              style={{ width: 300, marginRight: 16 }}
            />
            <Button
              icon={<FilterOutlined />}
              onClick={() => setShowFavorites(!showFavorites)}
            >
              {showFavorites ? 'Show All' : 'Show Favorites'}
            </Button>
          </div>
        </div>
        <Divider />

        {connectionStatus && (
          <Alert
            message="Connection Status"
            description={
              <Space direction="vertical">
                <div>
                  <strong>Integration:</strong> {connectionStatus.integration_name}
                </div>
                <div>
                  <strong>Type:</strong> {connectionStatus.type}
                </div>
                <div>
                  <strong>Status:</strong> <Tag color="success">Connected</Tag>
                </div>
                <div>
                  <strong>Last Sync:</strong> {new Date(connectionStatus.last_sync).toLocaleString()}
                </div>
              </Space>
            }
            type="success"
            action={
              <Button
                type="primary"
                danger
                icon={<DisconnectOutlined />}
                onClick={handleDisconnect}
              >
                Disconnect
              </Button>
            }
            style={{ marginBottom: 24 }}
          />
        )}

        <div className="categories-container">
          {Object.keys(CATEGORIES).map(category => (
            <div
              key={category}
              className={`category-tab ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category === selectedCategory ? null : category)}
            >
              <span className="category-icon">{CATEGORIES[category].icon}</span>
              <span className="category-name">{category}</span>
            </div>
          ))}
        </div>

        <div className="integrations-grid">
          {selectedCategory ? (
            renderCategorySection(selectedCategory)
          ) : (
            Object.keys(CATEGORIES).map(category => renderCategorySection(category))
          )}
        </div>

        {selectedIntegration && (
          <div className="connection-form">
            <Divider />
            <Tabs activeKey={authType}>
              <TabPane tab={authType === AUTH_TYPES.OAUTH ? 'OAuth Connection' : 'API Connection'} key={authType}>
                {renderAuthForm()}
              </TabPane>
            </Tabs>
          </div>
        )}
      </Card>

      <style jsx>{`
        .api-connection-container {
          padding: 24px;
        }
        .header-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }
        .header-actions {
          display: flex;
          align-items: center;
        }
        .categories-container {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 24px;
        }
        .category-tab {
          display: flex;
          align-items: center;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
          background: #f5f5f5;
          transition: all 0.3s;
        }
        .category-tab:hover {
          background: #e6f7ff;
        }
        .category-tab.active {
          background: #1890ff;
          color: white;
        }
        .category-icon {
          margin-right: 8px;
          font-size: 18px;
        }
        .category-section {
          margin-bottom: 32px;
        }
        .category-header {
          display: flex;
          align-items: center;
          margin-bottom: 16px;
        }
        .category-header h3 {
          margin: 0 16px 0 8px;
        }
        .subcategory-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .integration-card {
          height: 100%;
        }
        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .integration-name {
          font-weight: 500;
        }
        .auth-type {
          margin-top: 8px;
        }
        .subcategory {
          margin-top: 8px;
        }
        .connection-form {
          margin-top: 24px;
        }
      `}</style>
    </div>
  );
};

export default ApiConnection; 