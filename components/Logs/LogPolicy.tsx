
import React, { useState } from 'react';
import { LogPolicyConfig, MaskingRule, MaskingRuleType } from '../../types';
import { Shield, Database, Trash2, Plus, Info, Check, Save, RotateCcw, HelpCircle, HardDrive, ShieldCheck, Clock, ToggleLeft, ToggleRight } from 'lucide-react';

interface LogPolicyProps {
  policy: LogPolicyConfig;
  onSave: (policy: LogPolicyConfig) => void;
}

const LogPolicy: React.FC<LogPolicyProps> = ({ policy, onSave }) => {
  const [activeTab, setActiveTab] = useState<'masking' | 'retention'>('masking');
  const [localPolicy, setLocalPolicy] = useState<LogPolicyConfig>(policy);

  const addMaskingRule = () => {
    const newRule: MaskingRule = {
      id: Math.random().toString(36).substr(2, 5),
      key: '',
      rule: MaskingRuleType.MASK_ALL
    };
    setLocalPolicy(prev => ({
      ...prev,
      maskingRules: [...prev.maskingRules, newRule]
    }));
  };

  const removeMaskingRule = (id: string) => {
    setLocalPolicy(prev => ({
      ...prev,
      maskingRules: prev.maskingRules.filter(r => r.id !== id)
    }));
  };

  const updateMaskingRule = (id: string, updates: Partial<MaskingRule>) => {
    setLocalPolicy(prev => ({
      ...prev,
      maskingRules: prev.maskingRules.map(r => r.id === id ? { ...r, ...updates } : r)
    }));
  };

  const Tooltip = ({ text }: { text: string }) => (
    <div className="group relative inline-block ml-2 align-middle">
      <HelpCircle size={14} className="text-slate-300 hover:text-blue-500 cursor-help" />
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900 text-white text-[10px] font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none w-48 text-center shadow-2xl z-50">
        {text}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-900" />
      </div>
    </div>
  );

  return (
    <div className="max-w-[1200px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      {/* Tab Switcher */}
      <div className="flex bg-white p-2 rounded-[2rem] shadow-xl border border-slate-100 mb-8 max-w-md mx-auto">
        <button
          onClick={() => setActiveTab('masking')}
          className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'masking' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <Shield size={18} /> Sensitive Masking
        </button>
        <button
          onClick={() => setActiveTab('retention')}
          className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'retention' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <Clock size={18} /> Data Retention
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {activeTab === 'masking' ? (
          <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
            {/* Masking Rules Card */}
            <div className="bg-white rounded-[2.5rem] p-10 shadow-2xl border border-blue-50">
              <div className="flex justify-between items-center mb-10">
                <div>
                  <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Sensitive Data Masking</h3>
                  <p className="text-sm text-slate-400 font-bold mt-1">Configure rules to automatically blur sensitive fields in logs.</p>
                </div>
                <button 
                  onClick={addMaskingRule}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-50 text-blue-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                >
                  <Plus size={18} /> Thêm quy tắc
                </button>
              </div>

              <div className="space-y-4 mb-10">
                <div className="grid grid-cols-12 gap-6 px-6 mb-2">
                   <div className="col-span-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Key Name (Regex) <Tooltip text="GDPR compliance: Identify fields like passwords or PII." /></div>
                   <div className="col-span-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Masking Rule</div>
                   <div className="col-span-2"></div>
                </div>
                
                {localPolicy.maskingRules.map(rule => (
                  <div key={rule.id} className="grid grid-cols-12 gap-6 items-center p-4 bg-slate-50 border border-slate-100 rounded-[1.5rem] hover:border-blue-200 transition-all">
                    <div className="col-span-5">
                      <input 
                        type="text" 
                        value={rule.key}
                        onChange={(e) => updateMaskingRule(rule.id, { key: e.target.value })}
                        placeholder="e.g. password|pin|token"
                        className="w-full bg-white px-5 py-3 rounded-xl border border-slate-200 font-mono text-sm outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="col-span-5">
                      <select 
                        value={rule.rule}
                        onChange={(e) => updateMaskingRule(rule.id, { rule: e.target.value as MaskingRuleType })}
                        className="w-full bg-white px-5 py-3 rounded-xl border border-slate-200 font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                      >
                        {Object.values(MaskingRuleType).map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div className="col-span-2 flex justify-end">
                      <button onClick={() => removeMaskingRule(rule.id)} className="p-3 text-rose-300 hover:text-rose-600 hover:bg-white rounded-xl transition-all"><Trash2 size={20} /></button>
                    </div>
                  </div>
                ))}

                {localPolicy.maskingRules.length === 0 && (
                  <div className="py-20 text-center bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
                    <Shield size={48} className="mx-auto text-slate-200 mb-4" />
                    <p className="font-bold text-slate-400">Chưa có quy tắc làm mờ dữ liệu nào.</p>
                  </div>
                )}
              </div>

              {/* Whitelist Area */}
              <div className="pt-8 border-t border-slate-100">
                 <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
                   Field Whitelist <Tooltip text="Exclude specific fields from any global masking rules." />
                 </label>
                 <textarea 
                   value={localPolicy.whitelist}
                   onChange={(e) => setLocalPolicy(prev => ({ ...prev, whitelist: e.target.value }))}
                   placeholder="user_id, session_id, request_path..."
                   className="w-full h-32 bg-slate-50 p-6 rounded-2xl border border-slate-100 font-bold text-sm outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 resize-none transition-all"
                 />
                 <p className="mt-3 text-[10px] font-bold text-slate-400 italic">Nhập các trường an toàn, phân tách bằng dấu phẩy.</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            {/* Retention Card */}
            <div className="bg-white rounded-[2.5rem] p-10 shadow-2xl border border-blue-50">
               <h3 className="text-2xl font-black text-slate-800 mb-10 uppercase tracking-tight flex items-center gap-4">
                  <Database size={28} className="text-indigo-600" /> Data Retention Policies
               </h3>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
                  <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 relative group">
                     <Clock className="absolute top-8 right-8 text-slate-200 group-hover:text-blue-500 transition-colors" size={32} />
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">General Logs <Tooltip text="Standard application logs for everyday debugging." /></p>
                     <div className="flex items-center gap-4">
                        <input 
                          type="number" 
                          value={localPolicy.retention.generalDays}
                          onChange={(e) => setLocalPolicy(prev => ({ ...prev, retention: { ...prev.retention, generalDays: parseInt(e.target.value) || 0 } }))}
                          className="w-24 bg-white px-4 py-3 rounded-xl border border-slate-200 font-black text-xl text-blue-600 outline-none"
                        />
                        <span className="font-black text-slate-800 text-lg uppercase tracking-tighter">Ngày</span>
                     </div>
                  </div>

                  <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 relative group">
                     <ShieldCheck className="absolute top-8 right-8 text-slate-200 group-hover:text-rose-500 transition-colors" size={32} />
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Security Logs <Tooltip text="Highly sensitive audit logs required for security compliance." /></p>
                     <div className="flex items-center gap-4">
                        <input 
                          type="number" 
                          value={localPolicy.retention.securityDays}
                          onChange={(e) => setLocalPolicy(prev => ({ ...prev, retention: { ...prev.retention, securityDays: parseInt(e.target.value) || 0 } }))}
                          className="w-24 bg-white px-4 py-3 rounded-xl border border-slate-200 font-black text-xl text-rose-600 outline-none"
                        />
                        <span className="font-black text-slate-800 text-lg uppercase tracking-tighter">Ngày</span>
                     </div>
                  </div>
               </div>

               <div className="space-y-6">
                  <div className="flex items-center justify-between p-8 bg-indigo-50/50 rounded-[2rem] border border-indigo-100">
                     <div className="flex items-center gap-6">
                        <div className="p-4 bg-white rounded-2xl shadow-sm"><RotateCcw size={24} className="text-indigo-600" /></div>
                        <div>
                           <p className="font-black text-indigo-900 uppercase tracking-tight text-lg">Auto-Purge System</p>
                           <p className="text-[11px] font-bold text-indigo-400 uppercase tracking-widest">Tự động xóa vĩnh viễn log cũ quá hạn</p>
                        </div>
                     </div>
                     <button 
                        onClick={() => setLocalPolicy(prev => ({ ...prev, retention: { ...prev.retention, autoPurge: !prev.retention.autoPurge } }))}
                        className={`transition-colors duration-300 ${localPolicy.retention.autoPurge ? 'text-indigo-600' : 'text-slate-300'}`}
                     >
                        {localPolicy.retention.autoPurge ? <ToggleRight size={56} /> : <ToggleLeft size={56} />}
                     </button>
                  </div>

                  <div className="flex flex-col md:flex-row items-center justify-between p-8 bg-slate-50 rounded-[2rem] border border-slate-100 gap-6">
                     <div className="flex items-center gap-6">
                        <div className="p-4 bg-white rounded-2xl shadow-sm"><HardDrive size={24} className="text-slate-600" /></div>
                        <div>
                           <p className="font-black text-slate-800 uppercase tracking-tight text-lg">Destination for Archiving</p>
                           <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Nơi lưu trữ log trước khi xóa (Cold Storage)</p>
                        </div>
                     </div>
                     <select 
                        value={localPolicy.retention.archivingDestination}
                        onChange={(e) => setLocalPolicy(prev => ({ ...prev, retention: { ...prev.retention, archivingDestination: e.target.value as any } }))}
                        className="bg-white px-8 py-4 rounded-2xl border border-slate-200 font-black text-xs uppercase tracking-widest outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-sm"
                     >
                        <option value="Local">Local Storage</option>
                        <option value="S3">Amazon S3</option>
                        <option value="Cold Storage">Azure Cold Storage</option>
                     </select>
                  </div>
               </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Save Actions */}
      <div className="fixed bottom-12 left-1/2 -translate-x-1/2 w-full max-w-md px-4 z-40">
        <button 
          onClick={() => onSave(localPolicy)}
          className="w-full py-5 bg-slate-900 text-white rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] shadow-2xl hover:bg-blue-600 hover:-translate-y-2 transition-all flex items-center justify-center gap-4 group"
        >
          <Save size={20} className="group-hover:scale-110 transition-transform" />
          Xác nhận Lưu Cấu Hình Policy
        </button>
      </div>
    </div>
  );
};

export default LogPolicy;
