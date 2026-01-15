
import React, { useState } from 'react';
import { User, UserStatus } from '../types';
import { Edit2, Lock, Unlock, Key, MoreHorizontal, ShieldCheck, Mail, Phone, ExternalLink, Sparkles, UserX, UserCheck } from 'lucide-react';
import { analyzeUserSecurity } from '../services/geminiService';

interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onLockToggle: (user: User) => void;
  onResetPassword: (user: User) => void;
  isAdmin?: boolean;
}

const UserTable: React.FC<UserTableProps> = ({ users, onEdit, onLockToggle, onResetPassword, isAdmin = true }) => {
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);
  const [securityAdvice, setSecurityAdvice] = useState<Record<string, string>>({});

  const handleAudit = async (user: User) => {
    setAnalyzingId(user.id);
    const result = await analyzeUserSecurity(user);
    setSecurityAdvice(prev => ({ ...prev, [user.id]: result }));
    setAnalyzingId(null);
  };

  const getStatusStyle = (status: UserStatus) => {
    if (status === UserStatus.ACTIVE) return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    if (status === UserStatus.LOCKED) return 'bg-rose-100 text-rose-700 border-rose-200';
    if (status === UserStatus.PENDING) return 'bg-amber-100 text-amber-700 border-amber-200';
    return 'bg-slate-100 text-slate-700 border-slate-200';
  };

  return (
    <div className="w-full bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-blue-50">
      <div className="max-h-[650px] overflow-y-auto">
        <table className="w-full text-left border-collapse table-auto">
          <thead>
            {/* Header màu xanh chuẩn theo ảnh */}
            <tr className="bg-blue-600 text-white sticky top-0 z-20">
              <th className="px-8 py-6 text-[11px] font-bold uppercase tracking-wider min-w-[250px]">Employee Identity</th>
              <th className="px-8 py-6 text-[11px] font-bold uppercase tracking-wider min-w-[200px]">Contact Sync</th>
              <th className="px-8 py-6 text-[11px] font-bold uppercase tracking-wider min-w-[150px]">Org Unit</th>
              <th className="px-8 py-6 text-[11px] font-bold uppercase tracking-wider min-w-[150px]">State</th>
              <th className="px-8 py-6 text-[11px] font-bold uppercase tracking-wider text-right min-w-[180px]">Control Hub</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {users.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-8 py-20 text-center text-slate-400 font-bold text-xl bg-white">
                  No personnel data matches current criteria.
                </td>
              </tr>
            ) : (
              users.map((user, index) => (
                <tr 
                  key={user.id} 
                  className={`group transition-all hover:bg-blue-50/50 ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/20'}`}
                >
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-sm shadow-lg group-hover:scale-110 transition-transform">
                        {user.fullName.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-slate-800 group-hover:text-blue-700 transition-colors">{user.fullName}</div>
                        <div className="text-[10px] text-blue-400 font-black uppercase tracking-widest mt-0.5">@{user.username}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-[12px] font-bold text-slate-500">
                        <Mail size={12} className="text-blue-500" /> {user.email}
                      </div>
                      <div className="flex items-center gap-2 text-[12px] font-bold text-slate-500">
                        <Phone size={12} className="text-blue-500" /> {user.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-[12px] font-black text-indigo-900 uppercase tracking-tighter bg-indigo-50 px-3 py-1 rounded-lg">
                      {user.department}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex flex-col gap-2">
                      <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black border uppercase tracking-tight shadow-sm self-start ${getStatusStyle(user.status)}`}>
                        {user.status}
                      </span>
                      {isAdmin && (
                        securityAdvice[user.id] ? (
                          <div className="text-[10px] bg-white p-3 rounded-xl border-2 border-blue-100 max-w-[200px] leading-relaxed italic text-blue-600 shadow-xl animate-in zoom-in-95 duration-300">
                            <Sparkles size={10} className="inline mr-1 text-amber-500" /> {securityAdvice[user.id]}
                          </div>
                        ) : (
                          <button 
                            onClick={() => handleAudit(user)}
                            disabled={analyzingId === user.id}
                            className="text-[9px] text-blue-600 font-black uppercase tracking-[0.1em] hover:underline flex items-center gap-1 opacity-60 hover:opacity-100 transition-opacity"
                          >
                            {analyzingId === user.id ? 'Audit Active...' : <><ExternalLink size={10} /> Security Probe</>}
                          </button>
                        )
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    {isAdmin ? (
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                        <button
                          onClick={() => onEdit(user)}
                          className="p-3 text-blue-500 hover:text-white hover:bg-blue-600 rounded-xl transition-all shadow-sm border border-transparent hover:border-blue-700"
                          title="Modify Profile"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => onResetPassword(user)}
                          className="p-3 text-amber-500 hover:text-white hover:bg-amber-600 rounded-xl transition-all shadow-sm border border-transparent hover:border-amber-700"
                          title="Force Credentials Reset"
                        >
                          <Key size={16} />
                        </button>
                        <button
                          onClick={() => onLockToggle(user)}
                          className={`p-3 rounded-xl transition-all shadow-sm border border-transparent ${user.status === UserStatus.LOCKED ? 'text-emerald-500 hover:text-white hover:bg-emerald-600 hover:border-emerald-700' : 'text-rose-500 hover:text-white hover:bg-rose-600 hover:border-rose-700'}`}
                          title={user.status === UserStatus.LOCKED ? 'Reactivate Personnel' : 'Lock Personnel'}
                        >
                          {user.status === UserStatus.LOCKED ? <Unlock size={16} /> : <Lock size={16} />}
                        </button>
                      </div>
                    ) : (
                      <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Locked for Users</span>
                    )}
                    <div className="group-hover:hidden text-slate-200">
                      <MoreHorizontal size={18} />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserTable;
