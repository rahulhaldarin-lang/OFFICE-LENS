
import React, { useState, useRef, useEffect } from 'react';
import { Hash, Weight, Camera, CheckCircle2, AlertCircle, Layers, Box, Image as ImageIcon, Calendar as CalendarIcon, Sparkles, Zap } from 'lucide-react';
import { FormState, InventoryEntry, ItemCategory } from '../types';
import { DigitalScaleInput } from './DigitalScaleInput';
import { Counter } from './Counter';

interface EntryFormProps {
  onSubmit: (entry: Omit<InventoryEntry, 'id' | 'createdAt'>) => void;
  currentUserId: string;
}

const CATEGORIES: ItemCategory[] = ['Bracelet', 'Earring', 'Pendant', 'Necklace', 'Ring', 'Other'];

export const EntryForm: React.FC<EntryFormProps> = ({ onSubmit, currentUserId }) => {
  const formatDate = (date: Date) => {
    const d = String(date.getDate()).padStart(2, '0');
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const y = date.getFullYear();
    return `${d}/${m}/${y}`;
  };

  const [formData, setFormData] = useState<FormState>({
    date: formatDate(new Date()),
    quantity: 1,
    pairs: 0,
    itemType: 'Bracelet',
    invoiceNumber: '',
    weight: '0.00',
    photo: null,
    userId: currentUserId
  });
  
  const [showCalendar, setShowCalendar] = useState(false);
  const [isAutoFilled, setIsAutoFilled] = useState(true);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(e.target as Node)) {
        setShowCalendar(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const setDateOffset = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    setFormData(prev => ({ ...prev, date: formatDate(d) }));
    setIsAutoFilled(false);
    setShowCalendar(false);
  };

  const handleCategoryChange = (category: ItemCategory) => {
    setFormData(prev => ({
      ...prev,
      itemType: category,
      quantity: category === 'Earring' ? 0 : (prev.quantity || 1),
      pairs: category === 'Earring' ? (prev.pairs || 1) : 0
    }));
  };

  const validate = () => {
    const newErrors: Partial<Record<keyof FormState, string>> = {};
    if (!formData.invoiceNumber) newErrors.invoiceNumber = 'ID Number is required';
    if (parseFloat(formData.weight) <= 0) newErrors.weight = 'Weight must be greater than zero';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({
        date: formData.date,
        quantity: formData.quantity,
        pairs: formData.pairs,
        itemType: formData.itemType,
        invoiceNumber: formData.invoiceNumber,
        weight: parseFloat(formData.weight),
        photo: formData.photo || undefined,
        userId: formData.userId
      });
      
      setFormData(prev => ({
        ...prev,
        weight: '0.00',
        photo: null,
        invoiceNumber: ''
      }));
      setIsAutoFilled(true);
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, photo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const isEarring = formData.itemType === 'Earring';

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Smart Date Picker Hub */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-[32px] shadow-xl border border-slate-100 dark:border-slate-700 transition-all hover:shadow-2xl hover:border-blue-500/30 group">
          <div className="flex items-center justify-between mb-4">
            <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <CalendarIcon className="w-3 h-3 text-blue-500" />
              Smart Entry Date
            </label>
            {isAutoFilled && (
              <span className="flex items-center gap-1 text-[8px] font-black bg-blue-500 text-white px-2 py-0.5 rounded-full animate-pulse">
                <Zap className="w-2 h-2" /> AUTO-FILLED
              </span>
            )}
          </div>
          
          <div className="space-y-4">
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowCalendar(!showCalendar)}
                className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-transparent group-hover:border-blue-500/20 rounded-2xl px-6 py-4 font-numeric font-black text-2xl text-slate-800 dark:text-white transition-all text-center flex items-center justify-center gap-3"
              >
                {formData.date}
                <ChevronRight className={`w-5 h-5 text-blue-500 transition-transform ${showCalendar ? 'rotate-90' : ''}`} />
              </button>
            </div>

            <div className="flex gap-2">
              <button 
                type="button" 
                onClick={() => setDateOffset(-1)} 
                className="flex-1 py-2.5 text-[9px] font-black uppercase tracking-widest bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-all"
              >
                Yesterday
              </button>
              <button 
                type="button" 
                onClick={() => setDateOffset(0)} 
                className="flex-1 py-2.5 text-[9px] font-black uppercase tracking-widest bg-blue-500 text-white rounded-xl shadow-lg shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all"
              >
                Today
              </button>
            </div>
          </div>

          {showCalendar && (
            <div ref={calendarRef} className="absolute top-full left-0 right-0 mt-4 z-[70] animate-in zoom-in-95 fade-in duration-200">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl rounded-[32px] p-6">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 text-center">Manual Override</p>
                <input 
                  type="date" 
                  autoFocus
                  onChange={(e) => {
                    if(e.target.value) {
                      setFormData(p => ({ ...p, date: formatDate(new Date(e.target.value)) }));
                      setIsAutoFilled(false);
                      setShowCalendar(false);
                    }
                  }}
                  className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border-2 border-blue-500 font-numeric font-bold dark:text-white outline-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* ID Number Field */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-[32px] shadow-xl border border-slate-100 dark:border-slate-700 transition-all hover:shadow-2xl hover:border-blue-500/30">
          <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
            <Hash className="w-3 h-3 text-blue-500" />
            Serial/Invoice ID
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="e.g. PC-102"
              value={formData.invoiceNumber}
              onChange={(e) => {
                setFormData(p => ({ ...p, invoiceNumber: e.target.value.toUpperCase() }));
                if (errors.invoiceNumber) setErrors(prev => ({ ...prev, invoiceNumber: undefined }));
              }}
              className={`w-full bg-slate-50 dark:bg-slate-900 border-2 ${errors.invoiceNumber ? 'border-red-500' : 'border-transparent'} focus:border-blue-500 focus:bg-white dark:focus:bg-slate-950 rounded-2xl px-6 py-4 font-numeric font-black text-xl outline-none transition-all dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600`}
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-500/20 group-focus-within:text-blue-500 transition-colors">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
          {errors.invoiceNumber && <p className="text-red-500 text-[10px] font-bold mt-2 flex items-center gap-1 uppercase tracking-tighter"><AlertCircle className="w-3 h-3"/>{errors.invoiceNumber}</p>}
        </div>

        {/* Weight Measurement Field */}
        <div className="bg-white dark:bg-slate-800 p-8 rounded-[40px] shadow-xl border border-slate-100 dark:border-slate-700 transition-all hover:shadow-2xl hover:border-blue-500/30 md:col-span-2 group">
          <div className="flex items-center justify-between mb-4">
            <label className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
              <Weight className="w-4 h-4 text-blue-500" />
              Digital Measurement (gm)
            </label>
            <div className="flex items-center gap-1.5">
               <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
               <span className="text-[9px] font-black text-emerald-500 uppercase">Live Sensor</span>
            </div>
          </div>
          <DigitalScaleInput 
            value={formData.weight} 
            onChange={(val) => {
              setFormData(p => ({ ...p, weight: val }));
              if (errors.weight) setErrors(prev => ({ ...prev, weight: undefined }));
            }} 
          />
          {errors.weight && <p className="text-red-500 text-xs mt-4 font-black uppercase text-center tracking-widest animate-bounce">{errors.weight}</p>}
        </div>

        {/* Item Category Field */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-[32px] shadow-xl border border-slate-100 dark:border-slate-700 transition-all hover:border-blue-500/30">
          <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
            <Layers className="w-3 h-3 text-blue-500" />
            Category
          </label>
          <div className="grid grid-cols-2 gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => handleCategoryChange(cat)}
                className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border-2 ${formData.itemType === cat ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/20' : 'bg-slate-50 dark:bg-slate-900 text-slate-400 border-transparent hover:border-slate-200 dark:hover:border-slate-700'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Quantity Field */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-[32px] shadow-xl border border-slate-100 dark:border-slate-700 transition-all hover:border-blue-500/30">
          {isEarring ? (
            <div className="animate-in slide-in-from-right-4 duration-300">
              <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
                <Hash className="w-3 h-3 text-blue-500" />
                Pairs (Count)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={formData.pairs === 0 ? '' : formData.pairs}
                  onChange={(e) => setFormData(p => ({ ...p, pairs: parseInt(e.target.value) || 0 }))}
                  className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-transparent focus:border-blue-500 rounded-2xl px-6 py-4 font-numeric font-black text-3xl outline-none transition-all dark:text-white placeholder:text-slate-300"
                />
                <span className="absolute right-6 top-1/2 -translate-y-1/2 text-xs font-black text-blue-500 uppercase opacity-50">Pairs</span>
              </div>
            </div>
          ) : (
            <div className="animate-in slide-in-from-left-4 duration-300">
              <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
                <Box className="w-3 h-3 text-blue-500" />
                Units (Quantity)
              </label>
              <Counter 
                value={formData.quantity} 
                onChange={(val) => setFormData(p => ({ ...p, quantity: val }))} 
              />
            </div>
          )}
        </div>

        {/* Proof Field */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-[32px] shadow-xl border border-slate-100 dark:border-slate-700 md:col-span-2 group">
          <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
            <ImageIcon className="w-3 h-3 text-blue-500" />
            Photo Proof
          </label>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 h-24 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl flex flex-col items-center justify-center gap-2 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all text-slate-400 hover:text-blue-500 group"
            >
              <Camera className="w-6 h-6 group-hover:scale-110 transition-transform" />
              <span className="text-[9px] font-black uppercase tracking-widest">Capture Item</span>
            </button>
            {formData.photo && (
              <div className="relative group w-24 h-24 rounded-2xl overflow-hidden shadow-xl border-4 border-white dark:border-slate-700 animate-in zoom-in-50">
                <img src={formData.photo} alt="Preview" className="w-full h-full object-cover" />
                <button 
                  type="button"
                  onClick={() => setFormData(p => ({ ...p, photo: null }))}
                  className="absolute inset-0 bg-red-600/60 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center text-[8px] font-black uppercase transition-opacity"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handlePhotoChange} 
            accept="image/*" 
            className="hidden" 
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full py-6 bg-slate-900 dark:bg-blue-600 text-white rounded-[32px] font-header font-black text-lg uppercase tracking-widest shadow-2xl hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-3 group overflow-hidden relative"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
        <CheckCircle2 className="w-6 h-6 text-emerald-400" />
        Commit Secure Record
      </button>
    </form>
  );
};

// Simple Chevron for UI
const ChevronRight = ({ className }: { className?: string }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
);
