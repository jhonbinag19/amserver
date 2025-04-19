import React, { useState, useEffect } from 'react';
import { Card, List, Tag, Button, Modal, Form, Input, Select, message, Space, Tooltip, Tabs } from 'antd';
import { 
  ApiOutlined, 
  PlusOutlined, 
  SettingOutlined, 
  InfoCircleOutlined,
  AppstoreOutlined,
  RobotOutlined,
  DatabaseOutlined,
  MessageOutlined,
  ShopOutlined,
  TeamOutlined,
  FileOutlined,
  ToolOutlined
} from '@ant-design/icons';
import api from '../../utils/axios';

const { Option } = Select;
const { TabPane } = Tabs;

const WorkflowActions = () => {
  const [actions, setActions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchWorkflowActions();
  }, []);

  const fetchWorkflowActions = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/api/integrations/workflow-actions');
      setActions(data);
    } catch (error) {
      message.error('Failed to fetch workflow actions');
    } finally {
      setLoading(false);
    }
  };

  const handleAddAction = async (values) => {
    try {
      await api.post('/api/integrations/workflow-actions', values);
      message.success('Action added successfully');
      setModalVisible(false);
      form.resetFields();
      fetchWorkflowActions();
    } catch (error) {
      message.error('Failed to add action');
    }
  };

  // Zapier-inspired action categories
  const actionCategories = {
    'Artificial Intelligence': {
      icon: <RobotOutlined />,
      actions: ['AI Analysis', 'Text Generation', 'Image Processing']
    },
    'Business Intelligence': {
      icon: <DatabaseOutlined />,
      actions: ['Data Analysis', 'Report Generation', 'Analytics Tracking']
    },
    'Communication': {
      icon: <MessageOutlined />,
      actions: ['Send Email', 'Send SMS', 'Push Notification', 'Team Chat']
    },
    'Commerce': {
      icon: <ShopOutlined />,
      actions: ['Create Order', 'Update Payment', 'Process Refund']
    },
    'Human Resources': {
      icon: <TeamOutlined />,
      actions: ['Create Contact', 'Update Lead', 'Schedule Meeting']
    },
    'Content & Files': {
      icon: <FileOutlined />,
      actions: ['Create Document', 'Upload File', 'Convert Format']
    }
  };

  const actionTypes = {
    'create': {
      label: 'Create',
      description: 'Creates new items in your connected apps'
    },
    'search': {
      label: 'Search',
      description: 'Finds existing items in your apps'
    },
    'update': {
      label: 'Update',
      description: 'Modifies existing items in your apps'
    }
  };

  const renderActionCard = (action, category) => {
    const actionData = actions.find(a => a.name === action);
    const actionType = actionData?.type || 'create';

    return (
      <List.Item>
        <Card 
          size="small" 
          hoverable
          title={
            <Space>
              {actionCategories[category].icon}
              {action}
              <Tag color={actionTypes[actionType]?.color || 'blue'}>
                {actionTypes[actionType]?.label}
              </Tag>
            </Space>
          }
          extra={
            <Tag color={actionData?.enabled ? 'success' : 'default'}>
              {actionData?.enabled ? 'Active' : 'Inactive'}
            </Tag>
          }
        >
          <p style={{ color: '#666', fontSize: '13px' }}>
            {actionData?.description || `${actionTypes[actionType]?.description} using ${action}`}
          </p>
          <div style={{ marginTop: 12 }}>
            <Space>
              <Button 
                type="text" 
                icon={<SettingOutlined />}
                size="small"
              >
                Configure
              </Button>
              <Tooltip title="View API Documentation">
                <Button
                  type="text"
                  icon={<InfoCircleOutlined />}
                  size="small"
                />
              </Tooltip>
            </Space>
          </div>
        </Card>
      </List.Item>
    );
  };

  return (
    <div>
      <Card
        title={
          <Space>
            <ApiOutlined /> 
            Workflow Actions
            <Tooltip title="These actions are available for your integrated tools">
              <InfoCircleOutlined style={{ color: '#1890ff' }} />
            </Tooltip>
          </Space>
        }
        extra={
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => setModalVisible(true)}
          >
            Add Action
          </Button>
        }
      >
        <Tabs defaultActiveKey="all">
          <TabPane tab="All Actions" key="all">
            {Object.entries(actionCategories).map(([category, { actions: categoryActions }]) => (
              <div key={category} style={{ marginBottom: 24 }}>
                <h3 style={{ marginBottom: 16 }}>
                  <Space>
                    {actionCategories[category].icon}
                    {category}
                  </Space>
                </h3>
                <List
                  loading={loading}
                  grid={{ gutter: 16, column: 2 }}
                  dataSource={categoryActions}
                  renderItem={action => renderActionCard(action, category)}
                />
              </div>
            ))}
          </TabPane>
          {Object.entries(actionTypes).map(([type, { label }]) => (
            <TabPane tab={label} key={type}>
              <List
                loading={loading}
                grid={{ gutter: 16, column: 2 }}
                dataSource={Object.entries(actionCategories).flatMap(([category, { actions: categoryActions }]) =>
                  categoryActions.map(action => ({ action, category }))
                ).filter(({ action }) => {
                  const actionData = actions.find(a => a.name === action);
                  return actionData?.type === type;
                })}
                renderItem={({ action, category }) => renderActionCard(action, category)}
              />
            </TabPane>
          ))}
        </Tabs>
      </Card>

      <Modal
        title="Add Workflow Action"
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        onOk={form.submit}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddAction}
        >
          <Form.Item
            name="name"
            label="Action Name"
            rules={[{ required: true }]}
          >
            <Input placeholder="e.g., Create Subscriber" />
          </Form.Item>

          <Form.Item
            name="category"
            label="Category"
            rules={[{ required: true }]}
          >
            <Select placeholder="Select category">
              {Object.keys(actionCategories).map(category => (
                <Option key={category} value={category}>{category}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="type"
            label="Action Type"
            rules={[{ required: true }]}
          >
            <Select placeholder="Select action type">
              {Object.entries(actionTypes).map(([type, { label }]) => (
                <Option key={type} value={type}>{label}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
          >
            <Input.TextArea placeholder="Describe what this action does" />
          </Form.Item>

          <Form.Item
            name="enabled"
            label="Status"
            initialValue={true}
          >
            <Select>
              <Option value={true}>Active</Option>
              <Option value={false}>Inactive</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default WorkflowActions;