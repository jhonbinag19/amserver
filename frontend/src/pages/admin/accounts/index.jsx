import React, { useState } from 'react';
import { Tabs, Card, Form, Input, Button, Select, Switch, message } from 'antd';
import { DollarOutlined, SettingOutlined, CreditCardOutlined, UpOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Option } = Select;

const AdminAccounts = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handlePlanUpdate = async (values) => {
    try {
      setLoading(true);
      await axios.put('/api/admin/plans', values);
      message.success('Plan updated successfully');
    } catch (error) {
      message.error('Failed to update plan');
    } finally {
      setLoading(false);
    }
  };

  const handleBillingUpdate = async (values) => {
    try {
      setLoading(true);
      await axios.put('/api/admin/billing', values);
      message.success('Billing settings updated successfully');
    } catch (error) {
      message.error('Failed to update billing settings');
    } finally {
      setLoading(false);
    }
  };

  const handleGeneralSettingsUpdate = async (values) => {
    try {
      setLoading(true);
      await axios.put('/api/admin/settings', values);
      message.success('Settings updated successfully');
    } catch (error) {
      message.error('Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  const items = [
    {
      key: 'plans',
      label: (
        <span>
          <DollarOutlined />
          Plans & Pricing
        </span>
      ),
      children: (
        <Card>
          <Form
            form={form}
            layout="vertical"
            onFinish={handlePlanUpdate}
          >
            <Form.Item
              name="plan_name"
              label="Plan Name"
              rules={[{ required: true, message: 'Please enter plan name' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="price"
              label="Price"
              rules={[{ required: true, message: 'Please enter price' }]}
            >
              <Input type="number" prefix="$" />
            </Form.Item>

            <Form.Item
              name="features"
              label="Features"
              rules={[{ required: true, message: 'Please enter features' }]}
            >
              <Select mode="tags" placeholder="Enter features">
                <Option value="api_access">API Access</Option>
                <Option value="custom_domains">Custom Domains</Option>
                <Option value="priority_support">Priority Support</Option>
              </Select>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                Update Plan
              </Button>
            </Form.Item>
          </Form>
        </Card>
      ),
    },
    {
      key: 'billing',
      label: (
        <span>
          <CreditCardOutlined />
          Billing
        </span>
      ),
      children: (
        <Card>
          <Form
            layout="vertical"
            onFinish={handleBillingUpdate}
          >
            <Form.Item
              name="payment_gateway"
              label="Payment Gateway"
              rules={[{ required: true, message: 'Please select payment gateway' }]}
            >
              <Select>
                <Option value="stripe">Stripe</Option>
                <Option value="paypal">PayPal</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="billing_cycle"
              label="Billing Cycle"
              rules={[{ required: true, message: 'Please select billing cycle' }]}
            >
              <Select>
                <Option value="monthly">Monthly</Option>
                <Option value="yearly">Yearly</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="auto_renew"
              label="Auto Renew"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                Update Billing Settings
              </Button>
            </Form.Item>
          </Form>
        </Card>
      ),
    },
    {
      key: 'upgrade',
      label: (
        <span>
          <UpOutlined />
          Upgrade Plan
        </span>
      ),
      children: (
        <Card>
          <Form
            layout="vertical"
          >
            <Form.Item
              name="current_plan"
              label="Current Plan"
            >
              <Input disabled />
            </Form.Item>

            <Form.Item
              name="new_plan"
              label="New Plan"
              rules={[{ required: true, message: 'Please select new plan' }]}
            >
              <Select>
                <Option value="basic">Basic</Option>
                <Option value="pro">Pro</Option>
                <Option value="enterprise">Enterprise</Option>
              </Select>
            </Form.Item>

            <Form.Item>
              <Button type="primary" loading={loading}>
                Upgrade Plan
              </Button>
            </Form.Item>
          </Form>
        </Card>
      ),
    },
    {
      key: 'general',
      label: (
        <span>
          <SettingOutlined />
          General Settings
        </span>
      ),
      children: (
        <Card>
          <Form
            layout="vertical"
            onFinish={handleGeneralSettingsUpdate}
          >
            <Form.Item
              name="company_name"
              label="Company Name"
              rules={[{ required: true, message: 'Please enter company name' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="timezone"
              label="Timezone"
              rules={[{ required: true, message: 'Please select timezone' }]}
            >
              <Select>
                <Option value="UTC">UTC</Option>
                <Option value="EST">Eastern Time</Option>
                <Option value="PST">Pacific Time</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="notifications"
              label="Email Notifications"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                Update Settings
              </Button>
            </Form.Item>
          </Form>
        </Card>
      ),
    },
  ];

  return (
    <Tabs defaultActiveKey="plans" items={items} />
  );
};

export default AdminAccounts; 