
import React, { useState } from 'react';
import { Table, Tag, Input, Space, Button, Card, Row, Col, Statistic, Select } from 'antd';
import { SearchOutlined, UserAddOutlined, FilterOutlined, KeyOutlined, LockOutlined, EditOutlined } from '@ant-design/icons';
import { SAMPLE_USERS } from '../../constants';
import { User, UserStatus } from '../../types';

const UserListing: React.FC = () => {
  const [data, setData] = useState<User[]>(SAMPLE_USERS);
  const [searchText, setSearchText] = useState('');

  const columns = [
    {
      title: 'Personnel Identity',
      key: 'identity',
      render: (record: User) => (
        <Space>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black">{record.fullName.charAt(0)}</div>
          <div>
            <div className="font-bold text-slate-800">{record.fullName}</div>
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">@{record.username}</div>
          </div>
        </Space>
      ),
    },
    {
      title: 'Contact Details',
      key: 'contact',
      render: (record: User) => (
        <div className="text-xs">
          <div className="font-bold text-slate-600">{record.email}</div>
          <div className="text-slate-400">{record.phone}</div>
        </div>
      ),
    },
    {
      title: 'Department',
      dataIndex: 'department',
      render: (dept: string) => <Tag color="geekblue" className="font-black uppercase text-[10px] px-3">{dept}</Tag>,
    },
    {
      title: 'Account State',
      dataIndex: 'status',
      render: (status: UserStatus) => {
        const colors = { [UserStatus.ACTIVE]: 'success', [UserStatus.LOCKED]: 'error', [UserStatus.PENDING]: 'warning' };
        return <Tag color={colors[status]} className="font-black uppercase text-[10px] px-3 border-none">{status}</Tag>;
      },
    },
    {
      title: 'Actions',
      key: 'action',
      align: 'right' as const,
      render: () => (
        <Space>
          <Button type="text" icon={<EditOutlined className="text-blue-500" />} />
          <Button type="text" icon={<KeyOutlined className="text-amber-500" />} />
          <Button type="text" icon={<LockOutlined className="text-rose-500" />} />
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <Row gutter={24}>
        <Col span={6}>
          <Card bordered={false} className="shadow-sm border-l-4 border-blue-500 rounded-2xl">
            <Statistic title="Total Personnel" value={data.length} prefix={<UserAddOutlined />} />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false} className="shadow-sm border-l-4 border-emerald-500 rounded-2xl">
            <Statistic title="Active Accounts" value={data.filter(u => u.status === UserStatus.ACTIVE).length} />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false} className="shadow-sm border-l-4 border-rose-500 rounded-2xl">
            <Statistic title="Locked Records" value={data.filter(u => u.status === UserStatus.LOCKED).length} />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false} className="shadow-sm border-l-4 border-amber-500 rounded-2xl">
            <Statistic title="Pending Review" value={data.filter(u => u.status === UserStatus.PENDING).length} />
          </Card>
        </Col>
      </Row>

      <Card className="rounded-[2.5rem] shadow-2xl border-none">
        <div className="flex justify-between mb-8">
           <Space size="middle">
              <Input 
                prefix={<SearchOutlined />} 
                placeholder="Search identity..." 
                className="w-80 rounded-xl"
                onChange={e => setSearchText(e.target.value)}
              />
              <Select placeholder="Filter Department" className="w-48" allowClear>
                 {['Kỹ thuật', 'Kinh doanh', 'Marketing'].map(d => <Select.Option key={d} value={d}>{d}</Select.Option>)}
              </Select>
           </Space>
           <Button type="primary" icon={<UserAddOutlined />} className="rounded-xl font-black h-12 px-8 uppercase text-xs tracking-widest shadow-xl shadow-blue-500/30">
              Add Account
           </Button>
        </div>

        <Table 
          columns={columns} 
          dataSource={data.filter(u => u.fullName.toLowerCase().includes(searchText.toLowerCase()))} 
          rowKey="id"
          pagination={{ pageSize: 8 }}
        />
      </Card>
    </div>
  );
};

export default UserListing;
