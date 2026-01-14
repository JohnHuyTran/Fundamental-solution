
import React, { useState } from 'react';
import { User, MenuItem, OverrideState } from '../../types';
import { INITIAL_USERS } from '../../constants';
import { Search, User as UserIcon, Shield, RefreshCcw, Check, X, Info, Zap } from 'lucide-react';

interface Props {
  menuData: MenuItem[];
}

const UserOverride: React.FC<Props> = ({ menuData }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [overrides, setOverrides] = useState<Record<string, OverrideState>>({});

  const filteredUsers = INITIAL_USERS.filter(u => 
    u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStyle = (state: OverrideState) => {
    switch (state) {
      case OverrideState.GRANT: return 'bg-emerald-500 text-white shadow-emerald-500/20';
      case OverrideState.DENY: return 'bg-rose-500 text-white shadow-rose-500/20';
      default: return 'bg-slate-100 text-slate-400';
    }
  };

  const renderItems = (items: MenuItem[], depth = 0) => {
    return items.map(item => {
      const state = overrides[item.id] || OverrideState.INHERIT;
      return (
        <React.Fragment key={item.id}>
          <div className="flex items-center p-4 border-b border-slate-50 hover:bg-blue-50/10 transition-all group">
            <div style={{ paddingLeft: `${depth * 32}px` }} className="flex-1 flex items-center gap-4">
               <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${state === OverrideState.INHERIT ? 'bg-slate-50 text-slate-300' : getStyle(state)}`}>
                  {state === OverrideState.GRANT ? <Check size={14} /> : state === OverrideState.DENY ? <X size={14} /> : <Info size={14} />}
               </div>
               <div className="flex flex-col">
                 <span className={`text-sm font-bold ${state === OverrideState.INHERIT ? 'text-slate-600' : 'text-slate-900 font-black'}`}>{item.label}</span>
                 <span className="text-[9px] font-mono text-slate-300 italic">{item.path}</span>
               </div>
            </div>
            <div className="flex items-center bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
               {[OverrideState.INHERIT, OverrideState.GRANT, OverrideState.DENY].map(s => (
                 <button key={s} onClick={() => setOverrides({...overrides, [item.id]: s})} className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${state === s ? getStyle(s) + ' shadow-lg scale-105' : 'text-slate-400 hover:text-slate-600'}`}>
                   {s}
                 </button>
               ))}
            </div>
          </div>
          {item.children && renderItems(item.children, depth + 1)}
        </React.Fragment>
      );
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-700 pb-20">
      <div className="lg:col-span-4 space-y-6">
         <div className="bg-white p-8 rounded-[3rem] shadow-2xl border border-blue-50">
            <h3 className="text-xl font-black text-slate-800 mb-6 uppercase tracking-tight">User Search</h3>
            <div className="relative mb-6 group">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500" size={18} />
               <input type="text" placeholder="Tìm kiếm nhân sự..." className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:bg-white focus:border-blue-500 outline-none font-bold text-sm transition-all" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
            <div className="space-y-2 max-h-[480px] overflow-y-auto pr-2 custom-scrollbar">
               {filteredUsers.map(u => (
                 <button key={u.id} onClick={() => setSelectedUser(u)} className={`w-full flex items-center gap-4 p-4 rounded-2xl text-left border-2 transition-all ${selectedUser?.id === u.id ? 'bg-blue-600 border-blue-600 text-white shadow-xl' : 'bg-slate-50 border-transparent hover:border-blue-100 text-slate-500'}`}>
                   <div className={`p-3 rounded-xl ${selectedUser?.id === u.id ? 'bg-white/20 text-white' : 'bg-white text-slate-400 shadow-sm'}`}><UserIcon size={18} /></div>
                   <div className="overflow-hidden"><p className="font-black text-sm truncate uppercase tracking-tighter leading-tight">{u.fullName}</p><p className="text-[10px] font-bold truncate opacity-60">@{u.username}</p></div>
                 </button>
               ))}
            </div>
         </div>
         {selectedUser && (
           <div className="bg-indigo-900 p-10 rounded-[3rem] shadow-2xl text-white relative overflow-hidden animate-in slide-in-from-bottom-4">
              <Zap className="absolute -right-8 -bottom-8 w-40 h-40 text-white/10 rotate-12" />
              <h4 className="text-lg font-black mb-4 flex items-center gap-3"><Shield size={20} className="text-indigo-400" /> Override Policy</h4>
              <p className="text-xs font-bold opacity-80 leading-relaxed mb-6">Mọi thiết lập ở đây sẽ ƯU TIÊN CAO NHẤT, ghi đè hoàn toàn quyền từ vai trò hệ thống.</p>
              <button onClick={() => setOverrides({})} className="flex items-center justify-center gap-3 w-full py-4 bg-white/10 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-indigo-900 transition-all border border-white/10 shadow-lg"><RefreshCcw size={14} /> Reset to Default</button>
           </div>
         )}
      </div>

      <div className="lg:col-span-8">
         {selectedUser ? (
           <div className="bg-white rounded-[3rem] shadow-2xl border border-blue-50 flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
              <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/40">
                 <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-blue-600 rounded-[1.5rem] flex items-center justify-center text-white text-2xl font-black shadow-xl rotate-3">{selectedUser.fullName.charAt(0)}</div>
                    <div><h4 className="text-2xl font-black text-slate-800 tracking-tight">{selectedUser.fullName}</h4><p className="text-xs font-bold text-slate-400">Custom Navigation Setup</p></div>
                 </div>
                 <button className="px-10 py-5 bg-blue-600 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-xl hover:-translate-y-1 transition-all">Lưu ghi đè</button>
              </div>
              <div className="flex-1 overflow-y-auto">
                 <div className="bg-slate-900 text-white flex items-center h-12 px-10 text-[10px] font-black uppercase tracking-[0.3em] sticky top-0 z-10"><span className="flex-1">Application Menus</span><span className="px-12 text-blue-400">Override State</span></div>
                 <div className="pb-10">{renderItems(menuData)}</div>
              </div>
           </div>
         ) : (
           <div className="h-full min-h-[600px] bg-white rounded-[3rem] border-4 border-dashed border-slate-100 flex flex-col items-center justify-center p-20 text-center text-slate-300">
              <UserIcon size={120} strokeWidth={1} />
              <h3 className="text-2xl font-black uppercase tracking-tighter mt-8">Chọn User để thiết lập quyền tùy chỉnh</h3>
           </div>
         )}
      </div>
    </div>
  );
};

export default UserOverride;
