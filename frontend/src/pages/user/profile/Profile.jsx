import React, { useState, useEffect } from 'react';
import { 
  Form, 
  Input, 
  Button, 
  Card, 
  Typography, 
  message, 
  Space,
  Avatar,
  Upload
} from 'antd';
import { 
  UserOutlined, 
  MailOutlined, 
  PhoneOutlined,
  UploadOutlined
} from '@ant-design/icons';
import axios from 'axios';

const { Title } = Typography;

const Profile = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get('/api/user/profile');
      setUserData(response.data);
      form.setFieldsValue(response.data);
    } catch (error) {
      message.error('Failed to fetch profile data');
    }
  };

  const onFinish = async (values) => {
    try {
      setLoading(true);
      await axios.put('/api/user/profile', values);
      message.success('Profile updated successfully');
    } catch (error) {
      message.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>Profile Settings</Title>
      
      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card>
            <Space direction="vertical" align="center" style={{ width: '100%' }}>
              <Avatar 
                size={100} 
                icon={<UserOutlined />} 
                src={userData?.avatar}
              />
              <Upload>
                <Button icon={<UploadOutlined />}>Change Avatar</Button>
              </Upload>
            </Space>
          </Card>
        </Col>
        
        <Col xs={24} md={16}>
          <Card>
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
            >
              <Form.Item
                name="name"
                label="Full Name"
                rules={[{ required: true, message: 'Please input your name!' }]}
              >
                <Input 
                  prefix={<UserOutlined />} 
                  placeholder="Enter your full name"
                />
              </Form.Item>

              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: 'Please input your email!' },
                  { type: 'email', message: 'Please enter a valid email!' }
                ]}
              >
                <Input 
                  prefix={<MailOutlined />} 
                  placeholder="Enter your email"
                />
              </Form.Item>

              <Form.Item
                name="phone"
                label="Phone Number"
              >
                <Input 
                  prefix={<PhoneOutlined />} 
                  placeholder="Enter your phone number"
                />
              </Form.Item>

              <Form.Item>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  loading={loading}
                >
                  Save Changes
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Profile; 