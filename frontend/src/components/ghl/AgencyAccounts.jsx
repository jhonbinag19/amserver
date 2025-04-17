import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Modal,
  Form,
  Input,
  message,
  Space,
  Tag,
  Popconfirm
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';

const AgencyAccounts = () => {
  const [agencies, setAgencies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchAgencies();
  }, []);

  const fetchAgencies = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/ghl/organizations/:organizationId/agency-accounts');
      setAgencies(response.data);
    } catch (error) {
      message.error('Failed to fetch agency accounts');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    try {
      await axios.post('/api/ghl/organizations/:organizationId/agency-accounts', values);
      message.success('Agency account added successfully');
      setModalVisible(false);
      form.resetFields();
      fetchAgencies();
    } catch (error) {
      message.error('Failed to add agency account');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/ghl/agency-accounts/${id}`);
      message.success('Agency account deleted successfully');
      fetchAgencies();
    } catch (error) {
      message.error('Failed to delete agency account');
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Agency ID',
      dataIndex: 'agency_id',
      key: 'agency_id',
    },
    {
      title: 'Status',
      dataIndex: 'is_active',
      key: 'status',
      render: (isActive) => (
        <Tag color={isActive ? 'success' : 'error'}>
          {isActive ? 'Active' : 'Inactive'}
        </Tag>
      ),
    },
    {
      title: 'Created At',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => {
              form.setFieldsValue(record);
              setModalVisible(true);
            }}
          />
          <Popconfirm
            title="Are you sure you want to delete this agency account?"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card
      title="GoHighLevel Agency Accounts"
      extra={
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setModalVisible(true)}
        >
          Add Agency Account
        </Button>
      }
    >
      <Table
        columns={columns}
        dataSource={agencies}
        loading={loading}
        rowKey="id"
      />

      <Modal
        title="Add Agency Account"
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
          onFinish={handleSubmit}
        >
          <Form.Item
            name="name"
            label="Agency Name"
            rules={[{ required: true, message: 'Please enter agency name' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="agency_id"
            label="Agency ID"
            rules={[{ required: true, message: 'Please enter agency ID' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="api_key"
            label="API Key"
            rules={[{ required: true, message: 'Please enter API key' }]}
          >
            <Input.Password />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default AgencyAccounts; 