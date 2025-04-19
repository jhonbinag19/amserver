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
  DatabaseOutlined,
  FieldTimeOutlined,
  FileSearchOutlined
} from '@ant-design/icons';
import axios from 'axios';

const { Title, Text } = Typography;
const { Option } = Select;

const DataModels = () => {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [selectedModel, setSelectedModel] = useState(null);

  useEffect(() => {
    fetchModels();
  }, []);

  const fetchModels = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/schema/models');
      setModels(response.data);
    } catch (error) {
      message.error('Failed to fetch data models');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateModel = async (values) => {
    try {
      await axios.post('/api/schema/models', values);
      message.success('Model created successfully');
      setModalVisible(false);
      form.resetFields();
      fetchModels();
    } catch (error) {
      message.error('Failed to create model');
    }
  };

  const handleUpdateModel = async (values) => {
    try {
      await axios.put(`/api/schema/models/${selectedModel.id}`, values);
      message.success('Model updated successfully');
      setModalVisible(false);
      setSelectedModel(null);
      form.resetFields();
      fetchModels();
    } catch (error) {
      message.error('Failed to update model');
    }
  };

  const handleDeleteModel = async (modelId) => {
    try {
      await axios.delete(`/api/schema/models/${modelId}`);
      message.success('Model deleted successfully');
      fetchModels();
    } catch (error) {
      message.error('Failed to delete model');
    }
  };

  const columns = [
    {
      title: 'Model Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: 'Fields',
      dataIndex: 'fields',
      key: 'fields',
      render: (fields) => (
        <Space size="small">
          {fields.map((field, index) => (
            <Tag key={index}>{field.name}</Tag>
          ))}
        </Space>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type) => (
        <Tag color={type === 'collection' ? 'blue' : 'green'}>
          {type === 'collection' ? 'Collection' : 'Document'}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Tooltip title="Edit Model">
            <Button
              icon={<EditOutlined />}
              onClick={() => {
                setSelectedModel(record);
                form.setFieldsValue(record);
                setModalVisible(true);
              }}
            />
          </Tooltip>
          <Popconfirm
            title="Are you sure you want to delete this model?"
            onConfirm={() => handleDeleteModel(record.id)}
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="data-models">
      <Card
        title={
          <Space>
            <DatabaseOutlined />
            <Title level={4} style={{ margin: 0 }}>Data Models</Title>
          </Space>
        }
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setSelectedModel(null);
              form.resetFields();
              setModalVisible(true);
            }}
          >
            Create Model
          </Button>
        }
      >
        <Alert
          message="Database Schema Management"
          description={
            <Space direction="vertical">
              <Text>
                <DatabaseOutlined /> Manage your database models and their relationships
              </Text>
              <Text>
                <FieldTimeOutlined /> Track schema changes and migrations
              </Text>
              <Text>
                <FileSearchOutlined /> Define validation rules and constraints
              </Text>
            </Space>
          }
          type="info"
          showIcon
          style={{ marginBottom: 24 }}
        />

        <Table
          columns={columns}
          dataSource={models}
          loading={loading}
          rowKey="id"
        />
      </Card>

      <Modal
        title={selectedModel ? 'Edit Model' : 'Create Model'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={selectedModel ? handleUpdateModel : handleCreateModel}
        >
          <Form.Item
            name="name"
            label="Model Name"
            rules={[{ required: true, message: 'Please enter model name' }]}
          >
            <Input placeholder="Enter model name" />
          </Form.Item>

          <Form.Item
            name="type"
            label="Model Type"
            rules={[{ required: true, message: 'Please select model type' }]}
          >
            <Select placeholder="Select model type">
              <Option value="collection">Collection</Option>
              <Option value="document">Document</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="fields"
            label="Fields"
            rules={[{ required: true, message: 'Please add at least one field' }]}
          >
            <Select
              mode="tags"
              placeholder="Add fields (press enter to add)"
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {selectedModel ? 'Update' : 'Create'}
              </Button>
              <Button onClick={() => setModalVisible(false)}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      <style jsx>{`
        .data-models {
          padding: 24px;
        }
      `}</style>
    </div>
  );
};

export default DataModels; 