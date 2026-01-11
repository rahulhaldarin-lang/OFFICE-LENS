
import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Trash2, X, ChevronRight, Save, ArrowLeft, Edit3, Sparkles, Calculator as CalcIcon, Delete, Percent, Copy, Eye, EyeOff, IndianRupee, Weight, Globe, DollarSign, RefreshCw, Info } from 'lucide-react';
import { Note } from '../types';

interface NotebookProps {
  onClose: () => void;
}

export const Notebook: React.FC<NotebookProps> = ({ onClose }) => {
  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem('precision_notes_v2');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [view, setView] = useState<'list' | 'editor' | 'calculator' | 'converter' | 'currency'>('list');
  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const [isTransparent, setIsTransparent] = useState(false);

  // Calculator State
  const [calcValue, setCalcValue] = useState('0');
  const [prevValue, setPrevValue] = useState<string | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  // Converter State (Quantity x Rate)
  const [convQty, setConvQty] = useState('');
  const [convRate, setConvRate] = useState('');

  // Currency State
  const [curAmount, setCurAmount] = useState('');
  const [curRate, setCurRate] = useState('83.50'); 
  const [baseCurrency, setBaseCurrency] = useState<'INR' | 'USD' | 'AED'>('USD');
  const [targetCurrency, setTargetCurrency] = useState<'INR' | 'USD' | 'AED'>('INR');

  useEffect(() => {
    localStorage.setItem('precision_notes_v2', JSON.stringify(notes));
  }, [notes]);

  // Handle Dynamic Rate Suggestions
  useEffect(() => {
    if (baseCurrency === 'USD' && targetCurrency === 'INR') setCurRate('83.50');
    else if (baseCurrency === 'AED' && targetCurrency === 'INR') setCurRate('22.75');
    else if (baseCurrency === 'INR' && targetCurrency === 'USD') setCurRate('0.012');
    else if (baseCurrency === 'INR' && targetCurrency === 'AED') setCurRate('0.044');
    else if (baseCurrency === 'USD' && targetCurrency === 'AED') setCurRate('3.67');
    else if (baseCurrency === 'AED' && targetCurrency === 'USD') setCurRate('0.27');
    else if (baseCurrency === targetCurrency) setCurRate('1.00');
  }, [baseCurrency, targetCurrency]);

  const handleCreateNew = () => {
    const newNote: Note = {
      id: crypto.randomUUID(),
      title: '',
      content: '',
      category: 'General',
      createdAt: Date.now()
    };
    setActiveNote(newNote);
    setView('editor');
  };

  const handleSaveNote = () => {
    if (!activeNote) return;
    const exists = notes.find(n => n.id === activeNote.id);
    if (exists) {
      setNotes(notes.map(n => n.id === activeNote.id ? activeNote : n));
    } else {
      setNotes([activeNote, ...notes]);
    }
    setView('list');
  };

  const handleDeleteNote = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm('Delete this ledger entry permanently?')) {
      setNotes(notes.filter(n => n.id !== id));
      if (activeNote?.id === id) {
        setView('list');
        setActiveNote(null);
      }
    }
  };

  const handleSelectNote = (note: Note) => {
    setActiveNote(note);
    setView('editor');
  };

  // Calculator Logic
  const inputDigit = (digit: string) => {
    if (waitingForOperand) {
      setCalcValue(digit);
      setWaitingForOperand(false);
    } else {
      setCalcValue(calcValue === '0' ? digit : calcValue + digit);
    }
  };

  const inputDot = () => {
    if (waitingForOperand) {
      setCalcValue('0.');
      setWaitingForOperand(false);
    } else if (!calcValue.includes('.')) {
      setCalcValue(calcValue + '.');
    }
  };

  const clearCalc = () => {
    setCalcValue('0');
    setPrevValue(null);
    setOperator(null);
    setWaitingForOperand(false);
  };

  const toggleSign = () => setCalcValue((parseFloat(calcValue) * -1).toString());
  const inputPercent = () => setCalcValue((parseFloat(calcValue) / 100).toString());

  const performOperation = (nextOperator: string) => {
    const inputValue = parseFloat(calcValue);
    if (prevValue == null) {
      setPrevValue(calcValue);
    } else if (operator) {
      const currentValue = parseFloat(prevValue) || 0;
      const newValue = calculate(currentValue, inputValue, operator);
      setCalcValue(String(newValue));
      setPrevValue(String(newValue));
    }
    setWaitingForOperand(true);
    setOperator(nextOperator);
  };

  const calculate = (prev: number, curr: number, op: string) => {
    switch (op) {
      case '+': return prev + curr;
      case '-': return prev - curr;
      case '*': return prev * curr;
      case '/': return prev / curr;
      case '=': return curr;
      default: return curr;
    }
  };

  // Totals
  const totalAmount = (parseFloat(convQty) || 0) * (parseFloat(convRate) || 0);
  const currencyResult = (parseFloat(curAmount) || 0) * (parseFloat(curRate) || 0);

  const swapCurrencies = () => {
    const tempBase = baseCurrency;
    const tempTarget = targetCurrency;
    setBaseCurrency(tempTarget);
    setTargetCurrency(tempBase);
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 backdrop-blur-xl bg-slate-900/60 animate-in fade-in duration-300">
      <div className={`bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[40px] shadow-2xl border border-white/10 overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[85vh] transition-all duration-500 ${isTransparent && (view === 'calculator' || view === 'converter' || view === 'currency') ? 'bg-opacity-0 dark:bg-opacity-0 backdrop-blur-none shadow-none border-transparent' : ''}`}>
        
        {/* Header Ribbon */}
        <div className={`px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/20 transition-opacity duration-500 ${isTransparent && (view === 'calculator' || view === 'converter' || view === 'currency') ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          <div className="flex items-center gap-3">
            {view !== 'list' ? (
              <button onClick={() => setView('list')} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-all">
                <ArrowLeft className="w-5 h-5 text-slate-500" />
              </button>
            ) : (
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
            )}
            <div>
              <h2 className="text-xs font-black uppercase tracking-widest text-slate-800 dark:text-slate-100 leading-none">
                {view === 'list' ? 'Ledger Hub' : view === 'editor' ? 'Edit Entry' : view === 'calculator' ? 'Smart Calculator' : view === 'converter' ? 'Rate Converter' : 'Currency Exchange'}
              </h2>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter mt-1">
                {view === 'currency' ? 'Manual Rate Selection' : view === 'converter' ? 'Quantity × Rate' : view === 'calculator' ? 'Nano Precision' : `${notes.length} Active Records`}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {view !== 'currency' && (
              <button onClick={() => setView('currency')} className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-amber-50 dark:hover:bg-amber-900/30 text-slate-500 hover:text-amber-600 rounded-xl transition-all">
                <Globe className="w-4 h-4" />
              </button>
            )}
            {view !== 'converter' && (
              <button onClick={() => setView('converter')} className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 text-slate-500 hover:text-emerald-600 rounded-xl transition-all">
                <RefreshCw className="w-4 h-4" />
              </button>
            )}
            {view !== 'calculator' && (
              <button onClick={() => setView('calculator')} className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-slate-500 hover:text-indigo-600 rounded-xl transition-all">
                <CalcIcon className="w-4 h-4" />
              </button>
            )}
            <button onClick={onClose} className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full text-slate-400 hover:text-red-500 transition-all">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden relative">
          {/* Background Layer (Only visible when transparent) */}
          {isTransparent && (view === 'calculator' || view === 'converter' || view === 'currency') && (
            <div className="absolute inset-0 z-0 p-6 overflow-y-auto opacity-30 grayscale blur-[3px]">
               <div className="space-y-4">
                  {notes.map(note => (
                    <div key={note.id} className="p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                      <p className="text-xs font-black uppercase tracking-widest opacity-50">{note.title}</p>
                      <p className="text-[10px] font-bold opacity-30 line-clamp-2">{note.content}</p>
                    </div>
                  ))}
               </div>
            </div>
          )}

          <div className={`h-full overflow-y-auto p-4 custom-scrollbar relative z-10 transition-all duration-500 ${isTransparent && (view === 'calculator' || view === 'converter' || view === 'currency') ? 'bg-transparent' : ''}`}>
            {view === 'list' ? (
              <div className="space-y-4">
                <button onClick={handleCreateNew} className="w-full p-6 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-[32px] flex flex-col items-center justify-center gap-2 hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/10 transition-all group">
                  <div className="p-3 bg-white dark:bg-slate-800 rounded-full shadow-md group-hover:scale-110 transition-transform">
                    <Plus className="w-6 h-6 text-indigo-500" />
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest text-slate-400 group-hover:text-indigo-600">New Ledger Entry</span>
                </button>
                <div className="grid grid-cols-1 gap-3">
                  {notes.map(note => (
                    <div key={note.id} onClick={() => handleSelectNote(note)} className="group flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800 hover:border-indigo-500/30 hover:scale-[1.01] transition-all cursor-pointer shadow-sm">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-900 flex items-center justify-center border border-slate-100 dark:border-slate-800">
                          <Edit3 className="w-5 h-5 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                        </div>
                        <div className="overflow-hidden">
                          <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase truncate">{note.title || 'Untitled Remark'}</h4>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[9px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">{note.category}</span>
                            <span className="text-slate-300 dark:text-slate-700">•</span>
                            <span className="text-[9px] font-bold text-slate-400 font-numeric">{new Date(note.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button onClick={(e) => handleDeleteNote(e, note.id)} className="p-3 opacity-0 group-hover:opacity-100 hover:text-red-500 text-slate-400 transition-all"><Trash2 className="w-4 h-4" /></button>
                        <ChevronRight className="w-5 h-5 text-slate-300 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : view === 'editor' ? (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                <div className="space-y-4">
                  <div>
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Entry Title</label>
                    <input autoFocus type="text" placeholder="e.g. Daily Dispatch" className="w-full bg-slate-50 dark:bg-slate-800/50 rounded-2xl px-5 py-4 text-sm font-black outline-none border-2 border-transparent focus:border-indigo-500 dark:text-white transition-all shadow-sm" value={activeNote?.title} onChange={(e) => setActiveNote(prev => prev ? { ...prev, title: e.target.value } : null)} />
                  </div>
                  <div>
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Category</label>
                    <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                      {['General', 'Discrepancy', 'Instruction', 'Repair', 'Urgent'].map(cat => (
                        <button key={cat} onClick={() => setActiveNote(prev => prev ? { ...prev, category: cat } : null)} className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border ${activeNote?.category === cat ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg' : 'bg-white dark:bg-slate-800 text-slate-500 border-slate-100 dark:border-slate-700'}`}>{cat}</button>
                      ))}
                    </div>
                  </div>
                  <div className="relative group">
                    <textarea placeholder="Describe details..." className="w-full h-48 bg-slate-50 dark:bg-slate-800/50 rounded-[32px] px-6 py-6 text-sm font-bold leading-relaxed outline-none border-2 border-transparent focus:border-indigo-500 dark:text-white transition-all shadow-inner resize-none relative z-10" value={activeNote?.content} onChange={(e) => setActiveNote(prev => prev ? { ...prev, content: e.target.value } : null)} />
                  </div>
                </div>
                <button onClick={handleSaveNote} className="w-full py-5 bg-indigo-600 text-white rounded-[24px] font-header font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-indigo-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"><Save className="w-5 h-5" /> Commit to Ledger</button>
              </div>
            ) : view === 'calculator' ? (
              <div className={`animate-in zoom-in-95 duration-300 w-full max-w-[300px] mx-auto transition-all ${isTransparent ? 'scale-105' : ''}`}>
                <div className={`rounded-[28px] p-4 shadow-2xl border border-white/10 space-y-4 relative overflow-hidden transition-all duration-500 ${isTransparent ? 'bg-slate-900/60 backdrop-blur-2xl' : 'bg-slate-900'}`}>
                  <div onClick={() => setIsTransparent(!isTransparent)} className={`rounded-[20px] p-4 border border-white/5 text-right relative group cursor-pointer transition-all duration-500 ${isTransparent ? 'bg-transparent border-white/20' : 'bg-black/60 hover:bg-black/40'}`}>
                    <div className="absolute top-2 right-2"><div className="p-1 bg-white/10 rounded-md text-white">{isTransparent ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}</div></div>
                    <p className={`text-indigo-400 text-[8px] font-black uppercase tracking-[0.2em] h-3 mb-0.5 transition-opacity ${isTransparent ? 'opacity-100' : 'opacity-70'}`}>{prevValue} {operator}</p>
                    <p className={`text-white text-3xl font-numeric font-bold truncate tracking-tighter drop-shadow-lg`}>{calcValue}</p>
                  </div>
                  <div className="grid grid-cols-4 gap-2 relative z-10">
                    <button onClick={clearCalc} className={`h-10 font-black rounded-xl hover:scale-[1.05] active:scale-95 transition-all text-xs ${isTransparent ? 'bg-white/10 text-red-400 border border-white/10' : 'bg-slate-800 text-red-500 hover:bg-slate-700'}`}>C</button>
                    <button onClick={toggleSign} className="h-10 bg-slate-800 text-slate-300 font-black rounded-xl text-xs">+/-</button>
                    <button onClick={inputPercent} className="h-10 bg-slate-800 text-slate-300 font-black rounded-xl text-xs">%</button>
                    <button onClick={() => performOperation('/')} className="h-10 bg-indigo-600 text-white font-black rounded-xl text-sm">÷</button>
                    {[7, 8, 9].map(n => (<button key={n} onClick={() => inputDigit(String(n))} className="h-10 bg-white/5 text-white font-numeric font-bold rounded-xl">{n}</button>))}
                    <button onClick={() => performOperation('*')} className="h-10 bg-indigo-600 text-white font-black rounded-xl text-sm">×</button>
                    {[4, 5, 6].map(n => (<button key={n} onClick={() => inputDigit(String(n))} className="h-10 bg-white/5 text-white font-numeric font-bold rounded-xl">{n}</button>))}
                    <button onClick={() => performOperation('-')} className="h-10 bg-indigo-600 text-white font-black rounded-xl text-sm">−</button>
                    {[1, 2, 3].map(n => (<button key={n} onClick={() => inputDigit(String(n))} className="h-10 bg-white/5 text-white font-numeric font-bold rounded-xl">{n}</button>))}
                    <button onClick={() => performOperation('+')} className="h-10 bg-indigo-600 text-white font-black rounded-xl text-sm">+</button>
                    <button onClick={() => inputDigit('0')} className="col-span-2 h-10 bg-white/5 text-white font-numeric font-bold rounded-xl">0</button>
                    <button onClick={inputDot} className="h-10 bg-white/5 text-white font-numeric font-bold rounded-xl">.</button>
                    <button onClick={() => performOperation('=')} className="h-10 bg-emerald-600 text-white font-black rounded-xl text-sm">=</button>
                  </div>
                </div>
              </div>
            ) : view === 'converter' ? (
              <div className={`animate-in zoom-in-95 duration-300 w-full max-w-[340px] mx-auto transition-all ${isTransparent ? 'scale-105' : ''}`}>
                 <div className={`rounded-[32px] p-6 shadow-2xl border border-white/10 space-y-6 relative overflow-hidden transition-all duration-500 ${isTransparent ? 'bg-emerald-900/60 backdrop-blur-2xl border-emerald-500/30' : 'bg-slate-900'}`}>
                    <div onClick={() => setIsTransparent(!isTransparent)} className={`rounded-[24px] p-5 border border-white/5 text-right relative group cursor-pointer transition-all duration-500 ${isTransparent ? 'bg-transparent border-emerald-400/20' : 'bg-black/60 hover:bg-black/40'}`}>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400/70 mb-1">Total Valuation</p>
                      <div className="flex items-baseline justify-end gap-2">
                        <span className="text-xl font-bold text-emerald-500/50">₹</span>
                        <p className="text-white text-4xl font-numeric font-bold truncate tracking-tighter">{totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                       <div className="space-y-1.5">
                          <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 ml-2">Quantity</label>
                          <input type="number" placeholder="0.00" value={convQty} onChange={(e) => setConvQty(e.target.value)} className="w-full bg-black/40 border border-white/5 focus:border-emerald-500/50 rounded-2xl px-5 py-3.5 text-white font-numeric font-bold outline-none transition-all placeholder:text-slate-700" />
                       </div>
                       <div className="space-y-1.5">
                          <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 ml-2">Rate</label>
                          <input type="number" placeholder="0.00" value={convRate} onChange={(e) => setConvRate(e.target.value)} className="w-full bg-black/40 border border-white/5 focus:border-emerald-500/50 rounded-2xl px-5 py-3.5 text-white font-numeric font-bold outline-none transition-all placeholder:text-slate-700" />
                       </div>
                    </div>
                 </div>
              </div>
            ) : (
              /* ENHANCED CURRENCY CONVERTER - MANUAL RATE SETTING */
              <div className={`animate-in zoom-in-95 duration-300 w-full max-w-[340px] mx-auto transition-all ${isTransparent ? 'scale-105' : ''}`}>
                 <div className={`rounded-[32px] p-6 shadow-2xl border border-white/10 space-y-5 relative overflow-hidden transition-all duration-500 ${isTransparent ? 'bg-amber-900/60 backdrop-blur-2xl border-amber-500/30' : 'bg-slate-900'}`}>
                    
                    {/* Final Result Display */}
                    <div onClick={() => setIsTransparent(!isTransparent)} className={`rounded-[24px] p-5 border border-white/5 text-right relative group cursor-pointer transition-all duration-500 ${isTransparent ? 'bg-transparent border-amber-400/20' : 'bg-black/60 hover:bg-black/40'}`}>
                      <div className="absolute top-2 right-2"><div className="p-1 bg-white/10 rounded-md text-amber-400">{isTransparent ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}</div></div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-400/70 mb-1">Exchange Result</p>
                      <div className="flex items-baseline justify-end gap-2">
                        <span className="text-xl font-bold text-amber-500/50">{targetCurrency === 'INR' ? '₹' : targetCurrency === 'USD' ? '$' : 'DH'}</span>
                        <p className="text-white text-4xl font-numeric font-bold truncate tracking-tighter drop-shadow-lg">{currencyResult.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                      </div>
                    </div>

                    {/* Inputs Area */}
                    <div className="space-y-4">
                       {/* Amount Input */}
                       <div className="space-y-1.5">
                          <div className="flex items-center justify-between px-2">
                            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">Amount ({baseCurrency})</label>
                            <div className="flex gap-1">
                               {['INR', 'USD', 'AED'].map(c => (
                                 <button key={c} onClick={() => setBaseCurrency(c as any)} className={`px-2 py-1 rounded text-[8px] font-black uppercase transition-all ${baseCurrency === c ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/20' : 'bg-slate-800 text-slate-500 hover:text-slate-300'}`}>{c}</button>
                               ))}
                            </div>
                          </div>
                          <div className="relative group">
                            <input type="number" placeholder="Enter amount..." value={curAmount} onChange={(e) => setCurAmount(e.target.value)} className="w-full bg-black/40 border border-white/5 focus:border-amber-500/50 rounded-2xl px-5 py-4 text-white font-numeric font-bold outline-none transition-all placeholder:text-slate-700" />
                            <DollarSign className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-amber-500 transition-colors" />
                          </div>
                       </div>

                       {/* MANUAL RATE INPUT */}
                       <div className="space-y-1.5">
                          <div className="flex items-center justify-between px-2">
                            <div className="flex items-center gap-1.5">
                               <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">Exchange Rate</label>
                               <span className="text-[8px] px-1.5 py-0.5 bg-amber-500/10 text-amber-500 rounded font-black uppercase">Manual</span>
                            </div>
                            <div className="flex gap-1">
                               {['INR', 'USD', 'AED'].map(c => (
                                 <button key={c} onClick={() => setTargetCurrency(c as any)} className={`px-2 py-1 rounded text-[8px] font-black uppercase transition-all ${targetCurrency === c ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' : 'bg-slate-800 text-slate-500 hover:text-slate-300'}`}>{c}</button>
                               ))}
                            </div>
                          </div>
                          <div className="relative group">
                            <input type="number" step="0.01" placeholder="Set manual rate..." value={curRate} onChange={(e) => setCurRate(e.target.value)} className="w-full bg-black/60 border border-amber-500/20 focus:border-amber-500 rounded-2xl px-5 py-4 text-amber-400 font-numeric font-bold outline-none transition-all shadow-inner" />
                            <RefreshCw className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500/50 group-focus-within:rotate-180 transition-transform duration-500" />
                          </div>
                          <p className="text-[8px] font-bold text-slate-500 px-2 flex items-center gap-1 uppercase tracking-wider"><Info className="w-2.5 h-2.5" /> Adjust the rate manually as per market</p>
                       </div>
                    </div>

                    <div className="flex gap-2">
                       <button onClick={swapCurrencies} className="flex-1 py-3.5 text-[9px] font-black uppercase tracking-[0.2em] bg-white/5 hover:bg-amber-500/10 text-slate-500 hover:text-amber-400 border border-white/5 rounded-xl transition-all">Swap Currencies</button>
                       <button onClick={() => { setCurAmount(''); setCurRate('1.00'); }} className="flex-1 py-3.5 text-[9px] font-black uppercase tracking-[0.2em] bg-white/5 hover:bg-red-500/10 text-slate-500 hover:text-red-400 border border-white/5 rounded-xl transition-all">Reset Converter</button>
                    </div>
                 </div>
                 <p className="mt-4 text-[8px] font-black text-slate-400 uppercase tracking-widest text-center animate-pulse">Tap valuation to toggle Transparency</p>
              </div>
            )}
          </div>
        </div>

        {/* Compact Action Bar */}
        {(view === 'list' || (!isTransparent && (view === 'calculator' || view === 'converter' || view === 'currency'))) && (
          <div className={`p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 transition-all duration-500 ${isTransparent ? 'opacity-0 pointer-events-none translate-y-4' : 'opacity-100'}`}>
            <button onClick={onClose} className="w-full py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[16px] font-black text-[9px] uppercase tracking-[0.2em] hover:opacity-90 active:scale-95 transition-all">Exit Ledger Hub</button>
          </div>
        )}
      </div>
    </div>
  );
};
