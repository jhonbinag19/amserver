import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Modal, Form, Input, Select, message, Space, Tag, Tree } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Option } = Select;

const AdminRoles = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchRoles();
    fetchPermissions();
  }, []);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/admin/roles');
      setRoles(response.data);
    } catch (error) {
      message.error('Failed to fetch roles');
    } finally {
      setLoading(false);
    }
  };

  const fetchPermissions = async () => {
    try {
      const response = await axios.get('/api/admin/permissions');
      setPermissions(response.data);
    } catch (error) {
      message.error('Failed to fetch permissions');
    }
  };

  const handleRoleCreate = async (values) => {
    try {
      setLoading(true);
      await axios.post('/api/admin/roles', values);
      message.success('Role created successfully');
      setModalVisible(false);
      form.resetFields();
      fetchRoles();
    } catch (error) {
      message.error('Failed to create role');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleDelete = async (id) => {
    try {
      await axios.delete(`/api/admin/roles/${id}`);
      message.success('Role deleted successfully');
      fetchRoles();
    } catch (error) {
      message.error('Failed to delete role');
    }
  };

  const columns = [
    {
      title: 'Role Name',
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
      dataIndex: 'permissions',
      key: 'permissions',
      render: (permissions) => (
        <Space wrap>
          {permissions.map(permission => (
            <Tag key={permission} color="blue">{permission}</Tag>
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
            onClick={() => handleRoleDelete(record.id)}
          />
        </Space>
      ),
    },
  ];

  return (
    <Card
      title="Role Management"
      extra={
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setModalVisible(true)}
        >
          Add Role
        </Button>
      }
    >
      <Table
        columns={columns}
        dataSource={roles}
        loading={loading}
        rowKey="id"
      />

      <Modal
        title="Add New Role"
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
          onFinish={handleRoleCreate}
        >
          <Form.Item
            name="name"
            label="Role Name"
            rules={[{ required: true, message: 'Please enter role name' }]}
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
            name="permissions"
            label="Permissions"
            rules={[{ required: true, message: 'Please select permissions' }]}
          >
            <Select mode="multiple" placeholder="Select permissions">
              {permissions.map(permission => (
                <Option key={permission.id} value={permission.name}>
                  {permission.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default AdminRoles; 