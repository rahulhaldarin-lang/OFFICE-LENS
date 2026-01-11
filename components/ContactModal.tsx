
import React, { useState, useEffect } from 'react';
import { X, Phone, ArrowLeft, Contact, User, PhoneCall, Plus, Trash2, Edit2, Save, Search, RotateCcw, Trash, AlertTriangle, Calendar } from 'lucide-react';
import { User as UserType } from '../types';

interface ContactEntry {
  id: string;
  name: string;
  phone: string;
  isDeleted?: boolean;
  deletedAt?: string; // New field to store deletion date
}

interface ContactModalProps {
  currentUser?: UserType;
  onUpdateUser?: (u: UserType) => void;
  onClose: () => void;
}

const INITIAL_CONTACTS: ContactEntry[] = [
  { id: '1', name: 'Dipen Chauhan', phone: '+917405636042', isDeleted: false },
  { id: '2', name: 'Abhijeet Koley', phone: '+918320184140', isDeleted: false },
  { id: '3', name: 'Hetal Madam', phone: '+91 97238 91734', isDeleted: false },
  { id: '4', name: 'Jamai Babu', phone: '+91 97238 91734', isDeleted: false },
  { id: '5', name: 'Rahul Haldar', phone: '+919332578394', isDeleted: false },
];

