
import React, { useState, useEffect } from 'react';
import { RoleDefinition } from '../types';
import { X, Shield, Code, FileText } from 'lucide-react';

interface RoleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (role: Partial<RoleDefinition>) => void;
  role?: RoleDefinition | null;
}

const RoleFormModal: React.FC<RoleFormModalProps> = ({ isOpen, onClose, onSave, role }) => {
  const [formData, setFormData] = useState<Partial<RoleDefinition>>({
    name: '',
    code: '',
    description: ''
  });

  useEffect(() => {
    if (role) {
      setFormData(role);
    } else {
      setFormData({ name: '', code: '', description: '' });
    }
  }, [role, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'code' ? value.toUpperCase().replace(/\s+/g, '_') : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-xl">
              <Shield size={24} />
            </div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">
              {role ? 'Cập nhật vai trò' : 'Định nghĩa vai trò mới'}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <X size={24} className="text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                Tên vai trò
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
                placeholder="Ví dụ: Kiểm soát viên"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                <Code size={16} className="text-indigo-500" /> Mã code (ID)
              </label>
              <input
                type="text"
                name="code"
                required
                disabled={role?.isSystem}
                value={formData.code}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-mono text-sm font-bold disabled:opacity-50"
                placeholder="KIEM_SOAT_VIEN"
              />
              <p className="mt-1 text-[10px] text-slate-400 font-bold uppercase italic tracking-widest">Tự động viết hoa và chuyển dấu cách thành gạch dưới</p>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                <FileText size={16} className="text-indigo-500" /> Mô tả nhiệm vụ
              </label>
              <textarea
                name="description"
                rows={4}
                required
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium resize-none"
                placeholder="Nhập chi tiết các quyền hạn hoặc ghi chú cho vai trò này..."
              />
            </div>
          </div>

          <div className="mt-10 flex justify-end gap-4 border-t border-slate-100 pt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-3 text-slate-500 font-bold hover:bg-slate-100 rounded-2xl transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-10 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl shadow-xl shadow-indigo-100 transition-all active:scale-95"
            >
              {role ? 'Cập nhật' : 'Xác nhận tạo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoleFormModal;
