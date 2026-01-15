
import React, { useState, useMemo } from 'react';
import { User, UserFilters, UserStatus, UserRole, RoleDefinition, UserSession, FileItem, StorageStats, StorageProviderConfig, AuditLogEntry, UserGroup } from './types';
import { INITIAL_USERS, INITIAL_ROLES, INITIAL_SESSIONS, INITIAL_FILES, INITIAL_QUOTAS, INITIAL_STORAGE_STATS, INITIAL_PROVIDERS, INITIAL_LOGS, INITIAL_LOG_SETTINGS, INITIAL_LOG_POLICY, INITIAL_MENU, ACCESS_AUDIT_LOGS, INITIAL_GROUPS, SESSION_HISTORY_MOCK } from './constants';
import StatCards from './components/StatCards';
import UserFiltersPanel from './components/UserFilters';
import UserTable from './components/UserTable';
import RoleTable from './components/RoleTable';
import DocumentModal from './components/SRSModal';
import UserFormModal from './components/UserFormModal';
import PasswordResetModal from './components/PasswordResetModal';
import RoleFormModal from './components/RoleFormModal';

// Storage Module
import StorageOverview from './components/FileManagement/StorageOverview';
import EnterpriseExplorer from './components/FileManagement/EnterpriseExplorer';
import StorageProviderConfigPanel from './components/FileManagement/StorageProviderConfig';
import FolderMapping from './components/FileManagement/FolderMapping';

// New User Management Components
import UserGroups from './components/UserManagement/UserGroups';
import SessionMonitor from './components/UserManagement/SessionMonitor';
import AccessLogs from './components/UserManagement/AccessLogs';

import { generateSRSContent, generateBRDContent } from './services/geminiService';
import { 
  Shield, Activity, FileText, ChevronDown, ChevronRight, Briefcase, FileCode, 
  FolderClosed, HardDrive, Network, User as UserIcon, Key, Bell, Terminal, 
  ShieldAlert, Users, FolderTree, LogOut, PieChart, Search, Settings 
} from 'lucide-react';

