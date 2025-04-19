import React, { useCallback } from 'react';
import { useDrop, useDrag } from 'react-dnd';
import { Card, Space, Button, Tooltip, Typography, Divider } from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  LinkOutlined,
  DragOutlined,
  ApiOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined
} from '@ant-design/icons';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const { Text } = Typography;

const StepCard = ({ step, onEdit, onDelete, onConnect, isTrigger }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'STEP',
    item: { id: step.id, type: step.type },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <Card
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: 'move',
        marginBottom: 16,
        border: isTrigger ? '2px solid #1890ff' : '1px solid #d9d9d9',
      }}
      title={
        <Space>
          {isTrigger ? <PlayCircleOutlined /> : <ApiOutlined />}
          <Text strong>{step.name}</Text>
        </Space>
      }
      extra={
        <Space>
          <Tooltip title="Edit">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => onEdit(step)}
            />
          </Tooltip>
          <Tooltip title="Connect">
            <Button
              type="text"
              icon={<LinkOutlined />}
              onClick={() => onConnect(step)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => onDelete(step.id)}
            />
          </Tooltip>
        </Space>
      }
    >
      <div>
        <Text type="secondary">Type: {step.type}</Text>
        {step.config && (
          <>
            <Divider style={{ margin: '8px 0' }} />
            <Text type="secondary">Configuration:</Text>
            <pre style={{ marginTop: 8, fontSize: 12 }}>
              {JSON.stringify(step.config, null, 2)}
            </pre>
          </>
        )}
      </div>
    </Card>
  );
};

const ConnectionLine = ({ from, to }) => {
  return (
    <div
      style={{
        position: 'absolute',
        top: from.top + 50,
        left: from.left + 200,
        width: to.left - from.left,
        height: 2,
        backgroundColor: '#1890ff',
        zIndex: 1,
      }}
    />
  );
};

const WorkflowCanvas = ({
  steps,
  onAddStep,
  onEditStep,
  onDeleteStep,
  onConnectSteps,
  connections,
}) => {
  const [{ isOver }, drop] = useDrop({
    accept: 'STEP',
    drop: (item, monitor) => {
      const offset = monitor.getClientOffset();
      onAddStep({
        type: item.type || 'action',
        name: `New ${item.type || 'Action'}`,
        config: {},
        position: {
          x: offset.x,
          y: offset.y,
        },
      });
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const triggerStep = steps.find(step => step.type === 'trigger');
  const actionSteps = steps.filter(step => step.type === 'action');

  return (
    <DndProvider backend={HTML5Backend}>
      <div
        ref={drop}
        style={{
          minHeight: 500,
          border: '2px dashed #d9d9d9',
          padding: 24,
          backgroundColor: isOver ? '#f0f0f0' : 'white',
          position: 'relative',
        }}
      >
        {!triggerStep && (
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <Button
              type="primary"
              icon={<PlayCircleOutlined />}
              onClick={() => onAddStep({
                type: 'trigger',
                name: 'New Trigger',
                config: {
                  type: 'webhook'
                },
                position: { x: 100, y: 100 }
              })}
            >
              Add Trigger
            </Button>
          </div>
        )}

        {triggerStep && (
          <div
            style={{
              position: 'absolute',
              left: triggerStep.position?.x || 100,
              top: triggerStep.position?.y || 100,
            }}
          >
            <StepCard
              step={triggerStep}
              onEdit={onEditStep}
              onDelete={onDeleteStep}
              onConnect={onConnectSteps}
              isTrigger={true}
            />
          </div>
        )}

        {actionSteps.map((step) => (
          <div
            key={step.id}
            style={{
              position: 'absolute',
              left: step.position?.x || 100,
              top: step.position?.y || 200,
            }}
          >
            <StepCard
              step={step}
              onEdit={onEditStep}
              onDelete={onDeleteStep}
              onConnect={onConnectSteps}
              isTrigger={false}
            />
          </div>
        ))}

        {connections.map((connection, index) => (
          <ConnectionLine
            key={index}
            from={connection.from}
            to={connection.to}
          />
        ))}

        {triggerStep && (
          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <Button
              type="dashed"
              icon={<PlusOutlined />}
              onClick={() => onAddStep({
                type: 'action',
                name: 'New Action',
                config: {
                  type: 'http'
                },
                position: {
                  x: 100,
                  y: 200 + (actionSteps.length * 150)
                }
              })}
            >
              Add Action
            </Button>
          </div>
        )}
      </div>
    </DndProvider>
  );
};

export default WorkflowCanvas; 