
import React, { useState, useMemo } from 'react';
import { UserGroup, User } from '../../types';
import { 
  ChevronRight, ChevronDown, FolderTree, Users, Plus, Edit2, 
  Trash2, Search, UserPlus, Crown, MousePointer2, Move, 
  CheckCircle2, X, Square, CheckSquare, ShieldCheck 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  groups: UserGroup[];
  users: User[];
}

const UserGroups: React.FC<Props> = ({ groups: initialGroups, users }) => {
  const [groups, setGroups] = useState<UserGroup[]>(initialGroups);
  const [expanded, setExpanded] = useState<Set<string>>(new Set(['g1']));
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>('g1');
  const [draggedUserId, setDraggedUserId] = useState<string | null>(null);
  const [batchSelectedIds, setBatchSelectedIds] = useState<Set<string>>(new Set());
  const [poolSearch, setPoolSearch] = useState('');

  // Lấy nhóm hiện tại đang chọn
  const findGroup = (items: UserGroup[], id: string): UserGroup | null => {
    for (const item of items) {
      if (item.id === id) return item;
      if (item.children) {
        const found = findGroup(item.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const currentGroup = useMemo(() => {
    return selectedGroupId ? findGroup(groups, selectedGroupId) : null;
  }, [selectedGroupId, groups]);

  // Thành viên thực tế của nhóm hiện tại
  const groupMembers = useMemo(() => {
    if (!currentGroup) return [];
    return users.filter(u => currentGroup.memberIds.includes(u.id));
  }, [currentGroup, users]);

  // Nhân sự chưa thuộc nhóm hiện tại (Pool)
  const poolUsers = useMemo(() => {
    if (!currentGroup) return users;
    return users.filter(u => 
      !currentGroup.memberIds.includes(u.id) &&
      u.fullName.toLowerCase().includes(poolSearch.toLowerCase())
    );
  }, [currentGroup, users, poolSearch]);

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newExpanded = new Set(expanded);
    if (newExpanded.has(id)) newExpanded.delete(id);
    else newExpanded.add(id);
    setExpanded(newExpanded);
  };

  // Logic gán nhân sự vào nhóm
  const moveUserToGroup = (userId: string, targetGroupId: string) => {
    const updateGroupsRecursive = (items: UserGroup[]): UserGroup[] => {
      return items.map(g => {
        let newMemberIds = [...g.memberIds];
        if (g.id === targetGroupId) {
          if (!newMemberIds.includes(userId)) {
            newMemberIds.push(userId);
          }
        }
        return {
          ...g,
          memberIds: newMemberIds,
          memberCount: newMemberIds.length,
          children: g.children ? updateGroupsRecursive(g.children) : undefined
        };
      });
    };
    setGroups(updateGroupsRecursive(groups));
  };

  const assignManager = (groupId: string, userId: string) => {
    const updateGroupsRecursive = (items: UserGroup[]): UserGroup[] => {
      return items.map(g => ({
        ...g,
        managerId: g.id === groupId ? userId : g.managerId,
        children: g.children ? updateGroupsRecursive(g.children) : undefined
      }));
    };
    setGroups(updateGroupsRecursive(groups));
  };

  const removeMember = (groupId: string, userId: string) => {
    const updateGroupsRecursive = (items: UserGroup[]): UserGroup[] => {
      return items.map(g => {
        let newMemberIds = g.memberIds.filter(id => id !== userId);
        return {
          ...g,
          memberIds: g.id === groupId ? newMemberIds : g.memberIds,
          managerId: (g.id === groupId && g.managerId === userId) ? null : g.managerId,
          memberCount: g.id === groupId ? newMemberIds.length : g.memberCount,
          children: g.children ? updateGroupsRecursive(g.children) : undefined
        };
      });
    };
    setGroups(updateGroupsRecursive(groups));
  };

  const handleBatchAdd = () => {
    if (!selectedGroupId) return;
    batchSelectedIds.forEach(id => moveUserToGroup(id, selectedGroupId));
    setBatchSelectedIds(new Set());
  };

  const toggleBatchSelect = (userId: string) => {
    const next = new Set(batchSelectedIds);
    if (next.has(userId)) next.delete(userId);
    else next.add(userId);
    setBatchSelectedIds(next);
  };

  const renderTree = (items: UserGroup[], depth = 0) => {
    return items.map(item => {
      const isSelected = selectedGroupId === item.id;
      return (
        <div 
          key={item.id} 
          className="select-none"
          onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('bg-blue-100/50'); }}
          onDragLeave={(e) => e.currentTarget.classList.remove('bg-blue-100/50')}
          onDrop={(e) => {
            e.preventDefault();
            e.currentTarget.classList.remove('bg-blue-100/50');
            if (draggedUserId) moveUserToGroup(draggedUserId, item.id);
          }}
        >
          <div 
            onClick={() => setSelectedGroupId(item.id)}
            className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border-2 ${isSelected ? 'bg-blue-600 border-blue-400 text-white shadow-lg' : 'hover:bg-slate-50 border-transparent text-slate-600'}`}
            style={{ marginLeft: `${depth * 20}px` }}
          >
            <button onClick={(e) => toggleExpand(item.id, e)} className="p-1 hover:bg-black/5 rounded">
              {item.children && item.children.length > 0 ? (
                expanded.has(item.id) ? <ChevronDown size={14} /> : <ChevronRight size={14} />
              ) : <div className="w-3.5" />}
            </button>
            <FolderTree size={16} className={isSelected ? 'text-white' : 'text-blue-500'} />
            <div className="flex-1 overflow-hidden">
               <p className="text-[11px] font-black uppercase truncate tracking-tight">{item.name}</p>
               <p className={`text-[9px] font-bold ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>{item.memberCount} Staff</p>
            </div>
            {item.managerId && <Crown size={12} className={isSelected ? 'text-amber-300' : 'text-amber-500'} />}
          </div>
          <AnimatePresence>
            {expanded.has(item.id) && item.children && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                 {renderTree(item.children, depth + 1)}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      );
    });
  };

  return (
    <div className="flex flex-col xl:flex-row gap-8 h-[850px] animate-in fade-in duration-700">
      
      {/* COLUMN 1: ORG TREE */}
      <aside className="w-full xl:w-72 bg-white rounded-[2.5rem] shadow-2xl border border-blue-50 flex flex-col overflow-hidden">
        <div className="p-6 border-b border-slate-50 bg-slate-50/30 flex justify-between items-center">
           <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Org Structure</h3>
           <button className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all"><Plus size={18} /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
           {renderTree(groups)}
        </div>
      </aside>

      {/* COLUMN 2: CURRENT GROUP MEMBERS & MANAGER */}
      <main className="flex-1 bg-white rounded-[3rem] shadow-2xl border border-blue-50 flex flex-col overflow-hidden relative">
         <div className="px-10 py-8 border-b border-slate-50 bg-slate-50/20 flex items-center justify-between">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-500/20">
                  <ShieldCheck size={28} />
               </div>
               <div>
                  <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">{currentGroup?.name || "Select Group"}</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">{currentGroup?.description || "Pick a node to manage"}</p>
               </div>
            </div>
         </div>

         <div className="flex-1 overflow-y-auto p-10">
            {currentGroup ? (
              <>
                {/* Manager Section */}
                <div className="mb-10">
                   <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Unit Manager</h4>
                   {currentGroup.managerId ? (
                     <div className="p-6 bg-gradient-to-r from-blue-900 to-indigo-950 rounded-[2rem] text-white flex items-center justify-between shadow-2xl relative overflow-hidden">
                        <Crown className="absolute -right-4 -bottom-4 text-white/5 w-24 h-24 rotate-12" />
                        <div className="flex items-center gap-4">
                           <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center text-2xl font-black border border-white/20">
                              {users.find(u => u.id === currentGroup.managerId)?.fullName.charAt(0)}
                           </div>
                           <div>
                              <p className="text-lg font-black">{users.find(u => u.id === currentGroup.managerId)?.fullName}</p>
                              <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Group Head / Approver</p>
                           </div>
                        </div>
                        <button 
                          onClick={() => assignManager(currentGroup.id, '')}
                          className="px-6 py-2 bg-white/10 hover:bg-rose-500 rounded-xl text-[10px] font-black uppercase transition-all border border-white/10"
                        >
                           Dismiss
                        </button>
                     </div>
                   ) : (
                     <div className="p-8 border-2 border-dashed border-slate-100 rounded-[2rem] text-center">
                        <p className="text-xs font-bold text-slate-400">Chưa có người quản lý. Hãy chọn một thành viên bên dưới.</p>
                     </div>
                   )}
                </div>

                {/* Member List */}
                <div>
                   <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Personnel in {currentGroup.name}</h4>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {groupMembers.map(u => (
                        <div key={u.id} className="p-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] flex items-center justify-between group hover:border-blue-400 hover:bg-white transition-all shadow-sm">
                           <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-black">
                                 {u.fullName.charAt(0)}
                              </div>
                              <div>
                                 <p className="text-sm font-black text-slate-700">{u.fullName}</p>
                                 <p className="text-[10px] font-bold text-slate-400 uppercase">@{u.username}</p>
                              </div>
                           </div>
                           <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                              {currentGroup.managerId !== u.id && (
                                <button 
                                  onClick={() => assignManager(currentGroup.id, u.id)}
                                  className="p-2 text-amber-500 hover:bg-amber-50 rounded-lg transition-colors"
                                  title="Gán làm trưởng nhóm"
                                >
                                   <Crown size={16} />
                                </button>
                              )}
                              <button 
                                onClick={() => removeMember(currentGroup.id, u.id)}
                                className="p-2 text-rose-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                title="Xóa khỏi nhóm"
                              >
                                 <Trash2 size={16} />
                              </button>
                           </div>
                        </div>
                      ))}
                      {groupMembers.length === 0 && (
                        <div className="col-span-2 py-20 text-center opacity-30 flex flex-col items-center">
                           <MousePointer2 size={48} className="animate-bounce" />
                           <p className="text-xs font-black uppercase tracking-widest mt-4">Kéo nhân sự từ bên phải vào đây</p>
                        </div>
                      )}
                   </div>
                </div>
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-300 opacity-40">
                 <FolderTree size={120} strokeWidth={1} />
                 <h4 className="text-2xl font-black uppercase mt-8">Chọn một bộ phận để quản lý</h4>
              </div>
            )}
         </div>
      </main>

      {/* COLUMN 3: PERSONNEL POOL & BATCH ACTION */}
      <aside className="w-full xl:w-80 bg-slate-900 rounded-[2.5rem] shadow-2xl border border-white/5 flex flex-col overflow-hidden relative">
         <div className="p-8 border-b border-white/5 bg-white/5">
            <h3 className="text-xs font-black text-blue-400 uppercase tracking-widest mb-4 flex items-center gap-2"><Users size={16} /> Personnel Pool</h3>
            <div className="relative group">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
               <input 
                 type="text" 
                 placeholder="Search all..." 
                 className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl outline-none text-white font-bold text-xs focus:border-blue-500 transition-all"
                 value={poolSearch}
                 onChange={e => setPoolSearch(e.target.value)}
               />
            </div>
         </div>

         <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
            {poolUsers.map(u => {
              const isSelected = batchSelectedIds.has(u.id);
              return (
                <div 
                  key={u.id}
                  draggable="true"
                  onDragStart={(e) => setDraggedUserId(u.id)}
                  onDragEnd={() => setDraggedUserId(null)}
                  className={`p-4 rounded-2xl border-2 flex items-center justify-between cursor-grab active:cursor-grabbing transition-all ${isSelected ? 'bg-blue-600 border-blue-400 text-white' : 'bg-white/5 border-transparent text-slate-400 hover:bg-white/10 hover:text-white'}`}
                >
                   <div className="flex items-center gap-3">
                      <button onClick={() => toggleBatchSelect(u.id)} className="hover:scale-110 transition-transform">
                         {isSelected ? <CheckSquare size={16} className="text-white" /> : <Square size={16} className="text-slate-600" />}
                      </button>
                      <div className="overflow-hidden">
                        <p className="text-xs font-black truncate tracking-tighter uppercase leading-tight">{u.fullName}</p>
                        <p className="text-[9px] font-bold opacity-40 truncate">{u.department}</p>
                      </div>
                   </div>
                   <Move size={14} className="opacity-20" />
                </div>
              );
            })}
         </div>

         {/* Batch Action Footer */}
         <AnimatePresence>
            {batchSelectedIds.size > 0 && (
              <motion.div 
                initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }}
                className="p-6 bg-blue-600 text-white border-t border-blue-400"
              >
                 <div className="flex items-center justify-between mb-4">
                    <p className="text-[10px] font-black uppercase tracking-widest">{batchSelectedIds.size} Selected</p>
                    <button onClick={() => setBatchSelectedIds(new Set())} className="p-1 hover:bg-white/10 rounded"><X size={16} /></button>
                 </div>
                 <button 
                  onClick={handleBatchAdd}
                  disabled={!selectedGroupId}
                  className="w-full py-3 bg-white text-blue-600 rounded-xl font-black text-xs uppercase tracking-widest shadow-xl disabled:opacity-50 flex items-center justify-center gap-2"
                 >
                    <UserPlus size={16} /> Batch Add to Group
                 </button>
              </motion.div>
            )}
         </AnimatePresence>
      </aside>
    </div>
  );
};

export default UserGroups;
