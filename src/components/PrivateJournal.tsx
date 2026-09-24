import { useState, useEffect } from 'react';
import { MoodLogEntry, JournalPrompt } from '../types';
import { JOURNAL_PROMPTS } from '../data/adolescenceContent';
import { MoodWeeklyTrends } from './MoodWeeklyTrends';
import { GuidedJournalSection } from './GuidedJournalSection';
import { AudioRecorderModal } from './AudioRecorderModal';
import { useAuth } from '../context/AuthContext';
import { 
  syncJournalEntryToFirestore, 
  removeJournalEntryFromFirestore,
  subscribeUserJournalEntries,
  subscribeUserVoiceNotes,
  removeVoiceNoteFromFirestore,
  FirestoreVoiceNote
} from '../utils/firestoreService';
import { 
  Lock, 
  KeyRound, 
  Trash2, 
  Download, 
  Sparkles, 
  Plus, 
  Calendar,
  Activity,
  PenTool,
  Mic,
  Cloud,
  CheckCircle2,
  FileText,
  Volume2
} from 'lucide-react';

interface JournalEntry {
  id: string;
  timestamp: number;
  promptQuestion?: string;
  content: string;
  tags: string[];
  isAudioTranscribed?: boolean;
  audioDurationSeconds?: number;
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
  const { user, signIn } = useAuth();
  const [activeTab, setActiveTab] = useState<'journal' | 'guided' | 'trends' | 'voicenotes'>('journal');
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);

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

  // Written journal entries (starts with local storage)
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(() => {
    try {
      const stored = localStorage.getItem('sanctuary_journal_entries');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Voice notes synced from firestore or local
  const [voiceNotes, setVoiceNotes] = useState<FirestoreVoiceNote[]>(() => {
    try {
      const stored = localStorage.getItem('sanctuary_local_voice_notes');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [activePrompt, setActivePrompt] = useState<JournalPrompt>(JOURNAL_PROMPTS[0]);
  const [newEntryText, setNewEntryText] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>(['Reflection']);
  const [wasTranscribed, setWasTranscribed] = useState(false);

  // When user is authenticated, subscribe to Firestore journal entries & voice notes
  useEffect(() => {
    if (!user) return;

    const unsubJournal = subscribeUserJournalEntries(user.uid, (cloudEntries) => {
      if (cloudEntries && cloudEntries.length > 0) {
        setJournalEntries(prev => {
          // Merge avoiding duplicates
          const cloudIds = new Set(cloudEntries.map(e => e.id));
          const localOnly = prev.filter(p => !cloudIds.has(p.id));
          return [...cloudEntries.map(ce => ({
            id: ce.id,
            timestamp: ce.timestamp,
            promptQuestion: ce.promptQuestion,
            content: ce.content,
            tags: ce.tags || [],
            isAudioTranscribed: ce.isAudioTranscribed,
            audioDurationSeconds: ce.audioDurationSeconds
          })), ...localOnly];
        });
      }
    });

    const unsubVoice = subscribeUserVoiceNotes(user.uid, (cloudVoiceNotes) => {
      if (cloudVoiceNotes) {
        setVoiceNotes(cloudVoiceNotes);
      }
    });

    return () => {
      unsubJournal();
      unsubVoice();
    };
  }, [user]);

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

  const handleAddJournalEntry = async () => {
    if (!newEntryText.trim()) return;
    const entry: JournalEntry = {
      id: `journal-${Date.now()}`,
      timestamp: Date.now(),
      promptQuestion: activePrompt ? activePrompt.question : undefined,
      content: newEntryText.trim(),
      tags: selectedTags,
      isAudioTranscribed: wasTranscribed,
    };

    const updated = [entry, ...journalEntries];
    setJournalEntries(updated);

    try {
      localStorage.setItem('sanctuary_journal_entries', JSON.stringify(updated));
    } catch {}

    // If logged in, sync directly to Firestore
    if (user) {
      await syncJournalEntryToFirestore(user.uid, {
        id: entry.id,
        userId: user.uid,
        timestamp: entry.timestamp,
        promptQuestion: entry.promptQuestion,
        content: entry.content,
        tags: entry.tags,
        isAudioTranscribed: entry.isAudioTranscribed,
        createdAt: new Date(entry.timestamp).toISOString()
      }).catch(err => console.error('Error syncing journal entry to Firestore:', err));
    }

    setNewEntryText('');
    setWasTranscribed(false);
  };

  const deleteJournalEntry = async (id: string) => {
    const updated = journalEntries.filter(e => e.id !== id);
    setJournalEntries(updated);
    try {
      localStorage.setItem('sanctuary_journal_entries', JSON.stringify(updated));
    } catch {}

    if (user) {
      await removeJournalEntryFromFirestore(user.uid, id).catch(err => {
        console.error('Error removing from Firestore:', err);
      });
    }
  };

  const deleteVoiceNote = async (id: string) => {
    const updated = voiceNotes.filter(v => v.id !== id);
    setVoiceNotes(updated);
    try {
      localStorage.setItem('sanctuary_local_voice_notes', JSON.stringify(updated));
    } catch {}

    if (user) {
      await removeVoiceNoteFromFirestore(user.uid, id).catch(err => {
        console.error('Error deleting voice note:', err);
      });
    }
  };

  const handleTranscriptReceived = (transcriptText: string) => {
    setNewEntryText(prev => {
      const separator = prev.trim() ? '\n\n' : '';
      return `${prev}${separator}${transcriptText}`;
    });
    setWasTranscribed(true);
  };

  const getRandomPrompt = () => {
    const randomIndex = Math.floor(Math.random() * JOURNAL_PROMPTS.length);
    setActivePrompt(JOURNAL_PROMPTS[randomIndex]);
  };

  const exportAllData = () => {
    const data = {
      exportDate: new Date().toISOString(),
      user: user?.email || 'Anonymous',
      moodLogs: moodEntries,
      journalEntries: journalEntries,
      voiceNotes: voiceNotes
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
          Everything remains safe and protected on your device and Firebase account.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      
      {/* Top Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-800">
            <span>Confidential Sanctuary</span>
            {user && (
              <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                <Cloud className="w-3 h-3" /> Firebase Synced
              </span>
            )}
          </div>
          <h1 className="font-display text-3xl font-bold text-stone-900 tracking-tight">
            Private Journal & Voice Diary
          </h1>
          <p className="text-xs sm:text-sm text-stone-500">
            Write or speak your feelings freely with audio transcription powered by Gemini 3.5 Transcribe.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {pinEnabled ? (
            <button
              onClick={() => setIsUnlocked(false)}
              className="px-3 py-1.5 rounded-xl border border-stone-200 bg-white text-stone-700 hover:text-stone-900 text-xs font-medium flex items-center gap-1.5 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-stone-500" />
              <span>Lock Now</span>
            </button>
          ) : (
            <button
              onClick={() => setIsSettingNewPin(true)}
              className="px-3 py-1.5 rounded-xl border border-stone-200 bg-white text-stone-700 hover:text-stone-900 text-xs font-medium flex items-center gap-1.5 cursor-pointer"
            >
              <KeyRound className="w-3.5 h-3.5 text-stone-500" />
              <span>Set PIN</span>
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

      {/* Cloud Sync Status Banner if not signed in */}
      {!user && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-stone-50 border border-emerald-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-stone-900">
                Sync with Firebase Database & Authentication
              </p>
              <p className="text-xs text-stone-600">
                Sign in with Google to automatically back up your journal, voice notes, and mood entries to your private cloud storage.
              </p>
            </div>
          </div>
          <button
            onClick={() => signIn()}
            className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold shrink-0 transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
          >
            <span>Sign In with Google</span>
          </button>
        </div>
      )}

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
              className="text-xs text-stone-400 hover:text-stone-700"
            >
              Cancel
            </button>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="password"
              maxLength={8}
              value={newPinInput}
              onChange={(e) => setNewPinInput(e.target.value)}
              placeholder="e.g. 1234"
              className="p-2.5 rounded-xl border border-stone-200 bg-white font-mono text-sm w-44"
            />
            <button
              onClick={handleSavePin}
              disabled={newPinInput.length < 4}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 disabled:opacity-40 text-white text-xs font-semibold cursor-pointer"
            >
              Save Passcode
            </button>
          </div>
        </div>
      )}

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('journal')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'journal'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Write & Dictate</span>
        </button>

        <button
          onClick={() => setActiveTab('voicenotes')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'voicenotes'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Mic className="w-4 h-4 text-emerald-400" />
          <span>Transcribed Voice Memos ({voiceNotes.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('guided')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'guided'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <PenTool className="w-4 h-4 text-emerald-400" />
          <span>Guided Studio</span>
        </button>

        <button
          onClick={() => setActiveTab('trends')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'trends'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Activity className="w-4 h-4 text-emerald-400" />
          <span>Weekly Trends</span>
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
            const newEntry: JournalEntry = {
              id: `guided-${Date.now()}`,
              timestamp: Date.now(),
              promptQuestion: entry.promptQuestion,
              content: entry.content,
              tags: entry.tags
            };
            setJournalEntries(prev => [newEntry, ...prev]);
            if (user) {
              syncJournalEntryToFirestore(user.uid, {
                ...newEntry,
                userId: user.uid,
                createdAt: new Date().toISOString()
              }).catch(console.error);
            }
            setActiveTab('journal');
          }}
          onNavigateToJournal={() => setActiveTab('journal')}
        />
      )}

      {activeTab === 'voicenotes' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between p-5 rounded-2xl bg-emerald-50/80 border border-emerald-200">
            <div>
              <h3 className="text-base font-bold text-emerald-950 flex items-center gap-2">
                <Mic className="w-5 h-5 text-emerald-700" />
                <span>Microphone Audio Transcriptions</span>
              </h3>
              <p className="text-xs text-emerald-800 mt-1">
                Audio voice recordings transcribed into verbatim text using <span className="font-semibold font-mono">gemini-3.5-transcribe</span>.
              </p>
            </div>
            <button
              onClick={() => setIsVoiceModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <Mic className="w-4 h-4" />
              <span>Record New Voice Note</span>
            </button>
          </div>

          {voiceNotes.length === 0 ? (
            <div className="p-12 rounded-3xl border border-dashed border-stone-200 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <Mic className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-stone-800 text-sm">No Voice Notes Yet</h4>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Speak into your microphone anytime. Your audio will be transcribed into text and saved here.
              </p>
              <button
                onClick={() => setIsVoiceModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium cursor-pointer"
              >
                Record First Voice Note
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {voiceNotes.map((note) => (
                <div 
                  key={note.id}
                  className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-3 relative group"
                >
                  <div className="flex items-center justify-between text-xs text-stone-400">
                    <span className="font-mono">
                      {new Date(note.timestamp).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit'
                      })}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {note.durationSeconds ? `${note.durationSeconds}s` : 'Audio'}
                      </span>
                      <button
                        onClick={() => deleteVoiceNote(note.id)}
                        className="p-1 text-stone-400 hover:text-rose-600 transition-colors cursor-pointer"
                        title="Delete voice note"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h4 className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
                    <Volume2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{note.title || 'Voice Note'}</span>
                  </h4>

                  <p className="text-xs sm:text-sm text-stone-700 leading-relaxed whitespace-pre-wrap bg-stone-50 p-3 rounded-xl border border-stone-100">
                    {note.transcript}
                  </p>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-stone-400 font-mono">
                      Transcribed by gemini-3.5-transcribe
                    </span>
                    <button
                      onClick={() => {
                        handleTranscriptReceived(note.transcript);
                        setActiveTab('journal');
                      }}
                      className="text-xs text-emerald-700 hover:text-emerald-900 font-medium cursor-pointer"
                    >
                      Copy to Journal →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'journal' && (
        <>
          {/* Reflection Composer */}
          <div className="p-6 sm:p-8 bg-white rounded-3xl border border-stone-200 shadow-xs space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="font-display text-lg font-bold text-stone-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Today's Writing & Voice Space</span>
              </h3>

              <div className="flex items-center gap-2">
                {/* Voice Dictation Button */}
                <button
                  onClick={() => setIsVoiceModalOpen(true)}
                  className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
                  title="Speak into your microphone to transcribe directly into this journal"
                >
                  <Mic className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Dictate with Mic (Gemini 3.5)</span>
                </button>

                <button
                  onClick={getRandomPrompt}
                  className="text-xs text-emerald-800 hover:text-emerald-950 font-medium flex items-center gap-1 cursor-pointer"
                >
                  <span>Shuffle Prompt</span>
                  <span>⟳</span>
                </button>
              </div>
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

            <div className="relative">
              <textarea
                value={newEntryText}
                onChange={(e) => setNewEntryText(e.target.value)}
                placeholder="Write or click 'Dictate with Mic' above to speak freely... What happened? How did it make you feel? What do you wish someone knew?"
                rows={5}
                className="w-full p-4 rounded-2xl border border-stone-200 text-xs sm:text-sm text-stone-900 focus:border-emerald-600 bg-stone-50/50 resize-none"
              />
              {wasTranscribed && (
                <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200 text-[10px] font-mono flex items-center gap-1">
                  <Mic className="w-3 h-3" /> Transcribed Audio
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
              <div className="flex items-center gap-2">
                <span className="text-xs text-stone-400">Tag:</span>
                {['Reflection', 'Voice Note', 'Venting', 'Growth', 'Grateful'].map((tag) => (
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
                No private journal entries written yet. Use the composer above to write down or voice-dictate your thoughts.
              </div>
            ) : (
              <div className="space-y-4">
                {journalEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-3"
                  >
                    <div className="flex items-center justify-between text-xs text-stone-400">
                      <div className="flex items-center gap-2">
                        <span className="font-mono">
                          {new Date(entry.timestamp).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                        {entry.isAudioTranscribed && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                            <Mic className="w-3 h-3 text-emerald-600" /> Transcribed Speech
                          </span>
                        )}
                      </div>
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

      {/* Audio Recorder Modal */}
      <AudioRecorderModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        onTranscriptComplete={handleTranscriptReceived}
        initialContext="Journal Reflection"
      />
    </div>
  );
}
