import React, { useState, useEffect } from 'react';
import {
  Card,
  Button,
  Table,
  Space,
  Modal,
  Form,
  Input,
  Select,
  Tag,
  Drawer,
  Timeline,
  Switch,
  message,
  Tooltip,
  Popconfirm,
  Tabs,
  Collapse,
  Row,
  Col,
  Divider,
  Typography,
  InputNumber,
  Checkbox
} from 'antd';
import {
  PlusOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  EditOutlined,
  DeleteOutlined,
  HistoryOutlined,
  BranchesOutlined,
  ApiOutlined,
  SaveOutlined,
  DragOutlined,
  SettingOutlined,
  FilterOutlined
} from '@ant-design/icons';
import axios from 'axios';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { WorkflowStep } from './WorkflowStep';
import { WorkflowCanvas } from './WorkflowCanvas';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Panel } = Collapse;
const { Option } = Select;

const TRIGGER_TYPES = {
  WEBHOOK: 'webhook',
  SCHEDULE: 'schedule',
  EVENT: 'event',
  MANUAL: 'manual'
};

const ACTION_TYPES = {
  HTTP: 'http',
  DATABASE: 'database',
  CUSTOM: 'custom',
  INTEGRATION: 'integration'
};

const WorkflowManager = () => {
  const [workflows, setWorkflows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState(null);
  const [form] = Form.useForm();
  const [integrations, setIntegrations] = useState([]);
  const [executionHistory, setExecutionHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('list');
  const [workflowSteps, setWorkflowSteps] = useState([]);
  const [selectedStep, setSelectedStep] = useState(null);

  useEffect(() => {
    fetchWorkflows();
    fetchIntegrations();
  }, []);

  const fetchWorkflows = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/workflows');
      setWorkflows(response.data);
    } catch (error) {
      message.error('Failed to fetch workflows');
    } finally {
      setLoading(false);
    }
  };

  const fetchIntegrations = async () => {
    try {
      const response = await axios.get('/api/integrations');
      setIntegrations(response.data);
    } catch (error) {
      message.error('Failed to fetch integrations');
    }
  };

  const fetchExecutionHistory = async (workflowId) => {
    try {
      const response = await axios.get(`/api/workflows/${workflowId}/history`);
      setExecutionHistory(response.data);
    } catch (error) {
      message.error('Failed to fetch execution history');
    }
  };

  const handleCreateWorkflow = async (values) => {
    try {
      await axios.post('/api/workflows', values);
      message.success('Workflow created successfully');
      setModalVisible(false);
      form.resetFields();
      fetchWorkflows();
    } catch (error) {
      message.error('Failed to create workflow');
    }
  };

  const handleUpdateWorkflow = async (id, values) => {
    try {
      await axios.put(`/api/workflows/${id}`, values);
      message.success('Workflow updated successfully');
      setModalVisible(false);
      form.resetFields();
      fetchWorkflows();
    } catch (error) {
      message.error('Failed to update workflow');
    }
  };

  const handleDeleteWorkflow = async (id) => {
    try {
      await axios.delete(`/api/workflows/${id}`);
      message.success('Workflow deleted successfully');
      fetchWorkflows();
    } catch (error) {
      message.error('Failed to delete workflow');
    }
  };

  const handleToggleWorkflow = async (id, active) => {
    try {
      await axios.put(`/api/workflows/${id}/toggle`, { active });
      message.success(`Workflow ${active ? 'activated' : 'deactivated'} successfully`);
      fetchWorkflows();
    } catch (error) {
      message.error('Failed to toggle workflow');
    }
  };

  const showWorkflowHistory = (workflow) => {
    setSelectedWorkflow(workflow);
    fetchExecutionHistory(workflow.id);
    setDrawerVisible(true);
  };

  const addStep = (type) => {
    const newStep = {
      id: `step-${Date.now()}`,
      type,
      name: `New ${type} Step`,
      config: {},
      next: []
    };
    setWorkflowSteps([...workflowSteps, newStep]);
  };

  const updateStep = (stepId, updates) => {
    setWorkflowSteps(workflowSteps.map(step => 
      step.id === stepId ? { ...step, ...updates } : step
    ));
  };

  const removeStep = (stepId) => {
    setWorkflowSteps(workflowSteps.filter(step => step.id !== stepId));
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Space>
          {text}
          {record.active ? (
            <Tag color="success">Active</Tag>
          ) : (
            <Tag color="error">Inactive</Tag>
          )}
        </Space>
      ),
    },
    {
      title: 'Trigger',
      dataIndex: 'trigger',
      key: 'trigger',
      render: (trigger) => (
        <Tag color="blue">
          <ApiOutlined /> {trigger.type}
        </Tag>
      ),
    },
    {
      title: 'Steps',
      dataIndex: 'steps',
      key: 'steps',
      render: (steps) => (
        <Tag color="purple">{steps?.length || 0} Steps</Tag>
      ),
    },
    {
      title: 'Last Run',
      dataIndex: 'lastRun',
      key: 'lastRun',
      render: (date) => date ? new Date(date).toLocaleString() : 'Never',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Switch
            checked={record.active}
            onChange={(checked) => handleToggleWorkflow(record.id, checked)}
            checkedChildren={<PlayCircleOutlined />}
            unCheckedChildren={<PauseCircleOutlined />}
          />
          <Tooltip title="Edit">
            <Button
              icon={<EditOutlined />}
              onClick={() => {
                setSelectedWorkflow(record);
                setWorkflowSteps(record.steps || []);
                setActiveTab('builder');
              }}
            />
          </Tooltip>
          <Tooltip title="History">
            <Button
              icon={<HistoryOutlined />}
              onClick={() => showWorkflowHistory(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Are you sure you want to delete this workflow?"
            onConfirm={() => handleDeleteWorkflow(record.id)}
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="workflow-manager">
      <Card
        title="Workflow Manager"
        extra={
          <Space>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                setSelectedWorkflow(null);
                form.resetFields();
                setModalVisible(true);
              }}
            >
              Create Workflow
            </Button>
          </Space>
        }
      >
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="Workflow List" key="list">
            <Table
              columns={columns}
              dataSource={workflows}
              loading={loading}
              rowKey="id"
            />
          </TabPane>
          <TabPane tab="Workflow Builder" key="builder">
            <DndProvider backend={HTML5Backend}>
              <Row gutter={[16, 16]}>
                <Col span={6}>
                  <Card title="Steps Library">
                    <Space direction="vertical" style={{ width: '100%' }}>
                      <Button
                        type="dashed"
                        block
                        icon={<PlusOutlined />}
                        onClick={() => addStep('trigger')}
                      >
                        Add Trigger
                      </Button>
                      <Button
                        type="dashed"
                        block
                        icon={<PlusOutlined />}
                        onClick={() => addStep('action')}
                      >
                        Add Action
                      </Button>
                      <Button
                        type="dashed"
                        block
                        icon={<PlusOutlined />}
                        onClick={() => addStep('condition')}
                      >
                        Add Condition
                      </Button>
                    </Space>
                  </Card>
                </Col>
                <Col span={18}>
                  <Card
                    title="Workflow Canvas"
                    extra={
                      <Space>
                        <Button
                          type="primary"
                          icon={<SaveOutlined />}
                          onClick={() => {
                            if (selectedWorkflow) {
                              handleUpdateWorkflow(selectedWorkflow.id, {
                                ...selectedWorkflow,
                                steps: workflowSteps
                              });
                            }
                          }}
                        >
                          Save Workflow
                        </Button>
                      </Space>
                    }
                  >
                    <WorkflowCanvas
                      steps={workflowSteps}
                      onStepSelect={setSelectedStep}
                      onStepUpdate={updateStep}
                      onStepRemove={removeStep}
                    />
                  </Card>
                </Col>
              </Row>
              {selectedStep && (
                <Card
                  title="Step Configuration"
                  style={{ marginTop: 16 }}
                >
                  <WorkflowStep
                    step={selectedStep}
                    onUpdate={(updates) => updateStep(selectedStep.id, updates)}
                    integrations={integrations}
                  />
                </Card>
              )}
            </DndProvider>
          </TabPane>
        </Tabs>
      </Card>

      <Modal
        title={selectedWorkflow ? 'Edit Workflow' : 'Create Workflow'}
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={selectedWorkflow ? 
            (values) => handleUpdateWorkflow(selectedWorkflow.id, values) :
            handleCreateWorkflow
          }
        >
          <Form.Item
            name="name"
            label="Workflow Name"
            rules={[{ required: true, message: 'Please enter workflow name' }]}
          >
            <Input placeholder="Enter workflow name" />
          </Form.Item>

          <Form.Item
            name={['trigger', 'type']}
            label="Trigger Type"
            rules={[{ required: true, message: 'Please select trigger type' }]}
          >
            <Select placeholder="Select trigger type">
              {Object.entries(TRIGGER_TYPES).map(([key, value]) => (
                <Option key={key} value={value}>
                  {value.charAt(0).toUpperCase() + value.slice(1)}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
          >
            <Input.TextArea placeholder="Enter workflow description" />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {selectedWorkflow ? 'Update' : 'Create'}
              </Button>
              <Button onClick={() => setModalVisible(false)}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      <Drawer
        title={`Workflow History - ${selectedWorkflow?.name}`}
        placement="right"
        width={600}
        onClose={() => setDrawerVisible(false)}
        visible={drawerVisible}
      >
        <Timeline mode="left">
          {executionHistory.map(history => (
            <Timeline.Item
              key={history.id}
              color={history.status === 'success' ? 'green' : 'red'}
              label={new Date(history.timestamp).toLocaleString()}
            >
              <p><strong>Status:</strong> {history.status}</p>
              {history.error && (
                <p><strong>Error:</strong> {history.error}</p>
              )}
              <p><strong>Duration:</strong> {history.duration}ms</p>
            </Timeline.Item>
          ))}
        </Timeline>
      </Drawer>

      <style jsx>{`
        .workflow-manager {
          padding: 24px;
        }
      `}</style>
    </div>
  );
};

export default WorkflowManager; 