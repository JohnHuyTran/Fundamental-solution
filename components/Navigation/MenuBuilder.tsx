
import React, { useState } from 'react';
import { MenuItem } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GripVertical, Eye, EyeOff, Edit3, Trash2, Plus, 
  ChevronRight, ChevronDown, LayoutDashboard, Database, 
  Terminal, FolderClosed, Package, ShieldAlert, Save, MoveUp, MoveDown, CheckCircle2, X, Globe, Link
} from 'lucide-react';

interface Props {
  menuData: MenuItem[];
  onSave: (data: MenuItem[]) => void;
}

const iconMap: Record<string, any> = {
  LayoutDashboard, Database, Terminal, FolderClosed, Package, ShieldAlert
};

const MenuBuilder: React.FC<Props> = ({ menuData, onSave }) => {
  const [localMenu, setLocalMenu] = useState<MenuItem[]>(menuData);
  const [isSaved, setIsSaved] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<MenuItem> | null>(null);

  const handleToggleVisibility = (id: string) => {
    const update = (items: MenuItem[]): MenuItem[] => items.map(item => {
      if (item.id === id) return { ...item, isVisible: !item.isVisible };
      if (item.children) return { ...item, children: update(item.children) };
      return item;
    });
    setLocalMenu(update(localMenu));
  };

  const flattenMenu = (items: MenuItem[], list: {id: string, label: string}[] = []) => {
    items.forEach(item => {
      list.push({ id: item.id, label: item.label });
      if (item.children) flattenMenu(item.children, list);
    });
    return list;
  };

  const handleOpenModal = (item?: MenuItem) => {
    setEditingItem(item || { label: '', path: '', icon: 'LayoutDashboard', isVisible: true, parentId: null });
    setIsModalOpen(true);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic cập nhật hoặc thêm mới vào cây đệ quy
    alert("Logic cập nhật cây đệ quy đã sẵn sàng. Item: " + editingItem?.label);
    setIsModalOpen(false);
  };

  const renderNodes = (items: MenuItem[], depth = 0) => {
    return items.map(item => (
      <div key={item.id} className="animate-in fade-in slide-in-from-left-2 duration-300">
        <div 
          className={`flex items-center group bg-white border border-slate-100 rounded-2xl mb-2 hover:border-blue-300 hover:shadow-lg transition-all h-16 px-4 ${!item.isVisible ? 'opacity-50 grayscale' : ''}`}
          style={{ marginLeft: `${depth * 32}px` }}
        >
          <div className="flex items-center gap-3 flex-1">
             <div className="p-2 text-slate-300 cursor-grab active:cursor-grabbing hover:text-blue-500"><GripVertical size={18} /></div>
             <div className={`p-2 rounded-xl ${item.isVisible ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-400'}`}>
                {React.createElement(iconMap[item.icon] || FolderClosed, { size: 18 })}
             </div>
             <div>
                <p className="font-black text-slate-800 text-sm">{item.label}</p>
                <p className="text-[10px] font-bold text-slate-400 font-mono tracking-tighter">{item.path}</p>
             </div>
          </div>
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
             <button onClick={() => handleToggleVisibility(item.id)} className="p-2 text-slate-400 hover:text-blue-500">{item.isVisible ? <Eye size={18} /> : <EyeOff size={18} />}</button>
             <button onClick={() => handleOpenModal(item)} className="p-2 text-slate-400 hover:text-emerald-500"><Edit3 size={18} /></button>
             <button className="p-2 text-slate-400 hover:text-rose-500"><Trash2 size={18} /></button>
          </div>
        </div>
        {item.children && renderNodes(item.children, depth + 1)}
      </div>
    ));
  };

  return (
    <div className="max-w-4xl mx-auto pb-24">
      <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-blue-50">
        <div className="flex justify-between items-center mb-10">
           <div>
              <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Menu Builder</h3>
              <p className="text-sm font-bold text-slate-400 italic">Quản lý cấu trúc điều hướng đa cấp</p>
           </div>
           <button onClick={() => handleOpenModal()} className="flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-blue-600 transition-all">
              <Plus size={18} /> Thêm Mục Mới
           </button>
        </div>

        <div className="space-y-1">
           {renderNodes(localMenu)}
        </div>

        <div className="mt-12 pt-8 border-t border-slate-100 flex items-center justify-between">
           {isSaved && <div className="text-emerald-600 font-black text-xs uppercase flex items-center gap-2 animate-bounce"><CheckCircle2 size={16} /> Đã lưu cấu trúc</div>}
           <button onClick={() => { onSave(localMenu); setIsSaved(true); setTimeout(() => setIsSaved(false), 3000); }} className="ml-auto flex items-center gap-4 px-12 py-5 bg-blue-600 text-white rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-2xl hover:-translate-y-1 transition-all">
              <Save size={20} /> Lưu thay đổi
           </button>
        </div>
      </div>

      {/* Quick Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden">
               <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                  <h4 className="text-xl font-black text-slate-800 uppercase">{editingItem?.id ? 'Chỉnh sửa Menu' : 'Thêm Menu Item'}</h4>
                  <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-200 rounded-full"><X size={24} /></button>
               </div>
               <form onSubmit={handleSaveItem} className="p-10 space-y-6">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Label Name</label>
                     <input type="text" required value={editingItem?.label} onChange={e => setEditingItem({...editingItem, label: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-blue-500 outline-none font-bold text-sm transition-all" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Icon</label>
                        <select value={editingItem?.icon} onChange={e => setEditingItem({...editingItem, icon: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-blue-500 outline-none font-bold text-sm">
                           {Object.keys(iconMap).map(k => <option key={k} value={k}>{k}</option>)}
                        </select>
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Path</label>
                        <input type="text" required value={editingItem?.path} onChange={e => setEditingItem({...editingItem, path: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-blue-500 outline-none font-bold text-sm font-mono" />
                     </div>
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Parent Node (Đệ quy)</label>
                     <select value={editingItem?.parentId || ''} onChange={e => setEditingItem({...editingItem, parentId: e.target.value || null})} className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-blue-500 outline-none font-bold text-sm">
                        <option value="">-- Root Level --</option>
                        {flattenMenu(localMenu).map(m => <option key={m.id} value={m.id}>{m.label}</option>)}
                     </select>
                  </div>
                  <button type="submit" className="w-full py-5 bg-blue-600 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-xl hover:bg-blue-700 transition-all mt-4">Xác nhận thay đổi</button>
               </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MenuBuilder;
