import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { MoodLogEntry, EmotionCategory } from '../types';
import { 
  TrendingUp, 
  TrendingDown, 
  Sparkles, 
  Activity, 
  PieChart as PieIcon, 
  BarChart3, 
  Calendar, 
  Zap, 
  CheckCircle2, 
  Info,
  Layers
} from 'lucide-react';

interface MoodWeeklyTrendsProps {
  moodEntries: MoodLogEntry[];
  onAddSampleWeek?: () => void;
  onClearSampleData?: () => void;
}

const CATEGORY_CONFIG: Record<EmotionCategory, { label: string; color: string; bg: string }> = {
  anxiety: { label: 'Anxiety & Dread', color: '#f59e0b', bg: '#fef3c7' }, // amber-500
  anger: { label: 'Anger & Frustration', color: '#ef4444', bg: '#fee2e2' }, // red-500
  sadness: { label: 'Sadness & Grief', color: '#6366f1', bg: '#e0e7ff' }, // indigo-500
  overwhelm: { label: 'Sensory Overwhelm', color: '#8b5cf6', bg: '#ede9fe' }, // purple-500
  confusion: { label: 'Identity Confusion', color: '#0ea5e9', bg: '#e0f2fe' }, // sky-500
  joy: { label: 'Joy & Spark', color: '#10b981', bg: '#d1fae5' }, // emerald-500
};

