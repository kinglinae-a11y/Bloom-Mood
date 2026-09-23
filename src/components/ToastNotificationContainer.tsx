import { useEffect, useState } from 'react';
import { ToastNotification } from '../types';
import { 
  Bell, 
  CheckCircle2, 
  Info, 
  X, 
  ArrowRight,
  Heart
} from 'lucide-react';

interface ToastNotificationContainerProps {
  toasts: ToastNotification[];
  onDismiss: (id: string) => void;
  onActionClick: (toast: ToastNotification) => void;
}

export function ToastNotificationContainer({
  toasts,
  onDismiss,
  onActionClick
}: ToastNotificationContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div 
      className="fixed top-20 right-4 sm:right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none"
      role="region"
      aria-label="Notifications"
    >
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onDismiss={() => onDismiss(toast.id)}
          onActionClick={() => onActionClick(toast)}
        />
      ))}
    </div>
  );
}

function ToastItem({
  toast,
  onDismiss,
  onActionClick
}: {
  toast: ToastNotification;
  onDismiss: () => void;
  onActionClick: () => void;
}) {
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(100);
  const duration = toast.duration || 8000;

  useEffect(() => {
    if (isPaused) return;

    const intervalTime = 50;
    const step = (intervalTime / duration) * 100;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev <= step) {
          clearInterval(interval);
          onDismiss();
          return 0;
        }
        return prev - step;
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, [isPaused, duration, onDismiss]);

  const isReminder = toast.type === 'reminder' || !toast.type;
  const isSuccess = toast.type === 'success';

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="pointer-events-auto bg-white rounded-2xl border border-stone-200 shadow-xl overflow-hidden animate-in slide-in-from-top-4 fade-in duration-200 transition-all hover:border-emerald-300"
      role="alert"
    >
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
              isReminder 
                ? 'bg-emerald-100 text-emerald-800' 
                : isSuccess 
                ? 'bg-emerald-100 text-emerald-800' 
                : 'bg-stone-100 text-stone-700'
            }`}>
              {isReminder ? (
                <Bell className="w-4 h-4 animate-bounce" />
              ) : isSuccess ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                <Info className="w-4 h-4" />
              )}
            </div>

            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                <Heart className="w-3 h-3 text-emerald-600" />
                <span>Sanctuary Check-in</span>
              </div>
              <h4 className="font-display text-sm font-bold text-stone-900 leading-snug">
                {toast.title}
              </h4>
            </div>
          </div>

          <button
            onClick={onDismiss}
            aria-label="Close notification"
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-stone-600 leading-relaxed pl-11">
          {toast.message}
        </p>

        {toast.actionLabel && (
          <div className="pl-11 pt-1 flex items-center gap-2">
            <button
              onClick={onActionClick}
              className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <span>{toast.actionLabel}</span>
              <ArrowRight className="w-3 h-3" />
            </button>
            <button
              onClick={onDismiss}
              className="px-2.5 py-1.5 text-stone-500 hover:text-stone-800 text-xs font-medium cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}
      </div>

      {/* Auto-dismiss progress bar indicator */}
      <div className="h-1 bg-stone-100 w-full overflow-hidden">
        <div 
          className="h-full bg-emerald-600 transition-all ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
