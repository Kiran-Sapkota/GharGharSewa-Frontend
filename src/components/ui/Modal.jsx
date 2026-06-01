import React from 'react';
import { HiX } from 'react-icons/hi';

export const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-3xl w-full max-w-xl transform transition-all overflow-hidden border border-slate-100 dark:border-slate-800 animate-in fade-in zoom-in duration-300">
        <div className="flex items-center justify-between px-10 py-8">
          <h3 className="text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tight">{title}</h3>
          <button 
            onClick={onClose}
            className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <HiX size={20} />
          </button>
        </div>
        
        <div className="px-10 pb-10 max-h-[75vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};
