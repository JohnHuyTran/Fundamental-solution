
import React, { useState } from 'react';
import { Card, Row, Col, Tree, Input, Button, List, Avatar, Tag, Space } from 'antd';
import { SearchOutlined, PlusOutlined, FolderOpenOutlined, TeamOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { SAMPLE_GROUPS, SAMPLE_USERS } from '../../constants';

const OrgGroups: React.FC = () => {
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>(['g-1']);

  return (
    <Row gutter={24} className="h-[750px]">
      <Col span={8}>
        <Card title="ORG STRUCTURE" className="h-full rounded-[2rem] shadow-2xl border-none">
           <Input prefix={<SearchOutlined />} placeholder="Find unit..." className="mb-4 rounded-xl" />
           <Tree
             showIcon
             defaultExpandAll
             selectedKeys={selectedKeys}
             onSelect={(keys) => setSelectedKeys(keys)}
             treeData={SAMPLE_GROUPS}
             className="text-sm font-bold text-slate-600"
             icon={<FolderOpenOutlined className="text-amber-500" />}
           />
        </Card>
      </Col>
      <Col span={16}>
        <Card 
          title={
            <div className="flex justify-between items-center w-full">
              <span className="uppercase tracking-widest">UNIT PERSONNEL MANAGEMENT</span>
              <Button type="primary" ghost icon={<PlusOutlined />} size="small">Add Staff</Button>
            </div>
          } 
          className="h-full rounded-[2rem] shadow-2xl border-none flex flex-col"
        >
          <div className="mb-8 p-6 bg-blue-50 rounded-3xl border border-blue-100 flex items-center justify-between">
             <Space size="large">
                <Avatar size={64} className="bg-blue-600" icon={<TeamOutlined />} />
                <div>
                   <h3 className="text-2xl font-black text-slate-800 m-0">Engineering Group</h3>
                   <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-1 italic">Reporting line: HQ -> Tech Division</p>
                </div>
             </Space>
             <div className="text-right">
                <p className="text-[10px] font-black text-slate-400 uppercase">Active Count</p>
                <p className="text-3xl font-black text-blue-600">42 Personnel</p>
             </div>
          </div>

          <List
            dataSource={SAMPLE_USERS.slice(0, 8)}
            renderItem={(user) => (
              <List.Item
                actions={[
                  <Button type="text" icon={<EditOutlined />} />,
                  <Button type="text" danger icon={<DeleteOutlined />} />
                ]}
                className="hover:bg-slate-50 px-6 rounded-2xl transition-all mb-2 border border-slate-50"
              >
                <List.Item.Meta
                  avatar={<Avatar className="bg-slate-200 text-slate-600 font-bold">{user.fullName.charAt(0)}</Avatar>}
                  title={<span className="font-black text-slate-800">{user.fullName}</span>}
                  description={<Tag className="text-[9px] font-black uppercase">{user.role}</Tag>}
                />
              </List.Item>
            )}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default OrgGroups;
