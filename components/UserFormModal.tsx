
import React, { useState, useEffect } from 'react';
import { User, UserRole, UserStatus } from '../types';
import { DEPARTMENTS, ROLES, STATUSES } from '../constants';
import { X, Sparkles, ShieldCheck, Mail, Phone, User as UserIcon } from 'lucide-react';
import { suggestUserRole } from '../services/geminiService';

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: Partial<User>) => void;
  user?: User | null;
}

const UserFormModal: React.FC<UserFormModalProps> = ({ isOpen, onClose, onSave, user }) => {
  // Fix: Changed UserRole.VIEWER to UserRole.USER as VIEWER is not a valid enum member
  const [formData, setFormData] = useState<Partial<User>>({
    fullName: '',
    username: '',
    email: '',
    phone: '',
    role: UserRole.USER,
    department: 'Kỹ thuật',
    status: UserStatus.ACTIVE
  });
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [isSuggesting, setIsSuggesting] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData(user);
    } else {
      // Fix: Changed UserRole.VIEWER to UserRole.USER
      setFormData({
        fullName: '',
        username: '',
        email: '',
        phone: '',
        role: UserRole.USER,
        department: 'Kỹ thuật',
        status: UserStatus.ACTIVE
      });
    }
  }, [user, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSuggest = async () => {
    if (!formData.department) return;
    setIsSuggesting(true);
    const desc = "Nhân viên xử lý các yêu cầu hỗ trợ và cập nhật dữ liệu hệ thống";
    const result = await suggestUserRole(formData.department, desc);
    setSuggestion(result || null);
    setIsSuggesting(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h2 className="text-2xl font-black text-slate-800">
            {user ? 'Cập nhật thông tin' : 'Tạo người dùng mới'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <X size={24} className="text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                  <UserIcon size={16} className="text-blue-500" /> Họ và tên
                </label>
                <input
                  type="text"
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                  placeholder="Ví dụ: Nguyễn Văn A"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Tên đăng nhập</label>
                <input
                  type="text"
                  name="username"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                  placeholder="Ví dụ: vana88"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                  <Mail size={16} className="text-blue-500" /> Địa chỉ Email
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                  placeholder="vana@congty.com"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                  <Phone size={16} className="text-blue-500" /> Số điện thoại
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                  placeholder="090 123 4567"
                />
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                  <ShieldCheck size={16} className="text-blue-500" /> Vai trò truy cập
                </label>
                <div className="flex gap-2">
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-medium text-slate-700"
                  >
                    {ROLES.map(role => <option key={role} value={role}>{role}</option>)}
                  </select>
                  <button
                    type="button"
                    onClick={handleSuggest}
                    disabled={isSuggesting}
                    className="px-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors flex items-center justify-center shadow-sm"
                    title="AI Gợi ý vai trò"
                  >
                    <Sparkles size={20} className={isSuggesting ? 'animate-spin' : ''} />
                  </button>
                </div>
                {suggestion && (
                  <div className="mt-3 text-xs text-blue-700 bg-blue-50 p-3 rounded-xl border border-blue-100 italic leading-relaxed shadow-inner">
                    <strong>Gợi ý từ AI:</strong> {suggestion}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Phòng ban</label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-medium text-slate-700"
                >
                  {DEPARTMENTS.map(dept => <option key={dept} value={dept}>{dept}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Trạng thái tài khoản</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-medium text-slate-700"
                >
                  {STATUSES.map(st => <option key={st} value={st}>{st}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="mt-10 flex justify-end gap-4 border-t border-slate-100 pt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-3 text-slate-500 font-bold hover:bg-slate-100 rounded-2xl transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="px-10 py-3 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-xl shadow-blue-200 transition-all active:scale-95"
            >
              {user ? 'Lưu thay đổi' : 'Xác nhận tạo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserFormModal;
