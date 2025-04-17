import React, { useState, useEffect } from 'react';
import {
  Card,
  Form,
  Select,
  Button,
  message,
  Space,
  Divider,
  Typography,
  Collapse,
  Input,
  Switch
} from 'antd';
import { PlusOutlined, SaveOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Title } = Typography;
const { Panel } = Collapse;

const IntegrationWorkflows = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [workflows, setWorkflows] = useState([]);
  const [triggers, setTriggers] = useState([]);
  const [actions, setActions] = useState([]);
  const [selectedTrigger, setSelectedTrigger] = useState(null);
  const [selectedAction, setSelectedAction] = useState(null);

  useEffect(() => {
    fetchWorkflows();
    fetchTriggers();
    fetchActions();
  }, []);

  const fetchWorkflows = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/ghl/organizations/:organizationId/workflows');
      setWorkflows(response.data);
    } catch (error) {
      message.error('Failed to fetch workflows');
    } finally {
      setLoading(false);
    }
  };

  const fetchTriggers = async () => {
    try {
      const response = await axios.get('/api/ghl/triggers');
      setTriggers(response.data);
    } catch (error) {
      message.error('Failed to fetch triggers');
    }
  };

  const fetchActions = async () => {
    try {
      const response = await axios.get('/api/ghl/actions');
      setActions(response.data);
    } catch (error) {
      message.error('Failed to fetch actions');
    }
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      await axios.post('/api/ghl/organizations/:organizationId/workflows', values);
      message.success('Workflow created successfully');
      form.resetFields();
      fetchWorkflows();
    } catch (error) {
      message.error('Failed to create workflow');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/ghl/workflows/${id}`);
      message.success('Workflow deleted successfully');
      fetchWorkflows();
    } catch (error) {
      message.error('Failed to delete workflow');
    }
  };

  const getTriggerFields = (triggerId) => {
    const trigger = triggers.find(t => t.id === triggerId);
    return trigger ? trigger.fields : [];
  };

  const getActionFields = (actionId) => {
    const action = actions.find(a => a.id === actionId);
    return action ? action.fields : [];
  };

  return (
    <Card loading={loading}>
      <Title level={4}>Integration Workflows</Title>
      <Divider />
      
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Card title="Create New Workflow">
            <Form.Item
              name="name"
              label="Workflow Name"
              rules={[{ required: true, message: 'Please enter workflow name' }]}
            >
              <Input placeholder="Enter workflow name" />
            </Form.Item>

            <Form.Item
              name="trigger_id"
              label="Trigger"
              rules={[{ required: true, message: 'Please select a trigger' }]}
            >
              <Select
                placeholder="Select a trigger"
                onChange={(value) => setSelectedTrigger(value)}
              >
                {triggers.map(trigger => (
                  <Select.Option key={trigger.id} value={trigger.id}>
                    {trigger.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            {selectedTrigger && getTriggerFields(selectedTrigger).map(field => (
              <Form.Item
                key={field.id}
                name={['trigger_fields', field.id]}
                label={field.label}
                rules={[{ required: field.required, message: `Please enter ${field.label}` }]}
              >
                {field.type === 'select' ? (
                  <Select>
                    {field.options.map(option => (
                      <Select.Option key={option.value} value={option.value}>
                        {option.label}
                      </Select.Option>
                    ))}
                  </Select>
                ) : (
                  <Input />
                )}
              </Form.Item>
            ))}

            <Form.Item
              name="action_id"
              label="Action"
              rules={[{ required: true, message: 'Please select an action' }]}
            >
              <Select
                placeholder="Select an action"
                onChange={(value) => setSelectedAction(value)}
              >
                {actions.map(action => (
                  <Select.Option key={action.id} value={action.id}>
                    {action.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            {selectedAction && getActionFields(selectedAction).map(field => (
              <Form.Item
                key={field.id}
                name={['action_fields', field.id]}
                label={field.label}
                rules={[{ required: field.required, message: `Please enter ${field.label}` }]}
              >
                {field.type === 'select' ? (
                  <Select>
                    {field.options.map(option => (
                      <Select.Option key={option.value} value={option.value}>
                        {option.label}
                      </Select.Option>
                    ))}
                  </Select>
                ) : (
                  <Input />
                )}
              </Form.Item>
            ))}

            <Form.Item
              name="is_active"
              label="Active"
              valuePropName="checked"
            >
              <Switch defaultChecked />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                icon={<SaveOutlined />}
                loading={loading}
              >
                Create Workflow
              </Button>
            </Form.Item>
          </Card>

          <Card title="Existing Workflows">
            <Collapse>
              {workflows.map(workflow => (
                <Panel
                  key={workflow.id}
                  header={workflow.name}
                  extra={
                    <Space>
                      <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(workflow.id);
                        }}
                      />
                    </Space>
                  }
                >
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <div>
                      <strong>Trigger:</strong> {workflow.trigger_name}
                    </div>
                    <div>
                      <strong>Action:</strong> {workflow.action_name}
                    </div>
                    <div>
                      <strong>Status:</strong> {workflow.is_active ? 'Active' : 'Inactive'}
                    </div>
                    <div>
                      <strong>Created At:</strong> {new Date(workflow.created_at).toLocaleString()}
                    </div>
                  </Space>
                </Panel>
              ))}
            </Collapse>
          </Card>
        </Space>
      </Form>
    </Card>
  );
};

export default IntegrationWorkflows; 