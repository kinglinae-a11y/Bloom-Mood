import { useState } from 'react';
import { MoodReminder, DayOfWeek } from '../types';
import { ALL_DAYS, requestBrowserNotificationPermission } from '../utils/reminderService';
import { 
  Bell, 
  Clock, 
  Plus, 
  Trash2, 
  Check, 
  X, 
  Volume2, 
  VolumeX, 
  ShieldCheck, 
  Sparkles,
  Play,
  Calendar,
  AlertCircle
} from 'lucide-react';

interface RemindersModalProps {
  isOpen: boolean;
  onClose: () => void;
  reminders: MoodReminder[];
  onUpdateReminders: (updated: MoodReminder[]) => void;
  onTriggerTestToast: () => void;
  soundEnabled: boolean;
  onToggleSound: (enabled: boolean) => void;
}

export function RemindersModal({
  isOpen,
  onClose,
  reminders,
  onUpdateReminders,
  onTriggerTestToast,
  soundEnabled,
  onToggleSound
}: RemindersModalProps) {
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>(() => {
    if ('Notification' in window) {
      return Notification.permission;
    }
    return 'denied';
  });

  // Adding reminder state
  const [isAdding, setIsAdding] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [newTime, setNewTime] = useState('16:00');
  const [newMessage, setNewMessage] = useState('Pause for a moment. How does your body feel right now?');
  const [newDays, setNewDays] = useState<DayOfWeek[]>(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);

  if (!isOpen) return null;

  const handleRequestPermission = async () => {
    const perm = await requestBrowserNotificationPermission();
    setNotificationPermission(perm);
  };

  const handleToggleReminder = (id: string) => {
    const updated = reminders.map(r => {
      if (r.id === id) {
        return { ...r, enabled: !r.enabled };
      }
      return r;
    });
    onUpdateReminders(updated);
  };

  const handleDeleteReminder = (id: string) => {
    const updated = reminders.filter(r => r.id !== id);
    onUpdateReminders(updated);
  };

  const handleTimeChange = (id: string, time: string) => {
    const updated = reminders.map(r => {
      if (r.id === id) {
        return { ...r, time };
      }
      return r;
    });
    onUpdateReminders(updated);
  };

  const handleDayToggle = (id: string, day: DayOfWeek) => {
    const updated = reminders.map(r => {
      if (r.id === id) {
        const hasDay = r.days.includes(day);
        const days = hasDay ? r.days.filter(d => d !== day) : [...r.days, day];
        return { ...r, days };
      }
      return r;
    });
    onUpdateReminders(updated);
  };

  const handleCreateReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabel.trim() || !newTime) return;

    const newReminder: MoodReminder = {
      id: `reminder-${Date.now()}`,
      label: newLabel.trim(),
      time: newTime,
      enabled: true,
      message: newMessage.trim() || 'Check in with how your emotions are feeling.',
      days: newDays.length > 0 ? newDays : ALL_DAYS
    };

    onUpdateReminders([...reminders, newReminder]);
    setNewLabel('');
    setNewTime('16:00');
    setIsAdding(false);
  };

  const toggleNewDay = (day: DayOfWeek) => {
    setNewDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-3xl border border-stone-200 max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
        aria-labelledby="reminders-modal-title"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-stone-100 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-800">
              <Bell className="w-4 h-4 text-emerald-600" />
              <span>Daily Check-in Reminders</span>
            </div>
            <h2 id="reminders-modal-title" className="font-display text-2xl font-bold text-stone-900">
              Reminder Schedule & Alerts
            </h2>
            <p className="text-xs sm:text-sm text-stone-500">
              Receive gentle prompts on your device to notice feelings, pause, and check in.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Browser Permission & Sound Bar */}
        <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-stone-900">
                Browser Toast & Alert System
              </div>
              <div className="text-[11px] text-stone-500">
                {notificationPermission === 'granted'
                  ? '✓ Browser push notifications allowed'
                  : notificationPermission === 'denied'
                  ? 'Browser push blocked. In-app toasts will pop up automatically.'
                  : 'In-app toasts active. Enable browser system alerts?'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {notificationPermission !== 'granted' && 'Notification' in window && (
              <button
                onClick={handleRequestPermission}
                className="px-3 py-1.5 rounded-xl bg-white border border-stone-200 hover:border-stone-300 text-stone-700 text-xs font-semibold cursor-pointer shadow-2xs"
              >
                Enable Push
              </button>
            )}

            <button
              onClick={() => onToggleSound(!soundEnabled)}
              title={soundEnabled ? 'Chime sound is active' : 'Chime sound is muted'}
              className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors ${
                soundEnabled
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                  : 'bg-white border-stone-200 text-stone-500'
              }`}
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              <span>{soundEnabled ? 'Chime On' : 'Muted'}</span>
            </button>
          </div>
        </div>

        {/* Test Notification Quick Button */}
        <div className="flex items-center justify-between bg-emerald-50/70 p-3.5 rounded-2xl border border-emerald-100">
          <div className="text-xs text-emerald-900">
            <strong>Preview Toast:</strong> See how the check-in alert looks on your screen.
          </div>
          <button
            onClick={onTriggerTestToast}
            className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs shrink-0"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Test Alert Now</span>
          </button>
        </div>

        {/* Reminders List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-400">
              Active Reminder Slots ({reminders.length})
            </span>
            {!isAdding && (
              <button
                onClick={() => setIsAdding(true)}
                className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Time Slot</span>
              </button>
            )}
          </div>

          {reminders.map((reminder) => (
            <div
              key={reminder.id}
              className={`p-4 rounded-2xl border transition-all ${
                reminder.enabled
                  ? 'bg-white border-emerald-200/90 shadow-2xs'
                  : 'bg-stone-50/70 border-stone-200 opacity-60'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleReminder(reminder.id)}
                      className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors cursor-pointer border ${
                        reminder.enabled
                          ? 'bg-emerald-700 text-white border-emerald-700'
                          : 'bg-white border-stone-300 text-transparent'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </button>

                    <h4 className="font-display text-sm font-bold text-stone-900">
                      {reminder.label}
                    </h4>
                  </div>

                  <p className="text-xs text-stone-500 italic pl-7">
                    "{reminder.message}"
                  </p>
                </div>

                {/* Time picker & Actions */}
                <div className="flex items-center gap-2 pl-7 sm:pl-0">
                  <div className="flex items-center gap-1.5 bg-stone-100 px-3 py-1.5 rounded-xl border border-stone-200 font-mono text-xs">
                    <Clock className="w-3.5 h-3.5 text-stone-500" />
                    <input
                      type="time"
                      value={reminder.time}
                      onChange={(e) => handleTimeChange(reminder.id, e.target.value)}
                      className="bg-transparent text-stone-900 font-bold focus:outline-none cursor-pointer"
                    />
                  </div>

                  <button
                    onClick={() => handleDeleteReminder(reminder.id)}
                    className="p-2 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Delete reminder"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Day selection bubbles */}
              <div className="mt-3 pt-3 border-t border-stone-100 flex items-center gap-1.5 pl-7 overflow-x-auto">
                {ALL_DAYS.map((day) => {
                  const isDayActive = reminder.days.includes(day);
                  return (
                    <button
                      key={day}
                      onClick={() => handleDayToggle(reminder.id, day)}
                      className={`w-7 h-6 rounded-lg text-[10px] font-bold font-mono transition-colors cursor-pointer border ${
                        isDayActive
                          ? 'bg-emerald-100 border-emerald-300 text-emerald-900'
                          : 'bg-white border-stone-200 text-stone-400 hover:text-stone-700'
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Add Reminder Form */}
        {isAdding && (
          <form 
            onSubmit={handleCreateReminder}
            className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-4 animate-in fade-in duration-150"
          >
            <div className="flex items-center justify-between border-b border-stone-200 pb-2">
              <span className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5 text-emerald-700" />
                <span>New Reminder Schedule</span>
              </span>
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="text-stone-400 hover:text-stone-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-stone-700">
                  Label
                </label>
                <input
                  type="text"
                  required
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  placeholder="e.g. Lunchtime Check-in"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-stone-700">
                  Time (24h)
                </label>
                <input
                  type="time"
                  required
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 font-mono"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-stone-700">
                Prompt Message
              </label>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="What gentle message should pop up?"
                className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-semibold text-stone-700">
                  Days of Week
                </label>
                <div className="flex items-center gap-2 text-[10px] text-emerald-800">
                  <button
                    type="button"
                    onClick={() => setNewDays(['Mon', 'Tue', 'Wed', 'Thu', 'Fri'])}
                    className="hover:underline cursor-pointer"
                  >
                    Weekdays
                  </button>
                  <span>·</span>
                  <button
                    type="button"
                    onClick={() => setNewDays([...ALL_DAYS])}
                    className="hover:underline cursor-pointer"
                  >
                    Everyday
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {ALL_DAYS.map((day) => {
                  const isActive = newDays.includes(day);
                  return (
                    <button
                      type="button"
                      key={day}
                      onClick={() => toggleNewDay(day)}
                      className={`w-8 h-7 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer border ${
                        isActive
                          ? 'bg-emerald-700 border-emerald-700 text-white'
                          : 'bg-white border-stone-200 text-stone-400 hover:text-stone-700'
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-200/50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold cursor-pointer shadow-xs"
              >
                Save Slot
              </button>
            </div>
          </form>
        )}

        {/* Footer info */}
        <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-stone-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Reminders run locally in your browser. No personal data leaves this device.</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-xl cursor-pointer"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}
