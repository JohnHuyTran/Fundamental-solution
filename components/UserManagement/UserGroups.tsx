
import React, { useState } from 'react';
import { UserGroup, User } from '../../types';
import { ChevronRight, ChevronDown, FolderTree, Users, Plus, Edit2, Trash2, Search, UserPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  groups: UserGroup[];
  users: User[];
}

const UserGroups: React.FC<Props> = ({ groups, users }) => {
  const [expanded, setExpanded] = useState<Set<string>>(new Set(['g1']));
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>('g1');

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newExpanded = new Set(expanded);
    if (newExpanded.has(id)) newExpanded.delete(id);
    else newExpanded.add(id);
    setExpanded(newExpanded);
  };

  const renderTree = (items: UserGroup[], depth = 0) => {
    return items.map(item => (
      <div key={item.id} className="select-none">
        <div 
          onClick={() => setSelectedGroupId(item.id)}
          className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${selectedGroupId === item.id ? 'bg-blue-600 text-white shadow-lg translate-x-2' : 'hover:bg-slate-50 text-slate-600'}`}
          style={{ marginLeft: `${depth * 24}px` }}
        >
          <button onClick={(e) => toggleExpand(item.id, e)} className="p-1 hover:bg-black/5 rounded">
            {item.children && item.children.length > 0 ? (
              expanded.has(item.id) ? <ChevronDown size={14} /> : <ChevronRight size={14} />
            ) : <div className="w-3.5" />}
          </button>
          <FolderTree size={16} className={selectedGroupId === item.id ? 'text-white' : 'text-blue-500'} />
          <div className="flex-1 overflow-hidden">
             <p className="text-xs font-black truncate">{item.name}</p>
             <p className={`text-[9px] font-bold uppercase ${selectedGroupId === item.id ? 'text-blue-100' : 'text-slate-400'}`}>{item.memberCount} members</p>
          </div>
        </div>
        <AnimatePresence>
          {expanded.has(item.id) && item.children && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
               {renderTree(item.children, depth + 1)}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    ));
  };

  const currentGroup = groups.find(g => g.id === selectedGroupId) || (groups[0]?.children?.find(g => g.id === selectedGroupId)) || null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[800px] animate-in fade-in duration-700">
      <aside className="lg:col-span-4 bg-white rounded-[3rem] shadow-2xl border border-blue-50 flex flex-col overflow-hidden">
        <div className="p-8 border-b border-slate-50 bg-slate-50/30 flex justify-between items-center">
           <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">Org Structure</h3>
           <button className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all"><Plus size={20} /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
           {renderTree(groups)}
        </div>
      </aside>

      <main className="lg:col-span-8 bg-white rounded-[3rem] shadow-2xl border border-blue-50 flex flex-col overflow-hidden">
         <div className="px-10 py-8 border-b border-slate-50 bg-slate-50/20 flex flex-wrap gap-6 items-center justify-between">
            <div>
               <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight">
                  {selectedGroupId ? "Department Management" : "Select a group"}
               </h3>
               <p className="text-xs font-bold text-slate-400 mt-1 italic">Manage hierarchical units and their associated staff members.</p>
            </div>
            <div className="flex gap-4">
               <button className="px-6 py-3 bg-slate-100 text-slate-600 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-slate-200 transition-all">
                  <Edit2 size={16} /> Rename
               </button>
               <button className="px-6 py-3 bg-rose-50 text-rose-500 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-rose-500 hover:text-white transition-all">
                  <Trash2 size={16} /> Delete Unit
               </button>
            </div>
         </div>

         <div className="flex-1 overflow-y-auto p-10">
            <div className="mb-10 p-8 bg-blue-50/50 rounded-[2.5rem] border border-blue-100 flex items-center justify-between">
               <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-blue-600 text-white rounded-[1.5rem] flex items-center justify-center shadow-xl shadow-blue-500/20">
                     <Users size={32} />
                  </div>
                  <div>
                     <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Unit Members</p>
                     <p className="text-2xl font-black text-slate-800">42 Personnel</p>
                  </div>
               </div>
               <button className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-500/30 hover:bg-blue-700 active:scale-95 transition-all flex items-center gap-3">
                  <UserPlus size={18} /> Add Member
               </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {users.slice(0, 4).map(u => (
                 <div key={u.id} className="p-6 bg-slate-50 border border-slate-100 rounded-3xl flex items-center justify-between group hover:border-blue-300 hover:bg-white transition-all">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-black">{u.fullName.charAt(0)}</div>
                       <div>
                          <p className="font-bold text-slate-800">{u.fullName}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">@{u.username}</p>
                       </div>
                    </div>
                    <button className="p-2 text-slate-300 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"><Trash2 size={16} /></button>
                 </div>
               ))}
            </div>
         </div>
      </main>
    </div>
  );
};

export default UserGroups;
