import { HabitItem } from '../types';

export const DEFAULT_HABITS: HabitItem[] = [
  {
    id: 'habit-hydration',
    title: 'Daily Hydration (6-8 Glasses)',
    category: 'hydration',
    description: 'Keep a water bottle close and sip throughout classes and activities.',
    targetLabel: '8 glasses (~2 Liters)',
    scienceBenefit: 'The teen brain is 75% water. A drop of just 1-2% in hydration impairs concentration, increases headache frequency, and elevates perceived anxiety.',
    iconName: 'Droplets',
    type: 'counter',
    targetCount: 8,
    unit: 'glasses'
  },
  {
    id: 'habit-sleep',
    title: 'Restorative Sleep (8+ Hours)',
    category: 'sleep',
    description: 'Wind down early and aim for consistent bedtime to support teenage brain growth.',
    targetLabel: '8-9 hours',
    scienceBenefit: 'Pubertal hormonal surges shift the circadian clock ~2 hours later. Getting 8+ hours preserves deep slow-wave and REM sleep, clearing cellular toxins and stabilizing mood.',
    iconName: 'Moon',
    type: 'counter',
    targetCount: 8,
    unit: 'hours'
  },
  {
    id: 'habit-meditation',
    title: 'Mindfulness or Calm Room Reset',
    category: 'mindfulness',
    description: 'Spend 5-10 minutes with box breathing, somatic grounding, or calm audio.',
    targetLabel: '5-10 minutes',
    scienceBenefit: 'Brief mindful pauses strengthen prefrontal cortex connections to the reactive amygdala, curbing fight-or-flight triggers before they escalate.',
    iconName: 'Sparkles',
    type: 'counter',
    targetCount: 10,
    unit: 'mins'
  },
  {
    id: 'habit-movement',
    title: 'Outdoor Daylight & Movement',
    category: 'movement',
    description: 'A brisk 15-20 min walk, bike ride, stretching, or dance break under natural light.',
    targetLabel: '20 minutes',
    scienceBenefit: 'Daylight exposure within 2 hours of waking triggers early serotonin and calibrates the suprachiasmatic nucleus for deeper sleep at night.',
    iconName: 'Sun',
    type: 'checkbox'
  },
  {
    id: 'habit-unplug',
    title: 'Screen Curfew Before Bed',
    category: 'unplug',
    description: 'Put devices away or charge outside the bed 30 minutes before sleep.',
    targetLabel: '30 min buffer',
    scienceBenefit: 'Blue light mimics high-noon daylight, suppressing melatonin synthesis by up to 80% and prolonging sleep latency.',
    iconName: 'BellOff',
    type: 'checkbox'
  },
  {
    id: 'habit-nourish',
    title: 'Brain Fuel & Regular Meals',
    category: 'nourishment',
    description: 'Do not skip breakfast or lunch; replenish steady energy and protein.',
    targetLabel: 'Consistent fuel',
    scienceBenefit: 'Rapid adolescent metabolic rates make blood glucose prone to sharp dips, which the nervous system interprets as adrenaline surges (false panic).',
    iconName: 'Apple',
    type: 'checkbox'
  },
  {
    id: 'habit-kindness',
    title: 'Self-Compassion Pause',
    category: 'mindfulness',
    description: 'Notice a harsh inner voice and replace it with how you would talk to a best friend.',
    targetLabel: '1 mindful moment',
    scienceBenefit: 'Self-criticism activates the mammalian threat system; self-compassionate self-talk releases oxytocin and lowers physiological stress markers.',
    iconName: 'Heart',
    type: 'checkbox'
  }
];

// Helper to format date as YYYY-MM-DD
export function formatDateKey(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// Generate past 7 days dates array
export function getPast7Days(): { date: Date; key: string; dayName: string; dayNumber: number; isToday: boolean }[] {
  const days = [];
  const todayKey = formatDateKey(new Date());

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = formatDateKey(d);
    days.push({
      date: d,
      key,
      dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
      dayNumber: d.getDate(),
      isToday: key === todayKey
    });
  }
  return days;
}
