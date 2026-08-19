import React from 'react';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { useAcademic } from '../context/AcademicContext';

export const Toast: React.FC = () => {
  const { toastMessage } = useAcademic();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-200">
      <div className={`px-4 py-3 rounded-2xl shadow-xl border flex items-center gap-3 text-xs font-semibold text-white ${
        toastMessage.type === 'alert'
          ? 'bg-red-600 border-red-500'
          : toastMessage.type === 'info'
          ? 'bg-slate-900 border-slate-800'
          : 'bg-emerald-600 border-emerald-500'
      }`}>
        {toastMessage.type === 'alert' ? (
          <AlertCircle className="w-4 h-4 text-white shrink-0" />
        ) : toastMessage.type === 'info' ? (
          <Info className="w-4 h-4 text-blue-400 shrink-0" />
        ) : (
          <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
        )}
        <span>{toastMessage.text}</span>
      </div>
    </div>
  );
};
