import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Modal,
  Form,
  Input,
  Checkbox,
  Space,
  message,
  Typography,
  Tag
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import api from '../../../utils/axios';

const { Title } = Typography;

const RoleManagement = () => {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingRole, setEditingRole] = useState(null);

  useEffect(() => {
    fetchRoles();
    fetchPermissions();
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await api.get('/roles');
      setRoles(response.data);
    } catch (error) {
      message.error('Failed to fetch roles');
    }
  };

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
      if (editingRole) {
        await api.put(`/roles/${editingRole.id}`, values);
        message.success('Role updated successfully');
      } else {
        await api.post('/roles', values);
        message.success('Role created successfully');
      }
      setModalVisible(false);
      form.resetFields();
      setEditingRole(null);
      fetchRoles();
    } catch (error) {
      message.error('Failed to save role');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/roles/${id}`);
      message.success('Role deleted successfully');
      fetchRoles();
    } catch (error) {
      message.error('Failed to delete role');
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
      title: 'Permissions',
      dataIndex: 'Permissions',
      key: 'permissions',
      render: (permissions) => (
        <Space wrap>
          {permissions.map(permission => (
            <Tag key={permission.id}>
              {permission.name}
            </Tag>
          ))}
        </Space>
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
              setEditingRole(record);
              form.setFieldsValue({
                name: record.name,
                description: record.description,
                isAdmin: record.isAdmin,
                permissions: record.Permissions.map(p => p.id)
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

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
          <Title level={4}>Role Management</Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingRole(null);
              form.resetFields();
              setModalVisible(true);
            }}
          >
            Add Role
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={roles}
          rowKey="id"
          loading={loading}
        />

        <Modal
          title={editingRole ? 'Edit Role' : 'Add Role'}
          open={modalVisible}
          onCancel={() => {
            setModalVisible(false);
            form.resetFields();
            setEditingRole(null);
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
              label="Role Name"
              rules={[{ required: true, message: 'Please input role name!' }]}
            >
              <Input placeholder="Enter role name" />
            </Form.Item>

            <Form.Item
              name="description"
              label="Description"
            >
              <Input.TextArea placeholder="Enter role description" />
            </Form.Item>

            <Form.Item
              name="isAdmin"
              valuePropName="checked"
            >
              <Checkbox>Is Admin Role</Checkbox>
            </Form.Item>

            <Form.Item
              name="permissions"
              label="Permissions"
            >
              <Checkbox.Group style={{ width: '100%' }}>
                {permissions.map(permission => (
                  <div key={permission.id} style={{ marginBottom: '8px' }}>
                    <Checkbox value={permission.id}>
                      {permission.name} ({permission.resource} - {permission.action})
                    </Checkbox>
                  </div>
                ))}
              </Checkbox.Group>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                {editingRole ? 'Update' : 'Create'}
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    </div>
  );
};

export default RoleManagement; 