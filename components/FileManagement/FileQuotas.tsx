
import React from 'react';
import { StorageQuota } from '../../types';
import { ShieldCheck, User, Users, MoreHorizontal, Settings2 } from 'lucide-react';

interface FileQuotasProps {
  quotas: StorageQuota[];
}

const FileQuotas: React.FC<FileQuotasProps> = ({ quotas }) => {
  return (
    <div className="bg-white rounded-[2.5rem] shadow-2xl border border-blue-50 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="px-10 py-8 border-b border-blue-50 flex justify-between items-center bg-slate-50/30">
        <div>
          <h3 className="text-xl font-black text-blue-900 uppercase tracking-tight">Hạn mức lưu trữ</h3>
          <p className="text-slate-400 font-bold text-sm">Quản lý dung lượng cấp phát cho từng đối tượng.</p>
        </div>
        <button className="px-6 py-3 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-500/20 hover:-translate-y-1 transition-all">
          Thiết lập mặc định
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-blue-900 text-white">
              <th className="px-10 py-6 text-xs font-black uppercase tracking-widest">Đối tượng</th>
              <th className="px-10 py-6 text-xs font-black uppercase tracking-widest text-center">Loại</th>
              <th className="px-10 py-6 text-xs font-black uppercase tracking-widest">Đã dùng / Hạn mức</th>
              <th className="px-10 py-6 text-xs font-black uppercase tracking-widest">Tiến độ</th>
              <th className="px-10 py-6 text-xs font-black uppercase tracking-widest text-right">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {quotas.map(q => {
              const usagePercent = Math.round((q.used / q.limit) * 100);
              return (
                <tr key={q.id} className="hover:bg-blue-50/50 transition-colors group">
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${q.type === 'User' ? 'bg-blue-50 text-blue-600' : 'bg-indigo-50 text-indigo-600'}`}>
                        {q.type === 'User' ? <User size={18} /> : <Users size={18} />}
                      </div>
                      <span className="font-black text-slate-800">{q.targetName}</span>
                    </div>
                  </td>
                  <td className="px-10 py-6 text-center">
                    <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full border ${q.type === 'User' ? 'border-blue-200 text-blue-600' : 'border-indigo-200 text-indigo-600'}`}>
                      {q.type === 'User' ? 'Cá nhân' : 'Phòng ban'}
                    </span>
                  </td>
                  <td className="px-10 py-6">
                    <span className="font-bold text-slate-600">{q.used} GB</span>
                    <span className="text-slate-300 mx-2">/</span>
                    <span className="font-black text-blue-900">{q.limit} GB</span>
                  </td>
                  <td className="px-10 py-6 min-w-[200px]">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full ${usagePercent > 90 ? 'bg-rose-500' : usagePercent > 70 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${usagePercent}%` }}></div>
                      </div>
                      <span className="text-xs font-black text-slate-400">{usagePercent}%</span>
                    </div>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <button className="p-2 text-slate-300 hover:text-blue-600 hover:bg-white rounded-lg transition-all border border-transparent hover:border-blue-100">
                      <Settings2 size={18} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FileQuotas;
