
import React, { useState } from 'react';
import { StorageStats, StorageQuota } from '../../types';
import { INITIAL_QUOTAS } from '../../constants';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip, RadialBarChart, RadialBar, Legend } from 'recharts';
import { Users, AlertCircle, CheckCircle2, AlertTriangle, ChevronDown, User as UserIcon, Cloud, Zap, HardDrive } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props { stats: StorageStats }

const StorageOverview: React.FC<Props> = ({ stats }) => {
  const [filterType, setFilterType] = useState<'normal' | 'warning' | 'critical' | null>(null);

  const userQuotas = INITIAL_QUOTAS.filter(q => q.type === 'User');
  const normalUsers = userQuotas.filter(q => (q.used / q.limit) < 0.7);
  const warningUsers = userQuotas.filter(q => (q.used / q.limit) >= 0.7 && (q.used / q.limit) < 0.9);
  const criticalUsers = userQuotas.filter(q => (q.used / q.limit) >= 0.9);

  const activeList = filterType === 'normal' ? normalUsers : filterType === 'warning' ? warningUsers : filterType === 'critical' ? criticalUsers : [];

  const pieData = [
    { name: 'Đã dùng', value: stats.used, color: '#3b82f6' },
    { name: 'Còn trống', value: stats.free, color: '#e2e8f0' }
  ];

  // Dữ liệu cho biểu đồ AWS (Yêu cầu 4)
  const awsPercent = Math.round((stats.awsUsed / stats.awsLimit) * 100);
  const awsRadialData = [
    { name: 'AWS S3 Usage', value: awsPercent, fill: awsPercent > 80 ? '#ef4444' : '#f59e0b' }
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* 1. Storage Backend Status Rows (Yêu cầu 4) */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
         <div className="bg-indigo-950 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden flex items-center justify-between">
            <div className="relative z-10">
               <div className="flex items-center gap-3 mb-4">
                  <Cloud className="text-amber-400" size={32} />
                  <h3 className="text-2xl font-black uppercase tracking-tight">AWS Infrastructure</h3>
               </div>
               <p className="text-4xl font-black mb-2">{stats.awsUsed} <span className="text-xl opacity-40">/ {stats.awsLimit} GB</span></p>
               <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${awsPercent > 80 ? 'bg-rose-500' : 'bg-amber-500'}`}>
                    {awsPercent > 80 ? 'Critical: Sắp đầy' : 'Healthy: Đang dùng'}
                  </span>
                  <span className="text-xs font-bold opacity-60">{awsPercent}% Capacity</span>
               </div>
            </div>
            <div className="w-32 h-32 relative">
               <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart cx="50%" cy="50%" innerRadius="70%" outerRadius="100%" barSize={10} data={awsRadialData} startAngle={90} endAngle={90 + (360 * awsPercent / 100)}>
                     <RadialBar background dataKey="value" cornerRadius={10} />
                  </RadialBarChart>
               </ResponsiveContainer>
               <div className="absolute inset-0 flex items-center justify-center font-black text-xl">{awsPercent}%</div>
            </div>
         </div>

         <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-blue-50 flex items-center gap-6">
            <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center shadow-inner"><HardDrive size={32} /></div>
            <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Local Storage Node</p>
               <p className="text-2xl font-black text-slate-800">1,200 GB Used</p>
               <div className="w-full h-1.5 bg-slate-100 rounded-full mt-3">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '45%' }} />
               </div>
            </div>
         </div>

         <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-blue-50 flex items-center gap-6">
            <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center shadow-inner"><Zap size={32} /></div>
            <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">GCP HK Region</p>
               <p className="text-2xl font-black text-slate-800">500 GB Used</p>
               <div className="w-full h-1.5 bg-slate-100 rounded-full mt-3">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '25%' }} />
               </div>
            </div>
         </div>
      </div>

      {/* 2. Cụm Thống kê Trạng thái Người dùng */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-blue-50 flex items-center gap-5">
          <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl"><Users size={24} /></div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tổng User</p>
            <p className="text-2xl font-black text-slate-800">{userQuotas.length}</p>
          </div>
        </div>

        <button 
          onClick={() => setFilterType(filterType === 'normal' ? null : 'normal')}
          className={`p-8 rounded-[2.5rem] shadow-xl border transition-all flex items-center gap-5 ${filterType === 'normal' ? 'bg-emerald-600 border-emerald-600 text-white shadow-emerald-500/20' : 'bg-white border-blue-50 hover:border-emerald-200'}`}
        >
          <div className={`p-4 rounded-2xl ${filterType === 'normal' ? 'bg-white/20' : 'bg-emerald-50 text-emerald-600'}`}><CheckCircle2 size={24} /></div>
          <div className="text-left">
            <p className={`text-[10px] font-black uppercase tracking-widest ${filterType === 'normal' ? 'text-emerald-100' : 'text-slate-400'}`}>Bình thường</p>
            <p className="text-2xl font-black">{normalUsers.length}</p>
          </div>
        </button>

        <button 
          onClick={() => setFilterType(filterType === 'warning' ? null : 'warning')}
          className={`p-8 rounded-[2.5rem] shadow-xl border transition-all flex items-center gap-5 ${filterType === 'warning' ? 'bg-amber-500 border-amber-500 text-white shadow-amber-500/20' : 'bg-white border-blue-50 hover:border-amber-200'}`}
        >
          <div className={`p-4 rounded-2xl ${filterType === 'warning' ? 'bg-white/20' : 'bg-amber-50 text-amber-600'}`}><AlertTriangle size={24} /></div>
          <div className="text-left">
            <p className={`text-[10px] font-black uppercase tracking-widest ${filterType === 'warning' ? 'text-amber-100' : 'text-slate-400'}`}>Sắp đầy (70%)</p>
            <p className="text-2xl font-black">{warningUsers.length}</p>
          </div>
        </button>

        <button 
          onClick={() => setFilterType(filterType === 'critical' ? null : 'critical')}
          className={`p-8 rounded-[2.5rem] shadow-xl border transition-all flex items-center gap-5 ${filterType === 'critical' ? 'bg-rose-600 border-rose-600 text-white shadow-rose-500/20' : 'bg-white border-blue-50 hover:border-rose-200'}`}
        >
          <div className={`p-4 rounded-2xl ${filterType === 'critical' ? 'bg-white/20' : 'bg-rose-50 text-rose-600'}`}><AlertCircle size={24} /></div>
          <div className="text-left">
            <p className={`text-[10px] font-black uppercase tracking-widest ${filterType === 'critical' ? 'text-rose-100' : 'text-slate-400'}`}>Đầy (>90%)</p>
            <p className="text-2xl font-black">{criticalUsers.length}</p>
          </div>
        </button>
      </div>

      <AnimatePresence>
        {filterType && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-white rounded-[2.5rem] shadow-2xl border border-blue-100 p-8"
          >
            <div className="flex justify-between items-center mb-6">
               <h4 className="text-lg font-black text-slate-800 uppercase tracking-tight flex items-center gap-2">
                  <ChevronDown className="text-blue-600" /> Danh sách người dùng: 
                  <span className={`px-3 py-1 rounded-lg text-xs ${filterType === 'normal' ? 'bg-emerald-100 text-emerald-700' : filterType === 'warning' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'}`}>
                    {filterType === 'normal' ? 'Bình thường' : filterType === 'warning' ? 'Sắp đầy' : 'Đầy'}
                  </span>
               </h4>
               <button onClick={() => setFilterType(null)} className="text-[10px] font-black uppercase text-slate-400 hover:text-blue-600">Đóng danh sách</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
               {activeList.map(u => (
                 <div key={u.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-blue-200 transition-all">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm border border-slate-100"><UserIcon size={18} /></div>
                       <div>
                          <p className="text-sm font-black text-slate-700">{u.targetName}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{u.used}GB / {u.limit}GB</p>
                       </div>
                    </div>
                    <div className="w-12 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                       <div className={`h-full ${filterType === 'normal' ? 'bg-emerald-500' : filterType === 'warning' ? 'bg-amber-500' : 'bg-rose-500'}`} style={{ width: `${Math.round((u.used/u.limit)*100)}%` }} />
                    </div>
                 </div>
               ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-blue-50">
           <h3 className="text-xl font-black text-slate-800 mb-8 uppercase tracking-tight flex items-center gap-3">
             <div className="w-2 h-8 bg-blue-600 rounded-full"></div> Phân bổ dung lượng (GB)
           </h3>
           <div className="h-[300px]">
             <ResponsiveContainer width="100%" height="100%">
               <PieChart>
                 <Pie data={pieData} innerRadius={80} outerRadius={110} paddingAngle={5} dataKey="value">
                   {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                 </Pie>
                 <ReTooltip />
               </PieChart>
             </ResponsiveContainer>
             <div className="flex justify-center gap-8 -mt-10">
                {pieData.map(d => (
                  <div key={d.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }}></div>
                    <span className="text-xs font-black text-slate-500 uppercase">{d.name}: {d.value}GB</span>
                  </div>
                ))}
             </div>
           </div>
        </div>

        <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-blue-50">
           <h3 className="text-xl font-black text-slate-800 mb-8 uppercase tracking-tight flex items-center gap-3">
             <div className="w-2 h-8 bg-amber-500 rounded-full"></div> Loại dữ liệu lưu trữ
           </h3>
           <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.byType}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="type" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold' }} />
                  <ReTooltip cursor={{ fill: '#f8fafc' }} />
                  <Bar dataKey="size" radius={[10, 10, 0, 0]} fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
           </div>
        </div>
      </div>
    </div>
  );
};

export default StorageOverview;
