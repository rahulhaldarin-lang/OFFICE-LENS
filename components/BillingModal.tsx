
import React, { useRef, useState } from 'react';
import { X, Printer, User as UserIcon, Package, ShieldCheck, Download, Loader2, CheckCircle, Info, Globe, Shield, FileText, Image as ImageIcon } from 'lucide-react';
import { User, InventoryEntry } from '../types';

// Declare libraries for TS since we are loading via CDN
declare var html2canvas: any;
declare var jspdf: any;

interface BillingModalProps {
  user: User;
  entries: InventoryEntry[];
  totalWeight: number;
  onClose: () => void;
}

export const BillingModal: React.FC<BillingModalProps> = ({ user, entries, totalWeight, onClose }) => {
  const billContentRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState<false | 'pdf' | 'photo'>(false);

  const OWNER_NAME = "Dipen Chauhan";
  const WEBSITE_NAME = "Office Lens";

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    if (!billContentRef.current) return;
    
    setIsGenerating('pdf');
    
    try {
      // Ensure all images are loaded before capture
      await new Promise(resolve => setTimeout(resolve, 500));

      const canvas = await html2canvas(billContentRef.current, {
        scale: 2, // High resolution capture for PDF
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        width: billContentRef.current.scrollWidth,
        height: billContentRef.current.scrollHeight
      });

      const imgData = canvas.toDataURL('image/png', 1.0);
      const { jsPDF } = jspdf;
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${WEBSITE_NAME}_OFFICIAL_BILL_${user.name.toUpperCase().replace(/\s+/g, '_')}_${new Date().getTime()}.pdf`);
      
      // Also trigger browser print as per request
      window.print();
      
    } catch (error) {
      console.error("Failed to generate PDF:", error);
      alert("PDF generation failed. Using browser print instead.");
      window.print();
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadPhoto = async () => {
    if (!billContentRef.current) return;
    
    setIsGenerating('photo');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      const canvas = await html2canvas(billContentRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        width: billContentRef.current.scrollWidth,
        height: billContentRef.current.scrollHeight
      });

      const imageUrl = canvas.toDataURL('image/png', 1.0);
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = `${WEBSITE_NAME}_BILL_PHOTO_${user.name.toUpperCase().replace(/\s+/g, '_')}_${new Date().getTime()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
    } catch (error) {
      console.error("Failed to generate bill photo:", error);
      alert("Capture failed.");
    } finally {
      setIsGenerating(false);
    }
  };

  const today = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-md bg-black/60 animate-in fade-in duration-300 print:p-0 print:bg-white print:block overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 w-full max-w-3xl rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh] print:max-h-none print:shadow-none print:rounded-none print:w-full print:m-0">
        
        {/* Modal Header */}
        <div className="px-8 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0 print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-black uppercase tracking-widest text-slate-800 dark:text-slate-200">Official Bill Portal</h2>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Verified Official Document</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleDownloadPDF}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-blue-500 transition-colors"
              title="Save as PDF & Print"
            >
              <Printer className="w-6 h-6" />
            </button>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400 transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Scrollable Container for Preview */}
        <div className="flex-1 overflow-y-auto bg-slate-100 dark:bg-slate-950 p-4 sm:p-10 print:p-0 print:bg-white print:overflow-visible">
          
          {/* Targeted area for Capture & Printing */}
          <div 
            id="bill-capture-area"
            ref={billContentRef} 
            className="w-full bg-white text-slate-900 p-8 sm:p-12 space-y-10 shadow-xl rounded-[32px] mx-auto print:shadow-none print:rounded-none print:p-8 print:w-full print:min-h-screen"
            style={{ minHeight: '1000px' }}
          >
            {/* Header Section with Official Branding */}
            <div className="flex justify-between items-start border-b-8 border-slate-900 pb-10">
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center">
                    <Globe className="w-7 h-7 text-white" />
                  </div>
                  <h1 className="text-3xl font-header font-black tracking-tight uppercase">
                    {WEBSITE_NAME}<span className="text-blue-600">.</span>
                  </h1>
                </div>
                <div className="text-[11px] font-bold text-slate-500 space-y-1 uppercase tracking-wider">
                  <p className="text-slate-900 font-black">Official Issuing Authority: {OWNER_NAME}</p>
                  <p>System Generated Official Invoice</p>
                  <p>Certificate No: PR-INV-{user.id.substring(0,6).toUpperCase()}</p>
                </div>
              </div>
              
              <div className="text-right">
                <h2 className="text-6xl font-header font-black text-slate-100 absolute right-12 top-10 select-none opacity-10 print:opacity-5">INVOICE</h2>
                <div className="relative z-10 space-y-1 pt-4">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Billing Date</p>
                  <p className="font-numeric font-bold text-lg">{today}</p>
                  <div className="mt-4 inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-100">
                     <CheckCircle className="w-3 h-3" />
                     <span className="text-[9px] font-black uppercase">Verified by {OWNER_NAME}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recipient Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 bg-slate-50 p-8 rounded-[32px] border border-slate-100 print:bg-slate-50/50">
              <div className="space-y-4">
                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest border-b border-blue-200 pb-2">Issued To (Personnel)</p>
                <div className="flex items-center gap-4">
                   {user.avatar ? (
                     <img src={user.avatar} className="w-16 h-16 rounded-2xl object-cover border-4 border-white shadow-sm" alt="Avatar" />
                   ) : (
                     <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center border-4 border-white shadow-sm">
                        <UserIcon className="w-8 h-8 text-slate-200" />
                     </div>
                   )}
                   <div>
                      <h3 className="text-xl font-header font-black text-slate-900">{user.name}</h3>
                      <p className="text-xs font-bold text-slate-500">{user.mobile || 'ID: ' + user.id.substring(0,8)}</p>
                      <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">Active Status: RECORDED</p>
                   </div>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest border-b border-blue-200 pb-2">Transaction Summary</p>
                <div className="grid grid-cols-2 gap-4 pt-2">
                   <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase">Item Count</p>
                      <p className="text-xl font-numeric font-black">{entries.length}</p>
                   </div>
                   <div className="text-right">
                      <p className="text-[9px] font-black text-slate-400 uppercase">Total Weight</p>
                      <p className="text-2xl font-numeric font-black text-blue-600">{totalWeight.toFixed(2)}<span className="text-xs ml-1">gm</span></p>
                   </div>
                </div>
              </div>
            </div>

            {/* Professional Data Table */}
            <div className="space-y-4 overflow-x-auto print:overflow-visible">
               <table className="w-full text-left min-w-[500px] print:min-w-0">
                  <thead>
                    <tr className="bg-slate-900 text-white print:bg-slate-900 print:text-white">
                      <th className="px-6 py-4 rounded-tl-2xl text-[10px] font-black uppercase tracking-widest">Date</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest">Record ID</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-center">Category</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-center">Units</th>
                      <th className="px-6 py-4 rounded-tr-2xl text-[10px] font-black uppercase tracking-widest text-right">Net Weight</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm font-bold">
                    {entries.map((entry, idx) => (
                      <tr key={entry.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                        <td className="px-6 py-4 border-b border-slate-100 text-slate-500 font-numeric">{entry.date}</td>
                        <td className="px-6 py-4 border-b border-slate-100 text-slate-900 font-numeric">#{entry.invoiceNumber}</td>
                        <td className="px-6 py-4 border-b border-slate-100 text-center uppercase text-[10px] tracking-tight">{entry.itemType}</td>
                        <td className="px-6 py-4 border-b border-slate-100 text-center font-numeric">
                          {entry.itemType === 'Earring' ? `${entry.pairs} PR` : `${entry.quantity} PC`}
                        </td>
                        <td className="px-6 py-4 border-b border-slate-100 text-right font-numeric text-blue-600">{entry.weight.toFixed(2)} gm</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-slate-50 print:bg-slate-50">
                      <td colSpan={4} className="px-6 py-6 text-right text-xs font-black uppercase tracking-widest text-slate-500">Gross Total Balance</td>
                      <td className="px-6 py-6 text-right font-numeric font-black text-3xl text-slate-900 border-b-4 border-blue-600">{totalWeight.toFixed(2)} gm</td>
                    </tr>
                  </tfoot>
               </table>
            </div>

            {/* Signature & Verification Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 pt-10">
               <div className="space-y-4">
                  <div className="flex items-start gap-3 p-4 bg-blue-50/50 rounded-2xl border border-blue-100">
                     <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                     <div className="space-y-1">
                        <p className="text-[9px] font-black uppercase text-blue-800">Verification Note</p>
                        <p className="text-[10px] text-blue-600 leading-relaxed font-bold">
                           This official document from {WEBSITE_NAME} reflects authenticated weight records under the supervision of {OWNER_NAME}.
                        </p>
                     </div>
                  </div>
               </div>

               <div className="flex flex-col justify-end items-end space-y-8">
                  <div className="text-right">
                     <div className="w-48 h-1 bg-slate-200 mb-2"></div>
                     <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Authorized Signature</p>
                     <p className="text-xs font-bold text-slate-900 mt-1">{OWNER_NAME} (Company Owner)</p>
                  </div>
                  <div className="bg-slate-900 text-white px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] print:bg-slate-900 print:text-white flex items-center gap-2">
                     <Shield className="w-3 h-3" />
                     {WEBSITE_NAME} Official Seal
                  </div>
               </div>
            </div>

            {/* Footer Terms */}
            <div className="border-t border-slate-100 pt-8 text-center space-y-2">
               <p className="text-[8px] font-black uppercase tracking-[0.3em] text-slate-400">{WEBSITE_NAME} • Professional Inventory Management System</p>
               <p className="text-[8px] text-slate-300 font-bold uppercase">Authorized Platform Developed for {OWNER_NAME} • Surat, Gujarat.</p>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="p-8 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row gap-4 print:hidden shrink-0">
          <button 
            disabled={!!isGenerating}
            onClick={handleDownloadPDF}
            className="flex-[2] py-5 bg-blue-600 text-white rounded-[24px] font-header font-black text-xs uppercase tracking-widest shadow-2xl shadow-blue-500/30 hover:scale-[1.02] active:scale-95 disabled:opacity-70 disabled:scale-100 transition-all flex items-center justify-center gap-3"
          >
            {isGenerating === 'pdf' ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generating Official PDF...
              </>
            ) : (
              <>
                <FileText className="w-5 h-5" />
                Export Official PDF
              </>
            )}
          </button>
          
          <button 
            disabled={!!isGenerating}
            onClick={handleDownloadPhoto}
            className="flex-1 py-5 bg-slate-900 text-white rounded-[24px] font-header font-black text-xs uppercase tracking-widest shadow-xl hover:scale-[1.02] active:scale-95 disabled:opacity-70 transition-all flex items-center justify-center gap-3"
          >
            {isGenerating === 'photo' ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <ImageIcon className="w-5 h-5" />
            )}
            Photo
          </button>

          <button 
            onClick={handlePrint}
            className="px-8 py-5 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-200 border-2 border-slate-200 dark:border-slate-600 rounded-[24px] font-black text-xs uppercase tracking-widest transition-all hover:bg-slate-100 flex items-center justify-center gap-3"
          >
            <Printer className="w-5 h-5" />
            Print
          </button>
        </div>

      </div>

      <style>{`
        @media print {
          @page { 
            size: A4; 
            margin: 10mm; 
          }
          body * {
            visibility: hidden;
          }
          #bill-capture-area, #bill-capture-area * {
            visibility: visible;
          }
          #bill-capture-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100% !important;
            box-shadow: none !important;
            border: none !important;
            padding: 0 !important;
            margin: 0 !important;
            min-height: auto !important;
            background: white !important;
          }
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};
