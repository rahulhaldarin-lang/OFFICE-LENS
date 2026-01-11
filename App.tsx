import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { EntryForm } from './components/EntryForm';
import { EntryList } from './components/EntryList';
import { BillingModal } from './components/BillingModal';
import { OwnerDetailsModal } from './components/OwnerDetailsModal';
import { ContactModal } from './components/ContactModal';
import { AboutModal } from './components/AboutModal';
import { HelpModal } from './components/HelpModal';
import { Notebook } from './components/Notebook';
import { Theme, InventoryEntry, User, AppSettings } from './types';
import { storageService } from './services/storageService';
import { Plus, List, Zap, User as UserIcon, Trash2, ArrowLeft, Receipt, Star, ExternalLink, BookOpen, ChevronRight, Edit2, Phone, Globe, Info, X } from 'lucide-react';

const App: React.FC = () => {
  const [theme, setTheme] = useState<Theme>(() => 
    (localStorage.getItem('theme') as Theme) || 'light'
  );
  
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('app_settings');
    return saved ? JSON.parse(saved) : { primaryTitle: 'PRECISION', secondaryTitle: 'Gram Tracker Pro' };
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('app_users');
    return saved ? JSON.parse(saved) : [{ id: 'default', name: 'Master User' }];
  });

  const [currentUserId, setCurrentUserId] = useState<string>(() => 
    localStorage.getItem('current_user_id') || 'default'
  );

  const [entries, setEntries] = useState<InventoryEntry[]>([]);
  const [view, setView] = useState<'form' | 'list' | 'trash'>('form');
  const [forceEditUser, setForceEditUser] = useState<User | null>(null);
  const [showBilling, setShowBilling] = useState(false);
  const [showOwnerDetails, setShowOwnerDetails] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showNotebook, setShowNotebook] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('app_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('app_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('current_user_id', currentUserId);
  }, [currentUserId]);

  useEffect(() => {
    const saved = storageService.getEntries();
    setEntries(saved);
  }, []);

  const activeUser = useMemo(() => users.find(u => u.id === currentUserId), [users, currentUserId]);

  const sortById = (a: InventoryEntry, b: InventoryEntry) => {
    return a.invoiceNumber.localeCompare(b.invoiceNumber, undefined, { numeric: true, sensitivity: 'base' });
  };

  const filteredEntries = useMemo(() => {
    return entries
      .filter(e => e.userId === currentUserId && !e.isDeleted)
      .sort(sortById);
  }, [entries, currentUserId]);

  const trashedEntries = useMemo(() => {
    return entries
      .filter(e => e.userId === currentUserId && e.isDeleted)
      .sort(sortById);
  }, [entries, currentUserId]);

  const totalWeight = useMemo(() => {
    return filteredEntries.reduce((acc, curr) => acc + curr.weight, 0);
  }, [filteredEntries]);

  const handleAddEntry = (newEntry: Omit<InventoryEntry, 'id' | 'createdAt'>) => {
    const entry: InventoryEntry = {
      ...newEntry,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      isDeleted: false
    };
    const updated = [entry, ...entries];
    setEntries(updated);
    storageService.saveEntries(updated);
    setView('list');
  };

  const handleUpdateEntry = (updatedEntry: InventoryEntry) => {
    const updated = entries.map(e => e.id === updatedEntry.id ? updatedEntry : e);
    setEntries(updated);
    storageService.saveEntries(updated);
  };

  const handleSoftDelete = (id: string) => {
    const updated = entries.map(e => e.id === id ? { ...e, isDeleted: true } : e);
    setEntries(updated);
    storageService.saveEntries(updated);
  };

  const handleRestoreEntry = (id: string) => {
    const updated = entries.map(e => e.id === id ? { ...e, isDeleted: false } : e);
    setEntries(updated);
    storageService.saveEntries(updated);
  };

  const handlePermanentDelete = (id: string) => {
    const updated = entries.filter(e => e.id !== id);
    setEntries(updated);
    storageService.saveEntries(updated);
  };

  const handleAddUser = (name: string) => {
    const newUser = { id: crypto.randomUUID(), name };
    setUsers([...users, newUser]);
    setCurrentUserId(newUser.id);
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
  };

  const goBack = () => {
    if (view === 'trash') setView('list');
    else setView('form');
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#0f172a] text-slate-100' : 'bg-slate-50 text-slate-900'} transition-colors duration-500`}>
      <Header 
        theme={theme} 
        setTheme={setTheme} 
        settings={settings} 
        setSettings={setSettings}
        users={users}
        currentUserId={currentUserId}
        setCurrentUserId={setCurrentUserId}
        onAddUser={handleAddUser}
        onUpdateUser={handleUpdateUser}
        onViewTrash={() => setView('trash')}
        trashCount={trashedEntries.length}
        forceEditUser={forceEditUser}
        onClearForceEdit={() => setForceEditUser(null)}
        onSetView={setView}
        onShowOwnerDetails={() => setShowOwnerDetails(true)}
        onShowContact={() => setShowContact(true)}
        onShowAbout={() => setShowAbout(true)}
        onShowHelp={() => setShowHelp(true)}
      />

      {/* Global Back Button */}
      {view !== 'form' && (
        <button
          onClick={goBack}
          className="fixed top-24 left-4 z-50 flex items-center gap-2 px-4 py-2.5 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all animate-in slide-in-from-left-4 duration-300"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
      )}

      <main className="max-w-5xl mx-auto px-4 py-8 pb-32">
        {view === 'form' ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-8 flex items-end justify-between border-b border-slate-200 dark:border-slate-700 pb-4">
              <div>
                <h2 className="text-3xl font-header font-black flex items-center gap-2 mb-2 uppercase tracking-tight">
                  <Plus className="w-8 h-8 text-blue-500" />
                  Live Entry
                </h2>
                
                {activeUser && (
                  <div className="flex items-center gap-3 animate-in slide-in-from-left-4 duration-500">
                    <button 
                      onClick={() => setShowBilling(true)}
                      className="group flex items-center gap-3 text-left hover:bg-white dark:hover:bg-slate-800 p-2 -ml-2 rounded-2xl transition-all"
                    >
                      <div className="relative">
                        {activeUser.avatar ? (
                          <img src={activeUser.avatar} className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-slate-900 shadow-lg group-hover:scale-110 transition-transform" alt="Profile" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                            <UserIcon className="w-5 h-5 text-slate-400" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Personnel</p>
                        <p className="text-sm font-bold text-slate-700 dark:text-blue-400">{activeUser.name}</p>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            </div>
            <EntryForm onSubmit={handleAddEntry} currentUserId={currentUserId} />
          </div>
        ) : view === 'list' ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-header font-black mb-6 flex items-center gap-2 uppercase">
              <List className="w-6 h-6 text-blue-500" />
              Archives
            </h2>
            <EntryList 
              entries={filteredEntries} 
              allEntries={entries.filter(e => !e.isDeleted).sort(sortById)}
              onDelete={handleSoftDelete} 
              onUpdate={handleUpdateEntry}
              currentUser={activeUser}
            />
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
             <h2 className="text-2xl font-header font-black flex items-center gap-2 text-red-500 uppercase">
               <Trash2 className="w-6 h-6" />
               Bin
             </h2>
             <EntryList 
              isTrashView
              entries={trashedEntries} 
              allEntries={[]}
              onDelete={handlePermanentDelete} 
              onRestore={handleRestoreEntry}
              onUpdate={() => {}}
              currentUser={activeUser}
            />
          </div>
        )}
      </main>

      <footer className="fixed bottom-24 left-1/2 -translate-x-1/2 hidden md:flex items-center gap-4 text-[9px] font-black uppercase tracking-widest text-slate-400 opacity-60 pointer-events-none">
        <span className="flex items-center gap-1"><Globe className="w-3 h-3"/> Office Lens .</span>
        <span className="w-1 h-1 bg-slate-400 rounded-full"></span>
        <span className="flex items-center gap-1"><Info className="w-3 h-3"/> Precision Tracking Hub</span>
      </footer>

      {showBilling && activeUser && (
        <BillingModal 
          user={activeUser}
          entries={filteredEntries}
          totalWeight={totalWeight}
          onClose={() => setShowBilling(false)}
        />
      )}

      {showOwnerDetails && <OwnerDetailsModal onClose={() => setShowOwnerDetails(false)} />}
      {showContact && <ContactModal onClose={() => setShowContact(false)} />}
      {showAbout && <AboutModal onClose={() => setShowAbout(false)} />}
      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
      {showNotebook && <Notebook onClose={() => setShowNotebook(false)} />}

      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 flex gap-2 p-1.5 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-full shadow-2xl border border-slate-200 dark:border-slate-700 z-50">
        <button
          onClick={() => setView('form')}
          className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-300 ${
            view === 'form'
            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' 
            : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400'
          }`}
        >
          <Plus className="w-5 h-5" />
          <span className="font-bold text-[10px] uppercase tracking-widest">New Entry</span>
        </button>

        <button
          onClick={() => setView('list')}
          className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-300 ${
            view === 'list' || view === 'trash'
            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' 
            : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400'
          }`}
        >
          <List className="w-5 h-5" />
          <span className="font-bold text-[10px] uppercase tracking-widest">Archives</span>
        </button>
      </nav>
    </div>
  );
};

export default App;