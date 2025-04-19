import React from 'react';
import { Layout, Menu, Typography } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  TeamOutlined,
  SettingOutlined,
  ApiOutlined,
  AppstoreOutlined,
  LogoutOutlined,
  CrownOutlined,
  ArrowUpOutlined,
  BankOutlined,
  ApartmentOutlined,
  ToolOutlined,
  LinkOutlined,
  BranchesOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { logout } from '../../services/auth';

const { Sider } = Layout;
const { Text } = Typography;

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const mainMenuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: 'users',
      icon: <UserOutlined />,
      label: 'Users',
    },
    {
      key: 'roles',
      icon: <TeamOutlined />,
      label: 'Roles & Permissions',
    },
    {
      key: 'ghl',
      icon: <ApiOutlined />,
      label: 'GHL Integration',
      children: [
        {
          key: 'ghl/connection',
          icon: <LinkOutlined />,
          label: 'API Connection',
        },
        {
          key: 'ghl/agency',
          icon: <BankOutlined />,
          label: 'Agency Accounts',
        },
        {
          key: 'ghl/sub-accounts',
          icon: <ApartmentOutlined />,
          label: 'Sub Accounts',
        },
        {
          key: 'ghl/workflows',
          icon: <AppstoreOutlined />,
          label: 'Integration Workflows',
        },
        {
          key: 'ghl/billing',
          icon: <CrownOutlined />,
          label: 'Payment & Billing',
        },
        {
          key: 'ghl/settings',
          icon: <ToolOutlined />,
          label: 'Integration Settings',
        }
      ]
    },
    {
      key: 'workflows',
      icon: <AppstoreOutlined />,
      label: 'Workflows',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
    }
  ];

  const bottomMenuItems = [
    {
      key: 'subscription',
      icon: <CrownOutlined />,
      label: 'Subscription',
      children: [
        {
          key: 'subscription/plans',
          label: 'Plans & Pricing',
        },
        {
          key: 'subscription/billing',
          label: 'Billing History',
        },
        {
          key: 'subscription/upgrade',
          label: 'Upgrade Plan',
          icon: <ArrowUpOutlined />,
        }
      ]
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: () => {
        logout();
        navigate('/login');
      }
    }
  ];

  // Get the current path segment after the first slash
  const currentPath = location.pathname.split('/')[1] || 'dashboard';

  return (
    <Sider
      width={250}
      style={{
        overflow: 'hidden',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        background: '#fff',
        boxShadow: '2px 0 8px 0 rgba(29, 35, 41, 0.05)',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <div style={{ 
        height: '64px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        borderBottom: '1px solid #f0f0f0'
      }}>
        <h2 style={{ margin: 0 }}>Admin Manager</h2>
      </div>

      <div style={{ 
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - 64px)',
        overflow: 'hidden'
      }}>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname.replace('/', '')]}
          openKeys={['ghl', 'subscription']}
          style={{ 
            borderRight: 0,
            flex: 1,
            overflow: 'auto'
          }}
          items={mainMenuItems}
          onClick={({ key }) => navigate(`/${key}`)}
        />

        <Menu
          mode="inline"
          style={{ 
            borderRight: 0,
            marginTop: 'auto'
          }}
          items={bottomMenuItems}
          onClick={({ key }) => {
            if (!key.includes('subscription')) {
              navigate(`/${key}`);
            }
          }}
        />
      </div>
    </Sider>
  );
};

export default Sidebar; 