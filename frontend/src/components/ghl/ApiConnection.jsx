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
  'CRM & Sales': {
    icon: '👥',
    subcategories: ['CRM', 'Contact Management', 'Sales Pipeline', 'Lead Generation']
  },
  'Marketing & Email': {
    icon: '📧',
    subcategories: ['Email Marketing', 'Marketing Automation', 'Social Media Marketing', 'Ads & Conversion']
  },
  'Payment & Finance': {
    icon: '💰',
    subcategories: ['Payment Processing', 'Accounting', 'Invoicing', 'Taxes']
  },
  'Communication': {
    icon: '💬',
    subcategories: ['Email', 'SMS', 'Team Chat', 'Video Conferencing']
  },
  'Project Management': {
    icon: '📋',
    subcategories: ['Task Management', 'Project Tracking', 'Team Collaboration', 'Time Tracking']
  },
  'Analytics & Tracking': {
    icon: '📊',
    subcategories: ['Web Analytics', 'User Tracking', 'Conversion Tracking', 'Performance Monitoring']
  },
  'E-commerce': {
    icon: '🛒',
    subcategories: ['Online Store', 'Inventory Management', 'Order Processing', 'Customer Support']
  },
  'Forms & Surveys': {
    icon: '📝',
    subcategories: ['Form Builder', 'Survey Tools', 'Lead Capture', 'Feedback Collection']
  },
  'File Storage': {
    icon: '📁',
    subcategories: ['Cloud Storage', 'Document Management', 'File Sharing', 'Backup']
  },
  'Calendar & Scheduling': {
    icon: '📅',
    subcategories: ['Appointment Scheduling', 'Calendar Management', 'Meeting Booking', 'Availability']
  }
};

