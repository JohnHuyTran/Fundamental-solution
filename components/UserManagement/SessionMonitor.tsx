
import React, { useState } from 'react';
import { UserSession, SessionStatus } from '../../types';
import { Activity, History, Power, Monitor, Smartphone, Globe, Clock, Search, ShieldX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  activeSessions: UserSession[];
  history: UserSession[];
  onForceLogout: (id: string) => void;
}

const SessionMonitor: React.FC<Props> = ({ activeSessions, history, onForceLogout }) => {
  const [tab, setTab] = useState<'live' | 'history'>('live');

  const getDeviceIcon = (device: string) => {
    if (device.toLowerCase().includes('mac') || device.toLowerCase().includes('windows') || device.toLowerCase().includes('workstation')) return <Monitor size={18} />;
    if (device.toLowerCase().includes('iphone') || device.toLowerCase().includes('android')) return <Smartphone size={18} />;
    return <Globe size={18} />;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex bg-white p-2 rounded-[2rem] shadow-xl border border-slate-100 w-fit">
        <button onClick={() => setTab('live')} className={`flex items-center gap-3 px-8 py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-widest transition-all ${tab === 'live' ? 'bg-blue-600 text-white shadow-xl' : 'text-slate-400 hover:text-slate-600'}`}>
          <Activity size={18} /> Live Sessions ({activeSessions.length})
        </button>
        <button onClick={() => setTab('history')} className={`flex items-center gap-3 px-8 py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-widest transition-all ${tab === 'history' ? 'bg-blue-600 text-white shadow-xl' : 'text-slate-400 hover:text-slate-600'}`}>
          <History size={18} /> Access History
        </button>
      </div>

      <div className="bg-white rounded-[3rem] shadow-2xl border border-blue-50 overflow-hidden">
        <div className="px-10 py-8 border-b border-slate-50 bg-slate-50/20 flex flex-wrap gap-8 items-center justify-between">
           <div>
              <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">
                 {tab === 'live' ? 'Real-time Connectivity' : 'Access Log History'}
              </h3>
              <p className="text-xs font-bold text-slate-400 mt-1 italic">
                 {tab === 'live' ? 'Manage and terminate active user connections instantly.' : 'Track past login patterns and session durations.'}
              </p>
           </div>
           <div className="relative w-full md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input type="text" placeholder="Trace session or user..." className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl outline-none font-bold text-xs focus:ring-2 focus:ring-blue-500 transition-all" />
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-blue-600 text-white uppercase text-[11px] font-bold tracking-wider">
              <tr>
                <th className="px-10 py-6">Principal User</th>
                <th className="px-10 py-6">Device & Network</th>
                <th className="px-10 py-6">Login Time</th>
                {tab === 'history' ? <th className="px-10 py-6">Logout / Duration</th> : <th className="px-10 py-6">Last Active</th>}
                <th className="px-10 py-6">State</th>
                <th className="px-10 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(tab === 'live' ? activeSessions : history).map(session => (
                <tr key={session.id} className="hover:bg-blue-50/50 transition-colors group">
                  <td className="px-10 py-5">
                    <div className="flex items-center gap-4">
                       <div className="h-10 w-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center font-black text-sm">{(session.username || 'U').charAt(0)}</div>
                       <div>
                          <p className="font-black text-slate-800 text-sm group-hover:text-blue-700 transition-colors">{session.username}</p>
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic">ID: {session.id}</p>
                       </div>
                    </div>
                  </td>
                  <td className="px-10 py-5">
                    <div className="flex items-center gap-3">
                       <div className="p-2 bg-slate-100 text-slate-400 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-all">
                          {getDeviceIcon(session.device)}
                       </div>
                       <div>
                          <p className="text-xs font-bold text-slate-600">{session.device}</p>
                          <p className="text-[10px] font-mono font-bold text-blue-400 tracking-tighter">{session.ip}</p>
                       </div>
                    </div>
                  </td>
                  <td className="px-10 py-5">
                     <p className="text-xs font-bold text-slate-500">{session.loginTime}</p>
                  </td>
                  <td className="px-10 py-5">
                     {tab === 'history' ? (
                       <div className="space-y-1">
                          <p className="text-xs font-bold text-slate-500">{session.logoutTime || '-'}</p>
                          <p className="text-[9px] font-black text-indigo-400 uppercase">{session.duration || '-'}</p>
                       </div>
                     ) : (
                       <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                          <span className="text-[10px] font-black uppercase text-emerald-600">{session.lastActive}</span>
                       </div>
                     )}
                  </td>
                  <td className="px-10 py-5">
                     <span className={`px-3 py-1 rounded-full text-[9px] font-black border uppercase tracking-tight shadow-sm ${
                        session.status === SessionStatus.ACTIVE ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
                        session.status === SessionStatus.TERMINATED ? 'bg-rose-100 text-rose-700 border-rose-200' :
                        'bg-slate-100 text-slate-600 border-slate-200'
                     }`}>
                        {session.status}
                     </span>
                  </td>
                  <td className="px-10 py-5 text-right">
                    {tab === 'live' ? (
                      <button 
                        onClick={() => onForceLogout(session.id)}
                        className="p-3 text-rose-400 hover:text-white hover:bg-rose-500 rounded-xl transition-all shadow-sm border border-transparent hover:border-rose-100 active:scale-90"
                        title="Kill Session"
                      >
                         <Power size={18} />
                      </button>
                    ) : (
                       <button className="p-3 text-slate-300 hover:text-blue-600 transition-all"><Search size={18} /></button>
                    )}
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

export default SessionMonitor;
