import React from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const { Content } = Layout;

const DashboardLayout = () => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sidebar />
      <Layout style={{ marginLeft: 250 }}>
        <Navbar />
        <Content
          style={{
            margin: '88px 24px 24px',
            padding: 24,
            background: '#fff',
            minHeight: 280,
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