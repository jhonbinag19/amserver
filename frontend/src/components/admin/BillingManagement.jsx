import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  DatePicker,
  Select,
  Space,
  message,
  Typography,
  Tag,
  Popconfirm,
  Tooltip
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, InfoCircleOutlined } from '@ant-design/icons';
import api from '../../utils/axios';
import moment from 'moment';

const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const BillingManagement = () => {
  const [billings, setBillings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingBilling, setEditingBilling] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [subscriptionTypes, setSubscriptionTypes] = useState([]);

  useEffect(() => {
    fetchBillings();
    fetchCustomers();
    fetchSubscriptionTypes();
  }, []);

  const fetchBillings = async () => {
    try {
      const response = await api.get('/billings');
      setBillings(response.data);
    } catch (error) {
      message.error('Failed to fetch billing records');
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await api.get('/customers');
      setCustomers(response.data);
    } catch (error) {
      message.error('Failed to fetch customers');
    }
  };

  const fetchSubscriptionTypes = async () => {
    try {
      const response = await api.get('/subscription-types');
      setSubscriptionTypes(response.data);
    } catch (error) {
      message.error('Failed to fetch subscription types');
    }
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const billingData = {
        ...values,
        dueDate: values.dueDate.format('YYYY-MM-DD')
      };

      if (editingBilling) {
        await api.put(`/billings/${editingBilling.id}`, billingData);
        message.success('Billing record updated successfully');
      } else {
        await api.post('/billings', billingData);
        message.success('Billing record created successfully');
      }
      setModalVisible(false);
      form.resetFields();
      setEditingBilling(null);
      fetchBillings();
    } catch (error) {
      message.error('Failed to save billing record');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/billings/${id}`);
      message.success('Billing record deleted successfully');
      fetchBillings();
    } catch (error) {
      message.error('Failed to delete billing record');
    }
  };

  const columns = [
    {
      title: 'Customer',
      dataIndex: 'customer',
      key: 'customer',
      render: (customer) => customer?.name || 'N/A',
    },
    {
      title: 'Subscription',
      dataIndex: 'subscription',
      key: 'subscription',
      render: (subscription) => (
        <Space>
          <span>{subscription?.type?.name || 'N/A'}</span>
          {subscription?.type?.description && (
            <Tooltip title={subscription.type.description}>
              <InfoCircleOutlined style={{ color: '#1890ff' }} />
            </Tooltip>
          )}
        </Space>
      ),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => `$${amount.toFixed(2)}`,
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
      render: (date) => moment(date).format('YYYY-MM-DD'),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => {
              setEditingBilling(record);
              form.setFieldsValue({
                ...record,
                dueDate: moment(record.dueDate)
              });
              setModalVisible(true);
            }}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this billing record?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const getStatusColor = (status) => {
    const colors = {
      paid: 'green',
      pending: 'orange',
      overdue: 'red',
      cancelled: 'gray'
    };
    return colors[status] || 'default';
  };

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
          <Title level={4}>Billing Management</Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingBilling(null);
              form.resetFields();
              setModalVisible(true);
            }}
          >
            Add Billing Record
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={billings}
          rowKey="id"
          loading={loading}
        />

        <Modal
          title={editingBilling ? 'Edit Billing Record' : 'Add Billing Record'}
          open={modalVisible}
          onCancel={() => {
            setModalVisible(false);
            form.resetFields();
            setEditingBilling(null);
          }}
          footer={null}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
          >
            <Form.Item
              name="customerId"
              label="Customer"
              rules={[{ required: true, message: 'Please select a customer!' }]}
            >
              <Select placeholder="Select customer">
                {customers.map(customer => (
                  <Option key={customer.id} value={customer.id}>
                    {customer.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="subscriptionTypeId"
              label="Subscription Type"
              rules={[{ required: true, message: 'Please select a subscription type!' }]}
            >
              <Select placeholder="Select subscription type">
                {subscriptionTypes.map(type => (
                  <Option key={type.id} value={type.id}>
                    {type.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="amount"
              label="Amount"
              rules={[{ required: true, message: 'Please input the amount!' }]}
            >
              <InputNumber
                style={{ width: '100%' }}
                min={0}
                step={0.01}
                prefix="$"
                placeholder="Enter amount"
              />
            </Form.Item>

            <Form.Item
              name="dueDate"
              label="Due Date"
              rules={[{ required: true, message: 'Please select due date!' }]}
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              name="status"
              label="Status"
              rules={[{ required: true, message: 'Please select status!' }]}
            >
              <Select placeholder="Select status">
                <Option value="paid">Paid</Option>
                <Option value="pending">Pending</Option>
                <Option value="overdue">Overdue</Option>
                <Option value="cancelled">Cancelled</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="description"
              label="Description"
            >
              <TextArea rows={4} placeholder="Enter billing description" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                {editingBilling ? 'Update' : 'Create'}
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    </div>
  );
};

export default BillingManagement; 