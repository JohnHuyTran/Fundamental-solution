
import React, { useState } from 'react';
import { StorageConfig } from '../../types';
import { Globe, Database, Server, Key, Shield, Plus, Settings2, FileCheck, Maximize2, X, Check } from 'lucide-react';

interface FileSettingsProps {
  configs: StorageConfig[];
}

const FileSettings: React.FC<FileSettingsProps> = ({ configs }) => {
  const [selectedConfig, setSelectedConfig] = useState<StorageConfig | null>(null);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Current Backends */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl border border-blue-50">
           <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-black text-blue-900 uppercase">Hệ quản trị lưu trữ (Active Backends)</h3>
              <button className="flex items-center gap-2 px-6 py-3 bg-blue-50 text-blue-600 rounded-2xl font-black text-xs uppercase tracking-widest border border-blue-100 hover:bg-blue-600 hover:text-white transition-all">
                 <Plus size={16} /> Add Provider
              </button>
           </div>
           <div className="space-y-4">
              {configs.map(cfg => (
                <div key={cfg.name} className={`p-6 rounded-[2rem] border-2 transition-all flex items-center justify-between ${selectedConfig?.name === cfg.name ? 'border-blue-500 bg-blue-50/30 shadow-inner' : 'bg-slate-50 border-slate-100 hover:border-blue-200'}`}>
                   <div className="flex items-center gap-6">
                      <div className="w-16 h-16 rounded-[1.5rem] bg-white shadow-sm flex items-center justify-center">
                         {cfg.provider === 'Local' ? <Server size={28} className="text-slate-600" /> : <Globe size={28} className="text-blue-500" />}
                      </div>
                      <div>
                         <div className="flex items-center gap-3">
                            <p className="font-black text-slate-800 text-lg">{cfg.name}</p>
                            <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${cfg.status === 'Connected' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                               {cfg.status}
                            </span>
                         </div>
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{cfg.provider} Storage Gateway</p>
                         <div className="flex gap-4 mt-2">
                            <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-slate-200/50 px-2 py-0.5 rounded-lg">
                               <FileCheck size={12} className="text-blue-500" />
                               {cfg.allowedExtensions?.join(', ') || '.*'}
                            </div>
                            <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-slate-200/50 px-2 py-0.5 rounded-lg">
                               <Maximize2 size={12} className="text-indigo-500" />
                               Max: {cfg.maxFileSizeMB || '∞'} MB
                            </div>
                         </div>
                      </div>
                   </div>
                   <div className="flex items-center gap-4">
                      <div className="text-right mr-4">
                         <p className="text-sm font-black text-blue-900">{cfg.usage} GB</p>
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Capacity Used</p>
                      </div>
                      <button 
                        onClick={() => setSelectedConfig(cfg)}
                        className={`p-4 rounded-2xl shadow-sm border transition-all ${selectedConfig?.name === cfg.name ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-400 hover:text-blue-600 border-slate-100'}`}
                      >
                         <Settings2 size={24} />
                      </button>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>

      {/* Quick Config Form */}
      <div className="bg-indigo-900 rounded-[2.5rem] p-10 text-white shadow-2xl h-fit sticky top-28 border-b-8 border-indigo-950">
         <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black flex items-center gap-3 tracking-tighter uppercase">
               <Key size={24} className="text-indigo-300" /> {selectedConfig ? 'Backend Tuning' : 'Cloud Integration'}
            </h3>
            {selectedConfig && <button onClick={() => setSelectedConfig(null)} className="p-2 hover:bg-white/10 rounded-full"><X size={18} /></button>}
         </div>
         
         <form className="space-y-6" onSubmit={e => e.preventDefault()}>
            {!selectedConfig && (
               <div>
                  <label className="block text-[10px] font-black uppercase text-indigo-300 mb-2 tracking-[0.2em]">Storage Provider</label>
                  <select className="w-full bg-white/10 border border-white/20 rounded-2xl p-4 font-bold text-sm outline-none focus:bg-white/20 transition-all cursor-pointer">
                     <option className="bg-indigo-900">AWS S3</option>
                     <option className="bg-indigo-900">Google Cloud Storage</option>
                     <option className="bg-indigo-900">Azure Blob</option>
                     <option className="bg-indigo-900">Microsoft Sharepoint</option>
                  </select>
               </div>
            )}

            {selectedConfig && (
               <div className="bg-white/5 p-4 rounded-2xl border border-white/10 mb-6">
                  <p className="text-[10px] font-black text-indigo-300 uppercase mb-1">Editing</p>
                  <p className="text-lg font-black">{selectedConfig.name}</p>
               </div>
            )}

            <div>
               <label className="block text-[10px] font-black uppercase text-indigo-300 mb-2 tracking-[0.2em]">Allowed Extensions (Comma separated)</label>
               <div className="relative">
                  <FileCheck size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400" />
                  <input 
                    type="text" 
                    className="w-full bg-white/10 border border-white/20 rounded-2xl pl-12 pr-4 py-4 font-bold text-sm outline-none focus:bg-white/20 transition-all placeholder:text-indigo-400/50" 
                    placeholder=".pdf, .png, .zip" 
                    defaultValue={selectedConfig?.allowedExtensions?.join(', ') || ''}
                  />
               </div>
            </div>

            <div>
               <label className="block text-[10px] font-black uppercase text-indigo-300 mb-2 tracking-[0.2em]">Max File Size (MB)</label>
               <div className="relative">
                  <Maximize2 size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400" />
                  <input 
                    type="number" 
                    className="w-full bg-white/10 border border-white/20 rounded-2xl pl-12 pr-4 py-4 font-bold text-sm outline-none focus:bg-white/20 transition-all" 
                    placeholder="100" 
                    defaultValue={selectedConfig?.maxFileSizeMB || ''}
                  />
               </div>
            </div>

            {!selectedConfig && (
               <>
                  <div>
                     <label className="block text-[10px] font-black uppercase text-indigo-300 mb-2 tracking-[0.2em]">Access Key ID / Client ID</label>
                     <input type="text" className="w-full bg-white/10 border border-white/20 rounded-2xl p-4 font-mono text-sm outline-none focus:bg-white/20" placeholder="AKIA..." />
                  </div>
                  <div>
                     <label className="block text-[10px] font-black uppercase text-indigo-300 mb-2 tracking-[0.2em]">Secret Key / Private Key</label>
                     <input type="password" name="password" className="w-full bg-white/10 border border-white/20 rounded-2xl p-4 font-mono text-sm outline-none focus:bg-white/20" placeholder="••••••••••••" />
                  </div>
               </>
            )}

            <div className="pt-4 space-y-3">
               <button className="w-full py-5 bg-white text-indigo-900 rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3">
                  {selectedConfig ? <><Check size={18} /> Lưu cấu hình</> : 'Verify & Connect'}
               </button>
               <p className="text-[9px] text-center text-indigo-300/60 font-black uppercase tracking-[0.3em] leading-relaxed">
                  Military Grade Encryption • AES-256 Enabled
               </p>
            </div>
         </form>
      </div>
    </div>
  );
};

export default FileSettings;
