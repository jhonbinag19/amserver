import React, { useEffect } from 'react';
import {
  Form,
  Input,
  Select,
  Button,
  Space,
  Card,
  Tabs,
  InputNumber,
  Switch,
  Checkbox,
  Divider,
  Typography,
  Collapse
} from 'antd';
import {
  ApiOutlined,
  ClockCircleOutlined,
  CodeOutlined,
  DatabaseOutlined,
  LinkOutlined,
  SettingOutlined
} from '@ant-design/icons';

const { Option } = Select;
const { TabPane } = Tabs;
const { Panel } = Collapse;
const { Text } = Typography;

const WorkflowStep = ({ step, onUpdate, integrations, workflowSteps }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({
      name: step.name,
      ...step.config
    });
  }, [step, form]);

  const handleValuesChange = (changedValues) => {
    onUpdate({
      ...step,
      config: {
        ...step.config,
        ...changedValues
      }
    });
  };

  const renderTriggerConfig = () => {
    switch (step.config.type) {
      case 'webhook':
        return (
          <Form.Item
            name="webhookUrl"
            label="Webhook URL"
            rules={[{ required: true, message: 'Please enter webhook URL' }]}
          >
            <Input placeholder="Enter webhook URL" />
          </Form.Item>
        );
      case 'schedule':
        return (
          <>
            <Form.Item
              name="scheduleType"
              label="Schedule Type"
              rules={[{ required: true, message: 'Please select schedule type' }]}
            >
              <Select 
                placeholder="Select schedule type"
                onChange={(value) => handleValuesChange({ scheduleType: value })}
              >
                <Option value="interval">Interval</Option>
                <Option value="cron">Cron Expression</Option>
                <Option value="specific">Specific Time</Option>
              </Select>
            </Form.Item>
            {step.config.scheduleType === 'interval' && (
              <Form.Item
                name="interval"
                label="Interval (minutes)"
                rules={[{ required: true, message: 'Please enter interval' }]}
              >
                <InputNumber min={1} />
              </Form.Item>
            )}
            {step.config.scheduleType === 'cron' && (
              <Form.Item
                name="cronExpression"
                label="Cron Expression"
                rules={[{ required: true, message: 'Please enter cron expression' }]}
              >
                <Input placeholder="* * * * *" />
              </Form.Item>
            )}
            {step.config.scheduleType === 'specific' && (
              <Form.Item
                name="specificTime"
                label="Specific Time"
                rules={[{ required: true, message: 'Please enter specific time' }]}
              >
                <Input type="datetime-local" />
              </Form.Item>
            )}
          </>
        );
      case 'event':
        return (
          <Form.Item
            name="eventType"
            label="Event Type"
            rules={[{ required: true, message: 'Please select event type' }]}
          >
            <Select 
              placeholder="Select event type"
              onChange={(value) => handleValuesChange({ eventType: value })}
            >
              {integrations.map(integration => (
                <Option key={integration.id} value={integration.name}>
                  {integration.displayName}
                </Option>
              ))}
            </Select>
          </Form.Item>
        );
      default:
        return null;
    }
  };

  const renderActionConfig = () => {
    switch (step.config.type) {
      case 'http':
        return (
          <>
            <Form.Item
              name="method"
              label="HTTP Method"
              rules={[{ required: true, message: 'Please select HTTP method' }]}
            >
              <Select 
                placeholder="Select HTTP method"
                onChange={(value) => handleValuesChange({ method: value })}
              >
                <Option value="GET">GET</Option>
                <Option value="POST">POST</Option>
                <Option value="PUT">PUT</Option>
                <Option value="DELETE">DELETE</Option>
                <Option value="PATCH">PATCH</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="url"
              label="URL"
              rules={[{ required: true, message: 'Please enter URL' }]}
            >
              <Input placeholder="Enter URL" />
            </Form.Item>
            <Form.Item
              name="headers"
              label="Headers"
            >
              <Input.TextArea placeholder="Enter headers in JSON format" />
            </Form.Item>
            <Form.Item
              name="body"
              label="Body"
            >
              <Input.TextArea placeholder="Enter request body" />
            </Form.Item>
          </>
        );
      case 'database':
        return (
          <>
            <Form.Item
              name="databaseType"
              label="Database Type"
              rules={[{ required: true, message: 'Please select database type' }]}
            >
              <Select 
                placeholder="Select database type"
                onChange={(value) => handleValuesChange({ databaseType: value })}
              >
                <Option value="mysql">MySQL</Option>
                <Option value="postgresql">PostgreSQL</Option>
                <Option value="mongodb">MongoDB</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="query"
              label="Query"
              rules={[{ required: true, message: 'Please enter query' }]}
            >
              <Input.TextArea placeholder="Enter database query" />
            </Form.Item>
          </>
        );
      case 'integration':
        return (
          <>
            <Form.Item
              name="integration"
              label="Integration"
              rules={[{ required: true, message: 'Please select integration' }]}
            >
              <Select 
                placeholder="Select integration"
                onChange={(value) => handleValuesChange({ integration: value })}
              >
                {integrations.map(integration => (
                  <Option key={integration.id} value={integration.name}>
                    {integration.displayName}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="action"
              label="Action"
              rules={[{ required: true, message: 'Please select action' }]}
            >
              <Select 
                placeholder="Select action"
                onChange={(value) => handleValuesChange({ action: value })}
              >
                {step.config.integration && integrations
                  .find(i => i.name === step.config.integration)
                  ?.actions.map(action => (
                    <Option key={action.id} value={action.name}>
                      {action.displayName}
                    </Option>
                  ))}
              </Select>
            </Form.Item>
          </>
        );
      default:
        return null;
    }
  };

  const renderConditionConfig = () => {
    return (
      <>
        <Form.Item
          name="conditionType"
          label="Condition Type"
          rules={[{ required: true, message: 'Please select condition type' }]}
        >
          <Select placeholder="Select condition type">
            <Option value="if">If</Option>
            <Option value="switch">Switch</Option>
            <Option value="loop">Loop</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="expression"
          label="Condition Expression"
          rules={[{ required: true, message: 'Please enter condition expression' }]}
        >
          <Input.TextArea placeholder="Enter condition expression" />
        </Form.Item>
      </>
    );
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{
        name: step.name,
        ...step.config
      }}
      onValuesChange={handleValuesChange}
    >
      <Form.Item
        name="name"
        label="Step Name"
        rules={[{ required: true, message: 'Please enter step name' }]}
      >
        <Input placeholder="Enter step name" />
      </Form.Item>

      <Tabs defaultActiveKey="basic">
        <TabPane
          tab={
            <span>
              <SettingOutlined />
              Basic
            </span>
          }
          key="basic"
        >
          {step.type === 'trigger' && renderTriggerConfig()}
          {step.type === 'action' && renderActionConfig()}
          {step.type === 'condition' && renderConditionConfig()}
        </TabPane>

        <TabPane
          tab={
            <span>
              <LinkOutlined />
              Connections
            </span>
          }
          key="connections"
        >
          <Form.Item
            name="next"
            label="Next Steps"
          >
            <Select
              mode="multiple"
              placeholder="Select next steps"
              style={{ width: '100%' }}
            >
              {workflowSteps
                .filter(s => s.id !== step.id)
                .map(s => (
                  <Option key={s.id} value={s.id}>
                    {s.name}
                  </Option>
                ))}
            </Select>
          </Form.Item>
        </TabPane>

        <TabPane
          tab={
            <span>
              <CodeOutlined />
              Advanced
            </span>
          }
          key="advanced"
        >
          <Form.Item
            name="timeout"
            label="Timeout (seconds)"
          >
            <InputNumber min={1} />
          </Form.Item>
          <Form.Item
            name="retryCount"
            label="Retry Count"
          >
            <InputNumber min={0} />
          </Form.Item>
          <Form.Item
            name="retryDelay"
            label="Retry Delay (seconds)"
          >
            <InputNumber min={1} />
          </Form.Item>
          <Form.Item
            name="errorHandling"
            label="Error Handling"
          >
            <Select placeholder="Select error handling strategy">
              <Option value="continue">Continue</Option>
              <Option value="stop">Stop</Option>
              <Option value="retry">Retry</Option>
            </Select>
          </Form.Item>
        </TabPane>
      </Tabs>
    </Form>
  );
};

export default WorkflowStep; 