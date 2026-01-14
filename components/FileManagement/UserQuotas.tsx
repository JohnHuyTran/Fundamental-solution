
import React, { useState } from 'react';
import { StorageQuota } from '../../types';
// Added Package to lucide-react imports
import { Users, User as UserIcon, Edit3, Settings2, Plus, Info, AlertCircle, Trash2, X, AlertTriangle, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props { 
  quotas: StorageQuota[];
  onRevoke: (id: string) => void;
}

const UserQuotas: React.FC<Props> = ({ quotas, onRevoke }) => {
  const [editingQuota, setEditingQuota] = useState<StorageQuota | null>(null);
  const [revokingQuotaId, setRevokingQuotaId] = useState<string | null>(null);

  const getProgressColor = (percent: number) => {
    if (percent >= 90) return 'bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.5)]';
    if (percent >= 70) return 'bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)]';
    return 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]';
  };

  const handleRevokeConfirm = (id: string) => {
    onRevoke(id);
    setRevokingQuotaId(null);
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="bg-white rounded-[3rem] shadow-2xl border border-blue-50 overflow-hidden relative">
        <div className="px-12 py-10 border-b border-blue-50 flex justify-between items-center bg-slate-50/40">
           <div>
              <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Hạn mức lưu trữ (Quotas)</h3>
              <p className="text-sm font-bold text-slate-400 mt-1 italic">Quản lý dung lượng tối đa cho từng cá nhân và bộ phận.</p>
           </div>
           <div className="flex gap-4">
              <div className="bg-blue-600 text-white p-4 rounded-2xl flex items-center gap-4 shadow-xl shadow-blue-500/20 ring-4 ring-blue-500/10">
                 <Settings2 size={20} />
                 <div>
                    <p className="text-[9px] font-black uppercase tracking-widest opacity-60">Default Global</p>
                    <p className="text-sm font-black">20 GB / User</p>
                 </div>
              </div>
              <button className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all flex items-center gap-3 shadow-xl active:scale-95 border-b-4 border-slate-950">
                 <Plus size={18} /> Gán mới
              </button>
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-900 text-white uppercase text-[10px] font-black tracking-widest">
                <th className="px-12 py-6">Đối tượng</th>
                <th className="px-12 py-6">Phân loại</th>
                <th className="px-12 py-6">Đã dùng / Tổng hạn mức</th>
                <th className="px-12 py-6 min-w-[300px]">Trạng thái sử dụng (%)</th>
                <th className="px-12 py-6 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {quotas.map(quota => {
                const percent = Math.round((quota.used / quota.limit) * 100);
                return (
                  <tr key={quota.id} className="hover:bg-blue-50/50 transition-colors group">
                    <td className="px-12 py-6">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl transition-all ${quota.type === 'User' ? 'bg-blue-50 text-blue-600' : 'bg-indigo-50 text-indigo-600'} group-hover:scale-110`}>
                           {quota.type === 'User' ? <UserIcon size={18} /> : <Users size={18} />}
                        </div>
                        <span className="font-black text-slate-800 text-lg tracking-tight group-hover:text-blue-900 transition-colors">{quota.targetName}</span>
                      </div>
                    </td>
                    <td className="px-12 py-6">
                       <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase border tracking-widest ${quota.type === 'User' ? 'bg-blue-50 text-blue-600 border-blue-200' : 'bg-indigo-50 text-indigo-600 border-indigo-200'}`}>
                          {quota.type}
                       </span>
                    </td>
                    <td className="px-12 py-6">
                       <div className="flex items-center gap-2">
                          <span className="font-black text-slate-800 text-xl">{quota.used}</span>
                          <span className="text-slate-300 font-bold">/</span>
                          <span className="font-black text-blue-600 text-xl">{quota.limit}</span>
                          <span className="text-[10px] font-black text-slate-400 uppercase ml-1">GB</span>
                       </div>
                    </td>
                    <td className="px-12 py-6">
                       <div className="space-y-2">
                          <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200 p-0.5">
                             <div 
                                className={`h-full rounded-full transition-all duration-1000 ${getProgressColor(percent)}`} 
                                style={{ width: `${percent}%` }}
                             />
                          </div>
                          <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                             <span className={percent >= 90 ? 'text-rose-500 font-black' : percent >= 70 ? 'text-amber-500' : 'text-slate-400'}>{percent}% Consumed</span>
                             {percent >= 90 && <span className="text-rose-500 animate-pulse flex items-center gap-1"><AlertCircle size={10} /> Critical Threshold</span>}
                          </div>
                       </div>
                    </td>
                    <td className="px-12 py-6 text-right">
                       <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                          <button 
                            onClick={() => setEditingQuota(quota)}
                            className="p-4 bg-white text-blue-500 hover:bg-blue-600 hover:text-white rounded-2xl shadow-sm border border-slate-100 hover:border-blue-700 transition-all"
                            title="Sửa hạn mức"
                          >
                             <Edit3 size={20} />
                          </button>
                          <button 
                            onClick={() => setRevokingQuotaId(quota.id)}
                            className="p-4 bg-white text-rose-500 hover:bg-rose-600 hover:text-white rounded-2xl shadow-sm border border-slate-100 hover:border-rose-700 transition-all"
                            title="Thu hồi hạn mức"
                          >
                             <Trash2 size={20} />
                          </button>
                       </div>
                    </td>
                  </tr>
                );
              })}
              {quotas.length === 0 && (
                <tr>
                   <td colSpan={5} className="py-20 text-center">
                      <div className="p-10 bg-slate-50 rounded-[3rem] text-slate-200 w-fit mx-auto mb-6"><Package size={120} /></div>
                      <h4 className="text-2xl font-black text-slate-300 uppercase">Chưa có hạn mức tùy chỉnh nào được thiết lập</h4>
                   </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Revoke Confirmation Dialog */}
      <AnimatePresence>
        {revokingQuotaId && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.9, opacity: 0 }} 
              className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden p-10"
            >
              <div className="w-20 h-20 bg-rose-100 text-rose-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-rose-100 animate-bounce">
                <AlertTriangle size={40} />
              </div>
              <h4 className="text-2xl font-black text-slate-800 text-center uppercase tracking-tight mb-4">Xác nhận Thu hồi?</h4>
              <p className="text-center text-slate-500 font-bold mb-10 leading-relaxed">
                Hành động này sẽ xóa bỏ hạn mức tùy chỉnh của đối tượng này và quay trở về <span className="text-blue-600">Hạn mức hệ thống (20GB)</span>. Dữ liệu hiện có sẽ không bị ảnh hưởng.
              </p>
              <div className="flex gap-4">
                <button 
                  onClick={() => setRevokingQuotaId(null)} 
                  className="flex-1 py-4 font-black text-xs uppercase text-slate-400 hover:bg-slate-50 rounded-2xl transition-all"
                >
                  Hủy bỏ
                </button>
                <button 
                  onClick={() => handleRevokeConfirm(revokingQuotaId)} 
                  className="flex-1 py-4 bg-rose-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-rose-200 hover:bg-rose-700 active:scale-95 transition-all"
                >
                  Thu hồi ngay
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Editing Modal Placeholder */}
      <AnimatePresence>
        {editingQuota && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
             <motion.div 
               initial={{ y: 20, opacity: 0 }} 
               animate={{ y: 0, opacity: 1 }} 
               exit={{ y: 20, opacity: 0 }} 
               className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-10 relative overflow-hidden"
             >
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                <div className="flex justify-between items-center mb-8">
                   <h4 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Điều chỉnh Hạn mức</h4>
                   <button onClick={() => setEditingQuota(null)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400"><X size={24} /></button>
                </div>
                <div className="space-y-6">
                   <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                      <label className="block text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Đối tượng mục tiêu</label>
                      <p className="font-black text-xl text-blue-900 flex items-center gap-2">
                        {editingQuota.type === 'User' ? <UserIcon size={18} /> : <Users size={18} />} {editingQuota.targetName}
                      </p>
                   </div>
                   <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Hạn mức mới (GB)</label>
                      <input 
                        type="number" 
                        defaultValue={editingQuota.limit}
                        autoFocus
                        className="w-full bg-slate-50 border-4 border-slate-50 rounded-2xl p-6 text-3xl font-black focus:border-blue-500 focus:bg-white outline-none transition-all shadow-inner text-blue-600"
                      />
                   </div>
                   <div className="pt-8 flex gap-4">
                      <button onClick={() => setEditingQuota(null)} className="flex-1 py-4 font-black text-xs uppercase text-slate-400 hover:text-slate-800 transition-colors">Hủy bỏ</button>
                      <button onClick={() => setEditingQuota(null)} className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all border-b-4 border-blue-900">Lưu thay đổi</button>
                   </div>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserQuotas;
