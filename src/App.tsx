import { useState, useEffect, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { MoodCheckIn } from './components/MoodCheckIn';
import { CalmRoom } from './components/CalmRoom';
import { BrainExplorer } from './components/BrainExplorer';
import { PlaybookGuide } from './components/PlaybookGuide';
import { ThoughtUntangler } from './components/ThoughtUntangler';
import { PrivateJournal } from './components/PrivateJournal';
import { MoodWeeklyTrends } from './components/MoodWeeklyTrends';
import { ResourceLibrary } from './components/ResourceLibrary';
import { GuidedJournalSection } from './components/GuidedJournalSection';
import { HabitsTracker } from './components/HabitsTracker';
import { CrisisModal } from './components/CrisisModal';
import { RemindersModal } from './components/RemindersModal';
import { ToastNotificationContainer } from './components/ToastNotificationContainer';
import { GlobalMusicBar } from './components/GlobalMusicBar';
import { MusicLoungeModal } from './components/MusicLoungeModal';
import { AudioRecorderModal } from './components/AudioRecorderModal';
import { useAuth } from './context/AuthContext';
import { 
  syncMoodEntryToFirestore, 
  removeMoodEntryFromFirestore, 
  subscribeUserMoodEntries 
} from './utils/firestoreService';
import { MoodLogEntry, MoodReminder, ToastNotification, DayOfWeek, Song } from './types';
import { DEFAULT_REMINDERS, playGentleReminderSound, showBrowserNativeNotification } from './utils/reminderService';
import { CURATED_TRACKS } from './utils/musicService';
import { formatDateKey } from './data/defaultHabits';
import { 
  Heart, 
  Wind, 
  Brain, 
  BookOpen, 
  Sparkles, 
  Lock, 
  ShieldCheck, 
  HeartHandshake,
  Compass,
  Activity,
  Library,
  PenTool,
  CheckSquare,
  Music
} from 'lucide-react';

export default function App() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('checkin');
  const [isCrisisModalOpen, setIsCrisisModalOpen] = useState<boolean>(false);
  const [isRemindersModalOpen, setIsRemindersModalOpen] = useState<boolean>(false);
  const [isGlobalVoiceModalOpen, setIsGlobalVoiceModalOpen] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  // Sound chime preference for reminders
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem('sanctuary_reminder_sound_enabled');
      return stored !== null ? JSON.parse(stored) : true;
    } catch {
      return true;
    }
  });

  // Music Player Persistent State
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentSong, setCurrentSong] = useState<Song | null>(() => {
    return CURATED_TRACKS[0] || null;
  });
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [duration, setDuration] = useState<number>(CURATED_TRACKS[0]?.duration || 147);
  const [volume, setVolume] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('sanctuary_music_volume');
      return saved !== null ? parseFloat(saved) : 0.8;
    } catch {
      return 0.8;
    }
  });
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isLooping, setIsLooping] = useState<boolean>(false);
  const [isMusicModalOpen, setIsMusicModalOpen] = useState<boolean>(false);

  // Custom added or uploaded tracks
  const [customSongs, setCustomSongs] = useState<Song[]>(() => {
    try {
      const saved = localStorage.getItem('sanctuary_custom_songs');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Save custom songs
  useEffect(() => {
    try {
      localStorage.setItem('sanctuary_custom_songs', JSON.stringify(customSongs));
    } catch {}
  }, [customSongs]);

  // Daily mood reminders in localStorage
  const [reminders, setReminders] = useState<MoodReminder[]>(() => {
    try {
      const stored = localStorage.getItem('sanctuary_mood_reminders');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {}
    return DEFAULT_REMINDERS;
  });

  // Stored mood entries in localStorage
  const [moodEntries, setMoodEntries] = useState<MoodLogEntry[]>(() => {
    try {
      const stored = localStorage.getItem('sanctuary_mood_entries');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {}
    // Seed with one initial realistic entry so the user sees immediate structure
    return [
      {
        id: 'initial-entry-1',
        timestamp: Date.now() - 3600000 * 5,
        emotionId: 'social-anxiety',
        emotionName: 'Social Dread / Judged',
        category: 'anxiety',
        intensity: 5,
        bodyLocations: ['throat', 'stomach'],
        triggers: ['Friendship Drama', 'School & Grades'],
        notes: 'Felt nervous before lunch about where to sit. Practiced 3 deep breaths and sat with Sam.'
      }
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem('sanctuary_mood_entries', JSON.stringify(moodEntries));
    } catch {}
  }, [moodEntries]);

  // Sync with Firestore when user is authenticated
  useEffect(() => {
    if (!user) return;
    const unsubscribe = subscribeUserMoodEntries(user.uid, (cloudEntries) => {
      if (cloudEntries && cloudEntries.length > 0) {
        setMoodEntries(prev => {
          const cloudIds = new Set(cloudEntries.map(e => e.id));
          const localOnly = prev.filter(p => !cloudIds.has(p.id) && !p.id.startsWith('sample-'));
          return [...cloudEntries, ...localOnly];
        });
      }
    });
    return () => unsubscribe();
  }, [user]);

  // Persist reminders
  useEffect(() => {
    try {
      localStorage.setItem('sanctuary_mood_reminders', JSON.stringify(reminders));
    } catch {}
  }, [reminders]);

  // Persist sound preference
  useEffect(() => {
    try {
      localStorage.setItem('sanctuary_reminder_sound_enabled', JSON.stringify(soundEnabled));
    } catch {}
  }, [soundEnabled]);

  // Trigger toast & browser notification
  const triggerReminderAlert = (reminder: MoodReminder) => {
    if (soundEnabled) {
      playGentleReminderSound();
    }

    showBrowserNativeNotification(
      reminder.label,
      reminder.message,
      () => handleTabSelect('checkin')
    );

    setToasts(prev => [
      ...prev,
      {
        id: `toast-${Date.now()}-${Math.random()}`,
        title: reminder.label,
        message: reminder.message,
        type: 'reminder',
        timestamp: Date.now(),
        actionLabel: 'Check In Now',
        targetTab: 'checkin',
        duration: 9000
      }
    ]);
  };

  // Test notification button handler
  const handleTriggerTestToast = () => {
    if (soundEnabled) {
      playGentleReminderSound();
    }

    showBrowserNativeNotification(
      'Daily Mood Check-in Reminder',
      'Take a slow breath. Notice how your nervous system is feeling right now.',
      () => handleTabSelect('checkin')
    );

    setToasts(prev => [
      ...prev,
      {
        id: `toast-test-${Date.now()}`,
        title: 'Daily Mood Check-in Reminder',
        message: 'Take a slow breath. Notice how your nervous system is feeling right now.',
        type: 'reminder',
        timestamp: Date.now(),
        actionLabel: 'Check In Now',
        targetTab: 'checkin',
        duration: 9000
      }
    ]);
  };

  const handleToastAction = (toast: ToastNotification) => {
    if (toast.targetTab) {
      handleTabSelect(toast.targetTab);
    }
    handleDismissToast(toast.id);
  };

  const handleDismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Periodically check if any reminder matches current time
  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      const currentHours = String(now.getHours()).padStart(2, '0');
      const currentMinutes = String(now.getMinutes()).padStart(2, '0');
      const currentTimeStr = `${currentHours}:${currentMinutes}`;
      const todayKey = formatDateKey(now);

      const daysArr: DayOfWeek[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const currentDayOfWeek = daysArr[now.getDay()];

      setReminders(prevReminders => {
        let hasChanges = false;
        const next = prevReminders.map(reminder => {
          if (
            reminder.enabled &&
            reminder.time === currentTimeStr &&
            reminder.days.includes(currentDayOfWeek) &&
            reminder.lastNotifiedDate !== todayKey
          ) {
            hasChanges = true;
            triggerReminderAlert(reminder);
            return { ...reminder, lastNotifiedDate: todayKey };
          }
          return reminder;
        });

        return hasChanges ? next : prevReminders;
      });
    };

    checkReminders();
    const interval = setInterval(checkReminders, 15000);
    return () => clearInterval(interval);
  }, [soundEnabled]);

  const handleSaveMoodEntry = async (entry: MoodLogEntry) => {
    setMoodEntries(prev => [entry, ...prev]);
    if (user) {
      await syncMoodEntryToFirestore(user.uid, entry).catch(err => {
        console.error('Failed to sync mood entry to Firestore:', err);
      });
    }
  };

  const handleDeleteMoodEntry = async (id: string) => {
    setMoodEntries(prev => prev.filter(e => e.id !== id));
    if (user) {
      await removeMoodEntryFromFirestore(user.uid, id).catch(err => {
        console.error('Failed to remove mood entry from Firestore:', err);
      });
    }
  };

  const handleAddSampleWeek = () => {
    const now = Date.now();
    const oneDay = 24 * 3600 * 1000;
    const sampleData: MoodLogEntry[] = [
      {
        id: `sample-${now}-6`,
        timestamp: now - 6 * oneDay + 11 * 3600 * 1000,
        emotionId: 'academic-dread',
        emotionName: 'Academic Dread / Paralysis',
        category: 'anxiety',
        intensity: 7,
        bodyLocations: ['throat', 'chest'],
        triggers: ['School & Grades'],
        notes: 'Studying for midterm felt like drowning. Felt frozen for an hour.'
      },
      {
        id: `sample-${now}-5`,
        timestamp: now - 5 * oneDay + 14 * 3600 * 1000,
        emotionId: 'social-anxiety',
        emotionName: 'Social Dread / Judged',
        category: 'anxiety',
        intensity: 6,
        bodyLocations: ['stomach'],
        triggers: ['Friendship Drama'],
        notes: 'Felt like people were whispering at the locker bank.'
      },
      {
        id: `sample-${now}-4`,
        timestamp: now - 4 * oneDay + 19 * 3600 * 1000,
        emotionId: 'parent-friction',
        emotionName: 'Misunderstood / Suffocated',
        category: 'anger',
        intensity: 8,
        bodyLocations: ['jaw', 'shoulders'],
        triggers: ['Parents & Family Conflict'],
        notes: 'Huge blow-up over screentime. Slammed bedroom door.'
      },
      {
        id: `sample-${now}-3`,
        timestamp: now - 3 * oneDay + 16 * 3600 * 1000,
        emotionId: 'overstimulated',
        emotionName: 'Sensory Overdrive',
        category: 'overwhelm',
        intensity: 5,
        bodyLocations: ['head'],
        triggers: ['Social Media Comparison'],
        notes: 'Hallway was way too loud. Took 5 mins in the counselor office.'
      },
      {
        id: `sample-${now}-2`,
        timestamp: now - 2 * oneDay + 21 * 3600 * 1000,
        emotionId: 'alone-in-crowd',
        emotionName: 'Invisible / Disconnected',
        category: 'sadness',
        intensity: 6,
        bodyLocations: ['chest'],
        triggers: ['Friendship Drama'],
        notes: 'Saw friends hanging out on BeReal without inviting me.'
      },
      {
        id: `sample-${now}-1`,
        timestamp: now - 1 * oneDay + 15 * 3600 * 1000,
        emotionId: 'imposter-syndrome',
        emotionName: 'Imposter Syndrome',
        category: 'confusion',
        intensity: 4,
        bodyLocations: ['shoulders'],
        triggers: ['School & Grades'],
        notes: 'Gave English presentation. Stumbled a bit but finished.'
      },
      {
        id: `sample-${now}-0`,
        timestamp: now - 2 * 3600 * 1000,
        emotionId: 'creative-spark',
        emotionName: 'Creative Flow & Passion',
        category: 'joy',
        intensity: 3,
        bodyLocations: ['chest'],
        triggers: ['School & Grades'],
        notes: 'Doodled in sketchbook while listening to soundtrack. Felt genuinely peaceful.'
      }
    ];

    setMoodEntries(prev => [...sampleData, ...prev.filter(p => !p.id.startsWith('sample-'))]);
  };

  const handleClearSampleData = () => {
    setMoodEntries(prev => prev.filter(p => !p.id.startsWith('sample-')));
  };

  // Audio Playback Handlers
  const allTracks = [...customSongs, ...CURATED_TRACKS];

  const handlePlaySong = (song: Song) => {
    setCurrentSong(song);
    setIsPlaying(true);
    setProgress(0);
    setDuration(song.duration || 180);

    if (song.audioUrl) {
      if (audioRef.current) {
        audioRef.current.src = song.audioUrl;
        audioRef.current.currentTime = 0;
        audioRef.current.volume = isMuted ? 0 : volume;
        audioRef.current.play().catch(e => {
          console.warn('Audio play request interrupted or blocked:', e);
        });
      }
    } else if (song.youtubeId) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    }
  };

  const handleTogglePlay = () => {
    if (!currentSong) {
      if (CURATED_TRACKS.length > 0) {
        handlePlaySong(CURATED_TRACKS[0]);
      }
      return;
    }

    if (isPlaying) {
      if (audioRef.current) audioRef.current.pause();
      setIsPlaying(false);
    } else {
      if (currentSong.audioUrl && audioRef.current) {
        audioRef.current.play().catch(e => console.warn('Audio play failed:', e));
      }
      setIsPlaying(true);
    }
  };

  const handleSeek = (newSeconds: number) => {
    setProgress(newSeconds);
    if (audioRef.current && currentSong?.audioUrl) {
      audioRef.current.currentTime = newSeconds;
    }
  };

  const handleChangeVolume = (newVol: number) => {
    setVolume(newVol);
    setIsMuted(false);
    if (audioRef.current) {
      audioRef.current.volume = newVol;
    }
    try {
      localStorage.setItem('sanctuary_music_volume', String(newVol));
    } catch {}
  };

  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (audioRef.current) {
      audioRef.current.volume = nextMuted ? 0 : volume;
    }
  };

  const handleToggleLoop = () => {
    setIsLooping(prev => !prev);
  };

  const handleNextSong = () => {
    if (!currentSong) {
      handlePlaySong(CURATED_TRACKS[0]);
      return;
    }
    const currentIndex = allTracks.findIndex(s => s.id === currentSong.id);
    const nextIndex = currentIndex >= 0 ? (currentIndex + 1) % allTracks.length : 0;
    handlePlaySong(allTracks[nextIndex]);
  };

  const handlePrevSong = () => {
    if (!currentSong) {
      handlePlaySong(CURATED_TRACKS[0]);
      return;
    }
    const currentIndex = allTracks.findIndex(s => s.id === currentSong.id);
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : allTracks.length - 1;
    handlePlaySong(allTracks[prevIndex]);
  };

  const handleAddCustomSong = (song: Song) => {
    setCustomSongs(prev => [song, ...prev.filter(s => s.id !== song.id)]);
  };

  // HTML5 Audio element listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => {
      setProgress(audio.currentTime);
    };

    const onLoadedMetadata = () => {
      if (audio.duration && !isNaN(audio.duration) && audio.duration > 0) {
        setDuration(audio.duration);
      }
    };

    const onEnded = () => {
      if (isLooping) {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      } else {
        handleNextSong();
      }
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
    };
  }, [isLooping, currentSong, customSongs]);

  // YouTube duration tracking when active
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPlaying && currentSong?.youtubeId) {
      interval = setInterval(() => {
        setProgress(p => {
          if (p >= (currentSong.duration || 240)) {
            if (isLooping) return 0;
            handleNextSong();
            return 0;
          }
          return p + 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, currentSong, isLooping]);

  // Scroll to top on tab change
  const handleTabSelect = (tab: string) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-sans selection:bg-emerald-200 selection:text-emerald-950">
      
      {/* Strict 3-Zone Top Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={handleTabSelect}
        onOpenCrisis={() => setIsCrisisModalOpen(true)}
        onOpenReminders={() => setIsRemindersModalOpen(true)}
        activeRemindersCount={reminders.filter(r => r.enabled).length}
        onOpenMusic={() => setIsMusicModalOpen(true)}
        isMusicPlaying={isPlaying}
        currentSongTitle={currentSong?.title}
        onOpenVoiceModal={() => setIsGlobalVoiceModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 pb-36 lg:pb-28">
        {activeTab === 'checkin' && (
          <MoodCheckIn
            onGoToCalm={() => handleTabSelect('calm')}
            onSaveEntry={handleSaveMoodEntry}
            onOpenReminders={() => setIsRemindersModalOpen(true)}
          />
        )}

        {activeTab === 'calm' && (
          <CalmRoom onOpenMusic={() => setIsMusicModalOpen(true)} />
        )}

        {activeTab === 'habits' && (
          <div className="max-w-5xl mx-auto">
            <HabitsTracker />
          </div>
        )}

        {activeTab === 'trends' && (
          <div className="max-w-5xl mx-auto">
            <MoodWeeklyTrends
              moodEntries={moodEntries}
              onAddSampleWeek={handleAddSampleWeek}
              onClearSampleData={handleClearSampleData}
            />
          </div>
        )}

        {activeTab === 'prompts' && (
          <div className="max-w-5xl mx-auto">
            <GuidedJournalSection
              onNavigateToJournal={() => handleTabSelect('journal')}
            />
          </div>
        )}

        {activeTab === 'resources' && (
          <ResourceLibrary />
        )}

        {activeTab === 'brain' && (
          <BrainExplorer />
        )}

        {activeTab === 'playbooks' && (
          <PlaybookGuide />
        )}

        {activeTab === 'untangle' && (
          <ThoughtUntangler />
        )}

        {activeTab === 'journal' && (
          <PrivateJournal
            moodEntries={moodEntries}
            onDeleteMoodEntry={handleDeleteMoodEntry}
            onAddSampleWeek={handleAddSampleWeek}
            onClearSampleData={handleClearSampleData}
          />
        )}
      </main>

      {/* Peaceful Editorial Banner & Footer */}
      <footer className="mt-auto border-t border-stone-200/90 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            <div className="md:col-span-8 space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                <span className="font-display font-bold text-stone-900">Sanctuary</span>
                <span className="text-xs text-stone-400 font-mono">· Adolescent Well-Being</span>
              </div>
              <p className="text-xs sm:text-sm text-stone-500 max-w-xl leading-relaxed">
                A non-judgmental space designed to demystify teenage neurobiology, validate big emotions, and offer grounded, science-backed emotional resilience tools.
              </p>
            </div>

            <div className="md:col-span-4 flex flex-col sm:flex-row md:flex-col items-start md:items-end gap-3">
              <button
                onClick={() => setIsCrisisModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold hover:bg-rose-100 transition-colors cursor-pointer"
              >
                <HeartHandshake className="w-4 h-4 text-rose-600" />
                <span>24/7 Crisis Support Numbers</span>
              </button>
              <div className="text-[11px] text-stone-400 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Zero tracking · Private browser storage</span>
              </div>
            </div>

          </div>

          <div className="pt-6 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-400">
            <div>
              Educational companion and self-regulation guide. Not a substitute for licensed clinical therapy.
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <button onClick={() => handleTabSelect('habits')} className="hover:text-stone-700 transition-colors cursor-pointer">
                Daily Habits
              </button>
              <button onClick={() => handleTabSelect('resources')} className="hover:text-stone-700 transition-colors cursor-pointer">
                Resource Library
              </button>
              <button onClick={() => handleTabSelect('prompts')} className="hover:text-stone-700 transition-colors cursor-pointer">
                Guided Prompts
              </button>
              <button onClick={() => handleTabSelect('trends')} className="hover:text-stone-700 transition-colors cursor-pointer">
                Weekly Trends
              </button>
              <button onClick={() => handleTabSelect('brain')} className="hover:text-stone-700 transition-colors cursor-pointer">
                Neuroscience
              </button>
              <button onClick={() => handleTabSelect('playbooks')} className="hover:text-stone-700 transition-colors cursor-pointer">
                Scripts
              </button>
              <button onClick={() => handleTabSelect('calm')} className="hover:text-stone-700 transition-colors cursor-pointer">
                Calm Room
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile Ergonomic Bottom Tab Navigation (Natural Reach Thumb Zone) */}
      <nav 
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200/90 px-1 py-1.5 flex items-center justify-start overflow-x-auto scrollbar-none gap-0.5"
        aria-label="Mobile navigation"
      >
        <button
          onClick={() => handleTabSelect('checkin')}
          className={`flex flex-col items-center justify-center min-w-[52px] py-1 px-1 rounded-xl transition-colors cursor-pointer shrink-0 ${
            activeTab === 'checkin' ? 'text-emerald-800 font-bold' : 'text-stone-500'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span className="text-[10px] mt-0.5">Check-in</span>
        </button>

        <button
          onClick={() => handleTabSelect('calm')}
          className={`flex flex-col items-center justify-center min-w-[52px] py-1 px-1 rounded-xl transition-colors cursor-pointer shrink-0 ${
            activeTab === 'calm' ? 'text-emerald-800 font-bold' : 'text-stone-500'
          }`}
        >
          <Wind className="w-4 h-4" />
          <span className="text-[10px] mt-0.5">Calm</span>
        </button>

        <button
          onClick={() => handleTabSelect('habits')}
          className={`flex flex-col items-center justify-center min-w-[52px] py-1 px-1 rounded-xl transition-colors cursor-pointer shrink-0 ${
            activeTab === 'habits' ? 'text-emerald-800 font-bold' : 'text-stone-500'
          }`}
        >
          <CheckSquare className="w-4 h-4" />
          <span className="text-[10px] mt-0.5">Habits</span>
        </button>

        <button
          onClick={() => handleTabSelect('trends')}
          className={`flex flex-col items-center justify-center min-w-[52px] py-1 px-1 rounded-xl transition-colors cursor-pointer shrink-0 ${
            activeTab === 'trends' ? 'text-emerald-800 font-bold' : 'text-stone-500'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span className="text-[10px] mt-0.5">Trends</span>
        </button>

        <button
          onClick={() => handleTabSelect('prompts')}
          className={`flex flex-col items-center justify-center min-w-[52px] py-1 px-1 rounded-xl transition-colors cursor-pointer shrink-0 ${
            activeTab === 'prompts' ? 'text-emerald-800 font-bold' : 'text-stone-500'
          }`}
        >
          <PenTool className="w-4 h-4" />
          <span className="text-[10px] mt-0.5">Prompts</span>
        </button>

        <button
          onClick={() => handleTabSelect('resources')}
          className={`flex flex-col items-center justify-center min-w-[52px] py-1 px-1 rounded-xl transition-colors cursor-pointer shrink-0 ${
            activeTab === 'resources' ? 'text-emerald-800 font-bold' : 'text-stone-500'
          }`}
        >
          <Library className="w-4 h-4" />
          <span className="text-[10px] mt-0.5">Library</span>
        </button>

        <button
          onClick={() => handleTabSelect('brain')}
          className={`flex flex-col items-center justify-center min-w-[52px] py-1 px-1 rounded-xl transition-colors cursor-pointer shrink-0 ${
            activeTab === 'brain' ? 'text-emerald-800 font-bold' : 'text-stone-500'
          }`}
        >
          <Brain className="w-4 h-4" />
          <span className="text-[10px] mt-0.5">Brain</span>
        </button>

        <button
          onClick={() => handleTabSelect('playbooks')}
          className={`flex flex-col items-center justify-center min-w-[52px] py-1 px-1 rounded-xl transition-colors cursor-pointer shrink-0 ${
            activeTab === 'playbooks' ? 'text-emerald-800 font-bold' : 'text-stone-500'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span className="text-[10px] mt-0.5">Scripts</span>
        </button>

        <button
          onClick={() => handleTabSelect('untangle')}
          className={`flex flex-col items-center justify-center min-w-[52px] py-1 px-1 rounded-xl transition-colors cursor-pointer shrink-0 ${
            activeTab === 'untangle' ? 'text-emerald-800 font-bold' : 'text-stone-500'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span className="text-[10px] mt-0.5">Untangle</span>
        </button>

        <button
          onClick={() => handleTabSelect('journal')}
          className={`flex flex-col items-center justify-center min-w-[52px] py-1 px-1 rounded-xl transition-colors cursor-pointer shrink-0 ${
            activeTab === 'journal' ? 'text-emerald-800 font-bold' : 'text-stone-500'
          }`}
        >
          <Lock className="w-4 h-4" />
          <span className="text-[10px] mt-0.5">Journal</span>
        </button>

        <button
          onClick={() => setIsMusicModalOpen(true)}
          className={`flex flex-col items-center justify-center min-w-[52px] py-1 px-1 rounded-xl transition-colors cursor-pointer shrink-0 ${
            isPlaying ? 'text-emerald-700 font-bold' : 'text-stone-500'
          }`}
        >
          <Music className={`w-4 h-4 ${isPlaying ? 'animate-bounce text-emerald-600' : ''}`} />
          <span className="text-[10px] mt-0.5">Music</span>
        </button>
      </nav>

      {/* Hidden Global Audio Element */}
      <audio
        ref={audioRef}
        preload="auto"
        className="hidden"
      />

      {/* Global Bottom Music Player Bar */}
      <GlobalMusicBar
        currentSong={currentSong}
        isPlaying={isPlaying}
        progress={progress}
        duration={duration}
        volume={volume}
        isMuted={isMuted}
        isLooping={isLooping}
        onTogglePlay={handleTogglePlay}
        onSeek={handleSeek}
        onChangeVolume={handleChangeVolume}
        onToggleMute={handleToggleMute}
        onToggleLoop={handleToggleLoop}
        onNext={handleNextSong}
        onPrev={handlePrevSong}
        onOpenLounge={() => setIsMusicModalOpen(true)}
        onTimeUpdate={(sec) => setProgress(sec)}
        onDurationUpdate={(dur) => setDuration(dur)}
        onEnded={handleNextSong}
        onPlayerStateChange={(playing) => setIsPlaying(playing)}
      />

      {/* Full Music Lounge & Discovery Modal */}
      <MusicLoungeModal
        isOpen={isMusicModalOpen}
        onClose={() => setIsMusicModalOpen(false)}
        currentSong={currentSong}
        isPlaying={isPlaying}
        onPlaySong={handlePlaySong}
        onTogglePlay={handleTogglePlay}
        customSongs={customSongs}
        onAddCustomSong={handleAddCustomSong}
      />

      {/* Confidential Crisis Modal */}
      <CrisisModal
        isOpen={isCrisisModalOpen}
        onClose={() => setIsCrisisModalOpen(false)}
      />

      {/* Toast Notification Container for Web Browser Alerts */}
      <ToastNotificationContainer
        toasts={toasts}
        onDismiss={handleDismissToast}
        onActionClick={handleToastAction}
      />

      {/* Daily Mood Reminders Configuration Modal */}
      <RemindersModal
        isOpen={isRemindersModalOpen}
        onClose={() => setIsRemindersModalOpen(false)}
        reminders={reminders}
        onUpdateReminders={setReminders}
        onTriggerTestToast={handleTriggerTestToast}
        soundEnabled={soundEnabled}
        onToggleSound={setSoundEnabled}
      />

      {/* Global Voice Note / Audio Transcription Modal */}
      <AudioRecorderModal
        isOpen={isGlobalVoiceModalOpen}
        onClose={() => setIsGlobalVoiceModalOpen(false)}
        onTranscriptComplete={(transcript) => {
          setActiveTab('journal');
          setToasts(prev => [
            ...prev,
            {
              id: `toast-transcribed-${Date.now()}`,
              title: 'Audio Transcribed Successfully',
              message: `Voice transcribed with Gemini 3.5 Transcribe. Opened in Journal.`,
              type: 'reminder',
              timestamp: Date.now(),
              actionLabel: 'View Journal',
              targetTab: 'journal',
              duration: 7000
            }
          ]);
        }}
        initialContext="Voice Memo"
      />

    </div>
  );
}
