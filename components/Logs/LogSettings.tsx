
import React, { useState } from 'react';
import { LogSettings, LogLevel, LogPackageConfig } from '../../types';
import { Settings, FileText, Database, Radio, ToggleLeft as Toggle, Server, Cloud, Plus, Trash2, Check, AlertTriangle, Code, Play } from 'lucide-react';

interface LogSettingsProps {
  settings: LogSettings;
  onSave: (settings: LogSettings) => void;
}

const LogSettingsPanel: React.FC<LogSettingsProps> = ({ settings, onSave }) => {
  const [localSettings, setLocalSettings] = useState<LogSettings>(settings);
  const [newPackage, setNewPackage] = useState({ name: '', level: LogLevel.INFO });

  const handleToggle = (key: keyof typeof settings.toggles) => {
    setLocalSettings(prev => ({
      ...prev,
      toggles: { ...prev.toggles, [key]: !prev.toggles[key] }
    }));
  };

  const addPackage = () => {
    if (!newPackage.name) return;
    const pkg: LogPackageConfig = {
      id: Math.random().toString(36).substr(2, 5),
      packageName: newPackage.name,
      level: newPackage.level
    };
    setLocalSettings(prev => ({ ...prev, packages: [...prev.packages, pkg] }));
    setNewPackage({ name: '', level: LogLevel.INFO });
  };

  const removePackage = (id: string) => {
    setLocalSettings(prev => ({ ...prev, packages: prev.packages.filter(p => p.id !== id) }));
  };

  const patternPreview = localSettings.pattern
    .replace('%d{yyyy-MM-dd HH:mm:ss}', '2024-05-22 14:30:00')
    .replace('%p', 'INFO')
    .replace('%c{1}', 'UserService')
    .replace('%m', 'Successfully initialized user context')
    .replace('%n', '\n');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div className="space-y-8">
        <div className="bg-white rounded-[2.5rem] p-10 shadow-2xl border border-blue-50">
          <h3 className="text-xl font-black text-blue-900 mb-8 uppercase tracking-widest flex items-center gap-3">
             <FileText size={24} className="text-blue-500" /> Format & Layout
          </h3>
          <div className="space-y-8">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Output Format</label>
              <div className="flex gap-4">
                {['Plain Text', 'JSON'].map(f => (
                  <button 
                    key={f} 
                    onClick={() => setLocalSettings(prev => ({ ...prev, format: f as any }))}
                    className={`flex-1 py-4 rounded-2xl border-2 font-black text-xs uppercase transition-all ${localSettings.format === f ? 'bg-blue-600 border-blue-600 text-white shadow-xl' : 'bg-slate-50 border-slate-100 text-slate-400'}`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Pattern Layout</label>
              <input 
                type="text" 
                value={localSettings.pattern}
                onChange={(e) => setLocalSettings(prev => ({ ...prev, pattern: e.target.value }))}
                className="w-full px-6 py-4 bg-slate-900 text-blue-400 rounded-2xl font-mono text-sm border-2 border-slate-800 outline-none focus:border-blue-500 transition-all"
              />
              <div className="mt-4 p-6 bg-slate-50 border border-slate-100 rounded-2xl relative">
                 <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-2 absolute top-4 left-6">Live Preview</p>
                 <pre className="mt-4 font-mono text-[12px] text-slate-600 overflow-x-auto">
                    {patternPreview}
                 </pre>
                 <div className="absolute top-4 right-6 flex items-center gap-2 text-emerald-500">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                    <span className="text-[9px] font-black uppercase">Valid Pattern</span>
                 </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] p-10 shadow-2xl border border-blue-50">
           <h3 className="text-xl font-black text-blue-900 mb-8 uppercase tracking-widest flex items-center gap-3">
              <Code size={24} className="text-indigo-500" /> Functional Toggles
           </h3>
           <div className="space-y-4">
              {Object.entries(localSettings.toggles).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between p-6 bg-slate-50 rounded-[1.5rem] border border-slate-100 hover:border-indigo-100 transition-all">
                   <div>
                      <p className="font-black text-slate-800 uppercase tracking-tight">{key} Monitoring</p>
                      <p className="text-[10px] text-slate-400 font-bold">Log detailed {key.toUpperCase()} activity in production</p>
                   </div>
                   <button 
                    onClick={() => handleToggle(key as any)}
                    className={`w-14 h-8 rounded-full relative transition-all ${value ? 'bg-indigo-600 shadow-inner' : 'bg-slate-300 shadow-inner'}`}
                   >
                      <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-all ${value ? 'right-1' : 'left-1'}`} />
                   </button>
                </div>
              ))}
           </div>
        </div>
      </div>

      <div className="space-y-8">
         <div className="bg-white rounded-[2.5rem] p-10 shadow-2xl border border-blue-50">
            <h3 className="text-xl font-black text-blue-900 mb-8 uppercase tracking-widest">Package Level Rules</h3>
            <div className="space-y-4 max-h-[300px] overflow-y-auto mb-6 pr-2">
               {localSettings.packages.map(pkg => (
                 <div key={pkg.id} className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-3">
                       <Database size={16} className="text-blue-500" />
                       <span className="font-mono text-sm text-slate-700 font-bold">{pkg.packageName}</span>
                    </div>
                    <div className="flex items-center gap-4">
                       <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-black text-blue-600">{pkg.level}</span>
                       <button onClick={() => removePackage(pkg.id)} className="p-2 text-rose-300 hover:text-rose-600 transition-colors"><Trash2 size={16} /></button>
                    </div>
                 </div>
               ))}
            </div>
            <div className="flex gap-4 p-6 bg-blue-50/50 rounded-[2rem] border border-blue-100">
               <input 
                type="text" 
                placeholder="com.package.*" 
                className="flex-1 bg-white border border-blue-100 rounded-xl px-4 py-2 font-mono text-xs outline-none focus:ring-2 focus:ring-blue-500"
                value={newPackage.name}
                onChange={e => setNewPackage(prev => ({ ...prev, name: e.target.value }))}
               />
               <select 
                className="bg-white border border-blue-100 rounded-xl px-4 py-2 font-black text-[10px] outline-none"
                value={newPackage.level}
                onChange={e => setNewPackage(prev => ({ ...prev, level: e.target.value as any }))}
               >
                  {Object.values(LogLevel).map(l => <option key={l} value={l}>{l}</option>)}
               </select>
               <button onClick={addPackage} className="p-3 bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-700 transition-all"><Plus size={18} /></button>
            </div>
         </div>

         <div className="bg-white rounded-[2.5rem] p-10 shadow-2xl border border-blue-50">
            <h3 className="text-xl font-black text-blue-900 mb-8 uppercase tracking-widest flex items-center gap-3">
               <Server size={24} className="text-emerald-500" /> Log Storage (Appenders)
            </h3>
            <div className="grid grid-cols-3 gap-4 mb-8">
               {[
                 { id: 'Local', icon: Server, label: 'Local File' },
                 { id: 'Centralized', icon: Database, label: 'ELK Stack' },
                 { id: 'Cloud', icon: Cloud, label: 'CloudWatch' },
               ].map(opt => (
                 <button 
                  key={opt.id}
                  onClick={() => setLocalSettings(prev => ({ ...prev, appender: opt.id as any }))}
                  className={`flex flex-col items-center gap-3 p-6 rounded-[2rem] border-2 transition-all ${localSettings.appender === opt.id ? 'border-emerald-500 bg-emerald-50 text-emerald-600 shadow-xl' : 'bg-slate-50 border-slate-100 text-slate-400'}`}
                 >
                    <opt.icon size={24} />
                    <span className="text-[10px] font-black uppercase tracking-widest">{opt.label}</span>
                 </button>
               ))}
            </div>
            
            <div className="space-y-4 p-6 bg-slate-50 rounded-3xl border border-slate-100">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Configuration for {localSettings.appender}</p>
               <input type="text" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold outline-none" placeholder={localSettings.appender === 'Local' ? '/var/log/omnicore/system.log' : '10.0.0.42:9200'} />
            </div>
         </div>

         <div className="bg-indigo-900 rounded-[2.5rem] p-10 text-white shadow-2xl border-b-8 border-indigo-950">
            <h3 className="text-xl font-black mb-8 flex items-center gap-3 uppercase tracking-tighter">
               <AlertTriangle size={24} className="text-amber-400" /> Alerting Rules
            </h3>
            <div className="flex items-center flex-wrap gap-3 font-bold text-sm">
               Nếu 
               <select className="bg-white/10 border border-white/20 rounded-lg px-2 py-1 outline-none text-blue-300">
                  {Object.values(LogLevel).map(l => <option key={l} className="bg-indigo-900">{l}</option>)}
               </select>
               vượt quá 5% trong 10 phút thì gửi cảnh báo khẩn cấp.
            </div>
            
            <button 
              onClick={() => onSave(localSettings)}
              className="w-full mt-10 py-5 bg-white text-indigo-900 rounded-3xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
            >
              <Check size={20} /> Save All Configurations
            </button>
         </div>
      </div>
    </div>
  );
};

export default LogSettingsPanel;
