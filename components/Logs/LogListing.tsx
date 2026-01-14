
import React, { useState, useMemo, useEffect } from 'react';
import { LogEntry, LogLevel } from '../../types';
import { Search, Filter, Terminal, AlertCircle, Info, Clock, ExternalLink, X, ChevronRight, Download, Activity, Trash2 } from 'lucide-react';

interface LogListingProps {
  logs: LogEntry[];
  isAdmin: boolean;
}

const LogListing: React.FC<LogListingProps> = ({ logs, isAdmin }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevels, setSelectedLevels] = useState<LogLevel[]>([]);
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [queryTime, setQueryTime] = useState(0);

  const filteredLogs = useMemo(() => {
    const start = performance.now();
    const result = logs.filter(log => {
      const matchesSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           log.service.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLevel = selectedLevels.length === 0 || selectedLevels.includes(log.level);
      return matchesSearch && matchesLevel;
    });
    setQueryTime(Math.round(performance.now() - start));
    return result;
  }, [logs, searchTerm, selectedLevels]);

  const getLevelStyle = (level: LogLevel) => {
    switch (level) {
      case LogLevel.ERROR: return 'bg-rose-100 text-rose-700 border-rose-200';
      case LogLevel.WARN: return 'bg-amber-100 text-amber-700 border-amber-200';
      case LogLevel.INFO: return 'bg-blue-100 text-blue-700 border-blue-200';
      case LogLevel.DEBUG: return 'bg-slate-100 text-slate-500 border-slate-200';
    }
  };

  const handleLogClick = (log: LogEntry) => {
    if (log.level === LogLevel.ERROR || log.stackTrace) {
      setSelectedLog(log);
      setIsDrawerOpen(true);
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      {/* Filter Bar */}
      <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl border border-blue-50 flex flex-wrap gap-6 items-center">
        <div className="flex-1 min-w-[300px] relative group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Tìm kiếm nội dung log hoặc service..."
            className="w-full pl-16 pr-6 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:bg-white focus:border-blue-500 outline-none font-bold text-sm transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          {Object.values(LogLevel).map(level => (
            <button
              key={level}
              onClick={() => setSelectedLevels(prev => prev.includes(level) ? prev.filter(l => l !== level) : [...prev, level])}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 transition-all ${selectedLevels.includes(level) ? 'bg-slate-900 border-slate-900 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-300'}`}
            >
              {level}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4 border-l border-slate-100 pl-6 ml-auto">
          <div className="text-right">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Query Time</p>
             <p className="text-sm font-black text-blue-600">{queryTime}ms</p>
          </div>
          <button className="p-4 bg-slate-100 text-slate-600 rounded-2xl hover:bg-slate-200 transition-all">
            <Download size={20} />
          </button>
        </div>
      </div>

      {/* Stats Mini Row */}
      <div className="flex items-center justify-between px-4">
        <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">
          Hiển thị <span className="text-blue-600">{filteredLogs.length}</span> kết quả log tìm thấy
        </p>
        <div className="flex items-center gap-2">
           <Activity size={14} className="text-emerald-500" />
           <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Real-time Stream Active</span>
        </div>
      </div>

      {/* Log Table */}
      <div className="bg-white rounded-[2.5rem] shadow-2xl border border-blue-50 overflow-hidden">
        <div className="overflow-x-auto max-h-[600px]">
          <table className="w-full text-left border-collapse table-fixed">
            <thead className="bg-slate-900 text-white sticky top-0 z-20">
              <tr>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest w-[180px]">Timestamp</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest w-[110px]">Level</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest w-[140px]">Service</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest w-[120px]">Thread</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest">Message</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 font-mono text-[13px]">
              {filteredLogs.map(log => (
                <tr 
                  key={log.id} 
                  onClick={() => handleLogClick(log)}
                  className={`hover:bg-blue-50/50 cursor-pointer transition-colors group ${log.level === LogLevel.ERROR ? 'bg-rose-50/20' : ''}`}
                >
                  <td className="px-8 py-4 text-slate-400 whitespace-nowrap">{log.timestamp}</td>
                  <td className="px-8 py-4">
                    <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black border uppercase ${getLevelStyle(log.level)}`}>
                      {log.level}
                    </span>
                  </td>
                  <td className="px-8 py-4 font-bold text-slate-600">{log.service}</td>
                  <td className="px-8 py-4 text-slate-400">{log.threadId}</td>
                  <td className="px-8 py-4 text-slate-700 truncate group-hover:whitespace-normal group-hover:overflow-visible transition-all">
                    {log.message}
                    {log.level === LogLevel.ERROR && <ExternalLink size={12} className="inline ml-2 text-rose-400 opacity-0 group-hover:opacity-100" />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stack Trace Drawer */}
      {isDrawerOpen && selectedLog && (
        <div className="fixed inset-0 z-[100] flex justify-end animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsDrawerOpen(false)} />
          <div className="w-full max-w-3xl bg-[#1e1e1e] shadow-2xl relative animate-in slide-in-from-right duration-500 border-l border-white/10 flex flex-col">
            <div className="p-8 border-b border-white/5 flex items-center justify-between bg-[#252526]">
              <div className="flex items-center gap-4">
                 <div className="p-3 bg-rose-500/20 text-rose-500 rounded-xl"><AlertCircle size={24} /></div>
                 <div>
                    <h3 className="text-xl font-black text-white uppercase tracking-tight">Error Detail & Stack Trace</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{selectedLog.service} • {selectedLog.timestamp}</p>
                 </div>
              </div>
              <button onClick={() => setIsDrawerOpen(false)} className="p-2 hover:bg-white/5 rounded-full text-slate-400 transition-colors"><X size={28} /></button>
            </div>
            
            <div className="p-8 flex-1 overflow-y-auto">
               <div className="mb-8">
                  <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-2">Error Message</p>
                  <div className="p-6 bg-rose-950/20 border border-rose-500/30 rounded-2xl text-rose-200 font-mono text-sm leading-relaxed">
                     {selectedLog.message}
                  </div>
               </div>

               <div>
                  <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2">Stack Trace</p>
                  <pre className="p-8 bg-[#0d0d0d] rounded-2xl text-slate-300 font-mono text-[12px] leading-6 overflow-x-auto shadow-inner border border-white/5 whitespace-pre-wrap">
                    {selectedLog.stackTrace?.split('\n').map((line, i) => (
                      <div key={i} className="hover:bg-white/5 px-2 rounded">
                        <span className="text-slate-600 mr-4 select-none inline-block w-4">{i + 1}</span>
                        <span className={line.includes('at ') ? 'text-blue-400' : 'text-rose-400 font-bold'}>
                          {line}
                        </span>
                      </div>
                    )) || 'No stack trace provided for this log level.'}
                  </pre>
               </div>
            </div>

            <div className="p-8 border-t border-white/5 bg-[#252526] flex justify-between items-center">
               <div className="flex items-center gap-2 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                  <Clock size={14} /> Total Runtime: 42ms
               </div>
               <div className="flex gap-4">
                  <button className="px-6 py-3 bg-white/5 text-white rounded-xl font-bold text-xs uppercase hover:bg-white/10 transition-all border border-white/10">Copy Log</button>
                  <button className="px-8 py-3 bg-blue-600 text-white rounded-xl font-black text-xs uppercase shadow-xl shadow-blue-500/20">Report Issue</button>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LogListing;
