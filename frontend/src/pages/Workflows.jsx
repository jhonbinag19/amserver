import React, { useState } from 'react';
import { Typography, Tabs, Card, Button, Space } from 'antd';
import { PlusOutlined, BranchesOutlined, AppstoreOutlined, ToolOutlined } from '@ant-design/icons';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import WorkflowCanvas from '../components/zapier-workflow/WorkflowCanvas';
import WorkflowStep from '../components/zapier-workflow/WorkflowStep';
import WorkflowManager from '../components/zapier-workflow/WorkflowManager';

const { Title } = Typography;
const { TabPane } = Tabs;

const Workflows = () => {
  const [activeTab, setActiveTab] = useState('canvas');
  const [workflowSteps, setWorkflowSteps] = useState([]);
  const [selectedStep, setSelectedStep] = useState(null);

  const handleStepUpdate = (updatedStep) => {
    setWorkflowSteps(steps => 
      steps.map(step => step.id === updatedStep.id ? updatedStep : step)
    );
  };

  const handleStepSelect = (step) => {
    setSelectedStep(step);
  };

  return (
    <div style={{ padding: '24px' }}>
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={2}>Workflows</Title>
          <Button type="primary" icon={<PlusOutlined />}>
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
                  onStepSelect={handleStepSelect}
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
        </Tabs>
      </Space>
    </div>
  );
};

export default Workflows; 