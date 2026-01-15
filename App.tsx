
import React, { useState } from 'react';
import { ConfigProvider, Layout, Menu, Button, theme, Avatar, Dropdown, Tag, Space, Badge } from 'antd';
import { 
  UserOutlined, 
  ShieldOutlined, 
  TeamOutlined, 
  MonitorOutlined, 
  FileSearchOutlined, 
  CloudOutlined,
  LogoutOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  BellOutlined,
  SwapOutlined
} from '@ant-design/icons';
import { useStore } from './store/useStore';
import { UserRole } from './types';

// Page Components
import UserListing from './pages/UserManagement/UserListing';
import RoleManagement from './pages/UserManagement/RoleManagement';
import OrgGroups from './pages/UserManagement/OrgGroups';
import SessionMonitor from './pages/UserManagement/SessionMonitor';
import AccessLogs from './pages/UserManagement/AccessLogs';
import StorageModule from './pages/Storage/StorageModule';

const { Header, Sider, Content } = Layout;

const App: React.FC = () => {
  const { currentRole, setRole, isSidebarCollapsed, toggleSidebar } = useStore();
  const [activeKey, setActiveKey] = useState('1');

  const menuItems = [
    { key: 'grp-user', label: 'USER CONTROL', type: 'group', children: [
      { key: '1', icon: <UserOutlined />, label: 'User Directory' },
      { key: '2', icon: <ShieldOutlined />, label: 'RBAC Policy', disabled: currentRole === UserRole.USER },
      { key: '3', icon: <TeamOutlined />, label: 'Org Units' },
      { key: '4', icon: <MonitorOutlined />, label: 'Live Sessions', disabled: currentRole === UserRole.USER },
      { key: '5', icon: <FileSearchOutlined />, label: 'Audit Logs', disabled: currentRole === UserRole.USER },
    ]},
    { key: 'grp-storage', label: 'RESOURCES', type: 'group', children: [
      { key: '6', icon: <CloudOutlined />, label: 'Cloud Storage' },
    ]}
  ];

  const renderContent = () => {
    switch (activeKey) {
      case '1': return <UserListing />;
      case '2': return <RoleManagement />;
      case '3': return <OrgGroups />;
      case '4': return <SessionMonitor />;
      case '5': return <AccessLogs />;
      case '6': return <StorageModule />;
      default: return <UserListing />;
    }
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#2563eb',
          borderRadius: 12,
          fontFamily: 'Inter, sans-serif',
        },
        components: {
          Layout: {
            headerBg: '#ffffff',
            siderBg: '#0f172a',
          },
          Menu: {
            darkItemBg: '#0f172a',
            darkItemSelectedBg: '#2563eb',
          }
        },
      }}
    >
      <Layout style={{ minHeight: '100vh' }}>
        <Sider 
          trigger={null} 
          collapsible 
          collapsed={isSidebarCollapsed}
          width={260}
          theme="dark"
          className="shadow-2xl"
        >
          <div className="p-6 mb-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xl italic shadow-lg">O</div>
            {!isSidebarCollapsed && (
              <span className="text-white font-black text-lg tracking-tighter uppercase italic">Omni<span className="text-blue-500">Pro</span></span>
            )}
          </div>
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[activeKey]}
            items={menuItems}
            onClick={({ key }) => setActiveKey(key)}
          />
          
          <div className="absolute bottom-0 w-full p-4 border-t border-white/5 bg-slate-900/50">
             {!isSidebarCollapsed && (
               <div className="mb-4 p-3 bg-white/5 rounded-xl border border-white/10">
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-2">Role Switcher</p>
                  <Button 
                    size="small" 
                    block 
                    icon={<SwapOutlined />}
                    className="bg-blue-600 text-white border-none text-[10px] font-black h-8"
                    onClick={() => setRole(currentRole === UserRole.ADMIN ? UserRole.USER : UserRole.ADMIN)}
                  >
                    SWAP TO {currentRole === UserRole.ADMIN ? 'USER' : 'ADMIN'}
                  </Button>
               </div>
             )}
             <div className="flex items-center gap-3">
                <Avatar className="bg-blue-500">{currentRole === UserRole.ADMIN ? 'AD' : 'US'}</Avatar>
                {!isSidebarCollapsed && (
                  <div className="overflow-hidden">
                    <p className="text-white text-xs font-bold truncate">System {currentRole}</p>
                    <p className="text-slate-500 text-[10px] uppercase font-black tracking-widest">Enterprise Tier</p>
                  </div>
                )}
             </div>
          </div>
        </Sider>

        <Layout>
          <Header className="px-8 flex items-center justify-between border-b border-slate-200">
            <div className="flex items-center gap-4">
              <Button
                type="text"
                icon={isSidebarCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={toggleSidebar}
                className="text-lg"
              />
              <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight m-0">
                {menuItems.flatMap(g => g.children).find(i => i.key === activeKey)?.label}
              </h2>
            </div>

            <Space size="large">
              <Badge count={5} dot>
                <Button type="text" icon={<BellOutlined className="text-lg text-slate-400" />} />
              </Badge>
              <Tag color={currentRole === UserRole.ADMIN ? 'blue' : 'green'} className="font-black border-none px-4 py-1 rounded-full uppercase text-[10px] tracking-widest">
                Mode: {currentRole}
              </Tag>
            </Space>
          </Header>

          <Content className="p-8 overflow-y-auto">
            <div className="max-w-[1600px] mx-auto animate-in fade-in duration-500">
              {renderContent()}
            </div>
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default App;
