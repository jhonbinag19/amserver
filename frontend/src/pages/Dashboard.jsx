import React from 'react';
import { Row, Col, Card, Statistic } from 'antd';
import { UserOutlined, DollarOutlined, TeamOutlined, FileOutlined } from '@ant-design/icons';

const Dashboard = () => {
  return (
    <div>
      <h1 style={{ marginBottom: '24px' }}>Dashboard</h1>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Users"
              value={5}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Active Subscriptions"
              value={3}
              prefix={<DollarOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Trial Users"
              value={2}
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Revenue"
              value={4500}
              prefix={<FileOutlined />}
              suffix="$"
            />
          </Card>
        </Col>
      </Row>
      <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
        <Col span={24}>
          <Card title="Recent Activity">
            <p>No recent activity to display</p>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard; 