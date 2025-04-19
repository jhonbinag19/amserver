import React, { useState } from 'react';
import { Layout, Menu, Typography, Badge } from 'antd';
import {
  DashboardOutlined,
  SettingOutlined,
  ApiOutlined,
  AppstoreOutlined,
  LogoutOutlined,
  LinkOutlined,
  BankOutlined,
  ToolOutlined,
  ApartmentOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { logout } from '../../services/auth';

const { Sider } = Layout;
const { Text } = Typography;

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openKeys, setOpenKeys] = useState(['integrations']);

  const mainMenuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: 'integrations',
      icon: <ApiOutlined />,
      label: 'Integrations',
      children: [
        {
          key: 'ghl/connection',
          icon: <LinkOutlined />,
          label: 'GHL Connection',
        },
        {
          key: 'ghl/agency',
          icon: <BankOutlined />,
          label: 'Agency Accounts',
        },
        {
          key: 'tools',
          icon: <ToolOutlined />,
          label: (
            <Badge offset={[10, 0]} dot>
              Integration Tools
            </Badge>
          ),
        }
      ]
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
    }
  ];

  const bottomMenuItems = [
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

  const handleOpenChange = (keys) => {
    setOpenKeys(keys);
  };

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
          openKeys={openKeys}
          onOpenChange={handleOpenChange}
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
          onClick={({ key }) => navigate(`/${key}`)}
        />
      </div>
    </Sider>
  );
};

export default Sidebar; 