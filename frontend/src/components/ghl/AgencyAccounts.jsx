import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  message,
  Space,
  Tag,
  Alert,
  Typography,
  Spin
} from 'antd';
import { SyncOutlined, LinkOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Title, Text } = Typography;

const AgencyAccounts = () => {
  const [agency, setAgency] = useState(null);
  const [subAccounts, setSubAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/users/integrations/connection/status');
      if (response.data.connected) {
        setAgency(response.data.agency);
        fetchSubAccounts();
      }
    } catch (error) {
      message.error('Failed to check connection status');
    } finally {
      setLoading(false);
    }
  };

  const fetchSubAccounts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/users/integrations/agency/sub-accounts');
      setSubAccounts(response.data);
    } catch (error) {
      message.error('Failed to fetch sub-accounts');
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async () => {
    try {
      const response = await axios.get('/api/users/integrations/connect');
      window.location.href = response.data.authUrl;
    } catch (error) {
      message.error('Failed to initiate connection');
    }
  };

  const handleSync = async () => {
    try {
      setSyncing(true);
      await axios.post('/api/users/integrations/agency/sync');
      await fetchSubAccounts();
      message.success('Sub-accounts synchronized successfully');
    } catch (error) {
      message.error('Failed to synchronize sub-accounts');
    } finally {
      setSyncing(false);
    }
  };

  const columns = [
    {
      title: 'Account Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Account ID',
      dataIndex: 'account_id',
      key: 'account_id',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'active' ? 'success' : 'error'}>
          {status === 'active' ? 'Active' : 'Inactive'}
        </Tag>
      ),
    },
    {
      title: 'Last Sync',
      dataIndex: 'last_sync',
      key: 'last_sync',
      render: (date) => date ? new Date(date).toLocaleString() : 'Never',
    },
  ];

  return (
    <Card>
      <Title level={4}>GoHighLevel Agency Account</Title>
      
      {!agency ? (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <Alert
            message="No GoHighLevel Account Connected"
            description="Connect your GoHighLevel agency account to manage your sub-accounts."
            type="info"
            showIcon
            style={{ marginBottom: 24 }}
          />
          <Button
            type="primary"
            icon={<LinkOutlined />}
            size="large"
            onClick={handleConnect}
          >
            Connect GoHighLevel Account
          </Button>
        </div>
      ) : (
        <>
          <div style={{ marginBottom: 24 }}>
            <Space direction="vertical" size="small">
              <Text strong>Agency Name:</Text>
              <Text>{agency.name}</Text>
              <Text strong>Agency ID:</Text>
              <Text>{agency.agency_id}</Text>
              <Text strong>Connection Status:</Text>
              <Tag color="success">Connected</Tag>
            </Space>
          </div>

          <div style={{ marginBottom: 24 }}>
            <Button
              type="primary"
              icon={<SyncOutlined />}
              loading={syncing}
              onClick={handleSync}
            >
              Synchronize Sub-Accounts
            </Button>
          </div>

          <Title level={5}>Sub-Accounts</Title>
          <Table
            columns={columns}
            dataSource={subAccounts}
            loading={loading}
            rowKey="account_id"
          />
        </>
      )}
    </Card>
  );
};

export default AgencyAccounts; 