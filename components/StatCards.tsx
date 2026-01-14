
import React from 'react';
import { User, UserStatus } from '../types';
import { Users, ShieldCheck, ShieldAlert, Clock } from 'lucide-react';

interface StatCardsProps {
  users: User[];
}

const StatCards: React.FC<StatCardsProps> = ({ users }) => {
  const total = users.length;
  const active = users.filter(u => u.status === UserStatus.ACTIVE).length;
  const locked = users.filter(u => u.status === UserStatus.LOCKED).length;
  const pending = users.filter(u => u.status === UserStatus.PENDING).length;

  const stats = [
    { label: 'Tổng người dùng', value: total, icon: Users, color: 'blue' },
    { label: 'Đang hoạt động', value: active, icon: ShieldCheck, color: 'emerald' },
    { label: 'Tài khoản bị khóa', value: locked, icon: ShieldAlert, color: 'rose' },
    { label: 'Đang chờ duyệt', value: pending, icon: Clock, color: 'amber' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div key={stat.label} className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-slate-100 hover:shadow-md transition-shadow flex items-center gap-5" style={{ borderLeftColor: `var(--tw-color-${stat.color}-500)` }}>
            <div className={`p-4 rounded-2xl bg-${stat.color}-50 text-${stat.color}-600 shadow-sm`}>
              <Icon size={28} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-tight mb-1">{stat.label}</p>
              <p className="text-3xl font-black text-slate-800">{stat.value}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatCards;
