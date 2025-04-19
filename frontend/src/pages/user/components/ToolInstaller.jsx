import React, { useState } from 'react';
import { Card, Button, message, Steps, Space, Typography } from 'antd';
import { ApiOutlined, CheckCircleOutlined, LoadingOutlined } from '@ant-design/icons';
import SubAccountSelector from './SubAccountSelector';
import api from '../../../utils/axios';

const { Title, Text } = Typography;
const { Step } = Steps;

const ToolInstaller = ({ 
  tool,
  onSuccess,
  onCancel 
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [installing, setInstalling] = useState(false);
  const [showSubAccountSelector, setShowSubAccountSelector] = useState(false);
  const [selectedSubAccounts, setSelectedSubAccounts] = useState([]);

  const handleInstall = async () => {
    try {
      setInstalling(true);
      
      // First verify GHL connection
      const { data: ghlStatus } = await api.get('/api/integrations/ghl/status');
      
      if (!ghlStatus.connected) {
        message.error('Please connect your GoHighLevel account first');
        return;
      }

      setCurrentStep(1);
      setShowSubAccountSelector(true);

    } catch (error) {
      message.error('Failed to verify GHL connection');
    } finally {
      setInstalling(false);
    }
  };

  const handleSubAccountSelection = async (selectedAccounts) => {
    try {
      setInstalling(true);
      setCurrentStep(2);
      setShowSubAccountSelector(false);
      
      // Install tool for selected sub-accounts
      await api.post(`/api/integrations/${tool.id}/install`, {
        subAccounts: selectedAccounts
      });

      setSelectedSubAccounts(selectedAccounts);
      setCurrentStep(3);
      message.success(`${tool.name} installed successfully!`);
      
      if (onSuccess) {
        onSuccess({
          toolId: tool.id,
          subAccounts: selectedAccounts
        });
      }

    } catch (error) {
      message.error('Failed to install tool');
      setCurrentStep(1);
    } finally {
      setInstalling(false);
    }
  };

  const steps = [
    {
      title: 'Start Installation',
      icon: <ApiOutlined />,
      description: 'Click Install to begin'
    },
    {
      title: 'Select Sub-Accounts',
      icon: currentStep === 1 ? <LoadingOutlined /> : null,
      description: 'Choose which sub-accounts to install to'
    },
    {
      title: 'Installing',
      icon: currentStep === 2 ? <LoadingOutlined /> : null,
      description: 'Setting up integration'
    },
    {
      title: 'Complete',
      icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
      description: 'Tool installed successfully'
    }
  ];

  return (
    <Card>
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        <div style={{ textAlign: 'center' }}>
          <Title level={4}>{tool.name} Installation</Title>
          <Text type="secondary">
            Install {tool.name} to your selected GoHighLevel sub-accounts
          </Text>
        </div>

        <Steps current={currentStep}>
          {steps.map(step => (
            <Step 
              key={step.title} 
              title={step.title} 
              description={step.description}
              icon={step.icon}
            />
          ))}
        </Steps>

        <div style={{ textAlign: 'center', marginTop: 24 }}>
          {currentStep === 0 && (
            <Button 
              type="primary" 
              size="large"
              onClick={handleInstall}
              loading={installing}
              icon={<ApiOutlined />}
            >
              Install {tool.name}
            </Button>
          )}
        </div>

        <SubAccountSelector
          visible={showSubAccountSelector}
          onCancel={() => {
            setShowSubAccountSelector(false);
            setCurrentStep(0);
          }}
          onConfirm={handleSubAccountSelection}
          toolName={tool.name}
          toolIcon={tool.icon}
        />
      </Space>
    </Card>
  );
};

export default ToolInstaller; 