const INTEGRATION_OPTIONS = [
  // CRM & Sales
  {
    value: 'gohighlevel',
    label: 'GoHighLevel',
    category: 'CRM & Sales',
    subcategory: 'CRM',
    authType: AUTH_TYPES.OAUTH,
    fields: []
  },
  {
    value: 'hubspot',
    label: 'HubSpot',
    category: 'CRM & Sales',
    subcategory: 'CRM',
    authType: AUTH_TYPES.OAUTH,
    fields: []
  },
  {
    value: 'salesforce',
    label: 'Salesforce',
    category: 'CRM & Sales',
    subcategory: 'CRM',
    authType: AUTH_TYPES.OAUTH,
    fields: []
  },
  {
    value: 'pipedrive',
    label: 'Pipedrive',
    category: 'CRM & Sales',
    subcategory: 'Sales Pipeline',
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
    value: 'zoho_crm',
    label: 'Zoho CRM',
    category: 'CRM & Sales',
    subcategory: 'CRM',
    authType: AUTH_TYPES.OAUTH,
    fields: []
  },
  {
    value: 'freshsales',
    label: 'Freshsales',
    category: 'CRM & Sales',
    subcategory: 'CRM',
    authType: AUTH_TYPES.API_KEY,
    fields: [
      {
        name: 'api_key',
        label: 'API Key',
        type: 'password',
        required: true
      },
      {
        name: 'domain',
        label: 'Domain',
        type: 'text',
        required: true
      }
    ]
  },
  {
    value: 'insightly',
    label: 'Insightly',
    category: 'CRM & Sales',
    subcategory: 'CRM',
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

  // Marketing & Email
  {
    value: 'mailchimp',
    label: 'Mailchimp',
    category: 'Marketing & Email',
    subcategory: 'Email Marketing',
    authType: AUTH_TYPES.OAUTH,
    fields: []
  },
  {
    value: 'activecampaign',
    label: 'ActiveCampaign',
    category: 'Marketing & Email',
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
  },
  {
    value: 'klaviyo',
    label: 'Klaviyo',
    category: 'Marketing & Email',
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
    category: 'Marketing & Email',
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
    value: 'drip',
    label: 'Drip',
    category: 'Marketing & Email',
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
    value: 'sendinblue',
    label: 'Sendinblue',
    category: 'Marketing & Email',
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

  // Payment & Finance
  {
    value: 'stripe',
    label: 'Stripe',
    category: 'Payment & Finance',
    subcategory: 'Payment Processing',
    authType: AUTH_TYPES.API_KEY_SECRET,
    fields: [
      {
        name: 'api_key',
        label: 'API Key',
        type: 'password',
        required: true
      },
      {
        name: 'api_secret',
        label: 'API Secret',
        type: 'password',
        required: true
      }
    ]
  },
  {
    value: 'paypal',
    label: 'PayPal',
    category: 'Payment & Finance',
    subcategory: 'Payment Processing',
    authType: AUTH_TYPES.API_KEY_SECRET,
    fields: [
      {
        name: 'client_id',
        label: 'Client ID',
        type: 'password',
        required: true
      },
      {
        name: 'client_secret',
        label: 'Client Secret',
        type: 'password',
        required: true
      }
    ]
  },
  {
    value: 'square',
    label: 'Square',
    category: 'Payment & Finance',
    subcategory: 'Payment Processing',
    authType: AUTH_TYPES.OAUTH,
    fields: []
  },
  {
    value: 'quickbooks',
    label: 'QuickBooks',
    category: 'Payment & Finance',
    subcategory: 'Accounting',
    authType: AUTH_TYPES.OAUTH,
    fields: []
  },
  {
    value: 'xero',
    label: 'Xero',
    category: 'Payment & Finance',
    subcategory: 'Accounting',
    authType: AUTH_TYPES.OAUTH,
    fields: []
  },

  // Communication
  {
    value: 'twilio',
    label: 'Twilio',
    category: 'Communication',
    subcategory: 'SMS',
    authType: AUTH_TYPES.API_KEY_SECRET,
    fields: [
      {
        name: 'account_sid',
        label: 'Account SID',
        type: 'password',
        required: true
      },
      {
        name: 'auth_token',
        label: 'Auth Token',
        type: 'password',
        required: true
      }
    ]
  },
  {
    value: 'slack',
    label: 'Slack',
    category: 'Communication',
    subcategory: 'Team Chat',
    authType: AUTH_TYPES.OAUTH,
    fields: []
  },
  {
    value: 'discord',
    label: 'Discord',
    category: 'Communication',
    subcategory: 'Team Chat',
    authType: AUTH_TYPES.BOT_TOKEN,
    fields: [
      {
        name: 'bot_token',
        label: 'Bot Token',
        type: 'password',
        required: true
      }
    ]
  },
  {
    value: 'telegram',
    label: 'Telegram',
    category: 'Communication',
    subcategory: 'Team Chat',
    authType: AUTH_TYPES.BOT_TOKEN,
    fields: [
      {
        name: 'bot_token',
        label: 'Bot Token',
        type: 'password',
        required: true
      }
    ]
  },

  // Social Media
  {
    value: 'facebook',
    label: 'Facebook',
    category: 'Social Media',
    subcategory: 'Social Media Marketing',
    authType: AUTH_TYPES.OAUTH,
    fields: []
  },
  {
    value: 'instagram',
    label: 'Instagram',
    category: 'Social Media',
    subcategory: 'Social Media Marketing',
    authType: AUTH_TYPES.OAUTH,
    fields: []
  },
  {
    value: 'linkedin',
    label: 'LinkedIn',
    category: 'Social Media',
    subcategory: 'Social Media Marketing',
    authType: AUTH_TYPES.OAUTH,
    fields: []
  },
  {
    value: 'twitter',
    label: 'Twitter',
    category: 'Social Media',
    subcategory: 'Social Media Marketing',
    authType: AUTH_TYPES.API_KEY_SECRET,
    fields: [
      {
        name: 'api_key',
        label: 'API Key',
        type: 'password',
        required: true
      },
      {
        name: 'api_secret',
        label: 'API Secret',
        type: 'password',
        required: true
      }
    ]
  },
  {
    value: 'tiktok',
    label: 'TikTok',
    category: 'Social Media',
    subcategory: 'Social Media Marketing',
    authType: AUTH_TYPES.OAUTH,
    fields: []
  },

  // Project Management
  {
    value: 'asana',
    label: 'Asana',
    category: 'Project Management',
    subcategory: 'Task Management',
    authType: AUTH_TYPES.OAUTH,
    fields: []
  },
  {
    value: 'trello',
    label: 'Trello',
    category: 'Project Management',
    subcategory: 'Task Management',
    authType: AUTH_TYPES.OAUTH,
    fields: []
  },
  {
    value: 'monday',
    label: 'Monday.com',
    category: 'Project Management',
    subcategory: 'Project Tracking',
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
    value: 'clickup',
    label: 'ClickUp',
    category: 'Project Management',
    subcategory: 'Project Tracking',
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

  // Analytics & Tracking
  {
    value: 'google_analytics',
    label: 'Google Analytics',
    category: 'Analytics & Tracking',
    subcategory: 'Web Analytics',
    authType: AUTH_TYPES.OAUTH,
    fields: []
  },
  {
    value: 'facebook_pixel',
    label: 'Facebook Pixel',
    category: 'Analytics & Tracking',
    subcategory: 'Conversion Tracking',
    authType: AUTH_TYPES.CUSTOM,
    fields: [
      {
        name: 'pixel_id',
        label: 'Pixel ID',
        type: 'text',
        required: true
      }
    ]
  },
  {
    value: 'mixpanel',
    label: 'Mixpanel',
    category: 'Analytics & Tracking',
    subcategory: 'User Tracking',
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
    value: 'amplitude',
    label: 'Amplitude',
    category: 'Analytics & Tracking',
    subcategory: 'User Tracking',
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

  // E-commerce
  {
    value: 'shopify',
    label: 'Shopify',
    category: 'E-commerce',
    subcategory: 'Online Store',
    authType: AUTH_TYPES.API_KEY,
    fields: [
      {
        name: 'api_key',
        label: 'API Key',
        type: 'password',
        required: true
      },
      {
        name: 'store_name',
        label: 'Store Name',
        type: 'text',
        required: true
      }
    ]
  },
  {
    value: 'woocommerce',
    label: 'WooCommerce',
    category: 'E-commerce',
    subcategory: 'Online Store',
    authType: AUTH_TYPES.API_KEY,
    fields: [
      {
        name: 'consumer_key',
        label: 'Consumer Key',
        type: 'password',
        required: true
      },
      {
        name: 'consumer_secret',
        label: 'Consumer Secret',
        type: 'password',
        required: true
      }
    ]
  },
  {
    value: 'bigcommerce',
    label: 'BigCommerce',
    category: 'E-commerce',
    subcategory: 'Online Store',
    authType: AUTH_TYPES.API_KEY,
    fields: [
      {
        name: 'client_id',
        label: 'Client ID',
        type: 'password',
        required: true
      },
      {
        name: 'client_secret',
        label: 'Client Secret',
        type: 'password',
        required: true
      }
    ]
  },

  // Forms & Surveys
  {
    value: 'typeform',
    label: 'Typeform',
    category: 'Forms & Surveys',
    subcategory: 'Form Builder',
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
    value: 'google_forms',
    label: 'Google Forms',
    category: 'Forms & Surveys',
    subcategory: 'Form Builder',
    authType: AUTH_TYPES.OAUTH,
    fields: []
  },
  {
    value: 'jotform',
    label: 'JotForm',
    category: 'Forms & Surveys',
    subcategory: 'Form Builder',
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

  // File Storage
  {
    value: 'google_drive',
    label: 'Google Drive',
    category: 'File Storage',
    subcategory: 'Cloud Storage',
    authType: AUTH_TYPES.OAUTH,
    fields: []
  },
  {
    value: 'dropbox',
    label: 'Dropbox',
    category: 'File Storage',
    subcategory: 'Cloud Storage',
    authType: AUTH_TYPES.OAUTH,
    fields: []
  },
  {
    value: 'onedrive',
    label: 'OneDrive',
    category: 'File Storage',
    subcategory: 'Cloud Storage',
    authType: AUTH_TYPES.OAUTH,
    fields: []
  },

  // Calendar & Scheduling
  {
    value: 'google_calendar',
    label: 'Google Calendar',
    category: 'Calendar & Scheduling',
    subcategory: 'Calendar Management',
    authType: AUTH_TYPES.OAUTH,
    fields: []
  },
  {
    value: 'calendly',
    label: 'Calendly',
    category: 'Calendar & Scheduling',
    subcategory: 'Appointment Scheduling',
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
    value: 'acuity',
    label: 'Acuity Scheduling',
    category: 'Calendar & Scheduling',
    subcategory: 'Appointment Scheduling',
    authType: AUTH_TYPES.API_KEY,
    fields: [
      {
        name: 'api_key',
        label: 'API Key',
        type: 'password',
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

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      const response = await axios.get('/api/ghl/organizations/:organizationId/connection-status');
      setConnectionStatus(response.data);
    } catch (error) {
      message.error('Failed to check connection status');
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
      await axios.post('/api/ghl/organizations/:organizationId/connect', {
        ...values,
        integration_type: selectedIntegration.value,
        auth_type: authType
      });
      message.success('Connection established successfully');
      checkConnection();
    } catch (error) {
      message.error('Failed to establish connection');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthConnect = async () => {
    try {
      const response = await axios.get(`/api/ghl/oauth/authorize?integration=${selectedIntegration.value}`);
      window.location.href = response.data.authorizationUrl;
    } catch (error) {
      message.error('Failed to initiate OAuth connection');
    }
  };

  const handleDisconnect = async () => {
    try {
      await axios.post('/api/ghl/organizations/:organizationId/disconnect');
      message.success('Connection disconnected successfully');
      setConnectionStatus(null);
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