
import React, { useState, useMemo } from 'react';
import { User, UserFilters, UserStatus, UserRole, RoleDefinition, UserSession, SessionStatus, FileItem, StorageQuota, StorageStats, StorageProviderConfig, LogEntry, LogLevel, LogSettings, LogPolicyConfig, MenuItem } from './types';
import { INITIAL_USERS, INITIAL_ROLES, INITIAL_SESSIONS, INITIAL_FILES, INITIAL_QUOTAS, INITIAL_STORAGE_STATS, INITIAL_PROVIDERS, INITIAL_LOGS, INITIAL_LOG_SETTINGS, INITIAL_LOG_POLICY, INITIAL_MENU } from './constants';
import StatCards from './components/StatCards';
import UserFiltersPanel from './components/UserFilters';
import UserTable from './components/UserTable';
import RoleTable from './components/RoleTable';
import SessionTable from './components/SessionTable';
import DocumentModal from './components/SRSModal';
import UserFormModal from './components/UserFormModal';
import PasswordResetModal from './components/PasswordResetModal';
import RoleFormModal from './components/RoleFormModal';

// Storage Module Imports
import StorageOverview from './components/FileManagement/StorageOverview';
import EnterpriseExplorer from './components/FileManagement/EnterpriseExplorer';
import StorageProviderConfigPanel from './components/FileManagement/StorageProviderConfig';
import FolderMapping from './components/FileManagement/FolderMapping';

// Log Module Imports
import LogListing from './components/Logs/LogListing';
import LogSettingsPanel from './components/Logs/LogSettings';
import LogPolicy from './components/Logs/LogPolicy';

// Navigation Module Imports
import MenuBuilder from './components/Navigation/MenuBuilder';
import RolePermissionMatrix from './components/Navigation/RolePermissionMatrix';
import UserOverride from './components/Navigation/UserOverride';

import { generateSRSContent, generateBRDContent } from './services/geminiService';
import { LayoutDashboard, LogOut, PieChart, Shield, Activity, FileText, ChevronDown, Briefcase, FileCode, FolderClosed, HardDrive, Network, User as UserIcon, Key, Bell, RefreshCcw, Terminal, ShieldAlert, Package, Cloud, Compass, Layers, UserCog, Settings, History } from 'lucide-react';

type Tab = 'users' | 'roles' | 'sessions' | 'files' | 'logs' | 'nav';
type FileSubTab = 'overview' | 'mapping' | 'explorer' | 'providers';
type LogSubTab = 'listing' | 'settings' | 'policy';
type NavSubTab = 'builder' | 'roles' | 'overrides';

