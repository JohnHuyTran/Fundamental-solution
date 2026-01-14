
import React, { useState } from 'react';
import { X, Download, Copy, Check, Printer, FileText, Sparkles, Award, FileCode, Briefcase, FileDown } from 'lucide-react';

interface DocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: string;
  isLoading: boolean;
  docType: 'SRS' | 'BRD';
  featureName: string;
}

const DocumentModal: React.FC<DocumentModalProps> = ({ isOpen, onClose, content, isLoading, docType, featureName }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const docTitleFull = docType === 'SRS' ? 'Đặc tả Yêu cầu Phần mềm (SRS)' : 'Tài liệu Yêu cầu Nghiệp vụ (BRD)';
  const docCode = `${docType}-${featureName.toUpperCase().replace(/\s+/g, '-')}-001`;

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadDocx = () => {
    const header = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>${docTitleFull}</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
          .cover { text-align: center; margin-bottom: 50pt; padding: 40pt; border: 2pt solid #1e3a8a; }
          h1 { color: #1e3a8a; font-size: 28pt; text-transform: uppercase; margin-bottom: 20pt; }
          h2 { color: #1e3a8a; font-size: 18pt; border-bottom: 1pt solid #cbd5e1; padding-bottom: 5pt; margin-top: 25pt; }
          h3 { color: #475569; font-size: 14pt; margin-top: 15pt; }
          p, li { font-size: 12pt; text-align: justify; margin-bottom: 8pt; }
          table { width: 100%; border-collapse: collapse; margin-top: 20pt; }
          th, td { border: 1pt solid #cbd5e1; padding: 10pt; text-align: left; }
          th { background-color: #f8fafc; font-weight: bold; }
          .sig-table td { text-align: center; border: none; padding: 20pt; }
        </style>
      </head>
      <body>
        <div class="cover">
          <p style="font-weight: bold; font-size: 14pt;">OMNICORE TECHNOLOGY SOLUTIONS</p>
          <div style="margin: 60pt 0;">
            <h1>${docTitleFull}</h1>
            <p style="font-size: 16pt; font-weight: bold;">Hệ thống: OmniUser Management Pro</p>
            <p style="font-size: 14pt;">Module: ${featureName}</p>
          </div>
          <p>Mã tài liệu: <b>${docCode}</b> | Phiên bản: 1.0.0</p>
          <p>Ngày lập: ${new Date().toLocaleDateString('vi-VN')}</p>
        </div>
        <br clear="all" style="page-break-before:always" />
    `;

    const footer = `
        <div style="margin-top: 50pt;">
          <h2>XÁC NHẬN PHÊ DUYỆT</h2>
          <table class="sig-table" style="width: 100%;">
            <tr>
              <td><p><b>NGƯỜI LẬP</b></p><br><br><br><p>AI Business Analyst</p></td>
              <td><p><b>KIỂM SOÁT</b></p><br><br><br><p>Project Manager</p></td>
              <td><p><b>PHÊ DUYỆT</b></p><br><br><br><p>Client Representative</p></td>
            </tr>
          </table>
        </div>
      </body>
      </html>
    `;

    const bodyHtml = content
      .replace(/# (.*)/g, '<h1>$1</h1>')
      .replace(/## (.*)/g, '<h2>$1</h2>')
      .replace(/### (.*)/g, '<h3>$1</h3>')
      .replace(/- (.*)/g, '<li>$1</li>')
      .split('\n')
      .map(line => (line.trim() && !line.startsWith('<h') && !line.startsWith('<li')) ? `<p>${line}</p>` : line)
      .join('');

    const source = header + bodyHtml + footer;
    const blob = new Blob(['\ufeff', source], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${docCode}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadPDF = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-blue-950/40 backdrop-blur-md">
      <div className="bg-white w-full max-w-6xl h-[95vh] rounded-[3rem] shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-300 border-8 border-white/50 ring-1 ring-white/20">
        {/* Header */}
        <div className={`px-12 py-8 border-b border-blue-50 text-white flex justify-between items-center shadow-lg ${docType === 'SRS' ? 'bg-gradient-to-r from-blue-900 to-blue-800' : 'bg-gradient-to-r from-indigo-900 to-indigo-800'}`}>
          <div className="flex items-center gap-6">
            <div className="p-4 bg-white/10 backdrop-blur-xl rounded-[1.5rem] shadow-inner ring-1 ring-white/20">
              {docType === 'SRS' ? <FileCode size={32} className="text-blue-200" /> : <Briefcase size={32} className="text-indigo-200" />}
            </div>
            <div>
              <h2 className="text-3xl font-black tracking-tight uppercase leading-none mb-2">{docTitleFull}</h2>
              <div className="flex items-center gap-2 text-white/60 font-black text-xs uppercase tracking-[0.2em]">
                <Sparkles size={14} className="text-amber-400" /> Professional Documentation Standard
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-white/10 rounded-full transition-all active:scale-90 bg-white/5 ring-1 ring-white/10">
            <X size={32} className="text-white" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-12 bg-slate-100/30 print:p-0 print:bg-white">
          {isLoading ? (
            <div className="h-full flex flex-col items-center justify-center gap-8">
              <div className="relative">
                <div className={`w-28 h-28 border-[10px] border-slate-200 rounded-full animate-spin ${docType === 'SRS' ? 'border-t-blue-600' : 'border-t-indigo-600'}`}></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <FileText className={`animate-pulse ${docType === 'SRS' ? 'text-blue-600' : 'text-indigo-600'}`} size={40} />
                </div>
              </div>
              <p className="text-2xl font-black text-slate-400 uppercase tracking-widest animate-pulse">Đang tổng hợp dữ liệu {docType}...</p>
            </div>
          ) : (
            <div className="bg-white p-16 md:p-24 rounded-[3rem] shadow-2xl border border-blue-50 min-h-full mx-auto max-w-5xl print:shadow-none print:border-none print:p-0 print:rounded-none">
              <div className="prose prose-slate max-w-none text-slate-800 leading-relaxed">
                {content.split('\n').map((line, i) => {
                  if (line.startsWith('# ')) return <h1 key={i} className="text-5xl font-black mb-12 text-blue-900 text-center uppercase border-b-8 border-blue-900 pb-8">{line.replace('# ', '')}</h1>;
                  if (line.startsWith('## ')) return <h2 key={i} className="text-3xl font-black mb-6 mt-12 text-blue-800 border-l-8 border-blue-600 pl-6 uppercase tracking-tight">{line.replace('## ', '')}</h2>;
                  if (line.startsWith('### ')) return <h3 key={i} className="text-xl font-black mb-4 mt-8 text-slate-700 italic border-b border-slate-100 pb-2">{line.replace('### ', '')}</h3>;
                  if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) return <li key={i} className="ml-8 mb-2 list-disc font-medium text-slate-600">{line.replace(/^[-*]\s+/, '')}</li>;
                  if (line.trim() === '') return <div key={i} className="h-4"></div>;
                  return <p key={i} className="mb-4 text-justify font-medium text-slate-600 leading-relaxed">{line}</p>;
                })}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="px-12 py-10 border-t border-blue-50 bg-white/80 backdrop-blur-xl flex justify-between items-center print:hidden">
          <div className="flex items-center gap-6">
             <div className="h-14 w-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-lg"><Award size={28} /></div>
             <div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Status: Ready to Export</p>
                <p className="text-base font-bold text-slate-700">Tài liệu đã được tối ưu hóa cho in ấn</p>
             </div>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={handleCopy} className="flex items-center gap-3 px-6 py-4 bg-slate-100 text-slate-700 rounded-2xl font-black text-xs uppercase hover:bg-slate-200 transition-all">
              {copied ? <Check size={18} className="text-emerald-500" /> : <Copy size={18} />} {copied ? 'Đã chép' : 'Sao chép'}
            </button>
            <button onClick={handleDownloadDocx} disabled={isLoading} className="flex items-center gap-3 px-8 py-4 bg-white text-blue-900 border-2 border-blue-900 rounded-2xl font-black text-xs uppercase hover:bg-blue-50 transition-all">
              <FileDown size={18} /> MS Word (.doc)
            </button>
            <button onClick={handleDownloadPDF} disabled={isLoading} className={`flex items-center gap-3 px-10 py-4 text-white rounded-2xl font-black text-xs uppercase shadow-2xl transition-all hover:-translate-y-1 ${docType === 'SRS' ? 'bg-blue-900 shadow-blue-900/40' : 'bg-indigo-900 shadow-indigo-900/40'}`}>
              <Printer size={18} /> Xuất PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentModal;
