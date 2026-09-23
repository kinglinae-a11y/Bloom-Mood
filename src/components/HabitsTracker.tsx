import { useState, useEffect, useMemo } from 'react';
import { HabitItem, DailyHabitLog, HabitCategory } from '../types';
import { DEFAULT_HABITS, formatDateKey, getPast7Days } from '../data/defaultHabits';
import { 
  Check, 
  CheckCircle2, 
  Circle, 
  Droplets, 
  Moon, 
  Sparkles, 
  Sun, 
  BellOff, 
  Apple, 
  Heart, 
  Plus, 
  Trash2, 
  Flame, 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Info, 
  RotateCcw, 
  ShieldCheck, 
  TrendingUp, 
  Smile, 
  X,
  Clock,
  Award
} from 'lucide-react';

const CATEGORY_STYLES: Record<HabitCategory, { label: string; bg: string; text: string; border: string; iconBg: string }> = {
  hydration: {
    label: 'Hydration',
    bg: 'bg-sky-50',
    text: 'text-sky-800',
    border: 'border-sky-200',
    iconBg: 'bg-sky-100 text-sky-700'
  },
  sleep: {
    label: 'Sleep Rest',
    bg: 'bg-indigo-50',
    text: 'text-indigo-800',
    border: 'border-indigo-200',
    iconBg: 'bg-indigo-100 text-indigo-700'
  },
  mindfulness: {
    label: 'Mind & Regulation',
    bg: 'bg-emerald-50',
    text: 'text-emerald-800',
    border: 'border-emerald-200',
    iconBg: 'bg-emerald-100 text-emerald-700'
  },
  movement: {
    label: 'Body & Daylight',
    bg: 'bg-amber-50',
    text: 'text-amber-800',
    border: 'border-amber-200',
    iconBg: 'bg-amber-100 text-amber-700'
  },
  unplug: {
    label: 'Digital Wind-Down',
    bg: 'bg-purple-50',
    text: 'text-purple-800',
    border: 'border-purple-200',
    iconBg: 'bg-purple-100 text-purple-700'
  },
  nourishment: {
    label: 'Nourishment',
    bg: 'bg-rose-50',
    text: 'text-rose-800',
    border: 'border-rose-200',
    iconBg: 'bg-rose-100 text-rose-700'
  }
};

