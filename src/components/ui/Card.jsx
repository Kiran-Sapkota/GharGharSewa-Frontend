import React from 'react';

export const Card = ({ children, className = "" }) => (
  <div className={`bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm dark:shadow-2xl rounded-[2rem] overflow-hidden transition-all duration-300 ${className}`}>
    {children}
  </div>
);

export const CardHeader = ({ children, className = "" }) => (
  <div className={`px-8 py-6 border-b border-slate-50 dark:border-slate-700/50 ${className}`}>
    {children}
  </div>
);

export const CardBody = ({ children, className = "" }) => (
  <div className={`p-8 ${className}`}>
    {children}
  </div>
);

export const CardFooter = ({ children, className = "" }) => (
  <div className={`px-8 py-6 bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-50 dark:border-slate-700/50 ${className}`}>
    {children}
  </div>
);
