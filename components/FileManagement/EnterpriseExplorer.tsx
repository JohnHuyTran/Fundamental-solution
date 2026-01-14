
import React, { useState } from 'react';
import { FileItem, UserRole, FileVersion } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';
// Added Cloud, History to lucide-react imports
import { Folder, FileText, FileImage, Archive, Search, Grid, List, Plus, Upload, ChevronRight, Share2, Eye, History, RotateCcw, Clock, User as UserIcon, X, CheckCircle2, HardDrive, ChevronDown, Cloud } from 'lucide-react';
import ShareModal from './ShareModal';
import FilePreview from './FilePreview';

interface Props { 
  files: FileItem[];
  onUpdateFile: (file: FileItem) => void;
  userUsed: number;
  userLimit: number;
  role: UserRole;
}

const EnterpriseExplorer: React.FC<Props> = ({ files, onUpdateFile, userUsed, userLimit, role }) => {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [currentParent, setCurrentParent] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

  // Modals state
  const [selectedFileForShare, setSelectedFileForShare] = useState<FileItem | null>(null);
  const [selectedFileForPreview, setSelectedFileForPreview] = useState<FileItem | null>(null);
  const [selectedFileForVersions, setSelectedFileForVersions] = useState<FileItem | null>(null);

  const isAdmin = role === UserRole.ADMIN;
  const currentFiles = files.filter(f => f.parentId === currentParent && f.name.toLowerCase().includes(search.toLowerCase()));
  const usagePercent = Math.round((userUsed / userLimit) * 100);

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const next = new Set(expandedFolders);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpandedFolders(next);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'folder': return <Folder className="text-amber-500" size={view === 'grid' ? 48 : 20} />;
      case 'image': return <FileImage className="text-blue-500" size={view === 'grid' ? 48 : 20} />;
      case 'document': return <FileText className="text-emerald-500" size={view === 'grid' ? 48 : 20} />;
      case 'archive': return <Archive className="text-indigo-500" size={view === 'grid' ? 48 : 20} />;
      default: return <FileText size={view === 'grid' ? 48 : 20} />;
    }
  };

  const renderTree = (parentId: string | null = null, depth = 0) => {
    const folders = files.filter(f => f.type === 'folder' && f.parentId === parentId);
    return folders.map(folder => {
      const isExpanded = expandedFolders.has(folder.id);
      const isSelected = currentParent === folder.id;
      return (
        <div key={folder.id} className="select-none">
          <div 
            onClick={() => setCurrentParent(folder.id)}
            className={`flex items-center gap-2 p-2 rounded-xl cursor-pointer transition-all ${isSelected ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-blue-50 text-slate-600'}`}
            style={{ marginLeft: `${depth * 12}px` }}
          >
            <button onClick={(e) => toggleExpand(folder.id, e)} className="p-1 hover:bg-white/10 rounded">
              {files.some(f => f.parentId === folder.id && f.type === 'folder') ? (
                isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />
              ) : <div className="w-3.5" />}
            </button>
            <Folder size={16} className={isSelected ? 'text-white' : 'text-amber-500'} />
            <span className="text-xs font-bold truncate">{folder.name}</span>
          </div>
          {isExpanded && renderTree(folder.id, depth + 1)}
        </div>
      );
    });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 h-[800px] animate-in fade-in duration-700">
      <aside className="w-full lg:w-80 flex flex-col gap-8 h-full">
         <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-blue-50 flex-1 overflow-y-auto custom-scrollbar">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Directory Structure</h4>
            <div className="space-y-1">
               <button onClick={() => setCurrentParent(null)} className={`w-full flex items-center gap-3 p-3 rounded-xl font-black text-xs transition-all ${currentParent === null ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}>
                  <HardDrive size={18} /> Root Access
               </button>
               <div className="pt-2">
                 {renderTree(null)}
               </div>
            </div>
         </div>

         <div className="bg-indigo-950 p-8 rounded-[2.5rem] shadow-2xl text-white">
            <div className="flex items-center gap-3 mb-4">
               <Cloud size={20} className="text-indigo-400" />
               <p className="text-[10px] font-black uppercase tracking-widest">Enterprise Cloud Status</p>
            </div>
            <div className="mb-4">
               <div className="flex justify-between mb-2">
                  <span className="text-xs font-bold">{userUsed} GB Used</span>
                  <span className="text-xs font-bold text-indigo-400">{userLimit} GB</span>
               </div>
               <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 transition-all duration-1000" style={{ width: `${usagePercent}%` }}></div>
               </div>
            </div>
         </div>
      </aside>

      <main className="flex-1 bg-white rounded-[3rem] shadow-2xl border border-blue-50 flex flex-col overflow-hidden">
         <div className="px-10 py-8 border-b border-slate-100 flex flex-wrap gap-6 items-center justify-between bg-slate-50/20">
            <div className="flex items-center gap-4 flex-1 max-md:hidden">
               <div className="relative w-full group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500" size={18} />
                  <input 
                    type="text" 
                    placeholder="Tìm kiếm tệp tin..." 
                    className="w-full pl-12 pr-4 py-3 bg-white border-2 border-slate-100 rounded-2xl outline-none focus:border-blue-500 transition-all font-bold text-sm"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
               </div>
            </div>
            <div className="flex items-center gap-4">
               <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-inner">
                  <button onClick={() => setView('grid')} className={`p-2.5 rounded-xl transition-all ${view === 'grid' ? 'bg-white text-blue-600 shadow-md' : 'text-slate-400'}`}><Grid size={20} /></button>
                  <button onClick={() => setView('list')} className={`p-2.5 rounded-xl transition-all ${view === 'list' ? 'bg-white text-blue-600 shadow-md' : 'text-slate-400'}`}><List size={20} /></button>
               </div>
               <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase shadow-lg hover:bg-blue-700 transition-all">
                  <Upload size={18} /> Upload
               </button>
               <button className="p-3 bg-slate-900 text-white rounded-2xl hover:bg-blue-600 transition-all">
                  <Plus size={24} />
               </button>
            </div>
         </div>

         <div className="flex-1 overflow-y-auto p-10">
            <AnimatePresence mode="wait">
               {view === 'grid' ? (
                 <motion.div 
                   key="grid"
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, y: -20 }}
                   className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-8"
                 >
                    {currentFiles.map(file => (
                      <div 
                        key={file.id} 
                        className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 hover:border-blue-400 hover:bg-white hover:shadow-2xl hover:-translate-y-2 transition-all group relative cursor-pointer"
                        onDoubleClick={() => file.type === 'folder' ? setCurrentParent(file.id) : setSelectedFileForPreview(file)}
                      >
                         <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-2 z-10">
                            {/* Nút Chia sẻ */}
                            <button 
                              onClick={(e) => { e.stopPropagation(); setSelectedFileForShare(file); }}
                              className="p-2 bg-white text-blue-600 rounded-lg shadow-sm hover:bg-blue-600 hover:text-white transition-all border border-blue-50"
                              title="Chia sẻ"
                            >
                               <Share2 size={14} />
                            </button>
                            {/* Nút Lịch sử Phiên bản */}
                            {file.type !== 'folder' && (
                              <button 
                                onClick={(e) => { e.stopPropagation(); setSelectedFileForVersions(file); }}
                                className="p-2 bg-white text-indigo-600 rounded-lg shadow-sm hover:bg-indigo-600 hover:text-white transition-all border border-indigo-50"
                                title="Lịch sử phiên bản"
                              >
                                 <History size={14} />
                              </button>
                            )}
                         </div>
                         <div className="mb-6 flex justify-center transform group-hover:scale-110 transition-transform duration-500">
                            {getIcon(file.type)}
                         </div>
                         <div className="text-center">
                            <p className="font-black text-slate-800 text-sm truncate px-2" title={file.name}>{file.name}</p>
                            <p className="text-[9px] font-black text-slate-400 uppercase mt-1">{(file.size / 1024 / 1024).toFixed(1)} MB</p>
                            {file.signature?.isValid && (
                              <div className="flex justify-center mt-2">
                                <CheckCircle2 size={14} className="text-emerald-500" />
                              </div>
                            )}
                         </div>
                      </div>
                    ))}
                 </motion.div>
               ) : (
                 <motion.div 
                   key="list"
                   initial={{ opacity: 0, x: 20 }}
                   animate={{ opacity: 1, x: 0 }}
                   className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm"
                 >
                    <table className="w-full text-left">
                       <thead className="bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest">
                          <tr>
                             <th className="px-8 py-5">Tên tệp</th>
                             <th className="px-8 py-5">Dung lượng</th>
                             <th className="px-8 py-5">Cập nhật</th>
                             <th className="px-8 py-5 text-right">Thao tác</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-50 font-bold text-sm text-slate-600">
                          {currentFiles.map(file => (
                            <tr key={file.id} className="hover:bg-blue-50 transition-colors group cursor-pointer" onDoubleClick={() => file.type === 'folder' ? setCurrentParent(file.id) : setSelectedFileForPreview(file)}>
                               <td className="px-8 py-4 flex items-center gap-4">
                                  {getIcon(file.type)}
                                  <div className="flex flex-col">
                                    <span className="font-black text-slate-800">{file.name}</span>
                                    {file.signature?.isValid && <span className="text-[9px] text-emerald-600 font-black uppercase">Digitally Signed</span>}
                                  </div>
                               </td>
                               <td className="px-8 py-4">{(file.size / 1024 / 1024).toFixed(2)} MB</td>
                               <td className="px-8 py-4 text-slate-400 text-xs">{file.updatedAt}</td>
                               <td className="px-8 py-4 text-right">
                                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                     <button onClick={(e) => { e.stopPropagation(); setSelectedFileForShare(file); }} className="p-2 hover:bg-white rounded-lg text-blue-600" title="Chia sẻ"><Share2 size={16} /></button>
                                     {file.type !== 'folder' && (
                                       <button onClick={(e) => { e.stopPropagation(); setSelectedFileForVersions(file); }} className="p-2 hover:bg-white rounded-lg text-indigo-600" title="Phiên bản"><History size={16} /></button>
                                     )}
                                     <button onClick={(e) => { e.stopPropagation(); setSelectedFileForPreview(file); }} className="p-2 hover:bg-white rounded-lg text-emerald-600" title="Xem"><Eye size={16} /></button>
                                  </div>
                               </td>
                            </tr>
                          ))}
                       </tbody>
                    </table>
                 </motion.div>
               )}
            </AnimatePresence>
         </div>
      </main>

      {/* Modal Lịch sử Phiên bản nhanh (Từ File Card) */}
      <AnimatePresence>
        {selectedFileForVersions && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col h-[500px]"
            >
              <div className="p-8 border-b border-slate-100 bg-indigo-50/50 flex justify-between items-center">
                 <div className="flex items-center gap-4">
                    <div className="p-3 bg-indigo-600 text-white rounded-2xl shadow-lg"><History size={24} /></div>
                    <div>
                       <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">Lịch sử {selectedFileForVersions.name}</h3>
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Quay lui trạng thái tệp tin</p>
                    </div>
                 </div>
                 <button onClick={() => setSelectedFileForVersions(null)} className="p-2 hover:bg-white rounded-full text-slate-400"><X size={24} /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-8 space-y-4">
                 {selectedFileForVersions.versions?.map((v, i) => (
                    <div key={v.id} className={`p-5 rounded-2xl border-2 flex items-center justify-between ${i === 0 ? 'border-emerald-500 bg-emerald-50/20' : 'border-slate-50 bg-slate-50/50 hover:border-indigo-100'}`}>
                       <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-lg flex flex-col items-center justify-center font-black ${i === 0 ? 'bg-emerald-600 text-white' : 'bg-white text-slate-400 border shadow-sm'}`}>
                             <span className="text-[7px]">V</span><span>{v.version}</span>
                          </div>
                          <div>
                             <p className="text-sm font-bold text-slate-700">{v.comment}</p>
                             <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{v.updatedAt} • {v.updatedBy}</p>
                          </div>
                       </div>
                       {i !== 0 && (
                          <button className="p-2 text-indigo-600 hover:bg-white rounded-lg shadow-sm border border-indigo-50">
                             <RotateCcw size={16} />
                          </button>
                       )}
                    </div>
                 ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Share Modal Integration */}
      {selectedFileForShare && (
        <ShareModal 
          isOpen={!!selectedFileForShare} 
          onClose={() => setSelectedFileForShare(null)} 
          fileName={selectedFileForShare.name}
          isAdmin={isAdmin}
        />
      )}

      {/* Preview Modal Integration */}
      {selectedFileForPreview && (
        <FilePreview 
          isOpen={!!selectedFileForPreview}
          onClose={() => setSelectedFileForPreview(null)}
          file={selectedFileForPreview}
          onShare={(f) => { setSelectedFileForPreview(null); setSelectedFileForShare(f); }}
          onUpdateFile={onUpdateFile}
          role={role}
          canDownload={true} 
        />
      )}
    </div>
  );
};

export default EnterpriseExplorer;
