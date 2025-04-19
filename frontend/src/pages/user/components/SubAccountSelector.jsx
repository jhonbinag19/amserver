import React, { useState, useEffect } from 'react';
import { Modal, Input, Checkbox, Button, List, Avatar, Space, message } from 'antd';
import { SearchOutlined, DownloadOutlined } from '@ant-design/icons';
import api from '../../../utils/axios';

const SubAccountSelector = ({ 
  visible, 
  onCancel, 
  onConfirm, 
  toolName,
  toolIcon 
}) => {
  const [searchText, setSearchText] = useState('');
  const [subAccounts, setSubAccounts] = useState([]);
  const [selectedAccounts, setSelectedAccounts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      fetchSubAccounts();
    }
  }, [visible]);

  const fetchSubAccounts = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/api/integrations/ghl/sub-accounts');
      setSubAccounts(data);
    } catch (error) {
      message.error('Failed to fetch sub-accounts');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedAccounts(subAccounts.map(account => account.id));
    } else {
      setSelectedAccounts([]);
    }
  };

  const handleSelectAccount = (accountId) => {
    setSelectedAccounts(prev => {
      if (prev.includes(accountId)) {
        return prev.filter(id => id !== accountId);
      }
      return [...prev, accountId];
    });
  };

  const filteredAccounts = subAccounts.filter(account => 
    account.name.toLowerCase().includes(searchText.toLowerCase()) ||
    account.location?.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleConfirm = () => {
    if (selectedAccounts.length === 0) {
      message.warning('Please select at least one sub-account');
      return;
    }
    onConfirm(selectedAccounts);
  };

  return (
    <Modal
      title={
        <Space>
          {toolIcon && <img src={toolIcon} alt={toolName} style={{ width: 24, height: 24 }} />}
          <span>Select Sub-Accounts for {toolName}</span>
        </Space>
      }
      open={visible}
      onCancel={onCancel}
      width={600}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button 
          key="continue" 
          type="primary" 
          onClick={handleConfirm}
          icon={<DownloadOutlined />}
        >
          Install to Selected Sub-Accounts
        </Button>
      ]}
    >
      <div style={{ marginBottom: 16 }}>
        <Input
          placeholder="Search sub-accounts"
          prefix={<SearchOutlined />}
          onChange={(e) => handleSearch(e.target.value)}
          style={{ marginBottom: 16 }}
        />
        <Checkbox 
          onChange={handleSelectAll}
          checked={selectedAccounts.length === subAccounts.length}
          indeterminate={selectedAccounts.length > 0 && selectedAccounts.length < subAccounts.length}
        >
          Select all {subAccounts.length} sub-accounts
        </Checkbox>
      </div>

      <List
        loading={loading}
        dataSource={filteredAccounts}
        renderItem={account => (
          <List.Item>
            <List.Item.Meta
              avatar={
                <Avatar style={{ backgroundColor: '#1890ff' }}>
                  {account.name[0].toUpperCase()}
                </Avatar>
              }
              title={account.name}
              description={account.location}
            />
            <Checkbox
              checked={selectedAccounts.includes(account.id)}
              onChange={() => handleSelectAccount(account.id)}
            />
          </List.Item>
        )}
        style={{ maxHeight: '400px', overflowY: 'auto' }}
      />
    </Modal>
  );
};

export default SubAccountSelector; 