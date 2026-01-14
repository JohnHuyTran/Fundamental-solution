
import React from 'react';
import { UserSession, SessionStatus } from '../types';
import { Monitor, Smartphone, Globe, Power, Clock, User as UserIcon } from 'lucide-react';

interface SessionTableProps {
  sessions: UserSession[];
  onForceLogout: (id: string) => void;
  title: string;
}

const SessionTable: React.FC<SessionTableProps> = ({ sessions, onForceLogout, title }) => {
  const getStatusStyle = (status: SessionStatus) => {
    switch (status) {
      case SessionStatus.ACTIVE: return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case SessionStatus.TERMINATED: return 'bg-rose-100 text-rose-700 border-rose-200';
      case SessionStatus.EXPIRED: return 'bg-slate-100 text-slate-700 border-slate-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getDeviceIcon = (device: string) => {
    if (device.toLowerCase().includes('desktop')) return <Monitor size={16} />;
    if (device.toLowerCase().includes('mobile')) return <Smartphone size={16} />;
    return <Globe size={16} />;
  };

  return (
    <div className="mb-10">
      <div className="flex items-center gap-3 mb-6">
        <h3 className="text-xl font-black text-blue-900 uppercase tracking-tighter">{title}</h3>
        <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-xs font-black shadow-sm">{sessions.length}</span>
      </div>
      
      <div className="w-full bg-white rounded-[20px] shadow-2xl overflow-hidden border border-blue-50">
        <div className="max-h-[450px] overflow-y-auto">
          <table className="w-full text-left border-collapse table-auto">
            <thead>
              {/* Header Blue (Yêu cầu 3) */}
              <tr className="bg-blue-600 text-white sticky top-0 z-20">
                <th className="px-8 py-6 text-[12px] font-bold uppercase tracking-wider min-w-[220px]">Người dùng</th>
                <th className="px-8 py-6 text-[12px] font-bold uppercase tracking-wider min-w-[180px]">Địa chỉ IP & Thiết bị</th>
                <th className="px-8 py-6 text-[12px] font-bold uppercase tracking-wider min-w-[200px]">Thời gian Login</th>
                <th className="px-8 py-6 text-[12px] font-bold uppercase tracking-wider min-w-[150px]">Hoạt động cuối</th>
                <th className="px-8 py-6 text-[12px] font-bold uppercase tracking-wider min-w-[150px]">Trạng thái</th>
                <th className="px-8 py-6 text-[12px] font-bold uppercase tracking-wider text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-50">
              {sessions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-8 py-16 text-center text-slate-400 font-bold bg-white">
                    Không có dữ liệu phiên.
                  </td>
                </tr>
              ) : (
                sessions.map((session, index) => (
                  <tr 
                    key={session.id} 
                    className={`group transition-all hover:bg-blue-50/80 ${index % 2 === 0 ? 'bg-white' : 'bg-blue-50/40'}`}
                  >
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-all">
                          <UserIcon size={18} />
                        </div>
                        <div>
                          <div className="font-bold text-blue-900 group-hover:text-blue-700 transition-colors">{session.userName}</div>
                          <div className="text-[10px] text-blue-400 font-black uppercase tracking-widest">ID: {session.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-[13px] font-bold text-slate-600">
                          <Globe size={12} className="text-blue-500" /> {session.ipAddress}
                        </div>
                        <div className="flex items-center gap-2 text-[11px] font-medium text-blue-300">
                          {getDeviceIcon(session.device)} {session.device} • {session.browser}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2 text-[13px] font-medium text-slate-600">
                        <Clock size={14} className="text-blue-400" /> {session.loginTime}
                      </div>
                      {session.duration && (
                        <div className="text-[10px] font-black text-blue-300 uppercase mt-1">Thời lượng: {session.duration}</div>
                      )}
                    </td>
                    <td className="px-8 py-5 text-[13px] font-medium text-slate-600">
                      {session.lastActive}
                    </td>
                    <td className="px-8 py-5">
                      <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black border uppercase tracking-tight shadow-sm ${getStatusStyle(session.status)}`}>
                        {session.status}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      {session.status === SessionStatus.ACTIVE && (
                        <button
                          onClick={() => onForceLogout(session.id)}
                          className="p-3 text-rose-400 hover:text-white hover:bg-rose-500 rounded-2xl transition-all shadow-sm border border-transparent hover:border-rose-100 group/btn active:scale-90"
                          title="Ngắt kết nối ngay lập tức"
                        >
                          <Power size={18} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SessionTable;
