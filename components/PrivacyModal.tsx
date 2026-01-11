
import React from 'react';
import { ArrowLeft, ShieldCheck, X, Lock, EyeOff, UserPlus, GlobeLock, Copyright, Shield } from 'lucide-react';

interface PrivacyModalProps {
  onClose: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 backdrop-blur-lg bg-slate-900/40 animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[40px] shadow-2xl border border-white/20 overflow-hidden animate-in zoom-in-95 duration-300 relative">
        
        {/* Header Ribbon */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between relative">
          <button 
            onClick={onClose} 
            className="flex items-center gap-2 px-3 py-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-all text-slate-600 dark:text-slate-300 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-widest">Back</span>
          </button>
          
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-500" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Security & Privacy</span>
          </div>
          
          {/* Prominent Exit Button with Label */}
          <button 
            onClick={onClose}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 rounded-2xl transition-all border border-red-100 dark:border-red-900/30 group"
            title="Exit Privacy"
          >
            <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">Exit</span>
            <X className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
          </button>
        </div>

        <div className="p-8 space-y-8 max-h-[80vh] overflow-y-auto custom-scrollbar">
          {/* Main Identity */}
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-20 h-20 rounded-[28px] bg-gradient-to-tr from-amber-500 to-orange-500 p-1 shadow-2xl shadow-amber-500/20">
              <div className="w-full h-full rounded-[26px] bg-white dark:bg-slate-800 flex items-center justify-center">
                <Lock className="w-8 h-8 text-amber-500" />
              </div>
            </div>
            
            <div className="space-y-4 text-left w-full">
              <h2 className="text-3xl font-header font-black text-slate-900 dark:text-white tracking-tight text-center">Privacy Policy<span className="text-amber-500">.</span></h2>
              
              <div className="space-y-4 pt-4">
                {/* Data Privacy Description */}
                <div className="bg-slate-50 dark:bg-slate-800/40 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 flex gap-4 transition-all hover:border-amber-500/30 group">
                  <div className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-900 flex items-center justify-center shadow-sm shrink-0 border border-slate-100 dark:border-slate-800 group-hover:scale-110 transition-transform">
                    <Lock className="w-5 h-5 text-amber-500" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Data Confidentiality</h4>
                    <p className="text-sm font-bold text-slate-600 dark:text-slate-300 leading-relaxed">
                      All your business information and private inventory logs are treated with strict confidentiality and stored using secure encryption methods.
                    </p>
                  </div>
                </div>

                {/* Third Party Description */}
                <div className="bg-slate-50 dark:bg-slate-800/40 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 flex gap-4 transition-all hover:border-emerald-500/30 group">
                  <div className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-900 flex items-center justify-center shadow-sm shrink-0 border border-slate-100 dark:border-slate-800 group-hover:scale-110 transition-transform">
                    <EyeOff className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Zero Third-Party Access</h4>
                    <p className="text-sm font-bold text-slate-600 dark:text-slate-300 leading-relaxed">
                      We uphold a strict no-sharing policy. Your personal and business data will never be shared with any third-party marketing services or outside applications.
                    </p>
                  </div>
                </div>

                {/* Secure Access Description */}
                <div className="bg-slate-50 dark:bg-slate-800/40 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 flex gap-4 transition-all hover:border-indigo-500/30 group">
                  <div className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-900 flex items-center justify-center shadow-sm shrink-0 border border-slate-100 dark:border-slate-800 group-hover:scale-110 transition-transform">
                    <UserPlus className="w-5 h-5 text-indigo-500" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Authorized Access Only</h4>
                    <p className="text-sm font-bold text-slate-600 dark:text-slate-300 leading-relaxed">
                      Access to internal manufacturing and sales records is restricted exclusively to authorized Owner and Admin accounts.
                    </p>
                  </div>
                </div>

                {/* Safe Browsing Description */}
                <div className="bg-slate-50 dark:bg-slate-800/40 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 flex gap-4 transition-all hover:border-cyan-500/30 group">
                  <div className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-900 flex items-center justify-center shadow-sm shrink-0 border border-slate-100 dark:border-slate-800 group-hover:scale-110 transition-transform">
                    <GlobeLock className="w-5 h-5 text-cyan-500" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Encrypted Connections</h4>
                    <p className="text-sm font-bold text-slate-600 dark:text-slate-300 leading-relaxed">
                      Our external links are vetted for security to ensure your browser remains safe and your personal credentials are never logged.
                    </p>
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
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Data Secured</span>
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
            Exit Privacy Policy
          </button>
        </div>
      </div>
    </div>
  );
};
