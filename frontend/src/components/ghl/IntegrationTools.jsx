import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Space,
  Tag,
  Button,
  Modal,
  Form,
  Input,
  Select,
  message,
  Tooltip,
  Popconfirm,
  Typography,
  Divider,
  Alert,
  Row,
  Col,
  Statistic,
  Progress,
  Badge,
  Empty
} from 'antd';
import {
  ApiOutlined,
  LinkOutlined,
  DisconnectOutlined,
  SyncOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  InfoCircleOutlined,
  SettingOutlined,
  PlusOutlined
} from '@ant-design/icons';
import axios from 'axios';

const { Title, Text } = Typography;
const { Option } = Select;

const IntegrationTools = () => {
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [connectionStatus, setConnectionStatus] = useState({});
  const [syncStatus, setSyncStatus] = useState({});
  const [connectedTools, setConnectedTools] = useState([]);

  useEffect(() => {
    checkConnectionStatus();
    fetchConnectedTools();
  }, []);

  const checkConnectionStatus = async () => {
    try {
      const response = await axios.get('/api/ghl/connection/status');
      setConnectionStatus(response.data);
    } catch (error) {
      message.error('Failed to check connection status');
    }
  };

  const fetchConnectedTools = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/ghl/tools');
      setConnectedTools(response.data);
    } catch (error) {
      message.error('Failed to fetch connected tools');
    } finally {
      setLoading(false);
    }
  };

  const handleSyncTool = async (toolId) => {
    try {
      setSyncStatus(prev => ({ ...prev, [toolId]: 'syncing' }));
      await axios.post(`/api/ghl/tools/${toolId}/sync`);
      message.success('Tool synchronized successfully');
      fetchConnectedTools();
    } catch (error) {
      message.error('Failed to synchronize tool');
    } finally {
      setSyncStatus(prev => ({ ...prev, [toolId]: 'completed' }));
    }
  };

  const handleDisconnectTool = async (toolId) => {
    try {
      await axios.delete(`/api/ghl/tools/${toolId}`);
      message.success('Tool disconnected successfully');
      fetchConnectedTools();
    } catch (error) {
      message.error('Failed to disconnect tool');
    }
  };

  const handleAddTool = async (values) => {
    try {
      await axios.post('/api/ghl/tools', values);
      message.success('Tool added successfully');
      setModalVisible(false);
      form.resetFields();
      fetchConnectedTools();
    } catch (error) {
      message.error('Failed to add tool');
    }
  };

  const columns = [
    {
      title: 'Tool',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Space>
          <img 
            src={record.icon} 
            alt={text} 
            style={{ width: 24, height: 24, marginRight: 8 }} 
          />
          <Text strong>{text}</Text>
        </Space>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Badge
          status={status === 'connected' ? 'success' : 'error'}
          text={status === 'connected' ? 'Connected' : 'Disconnected'}
        />
      ),
    },
    {
      title: 'Last Sync',
      dataIndex: 'lastSync',
      key: 'lastSync',
      render: (date) => date ? new Date(date).toLocaleString() : 'Never',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Tooltip title="Sync Data">
            <Button
              icon={<SyncOutlined />}
              onClick={() => handleSyncTool(record.id)}
              loading={syncStatus[record.id] === 'syncing'}
            />
          </Tooltip>
          <Popconfirm
            title="Are you sure you want to disconnect this tool?"
            onConfirm={() => handleDisconnectTool(record.id)}
          >
            <Button danger icon={<DisconnectOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="integration-tools">
      <Card
        title={
          <Space>
            <ApiOutlined />
            <Title level={4} style={{ margin: 0 }}>GHL Integration Tools</Title>
          </Space>
        }
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setModalVisible(true)}
          >
            Add Tool
          </Button>
        }
      >
        {connectedTools.length === 0 ? (
          <Empty
            description="No tools connected yet"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          >
            <Button type="primary" onClick={() => setModalVisible(true)}>
              Connect Your First Tool
            </Button>
          </Empty>
        ) : (
          <>
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
              <Col span={8}>
                <Card>
                  <Statistic
                    title="Connected Tools"
                    value={connectedTools.filter(t => t.status === 'connected').length}
                    suffix={`/ ${connectedTools.length}`}
                  />
                  <Progress
                    percent={Math.round((connectedTools.filter(t => t.status === 'connected').length / connectedTools.length) * 100)}
                    status="active"
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card>
                  <Statistic
                    title="Last Sync"
                    value={new Date(Math.max(...connectedTools.map(t => new Date(t.lastSync).getTime()))).toLocaleString()}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card>
                  <Statistic
                    title="Connection Status"
                    value={connectionStatus.status === 'connected' ? 'Connected' : 'Disconnected'}
                    valueStyle={{ color: connectionStatus.status === 'connected' ? '#3f8600' : '#cf1322' }}
                  />
                </Card>
              </Col>
            </Row>

            <Alert
              message="GHL Integration Status"
              description={
                <Space direction="vertical">
                  <Text>
                    <CheckCircleOutlined style={{ color: '#52c41a' }} /> 
                    Connected to GHL API
                  </Text>
                  <Text>
                    <InfoCircleOutlined style={{ color: '#1890ff' }} /> 
                    {connectedTools.length} tools available
                  </Text>
                  {connectionStatus.lastSync && (
                    <Text>
                      <SyncOutlined /> 
                      Last sync: {new Date(connectionStatus.lastSync).toLocaleString()}
                    </Text>
                  )}
                </Space>
              }
              type="info"
              showIcon
              style={{ marginBottom: 24 }}
            />

            <Table
              columns={columns}
              dataSource={connectedTools}
              loading={loading}
              rowKey="id"
            />
          </>
        )}
      </Card>

      <Modal
        title="Add New Tool"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddTool}
        >
          <Form.Item
            name="name"
            label="Tool Name"
            rules={[{ required: true, message: 'Please enter tool name' }]}
          >
            <Input placeholder="Enter tool name" />
          </Form.Item>

          <Form.Item
            name="type"
            label="Tool Type"
            rules={[{ required: true, message: 'Please select tool type' }]}
          >
            <Select placeholder="Select tool type">
              <Option value="crm">CRM</Option>
              <Option value="marketing">Marketing</Option>
              <Option value="communication">Communication</Option>
              <Option value="analytics">Analytics</Option>
              <Option value="other">Other</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="apiKey"
            label="API Key"
            rules={[{ required: true, message: 'Please enter API key' }]}
          >
            <Input.Password placeholder="Enter API key" />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Add Tool
              </Button>
              <Button onClick={() => setModalVisible(false)}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      <style jsx>{`
        .integration-tools {
          padding: 24px;
        }
      `}</style>
    </div>
  );
};

export default IntegrationTools; 