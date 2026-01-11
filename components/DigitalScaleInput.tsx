
import React, { useRef, useEffect } from 'react';

interface DigitalScaleInputProps {
  value: string;
  onChange: (val: string) => void;
}

export const DigitalScaleInput: React.FC<DigitalScaleInputProps> = ({ value, onChange }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFocus = () => {
    inputRef.current?.focus();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    // Allow only numbers and a single decimal
    if (/^\d*\.?\d{0,3}$/.test(val)) {
      onChange(val);
    }
  };

  return (
    <div 
      onClick={handleFocus}
      className="lcd-display rounded-2xl p-6 md:p-10 cursor-text flex items-baseline justify-end relative overflow-hidden group transition-all"
    >
      {/* Decorative reflection */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
      
      <input
        ref={inputRef}
        type="text"
        inputMode="decimal"
        value={value}
        onChange={handleChange}
        className="bg-transparent border-none outline-none font-numeric text-6xl md:text-8xl font-bold w-full text-right z-10 p-0 m-0"
        placeholder="0.00"
      />
      <span className="ml-4 text-2xl md:text-4xl font-header font-extrabold opacity-50 z-10 mb-2 md:mb-4">gm</span>
      
      {/* Grid Pattern overlay for tech look */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '10px 10px' }} />
    </div>
  );
};