const App: React.FC = () => {
  const [currentAppRole, setCurrentAppRole] = useState<UserRole>(UserRole.ADMIN);
  const isAdmin = currentAppRole === UserRole.ADMIN;

  // Tabs Management
  const [activeTab, setActiveTab] = useState<Tab>(isAdmin ? 'users' : 'files');
  const [activeFileSubTab, setActiveFileSubTab] = useState<FileSubTab>(isAdmin ? 'overview' : 'explorer');
  const [activeLogSubTab, setActiveLogSubTab] = useState<LogSubTab>('listing');
  const [activeNavSubTab, setActiveNavSubTab] = useState<NavSubTab>('builder');
  
  // Data State
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [roles, setRoles] = useState<RoleDefinition[]>(INITIAL_ROLES);
  const [sessions, setSessions] = useState<UserSession[]>(INITIAL_SESSIONS);
  const [logs, setLogs] = useState<LogEntry[]>(INITIAL_LOGS);
  const [logSettings, setLogSettings] = useState<LogSettings>(INITIAL_LOG_SETTINGS);
  const [logPolicy, setLogPolicy] = useState<LogPolicyConfig>(INITIAL_LOG_POLICY);
  const [menuData, setMenuData] = useState<MenuItem[]>(INITIAL_MENU);
  
  // Storage State
  const [storageStats, setStorageStats] = useState<StorageStats>(INITIAL_STORAGE_STATS);
  const [quotas, setQuotas] = useState<StorageQuota[]>(INITIAL_QUOTAS);
  const [files, setFiles] = useState<FileItem[]>(INITIAL_FILES);
  const [providers, setProviders] = useState<StorageProviderConfig[]>(INITIAL_PROVIDERS);
  
  const [filters, setFilters] = useState<UserFilters>({ search: '', role: '', status: '', department: '' });

  // Modal States
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedRole, setSelectedRole] = useState<RoleDefinition | null>(null);

  // AI Content State
  const [docContent, setDocContent] = useState('');
  const [isDocLoading, setIsDocLoading] = useState(false);
  const [currentDocType, setCurrentDocType] = useState<'SRS' | 'BRD'>('SRS');
  const [currentFeatureName, setCurrentFeatureName] = useState('');
  const [isDocDropdownOpen, setIsDocDropdownOpen] = useState(false);

  // Filtered Data
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = 
        user.fullName.toLowerCase().includes(filters.search.toLowerCase()) ||
        user.username.toLowerCase().includes(filters.search.toLowerCase()) ||
        user.email.toLowerCase().includes(filters.search.toLowerCase());
      const matchesRole = !filters.role || user.role === filters.role;
      const matchesStatus = !filters.status || user.status === filters.status;
      const matchesDept = !filters.department || user.department === filters.department;
      return matchesSearch && matchesRole && matchesStatus && matchesDept;
    });
  }, [users, filters]);

  const liveSessions = useMemo(() => sessions.filter(s => s.status === SessionStatus.ACTIVE), [sessions]);

  // Actions
  const handleSaveUser = (userData: Partial<User>) => {
    if (selectedUser) {
      setUsers(prev => prev.map(u => u.id === selectedUser.id ? { ...u, ...userData } as User : u));
    } else {
      const newUser: User = { 
        ...userData as User, 
        id: Math.random().toString(36).substr(2, 9), 
        createdAt: new Date().toISOString().split('T')[0], 
        lastLogin: 'Chưa đăng nhập' 
      };
      setUsers(prev => [newUser, ...prev]);
    }
    setIsUserModalOpen(false);
    setSelectedUser(null);
  };

  const handleUpdateFile = (updatedFile: FileItem) => {
    setFiles(prev => prev.map(f => f.id === updatedFile.id ? updatedFile : f));
  };

  const handleToggleLock = (user: User) => {
    setUsers(prev => prev.map(u => 
      u.id === user.id 
        ? { ...u, status: u.status === UserStatus.LOCKED ? UserStatus.ACTIVE : UserStatus.LOCKED } 
        : u
    ));
  };

  const handleGenerateDocument = async (type: 'SRS' | 'BRD') => {
    let featureName = "Hệ thống Quản trị OmniCore Pro";
    if (activeTab === 'files') featureName = "Quản lý Lưu trữ Doanh nghiệp (Enterprise Storage)";
    if (activeTab === 'logs') featureName = "Giám sát & Quản lý Nhật ký Hệ thống (System Logging)";
    if (activeTab === 'nav') featureName = "Thiết lập Điều hướng & Phân quyền Menu (Navigation Setup)";

    setCurrentDocType(type);
    setCurrentFeatureName(featureName);
    setDocContent('');
    setIsDocLoading(true);
    setIsDocModalOpen(true);
    setIsDocDropdownOpen(false);
    
    const content = type === 'SRS' ? await generateSRSContent(featureName) : await generateBRDContent(featureName);
    setDocContent(content);
    setIsDocLoading(false);
  };

  const handleSwitchRole = () => {
    const newRole = isAdmin ? UserRole.USER : UserRole.ADMIN;
    setCurrentAppRole(newRole);
    if (newRole === UserRole.USER) {
      setActiveTab('files');
      setActiveFileSubTab('explorer');
    } else {
      setActiveTab('users');
    }
  };

  return (
    <div className="min-h-screen flex bg-[#f8fafc] text-slate-900 font-['Inter']">
      {/* Sidebar */}
      <aside className="w-[300px] bg-[#0f172a] text-blue-100 hidden lg:flex flex-col sticky top-0 h-screen shadow-2xl z-50 transition-all duration-500">
        <div className="p-10 flex items-center gap-4">
          <div className="h-12 w-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/40 rotate-3">
            <Shield className="text-white" size={28} />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tighter uppercase italic">Omni<span className="text-blue-500">Core</span></h1>
        </div>

        <div className="px-6 py-4 flex-1 overflow-y-auto">
          <div className="px-6 py-6 mb-8 bg-white/5 rounded-[2.5rem] border border-white/10 text-center relative overflow-hidden group">
             <div className="absolute inset-0 bg-blue-600/5 group-hover:bg-blue-600/10 transition-colors" />
             <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 mx-auto flex items-center justify-center text-xl font-black mb-3 shadow-lg ring-4 ring-white/10 relative z-10 transition-transform group-hover:scale-110">
                {isAdmin ? 'AD' : 'US'}
             </div>
             <p className="text-[10px] font-black uppercase text-blue-400 tracking-[0.2em] mb-1 relative z-10">Access Tier</p>
             <p className="text-lg font-black text-white relative z-10">{currentAppRole}</p>
             <button onClick={handleSwitchRole} className="mt-4 flex items-center justify-center gap-2 w-full py-3 bg-white/10 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-blue-900 transition-all border border-white/10 relative z-10">
                <RefreshCcw size={14} /> Chuyển vai trò
             </button>
          </div>

          <nav className="space-y-2">
            {isAdmin && (
              <button onClick={() => setActiveTab('users')} className={`flex items-center gap-5 px-8 py-4 w-full rounded-2xl font-black transition-all ${activeTab === 'users' ? 'bg-blue-600 text-white shadow-xl translate-x-2' : 'text-slate-400 hover:bg-white/5'}`}>
                <LayoutDashboard size={22} /> <span>Dashboard</span>
              </button>
            )}
            <button onClick={() => setActiveTab('files')} className={`flex items-center gap-5 px-8 py-4 w-full rounded-2xl font-black transition-all ${activeTab === 'files' ? 'bg-blue-600 text-white shadow-xl translate-x-2' : 'text-slate-400 hover:bg-white/5'}`}>
              <FolderClosed size={22} /> <span>Storage</span>
            </button>
            <button onClick={() => setActiveTab('logs')} className={`flex items-center gap-5 px-8 py-4 w-full rounded-2xl font-black transition-all ${activeTab === 'logs' ? 'bg-blue-600 text-white shadow-xl translate-x-2' : 'text-slate-400 hover:bg-white/5'}`}>
              <Terminal size={22} /> <span>Logs</span>
            </button>
            {isAdmin && (
               <>
                  <button onClick={() => setActiveTab('nav')} className={`flex items-center gap-5 px-8 py-4 w-full rounded-2xl font-black transition-all ${activeTab === 'nav' ? 'bg-blue-600 text-white shadow-xl translate-x-2' : 'text-slate-400 hover:bg-white/5'}`}>
                    <Compass size={22} /> <span>Navigation</span>
                  </button>
                  <button onClick={() => setActiveTab('roles')} className={`flex items-center gap-5 px-8 py-4 w-full rounded-2xl font-black transition-all ${activeTab === 'roles' ? 'bg-blue-600 text-white shadow-xl translate-x-2' : 'text-slate-400 hover:bg-white/5'}`}>
                    <Key size={22} /> <span>Security Roles</span>
                  </button>
                  <button onClick={() => setActiveTab('sessions')} className={`flex items-center gap-5 px-8 py-4 w-full rounded-2xl font-black transition-all ${activeTab === 'sessions' ? 'bg-blue-600 text-white shadow-xl translate-x-2' : 'text-slate-400 hover:bg-white/5'}`}>
                    <Activity size={22} /> <span>Live Audit</span>
                  </button>
               </>
            )}
          </nav>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-24 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-12 sticky top-0 z-40">
          <h2 className="text-2xl font-black text-slate-800 tracking-tighter uppercase leading-none">
             {activeTab === 'users' ? 'User Directory' : activeTab === 'logs' ? 'System Surveillance' : activeTab === 'files' ? 'Cloud Storage Management' : activeTab === 'nav' ? 'Navigation Setup' : activeTab === 'roles' ? 'Security Policies' : 'Real-time Activity'}
          </h2>

          <div className="flex items-center gap-4">
            <div className="relative group">
              <button onClick={() => setIsDocDropdownOpen(!isDocDropdownOpen)} className="flex items-center gap-3 px-6 py-3 bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl">
                <FileText size={18} /> Export AI Doc <ChevronDown size={14} />
              </button>
              {isDocDropdownOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 py-3 z-50 animate-in fade-in slide-in-from-top-2">
                  <button onClick={() => handleGenerateDocument('SRS')} className="flex items-center gap-4 w-full px-6 py-4 text-left hover:bg-slate-50 transition-colors">
                    <FileCode size={18} className="text-blue-600" />
                    <span className="font-black text-[11px] uppercase">Generate SRS</span>
                  </button>
                  <button onClick={() => handleGenerateDocument('BRD')} className="flex items-center gap-4 w-full px-6 py-4 text-left hover:bg-slate-50 transition-colors border-t border-slate-50">
                    <Briefcase size={18} className="text-indigo-600" />
                    <span className="font-black text-[11px] uppercase">Generate BRD</span>
                  </button>
                </div>
              )}
            </div>
            <div className="h-12 w-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 shadow-inner relative"><Bell size={20} /><div className="absolute top-3 right-3 w-2 h-2 bg-rose-500 rounded-full border-2 border-white animate-pulse" /></div>
          </div>
        </header>

        {/* Sub-Tabs Management */}
        {(activeTab === 'files' || activeTab === 'logs' || activeTab === 'nav') && (
          <div className="bg-white border-b border-slate-200 px-12 py-4 flex gap-8 overflow-x-auto scrollbar-hide">
             {activeTab === 'files' && [
               { id: 'overview', label: 'Dashboard Overview', icon: PieChart, adminOnly: false },
               { id: 'mapping', label: 'Mapping & Permissions', icon: Network, adminOnly: true },
               { id: 'explorer', label: 'Cloud Explorer', icon: FolderClosed, adminOnly: false },
               { id: 'providers', label: 'Infrastructure', icon: Cloud, adminOnly: true },
             ].filter(sub => !sub.adminOnly || isAdmin).map(sub => (
               <button 
                key={sub.id} 
                onClick={() => setActiveFileSubTab(sub.id as FileSubTab)}
                className={`flex items-center gap-2 px-5 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all whitespace-nowrap ${activeFileSubTab === sub.id ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-blue-600'}`}
               >
                 <sub.icon size={16} /> {sub.label}
               </button>
             ))}

             {activeTab === 'logs' && [
               { id: 'listing', label: 'Live Listing', icon: Terminal, adminOnly: false },
               { id: 'settings', label: 'Advanced Settings', icon: Settings, adminOnly: true },
               { id: 'policy', label: 'Policy Configuration', icon: ShieldAlert, adminOnly: true },
             ].filter(sub => !sub.adminOnly || isAdmin).map(sub => (
               <button 
                key={sub.id} 
                onClick={() => setActiveLogSubTab(sub.id as LogSubTab)}
                className={`flex items-center gap-2 px-5 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all whitespace-nowrap ${activeLogSubTab === sub.id ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-blue-600'}`}
               >
                 <sub.icon size={16} /> {sub.label}
               </button>
             ))}

             {activeTab === 'nav' && [
               { id: 'builder', label: 'Menu Builder', icon: Compass },
               { id: 'roles', label: 'Role Permissions', icon: Layers },
               { id: 'overrides', label: 'User Overrides', icon: UserCog },
             ].map(sub => (
               <button 
                key={sub.id} 
                onClick={() => setActiveNavSubTab(sub.id as NavSubTab)}
                className={`flex items-center gap-2 px-5 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all whitespace-nowrap ${activeNavSubTab === sub.id ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-blue-600'}`}
               >
                 <sub.icon size={16} /> {sub.label}
               </button>
             ))}
          </div>
        )}

        <div className="p-12 max-w-[1600px] mx-auto w-full overflow-y-auto">
          {activeTab === 'users' && isAdmin && (
            <div className="animate-in fade-in duration-700">
              <StatCards users={users} />
              <UserFiltersPanel filters={filters} onFilterChange={setFilters} onClearFilters={() => setFilters({search: '', role: '', status: '', department: ''})} />
              <UserTable 
                users={filteredUsers} 
                onEdit={(u) => { setSelectedUser(u); setIsUserModalOpen(true); }} 
                onLockToggle={handleToggleLock} 
                onResetPassword={(u) => { setSelectedUser(u); setIsResetModalOpen(true); }} 
              />
            </div>
          )}

          {activeTab === 'files' && (
            <div className="animate-in fade-in duration-700">
               {activeFileSubTab === 'overview' && <StorageOverview stats={storageStats} />}
               {activeFileSubTab === 'mapping' && isAdmin && <FolderMapping />}
               {activeFileSubTab === 'explorer' && <EnterpriseExplorer files={files} onUpdateFile={handleUpdateFile} userUsed={42} userLimit={100} role={currentAppRole} />}
               {activeFileSubTab === 'providers' && isAdmin && <StorageProviderConfigPanel providers={providers} />}
            </div>
          )}

          {activeTab === 'logs' && (
            <div className="animate-in fade-in duration-700">
               {activeLogSubTab === 'listing' && <LogListing logs={logs} isAdmin={isAdmin} />}
               {activeLogSubTab === 'settings' && isAdmin && <LogSettingsPanel settings={logSettings} onSave={(s) => setLogSettings(s)} />}
               {activeLogSubTab === 'policy' && isAdmin && <LogPolicy policy={logPolicy} onSave={(p) => setLogPolicy(p)} />}
            </div>
          )}
          
          {activeTab === 'nav' && isAdmin && (
            <div className="animate-in fade-in duration-700">
               {activeNavSubTab === 'builder' && <MenuBuilder menuData={menuData} onSave={setMenuData} />}
               {activeNavSubTab === 'roles' && <RolePermissionMatrix menuData={menuData} />}
               {activeNavSubTab === 'overrides' && <UserOverride menuData={menuData} />}
            </div>
          )}

          {activeTab === 'roles' && isAdmin && (
            <div className="animate-in fade-in duration-700">
               <RoleTable roles={roles} onEdit={(r) => { setSelectedRole(r); setIsRoleModalOpen(true); }} onDelete={(id) => setRoles(roles.filter(r => r.id !== id))} />
            </div>
          )}

          {activeTab === 'sessions' && isAdmin && (
            <div className="animate-in fade-in duration-700">
               <SessionTable title="Live Active Sessions" sessions={liveSessions} onForceLogout={(id) => setSessions(sessions.filter(s => s.id !== id))} />
            </div>
          )}
        </div>
      </main>

      {/* Modals Container */}
      <DocumentModal isOpen={isDocModalOpen} onClose={() => setIsDocModalOpen(false)} content={docContent} isLoading={isDocLoading} docType={currentDocType} featureName={currentFeatureName} />
      <UserFormModal isOpen={isUserModalOpen} onClose={() => setIsUserModalOpen(false)} onSave={handleSaveUser} user={selectedUser} />
      <PasswordResetModal isOpen={isResetModalOpen} onClose={() => setIsResetModalOpen(false)} user={selectedUser} />
      <RoleFormModal isOpen={isRoleModalOpen} onClose={() => setIsRoleModalOpen(false)} onSave={(data) => {}} role={selectedRole} />
    </div>
  );
};

export default App;
