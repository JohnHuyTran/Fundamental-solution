
import React, { useState } from 'react';
import { FileItem, FileVersion } from '../../types';
import { History, Search, RotateCcw, Clock, User, HardDrive, FileText, ChevronRight, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  files: FileItem[];
}

const GlobalVersioning: React.FC<Props> = ({ files }) => {
  const [search, setSearch] = useState('');
  
  // Lọc các file có lịch sử phiên bản
  const filesWithVersions = files.filter(f => 
    f.type !== 'folder' && 
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header & Search */}
      <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl border border-blue-50 flex flex-wrap gap-6 items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl shadow-inner">
            <History size={28} />
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Quản lý Phiên bản Toàn cục</h3>
            <p className="text-sm font-bold text-slate-400">Kiểm soát lịch sử thay đổi của toàn bộ kho lưu trữ.</p>
          </div>
        </div>
        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500" size={20} />
          <input 
            type="text" 
            placeholder="Tìm theo tên tệp..."
            className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl outline-none focus:bg-white focus:border-indigo-500 transition-all font-bold text-sm shadow-inner"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Version List */}
      <div className="grid grid-cols-1 gap-6">
        {filesWithVersions.map(file => (
          <div key={file.id} className="bg-white rounded-[2.5rem] shadow-xl border border-blue-50 overflow-hidden group hover:border-indigo-200 transition-all">
            <div className="p-8 border-b border-slate-50 bg-slate-50/30 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white rounded-xl shadow-sm text-indigo-600">
                  <FileText size={20} />
                </div>
                <div>
                  <p className="font-black text-slate-800 text-lg">{file.name}</p>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <User size={12} /> {file.owner} • <HardDrive size={12} /> {formatSize(file.size)}
                  </p>
                </div>
              </div>
              <span className="px-4 py-1 bg-indigo-600 text-white rounded-full text-[10px] font-black uppercase shadow-lg shadow-indigo-200">
                {file.versions?.length || 1} Versions
              </span>
            </div>

            <div className="p-8 space-y-4">
              {file.versions && file.versions.length > 0 ? (
                file.versions.map((v, idx) => (
                  <div key={v.id} className={`flex items-center justify-between p-5 rounded-2xl border-2 transition-all ${idx === 0 ? 'border-emerald-500 bg-emerald-50/20' : 'border-slate-50 bg-slate-50/50 hover:border-indigo-100'}`}>
                    <div className="flex items-center gap-6">
                      <div className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center font-black ${idx === 0 ? 'bg-emerald-600 text-white' : 'bg-white text-slate-400 border border-slate-100 shadow-sm'}`}>
                        <span className="text-[8px] uppercase leading-none">Ver</span>
                        <span className="text-base leading-none">{v.version}</span>
                      </div>
                      <div>
                        <p className="font-bold text-slate-700 text-sm">{v.comment}</p>
                        <div className="flex items-center gap-4 mt-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          <span className="flex items-center gap-1"><Clock size={10} /> {v.updatedAt}</span>
                          <span className="flex items-center gap-1"><User size={10} /> {v.updatedBy}</span>
                        </div>
                      </div>
                    </div>
                    {idx === 0 ? (
                      <span className="text-[9px] font-black uppercase text-emerald-600 bg-white px-3 py-1.5 rounded-lg border border-emerald-100 shadow-sm">Current Active</span>
                    ) : (
                      <button className="flex items-center gap-2 px-6 py-2.5 bg-white text-indigo-600 border border-indigo-100 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all shadow-sm active:scale-95">
                        <RotateCcw size={14} /> Rollback to this
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <div className="flex items-center gap-3 p-6 bg-amber-50 rounded-2xl border border-amber-100 text-amber-700">
                  <AlertCircle size={20} />
                  <p className="text-xs font-bold italic">Tệp tin này hiện chỉ có một phiên bản gốc duy nhất.</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GlobalVersioning;
