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
  Collapse,
  Alert
} from 'antd';
import {
  ApiOutlined,
  ClockCircleOutlined,
  CodeOutlined,
  DatabaseOutlined,
  LinkOutlined,
  SettingOutlined,
  PlayCircleOutlined,
  WarningOutlined
} from '@ant-design/icons';

const { Option } = Select;
const { TabPane } = Tabs;
const { Panel } = Collapse;
const { Text, Title } = Typography;

const TRIGGER_TYPES = {
  WEBHOOK: 'webhook',
  SCHEDULE: 'schedule',
  EVENT: 'event',
  MANUAL: 'manual'
};

const ACTION_TYPES = {
  HTTP: 'http',
  DATABASE: 'database',
  INTEGRATION: 'integration',
  CUSTOM: 'custom'
};

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
    return (
      <>
        <Form.Item
          name="type"
          label="Trigger Type"
          rules={[{ required: true, message: 'Please select trigger type' }]}
        >
          <Select 
            placeholder="Select trigger type"
            onChange={(value) => handleValuesChange({ type: value })}
          >
            {Object.entries(TRIGGER_TYPES).map(([key, value]) => (
              <Option key={key} value={value}>
                {value.charAt(0).toUpperCase() + value.slice(1)}
              </Option>
            ))}
          </Select>
        </Form.Item>

        {step.config.type === TRIGGER_TYPES.WEBHOOK && (
          <>
            <Alert
              message="Webhook Configuration"
              description="This trigger will be activated when a webhook is received at the specified URL."
              type="info"
              showIcon
              style={{ marginBottom: 16 }}
            />
            <Form.Item
              name="webhookUrl"
              label="Webhook URL"
              rules={[{ required: true, message: 'Please enter webhook URL' }]}
            >
              <Input placeholder="Enter webhook URL" />
            </Form.Item>
            <Form.Item
              name="method"
              label="HTTP Method"
              rules={[{ required: true, message: 'Please select HTTP method' }]}
            >
              <Select placeholder="Select HTTP method">
                <Option value="POST">POST</Option>
                <Option value="GET">GET</Option>
                <Option value="PUT">PUT</Option>
              </Select>
            </Form.Item>
          </>
        )}

        {step.config.type === TRIGGER_TYPES.SCHEDULE && (
          <>
            <Alert
              message="Schedule Configuration"
              description="This trigger will be activated based on the specified schedule."
              type="info"
              showIcon
              style={{ marginBottom: 16 }}
            />
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
        )}

        {step.config.type === TRIGGER_TYPES.EVENT && (
          <>
            <Alert
              message="Event Configuration"
              description="This trigger will be activated when the specified event occurs."
              type="info"
              showIcon
              style={{ marginBottom: 16 }}
            />
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
          </>
        )}
      </>
    );
  };

  const renderActionConfig = () => {
    return (
      <>
        <Form.Item
          name="type"
          label="Action Type"
          rules={[{ required: true, message: 'Please select action type' }]}
        >
          <Select 
            placeholder="Select action type"
            onChange={(value) => handleValuesChange({ type: value })}
          >
            {Object.entries(ACTION_TYPES).map(([key, value]) => (
              <Option key={key} value={value}>
                {value.charAt(0).toUpperCase() + value.slice(1)}
              </Option>
            ))}
          </Select>
        </Form.Item>

        {step.config.type === ACTION_TYPES.HTTP && (
          <>
            <Alert
              message="HTTP Action Configuration"
              description="This action will make an HTTP request to the specified URL."
              type="info"
              showIcon
              style={{ marginBottom: 16 }}
            />
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
        )}

        {step.config.type === ACTION_TYPES.INTEGRATION && (
          <>
            <Alert
              message="Integration Action Configuration"
              description="This action will use the selected integration to perform the specified action."
              type="info"
              showIcon
              style={{ marginBottom: 16 }}
            />
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
        )}

        {step.config.type === ACTION_TYPES.DATABASE && (
          <>
            <Alert
              message="Database Action Configuration"
              description="This action will execute the specified database query."
              type="info"
              showIcon
              style={{ marginBottom: 16 }}
            />
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
        )}
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