export function HabitsTracker() {
  const [selectedDateKey, setSelectedDateKey] = useState<string>(() => formatDateKey(new Date()));
  const todayKey = useMemo(() => formatDateKey(new Date()), []);

  // Habits list (custom + default)
  const [habits, setHabits] = useState<HabitItem[]>(() => {
    try {
      const stored = localStorage.getItem('sanctuary_user_habits');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {}
    return DEFAULT_HABITS;
  });

  // Daily logs mapping: { [dateKey]: { [habitId]: { completed: boolean, count?: number, notes?: string } } }
  const [habitLogs, setHabitLogs] = useState<Record<string, DailyHabitLog>>(() => {
    try {
      const stored = localStorage.getItem('sanctuary_daily_habit_logs');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {}
    // Seed default current day with sample completion so it's not totally barren
    const initialToday: DailyHabitLog = {
      'habit-hydration': { completed: false, count: 3 },
      'habit-sleep': { completed: true, count: 8.5 },
      'habit-kindness': { completed: true }
    };
    return {
      [formatDateKey(new Date())]: initialToday
    };
  });

  // Expanded science insight drawers
  const [expandedInfoId, setExpandedInfoId] = useState<string | null>(null);

  // New Habit Modal State
  const [isNewHabitModalOpen, setIsNewHabitModalOpen] = useState(false);
  const [newHabitTitle, setNewHabitTitle] = useState('');
  const [newHabitCategory, setNewHabitCategory] = useState<HabitCategory>('mindfulness');
  const [newHabitTarget, setNewHabitTarget] = useState('');
  const [newHabitDesc, setNewHabitDesc] = useState('');

  // Persist habits
  useEffect(() => {
    try {
      localStorage.setItem('sanctuary_user_habits', JSON.stringify(habits));
    } catch {}
  }, [habits]);

  // Persist logs
  useEffect(() => {
    try {
      localStorage.setItem('sanctuary_daily_habit_logs', JSON.stringify(habitLogs));
    } catch {}
  }, [habitLogs]);

  // Active day log
  const activeDayLog = useMemo(() => {
    return habitLogs[selectedDateKey] || {};
  }, [habitLogs, selectedDateKey]);

  // Toggle habit completion checkbox
  const handleToggleHabit = (habitId: string) => {
    const habit = habits.find(h => h.id === habitId);
    const current = activeDayLog[habitId];
    const isCompleted = current?.completed || false;
    const nextCompleted = !isCompleted;

    let nextCount = current?.count;
    if (habit?.type === 'counter') {
      if (nextCompleted) {
        nextCount = habit.targetCount || 1;
      } else {
        nextCount = 0;
      }
    }

    setHabitLogs(prev => ({
      ...prev,
      [selectedDateKey]: {
        ...(prev[selectedDateKey] || {}),
        [habitId]: {
          ...(prev[selectedDateKey]?.[habitId] || {}),
          completed: nextCompleted,
          count: nextCount,
          loggedAt: Date.now()
        }
      }
    }));
  };

  // Adjust counter for habits like hydration / sleep
  const handleUpdateCount = (habitId: string, newCount: number) => {
    const habit = habits.find(h => h.id === habitId);
    const count = Math.max(0, newCount);
    const isCompleted = habit?.targetCount ? count >= habit.targetCount : count > 0;

    setHabitLogs(prev => ({
      ...prev,
      [selectedDateKey]: {
        ...(prev[selectedDateKey] || {}),
        [habitId]: {
          ...(prev[selectedDateKey]?.[habitId] || {}),
          completed: isCompleted,
          count: count,
          loggedAt: Date.now()
        }
      }
    }));
  };

  // Reset current day's checkmarks
  const handleResetDay = () => {
    setHabitLogs(prev => {
      const next = { ...prev };
      delete next[selectedDateKey];
      return next;
    });
  };

  // Populate sample week for rich demonstration
  const handleLoadSampleWeek = () => {
    const pastDays = getPast7Days();
    const newLogs: Record<string, DailyHabitLog> = { ...habitLogs };

    pastDays.forEach((day, index) => {
      // Simulate realistic teen habit completion
      newLogs[day.key] = {
        'habit-hydration': { completed: index % 2 === 0, count: index % 2 === 0 ? 8 : 5 },
        'habit-sleep': { completed: index !== 3, count: index !== 3 ? 8.5 : 6 },
        'habit-meditation': { completed: index > 2, count: index > 2 ? 10 : 0 },
        'habit-movement': { completed: index % 3 !== 0 },
        'habit-unplug': { completed: index >= 4 },
        'habit-nourish': { completed: true },
        'habit-kindness': { completed: index !== 2 }
      };
    });

    setHabitLogs(newLogs);
  };

  // Add custom habit
  const handleCreateCustomHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitTitle.trim()) return;

    const newHabit: HabitItem = {
      id: `custom-habit-${Date.now()}`,
      title: newHabitTitle.trim(),
      category: newHabitCategory,
      description: newHabitDesc.trim() || 'Personal daily wellness commitment.',
      targetLabel: newHabitTarget.trim() || 'Daily check-in',
      scienceBenefit: 'Consistent small daily choices reinforce neural pathways associated with self-efficacy and agency.',
      iconName: 'Sparkles',
      type: 'checkbox',
      isCustom: true
    };

    setHabits(prev => [...prev, newHabit]);
    setNewHabitTitle('');
    setNewHabitDesc('');
    setNewHabitTarget('');
    setIsNewHabitModalOpen(false);
  };

  const handleDeleteHabit = (id: string) => {
    setHabits(prev => prev.filter(h => h.id !== id));
  };

  // Completion calculation for current day
  const totalHabits = habits.length;
  const completedCount = useMemo(() => {
    return habits.filter(h => activeDayLog[h.id]?.completed).length;
  }, [habits, activeDayLog]);

  const completionRate = totalHabits > 0 ? Math.round((completedCount / totalHabits) * 100) : 0;

  // Streak calculation (consecutive days with at least 3 habits checked)
  const streakInfo = useMemo(() => {
    const dates = Object.keys(habitLogs).sort();
    if (dates.length === 0) return 0;

    let currentStreak = 0;
    const checkDate = new Date();

    // Check backwards from today or yesterday
    for (let i = 0; i < 30; i++) {
      const d = new Date(checkDate);
      d.setDate(d.getDate() - i);
      const k = formatDateKey(d);
      const log = habitLogs[k];
      const count = log ? Object.values(log).filter(item => item.completed).length : 0;

      if (count >= 2) {
        currentStreak++;
      } else if (i === 0) {
        // If today is not completed yet, check if yesterday had a streak
        continue;
      } else {
        break;
      }
    }
    return currentStreak;
  }, [habitLogs]);

  // Past 7 days list for week calendar strip
  const pastDays = useMemo(() => getPast7Days(), []);

  // Format date display
  const formattedSelectedDate = useMemo(() => {
    const [y, m, d] = selectedDateKey.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    if (selectedDateKey === todayKey) return `Today, ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  }, [selectedDateKey, todayKey]);

  // Icon selector helper
  const renderHabitIcon = (iconName: string, category: HabitCategory) => {
    const style = CATEGORY_STYLES[category];
    const className = "w-5 h-5";
    switch (iconName) {
      case 'Droplets': return <Droplets className={className} />;
      case 'Moon': return <Moon className={className} />;
      case 'Sparkles': return <Sparkles className={className} />;
      case 'Sun': return <Sun className={className} />;
      case 'BellOff': return <BellOff className={className} />;
      case 'Apple': return <Apple className={className} />;
      case 'Heart': return <Heart className={className} />;
      default: return <Sparkles className={className} />;
    }
  };

  return (
    <div className="space-y-10">
      
      {/* Editorial Header */}
      <div className="border-b border-stone-200 pb-8 space-y-4">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-800">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Neurobiology-Grounded Self-Care</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2 max-w-3xl">
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
              Daily Wellness Habits
            </h1>
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
              Track simple, vital daily rhythms—hydration, sleep hours, mindfulness, movement, and screen boundaries. Small, gentle micro-habits anchor the adolescent nervous system without perfectionism.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={handleLoadSampleWeek}
              className="px-3.5 py-2 rounded-xl bg-white border border-stone-200 hover:border-stone-300 text-stone-700 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
              title="Populate past 7 days with realistic habit checkmarks"
            >
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
              <span>Sample Week</span>
            </button>

            <button
              onClick={() => setIsNewHabitModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add Habit</span>
            </button>
          </div>
        </div>
      </div>

      {/* Date Strip & Quick Navigation */}
      <div className="bg-white rounded-3xl border border-stone-200 p-4 sm:p-6 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-600" />
            <span className="font-display font-bold text-stone-900 text-base">
              {formattedSelectedDate}
            </span>
            {selectedDateKey === todayKey && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider">
                Current Day
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedDateKey(todayKey)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                selectedDateKey === todayKey
                  ? 'bg-stone-900 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              Jump to Today
            </button>
            <button
              onClick={handleResetDay}
              className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
              title="Reset checks for selected day"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 7-Day Interactive Thumb Strip */}
        <div className="grid grid-cols-7 gap-1.5 sm:gap-3">
          {pastDays.map(day => {
            const isSelected = day.key === selectedDateKey;
            const dayLog = habitLogs[day.key] || {};
            const done = habits.filter(h => dayLog[h.id]?.completed).length;
            const isAllDone = totalHabits > 0 && done === totalHabits;
            const hasActivity = done > 0;

            return (
              <button
                key={day.key}
                onClick={() => setSelectedDateKey(day.key)}
                className={`py-3 px-1 sm:px-3 rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-emerald-800 text-white border-emerald-800 shadow-sm'
                    : 'bg-stone-50/80 hover:bg-stone-100 text-stone-700 border-stone-200/80'
                }`}
              >
                <span className={`text-[11px] font-medium uppercase tracking-wider ${
                  isSelected ? 'text-emerald-200' : 'text-stone-400'
                }`}>
                  {day.dayName}
                </span>
                <span className={`text-sm sm:text-base font-bold my-0.5 font-mono ${
                  isSelected ? 'text-white' : 'text-stone-900'
                }`}>
                  {day.dayNumber}
                </span>

                {/* Micro completion dots / badge */}
                <div className="mt-1 flex items-center gap-0.5">
                  {hasActivity ? (
                    <span className={`text-[10px] font-bold font-mono px-1.5 py-0.2 rounded-md ${
                      isSelected
                        ? 'bg-emerald-950 text-emerald-200'
                        : isAllDone
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-stone-200 text-stone-700'
                    }`}>
                      {done}/{totalHabits}
                    </span>
                  ) : (
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      isSelected ? 'bg-emerald-400/50' : 'bg-stone-300'
                    }`} />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Daily Progress & Neurobiology Status Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Progress Metric */}
        <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-2xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-400">
              Daily Completion
            </span>
            <Award className="w-4 h-4 text-emerald-600" />
          </div>

          <div className="space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="font-display text-3xl font-bold text-stone-900 font-mono">
                {completedCount} <span className="text-base text-stone-400 font-sans font-normal">of {totalHabits}</span>
              </span>
              <span className="text-base font-bold text-emerald-700 font-mono">
                {completionRate}%
              </span>
            </div>

            {/* Visual Progress Bar */}
            <div className="w-full h-3 bg-stone-100 rounded-full overflow-hidden p-0.5 border border-stone-200/50">
              <div
                className="h-full bg-linear-to-r from-emerald-600 to-teal-500 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${completionRate}%` }}
              />
            </div>
          </div>

          <p className="text-xs text-stone-500 leading-relaxed">
            {completionRate === 100
              ? '🎉 All wellness anchors complete! Your nervous system is deeply replenished.'
              : completionRate >= 50
              ? '✨ Fantastic balance. You have fortified your core emotional stability.'
              : '🌱 Every single checkmark grounds you. There is zero shame in doing just one.'}
          </p>
        </div>

        {/* Consistency Streak */}
        <div className="p-6 rounded-3xl bg-linear-to-br from-amber-50/80 via-orange-50/40 to-white border border-amber-200/80 shadow-2xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-800">
              Habit Rhythm
            </span>
            <Flame className="w-5 h-5 text-amber-500" />
          </div>

          <div>
            <div className="font-display text-3xl font-bold text-amber-950 font-mono flex items-center gap-2">
              <span>{streakInfo} Days</span>
              <span className="text-xs font-sans px-2 py-0.5 rounded-full bg-amber-200/70 text-amber-900 font-semibold">
                Active Streak
              </span>
            </div>
            <p className="text-xs text-amber-800/90 mt-1 leading-relaxed">
              Consistently checking at least 2 habits preserves positive brain plasticity without burnout.
            </p>
          </div>

          <div className="text-[11px] text-amber-900/80 font-medium flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>Habits save automatically to your private local cache.</span>
          </div>
        </div>

        {/* Neurobiology Micro-Tip */}
        <div className="p-6 rounded-3xl bg-linear-to-br from-stone-900 to-stone-800 text-white shadow-2xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between text-emerald-400">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Adolescent Brain Fact
            </span>
            <Sparkles className="w-4 h-4" />
          </div>

          <p className="text-xs sm:text-sm text-stone-200 font-serif italic leading-relaxed">
            "Your prefrontal cortex is remodeling billions of synaptic connections. Regular water, 8+ hours of sleep, and calm breathing directly prevent emotional reactivity and brain fog."
          </p>

          <div className="text-[11px] text-stone-400 font-mono">
            — UCLA & Stanford Adolescent Medicine
          </div>
        </div>

      </div>

      {/* Habits List Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div className="space-y-0.5">
            <h2 className="font-display text-xl font-bold text-stone-900">
              Checklist for {formattedSelectedDate}
            </h2>
            <p className="text-xs text-stone-500">
              Tap the checkbox to check off. Counters let you log exact glasses or hours.
            </p>
          </div>

          <span className="text-xs font-mono font-medium text-stone-400">
            {completedCount}/{totalHabits} Completed
          </span>
        </div>

        {/* Habit Cards */}
        <div className="space-y-3.5">
          {habits.map((habit) => {
            const record = activeDayLog[habit.id];
            const isCompleted = record?.completed || false;
            const currentCount = record?.count ?? 0;
            const categoryStyle = CATEGORY_STYLES[habit.category] || CATEGORY_STYLES.mindfulness;
            const isInfoOpen = expandedInfoId === habit.id;

            return (
              <div
                key={habit.id}
                className={`p-5 sm:p-6 rounded-3xl border transition-all duration-200 ${
                  isCompleted
                    ? 'bg-white border-emerald-300 shadow-xs ring-1 ring-emerald-500/10'
                    : 'bg-white border-stone-200/90 shadow-2xs hover:border-stone-300'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  
                  {/* Left: Interactive Checkbox & Details */}
                  <div className="flex items-start gap-4 flex-1">
                    
                    {/* Large Satisfying Checkbox Button */}
                    <button
                      onClick={() => handleToggleHabit(habit.id)}
                      aria-label={`Toggle ${habit.title}`}
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center transition-all cursor-pointer shrink-0 mt-0.5 border ${
                        isCompleted
                          ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs scale-105'
                          : 'bg-stone-50 border-stone-300 hover:border-emerald-600 text-transparent hover:text-stone-300'
                      }`}
                    >
                      <Check className={`w-4 h-4 sm:w-5 sm:h-5 stroke-[3] transition-transform ${isCompleted ? 'scale-100' : 'scale-75'}`} />
                    </button>

                    {/* Content */}
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        
                        {/* Category Badge with Icon */}
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[11px] font-bold uppercase tracking-wider ${categoryStyle.bg} ${categoryStyle.text} border ${categoryStyle.border}`}>
                          {renderHabitIcon(habit.iconName, habit.category)}
                          <span>{categoryStyle.label}</span>
                        </span>

                        <span className="text-[11px] font-semibold text-stone-500 bg-stone-100 px-2 py-0.5 rounded-md font-mono">
                          Target: {habit.targetLabel}
                        </span>

                        {isCompleted && (
                          <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1 font-mono">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Done</span>
                          </span>
                        )}
                      </div>

                      <h3 className={`font-display text-base sm:text-lg font-bold transition-colors ${
                        isCompleted ? 'text-stone-800 line-through decoration-emerald-600/40' : 'text-stone-900'
                      }`}>
                        {habit.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                        {habit.description}
                      </p>

                      {/* Sub-counter controls for Hydration, Sleep, Meditation */}
                      {habit.type === 'counter' && (
                        <div className="pt-2 flex flex-wrap items-center gap-3">
                          
                          {/* If Hydration: 8 Glass Bubbles */}
                          {habit.id === 'habit-hydration' ? (
                            <div className="space-y-1.5">
                              <div className="flex items-center gap-1.5 text-xs text-sky-900 font-semibold font-mono">
                                <Droplets className="w-3.5 h-3.5 text-sky-600" />
                                <span>{currentCount} / {habit.targetCount || 8} Glasses Logged</span>
                              </div>
                              <div className="flex items-center gap-1 sm:gap-1.5">
                                {Array.from({ length: habit.targetCount || 8 }).map((_, idx) => {
                                  const glassNum = idx + 1;
                                  const isFilled = currentCount >= glassNum;
                                  return (
                                    <button
                                      key={glassNum}
                                      onClick={() => handleUpdateCount(habit.id, isFilled && currentCount === glassNum ? glassNum - 1 : glassNum)}
                                      title={`Log ${glassNum} glasses`}
                                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center text-xs font-bold transition-all cursor-pointer border ${
                                        isFilled
                                          ? 'bg-sky-500 text-white border-sky-600 shadow-2xs scale-105'
                                          : 'bg-sky-50/80 text-sky-700 border-sky-200 hover:bg-sky-100'
                                      }`}
                                    >
                                      💧
                                    </button>
                                  );
                                })}
                                <button
                                  onClick={() => handleUpdateCount(habit.id, currentCount + 1)}
                                  className="px-2 py-1 text-xs font-semibold rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 cursor-pointer"
                                >
                                  +1
                                </button>
                              </div>
                            </div>
                          ) : habit.id === 'habit-sleep' ? (
                            /* Sleep Quick Stepper */
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-indigo-900 font-semibold font-mono flex items-center gap-1">
                                <Moon className="w-3.5 h-3.5 text-indigo-600" />
                                <span>{currentCount || 0} Hours Slept:</span>
                              </span>
                              <div className="flex items-center gap-1">
                                {[6, 7, 8, 9, 10].map(h => (
                                  <button
                                    key={h}
                                    onClick={() => handleUpdateCount(habit.id, h)}
                                    className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer border ${
                                      currentCount === h
                                        ? 'bg-indigo-700 text-white border-indigo-700'
                                        : 'bg-indigo-50/70 text-indigo-800 border-indigo-200 hover:bg-indigo-100'
                                    }`}
                                  >
                                    {h}h
                                  </button>
                                ))}
                              </div>
                            </div>
                          ) : habit.id === 'habit-meditation' ? (
                            /* Meditation Quick Minutes */
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-emerald-900 font-semibold font-mono flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5 text-emerald-600" />
                                <span>{currentCount || 0} Mins Done:</span>
                              </span>
                              <div className="flex items-center gap-1">
                                {[5, 10, 15, 20].map(m => (
                                  <button
                                    key={m}
                                    onClick={() => handleUpdateCount(habit.id, m)}
                                    className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer border ${
                                      currentCount === m
                                        ? 'bg-emerald-700 text-white border-emerald-700'
                                        : 'bg-emerald-50/70 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                                    }`}
                                  >
                                    {m}m
                                  </button>
                                ))}
                              </div>
                            </div>
                          ) : null}

                        </div>
                      )}

                    </div>
                  </div>

                  {/* Right Action Icons: Science Info Drawer Toggle & Custom Delete */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => setExpandedInfoId(isInfoOpen ? null : habit.id)}
                      className={`p-2 rounded-xl text-xs transition-colors cursor-pointer flex items-center gap-1 ${
                        isInfoOpen
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'text-stone-400 hover:text-stone-700 hover:bg-stone-100'
                      }`}
                      title="Why this habit matters for adolescent neurobiology"
                    >
                      <Info className="w-4 h-4" />
                    </button>

                    {habit.isCustom && (
                      <button
                        onClick={() => handleDeleteHabit(habit.id)}
                        className="p-2 rounded-xl text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Delete custom habit"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                </div>

                {/* Expandable Science Benefit Drawer */}
                {isInfoOpen && (
                  <div className="mt-4 pt-4 border-t border-stone-100 bg-stone-50/90 -mx-5 -mb-5 sm:-mx-6 sm:-mb-6 p-4 sm:p-5 rounded-b-3xl space-y-1.5 animate-in fade-in duration-150">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Developmental Neurobiology Impact</span>
                    </div>
                    <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-serif">
                      {habit.scienceBenefit}
                    </p>
                  </div>
                )}

              </div>
            );
          })}
        </div>
      </div>

      {/* 7-Day Habit Completion Matrix */}
      <section className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-4">
          <div className="space-y-1">
            <h3 className="font-display text-xl font-bold text-stone-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              <span>Weekly Consistency Matrix</span>
            </h3>
            <p className="text-xs text-stone-500">
              A 7-day snapshot of your daily anchors. Click any circle to toggle checkmarks directly from the grid.
            </p>
          </div>
          <div className="text-xs font-mono text-stone-400">
            Past 7 Days
          </div>
        </div>

        {/* Responsive Table Grid */}
        <div className="overflow-x-auto pb-2">
          <table className="w-full text-left border-collapse min-w-[580px]">
            <thead>
              <tr className="border-b border-stone-100 text-[11px] font-bold uppercase tracking-wider text-stone-400">
                <th className="py-2.5 pr-4">Habit Name</th>
                {pastDays.map(day => (
                  <th key={day.key} className="py-2.5 px-2 text-center">
                    <span className={day.isToday ? 'text-emerald-700 font-bold' : ''}>
                      {day.dayName} {day.dayNumber}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-xs">
              {habits.map(habit => (
                <tr key={habit.id} className="hover:bg-stone-50/60 transition-colors">
                  <td className="py-3 pr-4">
                    <div className="font-semibold text-stone-900 flex items-center gap-2">
                      <span className="text-base">{habit.category === 'hydration' ? '💧' : habit.category === 'sleep' ? '🌙' : habit.category === 'mindfulness' ? '✨' : habit.category === 'movement' ? '☀️' : '🌱'}</span>
                      <span className="truncate max-w-[200px]">{habit.title}</span>
                    </div>
                  </td>
                  {pastDays.map(day => {
                    const dayLog = habitLogs[day.key] || {};
                    const isDone = dayLog[habit.id]?.completed || false;
                    return (
                      <td key={day.key} className="py-3 px-2 text-center">
                        <button
                          onClick={() => {
                            // Toggle habit for that specific day
                            setHabitLogs(prev => {
                              const existingDay = prev[day.key] || {};
                              const currentEntry = existingDay[habit.id];
                              const nextDone = !currentEntry?.completed;
                              return {
                                ...prev,
                                [day.key]: {
                                  ...existingDay,
                                  [habit.id]: {
                                    ...(currentEntry || {}),
                                    completed: nextDone,
                                    count: nextDone ? (habit.targetCount || 1) : 0,
                                    loggedAt: Date.now()
                                  }
                                }
                              };
                            });
                          }}
                          className={`w-6 h-6 rounded-lg mx-auto flex items-center justify-center transition-all cursor-pointer ${
                            isDone
                              ? 'bg-emerald-600 text-white shadow-2xs scale-105'
                              : 'bg-stone-100 hover:bg-stone-200 text-stone-300'
                          }`}
                          title={`Toggle ${habit.title} for ${day.dayName}`}
                        >
                          {isDone ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <Circle className="w-2.5 h-2.5 fill-stone-200" />}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Add Custom Habit Modal */}
      {isNewHabitModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div 
            className="bg-white rounded-3xl border border-stone-200 max-w-md w-full shadow-2xl p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-150"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <div className="space-y-0.5">
                <h3 className="font-display text-xl font-bold text-stone-900">
                  Add Custom Habit
                </h3>
                <p className="text-xs text-stone-500">
                  Create a personal wellness rhythm that fits your routine.
                </p>
              </div>
              <button
                onClick={() => setIsNewHabitModalOpen(false)}
                className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomHabit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-700">
                  Habit Title
                </label>
                <input
                  type="text"
                  required
                  value={newHabitTitle}
                  onChange={(e) => setNewHabitTitle(e.target.value)}
                  placeholder="e.g. Take daily multivitamin, 10m sketch break..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-700">
                  Category
                </label>
                <select
                  value={newHabitCategory}
                  onChange={(e) => setNewHabitCategory(e.target.value as HabitCategory)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 bg-white"
                >
                  <option value="mindfulness">Mind & Emotional Regulation</option>
                  <option value="hydration">Hydration & Fuel</option>
                  <option value="sleep">Sleep & Rest</option>
                  <option value="movement">Movement & Daylight</option>
                  <option value="unplug">Digital Wind-Down</option>
                  <option value="nourishment">Nourishment</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-700">
                  Target Label
                </label>
                <input
                  type="text"
                  value={newHabitTarget}
                  onChange={(e) => setNewHabitTarget(e.target.value)}
                  placeholder="e.g. Once daily, 15 minutes, Morning"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-700">
                  Brief Note or Why it Matters
                </label>
                <input
                  type="text"
                  value={newHabitDesc}
                  onChange={(e) => setNewHabitDesc(e.target.value)}
                  placeholder="e.g. Keeps my joints feeling good after basketball..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsNewHabitModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold cursor-pointer shadow-xs"
                >
                  Save Habit
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
