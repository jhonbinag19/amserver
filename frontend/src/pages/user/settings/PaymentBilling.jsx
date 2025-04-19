import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  message,
  Space,
  Divider,
  Typography,
  Tag,
  Statistic,
  Row,
  Col
} from 'antd';
import { PlusOutlined, DollarOutlined, HistoryOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Title } = Typography;

const PaymentBilling = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [payments, setPayments] = useState([]);
  const [subscription, setSubscription] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchPayments();
    fetchSubscription();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/ghl/organizations/:organizationId/payments');
      setPayments(response.data);
    } catch (error) {
      message.error('Failed to fetch payments');
    } finally {
      setLoading(false);
    }
  };

  const fetchSubscription = async () => {
    try {
      const response = await axios.get('/api/ghl/organizations/:organizationId/subscription');
      setSubscription(response.data);
    } catch (error) {
      message.error('Failed to fetch subscription details');
    }
  };

  const handlePaymentSubmit = async (values) => {
    try {
      setLoading(true);
      await axios.post('/api/ghl/organizations/:organizationId/payments', values);
      message.success('Payment processed successfully');
      setModalVisible(false);
      form.resetFields();
      fetchPayments();
    } catch (error) {
      message.error('Failed to process payment');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Date',
      dataIndex: 'created_at',
      key: 'date',
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => `$${amount.toFixed(2)}`,
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type) => (
        <Tag color={type === 'subscription' ? 'blue' : 'green'}>
          {type === 'subscription' ? 'Subscription' : 'One-time'}
        </Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'success' ? 'success' : 'error'}>
          {status === 'success' ? 'Success' : 'Failed'}
        </Tag>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
  ];

  return (
    <Card loading={loading}>
      <Title level={4}>Payment & Billing</Title>
      <Divider />

      {subscription && (
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={8}>
            <Card>
              <Statistic
                title="Current Plan"
                value={subscription.plan_name}
                prefix={<DollarOutlined />}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="Next Billing Date"
                value={new Date(subscription.next_billing_date).toLocaleDateString()}
                prefix={<HistoryOutlined />}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="Monthly Cost"
                value={`$${subscription.monthly_cost}`}
                prefix={<DollarOutlined />}
              />
            </Card>
          </Col>
        </Row>
      )}

      <Space direction="vertical" style={{ width: '100%' }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setModalVisible(true)}
        >
          Make Payment
        </Button>

        <Table
          columns={columns}
          dataSource={payments}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Space>

      <Modal
        title="Make Payment"
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        onOk={() => form.submit()}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handlePaymentSubmit}
        >
          <Form.Item
            name="amount"
            label="Amount"
            rules={[{ required: true, message: 'Please enter amount' }]}
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
            name="type"
            label="Payment Type"
            rules={[{ required: true, message: 'Please select payment type' }]}
          >
            <Select>
              <Select.Option value="subscription">Subscription</Select.Option>
              <Select.Option value="one_time">One-time Payment</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please enter description' }]}
          >
            <Input.TextArea rows={4} placeholder="Enter payment description" />
          </Form.Item>

          <Form.Item
            name="payment_method"
            label="Payment Method"
            rules={[{ required: true, message: 'Please select payment method' }]}
          >
            <Select>
              <Select.Option value="credit_card">Credit Card</Select.Option>
              <Select.Option value="bank_transfer">Bank Transfer</Select.Option>
              <Select.Option value="paypal">PayPal</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default PaymentBilling; 