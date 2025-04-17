import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  message,
  Space,
  Tag,
  Popconfirm
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';

const SubAccounts = () => {
  const [subAccounts, setSubAccounts] = useState([]);
  const [agencies, setAgencies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchAgencies();
    fetchSubAccounts();
  }, []);

  const fetchAgencies = async () => {
    try {
      const response = await axios.get('/api/ghl/organizations/:organizationId/agency-accounts');
      setAgencies(response.data);
    } catch (error) {
      message.error('Failed to fetch agency accounts');
    }
  };

  const fetchSubAccounts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/ghl/agency-accounts/:agencyAccountId/sub-accounts');
      setSubAccounts(response.data);
    } catch (error) {
      message.error('Failed to fetch sub-accounts');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    try {
      await axios.post('/api/ghl/agency-accounts/:agencyAccountId/sub-accounts', values);
      message.success('Sub-account added successfully');
      setModalVisible(false);
      form.resetFields();
      fetchSubAccounts();
    } catch (error) {
      message.error('Failed to add sub-account');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/ghl/sub-accounts/${id}`);
      message.success('Sub-account deleted successfully');
      fetchSubAccounts();
    } catch (error) {
      message.error('Failed to delete sub-account');
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Sub-Account ID',
      dataIndex: 'sub_account_id',
      key: 'sub_account_id',
    },
    {
      title: 'Agency',
      dataIndex: 'agency_account_id',
      key: 'agency',
      render: (agencyId) => {
        const agency = agencies.find(a => a.id === agencyId);
        return agency ? agency.name : 'Unknown';
      },
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
            title="Are you sure you want to delete this sub-account?"
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
      title="GoHighLevel Sub-Accounts"
      extra={
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setModalVisible(true)}
        >
          Add Sub-Account
        </Button>
      }
    >
      <Table
        columns={columns}
        dataSource={subAccounts}
        loading={loading}
        rowKey="id"
      />

      <Modal
        title="Add Sub-Account"
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
            name="agency_account_id"
            label="Agency Account"
            rules={[{ required: true, message: 'Please select agency account' }]}
          >
            <Select>
              {agencies.map(agency => (
                <Select.Option key={agency.id} value={agency.id}>
                  {agency.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="name"
            label="Sub-Account Name"
            rules={[{ required: true, message: 'Please enter sub-account name' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="sub_account_id"
            label="Sub-Account ID"
            rules={[{ required: true, message: 'Please enter sub-account ID' }]}
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

export default SubAccounts; 