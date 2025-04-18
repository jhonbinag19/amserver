import React, { useState, useEffect } from 'react';
import { Layout, Menu, Button, Avatar, Dropdown, Space, Typography, theme } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  LogoutOutlined,
  DashboardOutlined,
  TeamOutlined,
  SettingOutlined,
  FileTextOutlined,
  CalendarOutlined,
  BarChartOutlined,
  BellOutlined,
  QuestionCircleOutlined,
  GlobalOutlined,
  FileSyncOutlined,
  FileSearchOutlined,
  FileProtectOutlined,
  FileDoneOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  FileWordOutlined,
  FileImageOutlined,
  FileZipOutlined,
  FileUnknownOutlined,
  FileMarkdownOutlined,
  FileTextTwoTone,
  FileExcelTwoTone,
  FilePdfTwoTone,
  FileWordTwoTone,
  FileImageTwoTone,
  FileZipTwoTone,
  FileUnknownTwoTone,
  FileMarkdownTwoTone,
  FileSyncTwoTone,
  FileSearchTwoTone,
  FileProtectTwoTone,
  FileDoneTwoTone,
  FileTextFilled,
  FileExcelFilled,
  FilePdfFilled,
  FileWordFilled,
  FileImageFilled,
  FileZipFilled,
  FileUnknownFilled,
  FileMarkdownFilled,
  FileSyncFilled,
  FileSearchFilled,
  FileProtectFilled,
  FileDoneFilled,
  FileTextOutlined as FileTextOutlinedIcon,
  FileExcelOutlined as FileExcelOutlinedIcon,
  FilePdfOutlined as FilePdfOutlinedIcon,
  FileWordOutlined as FileWordOutlinedIcon,
  FileImageOutlined as FileImageOutlinedIcon,
  FileZipOutlined as FileZipOutlinedIcon,
  FileUnknownOutlined as FileUnknownOutlinedIcon,
  FileMarkdownOutlined as FileMarkdownOutlinedIcon,
  FileSyncOutlined as FileSyncOutlinedIcon,
  FileSearchOutlined as FileSearchOutlinedIcon,
  FileProtectOutlined as FileProtectOutlinedIcon,
  FileDoneOutlined as FileDoneOutlinedIcon,
  FileTextTwoTone as FileTextTwoToneIcon,
  FileExcelTwoTone as FileExcelTwoToneIcon,
  FilePdfTwoTone as FilePdfTwoToneIcon,
  FileWordTwoTone as FileWordTwoToneIcon,
  FileImageTwoTone as FileImageTwoToneIcon,
  FileZipTwoTone as FileZipTwoToneIcon,
  FileUnknownTwoTone as FileUnknownTwoToneIcon,
  FileMarkdownTwoTone as FileMarkdownTwoToneIcon,
  FileSyncTwoTone as FileSyncTwoToneIcon,
  FileSearchTwoTone as FileSearchTwoToneIcon,
  FileProtectTwoTone as FileProtectTwoToneIcon,
  FileDoneTwoTone as FileDoneTwoToneIcon,
  FileTextFilled as FileTextFilledIcon,
  FileExcelFilled as FileExcelFilledIcon,
  FilePdfFilled as FilePdfFilledIcon,
  FileWordFilled as FileWordFilledIcon,
  FileImageFilled as FileImageFilledIcon,
  FileZipFilled as FileZipFilledIcon,
  FileUnknownFilled as FileUnknownFilledIcon,
  FileMarkdownFilled as FileMarkdownFilledIcon,
  FileSyncFilled as FileSyncFilledIcon,
  FileSearchFilled as FileSearchFilledIcon,
  FileProtectFilled as FileProtectFilledIcon,
  FileDoneFilled as FileDoneFilledIcon,
} from '@ant-design/icons';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { logout, getCurrentUser } from '../services/auth';

const { Header, Sider, Content } = Layout;

const DashboardLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const user = getCurrentUser();
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const userMenu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />}>
        Profile
      </Menu.Item>
      <Menu.Item key="settings" icon={<SettingOutlined />}>
        Settings
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="logo" style={{ 
          height: '64px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          color: 'white',
          fontSize: collapsed ? '16px' : '20px',
          fontWeight: 'bold'
        }}>
          {collapsed ? 'AM' : 'Admin Manager'}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['1']}
          items={[
            {
              key: '1',
              icon: <DashboardOutlined />,
              label: 'Dashboard',
              onClick: () => navigate('/dashboard')
            },
            {
              key: '2',
              icon: <TeamOutlined />,
              label: 'Users',
              onClick: () => navigate('/dashboard/users')
            },
            {
              key: '3',
              icon: <SettingOutlined />,
              label: 'Settings',
              onClick: () => navigate('/dashboard/settings')
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header style={{ 
          padding: 0, 
          background: colorBgContainer,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
          <Dropdown overlay={userMenu} placement="bottomRight">
            <div style={{ 
              padding: '0 24px', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Avatar icon={<UserOutlined />} />
              <span>{user?.name}</span>
            </div>
          </Dropdown>
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: '8px'
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout; 