
import React, { useState } from 'react';
import { FileItem, UserRole } from '../../types';
import { Folder, FileText, FileImage, Archive, Search, Grid, List, MoreVertical, Upload, Plus, ChevronRight, Download, Trash2, Share2, Edit2, Eye, HardDrive } from 'lucide-react';
import ShareModal from './ShareModal';
import FilePreview from './FilePreview';

interface FileExplorerProps {
  files: FileItem[];
  // Added role to props to determine administrative privileges
  role: UserRole;
}

const FileExplorer: React.FC<FileExplorerProps> = ({ files, role }) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);

  const filteredFiles = files.filter(f => f.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const totalUsedBytes = files.reduce((acc, curr) => acc + curr.size, 0);
  const totalUsedGB = (totalUsedBytes / (1024 * 1024 * 1024)).toFixed(2);
  const quotaLimitGB = 20;
  const usedPercent = Math.min(Math.round((parseFloat(totalUsedGB) / quotaLimitGB) * 100), 100);

  const handleShare = (file: FileItem) => {
    setSelectedFile(file);
    setIsShareModalOpen(true);
  };

  const handlePreview = (file: FileItem) => {
    setSelectedFile(file);
    setIsPreviewOpen(true);
  };

  const getFileIcon = (type: string, color: boolean = true) => {
    switch (type) {
      case 'folder': return <Folder className={color ? 'text-amber-500' : ''} size={viewMode === 'grid' ? 32 : 24} />;
      case 'image': return <FileImage className={color ? 'text-blue-500' : ''} size={viewMode === 'grid' ? 32 : 24} />;
      case 'document': return <FileText className={color ? 'text-emerald-500' : ''} size={viewMode === 'grid' ? 32 : 24} />;
      case 'archive': return <Archive className={color ? 'text-indigo-500' : ''} size={viewMode === 'grid' ? 32 : 24} />;
      default: return <FileText size={viewMode === 'grid' ? 32 : 24} />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500">
      {/* Toolbar */}
      <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl border border-blue-50 mb-8 flex flex-wrap gap-8 items-center justify-between">
        <div className="flex items-center gap-6 flex-1 min-w-[300px]">
          <div className="relative flex-1 group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Tìm kiếm trong bộ lưu trữ..."
              className="w-full pl-16 pr-6 py-4 bg-slate-50 border-2 border-slate-50 rounded-[1.5rem] focus:ring-4 focus:ring-blue-100 focus:border-blue-500 focus:bg-white outline-none font-bold text-sm transition-all shadow-inner"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-inner">
             <button onClick={() => setViewMode('grid')} className={`p-3 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-white shadow-md text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}><Grid size={20} /></button>
             <button onClick={() => setViewMode('list')} className={`p-3 rounded-xl transition-all ${viewMode === 'list' ? 'bg-white shadow-md text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}><List size={20} /></button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="flex items-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-500/30 active:scale-95 hover:bg-blue-700 transition-all border-b-4 border-blue-800">
            <Upload size={18} /> Upload File
          </button>
          <button className="p-4 bg-slate-800 text-white rounded-2xl hover:bg-slate-900 transition-all shadow-lg active:scale-95 border-b-4 border-slate-950">
             <Plus size={24} />
          </button>
        </div>
      </div>

      {/* Quota Mini Bar */}
      <div className="flex items-center justify-between mb-10 px-6">
         <div className="flex items-center gap-3 text-xs font-black text-slate-400 uppercase tracking-[0.2em]">
            <span className="hover:text-blue-600 cursor-pointer transition-colors">Root Storage</span>
            <ChevronRight size={14} className="opacity-40" />
            <span className="text-blue-900 bg-blue-50 px-3 py-1 rounded-lg italic">Cloud Explorer</span>
         </div>
         
         <div className="flex items-center gap-8 bg-white px-8 py-4 rounded-[1.5rem] shadow-xl border border-blue-50">
            <div className="flex items-center gap-3">
               <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  <HardDrive size={18} />
               </div>
               <div className="text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Quota</p>
                  <p className="text-sm font-black text-blue-900">{totalUsedGB} GB / {quotaLimitGB} GB</p>
               </div>
            </div>
            <div className="w-40 h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
               <div 
                  className={`h-full transition-all duration-1000 ${usedPercent > 90 ? 'bg-rose-500' : 'bg-blue-600'}`} 
                  style={{ width: `${usedPercent}%` }}
               ></div>
            </div>
         </div>
      </div>

      {/* Grid/List View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-8">
          {filteredFiles.map(file => (
            <div 
              key={file.id} 
              onClick={() => handlePreview(file)}
              className="bg-white p-8 rounded-[2.5rem] shadow-lg border border-slate-100 hover:shadow-2xl hover:border-blue-400 hover:-translate-y-2 transition-all group relative cursor-pointer"
            >
              <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all flex flex-col gap-2 scale-75 group-hover:scale-100">
                <button 
                  onClick={(e) => { e.stopPropagation(); handleShare(file); }} 
                  className="p-3 bg-white text-blue-600 rounded-2xl shadow-xl border border-blue-50 hover:bg-blue-600 hover:text-white transition-all"
                >
                  <Share2 size={16} />
                </button>
              </div>
              <div className="h-32 flex items-center justify-center mb-6 transform group-hover:scale-110 transition-transform duration-500">
                {getFileIcon(file.type)}
              </div>
              <div className="text-center">
                <p className="font-black text-slate-800 text-sm truncate mb-1" title={file.name}>{file.name}</p>
                <p className="text-[10px] font-black text-slate-300 uppercase italic">{formatFileSize(file.size)}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-[2.5rem] shadow-2xl border border-blue-50 overflow-hidden">
          <table className="w-full text-left border-collapse">
             <thead>
                <tr className="bg-blue-900 text-white">
                   <th className="px-10 py-7 text-[11px] font-black uppercase tracking-widest">Tệp tin</th>
                   <th className="px-10 py-7 text-[11px] font-black uppercase tracking-widest">Dung lượng</th>
                   <th className="px-10 py-7 text-[11px] font-black uppercase tracking-widest">Cập nhật</th>
                   <th className="px-10 py-7 text-[11px] font-black uppercase tracking-widest text-right">Hành động</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-slate-100">
                {filteredFiles.map(file => (
                  <tr key={file.id} onClick={() => handlePreview(file)} className="hover:bg-blue-50 transition-all group cursor-pointer">
                    <td className="px-10 py-6 flex items-center gap-6">
                       {getFileIcon(file.type)}
                       <div>
                          <p className="font-black text-slate-800 text-lg group-hover:text-blue-900 transition-colors mb-0.5">{file.name}</p>
                          <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic">{file.owner}</p>
                       </div>
                    </td>
                    <td className="px-10 py-6 text-sm font-black text-slate-500">{formatFileSize(file.size)}</td>
                    <td className="px-10 py-6 text-sm font-bold text-slate-400">{file.updatedAt}</td>
                    <td className="px-10 py-6 text-right">
                       <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all">
                          <button onClick={(e) => { e.stopPropagation(); handleShare(file); }} className="p-4 text-blue-500 hover:bg-white rounded-2xl shadow-sm border border-transparent hover:border-blue-100 active:scale-90"><Share2 size={20} /></button>
                          <button onClick={(e) => { e.stopPropagation(); handlePreview(file); }} className="p-4 text-emerald-500 hover:bg-white rounded-2xl shadow-sm border border-transparent hover:border-emerald-100 active:scale-90"><Eye size={20} /></button>
                       </div>
                    </td>
                  </tr>
                ))}
             </tbody>
          </table>
        </div>
      )}

      {/* Modals */}
      {selectedFile && (
        <>
          <ShareModal 
            isOpen={isShareModalOpen} 
            onClose={() => setIsShareModalOpen(false)} 
            fileName={selectedFile.name} 
            // Fixed: Added isAdmin property required by ShareModalProps
            isAdmin={role === UserRole.ADMIN}
          />
          <FilePreview 
            isOpen={isPreviewOpen}
            onClose={() => setIsPreviewOpen(false)}
            file={selectedFile}
            onShare={handleShare}
            // Fixed: Added role and canDownload properties required by FilePreviewProps
            role={role}
            canDownload={true}
          />
        </>
      )}
    </div>
  );
};

export default FileExplorer;
