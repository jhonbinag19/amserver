import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Typography, Space, Button } from 'antd';
import { 
  UserOutlined, 
  DollarOutlined, 
  ApiOutlined, 
  SettingOutlined 
} from '@ant-design/icons';
import axios from 'axios';

const { Title } = Typography;

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeIntegrations: 0,
    monthlyRevenue: 0,
    pendingTasks: 0
  });

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await axios.get('/api/dashboard/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>Dashboard</Title>
      
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Users"
              value={stats.totalUsers}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Active Integrations"
              value={stats.activeIntegrations}
              prefix={<ApiOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Monthly Revenue"
              value={stats.monthlyRevenue}
              prefix={<DollarOutlined />}
              precision={2}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Pending Tasks"
              value={stats.pendingTasks}
              prefix={<SettingOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card title="Quick Actions">
            <Space direction="vertical" style={{ width: '100%' }}>
              <Button type="primary" block icon={<ApiOutlined />}>
                Manage Integrations
              </Button>
              <Button block icon={<UserOutlined />}>
                View Users
              </Button>
              <Button block icon={<DollarOutlined />}>
                View Billing
              </Button>
              <Button block icon={<SettingOutlined />}>
                System Settings
              </Button>
            </Space>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Recent Activity">
            {/* Add recent activity list here */}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard; 