
import React from 'react';
import { Plus, Minus, RotateCcw } from 'lucide-react';

interface CounterProps {
  value: number;
  onChange: (val: number) => void;
}

export const Counter: React.FC<CounterProps> = ({ value, onChange }) => {
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => onChange(Math.max(0, value - 1))}
        className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 transition-all active:scale-90"
      >
        <Minus className="w-4 h-4" />
      </button>
      
      <div className="flex-1 relative">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value) || 0)}
          className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-transparent focus:border-blue-500 rounded-lg px-2 py-2 text-center font-numeric text-2xl font-bold dark:text-white outline-none"
        />
      </div>

      <button
        type="button"
        onClick={() => onChange(value + 1)}
        className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 transition-all active:scale-90"
      >
        <Plus className="w-4 h-4" />
      </button>

      <button
        type="button"
        onClick={() => onChange(0)}
        className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500 flex items-center justify-center hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 transition-all active:scale-90 ml-1"
        title="Reset to zero"
      >
        <RotateCcw className="w-4 h-4" />
      </button>
    </div>
  );
};
