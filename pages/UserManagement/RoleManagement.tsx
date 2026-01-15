
import React from 'react';
import { Table, Button, Card, Space, Tag, Typography } from 'antd';
import { SafetyCertificateOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';

const { Text } = Typography;

const RoleManagement: React.FC = () => {
  const data = [
    { id: '1', name: 'Super Administrator', code: 'SUPER_ADMIN', desc: 'Full architectural access across all modules.', type: 'System' },
    { id: '2', name: 'Security Auditor', code: 'SEC_AUDIT', desc: 'Read-only access to audit logs and sessions.', type: 'System' },
    { id: '3', name: 'Storage Manager', code: 'STORAGE_MGR', desc: 'Management of quotas and file systems.', type: 'Custom' },
  ];

  const columns = [
    { 
      title: 'Role Designation', 
      dataIndex: 'name', 
      render: (text: string, record: any) => (
        <Space>
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><SafetyCertificateOutlined /></div>
          <div>
            <div className="font-black text-slate-800">{text}</div>
            <div className="text-[9px] font-black uppercase text-slate-400">ID: {record.code}</div>
          </div>
        </Space>
      )
    },
    { title: 'Operational Description', dataIndex: 'desc', className: 'text-xs text-slate-500 italic' },
    { 
      title: 'Type', 
      dataIndex: 'type', 
      render: (t: string) => <Tag color={t === 'System' ? 'purple' : 'cyan'} className="font-black uppercase text-[9px] px-3">{t}</Tag> 
    },
    {
      title: 'Actions',
      align: 'right' as const,
      render: () => (
        <Space>
          <Button type="text" icon={<EditOutlined />} />
          <Button type="text" danger icon={<DeleteOutlined />} />
        </Space>
      )
    }
  ];

  return (
    <Card className="rounded-[2.5rem] shadow-2xl border-none" title={<span className="font-black uppercase tracking-widest">RBAC Configuration Panel</span>} extra={<Button type="primary" icon={<PlusOutlined />} className="font-black rounded-xl">Define New Role</Button>}>
       <Table columns={columns} dataSource={data} rowKey="id" pagination={false} />
    </Card>
  );
};

export default RoleManagement;
