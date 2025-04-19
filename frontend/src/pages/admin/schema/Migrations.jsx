import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Space,
  Button,
  Modal,
  Form,
  Input,
  Select,
  message,
  Typography,
  Divider,
  Alert,
  Row,
  Col,
  Tag,
  Tooltip,
  Popconfirm,
  Timeline,
  Badge
} from 'antd';
import {
  PlusOutlined,
  FieldTimeOutlined,
  RollbackOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import axios from 'axios';

const { Title, Text } = Typography;
const { Option } = Select;

const Migrations = () => {
  const [migrations, setMigrations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [selectedMigration, setSelectedMigration] = useState(null);

  useEffect(() => {
    fetchMigrations();
  }, []);

  const fetchMigrations = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/schema/migrations');
      setMigrations(response.data);
    } catch (error) {
      message.error('Failed to fetch migrations');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMigration = async (values) => {
    try {
      await axios.post('/api/schema/migrations', values);
      message.success('Migration created successfully');
      setModalVisible(false);
      form.resetFields();
      fetchMigrations();
    } catch (error) {
      message.error('Failed to create migration');
    }
  };

  const handleRunMigration = async (migrationId) => {
    try {
      await axios.post(`/api/schema/migrations/${migrationId}/run`);
      message.success('Migration executed successfully');
      fetchMigrations();
    } catch (error) {
      message.error('Failed to execute migration');
    }
  };

  const handleRollbackMigration = async (migrationId) => {
    try {
      await axios.post(`/api/schema/migrations/${migrationId}/rollback`);
      message.success('Migration rolled back successfully');
      fetchMigrations();
    } catch (error) {
      message.error('Failed to roll back migration');
    }
  };

  const columns = [
    {
      title: 'Migration Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Badge
          status={
            status === 'completed' ? 'success' :
            status === 'pending' ? 'warning' :
            status === 'failed' ? 'error' : 'default'
          }
          text={status}
        />
      ),
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Tooltip title="Run Migration">
            <Button
              type="primary"
              icon={<FieldTimeOutlined />}
              onClick={() => handleRunMigration(record.id)}
              disabled={record.status === 'completed'}
            />
          </Tooltip>
          <Tooltip title="Rollback Migration">
            <Button
              danger
              icon={<RollbackOutlined />}
              onClick={() => handleRollbackMigration(record.id)}
              disabled={record.status !== 'completed'}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="migrations">
      <Card
        title={
          <Space>
            <FieldTimeOutlined />
            <Title level={4} style={{ margin: 0 }}>Database Migrations</Title>
          </Space>
        }
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setSelectedMigration(null);
              form.resetFields();
              setModalVisible(true);
            }}
          >
            Create Migration
          </Button>
        }
      >
        <Alert
          message="Migration Status"
          description={
            <Space direction="vertical">
              <Text>
                <CheckCircleOutlined style={{ color: '#52c41a' }} /> 
                Track and manage database schema changes
              </Text>
              <Text>
                <WarningOutlined style={{ color: '#faad14' }} /> 
                Rollback changes if needed
              </Text>
              <Text>
                <ClockCircleOutlined style={{ color: '#1890ff' }} /> 
                View migration history
              </Text>
            </Space>
          }
          type="info"
          showIcon
          style={{ marginBottom: 24 }}
        />

        <Row gutter={[16, 16]}>
          <Col span={16}>
            <Table
              columns={columns}
              dataSource={migrations}
              loading={loading}
              rowKey="id"
            />
          </Col>
          <Col span={8}>
            <Card title="Migration Timeline">
              <Timeline>
                {migrations.map(migration => (
                  <Timeline.Item
                    key={migration.id}
                    color={
                      migration.status === 'completed' ? 'green' :
                      migration.status === 'pending' ? 'blue' :
                      migration.status === 'failed' ? 'red' : 'gray'
                    }
                  >
                    <Text strong>{migration.name}</Text>
                    <br />
                    <Text type="secondary">
                      {new Date(migration.createdAt).toLocaleString()}
                    </Text>
                  </Timeline.Item>
                ))}
              </Timeline>
            </Card>
          </Col>
        </Row>
      </Card>

      <Modal
        title="Create Migration"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateMigration}
        >
          <Form.Item
            name="name"
            label="Migration Name"
            rules={[{ required: true, message: 'Please enter migration name' }]}
          >
            <Input placeholder="Enter migration name" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please enter migration description' }]}
          >
            <Input.TextArea placeholder="Enter migration description" />
          </Form.Item>

          <Form.Item
            name="type"
            label="Migration Type"
            rules={[{ required: true, message: 'Please select migration type' }]}
          >
            <Select placeholder="Select migration type">
              <Option value="create">Create Table</Option>
              <Option value="alter">Alter Table</Option>
              <Option value="drop">Drop Table</Option>
              <Option value="custom">Custom SQL</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Create
              </Button>
              <Button onClick={() => setModalVisible(false)}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      <style jsx>{`
        .migrations {
          padding: 24px;
        }
      `}</style>
    </div>
  );
};

export default Migrations; 