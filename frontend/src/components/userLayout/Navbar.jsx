import React, { useState } from 'react';
import { Layout, Dropdown, Avatar, Badge, Space, Input, Switch, theme } from 'antd';
import {
  BellOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  SearchOutlined,
  BulbOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../services/auth';

const { Header } = Layout;
const { useToken } = theme;

const Navbar = () => {
  const navigate = useNavigate();
  const { token } = useToken();
  const [isDarkMode, setIsDarkMode] = useState(false);

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
      onClick: () => navigate('/profile')
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
      onClick: () => navigate('/settings')
    },
    {
      type: 'divider'
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

  const handleThemeChange = (checked) => {
    setIsDarkMode(checked);
    // You can implement theme switching logic here
    // For example, using a theme context or CSS variables
  };

  return (
    <Header
      style={{
        position: 'fixed',
        zIndex: 1,
        width: '100%',
        background: token.colorBgContainer,
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 1px 4px rgba(0, 21, 41, 0.08)'
      }}
    >
      <div style={{ width: '300px' }}>
        <Input
          placeholder="Search..."
          prefix={<SearchOutlined />}
          style={{ borderRadius: '20px' }}
        />
      </div>

      <Space size="large">
        <Switch
          checkedChildren={<BulbOutlined />}
          unCheckedChildren={<BulbOutlined />}
          checked={isDarkMode}
          onChange={handleThemeChange}
        />
        
        <Badge count={5}>
          <BellOutlined style={{ fontSize: '20px', cursor: 'pointer' }} />
        </Badge>
        
        <Dropdown
          menu={{ items: userMenuItems }}
          placement="bottomRight"
          arrow
        >
          <Space style={{ cursor: 'pointer' }}>
            <Avatar icon={<UserOutlined />} />
            <span>Admin User</span>
          </Space>
        </Dropdown>
      </Space>
    </Header>
  );
};

export default Navbar; 