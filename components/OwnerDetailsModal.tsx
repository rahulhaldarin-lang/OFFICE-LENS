
import React, { useState, useEffect, useRef } from 'react';
import { X, User, Briefcase, MapPin, Phone, Star, Globe, ShieldCheck, ArrowLeft, Camera, RotateCcw } from 'lucide-react';

interface OwnerDetailsModalProps {
  onClose: () => void;
}

export const OwnerDetailsModal: React.FC<OwnerDetailsModalProps> = ({ onClose }) => {
  // Default high-quality photo (conceptually the man in the blue shirt/sunglasses)
  const DEFAULT_OWNER_PHOTO = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop";
  
  const [ownerPhoto, setOwnerPhoto] = useState<string>(() => {
    return localStorage.getItem('owner_profile_photo') || DEFAULT_OWNER_PHOTO;
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem('owner_profile_photo', ownerPhoto);
  }, [ownerPhoto]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setOwnerPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetToDefault = () => {
    if (window.confirm("Reset profile picture to default?")) {
      setOwnerPhoto(DEFAULT_OWNER_PHOTO);
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
            <ShieldCheck className="w-4 h-4 text-blue-500" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Verified Owner</span>
          </div>
          
          <button 
            onClick={onClose}
            className="p-2.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-all text-slate-400 hover:text-red-500 group"
          >
            <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
          </button>
        </div>

        <div className="p-8 space-y-8">
          {/* Owner Profile Header - WITH UPLOAD FEATURE */}
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="relative group">
              <div className="w-36 h-36 rounded-[44px] bg-gradient-to-tr from-blue-600 to-indigo-500 p-1 shadow-2xl shadow-blue-500/30 transition-transform group-hover:scale-105 duration-500">
                <div className="w-full h-full rounded-[42px] bg-white dark:bg-slate-800 overflow-hidden flex items-center justify-center relative">
                  <img 
                    src={ownerPhoto} 
                    className="w-full h-full object-cover select-none transition-all duration-700 group-hover:brightness-75" 
                    alt="Dipen Chauhan" 
                  />
                  
                  {/* Upload Overlay */}
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 backdrop-blur-[2px]"
                  >
                    <Camera className="w-8 h-8 text-white mb-1 drop-shadow-lg" />
                    <span className="text-[8px] font-black text-white uppercase tracking-widest">Update Photo</span>
                  </button>
                </div>
              </div>

              {/* Verified Badge */}
              <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-2.5 rounded-2xl shadow-lg border-4 border-white dark:border-slate-900 z-10">
                <ShieldCheck className="w-4 h-4" />
              </div>

              {/* Reset Photo Button */}
              {ownerPhoto !== DEFAULT_OWNER_PHOTO && (
                <button 
                  onClick={resetToDefault}
                  className="absolute -top-2 -left-2 bg-white dark:bg-slate-800 p-2 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 text-slate-400 hover:text-indigo-500 transition-all active:scale-90"
                  title="Reset to Default"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}
            </div>

            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handlePhotoUpload} 
            />
            
            <div className="space-y-1">
              <h2 className="text-3xl font-header font-black text-slate-900 dark:text-white tracking-tight">Dipen Chauhan</h2>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full">
                <Globe className="w-3 h-3" />
                <span className="text-[10px] font-black uppercase tracking-widest">International Online Seller</span>
              </div>
            </div>
          </div>

          {/* Details List */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800">
                <div className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-900 flex items-center justify-center shadow-sm">
                  <Briefcase className="w-5 h-5 text-indigo-500" />
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Business</p>
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-200">Jewelry Manufacturing & Fixtures</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800">
                <div className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-900 flex items-center justify-center shadow-sm">
                  <MapPin className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Location</p>
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-200">Surat, Gujarat. India</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800">
                <div className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-900 flex items-center justify-center shadow-sm">
                  <Phone className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Contact</p>
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-200">+91 74056 36042</p>
                </div>
              </div>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="w-full py-5 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-[24px] font-header font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all"
          >
            Exit Owner Profile
          </button>
        </div>
      </div>
    </div>
  );
};
