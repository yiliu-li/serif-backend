import React, { useEffect, useState } from 'react';
import { Table, Button, Layout, message, Tag } from 'antd';
import api from '../api';
import { useNavigate } from 'react-router-dom';

const { Header, Content } = Layout;

interface InvitationCode {
  id: number;
  code: string;
  isUsed: boolean;
  createdAt: string;
  usedBy?: {
    email: string;
    name: string;
  };
}

const Dashboard: React.FC = () => {
  const [codes, setCodes] = useState<InvitationCode[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchCodes = async () => {
    setLoading(true);
    try {
      const response = await api.get('/invitation-codes');
      setCodes(response.data);
    } catch (error) {
      console.error(error);
      message.error('Failed to fetch codes');
    } finally {
      setLoading(false);
    }
  };

  const generateCode = async () => {
    try {
      await api.post('/invitation-codes');
      message.success('Code generated');
      fetchCodes();
    } catch (error) {
      console.error(error);
      message.error('Failed to generate code');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  useEffect(() => {
    fetchCodes();
  }, []);

  const columns = [
    { 
      title: 'Code', 
      dataIndex: 'code', 
      key: 'code',
      render: (text: string) => <Tag color="blue">{text}</Tag>
    },
    { 
      title: 'Status', 
      dataIndex: 'isUsed', 
      key: 'isUsed', 
      render: (isUsed: boolean) => (
        <Tag color={isUsed ? 'red' : 'green'}>{isUsed ? 'Used' : 'Available'}</Tag>
      ) 
    },
    { 
      title: 'Created At', 
      dataIndex: 'createdAt', 
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleString()
    },
    { 
      title: 'Used By', 
      dataIndex: 'usedBy', 
      key: 'usedBy',
      render: (usedBy: any) => usedBy ? usedBy.email : '-' 
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ color: 'white', fontSize: '20px' }}>Admin Dashboard</div>
        <Button onClick={logout}>Logout</Button>
      </Header>
      <Content style={{ padding: '50px' }}>
        <div style={{ marginBottom: 16 }}>
          <Button type="primary" onClick={generateCode}>Generate New Code</Button>
        </div>
        <Table dataSource={codes} columns={columns} rowKey="id" loading={loading} />
      </Content>
    </Layout>
  );
};

export default Dashboard;
