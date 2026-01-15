
import React, { useState } from 'react';
import { AuditLogEntry, RiskLevel } from '../../types';
import { 
  ShieldAlert, ShieldCheck, ShieldX, Lock, Search, Filter, 
  Terminal, Globe, Monitor, Smartphone, Download, Activity, 
  ArrowRight, RefreshCcw, Database, FileSpreadsheet, ListFilter,
  Clock, ShieldOff
} from 'lucide-react';

interface Props {
  logs: AuditLogEntry[];
}

const AccessLogs: React.FC<Props> = ({ logs }) => {
  const [riskFilter, setRiskFilter] = useState<RiskLevel | 'ALL' | 'BLOCKED'>('ALL');
  const [search, setSearch] = useState('');
  // Mô phỏng danh sách IP đã bị chặn
  const [blockedIps, setBlockedIps] = useState<Set<string>>(new Set(['45.12.33.1', '103.44.1.2']));

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
    const matchesSearch = 
      log.username.toLowerCase().includes(search.toLowerCase()) || 
      log.ip.includes(search) ||
      log.uri.toLowerCase().includes(search.toLowerCase());

    if (riskFilter === 'BLOCKED') {
      return blockedIps.has(log.ip) && matchesSearch;
    }
    
    const matchesRisk = riskFilter === 'ALL' || log.risk === riskFilter;
    return matchesRisk && matchesSearch;
  });

  const handleBlockIp = (ip: string) => {
    const newBlocked = new Set(blockedIps);
    if (newBlocked.has(ip)) {
      newBlocked.delete(ip);
    } else {
      newBlocked.add(ip);
    }
    setBlockedIps(newBlocked);
  };

  const totalLogs = logs.length;
  const filteredCount = filteredLogs.length;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* 1. Extended Summary Row with TOTAL & BLOCKED CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-6">
         {/* Total Logs Card */}
         <button 
           onClick={() => { setRiskFilter('ALL'); setSearch(''); }}
           className={`col-span-1 p-6 rounded-[2rem] border-2 transition-all text-left relative overflow-hidden group ${riskFilter === 'ALL' ? 'bg-slate-900 border-slate-700 text-white shadow-2xl' : 'bg-white border-slate-100 hover:border-slate-300'}`}
         >
            <Database className={`absolute -right-4 -bottom-4 ${riskFilter === 'ALL' ? 'text-white/10' : 'text-slate-100'} w-20 h-20 rotate-12`} />
            <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${riskFilter === 'ALL' ? 'text-blue-400' : 'text-slate-400'}`}>Total Events</p>
            <p className="text-3xl font-black">{totalLogs}</p>
         </button>

         {/* BLOCKED Card */}
         <button 
           onClick={() => setRiskFilter('BLOCKED')}
           className={`col-span-1 p-6 rounded-[2rem] border-2 transition-all text-left relative overflow-hidden group ${riskFilter === 'BLOCKED' ? 'bg-rose-900 border-rose-700 text-white shadow-2xl' : 'bg-white border-slate-100 hover:border-rose-200'}`}
         >
            <ShieldOff className={`absolute -right-4 -bottom-4 ${riskFilter === 'BLOCKED' ? 'text-white/10' : 'text-rose-100'} w-20 h-20 rotate-12`} />
            <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${riskFilter === 'BLOCKED' ? 'text-rose-300' : 'text-slate-400'}`}>Blocked IPs</p>
            <p className={`text-3xl font-black ${riskFilter === 'BLOCKED' ? 'text-white' : 'text-rose-600'}`}>{blockedIps.size}</p>
         </button>

         {[
           { level: RiskLevel.SAFE, label: 'Safe', count: logs.filter(l => l.risk === RiskLevel.SAFE).length },
           { level: RiskLevel.LOW, label: 'Low', count: logs.filter(l => l.risk === RiskLevel.LOW).length },
           { level: RiskLevel.MEDIUM, label: 'Medium', count: logs.filter(l => l.risk === RiskLevel.MEDIUM).length },
           { level: RiskLevel.HIGH, label: 'High', count: logs.filter(l => l.risk === RiskLevel.HIGH).length },
           { level: RiskLevel.CRITICAL, label: 'Critical', count: logs.filter(l => l.risk === RiskLevel.CRITICAL).length },
         ].map(item => (
           <button 
             key={item.level}
             onClick={() => setRiskFilter(item.level)}
             className={`p-6 rounded-[2rem] border-2 transition-all text-left relative overflow-hidden group ${riskFilter === item.level ? `border-blue-600 bg-white shadow-xl ring-4 ring-blue-50` : 'bg-white border-slate-50 opacity-80 hover:opacity-100'}`}
           >
              <div className={`w-1 h-8 ${item.level === RiskLevel.SAFE ? 'bg-emerald-500' : item.level === RiskLevel.LOW ? 'bg-blue-500' : item.level === RiskLevel.MEDIUM ? 'bg-amber-500' : item.level === RiskLevel.HIGH ? 'bg-orange-500' : 'bg-rose-500'} absolute left-0 top-1/2 -translate-y-1/2`} />
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{item.label}</p>
              <p className="text-2xl font-black text-slate-800">{item.count}</p>
           </button>
         ))}
      </div>

      {/* 2. List Control Bar */}
      <div className="bg-white rounded-[3rem] shadow-2xl border border-blue-50 overflow-hidden">
        <div className="px-10 py-8 border-b border-slate-50 bg-slate-50/30 flex flex-wrap gap-8 items-center justify-between">
           <div className="flex items-center gap-4">
              <div className="p-4 bg-slate-900 text-white rounded-2xl shadow-xl"><Terminal size={24} /></div>
              <div>
                 <div className="flex items-center gap-2">
                    <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">Audit Event Stream</h3>
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black shadow-lg ${riskFilter === 'BLOCKED' ? 'bg-rose-600 text-white' : 'bg-blue-600 text-white'}`}>
                      {riskFilter === 'BLOCKED' ? 'BLOCKED LIST' : 'FULL LIST'}
                    </span>
                 </div>
                 <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest flex items-center gap-2">
                    <Activity size={12} className="text-emerald-500 animate-pulse" /> 
                    Showing {filteredCount} of {totalLogs} global entries
                 </p>
              </div>
           </div>
           
           <div className="flex items-center gap-4 flex-1 max-w-2xl">
              <div className="relative flex-1 group">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" size={18} />
                 <input 
                   type="text" 
                   placeholder="Trace by IP, User, URI or Session ID..." 
                   className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-slate-100 rounded-2xl outline-none font-bold text-sm focus:border-blue-500 transition-all shadow-inner"
                   value={search}
                   onChange={e => setSearch(e.target.value)}
                 />
              </div>
              <button 
                className="flex items-center gap-2 px-6 py-3.5 bg-white border-2 border-slate-100 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 hover:border-blue-200 transition-all shadow-sm"
                title="Export Logs"
              >
                 <FileSpreadsheet size={18} /> <span className="max-md:hidden">Export Full</span>
              </button>
              <button onClick={() => { setRiskFilter('ALL'); setSearch(''); }} className="p-3.5 bg-slate-100 text-slate-400 rounded-2xl hover:bg-slate-900 hover:text-white transition-all shadow-sm" title="Clear Filters">
                 <RefreshCcw size={20} />
              </button>
           </div>
        </div>

        {/* 3. Detailed Audit Table */}
        <div className="overflow-x-auto max-h-[700px] custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-900 text-white uppercase text-[11px] font-black tracking-[0.1em] sticky top-0 z-20 shadow-xl">
              <tr>
                <th className="px-10 py-6">Security Rating</th>
                <th className="px-10 py-6">Request Signature</th>
                <th className="px-10 py-6">Principal Context</th>
                <th className="px-10 py-6">Outcome</th>
                <th className="px-10 py-6 text-right">Security Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredLogs.map((log, idx) => {
                const isIpBlocked = blockedIps.has(log.ip);
                return (
                  <tr key={log.id} className={`group transition-all ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/20'} hover:bg-blue-50/50 ${isIpBlocked ? 'border-l-4 border-l-rose-500 shadow-inner bg-rose-50/10' : ''}`}>
                    <td className="px-10 py-6">
                      <div className="flex flex-col gap-2">
                         <div className="flex items-center gap-2">
                           <span className={`inline-flex px-4 py-1.5 rounded-full text-[10px] font-black border uppercase tracking-widest shadow-sm self-start ${getRiskStyle(log.risk)}`}>
                              {log.risk}
                           </span>
                           {isIpBlocked && <span className="p-1 bg-rose-600 text-white rounded-md animate-pulse"><ShieldOff size={10} /></span>}
                         </div>
                         <p className="text-[10px] text-slate-400 font-bold font-mono uppercase italic flex items-center gap-1">
                            <Clock size={10} /> {log.timestamp}
                         </p>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <div className="flex flex-col gap-2">
                         <div className="flex items-center gap-3">
                            <span className={`px-2 py-1 rounded text-[10px] font-black text-white ${log.method === 'POST' ? 'bg-blue-600 shadow-lg shadow-blue-500/20' : 'bg-emerald-600 shadow-lg shadow-emerald-500/20'}`}>{log.method}</span>
                            <span className="font-mono text-xs font-black text-slate-700 truncate max-w-[280px] bg-slate-100 px-2 py-1 rounded border border-slate-200" title={log.uri}>{log.uri}</span>
                         </div>
                         <div className="relative group/body">
                            <p className="text-[9px] font-mono text-slate-400 truncate bg-slate-50 p-2 rounded-lg border border-dashed border-slate-200">
                               {log.bodyPreview}
                            </p>
                         </div>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <div className="space-y-2">
                         <p className="text-sm font-black text-slate-800 flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-black">{log.username.charAt(0).toUpperCase()}</div>
                            {log.username}
                         </p>
                         <p className={`text-[10px] font-mono font-bold tracking-tighter flex items-center gap-1 ${isIpBlocked ? 'text-rose-600' : 'text-blue-500'}`}>
                           <Globe size={10} /> {log.ip} {isIpBlocked && '(BLOCKED)'}
                         </p>
                         <div className="flex items-center gap-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                            <span className="flex items-center gap-1.5"><Monitor size={10} /> {log.device}</span>
                            <span className="flex items-center gap-1.5"><Smartphone size={10} /> {log.browser}</span>
                         </div>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                       <div className="flex flex-col items-center">
                          <span className={`text-lg font-black ${log.status >= 400 ? 'text-rose-500 drop-shadow-sm' : 'text-emerald-500'}`}>{log.status}</span>
                          <span className="text-[9px] font-black text-slate-300 uppercase tracking-tighter">{log.status >= 400 ? 'Failed' : 'Success'}</span>
                       </div>
                    </td>
                    <td className="px-10 py-6 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                         <button 
                           onClick={() => handleBlockIp(log.ip)}
                           className={`p-3 rounded-xl shadow-lg border transition-all flex items-center gap-2 group/btn ${isIpBlocked ? 'bg-rose-600 text-white border-rose-700' : 'bg-white text-rose-500 border-slate-100 hover:bg-rose-600 hover:text-white'}`} 
                           title={isIpBlocked ? "Unblock IP Address" : "Block IP Address"}
                         >
                            <ShieldX size={16} className="group-hover/btn:rotate-12 transition-transform" /> 
                            <span className="text-[9px] font-black uppercase">{isIpBlocked ? 'Unblock' : 'Block IP'}</span>
                         </button>
                         <button className="p-3 bg-white text-slate-700 hover:bg-slate-900 hover:text-white rounded-xl shadow-lg border border-slate-100 hover:border-slate-800 transition-all flex items-center gap-2 group/btn" title="Lock User Account">
                            <Lock size={16} className="group-hover/btn:scale-110 transition-transform" /> <span className="text-[9px] font-black uppercase">Lock Account</span>
                         </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredLogs.length === 0 && (
                <tr>
                   <td colSpan={5} className="py-40 text-center">
                      <div className="flex flex-col items-center opacity-30">
                         <ListFilter size={80} strokeWidth={1} />
                         <p className="text-xl font-black uppercase mt-6">No matching audit logs found</p>
                         <p className="text-xs font-bold mt-2">Try adjusting your filters or search term</p>
                      </div>
                   </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Table Footer */}
        <div className="px-10 py-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">
           <span>Secured by OmniGuard Internal Audit</span>
           <div className="flex items-center gap-4">
              <span>Auto-refreshing every 5s</span>
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
           </div>
        </div>
      </div>
    </div>
  );
};

export default AccessLogs;
