import React from 'react';
import { Tabs, Card, Typography } from 'antd';
import {
  DashboardOutlined,
  BankOutlined,
  CreditCardOutlined,
  SettingOutlined,
  ApiOutlined,
  DatabaseOutlined,
  UserOutlined,
  TeamOutlined,
  ToolOutlined
} from '@ant-design/icons';
import AdminPayments from './payments';
import AdminAgencyAccounts from './agency-accounts';
import AdminAccounts from './accounts';
import AdminApiConnection from './api-connection';
import AdminSchema from './schema';
import AdminUsers from './users';
import AdminRoles from './roles';
import AdminTools from './tools';

const { Title } = Typography;

const AdminDashboard = () => {
  const items = [
    {
      key: 'dashboard',
      label: (
        <span>
          <DashboardOutlined />
          Dashboard
        </span>
      ),
      children: (
        <Card>
          <Title level={4}>Admin Dashboard Overview</Title>
          {/* Add dashboard overview content here */}
        </Card>
      ),
    },
    {
      key: 'payments',
      label: (
        <span>
          <CreditCardOutlined />
          Payments
        </span>
      ),
      children: <AdminPayments />,
    },
    {
      key: 'agency-accounts',
      label: (
        <span>
          <BankOutlined />
          Agency Accounts
        </span>
      ),
      children: <AdminAgencyAccounts />,
    },
    {
      key: 'accounts',
      label: (
        <span>
          <SettingOutlined />
          Accounts
        </span>
      ),
      children: <AdminAccounts />,
    },
    {
      key: 'api-connection',
      label: (
        <span>
          <ApiOutlined />
          API Connection
        </span>
      ),
      children: <AdminApiConnection />,
    },
    {
      key: 'schema',
      label: (
        <span>
          <DatabaseOutlined />
          Database Schema
        </span>
      ),
      children: <AdminSchema />,
    },
    {
      key: 'users',
      label: (
        <span>
          <UserOutlined />
          Users
        </span>
      ),
      children: <AdminUsers />,
    },
    {
      key: 'roles',
      label: (
        <span>
          <TeamOutlined />
          Roles
        </span>
      ),
      children: <AdminRoles />,
    },
    {
      key: 'tools',
      label: (
        <span>
          <ToolOutlined />
          Tools
        </span>
      ),
      children: <AdminTools />,
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>Admin Panel</Title>
      <Tabs defaultActiveKey="dashboard" items={items} />
    </div>
  );
};

export default AdminDashboard; 