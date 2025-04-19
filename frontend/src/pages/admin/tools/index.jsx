import React, { useState, useEffect } from 'react';
import { Table, Card, Button, Switch, message, Modal, Form, Input, Select } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Option } = Select;

const AdminTools = () => {
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchTools();
  }, []);

  const fetchTools = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/admin/tools');
      setTools(response.data);
    } catch (error) {
      message.error('Failed to fetch tools');
    } finally {
      setLoading(false);
    }
  };

  const handleToolStatusChange = async (id, status) => {
    try {
      await axios.put(`/api/admin/tools/${id}/status`, { status });
      message.success('Tool status updated successfully');
      fetchTools();
    } catch (error) {
      message.error('Failed to update tool status');
    }
  };

  const handleAddTool = async (values) => {
    try {
      setLoading(true);
      await axios.post('/api/admin/tools', values);
      message.success('Tool added successfully');
      setModalVisible(false);
      form.resetFields();
      fetchTools();
    } catch (error) {
      message.error('Failed to add tool');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTool = async (id) => {
    try {
      await axios.delete(`/api/admin/tools/${id}`);
      message.success('Tool deleted successfully');
      fetchTools();
    } catch (error) {
      message.error('Failed to delete tool');
    }
  };

  const columns = [
    {
      title: 'Tool Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status, record) => (
        <Switch
          checked={status === 'active'}
          onChange={(checked) => handleToolStatusChange(record.id, checked ? 'active' : 'inactive')}
        />
      ),
    },
    {
      title: 'Last Sync',
      dataIndex: 'last_sync',
      key: 'last_sync',
      render: (date) => date ? new Date(date).toLocaleString() : 'Never',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => handleDeleteTool(record.id)}
        />
      ),
    },
  ];

  return (
    <Card
      title="Integration Tools Management"
      extra={
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setModalVisible(true)}
        >
          Add Tool
        </Button>
      }
    >
      <Table
        columns={columns}
        dataSource={tools}
        loading={loading}
        rowKey="id"
      />

      <Modal
        title="Add New Tool"
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
          onFinish={handleAddTool}
        >
          <Form.Item
            name="name"
            label="Tool Name"
            rules={[{ required: true, message: 'Please enter tool name' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="type"
            label="Tool Type"
            rules={[{ required: true, message: 'Please select tool type' }]}
          >
            <Select>
              <Option value="api">API Integration</Option>
              <Option value="webhook">Webhook</Option>
              <Option value="database">Database</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="api_key"
            label="API Key"
            rules={[{ required: true, message: 'Please enter API key' }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="status"
            label="Initial Status"
            valuePropName="checked"
          >
            <Switch defaultChecked />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default AdminTools; 