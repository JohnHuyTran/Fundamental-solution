
import React, { useState } from 'react';
import { X, Download, Share2, Info, FileText, FileImage, Archive, Folder, ShieldAlert, Lock, User as UserIcon, Calendar, Clock, HardDrive, Hash, UserCheck, FileCode, Tag, History, CheckCircle2, RotateCcw, PenTool, ShieldCheck, Loader2 } from 'lucide-react';
import { FileItem, UserRole, DigitalSignature } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';

interface FilePreviewProps {
  file: FileItem;
  isOpen: boolean;
  onClose: () => void;
  onShare: (file: FileItem) => void;
  onUpdateFile?: (file: FileItem) => void;
  role: UserRole;
  canDownload: boolean;
}

const FilePreview: React.FC<FilePreviewProps> = ({ file, isOpen, onClose, onShare, onUpdateFile, role, canDownload }) => {
  const [activeTab, setActiveTab] = useState<'preview' | 'versions' | 'signature'>('preview');
  const [isSigning, setIsSigning] = useState(false);

  if (!isOpen) return null;

  const isAdmin = role === UserRole.ADMIN;
  const finalCanDownload = isAdmin || canDownload;

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleSign = () => {
    if (file.type === 'folder') return;
    
    setIsSigning(true);
    // Giả lập luồng ký số: Hash -> Certificate -> Sign
    setTimeout(() => {
      const newSignature: DigitalSignature = {
        id: `sig-${Math.random().toString(36).substr(2, 6)}`,
        signedBy: role === UserRole.ADMIN ? 'Hệ thống Quản trị (Admin)' : 'Người dùng Ủy quyền',
        signedAt: new Date().toLocaleString('vi-VN'),
        certificateId: `CERT-OMNI-${Math.random().toString(36).toUpperCase().substr(0, 8)}`,
        hash: `sha256:${Math.random().toString(36).substr(2, 32)}${Math.random().toString(36).substr(2, 32)}`,
        isValid: true
      };

      const updatedFile: FileItem = {
        ...file,
        signature: newSignature
      };

      if (onUpdateFile) {
        onUpdateFile(updatedFile);
      }
      
      setIsSigning(false);
      setActiveTab('signature');
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center bg-slate-900/95 backdrop-blur-2xl p-6 md:p-12 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-7xl h-full max-h-[95vh] rounded-[3.5rem] shadow-2xl overflow-hidden flex flex-col border-8 border-white/10 ring-1 ring-white/20">
        
        {/* Header Section */}
        <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-white/90 backdrop-blur-md">
          <div className="flex items-center gap-6">
            <div className={`p-5 rounded-3xl shadow-xl shadow-blue-500/10 ${file.type === 'folder' ? 'bg-amber-50 text-amber-500' : 'bg-blue-50 text-blue-600'}`}>
              {file.type === 'image' ? <FileImage size={28} /> : file.type === 'folder' ? <Folder size={28} /> : <FileText size={28} />}
            </div>
            <div>
              <div className="flex items-center gap-3">
                 <h2 className="text-2xl font-black text-slate-800 leading-none tracking-tight">{file.name}</h2>
                 {file.signature?.isValid && (
                   <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase border border-emerald-100 shadow-sm"
                   >
                      <ShieldCheck size={12} /> Digitally Signed
                   </motion.span>
                 )}
              </div>
              <div className="flex gap-4 mt-3">
                 <button onClick={() => setActiveTab('preview')} className={`text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-lg transition-all ${activeTab === 'preview' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-blue-600'}`}>Xem trước</button>
                 {file.type !== 'folder' && (
                   <>
                     <button onClick={() => setActiveTab('versions')} className={`text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-lg transition-all ${activeTab === 'versions' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-blue-600'}`}>Phiên bản ({file.versions?.length || 1})</button>
                     <button onClick={() => setActiveTab('signature')} className={`text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-lg transition-all ${activeTab === 'signature' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-blue-600'}`}>Ký số & Bảo mật</button>
                   </>
                 )}
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-slate-100 rounded-full text-slate-400 transition-all active:scale-90 border border-transparent hover:border-slate-200">
            <X size={36} />
          </button>
        </div>

        {/* Content Layout */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden bg-slate-50/50">
          
          <div className="flex-1 p-10 overflow-y-auto relative flex items-center justify-center bg-slate-100/50">
             <AnimatePresence mode="wait">
                {activeTab === 'preview' && (
                  <motion.div key="preview" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full h-full flex flex-col items-center justify-center">
                    {file.type === 'image' ? (
                       <img src={`https://picsum.photos/seed/${file.id}/1600/1000`} className="max-h-[60vh] rounded-2xl shadow-2xl object-contain" alt={file.name} />
                    ) : (
                       <div className="p-24 bg-white rounded-[4rem] shadow-2xl flex flex-col items-center gap-10 border border-slate-100 max-w-2xl text-center">
                          <div className={`w-48 h-48 rounded-[3rem] flex items-center justify-center shadow-inner ${file.type === 'folder' ? 'bg-amber-50 text-amber-500' : 'bg-blue-50 text-blue-600'}`}>
                            {file.type === 'folder' ? <Folder size={96} /> : <FileText size={96} />}
                          </div>
                          <div>
                            <h3 className="text-3xl font-black text-slate-800 uppercase tracking-tighter mb-4">Enterprise Reader</h3>
                            <p className="text-slate-400 font-medium leading-relaxed">
                              {file.type === 'folder' 
                                ? "Đây là thư mục hệ thống. Vui lòng mở rộng để xem các tệp tin con." 
                                : "Hệ thống đang bảo vệ tài liệu bằng hạ tầng OmniGuard. Nội dung tệp tin đã được mã hóa AES-256."}
                            </p>
                          </div>
                       </div>
                    )}
                  </motion.div>
                )}

                {activeTab === 'versions' && (
                  <motion.div key="versions" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="w-full max-w-3xl space-y-4">
                    <h4 className="text-xl font-black text-slate-800 uppercase tracking-tight mb-6">Lịch sử thay đổi (Versioning)</h4>
                    {file.versions && file.versions.length > 0 ? (
                      file.versions.map((v, idx) => (
                        <div key={v.id} className={`p-6 rounded-[2rem] border-2 transition-all flex items-center justify-between ${idx === 0 ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-500/20' : 'bg-white border-slate-100 hover:border-blue-200'}`}>
                          <div className="flex items-center gap-6">
                            <div className={`w-12 h-12 rounded-2xl flex flex-col items-center justify-center text-xs font-black ${idx === 0 ? 'bg-white text-blue-600' : 'bg-slate-100 text-slate-400'}`}>
                                <span>v</span><span className="text-lg leading-none">{v.version}</span>
                            </div>
                            <div>
                                <p className="font-bold text-sm">{v.comment}</p>
                                <div className="flex gap-4 text-[10px] uppercase font-black opacity-60 mt-1">
                                  <span>{v.updatedBy}</span>
                                  <span>{v.updatedAt}</span>
                                  <span>{formatSize(v.size)}</span>
                                </div>
                            </div>
                          </div>
                          {idx !== 0 && (
                            <button className="flex items-center gap-2 px-6 py-3 bg-blue-50 text-blue-600 rounded-xl font-black text-[10px] uppercase hover:bg-blue-600 hover:text-white transition-all">
                              <RotateCcw size={14} /> Rollback
                            </button>
                          )}
                          {idx === 0 && <span className="bg-white/20 px-3 py-1 rounded-lg text-[9px] font-black uppercase">Current Active</span>}
                        </div>
                      ))
                    ) : (
                      <div className="p-10 bg-white rounded-3xl border border-dashed border-slate-200 text-center">
                        <History size={48} className="mx-auto text-slate-200 mb-4" />
                        <p className="text-slate-400 font-bold">Chưa có lịch sử phiên bản cho tệp tin này.</p>
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === 'signature' && (
                  <motion.div key="signature" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-blue-50 flex flex-col">
                        <h4 className="text-xl font-black text-slate-800 uppercase tracking-tight mb-8">Digital Signature Status</h4>
                        <div className="flex-1">
                          {file.signature?.isValid ? (
                            <div className="space-y-6">
                               <motion.div 
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="p-6 bg-emerald-50 rounded-[2rem] border border-emerald-100 text-center"
                               >
                                  <div className="w-16 h-16 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/30">
                                     <CheckCircle2 size={32} />
                                  </div>
                                  <p className="text-emerald-700 font-black text-lg">XÁC THỰC THÀNH CÔNG</p>
                                  <p className="text-emerald-600/60 text-[10px] font-bold uppercase tracking-widest">Integrity Verified: No Tampering</p>
                               </motion.div>
                               <div className="space-y-4">
                                  <div className="flex justify-between text-xs font-bold border-b border-slate-50 pb-2"><span className="text-slate-400">Người ký</span><span className="text-slate-800">{file.signature.signedBy}</span></div>
                                  <div className="flex justify-between text-xs font-bold border-b border-slate-50 pb-2"><span className="text-slate-400">Thời gian</span><span className="text-slate-800">{file.signature.signedAt}</span></div>
                                  <div className="flex justify-between text-xs font-bold border-b border-slate-50 pb-2"><span className="text-slate-400">Cert ID</span><span className="text-blue-600 font-mono tracking-tighter">{file.signature.certificateId}</span></div>
                                  <div className="p-4 bg-slate-50 rounded-2xl">
                                     <p className="text-[9px] font-black text-slate-400 uppercase mb-2">Payload Hash (SHA-256)</p>
                                     <p className="text-[9px] font-mono text-slate-500 break-all leading-tight">{file.signature.hash}</p>
                                  </div>
                               </div>
                            </div>
                          ) : (
                            <div className="py-10 text-center flex flex-col items-center justify-center h-full">
                               <div className="relative mb-8">
                                 {isSigning && (
                                   <div className="absolute inset-0 flex items-center justify-center">
                                      <Loader2 size={80} className="text-blue-500 animate-spin opacity-40" />
                                   </div>
                                 )}
                                 <PenTool size={64} className={`text-slate-200 ${isSigning ? 'animate-pulse' : ''}`} />
                               </div>
                               <p className="text-slate-400 font-bold mb-8 max-w-xs mx-auto">Tài liệu này hiện chưa có lớp bảo mật ký số điện tử.</p>
                               <button 
                                 onClick={handleSign}
                                 disabled={isSigning}
                                 className="px-12 py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-blue-500/20 hover:bg-blue-700 disabled:opacity-50 flex items-center gap-3 transition-all active:scale-95"
                               >
                                  {isSigning ? (
                                    <>
                                      <Loader2 size={18} className="animate-spin" />
                                      Đang tạo Hash & Sign...
                                    </>
                                  ) : (
                                    <>
                                      <PenTool size={18} />
                                      Ký số tài liệu ngay
                                    </>
                                  )}
                               </button>
                            </div>
                          )}
                        </div>
                     </div>

                     <div className="bg-indigo-950 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden flex flex-col">
                        <ShieldCheck className="absolute -right-12 -top-12 w-64 h-64 text-white/5 rotate-12" />
                        <div className="relative z-10">
                          <h4 className="text-xl font-black mb-6 flex items-center gap-3 uppercase tracking-widest"><ShieldCheck size={24} className="text-indigo-400" /> OmniSign Security</h4>
                          <p className="text-sm font-medium opacity-80 leading-relaxed mb-8">Hệ thống ký số OmniSign áp dụng thuật toán RSA-4096 phối hợp với chứng thư số nội bộ cấp bởi Cloud Security Center.</p>
                          
                          <div className="space-y-4">
                             <div className="flex items-center gap-3 bg-white/5 p-4 rounded-2xl border border-white/10">
                                <CheckCircle2 size={18} className="text-indigo-400" />
                                <span className="text-[10px] font-black uppercase tracking-wider">Mã hóa bất đối xứng PKI</span>
                             </div>
                             <div className="flex items-center gap-3 bg-white/5 p-4 rounded-2xl border border-white/10">
                                <CheckCircle2 size={18} className="text-indigo-400" />
                                <span className="text-[10px] font-black uppercase tracking-wider">Chống chối bỏ (Non-repudiation)</span>
                             </div>
                             <div className="flex items-center gap-3 bg-white/5 p-4 rounded-2xl border border-white/10">
                                <CheckCircle2 size={18} className="text-indigo-400" />
                                <span className="text-[10px] font-black uppercase tracking-wider">Timestamp RFC 3161</span>
                             </div>
                          </div>
                        </div>
                        <div className="mt-auto pt-8 flex items-center gap-3 text-indigo-400 border-t border-white/10">
                          <Info size={16} />
                          <p className="text-[9px] font-bold uppercase tracking-widest">Tuân thủ tiêu chuẩn ISO/IEC 27001</p>
                        </div>
                     </div>
                  </motion.div>
                )}
             </AnimatePresence>
          </div>

          <aside className="w-full lg:w-[400px] border-l border-slate-200 bg-white p-10 space-y-10 overflow-y-auto custom-scrollbar shadow-2xl">
             <section>
                <div className="flex items-center justify-between mb-6">
                   <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2"><Tag size={14} /> Thuộc tính tệp tin</h4>
                   <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase">Verified</span>
                </div>
                
                <div className="grid grid-cols-1 gap-3">
                   {[
                     { label: 'Kích thước', value: formatSize(file.size), icon: HardDrive },
                     { label: 'Định dạng', value: file.name.split('.').pop()?.toUpperCase() || 'FILE', icon: FileCode },
                     { label: 'Ngày sửa đổi', value: file.updatedAt, icon: Calendar },
                   ].map((item, idx) => (
                     <div key={idx} className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100">
                        <div className="flex items-center gap-3 text-slate-400"><item.icon size={16} /><span className="text-xs font-bold">{item.label}</span></div>
                        <span className="text-sm font-black text-slate-800">{item.value}</span>
                     </div>
                   ))}
                </div>
             </section>

             <section>
                <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2"><Lock size={14} /> Bảo mật & Phân quyền</h4>
                <div className="space-y-4">
                   <div className="flex items-center gap-5 p-5 bg-blue-50/50 rounded-3xl border border-blue-100">
                      <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-blue-200">{file.owner.charAt(0)}</div>
                      <div className="flex-1">
                         <p className="text-sm font-black text-blue-900 leading-none">{file.owner}</p>
                         <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mt-2 flex items-center gap-1.5"><UserCheck size={12} /> Chủ sở hữu</p>
                      </div>
                   </div>
                   <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">Quyền truy cập của bạn</p>
                      <div className="flex flex-wrap gap-2">
                         {['Read', 'Write', 'Sign'].map(p => (
                           <span key={p} className="px-2 py-1 bg-white border border-slate-200 rounded text-[9px] font-black text-slate-600 uppercase tracking-tighter">{p}</span>
                         ))}
                      </div>
                   </div>
                </div>
             </section>
          </aside>
        </div>

        {/* Footer Actions */}
        <div className="p-10 border-t border-slate-50 flex flex-col md:flex-row items-center justify-between bg-white/90 backdrop-blur-md gap-6">
          <div className="flex items-center gap-4 text-slate-400 font-bold text-xs uppercase tracking-[0.2em]">
             <ShieldAlert size={20} className="text-blue-600" /> Được quét bởi OmniGuard: <span className="text-emerald-500 font-black">AN TOÀN</span>
          </div>
          <div className="flex items-center gap-5 w-full md:w-auto">
            <button onClick={() => onShare(file)} className="flex-1 md:flex-none flex items-center justify-center gap-3 px-10 py-5 bg-slate-100 text-slate-700 rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-blue-50 transition-all border border-slate-200"><Share2 size={20} /> Chia sẻ tệp</button>
            <button disabled={!finalCanDownload} className={`flex-1 md:flex-none flex items-center justify-center gap-3 px-12 py-5 text-white rounded-3xl font-black text-xs uppercase tracking-widest shadow-2xl transition-all border-b-4 ${finalCanDownload ? 'bg-blue-600 shadow-blue-500/30 hover:bg-blue-700 border-blue-900' : 'bg-slate-300 cursor-not-allowed border-slate-400'}`}><Download size={20} /> {finalCanDownload ? 'Tải xuống' : 'Tải xuống bị chặn'}</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilePreview;
