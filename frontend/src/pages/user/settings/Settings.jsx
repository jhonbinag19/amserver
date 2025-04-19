import React from 'react';
import { Tabs, Card, Typography, Table, Button, Space, Tag } from 'antd';
import {
  SettingOutlined,
  CrownOutlined,
  HistoryOutlined,
  ArrowUpOutlined
} from '@ant-design/icons';

const { Title } = Typography;

const Settings = () => {
  const items = [
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
          <Title level={4}>General Settings</Title>
          {/* Add your general settings content here */}
        </Card>
      ),
    },
    {
      key: 'plans',
      label: (
        <span>
          <CrownOutlined />
          Plans & Pricing
        </span>
      ),
      children: (
        <Card>
          <Title level={4}>Subscription Plans</Title>
          <Table
            columns={[
              {
                title: 'Plan',
                dataIndex: 'plan',
                key: 'plan',
              },
              {
                title: 'Price',
                dataIndex: 'price',
                key: 'price',
              },
              {
                title: 'Features',
                dataIndex: 'features',
                key: 'features',
                render: (features) => (
                  <Space size="small">
                    {features.map((feature, index) => (
                      <Tag key={index}>{feature}</Tag>
                    ))}
                  </Space>
                ),
              },
              {
                title: 'Action',
                key: 'action',
                render: (_, record) => (
                  <Button type="primary" icon={<ArrowUpOutlined />}>
                    Select Plan
                  </Button>
                ),
              },
            ]}
            dataSource={[
              {
                key: '1',
                plan: 'Basic',
                price: '$9.99/month',
                features: ['Feature 1', 'Feature 2'],
              },
              {
                key: '2',
                plan: 'Pro',
                price: '$19.99/month',
                features: ['Feature 1', 'Feature 2', 'Feature 3'],
              },
              {
                key: '3',
                plan: 'Enterprise',
                price: '$49.99/month',
                features: ['All Features', 'Priority Support'],
              },
            ]}
          />
        </Card>
      ),
    },
    {
      key: 'billing',
      label: (
        <span>
          <HistoryOutlined />
          Billing History
        </span>
      ),
      children: (
        <Card>
          <Title level={4}>Billing History</Title>
          <Table
            columns={[
              {
                title: 'Date',
                dataIndex: 'date',
                key: 'date',
              },
              {
                title: 'Description',
                dataIndex: 'description',
                key: 'description',
              },
              {
                title: 'Amount',
                dataIndex: 'amount',
                key: 'amount',
              },
              {
                title: 'Status',
                dataIndex: 'status',
                key: 'status',
                render: (status) => (
                  <Tag color={status === 'Paid' ? 'green' : 'red'}>
                    {status}
                  </Tag>
                ),
              },
            ]}
            dataSource={[
              {
                key: '1',
                date: '2024-03-01',
                description: 'Monthly Subscription',
                amount: '$19.99',
                status: 'Paid',
              },
              {
                key: '2',
                date: '2024-02-01',
                description: 'Monthly Subscription',
                amount: '$19.99',
                status: 'Paid',
              },
            ]}
          />
        </Card>
      ),
    },
    {
      key: 'upgrade',
      label: (
        <span>
          <ArrowUpOutlined />
          Upgrade Plan
        </span>
      ),
      children: (
        <Card>
          <Title level={4}>Upgrade Your Plan</Title>
          {/* Add your upgrade plan content here */}
        </Card>
      ),
    },
  ];

  return (
    <div className="settings-page">
      <Card>
        <Title level={2}>Settings</Title>
        <Tabs
          defaultActiveKey="general"
          items={items}
          size="large"
          style={{ marginTop: 24 }}
        />
      </Card>

      <style jsx>{`
        .settings-page {
          padding: 24px;
        }
      `}</style>
    </div>
  );
};

export default Settings; 