
import React, { useEffect, useRef } from 'react';
import { Card, Row, Col, Statistic, Table, Button, Space, Progress, Tag, Input } from 'antd';
import { CloudServerOutlined, FileZipOutlined, HardDriveOutlined, SearchOutlined, UploadOutlined } from '@ant-design/icons';
import * as echarts from 'echarts';

const StorageModule: React.FC = () => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current) return;
    const chart = echarts.init(chartRef.current);
    chart.setOption({
      tooltip: { trigger: 'item' },
      legend: { bottom: '5%', left: 'center', textStyle: { fontWeight: 'bold' } },
      series: [
        {
          name: 'Storage Breakdown',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: { borderRadius: 10, borderColor: '#fff', borderWidth: 2 },
          label: { show: false, position: 'center' },
          data: [
            { value: 1048, name: 'Images', itemStyle: { color: '#3b82f6' } },
            { value: 735, name: 'Documents', itemStyle: { color: '#10b981' } },
            { value: 580, name: 'Backup Archives', itemStyle: { color: '#f59e0b' } },
            { value: 484, name: 'Source Code', itemStyle: { color: '#6366f1' } }
          ]
        }
      ]
    });
    return () => chart.dispose();
  }, []);

  const columns = [
    { title: 'Resource Name', key: 'name', render: (record: any) => (
      <Space>
        <div className={`p-3 rounded-xl ${record.type === 'folder' ? 'bg-amber-50 text-amber-500' : 'bg-blue-50 text-blue-600'}`}>{record.icon}</div>
        <span className="font-black text-slate-800">{record.name}</span>
      </Space>
    )},
    { title: 'Volume', dataIndex: 'size', className: 'font-mono text-xs font-bold' },
    { title: 'Owner', dataIndex: 'owner', render: (o: string) => <span className="font-black uppercase text-[10px] text-slate-400 tracking-widest">{o}</span> },
    { title: 'Sync Status', key: 'status', render: () => <Tag color="green" className="font-black uppercase text-[9px]">Verified</Tag> }
  ];

  const data = [
    { id: '1', name: 'Production_Backup_2024.zip', size: '25.4 GB', owner: 'SYS_ADMIN', icon: <FileZipOutlined /> },
    { id: '2', name: 'Project_Assets', size: '1.2 GB', owner: 'DESIGN_MGR', icon: <CloudServerOutlined />, type: 'folder' },
    { id: '3', name: 'Legacy_Documents.rar', size: '445 MB', owner: 'LEGAL_DEPT', icon: <FileZipOutlined /> },
  ];

  return (
    <div className="space-y-8">
      <Row gutter={24}>
         <Col span={16}>
            <Card className="rounded-[3rem] shadow-2xl border-none overflow-hidden h-[450px]" title={<span className="font-black uppercase tracking-widest">Global Capacity Overview</span>}>
               <Row className="h-full">
                  <Col span={12} className="flex flex-col justify-center gap-10">
                     <Statistic title="Total Physical Volume" value={10} suffix="TB" prefix={<HardDriveOutlined />} valueStyle={{ fontWeight: 900 }} />
                     <div className="space-y-4">
                        <div className="flex justify-between"><span className="text-xs font-bold uppercase text-slate-400">Consumption Rate</span><span className="text-xs font-black">62.5%</span></div>
                        <Progress percent={62.5} status="active" strokeColor="#2563eb" strokeWidth={15} />
                     </div>
                  </Col>
                  <Col span={12}>
                     <div ref={chartRef} className="w-full h-full" />
                  </Col>
               </Row>
            </Card>
         </Col>
         <Col span={8}>
            <Card className="rounded-[3rem] shadow-2xl border-none h-full bg-blue-600 text-white p-6 relative overflow-hidden">
               <CloudServerOutlined className="absolute -right-10 -bottom-10 text-white/10 text-[200px]" />
               <div className="relative z-10">
                  <h3 className="text-blue-100 font-black uppercase tracking-[0.2em] mb-12">Infrastructure Nodes</h3>
                  <div className="space-y-8">
                     {['AWS S3 Cluster 01', 'GCP Storage Asia', 'Local On-Prem Node'].map(n => (
                       <div key={n} className="p-4 bg-white/10 rounded-2xl border border-white/20">
                          <p className="m-0 font-black text-sm uppercase">{n}</p>
                          <p className="m-0 text-[10px] text-blue-200 font-bold mt-2">Active: Operational High</p>
                       </div>
                     ))}
                  </div>
               </div>
            </Card>
         </Col>
      </Row>

      <Card className="rounded-[3rem] shadow-2xl border-none" title={<span className="font-black uppercase tracking-widest">Enterprise Explorer</span>} extra={<Button type="primary" icon={<UploadOutlined />} className="font-black rounded-xl">Transmit Data</Button>}>
         <div className="mb-6">
            <Input prefix={<SearchOutlined />} placeholder="Find resource by name or metadata..." className="w-80 rounded-xl" />
         </div>
         <Table columns={columns} dataSource={data} rowKey="id" pagination={false} />
      </Card>
    </div>
  );
};

export default StorageModule;
