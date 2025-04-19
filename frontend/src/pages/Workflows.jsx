import React, { useState, useEffect } from 'react';
import { Typography, Tabs, Card, Button, Space, message } from 'antd';
import { 
  PlusOutlined, 
  BranchesOutlined, 
  AppstoreOutlined, 
  ToolOutlined,
  ApiOutlined
} from '@ant-design/icons';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import WorkflowCanvas from '../components/zapier-workflow/WorkflowCanvas';
import WorkflowStep from '../components/zapier-workflow/WorkflowStep';
import WorkflowManager from '../components/zapier-workflow/WorkflowManager';
import IntegrationTools from '../components/zapier-workflow/IntegrationTools';
import axios from 'axios';

const { Title } = Typography;
const { TabPane } = Tabs;

const Workflows = () => {
  const [activeTab, setActiveTab] = useState('canvas');
  const [workflowSteps, setWorkflowSteps] = useState([
    {
      id: '1',
      name: 'Start',
      type: 'trigger',
      config: {
        type: 'webhook',
        webhookUrl: ''
      }
    }
  ]);
  const [selectedStep, setSelectedStep] = useState(null);
  const [connections, setConnections] = useState([]);
  const [connectedTools, setConnectedTools] = useState([]);

  const handleStepUpdate = (updatedStep) => {
    setWorkflowSteps(steps => 
      steps.map(step => step.id === updatedStep.id ? updatedStep : step)
    );
  };

  const handleStepSelect = (step) => {
    setSelectedStep(step);
  };

  const handleCreateWorkflow = () => {
    const newStep = {
      id: Date.now().toString(),
      name: 'New Step',
      type: 'action',
      config: {
        type: 'http',
        method: 'GET'
      }
    };
    setWorkflowSteps([...workflowSteps, newStep]);
    setSelectedStep(newStep);
  };

  const handleDeleteStep = (stepId) => {
    setWorkflowSteps(steps => steps.filter(step => step.id !== stepId));
    setConnections(conns => conns.filter(conn => 
      conn.from !== stepId && conn.to !== stepId
    ));
  };

  const handleConnectSteps = (fromStepId, toStepId) => {
    setConnections([...connections, { from: fromStepId, to: toStepId }]);
  };

  const handleToolSync = () => {
    fetchConnectedTools();
  };

  const handleToolDisconnect = () => {
    fetchConnectedTools();
  };

  const fetchConnectedTools = async () => {
    try {
      const response = await axios.get('/api/integrations/tools');
      setConnectedTools(response.data);
    } catch (error) {
      message.error('Failed to fetch connected tools');
    }
  };

  useEffect(() => {
    fetchConnectedTools();
  }, []);

  return (
    <div style={{ padding: '24px' }}>
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={2}>Workflows</Title>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateWorkflow}>
            Create New Workflow
          </Button>
        </div>

        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane
            tab={
              <span>
                <BranchesOutlined />
                Workflow Canvas
              </span>
            }
            key="canvas"
          >
            <Card>
              <DndProvider backend={HTML5Backend}>
                <WorkflowCanvas
                  steps={workflowSteps}
                  onAddStep={handleCreateWorkflow}
                  onEditStep={handleStepSelect}
                  onDeleteStep={handleDeleteStep}
                  onConnectSteps={handleConnectSteps}
                  connections={connections}
                />
              </DndProvider>
            </Card>
          </TabPane>

          <TabPane
            tab={
              <span>
                <AppstoreOutlined />
                Workflow Steps
              </span>
            }
            key="steps"
          >
            <Card>
              {selectedStep && (
                <WorkflowStep
                  step={selectedStep}
                  onUpdate={handleStepUpdate}
                  workflowSteps={workflowSteps}
                />
              )}
            </Card>
          </TabPane>

          <TabPane
            tab={
              <span>
                <ToolOutlined />
                Workflow Manager
              </span>
            }
            key="manager"
          >
            <Card>
              <WorkflowManager
                steps={workflowSteps}
                onStepsChange={setWorkflowSteps}
                onStepSelect={handleStepSelect}
              />
            </Card>
          </TabPane>

          <TabPane
            tab={
              <span>
                <ApiOutlined />
                Integration Tools
              </span>
            }
            key="integrations"
          >
            <Card>
              <IntegrationTools 
                connectedTools={connectedTools}
                onToolSync={handleToolSync}
                onToolDisconnect={handleToolDisconnect}
              />
            </Card>
          </TabPane>
        </Tabs>
      </Space>
    </div>
  );
};

export default Workflows; 