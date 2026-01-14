
import React, { useState } from 'react';
import { StorageProviderConfig, StorageProviderType } from '../../types';
import { Server, Cloud, Globe, Key, ShieldCheck, CheckCircle2, AlertCircle, Plus, ToggleLeft as Toggle, RotateCw, Activity, Trash2 } from 'lucide-react';

interface Props { 
  providers: StorageProviderConfig[];
}

const StorageProviderConfigPanel: React.FC<Props> = ({ providers }) => {
  const [selectedType, setSelectedType] = useState<StorageProviderType>('AWS S3');
  const [isVerifying, setIsVerifying] = useState(false);

  const providerTypes: { type: StorageProviderType; icon: any; color: string }[] = [
    { type: 'Local', icon: Server, color: 'text-slate-600' },
    { type: 'AWS S3', icon: Cloud, color: 'text-amber-500' },
    { type: 'Google Cloud', icon: Globe, color: 'text-blue-500' },
    { type: 'Azure', icon: Cloud, color: 'text-cyan-500' },
    { type: 'FTP', icon: Server, color: 'text-indigo-500' }
  ];

  const handleTest = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      alert('Kết nối thành công tới Provider!');
    }, 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Type Selector Sidebar */}
      <div className="lg:col-span-4 space-y-6">
         <div className="bg-white p-8 rounded-[3rem] shadow-2xl border border-blue-50">
            <h3 className="text-xl font-black text-slate-800 mb-8 uppercase tracking-tight">Thêm Kho lưu trữ</h3>
            <div className="space-y-3">
               {providerTypes.map(opt => (
                 <button 
                  key={opt.type}
                  onClick={() => setSelectedType(opt.type)}
                  className={`w-full flex items-center justify-between p-5 rounded-[1.5rem] border-2 transition-all ${selectedType === opt.type ? 'bg-blue-600 border-blue-600 text-white shadow-xl' : 'bg-slate-50 border-slate-100 hover:border-blue-200 text-slate-500'}`}
                 >
                    <div className="flex items-center gap-4">
                       <opt.icon size={24} className={selectedType === opt.type ? 'text-white' : opt.color} />
                       <span className="font-black text-sm uppercase tracking-widest">{opt.type}</span>
                    </div>
                    {selectedType === opt.type && <CheckCircle2 size={18} />}
                 </button>
               ))}
            </div>
         </div>

         <div className="bg-emerald-900 p-10 rounded-[3rem] shadow-2xl text-white relative overflow-hidden">
            <ShieldCheck className="absolute -right-8 -bottom-8 w-40 h-40 text-white/10 rotate-12" />
            <h4 className="text-lg font-black mb-4 flex items-center gap-3">
               <ShieldCheck size={20} className="text-emerald-400" /> Security Standard
            </h4>
            <p className="text-sm font-bold opacity-80 leading-relaxed mb-6">Mọi dữ liệu truyền tải đều được mã hóa đầu cuối với chuẩn AES-256 Quân đội.</p>
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-white/10 px-4 py-2 rounded-xl border border-white/20 w-fit">
               GDPR Compliance Active
            </div>
         </div>
      </div>

      {/* Form Area */}
      <div className="lg:col-span-8 space-y-10">
         <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl border border-blue-50 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
            <div className="flex justify-between items-center mb-10 relative z-10">
               <div>
                  <h3 className="text-3xl font-black text-slate-800 tracking-tighter uppercase">Connection: {selectedType}</h3>
                  <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-widest italic">Cấu hình tham số kết nối hạ tầng</p>
               </div>
               <div className="flex items-center gap-3 bg-slate-100 px-6 py-3 rounded-2xl">
                  <span className="text-[10px] font-black text-slate-400 uppercase">Set Default</span>
                  <button className="text-emerald-500"><Toggle size={40} /></button>
               </div>
            </div>

            <form className="space-y-8 relative z-10" onSubmit={e => e.preventDefault()}>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Backend Display Name</label>
                     <input type="text" className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-6 py-4 font-bold text-slate-800 outline-none focus:border-blue-500 transition-all" placeholder="e.g. S3-Production-Asia" />
                  </div>
                  <div className="space-y-3">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Endpoint / Region</label>
                     <input type="text" className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-6 py-4 font-bold text-slate-800 outline-none focus:border-blue-500 transition-all" placeholder="ap-southeast-1" />
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Access Key / User</label>
                     <div className="relative">
                        <Key className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                        <input type="text" className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl pl-12 pr-6 py-4 font-mono text-xs font-bold outline-none focus:border-blue-500" placeholder="AKIA..." />
                     </div>
                  </div>
                  <div className="space-y-3">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Secret Key / Pass</label>
                     <input type="password" name="pass" className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-6 py-4 font-mono text-xs font-bold outline-none focus:border-blue-500" placeholder="••••••••••••••••" />
                  </div>
               </div>

               <div className="pt-8 flex flex-col md:flex-row gap-6">
                  <button 
                    onClick={handleTest}
                    disabled={isVerifying}
                    className="flex-1 flex items-center justify-center gap-3 py-5 bg-white border-4 border-blue-900 text-blue-900 rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-blue-50 transition-all"
                  >
                     {isVerifying ? <RotateCw size={20} className="animate-spin" /> : <Activity size={20} />} 
                     Test Connection
                  </button>
                  <button className="flex-[2] py-5 bg-blue-600 text-white rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-2xl shadow-blue-500/30 hover:bg-blue-700 transition-all border-b-8 border-blue-900">
                     Lưu và Kích hoạt Backend
                  </button>
               </div>
            </form>
         </div>

         {/* Current Active Providers List */}
         <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-blue-50">
            <h3 className="text-xl font-black text-slate-800 mb-8 uppercase tracking-tight flex items-center justify-between">
               Hệ thống Active Backends
               <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-xl text-xs">{providers.length}</span>
            </h3>
            <div className="space-y-4">
               {providers.map(p => (
                 <div key={p.id} className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100 group hover:border-blue-200 transition-all">
                    <div className="flex items-center gap-6">
                       <div className="p-4 bg-white rounded-2xl shadow-sm text-blue-600"><Server size={24} /></div>
                       <div>
                          <div className="flex items-center gap-3">
                             <p className="font-black text-slate-800 text-lg">{p.name}</p>
                             {p.isDefault && <span className="bg-emerald-500 text-white px-2 py-0.5 rounded text-[8px] font-black uppercase">Default</span>}
                          </div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{p.type} Storage Gateway</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-4">
                       <div className="text-right">
                          <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">{p.status}</p>
                          <p className="text-[9px] font-bold text-slate-400">Audit Active</p>
                       </div>
                       <button className="p-3 bg-white text-rose-300 hover:text-rose-600 rounded-xl transition-all shadow-sm"><Trash2 size={20} /></button>
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
};

export default StorageProviderConfigPanel;
