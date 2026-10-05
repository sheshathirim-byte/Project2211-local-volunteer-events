import React from 'react';
import { useVolunteer } from '../context/VolunteerContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastBanner: React.FC = () => {
  const { toast, dismissToast } = useVolunteer();

  if (!toast) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-sm w-full animate-in slide-in-from-bottom-5 duration-300">
      <div
        className={`p-4 rounded-xl border shadow-xl flex items-start gap-3 backdrop-blur-md ${
          toast.type === 'urgent'
            ? 'bg-amber-950/95 text-amber-50 border-amber-800'
            : toast.type === 'success'
            ? 'bg-stone-900/95 text-stone-50 border-stone-800'
            : 'bg-white/95 text-stone-900 border-stone-300'
        }`}
      >
        <div className="shrink-0 mt-0.5">
          {toast.type === 'urgent' ? (
            <AlertCircle className="w-5 h-5 text-amber-400" />
          ) : toast.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          ) : (
            <Info className="w-5 h-5 text-stone-600" />
          )}
        </div>

        <div className="flex-1 space-y-1 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-semibold">{toast.title}</span>
            <span className="text-[10px] opacity-60 font-mono tabular-nums">
              {toast.timestamp}
            </span>
          </div>
          <p className="opacity-90 leading-relaxed">{toast.message}</p>
        </div>

        <button
          onClick={dismissToast}
          className="shrink-0 p-1 opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
