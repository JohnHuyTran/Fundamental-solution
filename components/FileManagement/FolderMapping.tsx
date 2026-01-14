
import React, { useState, useMemo } from 'react';
import { User, UserRole } from '../../types';
import { INITIAL_USERS } from '../../constants';
import { 
  Users, User as UserIcon, CheckCircle2, Search, 
  ShieldCheck, Briefcase, Landmark, Code, 
  Globe, UserPlus, Info, Check, ShieldAlert,
  ChevronRight, FolderTree, HardDrive, FileCheck, 
  Layers, Lock, Unlock, Trash2, Upload, Download, Eye, Settings2, Edit2, Building2, Square, CheckSquare, Minus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FolderAccess {
  path: string;
  read: boolean;
  write: boolean;
  delete: boolean;
  upload: boolean;
  download: boolean;
}

interface GroupMap {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
  defaultFolders: string[];
}

const GROUP_MAPS: GroupMap[] = [
  { 
    id: 'm1', 
    name: 'Phòng Chiến Lược', 
    description: 'Bao gồm các thư mục báo cáo và kế hoạch trung hạn.', 
    icon: Landmark, 
    color: 'text-indigo-600 bg-indigo-50', 
    defaultFolders: ['/Strategy/2024', '/Finance/Reports', '/Executive_Summaries'] 
  },
  { 
    id: 'm2', 
    name: 'Kỹ Thuật & Vận Hành', 
    description: 'Toàn bộ Source Code và hạ tầng server.', 
    icon: Code, 
    color: 'text-blue-600 bg-blue-50', 
    defaultFolders: ['/Engineering/Source', '/Engineering/Docs', '/Infrastructure/Logs'] 
  },
  { 
    id: 'm3', 
    name: 'Truyền Thông & Marketing', 
    description: 'Kho lưu trữ Media, Banner và Video quảng cáo.', 
    icon: Globe, 
    color: 'text-amber-600 bg-amber-50', 
    defaultFolders: ['/Marketing/Assets', '/Media/Videos', '/Branding/Assets'] 
  },
  { 
    id: 'm4', 
    name: 'Tài Chính Kế Toán', 
    description: 'Hóa đơn, chứng từ và bảng lương.', 
    icon: Briefcase, 
    color: 'text-emerald-600 bg-emerald-50', 
    defaultFolders: ['/Finance/Invoices', '/Finance/Salaries', '/Tax_Vault'] 
  }
];

type MappingScope = 'User' | 'Group' | 'Company';

const FolderMapping: React.FC = () => {
  const [selectedUserId, setSelectedUserId] = useState<string>(INITIAL_USERS[0].id);
  const [searchUser, setSearchUser] = useState('');
  const [selectedMapIds, setSelectedMapIds] = useState<Set<string>>(new Set(['m2']));
  const [isSaving, setIsSaving] = useState(false);
  const [scope, setScope] = useState<MappingScope>('User');

  const [customPermissions, setCustomPermissions] = useState<Record<string, FolderAccess>>({});

  const selectedUser = INITIAL_USERS.find(u => u.id === selectedUserId);
  const filteredUsers = INITIAL_USERS.filter(u => 
    u.fullName.toLowerCase().includes(searchUser.toLowerCase()) || 
    u.username.toLowerCase().includes(searchUser.toLowerCase())
  );

  const mappedFolders = useMemo(() => {
    const folders = new Set<string>();
    GROUP_MAPS.forEach(map => {
      if (selectedMapIds.has(map.id)) {
        map.defaultFolders.forEach(f => folders.add(f));
      }
    });
    return Array.from(folders).sort();
  }, [selectedMapIds]);

  const toggleMap = (mapId: string) => {
    const newSet = new Set(selectedMapIds);
    if (newSet.has(mapId)) newSet.delete(mapId);
    else newSet.add(mapId);
    setSelectedMapIds(newSet);
  };

  const getFolderPermission = (path: string): FolderAccess => {
    const contextKey = scope === 'Company' ? 'GLOBAL' : scope === 'Group' ? 'GROUP_SEL' : selectedUserId;
    const key = `${contextKey}_${path}`;
    return customPermissions[key] || {
      path,
      read: true,
      write: false,
      delete: false,
      upload: true,
      download: true
    };
  };

  const togglePermission = (path: string, type: keyof Omit<FolderAccess, 'path'>) => {
    const contextKey = scope === 'Company' ? 'GLOBAL' : scope === 'Group' ? 'GROUP_SEL' : selectedUserId;
    const key = `${contextKey}_${path}`;
    const current = getFolderPermission(path);
    setCustomPermissions(prev => ({
      ...prev,
      [key]: { ...current, [type]: !current[type] }
    }));
  };

  const handleSelectAllForEverything = () => {
    const contextKey = scope === 'Company' ? 'GLOBAL' : scope === 'Group' ? 'GROUP_SEL' : selectedUserId;
    const newPerms = { ...customPermissions };
    mappedFolders.forEach(path => {
      const key = `${contextKey}_${path}`;
      newPerms[key] = { path, read: true, write: true, delete: true, upload: true, download: true };
    });
    setCustomPermissions(newPerms);
  };

  const handleSelectAllForFolder = (path: string) => {
    const contextKey = scope === 'Company' ? 'GLOBAL' : scope === 'Group' ? 'GROUP_SEL' : selectedUserId;
    const key = `${contextKey}_${path}`;
    const current = getFolderPermission(path);
    const isFull = current.read && current.write && current.delete && current.upload && current.download;
    setCustomPermissions(prev => ({
      ...prev,
      [key]: { path, read: !isFull, write: !isFull, delete: !isFull, upload: !isFull, download: !isFull }
    }));
  };

  const handleSaveMapping = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert(`Đã lưu cấu hình gán quyền thành công.`);
    }, 1200);
  };

  return (
    <div className="flex flex-col xl:flex-row gap-6 h-[850px] animate-in fade-in duration-700">
      
      {/* CỘT 1: CHỌN PHẠM VI & NHÂN SỰ (Yêu cầu 2 - Đổi màu select) */}
      <aside className="w-full xl:w-80 bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 flex flex-col overflow-hidden">
         <div className="p-6 border-b border-slate-50 bg-slate-50/50">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Mapping Scope</h4>
            <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-inner mb-6">
               <button onClick={() => setScope('User')} className={`flex-1 flex flex-col items-center gap-1 py-3 rounded-xl transition-all ${scope === 'User' ? 'bg-white shadow-md text-blue-600' : 'text-slate-400'}`}>
                  <UserIcon size={16} /><span className="text-[9px] font-black uppercase">Cá nhân</span>
               </button>
               <button onClick={() => setScope('Group')} className={`flex-1 flex flex-col items-center gap-1 py-3 rounded-xl transition-all ${scope === 'Group' ? 'bg-white shadow-md text-blue-600' : 'text-slate-400'}`}>
                  <Users size={16} /><span className="text-[9px] font-black uppercase">Nhóm</span>
               </button>
               <button onClick={() => setScope('Company')} className={`flex-1 flex flex-col items-center gap-1 py-3 rounded-xl transition-all ${scope === 'Company' ? 'bg-white shadow-md text-blue-600' : 'text-slate-400'}`}>
                  <Building2 size={16} /><span className="text-[9px] font-black uppercase">Cty</span>
               </button>
            </div>

            {scope === 'User' && (
              <div className="relative group animate-in fade-in">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600" size={16} />
                 <input 
                   type="text" 
                   placeholder="Tìm nhân viên..."
                   className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:border-blue-500 outline-none font-bold text-xs transition-all shadow-sm"
                   value={searchUser}
                   onChange={e => setSearchUser(e.target.value)}
                 />
              </div>
            )}
         </div>
         
         <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
            {scope === 'User' ? filteredUsers.map(u => (
              <button 
                key={u.id}
                onClick={() => setSelectedUserId(u.id)}
                className={`w-full flex items-center gap-4 p-4 rounded-3xl text-left transition-all border-2 ${
                  selectedUserId === u.id 
                    ? 'bg-gradient-to-br from-blue-600 to-indigo-700 border-blue-400 text-white shadow-[0_10px_30px_-10px_rgba(37,99,235,0.6)] translate-x-1' 
                    : 'bg-white border-transparent hover:bg-blue-50 text-slate-500'
                }`}
              >
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm shadow-sm ${selectedUserId === u.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-400'}`}>
                  {u.fullName.charAt(0)}
                </div>
                <div className="overflow-hidden">
                   <p className="font-black text-[12px] uppercase truncate tracking-tight leading-tight mb-1">{u.fullName}</p>
                   <p className={`text-[10px] font-bold truncate opacity-60`}>@{u.username}</p>
                </div>
                {selectedUserId === u.id && <motion.div layoutId="active-tick" className="ml-auto"><CheckCircle2 size={16} /></motion.div>}
              </button>
            )) : (
              <div className="p-10 text-center opacity-20 flex flex-col items-center">
                 <ShieldCheck size={48} />
                 <p className="text-[10px] font-black uppercase tracking-widest mt-4">Security Policy Scope</p>
              </div>
            )}
         </div>
      </aside>

      {/* CỘT 2: CHỌN MAPS */}
      <main className="w-full xl:w-80 bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 flex flex-col overflow-hidden">
         <div className="p-8 border-b border-slate-50 bg-slate-50/20">
            <h4 className="text-[11px] font-black uppercase tracking-[0.2em] mb-1">Group Mapping</h4>
            <p className="text-[10px] text-slate-400 font-bold italic">Tích chọn các cụm thư mục mẫu</p>
         </div>

         <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/30">
            {GROUP_MAPS.map(map => {
              const isSelected = selectedMapIds.has(map.id);
              return (
                <div 
                  key={map.id}
                  onClick={() => toggleMap(map.id)}
                  className={`p-5 rounded-3xl border-2 cursor-pointer transition-all relative overflow-hidden bg-white ${isSelected ? 'border-blue-600 shadow-lg' : 'border-slate-100 hover:border-blue-200'}`}
                >
                   <div className="flex items-center justify-between mb-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${map.color}`}>
                         <map.icon size={20} />
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-200'}`}>
                         {isSelected && <Check size={12} strokeWidth={4} />}
                      </div>
                   </div>
                   <h5 className="font-black text-xs mb-1 text-slate-800 uppercase tracking-tight">{map.name}</h5>
                   <p className="text-[9px] text-slate-400 font-medium leading-relaxed">{map.defaultFolders.length} Thư mục mặc định</p>
                </div>
              );
            })}
         </div>
      </main>

      {/* CỘT 3: PHÂN QUYỀN */}
      <section className="flex-1 bg-white rounded-[3rem] shadow-2xl border border-slate-100 flex flex-col overflow-hidden">
         <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/20">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white text-xl font-black shadow-lg shadow-blue-200">
                  {scope === 'User' ? (selectedUser?.fullName.charAt(0) || '?') : scope === 'Group' ? 'G' : 'C'}
               </div>
               <div>
                  <h3 className="text-lg font-black text-slate-800 leading-none mb-1">
                     {scope === 'User' ? selectedUser?.fullName : scope === 'Group' ? 'Gán quyền theo Nhóm' : 'Gán quyền Toàn hệ thống'}
                  </h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Effective Permissions Console</p>
               </div>
            </div>
            <div className="flex items-center gap-4">
               <button onClick={handleSelectAllForEverything} className="px-6 py-3 bg-slate-100 text-slate-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all flex items-center gap-2"><CheckSquare size={16} /> Select All</button>
               <button onClick={handleSaveMapping} disabled={isSaving} className="px-8 py-3 bg-blue-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-blue-700 disabled:opacity-50 transition-all flex items-center gap-2">{isSaving ? 'Syncing...' : <><CheckCircle2 size={16} /> Lưu cấu hình</>}</button>
            </div>
         </div>

         <div className="flex-1 overflow-y-auto">
            <div className="bg-blue-600 text-white grid grid-cols-12 items-center h-14 px-8 text-[9px] font-black uppercase tracking-[0.2em] sticky top-0 z-10 shadow-lg">
               <div className="col-span-4">Path / Folder Location</div>
               <div className="col-span-1 text-center">Read</div>
               <div className="col-span-1 text-center">Write</div>
               <div className="col-span-1 text-center">Del</div>
               <div className="col-span-1 text-center">Up</div>
               <div className="col-span-1 text-center">Down</div>
               <div className="col-span-1 text-center">All</div>
               <div className="col-span-2 text-right">Status</div>
            </div>

            <div className="divide-y divide-slate-50">
               <AnimatePresence>
                  {mappedFolders.length > 0 ? (
                     mappedFolders.map((path, idx) => {
                       const perms = getFolderPermission(path);
                       const isFull = perms.read && perms.write && perms.delete && perms.upload && perms.download;
                       return (
                         <motion.div key={path} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.03 }} className="grid grid-cols-12 items-center px-8 py-5 hover:bg-blue-50/30 transition-colors group">
                            <div className="col-span-4 flex items-center gap-3 overflow-hidden">
                               <div className="p-2 bg-slate-100 text-slate-400 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-all"><HardDrive size={14} /></div>
                               <span className="text-[11px] font-mono font-bold text-slate-700 truncate">{path}</span>
                            </div>
                            <div className="col-span-1 flex justify-center"><button onClick={() => togglePermission(path, 'read')} className={`p-2 rounded-lg ${perms.read ? 'text-emerald-600 bg-emerald-50' : 'text-slate-300'}`}><Eye size={14} /></button></div>
                            <div className="col-span-1 flex justify-center"><button onClick={() => togglePermission(path, 'write')} className={`p-2 rounded-lg ${perms.write ? 'text-blue-600 bg-blue-50' : 'text-slate-300'}`}><Edit2 size={14} /></button></div>
                            <div className="col-span-1 flex justify-center"><button onClick={() => togglePermission(path, 'delete')} className={`p-2 rounded-lg ${perms.delete ? 'text-rose-600 bg-rose-50' : 'text-slate-300'}`}><Trash2 size={14} /></button></div>
                            <div className="col-span-1 flex justify-center"><button onClick={() => togglePermission(path, 'upload')} className={`p-2 rounded-lg ${perms.upload ? 'text-indigo-600 bg-indigo-50' : 'text-slate-300'}`}><Upload size={14} /></button></div>
                            <div className="col-span-1 flex justify-center"><button onClick={() => togglePermission(path, 'download')} className={`p-2 rounded-lg ${perms.download ? 'text-cyan-600 bg-cyan-50' : 'text-slate-300'}`}><Download size={14} /></button></div>
                            <div className="col-span-1 flex justify-center border-l border-slate-100 pl-2"><button onClick={() => handleSelectAllForFolder(path)} className={`p-2 rounded-lg transition-all ${isFull ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-300'}`}>{isFull ? <CheckSquare size={14} /> : <Square size={14} />}</button></div>
                            <div className="col-span-2 text-right"><span className={`text-[8px] font-black uppercase px-2 py-1 rounded-md ${perms.read ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'}`}>{perms.read ? 'Access Active' : 'Restricted'}</span></div>
                         </motion.div>
                       );
                     })
                  ) : (
                     <div className="flex flex-col items-center justify-center py-40 opacity-40">
                        <ShieldAlert size={60} className="text-slate-300 mb-4" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Chọn ít nhất một Group Mapping bên trái</p>
                     </div>
                  )}
               </AnimatePresence>
            </div>
         </div>
      </section>
    </div>
  );
};

export default FolderMapping;
