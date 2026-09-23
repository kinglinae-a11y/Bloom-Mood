import { X, Phone, MessageSquare, ExternalLink, ShieldCheck, HeartHandshake } from 'lucide-react';
import { CRISIS_RESOURCES } from '../data/adolescenceContent';

interface CrisisModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CrisisModal({ isOpen, onClose }: CrisisModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-stone-200 overflow-y-auto max-h-[90vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="crisis-modal-title"
      >
        <div className="flex items-start justify-between pb-4 border-b border-stone-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h2 id="crisis-modal-title" className="font-display text-lg font-bold text-stone-900">
                You Are Not Alone & You Matter
              </h2>
              <p className="text-xs text-stone-500">
                Free · 100% Confidential · Available 24 Hours Every Day
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
            aria-label="Close crisis resources dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-4 space-y-3">
          <div className="p-3.5 bg-emerald-50/70 border border-emerald-100 rounded-xl text-xs text-emerald-900 leading-relaxed">
            <span className="font-semibold block mb-0.5">Please remember:</span>
            No matter how heavy, dark, or impossible things feel right now, intense emotional pain is temporary. You do not have to survive this moment in isolation. Reaching out is a sign of courage.
          </div>

          <div className="space-y-2.5 pt-2">
            {CRISIS_RESOURCES.map((item) => (
              <div 
                key={item.name}
                className="p-3.5 rounded-xl border border-stone-200/90 hover:border-stone-300 bg-stone-50/50 transition-colors"
              >
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-bold text-stone-900">{item.name}</h3>
                  <span className="text-[11px] font-medium text-stone-500">
                    {item.badge}
                  </span>
                </div>
                <p className="text-xs text-stone-600 mb-2.5 leading-relaxed">
                  {item.description}
                </p>
                <div className="flex items-center gap-2">
                  {item.contact.startsWith('http') ? (
                    <a
                      href={item.contact}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Visit Directory
                    </a>
                  ) : item.contact.length <= 4 ? (
                    <a
                      href={`tel:${item.contact}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      {item.action}
                    </a>
                  ) : item.contact.startsWith('741') ? (
                    <a
                      href={`sms:${item.contact}?body=HOME`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-700 text-white text-xs font-semibold hover:bg-emerald-800 transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      {item.action}
                    </a>
                  ) : (
                    <a
                      href={`tel:${item.contact}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      {item.action}
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Your privacy and safety are paramount
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-stone-700 hover:text-stone-900 bg-stone-100 rounded-lg hover:bg-stone-200 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
