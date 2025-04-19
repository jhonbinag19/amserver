import React, { useCallback } from 'react';
import { useDrop, useDrag } from 'react-dnd';
import { Card, Space, Button, Tooltip } from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  LinkOutlined,
  DragOutlined
} from '@ant-design/icons';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const StepCard = ({ step, onEdit, onDelete, onConnect }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'STEP',
    item: { id: step.id },
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
      }}
      title={
        <Space>
          <DragOutlined />
          {step.name}
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
        <p><strong>Type:</strong> {step.type}</p>
        {step.config && (
          <>
            <p><strong>Configuration:</strong></p>
            <pre>{JSON.stringify(step.config, null, 2)}</pre>
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
        type: 'action',
        name: 'New Step',
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
        {steps.map((step) => (
          <div
            key={step.id}
            style={{
              position: 'absolute',
              left: step.position?.x || 0,
              top: step.position?.y || 0,
            }}
          >
            <StepCard
              step={step}
              onEdit={onEditStep}
              onDelete={onDeleteStep}
              onConnect={onConnectSteps}
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
        <Button
          type="dashed"
          icon={<PlusOutlined />}
          onClick={() => onAddStep({
            type: 'action',
            name: 'New Step',
            config: {},
            position: {
              x: 0,
              y: 0,
            },
          })}
          style={{ marginTop: 16 }}
        >
          Add Step
        </Button>
      </div>
    </DndProvider>
  );
};

export default WorkflowCanvas; 