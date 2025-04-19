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
  Popconfirm,
  Switch,
  InputNumber
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import axios from 'axios';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const ValidationRules = () => {
  const [rules, setRules] = useState([]);
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [selectedRule, setSelectedRule] = useState(null);

  useEffect(() => {
    fetchRules();
    fetchModels();
  }, []);

  const fetchRules = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/schema/validation-rules');
      setRules(response.data);
    } catch (error) {
      message.error('Failed to fetch validation rules');
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

  const handleCreateRule = async (values) => {
    try {
      await axios.post('/api/schema/validation-rules', values);
      message.success('Validation rule created successfully');
      setModalVisible(false);
      form.resetFields();
      fetchRules();
    } catch (error) {
      message.error('Failed to create validation rule');
    }
  };

  const handleUpdateRule = async (values) => {
    try {
      await axios.put(`/api/schema/validation-rules/${selectedRule.id}`, values);
      message.success('Validation rule updated successfully');
      setModalVisible(false);
      form.resetFields();
      fetchRules();
    } catch (error) {
      message.error('Failed to update validation rule');
    }
  };

  const handleDeleteRule = async (ruleId) => {
    try {
      await axios.delete(`/api/schema/validation-rules/${ruleId}`);
      message.success('Validation rule deleted successfully');
      fetchRules();
    } catch (error) {
      message.error('Failed to delete validation rule');
    }
  };

  const columns = [
    {
      title: 'Field Name',
      dataIndex: 'fieldName',
      key: 'fieldName',
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: 'Model',
      dataIndex: 'modelName',
      key: 'modelName',
      render: (text) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: 'Rule Type',
      dataIndex: 'ruleType',
      key: 'ruleType',
      render: (type) => (
        <Tag color={
          type === 'required' ? 'red' :
          type === 'unique' ? 'green' :
          type === 'format' ? 'purple' :
          type === 'custom' ? 'orange' : 'default'
        }>
          {type}
        </Tag>
      ),
    },
    {
      title: 'Active',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive) => (
        <Switch
          checked={isActive}
          disabled
        />
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Tooltip title="Edit Rule">
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => {
                setSelectedRule(record);
                form.setFieldsValue(record);
                setModalVisible(true);
              }}
            />
          </Tooltip>
          <Popconfirm
            title="Are you sure you want to delete this rule?"
            onConfirm={() => handleDeleteRule(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              danger
              icon={<DeleteOutlined />}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="validation-rules">
      <Card
        title={
          <Space>
            <CheckCircleOutlined />
            <Title level={4} style={{ margin: 0 }}>Validation Rules</Title>
          </Space>
        }
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setSelectedRule(null);
              form.resetFields();
              setModalVisible(true);
            }}
          >
            Add Rule
          </Button>
        }
      >
        <Alert
          message="Validation Rules"
          description={
            <Space direction="vertical">
              <Text>
                <CheckCircleOutlined style={{ color: '#52c41a' }} /> 
                Define field validation rules for your models
              </Text>
              <Text>
                <WarningOutlined style={{ color: '#faad14' }} /> 
                Ensure data integrity and consistency
              </Text>
              <Text>
                <InfoCircleOutlined style={{ color: '#1890ff' }} /> 
                Custom validation rules supported
              </Text>
            </Space>
          }
          type="info"
          showIcon
          style={{ marginBottom: 24 }}
        />

        <Table
          columns={columns}
          dataSource={rules}
          loading={loading}
          rowKey="id"
        />
      </Card>

      <Modal
        title={selectedRule ? 'Edit Validation Rule' : 'Add Validation Rule'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={selectedRule ? handleUpdateRule : handleCreateRule}
        >
          <Form.Item
            name="modelName"
            label="Model"
            rules={[{ required: true, message: 'Please select a model' }]}
          >
            <Select placeholder="Select model">
              {models.map(model => (
                <Option key={model.id} value={model.name}>
                  {model.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="fieldName"
            label="Field Name"
            rules={[{ required: true, message: 'Please enter field name' }]}
          >
            <Input placeholder="Enter field name" />
          </Form.Item>

          <Form.Item
            name="ruleType"
            label="Rule Type"
            rules={[{ required: true, message: 'Please select rule type' }]}
          >
            <Select placeholder="Select rule type">
              <Option value="required">Required</Option>
              <Option value="unique">Unique</Option>
              <Option value="format">Format</Option>
              <Option value="custom">Custom</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="ruleValue"
            label="Rule Value"
            rules={[{ required: true, message: 'Please enter rule value' }]}
          >
            <TextArea
              placeholder="Enter rule value or custom validation logic"
              rows={4}
            />
          </Form.Item>

          <Form.Item
            name="errorMessage"
            label="Error Message"
            rules={[{ required: true, message: 'Please enter error message' }]}
          >
            <Input placeholder="Enter error message to display" />
          </Form.Item>

          <Form.Item
            name="isActive"
            label="Active"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {selectedRule ? 'Update' : 'Create'}
              </Button>
              <Button onClick={() => setModalVisible(false)}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      <style jsx>{`
        .validation-rules {
          padding: 24px;
        }
      `}</style>
    </div>
  );
};

export default ValidationRules; 