
import React from 'react';
import { UserFilters, UserRole, UserStatus } from '../types';
import { DEPARTMENTS, ROLES, STATUSES } from '../constants';
import { Search, X } from 'lucide-react';

interface UserFiltersProps {
  filters: UserFilters;
  onFilterChange: (filters: UserFilters) => void;
  onClearFilters: () => void;
}

const UserFiltersPanel: React.FC<UserFiltersProps> = ({ filters, onFilterChange, onClearFilters }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onFilterChange({ ...filters, [name]: value });
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8 flex flex-wrap gap-6 items-end">
      <div className="flex-1 min-w-[300px]">
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Tìm kiếm</label>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            name="search"
            value={filters.search}
            onChange={handleChange}
            placeholder="Tên, tên đăng nhập hoặc email..."
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-medium"
          />
        </div>
      </div>

      <div className="w-full sm:w-auto min-w-[160px]">
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Vai trò</label>
        <select
          name="role"
          value={filters.role}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium text-slate-700"
        >
          <option value="">Tất cả vai trò</option>
          {ROLES.map(role => <option key={role} value={role}>{role}</option>)}
        </select>
      </div>

      <div className="w-full sm:w-auto min-w-[160px]">
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Phòng ban</label>
        <select
          name="department"
          value={filters.department}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium text-slate-700"
        >
          <option value="">Tất cả phòng ban</option>
          {DEPARTMENTS.map(dept => <option key={dept} value={dept}>{dept}</option>)}
        </select>
      </div>

      <div className="w-full sm:w-auto min-w-[160px]">
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Trạng thái</label>
        <select
          name="status"
          value={filters.status}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium text-slate-700"
        >
          <option value="">Tất cả trạng thái</option>
          {STATUSES.map(status => <option key={status} value={status}>{status}</option>)}
        </select>
      </div>

      <button
        onClick={onClearFilters}
        className="flex items-center gap-2 px-6 py-3 text-slate-500 hover:text-slate-800 font-bold transition-colors"
      >
        <X size={18} /> Xóa lọc
      </button>
    </div>
  );
};

export default UserFiltersPanel;
