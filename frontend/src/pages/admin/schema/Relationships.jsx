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
  Popconfirm
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  BranchesOutlined,
  LinkOutlined,
  DisconnectOutlined
} from '@ant-design/icons';
import axios from 'axios';

const { Title, Text } = Typography;
const { Option } = Select;

const Relationships = () => {
  const [relationships, setRelationships] = useState([]);
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [selectedRelationship, setSelectedRelationship] = useState(null);

  useEffect(() => {
    fetchRelationships();
    fetchModels();
  }, []);

  const fetchRelationships = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/schema/relationships');
      setRelationships(response.data);
    } catch (error) {
      message.error('Failed to fetch relationships');
    } finally {
      setLoading(false);
    }
  };

  const fetchModels = async () => {
    try {
      const response = await axios.get('/api/schema/models');
      setModels(response.data);
    } catch (error) {
      message.error('Failed to fetch models');
    }
  };

  const handleCreateRelationship = async (values) => {
    try {
      await axios.post('/api/schema/relationships', values);
      message.success('Relationship created successfully');
      setModalVisible(false);
      form.resetFields();
      fetchRelationships();
    } catch (error) {
      message.error('Failed to create relationship');
    }
  };

  const handleUpdateRelationship = async (values) => {
    try {
      await axios.put(`/api/schema/relationships/${selectedRelationship.id}`, values);
      message.success('Relationship updated successfully');
      setModalVisible(false);
      setSelectedRelationship(null);
      form.resetFields();
      fetchRelationships();
    } catch (error) {
      message.error('Failed to update relationship');
    }
  };

  const handleDeleteRelationship = async (relationshipId) => {
    try {
      await axios.delete(`/api/schema/relationships/${relationshipId}`);
      message.success('Relationship deleted successfully');
      fetchRelationships();
    } catch (error) {
      message.error('Failed to delete relationship');
    }
  };

  const columns = [
    {
      title: 'Source Model',
      dataIndex: 'sourceModel',
      key: 'sourceModel',
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: 'Relationship Type',
      dataIndex: 'type',
      key: 'type',
      render: (type) => (
        <Tag color={
          type === 'one-to-one' ? 'blue' :
          type === 'one-to-many' ? 'green' :
          type === 'many-to-many' ? 'purple' : 'default'
        }>
          {type}
        </Tag>
      ),
    },
    {
      title: 'Target Model',
      dataIndex: 'targetModel',
      key: 'targetModel',
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Tooltip title="Edit Relationship">
            <Button
              icon={<EditOutlined />}
              onClick={() => {
                setSelectedRelationship(record);
                form.setFieldsValue(record);
                setModalVisible(true);
              }}
            />
          </Tooltip>
          <Popconfirm
            title="Are you sure you want to delete this relationship?"
            onConfirm={() => handleDeleteRelationship(record.id)}
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="relationships">
      <Card
        title={
          <Space>
            <BranchesOutlined />
            <Title level={4} style={{ margin: 0 }}>Model Relationships</Title>
          </Space>
        }
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setSelectedRelationship(null);
              form.resetFields();
              setModalVisible(true);
            }}
          >
            Create Relationship
          </Button>
        }
      >
        <Alert
          message="Database Relationships"
          description={
            <Space direction="vertical">
              <Text>
                <LinkOutlined /> Define relationships between your data models
              </Text>
              <Text>
                <DisconnectOutlined /> Manage one-to-one, one-to-many, and many-to-many relationships
              </Text>
            </Space>
          }
          type="info"
          showIcon
          style={{ marginBottom: 24 }}
        />

        <Table
          columns={columns}
          dataSource={relationships}
          loading={loading}
          rowKey="id"
        />
      </Card>

      <Modal
        title={selectedRelationship ? 'Edit Relationship' : 'Create Relationship'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={selectedRelationship ? handleUpdateRelationship : handleCreateRelationship}
        >
          <Form.Item
            name="sourceModel"
            label="Source Model"
            rules={[{ required: true, message: 'Please select source model' }]}
          >
            <Select placeholder="Select source model">
              {models.map(model => (
                <Option key={model.id} value={model.name}>{model.name}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="type"
            label="Relationship Type"
            rules={[{ required: true, message: 'Please select relationship type' }]}
          >
            <Select placeholder="Select relationship type">
              <Option value="one-to-one">One-to-One</Option>
              <Option value="one-to-many">One-to-Many</Option>
              <Option value="many-to-many">Many-to-Many</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="targetModel"
            label="Target Model"
            rules={[{ required: true, message: 'Please select target model' }]}
          >
            <Select placeholder="Select target model">
              {models.map(model => (
                <Option key={model.id} value={model.name}>{model.name}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {selectedRelationship ? 'Update' : 'Create'}
              </Button>
              <Button onClick={() => setModalVisible(false)}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      <style jsx>{`
        .relationships {
          padding: 24px;
        }
      `}</style>
    </div>
  );
};

export default Relationships; 