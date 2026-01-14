
import React, { useState } from 'react';
import { User } from '../types';
import { X, Mail, Key, ShieldAlert } from 'lucide-react';

interface PasswordResetModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

const PasswordResetModal: React.FC<PasswordResetModalProps> = ({ isOpen, onClose, user }) => {
  const [method, setMethod] = useState<'email' | 'manual'>('email');
  const [newPassword, setNewPassword] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen || !user) return null;

  const handleReset = async () => {
    setIsSending(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSending(false);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-xl font-black text-slate-800">Đặt lại mật khẩu</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full">
            <X size={24} className="text-slate-400" />
          </button>
        </div>

        <div className="p-8">
          <div className="mb-8 flex gap-2 bg-slate-100 p-1.5 rounded-2xl">
            <button
              onClick={() => setMethod('email')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${method === 'email' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <Mail size={18} /> Gửi Email
            </button>
            <button
              onClick={() => setMethod('manual')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${method === 'manual' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <Key size={18} /> Đặt thủ công
            </button>
          </div>

          <div className="mb-8 p-4 bg-blue-50/50 rounded-2xl border border-blue-100">
            <p className="text-slate-600 text-sm font-medium">
              Thiết lập lại mật khẩu cho <strong>{user.fullName}</strong>.
            </p>
          </div>

          {method === 'manual' && (
            <div className="mb-8">
              <label className="block text-sm font-bold text-slate-700 mb-2">Mật khẩu mới</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                placeholder="••••••••"
              />
              <div className="mt-3 flex items-start gap-2 text-amber-600 bg-amber-50 p-3 rounded-xl border border-amber-100">
                <ShieldAlert size={16} className="shrink-0 mt-0.5" />
                <span className="text-[11px] font-bold leading-normal uppercase tracking-wider">Lưu ý: Bạn cần thông báo trực tiếp mật khẩu này cho người dùng.</span>
              </div>
            </div>
          )}

          {success ? (
            <div className="bg-emerald-50 text-emerald-700 p-6 rounded-2xl text-center font-black mb-4 shadow-inner border border-emerald-100">
              {method === 'email' ? 'Đã gửi link đặt lại mật khẩu!' : 'Mật khẩu đã được cập nhật!'}
            </div>
          ) : (
            <button
              onClick={handleReset}
              disabled={isSending}
              className={`w-full py-4 rounded-2xl font-black text-white transition-all shadow-xl ${isSending ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200 active:scale-[0.98]'}`}
            >
              {isSending ? 'Đang xử lý...' : method === 'email' ? 'Gửi hướng dẫn qua Email' : 'Cập nhật mật khẩu'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PasswordResetModal;
