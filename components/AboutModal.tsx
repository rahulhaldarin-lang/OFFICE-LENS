
import React from 'react';
import { ArrowLeft, Info, Database, User, Code, MapPin, Shield, Copyright, X } from 'lucide-react';

interface AboutModalProps {
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 backdrop-blur-lg bg-slate-900/40 animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[40px] shadow-2xl border border-white/20 overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Header Ribbon */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <button 
            onClick={onClose} 
            className="flex items-center gap-2 px-3 py-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-all text-slate-600 dark:text-slate-300 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-widest">Back</span>
          </button>
          
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-cyan-500" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Platform Description</span>
          </div>
          
          <button 
            onClick={onClose}
            className="p-2.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-all text-slate-400 hover:text-red-500 group"
          >
            <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
          </button>
        </div>

        <div className="p-8 space-y-8">
          {/* Platform Identity */}
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-20 h-20 rounded-[28px] bg-gradient-to-tr from-cyan-600 to-blue-500 p-1 shadow-2xl shadow-cyan-500/20">
              <div className="w-full h-full rounded-[26px] bg-white dark:bg-slate-800 flex items-center justify-center">
                <Database className="w-8 h-8 text-cyan-500" />
              </div>
            </div>
            
            <div className="space-y-4 text-left">
              <h2 className="text-3xl font-header font-black text-slate-900 dark:text-white tracking-tight text-center">Office Lens<span className="text-cyan-500">.</span></h2>
              
              <div className="bg-slate-50 dark:bg-slate-800/40 p-6 rounded-[32px] border border-slate-100 dark:border-slate-800 space-y-4">
                <p className="text-sm font-bold text-slate-600 dark:text-slate-300 leading-relaxed">
                  Office Lens is a professional management platform designed for the Jewelry industry. It helps streamline manufacturing, tracking, and international online sales.
                </p>

                <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-700">
                  <div className="flex items-start gap-3">
                    <User className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Owner</p>
                      <p className="text-sm font-bold text-slate-700 dark:text-slate-200">Dipen Chauhan</p>
                      <p className="text-[10px] font-bold text-slate-400">(Jewelry Fixtures & International Seller)</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Code className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Website Designed & Managed by</p>
                      <p className="text-sm font-bold text-slate-700 dark:text-slate-200">RAHUL HALDAR</p>
                      <p className="text-[10px] font-bold text-slate-400">(Technical Support & Operations)</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Location</p>
                      <p className="text-sm font-bold text-slate-700 dark:text-slate-200">Surat, Gujarat. India</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Metadata */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between text-slate-400">
              <div className="flex items-center gap-2">
                <Shield className="w-3.5 h-3.5" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Version 1.0.0</span>
              </div>
              <div className="flex items-center gap-2">
                <Copyright className="w-3.5 h-3.5" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">2026</span>
              </div>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="w-full py-5 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-[24px] font-header font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all"
          >
            Exit About Platform
          </button>
        </div>
      </div>
    </div>
  );
};
