
import React from 'react';
import { Table, Button, Card, Space, Badge, Avatar, Typography } from 'antd';
import { PoweroffOutlined, DesktopOutlined, HistoryOutlined } from '@ant-design/icons';
import { SAMPLE_SESSIONS } from '../../constants';
import { UserSession } from '../../types';

const { Text } = Typography;

const SessionMonitor: React.FC = () => {
  const columns = [
    { 
      title: 'Principal Identity', 
      dataIndex: 'username', 
      render: (u: string) => (
        <Space>
          <Avatar className="bg-slate-200 text-slate-600 font-bold">{u.charAt(0).toUpperCase()}</Avatar>
          <Text strong>@{u}</Text>
        </Space>
      )
    },
    { title: 'Network & Endpoint', key: 'network', render: (r: UserSession) => (
      <div>
        <Text strong className="text-xs">{r.ip}</Text>
        <div className="text-[10px] text-slate-400 font-black uppercase"><DesktopOutlined /> {r.device}</div>
      </div>
    )},
    { title: 'Auth Timestamp', dataIndex: 'loginTime', className: 'text-xs font-bold text-slate-500' },
    { title: 'Activity State', dataIndex: 'lastActive', render: (t: string) => <Badge status="processing" text={<span className="font-black uppercase text-[10px] text-emerald-500">{t}</span>} /> },
    {
      title: 'Control',
      align: 'right' as const,
      render: (record: UserSession) => (
        <Button danger type="primary" ghost icon={<PoweroffOutlined />} className="font-black text-[10px] uppercase h-10 px-6 rounded-xl">Kill Session</Button>
      )
    }
  ];

  return (
    <div className="space-y-8">
      <Card className="rounded-[2.5rem] shadow-2xl border-none" title={<span className="font-black uppercase tracking-widest text-blue-600">Active Authentication Pool</span>}>
         <Table columns={columns} dataSource={SAMPLE_SESSIONS} rowKey="id" pagination={false} />
      </Card>
      
      <Card className="rounded-[2.5rem] shadow-xl border-none opacity-60" title={<span className="font-black uppercase tracking-widest text-slate-400"><HistoryOutlined /> Past Connection Logs</span>}>
         <Table columns={columns.slice(0, 4)} dataSource={SAMPLE_SESSIONS.slice(0, 3)} rowKey="id" pagination={false} />
      </Card>
    </div>
  );
};

export default SessionMonitor;
