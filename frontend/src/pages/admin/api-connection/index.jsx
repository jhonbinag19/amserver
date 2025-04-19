import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Select, message, Table, Modal, Space, Tag } from 'antd';
import { PlusOutlined, SyncOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Option } = Select;

const AdminApiConnection = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [features, setFeatures] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [apiStatus, setApiStatus] = useState(null);

  useEffect(() => {
    fetchFeatures();
    checkApiStatus();
  }, []);

  const fetchFeatures = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/admin/features');
      setFeatures(response.data);
    } catch (error) {
      message.error('Failed to fetch features');
    } finally {
      setLoading(false);
    }
  };

  const checkApiStatus = async () => {
    try {
      const response = await axios.get('/api/admin/status');
      setApiStatus(response.data);
    } catch (error) {
      message.error('Failed to check API status');
    }
  };

  const handleFeaturePush = async (values) => {
    try {
      setLoading(true);
      await axios.post('/api/admin/features', values);
      message.success('Feature pushed successfully');
      setModalVisible(false);
      form.resetFields();
      fetchFeatures();
    } catch (error) {
      message.error('Failed to push feature');
    } finally {
      setLoading(false);
    }
  };

  const handleFeatureDelete = async (id) => {
    try {
      await axios.delete(`/api/admin/features/${id}`);
      message.success('Feature deleted successfully');
      fetchFeatures();
    } catch (error) {
      message.error('Failed to delete feature');
    }
  };

  const handleApiSync = async () => {
    try {
      setLoading(true);
      await axios.post('/api/admin/sync');
      message.success('API synchronized successfully');
      checkApiStatus();
    } catch (error) {
      message.error('Failed to synchronize API');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Feature Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Version',
      dataIndex: 'version',
      key: 'version',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'active' ? 'success' : 'warning'}>
          {status === 'active' ? 'Active' : 'Pending'}
        </Tag>
      ),
    },
    {
      title: 'Last Updated',
      dataIndex: 'updated_at',
      key: 'updated_at',
      render: (date) => new Date(date).toLocaleString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => handleFeatureDelete(record.id)}
        />
      ),
    },
  ];

  return (
    <Card
      title="API Connection Management"
      extra={
        <Space>
          <Button
            type="primary"
            icon={<SyncOutlined />}
            onClick={handleApiSync}
            loading={loading}
          >
            Sync API
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setModalVisible(true)}
          >
            Push Feature
          </Button>
        </Space>
      }
    >
      {apiStatus && (
        <div style={{ marginBottom: 16 }}>
          <Tag color={apiStatus.status === 'connected' ? 'success' : 'error'}>
            API Status: {apiStatus.status}
          </Tag>
          <span style={{ marginLeft: 8 }}>
            Last Sync: {new Date(apiStatus.last_sync).toLocaleString()}
          </span>
        </div>
      )}

      <Table
        columns={columns}
        dataSource={features}
        loading={loading}
        rowKey="id"
      />

      <Modal
        title="Push New Feature"
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        onOk={() => form.submit()}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFeaturePush}
        >
          <Form.Item
            name="name"
            label="Feature Name"
            rules={[{ required: true, message: 'Please enter feature name' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="version"
            label="Version"
            rules={[{ required: true, message: 'Please enter version' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please enter description' }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item
            name="type"
            label="Feature Type"
            rules={[{ required: true, message: 'Please select feature type' }]}
          >
            <Select>
              <Option value="endpoint">New Endpoint</Option>
              <Option value="enhancement">Enhancement</Option>
              <Option value="bugfix">Bug Fix</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default AdminApiConnection; 