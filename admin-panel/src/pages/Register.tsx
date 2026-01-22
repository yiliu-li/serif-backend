import React, { useState } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import api from '../api';
import { useNavigate, Link } from 'react-router-dom';

const Register: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      await api.post('/auth/register', values);
      message.success('Registration successful. Please login.');
      navigate('/login');
    } catch (error: any) {
      console.error(error);
      message.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f0f2f5' }}>
      <Card title="Admin Registration" style={{ width: 300 }}>
        <Form onFinish={onFinish}>
          <Form.Item name="name" rules={[{ required: true, message: 'Please input your name!' }]}>
            <Input placeholder="Name" />
          </Form.Item>
          <Form.Item name="email" rules={[{ required: true, message: 'Please input your email!' }]}>
            <Input placeholder="Email" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
            <Input.Password placeholder="Password" />
          </Form.Item>
          <Form.Item name="invitationCode" rules={[{ required: true, message: 'Please input invitation code!' }]}>
            <Input placeholder="Invitation Code" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Register
            </Button>
            <div style={{ marginTop: 10, textAlign: 'center' }}>
              <Link to="/login">Already have an account? Login</Link>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Register;
