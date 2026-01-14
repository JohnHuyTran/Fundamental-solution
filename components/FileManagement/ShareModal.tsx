
import React, { useState } from 'react';
import { X, UserPlus, Link, Settings, Send, ChevronLeft, Globe, Users, Lock, ChevronDown, Calendar, Check, Key, ShieldOff, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileName: string;
  isAdmin: boolean;
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, fileName, isAdmin }) => {
  const [step, setStep] = useState<'main' | 'settings'>('main');
  const [scope, setScope] = useState<'organization' | 'existing' | 'specific'>('organization');
  const [permission, setPermission] = useState<'view' | 'edit'>('view');
  const [blockDownload, setBlockDownload] = useState(false);
  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white w-full max-w-[500px] rounded-[1.5rem] shadow-2xl border border-slate-200 overflow-hidden flex flex-col"
      >
        <AnimatePresence mode="wait">
          {step === 'main' ? (
            <motion.div 
              key="main"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
            >
              <div className="p-6 flex justify-between items-center border-b border-slate-50">
                 <h3 className="text-lg font-bold text-slate-800">Chia sẻ "{fileName}"</h3>
                 <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400"><X size={20} /></button>
              </div>

              <div className="p-6 space-y-6">
                 <div className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-xl focus-within:ring-2 focus-within:ring-blue-500 transition-all">
                    <div className="flex-1 flex items-center gap-3">
                       <UserPlus size={18} className="text-slate-400" />
                       <input 
                         type="text" 
                         placeholder="Thêm tên, nhóm hoặc email" 
                         className="bg-transparent flex-1 outline-none text-sm font-medium"
                       />
                    </div>
                    <div className="flex items-center gap-1 pl-3 border-l border-slate-200 text-slate-500 hover:text-blue-600 cursor-pointer">
                       <span className="text-xs font-bold uppercase">{permission === 'view' ? 'Có thể xem' : 'Có thể sửa'}</span>
                       <ChevronDown size={14} />
                    </div>
                 </div>

                 <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl min-h-[120px]">
                    <textarea 
                      placeholder="Thêm lời nhắn (Thư)..." 
                      className="bg-transparent w-full h-full outline-none text-sm font-medium resize-none text-slate-600"
                    />
                 </div>

                 <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-xl border border-blue-100">
                    <div className="p-2 bg-blue-600 text-white rounded-lg"><Globe size={16} /></div>
                    <div className="flex-1">
                       <p className="text-xs font-bold text-blue-900 leading-none">Cài đặt hiện tại:</p>
                       <p className="text-[10px] text-blue-600 font-medium mt-1">
                         {scope === 'organization' ? 'Mọi người trong tổ chức' : scope === 'existing' ? 'Người có quyền hiện tại' : 'Người cụ thể'} • {permission === 'view' ? 'Chỉ xem' : 'Có thể sửa'}
                         {blockDownload && ' • Không được tải xuống'}
                       </p>
                    </div>
                    <button onClick={() => setStep('settings')} className="text-[10px] font-black uppercase text-blue-600 hover:underline">Thay đổi</button>
                 </div>
              </div>

              <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                 <div className="flex items-center gap-2">
                    <button onClick={handleCopy} className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-blue-600 font-bold text-xs hover:bg-blue-50 transition-all shadow-sm">
                       {copied ? <Check size={14} /> : <Link size={14} />} {copied ? 'Đã chép' : 'Sao chép liên kết'}
                    </button>
                    <button onClick={() => setStep('settings')} className="p-2.5 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-blue-600 transition-all shadow-sm">
                       <Settings size={18} />
                    </button>
                 </div>
                 <button className="flex items-center gap-2 px-8 py-2.5 bg-blue-600 text-white rounded-lg font-bold text-xs shadow-lg shadow-blue-500/20 active:scale-95 transition-all">
                    <Send size={14} /> Gửi
                 </button>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="settings"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 20, opacity: 0 }}
            >
              <div className="p-6 flex items-center gap-4 border-b border-slate-50">
                 <button onClick={() => setStep('main')} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500"><ChevronLeft size={20} /></button>
                 <div>
                    <h3 className="text-lg font-bold text-slate-800 leading-tight">Cài đặt liên kết</h3>
                    <p className="text-[11px] font-medium text-slate-400 truncate max-w-[300px]">{fileName}</p>
                 </div>
              </div>

              <div className="p-6 space-y-4 max-h-[450px] overflow-y-auto custom-scrollbar">
                 <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Liên kết hoạt động cho</p>
                 {[
                   { id: 'organization', title: 'Mọi người trong LG CNS', desc: 'Bắt buộc phải có tài khoản tổ chức.', icon: Globe },
                   { id: 'existing', title: 'Người có quyền truy cập hiện tại', desc: 'Chỉ chia sẻ với người đã có quyền.', icon: Users },
                   { id: 'specific', title: 'Những người bạn chọn', desc: 'Chỉ định qua email cụ thể.', icon: Lock },
                 ].map(opt => (
                   <div 
                     key={opt.id} 
                     onClick={() => setScope(opt.id as any)}
                     className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all ${scope === opt.id ? 'border-blue-600 bg-blue-50/30' : 'border-slate-100 hover:border-slate-200'}`}
                   >
                      <div className={`p-2 rounded-lg ${scope === opt.id ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 text-slate-400'}`}>
                         <opt.icon size={18} />
                      </div>
                      <div className="flex-1">
                         <p className="text-sm font-bold text-slate-800">{opt.title}</p>
                         <p className="text-[11px] text-slate-500 font-medium mt-0.5">{opt.desc}</p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all mt-1 ${scope === opt.id ? 'border-blue-600' : 'border-slate-300'}`}>
                         {scope === opt.id && <div className="w-2.5 h-2.5 bg-blue-600 rounded-full" />}
                      </div>
                   </div>
                 ))}
                 
                 <div className="pt-6 mt-6 border-t border-slate-100 space-y-6">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Xem thêm cài đặt</p>
                    
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-3">
                          <Settings size={18} className="text-slate-400" />
                          <select 
                            value={permission}
                            onChange={(e) => setPermission(e.target.value as any)}
                            className="bg-transparent font-bold text-sm outline-none text-slate-700 cursor-pointer"
                          >
                             <option value="view">Có thể xem</option>
                             <option value="edit">Có thể chỉnh sửa</option>
                          </select>
                       </div>
                    </div>

                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-3">
                          <Calendar size={18} className="text-slate-400" />
                          <div className="flex-1">
                             <input type="text" placeholder="Đặt ngày hết hạn (DD/MM/YYYY)" className="w-full bg-transparent font-bold text-sm outline-none text-slate-700" />
                          </div>
                       </div>
                    </div>

                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-3">
                          <Key size={18} className="text-slate-400" />
                          <div className="flex-1">
                             <input 
                               type="password" 
                               placeholder="Đặt mật khẩu bảo vệ" 
                               className="w-full bg-transparent font-bold text-sm outline-none text-slate-700"
                               value={password}
                               onChange={(e) => setPassword(e.target.value)}
                             />
                          </div>
                       </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                       <div className="flex items-center gap-3">
                          <ShieldOff size={18} className="text-rose-500" />
                          <div>
                            <p className="text-sm font-bold text-slate-800">Chặn tải xuống</p>
                            <p className="text-[10px] text-slate-500">Người nhận chỉ có thể xem online.</p>
                          </div>
                       </div>
                       <button 
                         onClick={() => setBlockDownload(!blockDownload)}
                         className={`w-10 h-6 rounded-full relative transition-all ${blockDownload ? 'bg-blue-600' : 'bg-slate-300'}`}
                       >
                          <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${blockDownload ? 'right-1' : 'left-1'}`} />
                       </button>
                    </div>
                 </div>
              </div>

              <div className="p-6 bg-slate-50/50 flex justify-end">
                 <button onClick={() => setStep('main')} className="px-12 py-3 bg-blue-600 text-white rounded-lg font-bold text-xs uppercase tracking-widest shadow-xl active:scale-95 transition-all">
                    Áp dụng
                 </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default ShareModal;
