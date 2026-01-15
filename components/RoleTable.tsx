
import React from 'react';
import { RoleDefinition } from '../types';
import { Edit2, Trash2, Shield, Info } from 'lucide-react';

interface RoleTableProps {
  roles: RoleDefinition[];
  onEdit: (role: RoleDefinition) => void;
  onDelete: (id: string) => void;
}

const RoleTable: React.FC<RoleTableProps> = ({ roles, onEdit, onDelete }) => {
  return (
    <div className="w-full bg-white rounded-[20px] shadow-2xl overflow-hidden border border-blue-50">
      <div className="max-h-[580px] overflow-y-auto">
        <table className="w-full text-left border-collapse table-auto">
          <thead>
            <tr className="bg-blue-600 text-white sticky top-0 z-20">
              <th className="px-8 py-6 text-[11px] font-bold uppercase tracking-wider min-w-[200px]">Tên vai trò</th>
              <th className="px-8 py-6 text-[11px] font-bold uppercase tracking-wider min-w-[150px]">Mã định danh</th>
              <th className="px-8 py-6 text-[11px] font-bold uppercase tracking-wider min-w-[300px]">Mô tả chi tiết</th>
              <th className="px-8 py-6 text-[11px] font-bold uppercase tracking-wider text-right min-w-[150px]">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-blue-50">
            {roles.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-8 py-20 text-center text-slate-400 font-bold text-xl bg-white">
                  Chưa có vai trò nào được định nghĩa.
                </td>
              </tr>
            ) : (
              roles.map((role, index) => (
                <tr 
                  key={role.id} 
                  className={`group transition-all hover:bg-blue-50/80 ${index % 2 === 0 ? 'bg-white' : 'bg-blue-50/40'}`}
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className={`h-10 w-10 rounded-xl flex items-center justify-center text-white shadow-md transform group-hover:rotate-6 transition-transform ${role.isSystem ? 'bg-blue-600' : 'bg-blue-400'}`}>
                        <Shield size={20} />
                      </div>
                      <div>
                        <div className="font-bold text-blue-900 group-hover:text-blue-700 transition-colors">{role.name}</div>
                        {role.isSystem && <span className="text-[10px] text-blue-500 font-black uppercase tracking-tighter">Hệ thống</span>}
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="px-3 py-1 bg-blue-50 rounded-lg font-mono text-xs font-bold text-blue-700 border border-blue-100 uppercase tracking-wider">
                      {role.code}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-start gap-2 text-sm text-slate-600 leading-relaxed group-hover:text-blue-900">
                      <Info size={14} className="shrink-0 mt-1 opacity-40 text-blue-500" />
                      {role.description}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                      <button
                        onClick={() => onEdit(role)}
                        className="p-2.5 text-blue-400 hover:text-blue-700 hover:bg-white rounded-xl transition-all shadow-sm border border-transparent hover:border-blue-100"
                        title="Chỉnh sửa"
                      >
                        <Edit2 size={18} />
                      </button>
                      {!role.isSystem && (
                        <button
                          onClick={() => onDelete(role.id)}
                          className="p-2.5 text-rose-400 hover:text-rose-600 hover:bg-white rounded-xl transition-all shadow-sm border border-transparent hover:border-blue-100"
                          title="Xóa"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
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

export default RoleTable;
