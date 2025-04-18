import React, { useState } from 'react';
import { 
  Tabs, 
  Form, 
  Input, 
  Button, 
  Card, 
  Typography, 
  message, 
  Switch,
  Select,
  Space
} from 'antd';
import { 
  NotificationOutlined,
  SecurityOutlined,
  ApiOutlined,
  GlobalOutlined
} from '@ant-design/icons';

const { Title } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

const Settings = () => {
  const [loading, setLoading] = useState(false);

  const handleNotificationSubmit = async (values) => {
    try {
      setLoading(true);
      await axios.put('/api/settings/notifications', values);
      message.success('Notification settings updated');
    } catch (error) {
      message.error('Failed to update notification settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSecuritySubmit = async (values) => {
    try {
      setLoading(true);
      await axios.put('/api/settings/security', values);
      message.success('Security settings updated');
    } catch (error) {
      message.error('Failed to update security settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>Settings</Title>
      
      <Tabs defaultActiveKey="1">
        <TabPane
          tab={
            <span>
              <NotificationOutlined />
              Notifications
            </span>
          }
          key="1"
        >
          <Card>
            <Form
              layout="vertical"
              onFinish={handleNotificationSubmit}
            >
              <Form.Item
                name="emailNotifications"
                label="Email Notifications"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Form.Item
                name="notificationTypes"
                label="Notification Types"
              >
                <Select mode="multiple" placeholder="Select notification types">
                  <Option value="system">System Updates</Option>
                  <Option value="security">Security Alerts</Option>
                  <Option value="billing">Billing Updates</Option>
                  <Option value="integration">Integration Updates</Option>
                </Select>
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                  Save Notification Settings
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </TabPane>

        <TabPane
          tab={
            <span>
              <SecurityOutlined />
              Security
            </span>
          }
          key="2"
        >
          <Card>
            <Form
              layout="vertical"
              onFinish={handleSecuritySubmit}
            >
              <Form.Item
                name="twoFactorAuth"
                label="Two-Factor Authentication"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Form.Item
                name="sessionTimeout"
                label="Session Timeout"
              >
                <Select>
                  <Option value="15">15 minutes</Option>
                  <Option value="30">30 minutes</Option>
                  <Option value="60">1 hour</Option>
                  <Option value="120">2 hours</Option>
                </Select>
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                  Save Security Settings
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </TabPane>

        <TabPane
          tab={
            <span>
              <ApiOutlined />
              API Settings
            </span>
          }
          key="3"
        >
          <Card>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Button type="primary">Generate New API Key</Button>
              <Button>View API Documentation</Button>
            </Space>
          </Card>
        </TabPane>

        <TabPane
          tab={
            <span>
              <GlobalOutlined />
              General
            </span>
          }
          key="4"
        >
          <Card>
            <Form layout="vertical">
              <Form.Item
                name="timezone"
                label="Timezone"
              >
                <Select>
                  <Option value="UTC">UTC</Option>
                  <Option value="EST">Eastern Time</Option>
                  <Option value="PST">Pacific Time</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="language"
                label="Language"
              >
                <Select>
                  <Option value="en">English</Option>
                  <Option value="es">Spanish</Option>
                  <Option value="fr">French</Option>
                </Select>
              </Form.Item>
            </Form>
          </Card>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default Settings; 