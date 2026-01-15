
import React, { useEffect, useRef } from 'react';
import { Table, Tag, Card, Row, Col, Space, Input, Button, Badge, Typography } from 'antd';
import { TerminalOutlined, ShieldOutlined, SearchOutlined, CloudDownloadOutlined, LockOutlined, WarningOutlined } from '@ant-design/icons';
import { SAMPLE_LOGS } from '../../constants';
import { RiskLevel, AuditLog } from '../../types';
import * as echarts from 'echarts';

const { Text } = Typography;

const AccessLogs: React.FC = () => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current) return;
    const chart = echarts.init(chartRef.current);
    chart.setOption({
      tooltip: { trigger: 'axis' },
      xAxis: { type: 'category', data: ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00'] },
      yAxis: { type: 'value' },
      series: [
        { 
          name: 'Security Events', 
          type: 'line', 
          data: [120, 150, 80, 210, 160, 240], 
          smooth: true,
          areaStyle: { opacity: 0.1 },
          color: '#2563eb'
        }
      ]
    });
    return () => chart.dispose();
  }, []);

  const getRiskTag = (risk: RiskLevel) => {
    const map = {
      [RiskLevel.SAFE]: { color: 'green', label: 'Safe' },
      [RiskLevel.LOW]: { color: 'blue', label: 'Low' },
      [RiskLevel.MEDIUM]: { color: 'orange', label: 'Suspect' },
      [RiskLevel.HIGH]: { color: 'volcano', label: 'Attack' },
      [RiskLevel.CRITICAL]: { color: 'red', label: 'Threat' }
    };
    return <Tag color={map[risk].color} className="font-black uppercase text-[9px] px-3">{map[risk].label}</Tag>;
  };

  const columns = [
    { title: 'Security Tier', dataIndex: 'risk', width: 150, render: (risk: RiskLevel) => getRiskTag(risk) },
    { 
      title: 'Context Details', 
      key: 'context', 
      render: (record: AuditLog) => (
        <div className="flex flex-col">
          <Text strong className="text-blue-600 font-mono text-xs">{record.uri}</Text>
          <Text type="secondary" className="text-[10px] uppercase font-black">{record.timestamp} • IP: {record.ip}</Text>
        </div>
      ) 
    },
    { title: 'Identity', dataIndex: 'username', render: (u: string) => <Text strong className="text-slate-800">@{u}</Text> },
    { 
      title: 'Env Specs', 
      key: 'env', 
      render: (record: AuditLog) => (
        <Space direction="vertical" size={0}>
          <Text className="text-[10px] font-bold">{record.device}</Text>
          <Text className="text-[9px] opacity-40 uppercase font-black">{record.browser}</Text>
        </Space>
      ) 
    },
    { 
      title: 'Status', 
      dataIndex: 'status', 
      width: 100,
      render: (s: number) => <Badge status={s < 400 ? 'success' : 'error'} text={<span className={`font-black ${s >= 400 ? 'text-rose-500' : 'text-emerald-500'}`}>{s}</span>} />
    },
    {
      title: 'Security Response',
      key: 'actions',
      align: 'right' as const,
      render: (record: AuditLog) => (
        <Space>
          <Button size="small" danger icon={<LockOutlined />} className="text-[9px] font-black uppercase">Block IP</Button>
          <Button size="small" type="primary" icon={<WarningOutlined />} className="text-[9px] font-black uppercase">Trace</Button>
        </Space>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <Row gutter={24}>
         <Col span={16}>
           <Card className="rounded-[2.5rem] shadow-2xl border-none" title={<span className="font-black uppercase tracking-widest text-slate-400">Threat Intelligence Stream</span>}>
              <div ref={chartRef} className="h-64" />
           </Card>
         </Col>
         <Col span={8}>
            <Card className="rounded-[2.5rem] shadow-2xl border-none h-full bg-indigo-950 text-white p-4">
               <h3 className="text-indigo-300 font-black uppercase tracking-[0.2em] mb-8 flex items-center gap-2"><ShieldOutlined /> Risk Distribution</h3>
               <div className="space-y-6">
                  {Object.values(RiskLevel).map(r => (
                    <div key={r} className="flex justify-between items-center border-b border-white/5 pb-2">
                       <span className="text-xs font-bold">{r} Alert Count</span>
                       <span className="font-black text-xl text-blue-400">12</span>
                    </div>
                  ))}
               </div>
            </Card>
         </Col>
      </Row>

      <Card className="rounded-[2.5rem] shadow-2xl border-none">
        <div className="flex justify-between mb-8 items-center">
           <div className="flex items-center gap-4">
              <div className="p-4 bg-slate-900 text-white rounded-2xl shadow-xl"><TerminalOutlined size={24} /></div>
              <div>
                 <h3 className="text-xl font-black text-slate-800 uppercase m-0 leading-none">Security Audit Repository</h3>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Real-time Global Traffic Surveillance</p>
              </div>
           </div>
           <Space>
              <Input prefix={<SearchOutlined />} placeholder="Trace Session ID..." className="w-64 rounded-xl" />
              <Button icon={<CloudDownloadOutlined />} className="font-black rounded-xl">Export CSV</Button>
           </Space>
        </div>

        <Table 
          columns={columns} 
          dataSource={SAMPLE_LOGS} 
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
};

export default AccessLogs;
