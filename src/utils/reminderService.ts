import { MoodReminder, DayOfWeek } from '../types';

export const DEFAULT_REMINDERS: MoodReminder[] = [
  {
    id: 'reminder-after-school',
    label: 'After-School Decompression',
    time: '15:30',
    enabled: true,
    message: 'School is wrapped up. Take a quiet breath and check in with your nervous system.',
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
  },
  {
    id: 'reminder-evening',
    label: 'Evening Reflection & Unwind',
    time: '20:30',
    enabled: true,
    message: 'Before winding down for sleep, how are you feeling inside? Give your emotions a voice.',
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  {
    id: 'reminder-morning',
    label: 'Morning Grounding Anchor',
    time: '08:00',
    enabled: false,
    message: 'Good morning! Notice how your body feels today before jumping into tasks.',
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
  }
];

export const ALL_DAYS: DayOfWeek[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// Soft chime sound using Web Audio API
export function playGentleReminderSound() {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    // Two warm harmonic sine waves
    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5 major triad

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.12);

      gain.gain.setValueAtTime(0, now + idx * 0.12);
      gain.gain.linearRampToValueAtTime(0.08, now + idx * 0.12 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.12 + 0.8);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.12);
      osc.stop(now + idx * 0.12 + 0.85);
    });
  } catch {
    // AudioContext blocked or not allowed until user interaction
  }
}

// Request browser native notification permission
export async function requestBrowserNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    return 'denied';
  }
  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch {
    return 'denied';
  }
}

// Check if browser native notification can be triggered
export function showBrowserNativeNotification(title: string, message: string, onClick?: () => void) {
  if (!('Notification' in window)) return;
  if (Notification.permission === 'granted') {
    try {
      const notification = new Notification(title, {
        body: message,
        icon: '/favicon.ico',
        tag: 'sanctuary-mood-reminder'
      });
      if (onClick) {
        notification.onclick = () => {
          window.focus();
          onClick();
          notification.close();
        };
      }
    } catch {
      // Fallback
    }
  }
}
