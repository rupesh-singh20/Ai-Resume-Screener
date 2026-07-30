import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

const ICONS = {
  success: <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />,
  error:   <XCircle size={18} className="text-red-400 shrink-0" />,
  warning: <AlertTriangle size={18} className="text-amber-400 shrink-0" />,
  info:    <Info size={18} className="text-indigo-400 shrink-0" />,
};

const BORDER = {
  success: 'border-emerald-500/30',
  error:   'border-red-500/30',
  warning: 'border-amber-500/30',
  info:    'border-indigo-500/30',
};

const BG = {
  success: 'bg-emerald-950/70',
  error:   'bg-red-950/70',
  warning: 'bg-amber-950/70',
  info:    'bg-indigo-950/70',
};

const DRAIN_COLORS = {
  success: 'from-emerald-500 to-emerald-400',
  error:   'from-red-500 to-red-400',
  warning: 'from-amber-500 to-amber-400',
  info:    'from-indigo-500 to-purple-400',
};

const ToastItem = ({ toast, onRemove, duration }) => (
  <div
    className={`relative flex flex-col rounded-xl border backdrop-blur-xl shadow-2xl shadow-black/30 min-w-[300px] max-w-sm overflow-hidden animate-slide-in-right
      ${BG[toast.type]} ${BORDER[toast.type]}`}
  >
    {/* Content */}
    <div className="flex items-start gap-3 px-4 py-3.5">
      {ICONS[toast.type]}
      <span className="flex-1 leading-snug text-xs font-medium text-slate-100">{toast.message}</span>
      <button onClick={() => onRemove(toast.id)} className="text-slate-500 hover:text-white transition-colors shrink-0 hover:scale-110">
        <X size={14} />
      </button>
    </div>
    {/* Auto-drain progress bar */}
    <div className="h-[2px] w-full bg-transparent">
      <div
        className={`h-full bg-gradient-to-r ${DRAIN_COLORS[toast.type]} rounded-b-xl`}
        style={{ animation: `drain ${duration}ms linear forwards` }}
      />
    </div>
  </div>
);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type, duration }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const toast = {
    success: (msg) => addToast(msg, 'success'),
    error:   (msg) => addToast(msg, 'error'),
    warning: (msg) => addToast(msg, 'warning'),
    info:    (msg) => addToast(msg, 'info'),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {/* Toast Container */}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 items-end">
        {toasts.map(t => (
          <ToastItem key={t.id} toast={t} onRemove={removeToast} duration={t.duration} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};
