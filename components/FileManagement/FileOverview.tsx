
import React from 'react';
import { StorageConfig } from '../../types';
import { HardDrive, Cloud, AlertCircle, CheckCircle2, Database, Zap } from 'lucide-react';

interface FileOverviewProps {
  configs: StorageConfig[];
}

const FileOverview: React.FC<FileOverviewProps> = ({ configs }) => {
  const totalUsed = configs.reduce((acc, curr) => acc + curr.usage, 0);
  const totalCapacity = 10000; // Mock 10TB total
  const usagePercent = Math.round((totalUsed / totalCapacity) * 100);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Big Capacity Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-10 shadow-2xl border border-blue-50 relative overflow-hidden flex flex-col md:flex-row items-center gap-12">
          <div className="relative w-48 h-48 flex items-center justify-center">
             <svg className="w-full h-full transform -rotate-90">
                <circle cx="96" cy="96" r="88" fill="transparent" stroke="#f1f5f9" strokeWidth="16" />
                <circle cx="96" cy="96" r="88" fill="transparent" stroke="#2563eb" strokeWidth="16" strokeDasharray={552} strokeDashoffset={552 - (552 * usagePercent) / 100} strokeLinecap="round" className="transition-all duration-1000" />
             </svg>
             <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-black text-blue-900">{usagePercent}%</span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Đã dùng</span>
             </div>
          </div>
          <div className="flex-1">
             <h3 className="text-2xl font-black text-blue-900 mb-2 uppercase tracking-tight">Tình trạng lưu trữ</h3>
             <p className="text-slate-500 font-bold mb-6">Hệ thống đang hoạt động với hiệu suất tối ưu trên đa nền tảng.</p>
             <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-2xl">
                   <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Tổng dung lượng</p>
                   <p className="text-xl font-black text-blue-900">10.0 TB</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Đã sử dụng</p>
                   <p className="text-xl font-black text-slate-800">{(totalUsed/1024).toFixed(1)} TB</p>
                </div>
             </div>
          </div>
        </div>

        <div className="bg-indigo-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
           <Zap className="absolute -right-8 -top-8 text-white/10 w-48 h-48 rotate-12" />
           <h3 className="text-xl font-black mb-6 flex items-center gap-2">
              <Database size={20} className="text-indigo-300" /> Storage Health
           </h3>
           <div className="space-y-4">
              {configs.map(cfg => (
                <div key={cfg.name} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                   <div className="flex items-center gap-3">
                      {cfg.status === 'Connected' ? <CheckCircle2 size={18} className="text-emerald-400" /> : <AlertCircle size={18} className="text-rose-400" />}
                      <span className="font-bold text-sm">{cfg.name}</span>
                   </div>
                   <span className={`text-[10px] font-black uppercase px-2 py-1 rounded ${cfg.status === 'Connected' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'}`}>
                      {cfg.status}
                   </span>
                </div>
              ))}
           </div>
        </div>
      </div>

      {/* Usage Breakdown */}
      <div className="bg-white rounded-[2.5rem] p-10 shadow-2xl border border-blue-50">
         <h3 className="text-xl font-black text-blue-900 mb-8 uppercase tracking-widest flex items-center gap-3">
            <HardDrive size={24} className="text-blue-500" /> Chi tiết phân bổ dữ liệu
         </h3>
         <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { label: 'Images', icon: '🖼️', size: '1.2 TB', color: 'bg-amber-500' },
              { label: 'Documents', icon: '📄', size: '2.8 TB', color: 'bg-blue-500' },
              { label: 'Archives', icon: '📦', size: '0.5 TB', color: 'bg-indigo-500' },
              { label: 'System', icon: '⚙️', size: '0.15 TB', color: 'bg-slate-500' },
            ].map(item => (
              <div key={item.label} className="p-6 rounded-3xl bg-slate-50 border border-slate-100 group hover:border-blue-200 transition-all cursor-default">
                 <div className="text-3xl mb-4">{item.icon}</div>
                 <p className="text-xs font-black text-slate-400 uppercase mb-1">{item.label}</p>
                 <p className="text-xl font-black text-slate-800">{item.size}</p>
                 <div className="mt-4 h-1 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div className={`h-full ${item.color}`} style={{ width: '40%' }}></div>
                 </div>
              </div>
            ))}
         </div>
      </div>
    </div>
  );
};

export default FileOverview;
