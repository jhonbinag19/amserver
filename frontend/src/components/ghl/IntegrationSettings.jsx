import React, { useState, useEffect } from 'react';
import {
  Card,
  Form,
  Input,
  Switch,
  Button,
  message,
  Space,
  Divider,
  Typography
} from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Title } = Typography;

const IntegrationSettings = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/ghl/organizations/:organizationId/integration-settings');
      setSettings(response.data);
      form.setFieldsValue(response.data);
    } catch (error) {
      message.error('Failed to fetch integration settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      await axios.put('/api/ghl/organizations/:organizationId/integration-settings', values);
      message.success('Settings updated successfully');
      fetchSettings();
    } catch (error) {
      message.error('Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card loading={loading}>
      <Title level={4}>GoHighLevel Integration Settings</Title>
      <Divider />
      
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={settings}
      >
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Card title="General Settings">
            <Form.Item
              name="webhook_url"
              label="Webhook URL"
              rules={[{ required: true, message: 'Please enter webhook URL' }]}
            >
              <Input placeholder="https://your-domain.com/api/ghl/webhooks" />
            </Form.Item>
            
            <Form.Item
              name="sync_interval"
              label="Sync Interval (minutes)"
              rules={[{ required: true, message: 'Please enter sync interval' }]}
            >
              <Input type="number" min={1} />
            </Form.Item>
          </Card>

          <Card title="Contact Sync Settings">
            <Form.Item
              name="sync_contacts"
              label="Enable Contact Sync"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>

            <Form.Item
              name="sync_contact_fields"
              label="Contact Fields to Sync"
            >
              <Input.TextArea
                placeholder="Enter field names separated by commas"
                rows={4}
              />
            </Form.Item>
          </Card>

          <Card title="Opportunity Settings">
            <Form.Item
              name="sync_opportunities"
              label="Enable Opportunity Sync"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>

            <Form.Item
              name="opportunity_stages"
              label="Opportunity Stages to Track"
            >
              <Input.TextArea
                placeholder="Enter stage names separated by commas"
                rows={4}
              />
            </Form.Item>
          </Card>

          <Card title="Task Settings">
            <Form.Item
              name="sync_tasks"
              label="Enable Task Sync"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>

            <Form.Item
              name="task_priorities"
              label="Task Priorities to Sync"
            >
              <Input.TextArea
                placeholder="Enter priority levels separated by commas"
                rows={4}
              />
            </Form.Item>
          </Card>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              loading={loading}
            >
              Save Settings
            </Button>
          </Form.Item>
        </Space>
      </Form>
    </Card>
  );
};

export default IntegrationSettings; 