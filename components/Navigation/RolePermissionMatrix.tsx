
import React, { useState } from 'react';
import { RoleDefinition, MenuItem } from '../../types';
import { INITIAL_ROLES } from '../../constants';
import { Shield, ChevronRight, Check, Layers, CheckCircle2, Minus, Info, Save } from 'lucide-react';

interface Props {
  menuData: MenuItem[];
}

const RolePermissionMatrix: React.FC<Props> = ({ menuData }) => {
  const [selectedRole, setSelectedRole] = useState<RoleDefinition>(INITIAL_ROLES[0]);
  const [rolePermissions, setRolePermissions] = useState<Record<string, Set<string>>>({
    [INITIAL_ROLES[0].id]: new Set(['m1', 'm2', 'm2-1', 'm2-2', 'm3', 'm3-1', 'm3-2']),
    [INITIAL_ROLES[1].id]: new Set(['m1', 'm2', 'm2-1'])
  });
  const [isSaving, setIsSaving] = useState(false);

  const getSelectionState = (item: MenuItem, currentIds: Set<string>): 'checked' | 'unchecked' | 'indeterminate' => {
    if (!item.children || item.children.length === 0) {
      return currentIds.has(item.id) ? 'checked' : 'unchecked';
    }
    const childrenIds = item.children.map(c => c.id);
    const selectedChildren = childrenIds.filter(id => currentIds.has(id));
    
    if (selectedChildren.length === 0) return currentIds.has(item.id) ? 'checked' : 'unchecked';
    if (selectedChildren.length === childrenIds.length) return 'checked';
    return 'indeterminate';
  };

  const togglePermission = (menuId: string, children?: MenuItem[]) => {
    const currentPerms = new Set(rolePermissions[selectedRole.id]);
    const isAdding = !currentPerms.has(menuId);

    const applyToHierarchy = (id: string, childs?: MenuItem[]) => {
      if (isAdding) currentPerms.add(id);
      else currentPerms.delete(id);
      childs?.forEach(c => applyToHierarchy(c.id, c.children));
    };

    applyToHierarchy(menuId, children);
    setRolePermissions(prev => ({ ...prev, [selectedRole.id]: currentPerms }));
  };

  const renderMatrixNode = (item: MenuItem, depth: number) => {
    const state = getSelectionState(item, rolePermissions[selectedRole.id] || new Set());
    
    return (
      <React.Fragment key={item.id}>
        <div 
          onClick={() => togglePermission(item.id, item.children)}
          className={`flex items-center h-14 border-b border-slate-50 transition-all hover:bg-blue-50/30 cursor-pointer group ${state === 'checked' ? 'bg-blue-50/5' : ''}`}
        >
          <div style={{ paddingLeft: `${depth * 32 + 24}px` }} className="flex items-center gap-4 flex-1">
             <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${state === 'checked' ? 'bg-blue-600 border-blue-600 text-white shadow-lg' : state === 'indeterminate' ? 'bg-amber-500 border-amber-500 text-white shadow-lg' : 'bg-white border-slate-200 group-hover:border-blue-400'}`}>
                {state === 'checked' && <Check size={14} strokeWidth={4} />}
                {state === 'indeterminate' && <Minus size={14} strokeWidth={4} />}
             </div>
             <span className={`text-sm font-bold transition-colors ${state !== 'unchecked' ? 'text-blue-900' : 'text-slate-500'}`}>{item.label}</span>
          </div>
          <div className="px-8 flex items-center gap-2">
             <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{item.path}</span>
          </div>
        </div>
        {item.children?.map(child => renderMatrixNode(child, depth + 1))}
      </React.Fragment>
    );
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert("Cập nhật Cache thành công! Mọi thay đổi về phân quyền menu đã được đồng bộ toàn hệ thống.");
    }, 1500);
  };

  return (
    <div className="flex gap-8 h-[750px] animate-in fade-in duration-700">
      <aside className="w-80 bg-white rounded-[2.5rem] shadow-2xl border border-blue-50 overflow-hidden flex flex-col">
         <div className="p-8 border-b border-slate-50 bg-slate-50/50">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Access Roles</h4>
            <h3 className="text-xl font-black text-slate-800 tracking-tighter uppercase leading-none">Phân quyền Menu</h3>
         </div>
         <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {INITIAL_ROLES.map(role => (
              <button key={role.id} onClick={() => setSelectedRole(role)} className={`w-full flex items-center gap-4 p-5 rounded-2xl text-left transition-all ${selectedRole.id === role.id ? 'bg-slate-900 text-white shadow-2xl translate-x-2' : 'hover:bg-blue-50 text-slate-500'}`}>
                <div className={`p-2 rounded-xl ${selectedRole.id === role.id ? 'bg-blue-600' : 'bg-slate-100'}`}><Shield size={18} /></div>
                <div><p className="font-black text-sm uppercase tracking-tight">{role.name}</p><p className="text-[10px] opacity-60 font-bold">{role.code}</p></div>
              </button>
            ))}
         </div>
      </aside>

      <main className="flex-1 bg-white rounded-[3rem] shadow-2xl border border-blue-50 flex flex-col overflow-hidden">
         <div className="px-10 py-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
            <div className="flex items-center gap-5">
               <div className="p-4 bg-white rounded-2xl shadow-sm text-blue-600"><Layers size={24} /></div>
               <div>
                  <h4 className="text-2xl font-black text-slate-800 tracking-tighter uppercase">Permission Matrix</h4>
                  <p className="text-xs font-bold text-slate-400 italic">Cấu hình: <span className="text-blue-600 font-black">{selectedRole.name}</span></p>
               </div>
            </div>
            <button onClick={handleSave} disabled={isSaving} className="px-10 py-4 bg-blue-600 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-2xl shadow-blue-500/20 active:scale-95 transition-all flex items-center gap-3">
               {isSaving ? 'Đang cập nhật...' : <><CheckCircle2 size={18} /> Lưu cấu hình</>}
            </button>
         </div>
         <div className="flex-1 overflow-y-auto">
            <div className="bg-slate-900 text-white flex items-center h-12 px-10 text-[10px] font-black uppercase tracking-[0.3em] sticky top-0 z-10">
               <span className="flex-1">Navigation Hierarchy</span>
               <span className="px-10 text-blue-400">Access Control</span>
            </div>
            <div className="divide-y divide-slate-50 pb-10">
               {menuData.map(item => renderMatrixNode(item, 0))}
            </div>
         </div>
         <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-center gap-8">
            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-600 rounded-sm" /> <span className="text-[9px] font-black uppercase text-slate-500">Toàn quyền</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-amber-500 rounded-sm" /> <span className="text-[9px] font-black uppercase text-slate-500">Phần quyền (Indeterminate)</span></div>
            <div className="flex items-center gap-2 ml-4 px-4 py-1.5 bg-blue-50 rounded-full"><Info size={12} className="text-blue-500" /><span className="text-[9px] font-bold text-blue-700 italic">Chọn menu cha tự động tích tất cả menu con</span></div>
         </div>
      </main>
    </div>
  );
};

export default RolePermissionMatrix;