export function MoodWeeklyTrends({
  moodEntries,
  onAddSampleWeek,
  onClearSampleData
}: MoodWeeklyTrendsProps) {
  const [activeChartTab, setActiveChartTab] = useState<'timeline' | 'distribution'>('timeline');

  // Compute 7 days range (Today - 6 days through Today)
  const weeklyData = useMemo(() => {
    const days: {
      dateKey: string;
      dayLabel: string;
      fullDate: string;
      avgIntensity: number | null;
      count: number;
      dominantCategory: string | null;
      categories: Record<EmotionCategory, number>;
    }[] = [];

    const now = new Date();
    // 7 days ago at 00:00:00
    for (let i = 6; i >= 0; i--) {
      const targetDate = new Date(now);
      targetDate.setDate(now.getDate() - i);
      targetDate.setHours(0, 0, 0, 0);

      const endOfDay = new Date(targetDate);
      endOfDay.setHours(23, 59, 59, 999);

      const dayLabel = targetDate.toLocaleDateString('en-US', { weekday: 'short' });
      const fullDate = targetDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

      // Match entries for this day
      const dayEntries = moodEntries.filter(
        (entry) => entry.timestamp >= targetDate.getTime() && entry.timestamp <= endOfDay.getTime()
      );

      const catCounts: Record<EmotionCategory, number> = {
        anxiety: 0,
        anger: 0,
        sadness: 0,
        overwhelm: 0,
        confusion: 0,
        joy: 0
      };

      let intensitySum = 0;
      dayEntries.forEach((entry) => {
        intensitySum += entry.intensity;
        if (catCounts[entry.category] !== undefined) {
          catCounts[entry.category] += 1;
        }
      });

      let dominantCategory: string | null = null;
      let maxCatCount = 0;
      (Object.keys(catCounts) as EmotionCategory[]).forEach((cat) => {
        if (catCounts[cat] > maxCatCount) {
          maxCatCount = catCounts[cat];
          dominantCategory = CATEGORY_CONFIG[cat].label;
        }
      });

      days.push({
        dateKey: targetDate.toISOString().slice(0, 10),
        dayLabel: i === 0 ? 'Today' : dayLabel,
        fullDate,
        avgIntensity: dayEntries.length > 0 ? Number((intensitySum / dayEntries.length).toFixed(1)) : null,
        count: dayEntries.length,
        dominantCategory,
        categories: catCounts
      });
    }

    return days;
  }, [moodEntries]);

  // Aggregate category distribution for the entire 7-day window
  const categorySummary = useMemo(() => {
    const counts: Record<EmotionCategory, number> = {
      anxiety: 0,
      anger: 0,
      sadness: 0,
      overwhelm: 0,
      confusion: 0,
      joy: 0
    };

    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const pastWeekEntries = moodEntries.filter((e) => e.timestamp >= oneWeekAgo);

    pastWeekEntries.forEach((e) => {
      if (counts[e.category] !== undefined) {
        counts[e.category] += 1;
      }
    });

    const total = pastWeekEntries.length;

    return (Object.keys(counts) as EmotionCategory[]).map((cat) => ({
      category: cat,
      label: CATEGORY_CONFIG[cat].label,
      count: counts[cat],
      color: CATEGORY_CONFIG[cat].color,
      bg: CATEGORY_CONFIG[cat].bg,
      percentage: total > 0 ? Math.round((counts[cat] / total) * 100) : 0
    })).filter((item) => item.count > 0 || total === 0);
  }, [moodEntries]);

  // General weekly metrics
  const stats = useMemo(() => {
    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const weekEntries = moodEntries.filter((e) => e.timestamp >= oneWeekAgo);
    
    const count = weekEntries.length;
    if (count === 0) {
      return {
        avgIntensity: 0,
        trend: 'No recent logs',
        topEmotion: 'None',
        totalCheckins: 0,
        topTrigger: 'None'
      };
    }

    const avgIntensity = Number(
      (weekEntries.reduce((acc, curr) => acc + curr.intensity, 0) / count).toFixed(1)
    );

    // Calculate intensity trend (first half vs second half of the week)
    const midPoint = Date.now() - 3.5 * 24 * 60 * 60 * 1000;
    const olderEntries = weekEntries.filter((e) => e.timestamp < midPoint);
    const newerEntries = weekEntries.filter((e) => e.timestamp >= midPoint);

    let trend = 'Balanced';
    if (olderEntries.length > 0 && newerEntries.length > 0) {
      const oldAvg = olderEntries.reduce((acc, curr) => acc + curr.intensity, 0) / olderEntries.length;
      const newAvg = newerEntries.reduce((acc, curr) => acc + curr.intensity, 0) / newerEntries.length;
      if (newAvg < oldAvg - 0.5) trend = 'Easing Downward (Calming)';
      else if (newAvg > oldAvg + 0.5) trend = 'Heightened Intensity';
      else trend = 'Steady / Consistent';
    }

    // Top Trigger
    const triggerMap: Record<string, number> = {};
    weekEntries.forEach((e) => {
      e.triggers.forEach((t) => {
        triggerMap[t] = (triggerMap[t] || 0) + 1;
      });
    });
    let topTrigger = 'School & Grades';
    let maxTriggerCount = 0;
    Object.entries(triggerMap).forEach(([t, cnt]) => {
      if (cnt > maxTriggerCount) {
        maxTriggerCount = cnt;
        topTrigger = t;
      }
    });

    // Top Emotion
    const emoMap: Record<string, number> = {};
    weekEntries.forEach((e) => {
      emoMap[e.emotionName] = (emoMap[e.emotionName] || 0) + 1;
    });
    let topEmotion = weekEntries[0]?.emotionName || 'None';
    let maxEmoCount = 0;
    Object.entries(emoMap).forEach(([name, cnt]) => {
      if (cnt > maxEmoCount) {
        maxEmoCount = cnt;
        topEmotion = name;
      }
    });

    return {
      avgIntensity,
      trend,
      topEmotion,
      totalCheckins: count,
      topTrigger
    };
  }, [moodEntries]);

  // Custom Recharts Tooltip for Intensity Area Chart
  const CustomIntensityTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-stone-900 text-stone-100 p-3 rounded-xl border border-stone-800 shadow-xl text-xs space-y-1">
          <p className="font-display font-bold text-white text-sm">
            {label} ({data.fullDate})
          </p>
          <div className="flex items-center gap-2 pt-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span>Avg Intensity: </span>
            <span className="font-mono font-bold text-emerald-300">
              {data.avgIntensity !== null ? `${data.avgIntensity} / 10` : 'No logs recorded'}
            </span>
          </div>
          {data.count > 0 && (
            <>
              <p className="text-stone-400 text-[11px]">
                {data.count} check-in{data.count > 1 ? 's' : ''} logged
              </p>
              {data.dominantCategory && (
                <p className="text-stone-300 text-[11px]">
                  Dominant: <span className="font-medium text-amber-300">{data.dominantCategory}</span>
                </p>
              )}
            </>
          )}
        </div>
      );
    }
    return null;
  };

  // Custom Tooltip for Category Breakdown
  const CustomCategoryTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-stone-900 text-stone-100 p-3 rounded-xl border border-stone-800 shadow-xl text-xs space-y-1">
          <div className="flex items-center gap-2">
            <span 
              className="w-2.5 h-2.5 rounded-full" 
              style={{ backgroundColor: data.color }} 
            />
            <p className="font-display font-bold text-white text-sm">
              {data.label}
            </p>
          </div>
          <p className="text-stone-300 font-mono">
            Check-ins: <span className="font-bold text-white">{data.count}</span> ({data.percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  const hasFewEntries = moodEntries.length < 3;

  return (
    <div className="space-y-8">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-800">
            <Activity className="w-4 h-4 text-emerald-600" />
            <span>Weekly Emotional Analytics</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            7-Day Mood & Emotion Trends
          </h2>
          <p className="text-xs sm:text-sm text-stone-500">
            Visualizing patterns to uncover emotional triggers, intensity rhythms, and progress.
          </p>
        </div>

        {/* Action button to load sample week data if sparse */}
        <div className="flex items-center gap-2">
          {onAddSampleWeek && (
            <button
              onClick={onAddSampleWeek}
              className="px-3 py-1.5 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Populate 7 days of realistic adolescent mood data for demonstration"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Load 7-Day Demo Pattern</span>
            </button>
          )}

          {onClearSampleData && moodEntries.length > 3 && (
            <button
              onClick={onClearSampleData}
              className="px-3 py-1.5 rounded-xl border border-stone-200 hover:border-stone-300 text-stone-500 hover:text-stone-800 text-xs font-medium transition-colors cursor-pointer"
            >
              Reset Logs
            </button>
          )}
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 block">
            7-Day Avg Intensity
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-stone-900 tabular-nums">
              {stats.avgIntensity > 0 ? stats.avgIntensity : '—'}
            </span>
            <span className="text-xs text-stone-400 font-mono">/ 10</span>
          </div>
          <p className="text-[11px] text-stone-500 truncate">
            {stats.avgIntensity <= 4 ? 'Mild / Manageable' : stats.avgIntensity <= 7 ? 'Moderate Swells' : 'High Surge'}
          </p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 block">
            Intensity Trajectory
          </span>
          <div className="flex items-center gap-2">
            {stats.trend.includes('Easing') ? (
              <TrendingDown className="w-5 h-5 text-emerald-600" />
            ) : (
              <TrendingUp className="w-5 h-5 text-amber-600" />
            )}
            <span className="text-sm font-bold text-stone-900 truncate">
              {stats.trend}
            </span>
          </div>
          <p className="text-[11px] text-stone-500">
            Compared to early week
          </p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 block">
            Most Frequent Feeling
          </span>
          <div className="text-base sm:text-lg font-bold text-stone-900 truncate">
            {stats.topEmotion}
          </div>
          <p className="text-[11px] text-stone-500">
            {stats.totalCheckins} check-in{stats.totalCheckins !== 1 ? 's' : ''} logged
          </p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 block">
            Primary Trigger
          </span>
          <div className="text-base sm:text-lg font-bold text-emerald-800 truncate">
            {stats.topTrigger}
          </div>
          <p className="text-[11px] text-stone-500">
            Highest somatic response
          </p>
        </div>
      </div>

      {/* Chart View Switcher */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 p-1 bg-stone-200/70 rounded-xl">
          <button
            onClick={() => setActiveChartTab('timeline')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeChartTab === 'timeline'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Intensity Timeline (Daily Wave)</span>
          </button>
          <button
            onClick={() => setActiveChartTab('distribution')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeChartTab === 'distribution'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <PieIcon className="w-3.5 h-3.5" />
            <span>Emotion Category Breakdown</span>
          </button>
        </div>

        <span className="text-xs text-stone-400 hidden sm:inline font-mono">
          Last 7 Days · Local Storage
        </span>
      </div>

      {/* Chart 1: Intensity Area Timeline */}
      {activeChartTab === 'timeline' && (
        <div className="p-6 sm:p-8 bg-white rounded-3xl border border-stone-200 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-display text-lg font-bold text-stone-900">
                Emotional Intensity Curve (1–10 Scale)
              </h3>
              <p className="text-xs text-stone-500">
                Tracking how heavily feelings weighed on your nervous system each day.
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono text-stone-500">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>Daily Avg Intensity</span>
              </span>
            </div>
          </div>

          <div className="w-full h-72 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="intensityGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#059669" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="dayLabel" 
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  tickLine={false}
                  axisLine={{ stroke: '#e2e8f0' }}
                />
                <YAxis 
                  domain={[0, 10]} 
                  ticks={[0, 2, 4, 6, 8, 10]}
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  tickLine={false}
                  axisLine={{ stroke: '#e2e8f0' }}
                />
                <Tooltip content={<CustomIntensityTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="avgIntensity" 
                  stroke="#059669" 
                  strokeWidth={2.5}
                  fillOpacity={1} 
                  fill="url(#intensityGradient)" 
                  connectNulls={true}
                  dot={{ r: 4, fill: '#059669', stroke: '#ffffff', strokeWidth: 2 }}
                  activeDot={{ r: 6, fill: '#047857', stroke: '#ffffff', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Daily Quick Summary Chips */}
          <div className="grid grid-cols-7 gap-2 pt-2 border-t border-stone-100">
            {weeklyData.map((d, i) => (
              <div key={i} className="text-center space-y-1">
                <span className="text-[11px] font-mono text-stone-400 block truncate">
                  {d.dayLabel}
                </span>
                <span className={`inline-block px-1.5 py-0.5 rounded text-[11px] font-mono font-bold ${
                  d.avgIntensity === null 
                    ? 'text-stone-300 bg-stone-50' 
                    : d.avgIntensity >= 7 
                      ? 'bg-rose-100 text-rose-800' 
                      : d.avgIntensity >= 5 
                        ? 'bg-amber-100 text-amber-800' 
                        : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {d.avgIntensity !== null ? `${d.avgIntensity}` : '—'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Chart 2: Category Distribution Breakdown */}
      {activeChartTab === 'distribution' && (
        <div className="p-6 sm:p-8 bg-white rounded-3xl border border-stone-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-display text-lg font-bold text-stone-900">
                Emotion Categories Distribution
              </h3>
              <p className="text-xs text-stone-500">
                Understanding which emotional states dominated your thoughts this week.
              </p>
            </div>
            <span className="text-xs font-mono text-stone-500">
              Total logs: {categorySummary.reduce((a, b) => a + b.count, 0)}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            
            {/* Bar Chart Representation */}
            <div className="md:col-span-7 h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categorySummary} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="category" 
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    tickFormatter={(cat: string) => cat.charAt(0).toUpperCase() + cat.slice(1, 4)}
                    tickLine={false}
                    axisLine={{ stroke: '#e2e8f0' }}
                  />
                  <YAxis 
                    allowDecimals={false}
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    tickLine={false}
                    axisLine={{ stroke: '#e2e8f0' }}
                  />
                  <Tooltip content={<CustomCategoryTooltip />} />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {categorySummary.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Category Breakdown Table / Percentages */}
            <div className="md:col-span-5 space-y-2.5">
              {categorySummary.map((cat) => (
                <div 
                  key={cat.category}
                  className="p-2.5 rounded-xl border border-stone-200/80 bg-stone-50/50 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span 
                      className="w-3 h-3 rounded-full shrink-0" 
                      style={{ backgroundColor: cat.color }} 
                    />
                    <span className="font-semibold text-stone-800">{cat.label}</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-stone-500">{cat.count}x</span>
                    <span className="font-bold text-stone-900 bg-white px-2 py-0.5 rounded border border-stone-200">
                      {cat.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      )}

      {/* Educational Insight Callout */}
      <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex items-start gap-3">
        <Info className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs text-emerald-950">
          <p className="font-bold">Neuroscience Takeaway on Weekly Tracking:</p>
          <p className="text-emerald-900 leading-relaxed">
            Emotional waves are cyclic, not permanent. When an emotion feels like it will last forever (a classic adolescent amygdala projection), looking at your 7-day trend reminds your prefrontal cortex that feelings peak, plateau, and naturally subside.
          </p>
        </div>
      </div>

    </div>
  );
}