export const ContactModal: React.FC<ContactModalProps> = ({ onClose }) => {
  const [contacts, setContacts] = useState<ContactEntry[]>(() => {
    const saved = localStorage.getItem('app_phonebook_v2');
    return saved ? JSON.parse(saved) : INITIAL_CONTACTS;
  });

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [view, setView] = useState<'list' | 'trash'>('list');
  
  const [formData, setFormData] = useState({ name: '', phone: '' });

  useEffect(() => {
    localStorage.setItem('app_phonebook_v2', JSON.stringify(contacts));
  }, [contacts]);

  // Helper to get current date in DD/MM/YYYY
  const getCurrentDate = () => {
    const now = new Date();
    return `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
  };

  const handleSave = () => {
    if (!formData.name || !formData.phone) return;

    if (editingId) {
      setContacts(contacts.map(c => c.id === editingId ? { ...formData, id: editingId, isDeleted: false } : c));
      setEditingId(null);
    } else {
      const newEntry: ContactEntry = { ...formData, id: crypto.randomUUID(), isDeleted: false };
      setContacts([newEntry, ...contacts]);
    }

    setFormData({ name: '', phone: '' });
    setIsAdding(false);
  };

  const startEdit = (contact: ContactEntry) => {
    setFormData({ name: contact.name, phone: contact.phone });
    setEditingId(contact.id);
    setIsAdding(true);
    setView('list');
  };

  const handleSoftDelete = (id: string) => {
    setContacts(contacts.map(c => 
      c.id === id ? { ...c, isDeleted: true, deletedAt: getCurrentDate() } : c
    ));
  };

  const handleRestore = (id: string) => {
    setContacts(contacts.map(c => c.id === id ? { ...c, isDeleted: false, deletedAt: undefined } : c));
  };

  const handlePermanentDelete = (id: string) => {
    if (window.confirm('Permanently delete this contact? This cannot be undone.')) {
      setContacts(contacts.filter(c => c.id !== id));
    }
  };

  const handleEmptyTrash = () => {
    if (window.confirm('Wipe all deleted contacts permanently? This action is irreversible.')) {
      setContacts(contacts.filter(c => !c.isDeleted));
    }
  };

  const filteredContacts = contacts.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         c.phone.includes(searchQuery);
    const isTargetView = view === 'list' ? !c.isDeleted : c.isDeleted;
    return matchesSearch && isTargetView;
  });

  const trashCount = contacts.filter(c => c.isDeleted).length;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 backdrop-blur-lg bg-slate-900/40 animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[40px] shadow-2xl border border-white/20 overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
        
        {/* Header Ribbon */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <button 
              onClick={onClose} 
              className="flex items-center gap-2 px-3 py-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-all text-slate-600 dark:text-slate-300 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-[10px] font-black uppercase tracking-widest">Back</span>
            </button>
            <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-1" />
            <button 
              onClick={() => { setView(view === 'list' ? 'trash' : 'list'); setIsAdding(false); }}
              className={`relative p-2 rounded-xl transition-all ${view === 'trash' ? 'bg-red-500 text-white shadow-lg' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}
              title={view === 'trash' ? 'Back to Contacts' : 'View Trash Bin'}
            >
              {view === 'trash' ? <Contact className="w-4 h-4" /> : <Trash className="w-4 h-4" />}
              {view === 'list' && trashCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900">
                  {trashCount}
                </span>
              )}
            </button>
          </div>
          
          <div className="flex items-center gap-2">
            <Contact className={`w-4 h-4 ${view === 'trash' ? 'text-red-500' : 'text-emerald-500'}`} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              {view === 'trash' ? 'Trash Bin' : 'Phonebook'}
            </span>
          </div>
          
          <button 
            onClick={onClose}
            className="p-2.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-all text-slate-400 hover:text-red-500 group"
          >
            <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 sm:p-8 space-y-6 overflow-y-auto custom-scrollbar flex-1">
          
          {/* Add/Edit Form */}
          {isAdding ? (
            <div className="bg-emerald-50 dark:bg-emerald-900/10 p-6 rounded-[32px] border border-emerald-100 dark:border-emerald-800/30 space-y-4 animate-in slide-in-from-top-4 duration-300">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                  {editingId ? 'Edit Contact' : 'New Contact Entry'}
                </p>
                <button 
                  onClick={() => { setIsAdding(false); setEditingId(null); setFormData({ name: '', phone: '' }); }}
                  className="text-slate-400 hover:text-red-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-3">
                <input 
                  autoFocus
                  type="text" 
                  placeholder="Full Name" 
                  className="w-full bg-white dark:bg-slate-900 border-2 border-transparent focus:border-emerald-500 rounded-2xl px-5 py-3 text-sm font-bold outline-none dark:text-white transition-all shadow-sm"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                <input 
                  type="tel" 
                  placeholder="Phone Number" 
                  className="w-full bg-white dark:bg-slate-900 border-2 border-transparent focus:border-emerald-500 rounded-2xl px-5 py-3 text-sm font-numeric font-bold outline-none dark:text-white transition-all shadow-sm"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <button 
                onClick={handleSave}
                className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                {editingId ? 'Update Record' : 'Save To Book'}
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder={view === 'trash' ? "Search deleted..." : "Search contacts..."}
                    className={`w-full bg-slate-50 dark:bg-slate-800 rounded-2xl pl-11 pr-4 py-3.5 text-xs font-bold outline-none border border-transparent transition-all dark:text-white ${view === 'trash' ? 'focus:border-red-500/50' : 'focus:border-emerald-500/50'}`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                {view === 'list' && (
                  <button 
                    onClick={() => setIsAdding(true)}
                    className="p-3.5 bg-emerald-600 text-white rounded-2xl shadow-lg shadow-emerald-500/20 hover:scale-110 active:scale-95 transition-all"
                    title="Add New Contact"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                )}
              </div>
              
              {view === 'trash' && trashCount > 0 && (
                <button 
                  onClick={handleEmptyTrash}
                  className="flex items-center justify-center gap-2 py-3 bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 rounded-2xl border border-red-100 dark:border-red-900/20 text-[10px] font-black uppercase tracking-widest hover:bg-red-100 transition-all"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Wipe All Permanently
                </button>
              )}
            </div>
          )}

          {/* List Section */}
          <div className="space-y-3">
            {view === 'trash' && (
              <div className="flex items-center gap-2 mb-4 px-2">
                <div className="p-1 bg-red-500 text-white rounded-md">
                  <Trash className="w-3 h-3" />
                </div>
                <p className="text-[9px] font-black uppercase tracking-widest text-red-500">Recently Deleted</p>
              </div>
            )}
            
            {filteredContacts.length > 0 ? (
              filteredContacts.map((contact) => (
                <div 
                  key={contact.id}
                  className={`flex items-center justify-between p-4 rounded-3xl border transition-all group shadow-sm ${view === 'trash' ? 'bg-red-50/50 dark:bg-red-900/5 border-red-100 dark:border-red-900/20' : 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 hover:border-emerald-500/20'}`}
                >
                  <div className="flex items-center gap-4 truncate">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm border transition-colors shrink-0 ${view === 'trash' ? 'bg-white dark:bg-slate-900 border-red-100 dark:border-red-900/20' : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 group-hover:bg-emerald-600'}`}>
                      <User className={`w-6 h-6 transition-colors ${view === 'trash' ? 'text-red-300' : 'text-slate-300 group-hover:text-white'}`} />
                    </div>
                    <div className="truncate">
                      <h4 className={`text-sm font-black uppercase truncate tracking-tight ${view === 'trash' ? 'text-slate-500 dark:text-slate-400' : 'text-slate-900 dark:text-white'}`}>{contact.name}</h4>
                      <p className="text-xs font-numeric font-bold text-slate-400 mt-0.5">{contact.phone}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 shrink-0 ml-2">
                    {view === 'list' ? (
                      <>
                        <button 
                          onClick={() => startEdit(contact)}
                          className="p-2 text-slate-300 hover:text-blue-500 transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleSoftDelete(contact.id)}
                          className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                          title="Move to Trash"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <a 
                          href={`tel:${contact.phone.replace(/\s/g, '')}`}
                          className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all ml-1 shadow-sm"
                        >
                          <PhoneCall className="w-4 h-4" />
                        </a>
                      </>
                    ) : (
                      <>
                        {/* New Date Button for Trash View */}
                        <button 
                          onClick={() => handlePermanentDelete(contact.id)}
                          className="flex items-center gap-2 px-3 py-1.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl border border-red-200 dark:border-red-800/30 hover:bg-red-500 hover:text-white transition-all group/date"
                          title="Click to Delete Permanently"
                        >
                          <Calendar className="w-3 h-3 group-hover/date:hidden" />
                          <Trash className="w-3 h-3 hidden group-hover/date:block" />
                          <span className="text-[9px] font-black uppercase tracking-widest">
                            {contact.deletedAt || 'Trashed'}
                          </span>
                        </button>

                        <button 
                          onClick={() => handleRestore(contact.id)}
                          className="p-2 text-slate-400 hover:text-emerald-500 transition-colors ml-1"
                          title="Restore"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center space-y-2 opacity-40">
                {view === 'trash' ? <Trash className="w-12 h-12 mx-auto text-slate-200" /> : <Contact className="w-12 h-12 text-slate-200 mx-auto" />}
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  {view === 'trash' ? 'Trash is empty' : 'No contacts found'}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="p-6 border-t border-slate-100 dark:border-slate-800 shrink-0">
          <button 
            onClick={onClose}
            className="w-full py-5 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-[24px] font-header font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all"
          >
            Exit Phonebook
          </button>
        </div>
      </div>
    </div>
  );
};
