import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  Layout,
  Menu,
  theme,
  Avatar,
  Dropdown,
  Badge,
  Button
} from 'antd';
import {
  DashboardOutlined,
  ToolOutlined,
  SettingOutlined,
  UserOutlined,
  LogoutOutlined,
  BellOutlined,
  CreditCardOutlined,
  ProfileOutlined,
  ApiOutlined
} from '@ant-design/icons';

const { Header, Sider, Content } = Layout;

const DashboardLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: <Link to="/dashboard">Dashboard</Link>,
    },
    {
      key: 'tools',
      icon: <ToolOutlined />,
      label: <Link to="/dashboard/tools">Tools</Link>,
    },
    {
      key: 'ghl-integration',
      icon: <ApiOutlined />,
      label: <Link to="/dashboard/ghl-integration">GoHighLevel</Link>,
      children: [
        {
          key: 'ghl-agency',
          label: <Link to="/dashboard/ghl-integration/agency">Agency Accounts</Link>,
        },
        {
          key: 'ghl-sub-accounts',
          label: <Link to="/dashboard/ghl-integration/sub-accounts">Sub Accounts</Link>,
        },
        {
          key: 'ghl-settings',
          label: <Link to="/dashboard/ghl-integration/settings">Integration Settings</Link>,
        },
      ],
    },
    {
      key: 'billing',
      icon: <CreditCardOutlined />,
      label: <Link to="/dashboard/billing">Billing</Link>,
    },
    {
      key: 'profile',
      icon: <ProfileOutlined />,
      label: <Link to="/dashboard/profile">Business Profile</Link>,
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: <Link to="/dashboard/settings">Settings</Link>,
    },
  ];

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        theme="light"
      >
        <div className="logo" style={{ height: 32, margin: 16, background: 'rgba(0, 0, 0, 0.2)' }} />
        <Menu
          theme="light"
          defaultSelectedKeys={[location.pathname.split('/')[2] || 'dashboard']}
          mode="inline"
          items={menuItems}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <div style={{ float: 'right', marginRight: 24 }}>
            <Badge count={5} style={{ marginRight: 24 }}>
              <Button type="text" icon={<BellOutlined />} />
            </Badge>
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Avatar icon={<UserOutlined />} />
            </Dropdown>
          </div>
        </Header>
        <Content style={{ margin: '24px 16px', padding: 24, background: colorBgContainer, borderRadius: borderRadiusLG }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout; 