import React from 'react';
import { Tabs, Card, Typography } from 'antd';
import {
  TableOutlined,
  BranchesOutlined,
  FieldTimeOutlined,
  FileSearchOutlined
} from '@ant-design/icons';
import DataModels from './DataModels';
import Relationships from './Relationships';
import Migrations from './Migrations';
import ValidationRules from './ValidationRules';

const { Title } = Typography;

const Schema = () => {
  const items = [
    {
      key: 'models',
      label: (
        <span>
          <TableOutlined />
          Data Models
        </span>
      ),
      children: <DataModels />,
    },
    {
      key: 'relationships',
      label: (
        <span>
          <BranchesOutlined />
          Relationships
        </span>
      ),
      children: <Relationships />,
    },
    {
      key: 'migrations',
      label: (
        <span>
          <FieldTimeOutlined />
          Migrations
        </span>
      ),
      children: <Migrations />,
    },
    {
      key: 'validation',
      label: (
        <span>
          <FileSearchOutlined />
          Validation Rules
        </span>
      ),
      children: <ValidationRules />,
    },
  ];

  return (
    <div className="schema-page">
      <Card>
        <Title level={2}>Database Schema Management</Title>
        <Tabs
          defaultActiveKey="models"
          items={items}
          size="large"
          style={{ marginTop: 24 }}
        />
      </Card>

      <style jsx>{`
        .schema-page {
          padding: 24px;
        }
      `}</style>
    </div>
  );
};

export default Schema; 