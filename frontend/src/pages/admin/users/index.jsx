import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Modal, Form, Input, Select, message, Space, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Option } = Select;

const AdminUsers = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/admin/users');
      setUsers(response.data);
    } catch (error) {
      message.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await axios.get('/api/admin/roles');
      setRoles(response.data);
    } catch (error) {
      message.error('Failed to fetch roles');
    }
  };

  const handleUserCreate = async (values) => {
    try {
      setLoading(true);
      await axios.post('/api/admin/users', values);
      message.success('User created successfully');
      setModalVisible(false);
      form.resetFields();
      fetchUsers();
    } catch (error) {
      message.error('Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  const handleUserDelete = async (id) => {
    try {
      await axios.delete(`/api/admin/users/${id}`);
      message.success('User deleted successfully');
      fetchUsers();
    } catch (error) {
      message.error('Failed to delete user');
    }
  };

  const columns = [
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role) => (
        <Tag color="blue">{role}</Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'active' ? 'success' : 'error'}>
          {status === 'active' ? 'Active' : 'Inactive'}
        </Tag>
      ),
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
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleUserDelete(record.id)}
          />
        </Space>
      ),
    },
  ];

  return (
    <Card
      title="User Management"
      extra={
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setModalVisible(true)}
        >
          Add User
        </Button>
      }
    >
      <Table
        columns={columns}
        dataSource={users}
        loading={loading}
        rowKey="id"
      />

      <Modal
        title="Add New User"
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
          onFinish={handleUserCreate}
        >
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true, message: 'Please enter username' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please enter email' },
              { type: 'email', message: 'Please enter a valid email' }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: 'Please enter password' }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true, message: 'Please select role' }]}
          >
            <Select>
              {roles.map(role => (
                <Option key={role.id} value={role.name}>{role.name}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="status"
            label="Status"
            valuePropName="checked"
          >
            <Switch defaultChecked />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default AdminUsers; 