type ViewState = 
  | 'user-listing' | 'user-roles' | 'user-groups' | 'user-sessions' | 'user-access-logs'
  | 'storage-overview' | 'storage-mapping' | 'storage-explorer' | 'storage-providers';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewState>('user-listing');
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set(['users', 'storage']));
  
  // Simulation Role
  const [currentRole, setCurrentRole] = useState<UserRole>(UserRole.ADMIN);

  // Data State
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [roles, setRoles] = useState<RoleDefinition[]>(INITIAL_ROLES);
  const [sessions, setSessions] = useState<UserSession[]>(INITIAL_SESSIONS);
  const [groups, setGroups] = useState<UserGroup[]>(INITIAL_GROUPS);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(ACCESS_AUDIT_LOGS);
  
  const [files, setFiles] = useState<FileItem[]>(INITIAL_FILES);
  const [storageStats, setStorageStats] = useState<StorageStats>(INITIAL_STORAGE_STATS);
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
  const [isDocDropdownOpen, setIsDocDropdownOpen] = useState(false);

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

  const toggleModule = (module: string) => {
    const next = new Set(expandedModules);
    if (next.has(module)) next.delete(module);
    else next.add(module);
    setExpandedModules(next);
  };

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

  const handleToggleLock = (user: User) => {
    setUsers(prev => prev.map(u => 
      u.id === user.id 
        ? { ...u, status: u.status === UserStatus.LOCKED ? UserStatus.ACTIVE : UserStatus.LOCKED } 
        : u
    ));
  };

  const handleForceLogout = (sessionId: string) => {
    setSessions(prev => prev.filter(s => s.id !== sessionId));
  };

  const handleGenerateDocument = async (type: 'SRS' | 'BRD') => {
    const featureName = "Hệ thống quản trị doanh nghiệp OmniCore Pro";
    setCurrentDocType(type);
    setDocContent('');
    setIsDocLoading(true);
    setIsDocModalOpen(true);
    setIsDocDropdownOpen(false);
    const content = type === 'SRS' ? await generateSRSContent(featureName) : await generateBRDContent(featureName);
    setDocContent(content);
    setIsDocLoading(false);
  };

  // Ánh xạ tiêu đề động dựa trên view (Cập nhật tiêu đề trang con)
  const getViewTitle = () => {
    switch (activeView) {
      case 'user-listing': return 'Users Dashboard';
      case 'user-roles': return 'Roles Management'; // Cập nhật từ RBAC Policy
      case 'user-groups': return 'Organization Units';
      case 'user-sessions': return 'Session Monitor';
      case 'user-access-logs': return 'Access Audit Logs';
      case 'storage-overview': return 'Storage Health';
      case 'storage-mapping': return 'Access Mapping';
      case 'storage-explorer': return 'Enterprise Explorer';
      case 'storage-providers': return 'Storage Infrastructure';
      default: return 'Management Dashboard';
    }
  };

  const isUserView = activeView.startsWith('user-');
  const isStorageView = activeView.startsWith('storage-');

  return (
    <div className="min-h-screen flex bg-[#f8fafc] text-slate-900 font-['Inter']">
      {/* Sidebar - Dropdown Tree Menu */}
      <aside className="w-[300px] bg-[#0f172a] text-blue-100 hidden lg:flex flex-col sticky top-0 h-screen shadow-2xl z-50 border-r border-white/5">
        <div className="p-8 flex items-center gap-3">
          <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/40">
            <Shield className="text-white" size={24} />
          </div>
          <h1 className="text-xl font-black text-white tracking-tighter uppercase italic">Omni<span className="text-blue-500">Pro</span></h1>
        </div>

        <nav className="px-4 py-4 space-y-2 flex-1 overflow-y-auto scrollbar-hide">
          <p className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] mb-4 px-4">Enterprise Hub</p>
          
          {/* USERS MODULE */}
          <div className="mb-2">
            <button 
              onClick={() => toggleModule('users')}
              className={`flex items-center justify-between w-full px-4 py-3 rounded-xl transition-all ${isUserView ? 'text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
            >
              <div className="flex items-center gap-3 font-black text-sm uppercase tracking-tight">
                <UserIcon size={18} className={isUserView ? 'text-blue-500' : ''} />
                <span>Users & Security</span>
              </div>
              {expandedModules.has('users') ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
            
            {expandedModules.has('users') && (
              <div className="mt-1 ml-4 border-l border-white/10 space-y-1 animate-in slide-in-from-top-2 duration-300">
                {[
                  { id: 'user-listing', label: 'Users Dashboard', icon: Users, adminOnly: false },
                  { id: 'user-roles', label: 'Roles Management', icon: Key, adminOnly: true }, // Cập nhật từ RBAC Policy
                  { id: 'user-groups', label: 'Org Units', icon: FolderTree, adminOnly: false },
                  { id: 'user-sessions', label: 'Session Monitor', icon: Activity, adminOnly: true },
                  { id: 'user-access-logs', label: 'Access Audit', icon: ShieldAlert, adminOnly: true },
                ].filter(t => !t.adminOnly || currentRole === UserRole.ADMIN).map(sub => (
                  <button 
                    key={sub.id} 
                    onClick={() => setActiveView(sub.id as ViewState)} 
                    className={`flex items-center gap-3 px-6 py-2.5 w-full rounded-lg text-xs font-bold transition-all ${activeView === sub.id ? 'bg-blue-600/10 text-blue-400' : 'text-slate-500 hover:text-slate-200 hover:bg-white/5'}`}
                  >
                    <sub.icon size={14} /> {sub.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* STORAGE MODULE */}
          <div className="mb-2">
            <button 
              onClick={() => toggleModule('storage')}
              className={`flex items-center justify-between w-full px-4 py-3 rounded-xl transition-all ${isStorageView ? 'text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
            >
              <div className="flex items-center gap-3 font-black text-sm uppercase tracking-tight">
                <HardDrive size={18} className={isStorageView ? 'text-blue-500' : ''} />
                <span>Cloud Storage</span>
              </div>
              {expandedModules.has('storage') ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
            
            {expandedModules.has('storage') && (
              <div className="mt-1 ml-4 border-l border-white/10 space-y-1 animate-in slide-in-from-top-2 duration-300">
                {[
                  { id: 'storage-overview', label: 'Health Dashboard', icon: PieChart, adminOnly: true },
                  { id: 'storage-mapping', label: 'Access Mapping', icon: Network, adminOnly: true },
                  { id: 'storage-explorer', label: 'Enterprise Explorer', icon: FolderClosed, adminOnly: false },
                  { id: 'storage-providers', label: 'Infrastructure', icon: HardDrive, adminOnly: true },
                ].filter(t => !t.adminOnly || currentRole === UserRole.ADMIN).map(sub => (
                  <button 
                    key={sub.id} 
                    onClick={() => setActiveView(sub.id as ViewState)} 
                    className={`flex items-center gap-3 px-6 py-2.5 w-full rounded-lg text-xs font-bold transition-all ${activeView === sub.id ? 'bg-blue-600/10 text-blue-400' : 'text-slate-500 hover:text-slate-200 hover:bg-white/5'}`}
                  >
                    <sub.icon size={14} /> {sub.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <p className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] mt-8 mb-4 px-4">System</p>
          <button className="flex items-center gap-3 px-4 py-3 w-full rounded-xl font-black text-sm text-slate-400 hover:bg-white/5 hover:text-white transition-all">
            <Terminal size={18} /> <span>Audit Dashboard</span>
          </button>
          <button className="flex items-center gap-3 px-4 py-3 w-full rounded-xl font-black text-sm text-slate-400 hover:bg-white/5 hover:text-white transition-all">
            <Settings size={18} /> <span>System Settings</span>
          </button>
        </nav>

        <div className="p-8 border-t border-white/5">
           {/* Role Switcher */}
           <div className="mb-6 p-1.5 bg-white/5 rounded-2xl border border-white/10 flex gap-1">
              <button 
                onClick={() => setCurrentRole(UserRole.ADMIN)}
                className={`flex-1 py-2 rounded-xl text-[9px] font-black uppercase transition-all ${currentRole === UserRole.ADMIN ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
              >
                Admin
              </button>
              <button 
                onClick={() => setCurrentRole(UserRole.USER)}
                className={`flex-1 py-2 rounded-xl text-[9px] font-black uppercase transition-all ${currentRole === UserRole.USER ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
              >
                User
              </button>
           </div>

           <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10 mb-6">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-black">
                {currentRole === UserRole.ADMIN ? 'AD' : 'US'}
              </div>
              <div className="overflow-hidden">
                 <p className="text-xs font-black text-white truncate">{currentRole === UserRole.ADMIN ? 'Administrator' : 'Standard User'}</p>
                 <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{currentRole === UserRole.ADMIN ? 'QUẢN TRỊ VIÊN' : 'NGƯỜI DÙNG'}</p>
              </div>
           </div>
           <button className="flex items-center gap-3 w-full px-4 py-3 text-slate-500 hover:text-rose-400 transition-colors font-black text-xs uppercase tracking-widest">
              <LogOut size={18} /> Sign Out
           </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-24 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-12 sticky top-0 z-40">
          <div className="flex flex-col">
            <h2 className="text-2xl font-black text-slate-800 tracking-tighter uppercase leading-none">
               {getViewTitle()}
            </h2>
            <div className="flex items-center gap-2 mt-2">
               <span className={`w-2 h-2 rounded-full ${currentRole === UserRole.ADMIN ? 'bg-blue-500' : 'bg-emerald-500'}`} />
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Simulation: {currentRole === UserRole.ADMIN ? 'QUẢN TRỊ VIÊN' : 'NGƯỜI DÙNG'} VIEW</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {currentRole === UserRole.ADMIN && (
              <div className="relative group">
                <button onClick={() => setIsDocDropdownOpen(!isDocDropdownOpen)} className="flex items-center gap-3 px-6 py-3 bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl">
                  <FileText size={18} /> Export AI Doc <ChevronDown size={14} />
                </button>
                {isDocDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 py-3 z-50">
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
            )}
            <div className="h-12 w-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 relative">
              <Bell size={20} />
              <div className="absolute top-3 right-3 w-2 h-2 bg-rose-500 rounded-full border-2 border-white animate-pulse" />
            </div>
          </div>
        </header>

        {/* View Content Wrapper */}
        <div className="p-12 max-w-[1600px] mx-auto w-full overflow-y-auto">
          <div className="animate-in fade-in duration-500">
            {/* User Module Views */}
            {activeView === 'user-listing' && (
              <>
                <StatCards users={users} />
                <UserFiltersPanel filters={filters} onFilterChange={setFilters} onClearFilters={() => setFilters({search: '', role: '', status: '', department: ''})} />
                <UserTable 
                  users={filteredUsers} 
                  onEdit={(u) => { setSelectedUser(u); setIsUserModalOpen(true); }} 
                  onLockToggle={handleToggleLock} 
                  onResetPassword={(u) => { setSelectedUser(u); setIsResetModalOpen(true); }} 
                  isAdmin={currentRole === UserRole.ADMIN}
                />
              </>
            )}
            {activeView === 'user-roles' && currentRole === UserRole.ADMIN && <RoleTable roles={roles} onEdit={(r) => { setSelectedRole(r); setIsRoleModalOpen(true); }} onDelete={(id) => setRoles(roles.filter(r => r.id !== id))} />}
            {activeView === 'user-groups' && <UserGroups groups={groups} users={users} />}
            {activeView === 'user-sessions' && currentRole === UserRole.ADMIN && <SessionMonitor activeSessions={sessions} history={SESSION_HISTORY_MOCK} onForceLogout={handleForceLogout} />}
            {activeView === 'user-access-logs' && currentRole === UserRole.ADMIN && <AccessLogs logs={auditLogs} />}

            {/* Storage Module Views */}
            {activeView === 'storage-overview' && currentRole === UserRole.ADMIN && <StorageOverview stats={storageStats} />}
            {activeView === 'storage-mapping' && currentRole === UserRole.ADMIN && <FolderMapping />}
            {activeView === 'storage-explorer' && <EnterpriseExplorer files={files} onUpdateFile={(f) => setFiles(prev => prev.map(p => p.id === f.id ? f : p))} userUsed={3240} userLimit={5000} role={currentRole} />}
            {activeView === 'storage-providers' && currentRole === UserRole.ADMIN && <StorageProviderConfigPanel providers={providers} />}
          </div>
        </div>
      </main>

      {/* Modals Container */}
      <DocumentModal isOpen={isDocModalOpen} onClose={() => setIsDocModalOpen(false)} content={docContent} isLoading={isDocLoading} docType={currentDocType} featureName="OmniCore Enterprise Infrastructure" />
      <UserFormModal isOpen={isUserModalOpen} onClose={() => setIsUserModalOpen(false)} onSave={handleSaveUser} user={selectedUser} />
      <PasswordResetModal isOpen={isResetModalOpen} onClose={() => setIsResetModalOpen(false)} user={selectedUser} />
      <RoleFormModal isOpen={isRoleModalOpen} onClose={() => setIsRoleModalOpen(false)} onSave={() => setIsRoleModalOpen(false)} role={selectedRole} />
    </div>
  );
};

export default App;
