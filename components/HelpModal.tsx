
import React, { useState, useEffect, useRef } from 'react';
import { X, ArrowLeft, HelpCircle, MapPin, Phone, Mail, User, ShieldCheck, ExternalLink, MessageSquare, Camera, RotateCcw } from 'lucide-react';

interface HelpModalProps {
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ onClose }) => {
  const [supportPhoto, setSupportPhoto] = useState<string | null>(() => {
    return localStorage.getItem('support_profile_photo');
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (supportPhoto) {
      localStorage.setItem('support_profile_photo', supportPhoto);
    } else {
      localStorage.removeItem('support_profile_photo');
    }
  }, [supportPhoto]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSupportPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Reset support profile picture?")) {
      setSupportPhoto(null);
    }
  };

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
            <HelpCircle className="w-4 h-4 text-indigo-500" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Technical Support</span>
          </div>
          
          <button 
            onClick={onClose}
            className="p-2.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-all text-slate-400 hover:text-red-500 group"
            title="Close"
          >
            <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
          </button>
        </div>

        <div className="p-8 space-y-8">
          {/* Main Title */}
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-indigo-100 dark:border-indigo-800/50 shadow-sm relative overflow-hidden">
              <MessageSquare className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-transparent"></div>
            </div>
            <h2 className="text-2xl font-header font-black text-slate-900 dark:text-white uppercase tracking-tight">Need Assistance?</h2>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Platform Technical Contact</p>
          </div>

          {/* Contact Card for Rahul Haldar */}
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-[32px] border border-slate-100 dark:border-slate-800 overflow-hidden shadow-inner">
            <div className="p-6 space-y-5">
              
              {/* Profile Header with Photo Upload */}
              <div className="flex items-center gap-4 border-b border-slate-200/50 dark:border-slate-700/50 pb-5">
                <div className="relative group shrink-0">
                  <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 overflow-hidden border-2 border-white dark:border-slate-800 relative">
                    {supportPhoto ? (
                      <img src={supportPhoto} className="w-full h-full object-cover" alt="Rahul Haldar" />
                    ) : (
                      <User className="w-8 h-8 text-white" />
                    )}
                    
                    {/* Camera Overlay */}
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Camera className="w-5 h-5 text-white" />
                    </button>
                  </div>

                  {/* Reset Photo Button */}
                  {supportPhoto && (
                    <button 
                      onClick={resetPhoto}
                      className="absolute -top-1.5 -left-1.5 bg-white dark:bg-slate-700 p-1.5 rounded-lg shadow-md border border-slate-100 dark:border-slate-600 text-slate-400 hover:text-red-500 transition-all"
                      title="Remove Photo"
                    >
                      <RotateCcw className="w-3 h-3" />
                    </button>
                  )}
                  
                  {/* Verified Indicator */}
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-2 border-white dark:border-slate-800 rounded-lg flex items-center justify-center shadow-sm">
                    <ShieldCheck className="w-3 h-3 text-white" />
                  </div>
                </div>

                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handlePhotoUpload} 
                />

                <div className="truncate">
                  <h3 className="text-xl font-header font-black text-slate-900 dark:text-white uppercase tracking-tight truncate">RAHUL HALDAR</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <p className="text-[9px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Platform Developer</p>
                  </div>
                </div>
              </div>

              {/* Contact List */}
              <div className="space-y-4">
                <div className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center shadow-sm border border-slate-100 dark:border-slate-800 group-hover:bg-indigo-50 transition-colors">
                    <MapPin className="w-4 h-4 text-red-500" />
                  </div>
                  <div>
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.15em]">Location</p>
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-200">Surat, Gujarat</p>
                  </div>
                </div>

                <a 
                  href="tel:+919332578394" 
                  className="flex items-center justify-between p-1 -ml-1 rounded-2xl hover:bg-white dark:hover:bg-slate-800 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center shadow-sm border border-slate-100 dark:border-slate-800 group-hover:text-emerald-500 transition-colors">
                      <Phone className="w-4 h-4 text-emerald-500" />
                    </div>
                    <div>
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.15em]">Phone Number</p>
                      <p className="text-sm font-numeric font-bold text-slate-700 dark:text-slate-200">+91 93325 78394</p>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-300 mr-3 opacity-0 group-hover:opacity-100 transition-all" />
                </a>

                <a 
                  href="mailto:rahulhaldar.in@gmail.com" 
                  className="flex items-center justify-between p-1 -ml-1 rounded-2xl hover:bg-white dark:hover:bg-slate-800 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center shadow-sm border border-slate-100 dark:border-slate-800 group-hover:text-blue-500 transition-colors">
                      <Mail className="w-4 h-4 text-blue-500" />
                    </div>
                    <div className="truncate">
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.15em]">Official Email</p>
                      <p className="text-sm font-bold text-slate-700 dark:text-slate-200 truncate max-w-[180px]">rahulhaldar.in@gmail.com</p>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-300 mr-3 opacity-0 group-hover:opacity-100 transition-all" />
                </a>
              </div>
            </div>

            {/* Verification Footer */}
            <div className="bg-indigo-600 p-3 text-center">
              <p className="text-[8px] font-black text-white/80 uppercase tracking-[0.3em]">Authorized Support Representative</p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="w-full py-5 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-[24px] font-header font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all"
          >
            Exit Help Center
          </button>
        </div>
      </div>
    </div>
  );
};
