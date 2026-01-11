
import React, { useState, useRef } from 'react';
import { Trash2, Download, Package, Scale, Hash, Layers, Eye, X, Calendar, User as UserIcon, Edit3, Save, Camera, Image as ImageIcon, RotateCcw } from 'lucide-react';
import { InventoryEntry, User, ItemCategory } from '../types';
import { exportService } from '../services/exportService';

interface EntryListProps {
  entries: InventoryEntry[];
  allEntries: InventoryEntry[];
  onDelete: (id: string) => void;
  onUpdate: (entry: InventoryEntry) => void;
  onRestore?: (id: string) => void;
  currentUser?: User;
  isTrashView?: boolean;
}

export const EntryList: React.FC<EntryListProps> = ({ 
  entries, allEntries, onDelete, onUpdate, onRestore, currentUser, isTrashView = false 
}) => {
  const [selectedEntry, setSelectedEntry] = useState<InventoryEntry | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<InventoryEntry | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-slate-400">
        <Package className="w-16 h-16 mb-4 opacity-20" />
        <p className="font-header font-bold text-lg">
          {isTrashView ? 'Trash is empty' : 'No entries for this user'}
        </p>
        <p className="text-sm">
          {isTrashView ? 'Deleted items will appear here.' : 'Switch users or create a new entry to see data.'}
        </p>
      </div>
    );
  }

  const handleStartEdit = () => {
    if (selectedEntry) {
      setEditData({ ...selectedEntry });
      setIsEditing(true);
    }
  };

  const handleSaveEdit = () => {
    if (editData) {
      onUpdate(editData);
      setSelectedEntry(editData);
      setIsEditing(false);
      setEditData(null);
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editData) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditData({ ...editData, photo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      {!isTrashView && (
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">
            Showing {entries.length} items for {currentUser?.name}
          </h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => exportService.exportToCSV(entries, `export_${currentUser?.name || 'user'}`)}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-[10px] uppercase tracking-wider transition-all shadow-lg shadow-emerald-500/20"
            >
              <Download className="w-3.5 h-3.5" />
              Get Bill (CSV)
            </button>
            <button
              onClick={() => exportService.exportToCSV(allEntries, 'export_complete_archive')}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-[10px] uppercase tracking-wider transition-all shadow-lg shadow-blue-500/20"
            >
              <Layers className="w-3.5 h-3.5" />
              Archive All
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {entries.map((entry) => (
          <div 
            key={entry.id}
            onClick={() => {
              setSelectedEntry(entry);
              setIsEditing(false);
            }}
            className="group relative bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-xl shadow-slate-200/50 dark:shadow-none hover:shadow-2xl transition-all hover:-translate-y-1 cursor-pointer overflow-hidden"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                  <Package className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <h3 className="font-numeric font-bold text-lg dark:text-white leading-tight flex items-center gap-2">
                    {entry.invoiceNumber}
                    <span className="text-[9px] bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded text-slate-500 dark:text-slate-400 uppercase tracking-tighter">
                      {entry.itemType}
                    </span>
                  </h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{entry.date}</p>
                </div>
              </div>
              <div className="flex gap-1">
                {isTrashView && onRestore && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRestore(entry.id);
                    }}
                    className="p-2 text-slate-300 hover:text-emerald-500 transition-colors"
                    title="Restore Entry"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(entry.id);
                  }}
                  className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                  title={isTrashView ? "Delete Permanently" : "Move to Trash"}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700/50">
                <p className="text-[9px] font-bold text-slate-400 uppercase mb-1 flex items-center gap-1">
                  <Scale className="w-3 h-3 text-blue-500" /> WEIGHT
                </p>
                <p className="font-numeric font-bold text-blue-600 dark:text-blue-400">
                  {entry.weight.toFixed(2)}
                  <span className="text-[10px] ml-1">gm</span>
                </p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700/50">
                <p className="text-[9px] font-bold text-slate-400 uppercase mb-1 flex items-center gap-1">
                  <Hash className="w-3 h-3 text-blue-500" /> QTY
                </p>
                <div className="flex flex-col">
                   <p className="font-numeric font-bold dark:text-white text-sm">
                    {entry.itemType === 'Earring' ? `${entry.pairs} PR` : `${entry.quantity} PCS`}
                   </p>
                </div>
              </div>
            </div>

            {entry.photo && (
              <div className="w-full h-32 rounded-xl overflow-hidden mb-2 relative">
                <img src={entry.photo} alt="Record" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Eye className="w-6 h-6 text-white" />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {selectedEntry && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 backdrop-blur-md bg-black/60 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
            <div className="relative h-64 sm:h-80 bg-slate-100 dark:bg-slate-800 shrink-0">
              {isEditing && editData ? (
                <div className="w-full h-full relative">
                  {editData.photo ? (
                    <img src={editData.photo} className="w-full h-full object-cover opacity-60" alt="Edit Preview" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                      <ImageIcon className="w-20 h-20" />
                    </div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-white/80 dark:bg-slate-900/80 px-6 py-3 rounded-full font-bold shadow-lg flex items-center gap-2 hover:bg-white dark:hover:bg-slate-800 transition-all"
                    >
                      <Camera className="w-5 h-5 text-blue-500" /> CHANGE PHOTO
                    </button>
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handlePhotoChange} />
                  </div>
                </div>
              ) : (
                selectedEntry.photo ? (
                  <img src={selectedEntry.photo} className="w-full h-full object-cover" alt="Detail" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300">
                    <Package className="w-20 h-20" />
                  </div>
                )
              )}
              <button 
                onClick={() => {
                  setSelectedEntry(null);
                  setIsEditing(false);
                }}
                className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors backdrop-blur-md z-10"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
              {isEditing && editData ? (
                <div className="space-y-6">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">ID Number</label>
                    <input 
                      type="text" 
                      className="w-full bg-slate-100 dark:bg-slate-800 border-2 border-transparent focus:border-blue-500 rounded-xl px-4 py-3 font-numeric font-bold outline-none dark:text-white"
                      value={editData.invoiceNumber}
                      onChange={(e) => setEditData({...editData, invoiceNumber: e.target.value.toUpperCase()})}
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Weight (gm)</label>
                    <input 
                      type="number" 
                      step="0.001"
                      className="w-full bg-slate-100 dark:bg-slate-800 border-2 border-transparent focus:border-blue-500 rounded-xl px-4 py-3 font-numeric font-bold outline-none dark:text-white"
                      value={editData.weight}
                      onChange={(e) => setEditData({...editData, weight: parseFloat(e.target.value) || 0})}
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button 
                      onClick={handleSaveEdit}
                      className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-header font-bold text-sm hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-xl shadow-blue-500/30"
                    >
                      <Save className="w-4 h-4" /> SAVE CHANGES
                    </button>
                    <button 
                      onClick={() => setIsEditing(false)}
                      className="flex-1 py-4 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-white rounded-2xl font-header font-bold text-sm hover:bg-slate-300 transition-colors"
                    >
                      CANCEL
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                    <div>
                      <h2 className="text-3xl font-header font-extrabold dark:text-white leading-none mb-1">
                        ID: {selectedEntry.invoiceNumber}
                      </h2>
                      <div className="flex items-center gap-3 text-slate-400 text-xs font-bold uppercase tracking-widest">
                        <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5"/> {selectedEntry.date}</span>
                        <span className="flex items-center gap-1"><UserIcon className="w-3.5 h-3.5"/> {currentUser?.name}</span>
                      </div>
                    </div>
                    <div className="px-4 py-2 bg-blue-600 text-white rounded-2xl font-numeric font-bold text-2xl shadow-xl shadow-blue-500/30">
                      {selectedEntry.weight.toFixed(3)} <span className="text-sm">gm</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Item Type</p>
                      <p className="font-header font-bold text-sm dark:text-white uppercase">{selectedEntry.itemType}</p>
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Quantity</p>
                      <p className="font-numeric font-bold text-lg dark:text-white">
                        {selectedEntry.itemType === 'Earring' ? `${selectedEntry.pairs} PR` : `${selectedEntry.quantity} Units`}
                      </p>
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Timestamp</p>
                      <p className="font-numeric font-bold text-xs dark:text-slate-400">{new Date(selectedEntry.createdAt).toLocaleTimeString()}</p>
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">User</p>
                      <p className="font-header font-bold text-[10px] dark:text-white truncate">{currentUser?.name}</p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    {!isTrashView ? (
                      <>
                        <button 
                          onClick={handleStartEdit}
                          className="flex-1 py-4 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-2xl font-header font-bold text-sm hover:bg-blue-100 transition-colors flex items-center justify-center gap-2"
                        >
                          <Edit3 className="w-4 h-4" /> EDIT ENTRY
                        </button>
                        <button 
                          onClick={() => {
                            onDelete(selectedEntry.id);
                            setSelectedEntry(null);
                          }}
                          className="flex-1 py-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-2xl font-header font-bold text-sm hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" /> MOVE TO TRASH
                        </button>
                      </>
                    ) : (
                      <>
                         <button 
                          onClick={() => {
                            if (onRestore) onRestore(selectedEntry.id);
                            setSelectedEntry(null);
                          }}
                          className="flex-1 py-4 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-2xl font-header font-bold text-sm hover:bg-emerald-100 transition-colors flex items-center justify-center gap-2"
                        >
                          <RotateCcw className="w-4 h-4" /> RESTORE ENTRY
                        </button>
                        <button 
                          onClick={() => {
                            onDelete(selectedEntry.id);
                            setSelectedEntry(null);
                          }}
                          className="flex-1 py-4 bg-red-600 text-white rounded-2xl font-header font-bold text-sm hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" /> DELETE PERMANENTLY
                        </button>
                      </>
                    )}
                    <button 
                      onClick={() => setSelectedEntry(null)}
                      className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl font-header font-bold text-sm hover:bg-slate-200 transition-colors flex items-center justify-center"
                    >
                      CLOSE
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
