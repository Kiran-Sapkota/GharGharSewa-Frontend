import React from 'react';

export const Table = ({ children, className = "" }) => (
  <div className={`w-full overflow-x-auto ${className}`}>
    <table className="w-full text-left border-separate border-spacing-y-2">
      {children}
    </table>
  </div>
);

export const THead = ({ children }) => (
  <thead className="bg-transparent">
    {children}
  </thead>
);

export const TBody = ({ children }) => (
  <tbody className="space-y-4">
    {children}
  </tbody>
);

export const TR = ({ children, className = "" }) => (
  <tr className={`group bg-white dark:bg-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-300 rounded-2xl shadow-sm hover:shadow-md ${className}`}>
    {children}
  </tr>
);

export const TH = ({ children, className = "" }) => (
  <th className={`px-8 py-4 text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ${className}`}>
    {children}
  </th>
);

export const TD = ({ children, className = "" }) => (
  <td className={`px-8 py-5 text-sm font-semibold text-slate-700 dark:text-slate-300 first:rounded-l-2xl last:rounded-r-2xl border-y border-slate-50/50 dark:border-slate-700/30 first:border-l last:border-r ${className}`}>
    {children}
  </td>
);

export const Badge = ({ children, variant = 'gray' }) => {
  const variants = {
    green: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20',
    blue: 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-500/20',
    red: 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border-red-100 dark:border-red-500/20',
    yellow: 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-500/20',
    gray: 'bg-slate-50 dark:bg-slate-700/50 text-slate-600 dark:text-slate-400 border-slate-100 dark:border-slate-700/50'
  };
  
  return (
    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${variants[variant]}`}>
      {children}
    </span>
  );
};
