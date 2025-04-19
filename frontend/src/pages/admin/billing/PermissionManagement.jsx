import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Space,
  message,
  Typography,
  Tag
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import api from '../../../utils/axios';

const { Title } = Typography;
const { Option } = Select;

const PermissionManagement = () => {
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingPermission, setEditingPermission] = useState(null);

  useEffect(() => {
    fetchPermissions();
  }, []);

  const fetchPermissions = async () => {
    try {
      const response = await api.get('/permissions');
      setPermissions(response.data);
    } catch (error) {
      message.error('Failed to fetch permissions');
    }
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      if (editingPermission) {
        await api.put(`/permissions/${editingPermission.id}`, values);
        message.success('Permission updated successfully');
      } else {
        await api.post('/permissions', values);
        message.success('Permission created successfully');
      }
      setModalVisible(false);
      form.resetFields();
      setEditingPermission(null);
      fetchPermissions();
    } catch (error) {
      message.error('Failed to save permission');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/permissions/${id}`);
      message.success('Permission deleted successfully');
      fetchPermissions();
    } catch (error) {
      message.error('Failed to delete permission');
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Resource',
      dataIndex: 'resource',
      key: 'resource',
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      render: (action) => (
        <Tag color={getActionColor(action)}>
          {action}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => {
              setEditingPermission(record);
              form.setFieldsValue({
                name: record.name,
                description: record.description,
                resource: record.resource,
                action: record.action
              });
              setModalVisible(true);
            }}
          >
            Edit
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  const getActionColor = (action) => {
    const colors = {
      create: 'green',
      read: 'blue',
      update: 'orange',
      delete: 'red',
      manage: 'purple'
    };
    return colors[action] || 'default';
  };

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
          <Title level={4}>Permission Management</Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingPermission(null);
              form.resetFields();
              setModalVisible(true);
            }}
          >
            Add Permission
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={permissions}
          rowKey="id"
          loading={loading}
        />

        <Modal
          title={editingPermission ? 'Edit Permission' : 'Add Permission'}
          open={modalVisible}
          onCancel={() => {
            setModalVisible(false);
            form.resetFields();
            setEditingPermission(null);
          }}
          footer={null}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
          >
            <Form.Item
              name="name"
              label="Permission Name"
              rules={[{ required: true, message: 'Please input permission name!' }]}
            >
              <Input placeholder="Enter permission name" />
            </Form.Item>

            <Form.Item
              name="description"
              label="Description"
            >
              <Input.TextArea placeholder="Enter permission description" />
            </Form.Item>

            <Form.Item
              name="resource"
              label="Resource"
              rules={[{ required: true, message: 'Please select resource!' }]}
            >
              <Input placeholder="Enter resource name (e.g., users, roles, permissions)" />
            </Form.Item>

            <Form.Item
              name="action"
              label="Action"
              rules={[{ required: true, message: 'Please select action!' }]}
            >
              <Select placeholder="Select action">
                <Option value="create">Create</Option>
                <Option value="read">Read</Option>
                <Option value="update">Update</Option>
                <Option value="delete">Delete</Option>
                <Option value="manage">Manage</Option>
              </Select>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                {editingPermission ? 'Update' : 'Create'}
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    </div>
  );
};

export default PermissionManagement; 