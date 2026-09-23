import { useState, useEffect } from 'react';
import { MoodLogEntry, JournalPrompt } from '../types';
import { JOURNAL_PROMPTS } from '../data/adolescenceContent';
import { MoodWeeklyTrends } from './MoodWeeklyTrends';
import { GuidedJournalSection } from './GuidedJournalSection';
import { 
  Lock, 
  Unlock, 
  KeyRound, 
  Trash2, 
  Download, 
  Sparkles, 
  Plus, 
  Check, 
  Clock, 
  ShieldCheck,
  Calendar,
  Activity,
  BookOpen,
  PenTool
} from 'lucide-react';

interface JournalEntry {
  id: string;
  timestamp: number;
  promptQuestion?: string;
  content: string;
  tags: string[];
}

interface PrivateJournalProps {
  moodEntries: MoodLogEntry[];
  onDeleteMoodEntry: (id: string) => void;
  onAddSampleWeek?: () => void;
  onClearSampleData?: () => void;
}

export function PrivateJournal({ 
  moodEntries, 
  onDeleteMoodEntry,
  onAddSampleWeek,
  onClearSampleData
}: PrivateJournalProps) {
  const [activeTab, setActiveTab] = useState<'journal' | 'guided' | 'trends'>('journal');

  // PIN lock system
  const [pinEnabled, setPinEnabled] = useState<boolean>(() => {
    return localStorage.getItem('sanctuary_pin_enabled') === 'true';
  });
  const [storedPin, setStoredPin] = useState<string>(() => {
    return localStorage.getItem('sanctuary_pin') || '';
  });
  const [isUnlocked, setIsUnlocked] = useState<boolean>(!pinEnabled);
  const [enteredPin, setEnteredPin] = useState('');
  const [pinError, setPinError] = useState(false);
  const [isSettingNewPin, setIsSettingNewPin] = useState(false);
  const [newPinInput, setNewPinInput] = useState('');

  // Written journal entries
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(() => {
    try {
      const stored = localStorage.getItem('sanctuary_journal_entries');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [activePrompt, setActivePrompt] = useState<JournalPrompt>(JOURNAL_PROMPTS[0]);
  const [newEntryText, setNewEntryText] = useState('');
  const [customTag, setCustomTag] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>(['Reflection']);

  const unlockWithPin = () => {
    if (enteredPin === storedPin) {
      setIsUnlocked(true);
      setPinError(false);
      setEnteredPin('');
    } else {
      setPinError(true);
      setEnteredPin('');
    }
  };

  const handleSavePin = () => {
    if (newPinInput.length >= 4) {
      localStorage.setItem('sanctuary_pin', newPinInput);
      localStorage.setItem('sanctuary_pin_enabled', 'true');
      setStoredPin(newPinInput);
      setPinEnabled(true);
      setIsUnlocked(true);
      setIsSettingNewPin(false);
      setNewPinInput('');
    }
  };

  const removePinLock = () => {
    localStorage.removeItem('sanctuary_pin');
    localStorage.setItem('sanctuary_pin_enabled', 'false');
    setStoredPin('');
    setPinEnabled(false);
    setIsUnlocked(true);
  };

  const handleAddJournalEntry = () => {
    if (!newEntryText.trim()) return;
    const entry: JournalEntry = {
      id: `journal-${Date.now()}`,
      timestamp: Date.now(),
      promptQuestion: activePrompt ? activePrompt.question : undefined,
      content: newEntryText.trim(),
      tags: selectedTags,
    };
    const updated = [entry, ...journalEntries];
    setJournalEntries(updated);
    try {
      localStorage.setItem('sanctuary_journal_entries', JSON.stringify(updated));
    } catch {}
    setNewEntryText('');
  };

  const deleteJournalEntry = (id: string) => {
    const updated = journalEntries.filter(e => e.id !== id);
    setJournalEntries(updated);
    try {
      localStorage.setItem('sanctuary_journal_entries', JSON.stringify(updated));
    } catch {}
  };

  const getRandomPrompt = () => {
    const randomIndex = Math.floor(Math.random() * JOURNAL_PROMPTS.length);
    setActivePrompt(JOURNAL_PROMPTS[randomIndex]);
  };

  const exportAllData = () => {
    const data = {
      exportDate: new Date().toISOString(),
      moodLogs: moodEntries,
      journalEntries: journalEntries,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sanctuary_journal_export_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // If locked, render PIN screen
  if (pinEnabled && !isUnlocked) {
    return (
      <div className="max-w-md mx-auto p-8 bg-white rounded-3xl border border-stone-200 shadow-xl text-center space-y-6">
        <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto">
          <Lock className="w-7 h-7" />
        </div>
        <div className="space-y-1">
          <h2 className="font-display text-2xl font-bold text-stone-900">
            Sanctuary Journal Locked
          </h2>
          <p className="text-xs text-stone-500">
            Enter your 4+ digit PIN to view your private logs & reflections.
          </p>
        </div>

        <div className="space-y-3">
          <input
            type="password"
            maxLength={8}
            value={enteredPin}
            onChange={(e) => setEnteredPin(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && unlockWithPin()}
            placeholder="Enter PIN"
            className="w-full text-center text-2xl tracking-widest font-mono p-3 rounded-xl border border-stone-200 focus:border-emerald-600 focus:outline-none"
            autoFocus
          />
          {pinError && (
            <p className="text-xs text-rose-600 font-medium">
              Incorrect PIN. Please try again.
            </p>
          )}
          <button
            onClick={unlockWithPin}
            className="w-full py-3 rounded-xl bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 transition-colors cursor-pointer"
          >
            Unlock Journal
          </button>
        </div>

        <div className="text-[11px] text-stone-400">
          Everything remains strictly stored on your own device.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      
      {/* Top Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-800">
            <span>Confidential Sanctuary</span>
          </div>
          <h1 className="font-display text-3xl font-bold text-stone-900 tracking-tight">
            Private Journal & Mood Logs
          </h1>
          <p className="text-xs sm:text-sm text-stone-500">
            Stored locally on your device only. Your parents, friends, and servers cannot see this.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {pinEnabled ? (
            <button
              onClick={() => setIsUnlocked(false)}
              className="px-3.5 py-2 rounded-xl border border-stone-200 bg-white text-stone-700 hover:text-stone-900 text-xs font-medium flex items-center gap-1.5 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-stone-500" />
              <span>Lock Now</span>
            </button>
          ) : (
            <button
              onClick={() => setIsSettingNewPin(true)}
              className="px-3.5 py-2 rounded-xl border border-stone-200 bg-white text-stone-700 hover:text-stone-900 text-xs font-medium flex items-center gap-1.5 cursor-pointer"
            >
              <KeyRound className="w-3.5 h-3.5 text-stone-500" />
              <span>Set PIN Lock</span>
            </button>
          )}

          <button
            onClick={exportAllData}
            title="Export your reflections as a JSON file"
            className="p-2 rounded-xl border border-stone-200 bg-white text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Set PIN Modal/Card if triggered */}
      {isSettingNewPin && (
        <div className="p-5 rounded-2xl bg-stone-100 border border-stone-200 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
              <KeyRound className="w-4 h-4 text-emerald-600" />
              <span>Create Private 4+ Digit Passcode</span>
            </h4>
            <button
              onClick={() => setIsSettingNewPin(false)}
              className="text-xs text-stone-500 hover:text-stone-800 cursor-pointer"
            >
              Cancel
            </button>
          </div>
          <div className="flex gap-2">
            <input
              type="password"
              maxLength={8}
              value={newPinInput}
              onChange={(e) => setNewPinInput(e.target.value)}
              placeholder="e.g. 1234"
              className="p-2.5 rounded-xl border border-stone-300 text-sm font-mono bg-white focus:outline-none"
            />
            <button
              onClick={handleSavePin}
              disabled={newPinInput.length < 4}
              className="px-4 py-2 bg-emerald-600 disabled:opacity-40 text-white text-xs font-semibold rounded-xl hover:bg-emerald-500 cursor-pointer"
            >
              Save PIN
            </button>
          </div>
        </div>
      )}

      {/* View Switcher: Journal Writer vs Guided Prompts vs Weekly Trends */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-stone-200/70 rounded-2xl w-fit">
        <button
          onClick={() => setActiveTab('journal')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'journal'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <BookOpen className="w-4 h-4 text-emerald-700" />
          <span>Freewrite Journal & Prompts</span>
        </button>

        <button
          onClick={() => setActiveTab('guided')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'guided'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <PenTool className="w-4 h-4 text-emerald-700" />
          <span>Guided 3-Step Studio</span>
        </button>

        <button
          onClick={() => setActiveTab('trends')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'trends'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Activity className="w-4 h-4 text-emerald-700" />
          <span>Weekly Trends (Recharts)</span>
        </button>
      </div>

      {activeTab === 'trends' && (
        <MoodWeeklyTrends
          moodEntries={moodEntries}
          onAddSampleWeek={onAddSampleWeek}
          onClearSampleData={onClearSampleData}
        />
      )}

      {activeTab === 'guided' && (
        <GuidedJournalSection
          onSaveToJournal={(entry) => {
            const newEntry = {
              id: `guided-${Date.now()}`,
              timestamp: Date.now(),
              promptQuestion: entry.promptQuestion,
              content: entry.content,
              tags: entry.tags
            };
            setJournalEntries(prev => [newEntry, ...prev]);
            setActiveTab('journal');
          }}
          onNavigateToJournal={() => setActiveTab('journal')}
        />
      )}

      {activeTab === 'journal' && (
        <>
          {/* New Reflection Composer */}
      <div className="p-6 sm:p-8 bg-white rounded-3xl border border-stone-200 shadow-xs space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg font-bold text-stone-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Today's Writing Space</span>
          </h3>

          <button
            onClick={getRandomPrompt}
            className="text-xs text-emerald-800 hover:text-emerald-950 font-medium flex items-center gap-1 cursor-pointer"
          >
            <span>Shuffle Prompt</span>
            <span>⟳</span>
          </button>
        </div>

        {/* Prompt Card */}
        {activePrompt && (
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-800 block">
              Prompt: {activePrompt.category}
            </span>
            <p className="text-xs sm:text-sm font-medium text-emerald-950">
              "{activePrompt.question}"
            </p>
          </div>
        )}

        <textarea
          value={newEntryText}
          onChange={(e) => setNewEntryText(e.target.value)}
          placeholder="Write freely without censoring yourself... What happened? How did it make you feel? What do you wish someone knew?"
          rows={5}
          className="w-full p-4 rounded-2xl border border-stone-200 text-xs sm:text-sm text-stone-900 focus:border-emerald-600 bg-stone-50/50 resize-none"
        />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-2">
            <span className="text-xs text-stone-400">Tag:</span>
            {['Reflection', 'Venting', 'Growth', 'Grateful'].map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTags([tag])}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                  selectedTags.includes(tag)
                    ? 'bg-stone-900 text-white'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          <button
            onClick={handleAddJournalEntry}
            disabled={!newEntryText.trim()}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 disabled:opacity-40 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer self-end sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Save Reflection</span>
          </button>
        </div>
      </div>

      {/* Mood Log History */}
      <div className="space-y-4">
        <h3 className="font-display text-xl font-bold text-stone-900 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-stone-600" />
          <span>Recent Emotional Check-in Logs ({moodEntries.length})</span>
        </h3>

        {moodEntries.length === 0 ? (
          <div className="p-8 rounded-2xl border border-dashed border-stone-200 text-center text-xs text-stone-400">
            No check-in logs recorded yet. Visit the "Feelings Check-in" tab to track an emotion.
          </div>
        ) : (
          <div className="space-y-3">
            {moodEntries.map((log) => (
              <div
                key={log.id}
                className="p-4 sm:p-5 rounded-2xl bg-white border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-xs text-stone-400">
                    <span className="font-mono">
                      {new Date(log.timestamp).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit'
                      })}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="capitalize text-stone-600 font-semibold">{log.category}</span>
                  </div>

                  <h4 className="font-display text-base font-bold text-stone-900">
                    {log.emotionName}
                  </h4>

                  {log.triggers.length > 0 && (
                    <div className="text-xs text-stone-500">
                      Triggers: {log.triggers.join(', ')}
                    </div>
                  )}

                  {log.notes && (
                    <p className="text-xs text-stone-700 italic bg-stone-50 p-2.5 rounded-lg border border-stone-100">
                      "{log.notes}"
                    </p>
                  )}
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
                  <div className="text-right">
                    <span className="text-xs text-stone-400 font-mono">Intensity: </span>
                    <span className="text-sm font-bold font-mono text-emerald-700 tabular-nums">
                      {log.intensity}/10
                    </span>
                  </div>
                  <button
                    onClick={() => onDeleteMoodEntry(log.id)}
                    className="p-1.5 text-stone-400 hover:text-rose-600 transition-colors cursor-pointer"
                    title="Delete log"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Journal Reflections History */}
      <div className="space-y-4">
        <h3 className="font-display text-xl font-bold text-stone-900">
          Saved Journal Entries ({journalEntries.length})
        </h3>

        {journalEntries.length === 0 ? (
          <div className="p-8 rounded-2xl border border-dashed border-stone-200 text-center text-xs text-stone-400">
            No private journal entries written yet. Use the composer above to write down your thoughts.
          </div>
        ) : (
          <div className="space-y-4">
            {journalEntries.map((entry) => (
              <div
                key={entry.id}
                className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between text-xs text-stone-400">
                  <span className="font-mono">
                    {new Date(entry.timestamp).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                  <div className="flex items-center gap-2">
                    {entry.tags.map((t) => (
                      <span key={t} className="text-[11px] font-semibold text-stone-600">
                        #{t}
                      </span>
                    ))}
                    <button
                      onClick={() => deleteJournalEntry(entry.id)}
                      className="p-1 text-stone-400 hover:text-rose-600 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {entry.promptQuestion && (
                  <p className="text-xs font-semibold text-emerald-900 bg-emerald-50/60 p-2.5 rounded-xl border border-emerald-100">
                    "{entry.promptQuestion}"
                  </p>
                )}

                <p className="text-xs sm:text-sm text-stone-800 leading-relaxed whitespace-pre-wrap">
                  {entry.content}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
      </>
      )}

      {/* Security notice */}
      <div className="p-4 rounded-2xl bg-stone-100/70 border border-stone-200 flex items-center justify-between text-xs text-stone-500">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Local Device Storage: Safe from network tracking and cookies.</span>
        </span>
        {pinEnabled && (
          <button
            onClick={removePinLock}
            className="text-stone-500 hover:text-rose-600 cursor-pointer"
          >
            Disable PIN Lock
          </button>
        )}
      </div>

    </div>
  );
}
