
import React, { useState } from 'react';
import { AuditLogEntry, RiskLevel } from '../../types';
import { ShieldAlert, ShieldCheck, ShieldX, Lock, Search, Filter, Terminal, Globe, Monitor, Smartphone, Download, Activity, ArrowRight, RefreshCcw } from 'lucide-react';

interface Props {
  logs: AuditLogEntry[];
}

const AccessLogs: React.FC<Props> = ({ logs }) => {
  const [riskFilter, setRiskFilter] = useState<RiskLevel | 'ALL'>('ALL');
  const [search, setSearch] = useState('');

  const getRiskStyle = (risk: RiskLevel) => {
    switch (risk) {
      case RiskLevel.SAFE: return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case RiskLevel.LOW: return 'bg-blue-100 text-blue-700 border-blue-200';
      case RiskLevel.MEDIUM: return 'bg-amber-100 text-amber-700 border-amber-200';
      case RiskLevel.HIGH: return 'bg-orange-100 text-orange-700 border-orange-200';
      case RiskLevel.CRITICAL: return 'bg-rose-100 text-rose-700 border-rose-200';
    }
  };

  const filteredLogs = logs.filter(log => {
    const matchesRisk = riskFilter === 'ALL' || log.risk === riskFilter;
    const matchesSearch = log.username.toLowerCase().includes(search.toLowerCase()) || log.ip.includes(search);
    return matchesRisk && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Risk Summary Row */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
         {[
           { level: RiskLevel.SAFE, label: 'Safe', count: logs.filter(l => l.risk === RiskLevel.SAFE).length, color: 'emerald' },
           { level: RiskLevel.LOW, label: 'Low Risk', count: logs.filter(l => l.risk === RiskLevel.LOW).length, color: 'blue' },
           { level: RiskLevel.MEDIUM, label: 'Medium Risk', count: logs.filter(l => l.risk === RiskLevel.MEDIUM).length, color: 'amber' },
           { level: RiskLevel.HIGH, label: 'High Alert', count: logs.filter(l => l.risk === RiskLevel.HIGH).length, color: 'orange' },
           { level: RiskLevel.CRITICAL, label: 'Critical Threat', count: logs.filter(l => l.risk === RiskLevel.CRITICAL).length, color: 'rose' },
         ].map(item => (
           <button 
             key={item.level}
             onClick={() => setRiskFilter(item.level)}
             className={`p-6 rounded-3xl border-2 transition-all text-left relative overflow-hidden group ${riskFilter === item.level ? `border-blue-600 bg-white shadow-xl` : 'bg-white border-slate-50 opacity-60 hover:opacity-100'}`}
           >
              <div className={`w-1 h-8 ${item.level === RiskLevel.SAFE ? 'bg-emerald-500' : item.level === RiskLevel.LOW ? 'bg-blue-500' : item.level === RiskLevel.MEDIUM ? 'bg-amber-500' : item.level === RiskLevel.HIGH ? 'bg-orange-500' : 'bg-rose-500'} absolute left-0 top-1/2 -translate-y-1/2`} />
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{item.label}</p>
              <p className="text-2xl font-black text-slate-800">{item.count}</p>
           </button>
         ))}
      </div>

      <div className="bg-white rounded-[3rem] shadow-2xl border border-blue-50 overflow-hidden">
        <div className="px-10 py-8 border-b border-slate-50 bg-slate-50/30 flex flex-wrap gap-8 items-center justify-between">
           <div className="flex items-center gap-4">
              <div className="p-4 bg-slate-900 text-white rounded-2xl shadow-xl"><Terminal size={24} /></div>
              <div>
                 <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">Access Audit Stream</h3>
                 <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest flex items-center gap-2"><Activity size={12} className="text-emerald-500" /> Continuous System Surveillance</p>
              </div>
           </div>
           
           <div className="flex items-center gap-4 flex-1 max-w-md">
              <div className="relative flex-1">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                 <input 
                   type="text" 
                   placeholder="Trace by IP, User or Session..." 
                   className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl outline-none font-bold text-xs focus:ring-2 focus:ring-blue-500 transition-all"
                   value={search}
                   onChange={e => setSearch(e.target.value)}
                 />
              </div>
              <button onClick={() => setRiskFilter('ALL')} className="p-3 bg-slate-100 text-slate-400 rounded-xl hover:text-blue-600 transition-all"><RefreshCcw size={20} /></button>
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-blue-600 text-white uppercase text-[11px] font-bold tracking-wider">
              <tr>
                <th className="px-10 py-6">Risk Rating</th>
                <th className="px-10 py-6">Request Detail</th>
                <th className="px-10 py-6">Context & ID</th>
                <th className="px-10 py-6">Response</th>
                <th className="px-10 py-6 text-right">Rapid Security Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 font-medium">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="px-10 py-5">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black border uppercase tracking-widest shadow-sm ${getRiskStyle(log.risk)}`}>
                       {log.risk}
                    </span>
                    <p className="text-[10px] text-slate-400 font-bold mt-2 font-mono uppercase italic">{log.timestamp}</p>
                  </td>
                  <td className="px-10 py-5">
                    <div className="flex items-center gap-3">
                       <span className={`px-2 py-1 rounded text-[10px] font-black text-white ${log.method === 'POST' ? 'bg-blue-600' : 'bg-emerald-600'}`}>{log.method}</span>
                       <span className="font-mono text-xs font-black text-slate-700 truncate max-w-[200px]">{log.uri}</span>
                    </div>
                    <p className="text-[10px] font-mono text-slate-400 mt-2 truncate bg-slate-100 p-2 rounded-lg">Body: {log.bodyPreview}</p>
                  </td>
                  <td className="px-10 py-5">
                    <div className="space-y-1">
                       <p className="text-xs font-black text-slate-800 flex items-center gap-2"><ArrowRight size={10} className="text-blue-500" /> {log.username}</p>
                       <p className="text-[10px] font-mono font-bold text-blue-500 italic">{log.ip}</p>
                       <div className="flex items-center gap-3 text-[9px] font-black text-slate-400 uppercase">
                          <span className="flex items-center gap-1"><Monitor size={10} /> {log.device}</span>
                          <span className="flex items-center gap-1"><Globe size={10} /> {log.browser}</span>
                       </div>
                    </div>
                  </td>
                  <td className="px-10 py-5">
                     <span className={`text-sm font-black ${log.status >= 400 ? 'text-rose-500' : 'text-emerald-500'}`}>{log.status}</span>
                  </td>
                  <td className="px-10 py-5 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                       <button className="p-3 bg-white text-rose-500 hover:bg-rose-600 hover:text-white rounded-xl shadow-sm border border-slate-100 hover:border-rose-700 transition-all flex items-center gap-2" title="Block IP Address">
                          <ShieldX size={16} /> <span className="text-[9px] font-black uppercase">Block IP</span>
                       </button>
                       <button className="p-3 bg-white text-slate-700 hover:bg-slate-900 hover:text-white rounded-xl shadow-sm border border-slate-100 hover:border-slate-800 transition-all flex items-center gap-2" title="Lock User Account">
                          <Lock size={16} /> <span className="text-[9px] font-black uppercase">Lock User</span>
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AccessLogs;
