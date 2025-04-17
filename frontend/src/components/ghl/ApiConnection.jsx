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
  Select
} from 'antd';
import { LinkOutlined, DisconnectOutlined, SaveOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Title } = Typography;
const { TabPane } = Tabs;

const AUTH_TYPES = {
  API_KEY: 'api_key',
  OAUTH: 'oauth',
  API_KEY_SECRET: 'api_key_secret'
};

const INTEGRATION_OPTIONS = [
  {
    value: 'flodesk',
    label: 'Flodesk',
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
    value: 'gohighlevel',
    label: 'GoHighLevel',
    authType: AUTH_TYPES.OAUTH,
    fields: []
  },
  {
    value: 'stripe',
    label: 'Stripe',
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
  }
];

const ApiConnection = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [selectedIntegration, setSelectedIntegration] = useState(null);
  const [authType, setAuthType] = useState(null);

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

  return (
    <Card>
      <Title level={4}>Integration Connection</Title>
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

      <Form.Item
        label="Select Integration"
        rules={[{ required: true, message: 'Please select an integration' }]}
      >
        <Select
          placeholder="Select an integration"
          onChange={handleIntegrationSelect}
          options={INTEGRATION_OPTIONS}
        />
      </Form.Item>

      {selectedIntegration && (
        <Tabs activeKey={authType}>
          <TabPane tab={authType === AUTH_TYPES.OAUTH ? 'OAuth Connection' : 'API Connection'} key={authType}>
            {renderAuthForm()}
          </TabPane>
        </Tabs>
      )}
    </Card>
  );
};

export default ApiConnection; 