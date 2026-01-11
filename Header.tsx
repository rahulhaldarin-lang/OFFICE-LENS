
import React, { useState, useRef, useEffect } from 'react';
import { Sun, Moon, Database, Users, ChevronDown, Trash2, Camera, User as UserIcon, Edit2, Save, ArrowLeft, Plus, ExternalLink, Star, Phone } from 'lucide-react';
import { Theme, AppSettings, User } from '../types';

interface HeaderProps {
  theme: Theme;
  setTheme: (t: Theme) => void;
  settings: AppSettings;
  setSettings: (s: AppSettings) => void;
  users: User[];
  currentUserId: string;
  setCurrentUserId: (id: string) => void;
  onAddUser: (name: string) => void;
  onUpdateUser: (u: User) => void;
  onViewTrash: () => void;
  trashCount: number;
  forceEditUser?: User | null;
  onClearForceEdit?: () => void;
  onSetView?: (view: 'form' | 'list' | 'trash') => void;
  onShowOwnerDetails?: () => void;
  onShowContact?: () => void;
  onShowAbout?: () => void;
  // Added onShowHelp to props definition
  onShowHelp?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  theme, setTheme, settings, setSettings, users, currentUserId, setCurrentUserId, onAddUser, onUpdateUser, onViewTrash, trashCount, forceEditUser, onClearForceEdit, onSetView, onShowOwnerDetails, onShowContact, onShowAbout, onShowHelp
}) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (forceEditUser) {
      setEditingUser(forceEditUser);
      setIsUserMenuOpen(true);
      if (onClearForceEdit) onClearForceEdit();
    }
  }, [forceEditUser, onClearForceEdit]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
        setEditingUser(null);
        setIsAddingUser(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentUser = users.find(u => u.id === currentUserId);

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editingUser) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingUser({ ...editingUser, avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    if (editingUser) {
      onUpdateUser(editingUser);
      setEditingUser(null);
    }
  };

  const handleAddNewUser = () => {
    if (newUserName.trim()) {
      onAddUser(newUserName);
      setNewUserName('');
      setIsAddingUser(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md border-b border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70">
      <div className="max-w-5xl mx-auto px-4 h-24 flex items-center justify-between gap-4">
        
        {/* Brand with Iconic Nav Bar */}
        <div className="flex flex-col justify-center gap-1 flex-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0">
              <Database className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-lg font-header font-black tracking-tight text-slate-900 dark:text-white leading-none">
              Office Lens<span className="text-blue-600">.</span>
            </h1>
          </div>
          
          {/* Quick Nav Ribbon - Direct Buttons */}
          <div className="flex items-center gap-1 pl-0.5 overflow-x-auto no-scrollbar max-w-full pb-1 sm:pb-0">
            {/* Daily Dai Direct Link */}
            <a
              href="https://dai-number.netlify.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-all shrink-0 font-black uppercase text-[9px] tracking-widest border border-blue-100 dark:border-blue-800/50"
            >
              <Star className="w-3 h-3 fill-current" />
              Daily Dai
              <ExternalLink className="w-2.5 h-2.5 ml-1 opacity-70" />
            </a>
            
            <div className="w-px h-3 bg-slate-200 dark:bg-slate-700 mx-1 shrink-0" />
            
            {/* Social Link - Direct to Facebook */}
            <a 
              href="https://www.facebook.com/share/16qvrqg8Hw/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-2 py-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-blue-500 transition-all shrink-0 inline-flex items-center"
            >
              <span className="text-[9px] font-black uppercase tracking-widest">Social</span>
            </a>

            <button 
              onClick={onShowOwnerDetails}
              className="px-2 py-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-indigo-500 transition-all shrink-0"
            >
              <span className="text-[9px] font-black uppercase tracking-widest">Owner details</span>
            </button>
            <button 
              onClick={onShowContact}
              className="px-2 py-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-emerald-500 transition-all shrink-0 flex items-center gap-1"
            >
              <span className="text-[9px] font-black uppercase tracking-widest">Contact</span>
              <span className="text-[8px] font-black uppercase tracking-widest px-1 py-0.5 bg-red-500 text-white rounded-[4px] animate-pulse">Emergency</span>
            </button>
            <button 
              onClick={onShowAbout}
              className="px-2 py-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-cyan-500 transition-all shrink-0"
            >
              <span className="text-[9px] font-black uppercase tracking-widest">About</span>
            </button>
            {/* Added Help button to the header ribbon */}
            <button 
              onClick={onShowHelp}
              className="px-2 py-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-blue-500 transition-all shrink-0"
            >
              <span className="text-[9px] font-black uppercase tracking-widest">Help</span>
            </button>
          </div>
        </div>

        {/* User Actions */}
        <div className="flex items-center gap-2" ref={menuRef}>
          <div className="relative">
            <button
              onClick={() => {
                setIsUserMenuOpen(!isUserMenuOpen);
                setEditingUser(null);
                setIsAddingUser(false);
              }}
              className="flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl hover:ring-2 hover:ring-blue-400 transition-all border border-transparent dark:border-slate-700"
            >
              {currentUser?.avatar ? (
                <img src={currentUser.avatar} className="w-5 h-5 rounded-full object-cover shadow-sm" alt="User" />
              ) : (
                <Users className="w-4 h-4 text-blue-600" />
              )}
              <span className="text-xs font-bold truncate max-w-[80px] hidden sm:inline">{currentUser?.name}</span>
              <ChevronDown className={`w-3 h-3 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {isUserMenuOpen && (
              <div className="absolute top-full right-0 mt-3 w-80 bg-white dark:bg-[#0f172a] rounded-[32px] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden z-[60] animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                
                {editingUser ? (
                  <div className="p-6 space-y-5 animate-in slide-in-from-right-4 duration-300">
                    <div className="flex items-center gap-3 mb-2">
                      <button onClick={() => setEditingUser(null)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400 transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                      </button>
                      <p className="text-xs font-black uppercase tracking-widest text-blue-600">Edit Profile</p>
                    </div>

                    <div className="flex flex-col items-center gap-4">
                      <div className="relative group">
                        <div className="w-20 h-20 rounded-[28px] overflow-hidden bg-slate-50 dark:bg-slate-900 border-4 border-slate-100 dark:border-slate-800 shadow-lg">
                          {editingUser.avatar ? <img src={editingUser.avatar} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-slate-200"><UserIcon className="w-8 h-8" /></div>}
                        </div>
                        <button onClick={() => avatarInputRef.current?.click()} className="absolute -bottom-1 -right-1 p-2 bg-blue-600 text-white rounded-xl shadow-lg hover:scale-110 active:scale-95 transition-all">
                          <Camera className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="w-full space-y-3">
                        <div>
                          <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1 ml-1">Full Name</label>
                          <input 
                            type="text" 
                            placeholder="Full Name"
                            className="w-full bg-slate-50 dark:bg-slate-900/50 rounded-2xl px-4 py-3 text-xs font-bold outline-none border-2 border-transparent focus:border-blue-500 dark:text-white transition-all"
                            value={editingUser.name} 
                            onChange={(e) => setEditingUser({...editingUser, name: e.target.value})} 
                          />
                        </div>
                        <div>
                          <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1 ml-1">Mobile Number</label>
                          <div className="relative">
                            <input 
                              type="tel" 
                              placeholder="+91 00000 00000"
                              className="w-full bg-slate-50 dark:bg-slate-900/50 rounded-2xl px-4 py-3 pl-9 text-xs font-numeric font-bold outline-none border-2 border-transparent focus:border-blue-500 dark:text-white transition-all"
                              value={editingUser.mobile || ''} 
                              onChange={(e) => setEditingUser({...editingUser, mobile: e.target.value})} 
                            />
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <button onClick={handleSaveProfile} className="w-full py-3.5 bg-blue-600 text-white rounded-2xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-blue-500/20 hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-2">
                      <Save className="w-4 h-4" /> Sync Profile
                    </button>
                  </div>
                ) : isAddingUser ? (
                  <div className="p-6 space-y-5 animate-in slide-in-from-right-4 duration-300">
                    <div className="flex items-center gap-3 mb-2">
                      <button onClick={() => setIsAddingUser(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400 transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                      </button>
                      <p className="text-xs font-black uppercase tracking-widest text-emerald-600">Add User</p>
                    </div>
                    <div className="space-y-4">
                      <input 
                        autoFocus
                        type="text" 
                        placeholder="Name..."
                        className="w-full bg-slate-50 dark:bg-slate-900/50 rounded-2xl px-5 py-4 text-sm font-bold outline-none border-2 border-transparent focus:border-emerald-500 dark:text-white transition-all"
                        value={newUserName} 
                        onChange={(e) => setNewUserName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddNewUser()}
                      />
                      <button onClick={handleAddNewUser} className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-emerald-500/20 hover:bg-emerald-700 active:scale-95 transition-all">
                        Register User
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col max-h-[480px]">
                    <div className="px-6 py-5 bg-slate-50/50 dark:bg-slate-800/20 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Personnel</p>
                      <button onClick={() => setIsAddingUser(true)} className="p-2 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-500/20 hover:scale-110 active:scale-90 transition-all">
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-2 custom-scrollbar space-y-1">
                      {users.map(user => (
                        <div key={user.id} className="group flex items-center gap-1">
                          <button
                            onClick={() => {
                              setCurrentUserId(user.id);
                              setIsUserMenuOpen(false);
                            }}
                            className={`flex-1 flex items-center gap-3 p-3 rounded-2xl transition-all ${
                              currentUserId === user.id 
                              ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/30' 
                              : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                            }`}
                          >
                            {user.avatar ? (
                              <img src={user.avatar} className="w-8 h-8 rounded-lg object-cover" alt="Av" />
                            ) : (
                              <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                                <UserIcon className="w-4 h-4 text-slate-400" />
                              </div>
                            )}
                            <div className="text-left truncate">
                              <p className="text-xs font-black truncate">{user.name}</p>
                              {user.mobile && <p className={`text-[8px] font-numeric font-bold ${currentUserId === user.id ? 'text-blue-100' : 'text-slate-400'}`}>{user.mobile}</p>}
                            </div>
                          </button>
                          <button 
                            onClick={() => setEditingUser(user)} 
                            className="p-3 opacity-0 group-hover:opacity-100 text-slate-300 hover:text-blue-600 transition-all"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <button
            onClick={onViewTrash}
            className="relative p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:ring-2 hover:ring-red-400 hover:text-red-500 transition-all border border-transparent dark:border-slate-700 sm:block hidden"
            title="Trash"
          >
            <Trash2 className="w-5 h-5" />
            {trashCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900">
                {trashCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:ring-2 hover:ring-blue-400 transition-all border border-transparent dark:border-slate-700"
          >
            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>
        </div>
      </div>
      
      <input type="file" ref={avatarInputRef} className="hidden" accept="image/*" onChange={handleAvatarUpload} />
    </header>
  );
};
