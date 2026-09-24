import { useState, useRef, useEffect } from 'react';
import { 
  Volume2, 
  VolumeX, 
  HeartHandshake, 
  Bell, 
  Music, 
  Mic, 
  LogIn, 
  LogOut, 
  User as UserIcon, 
  CheckCircle2,
  Cloud
} from 'lucide-react';
import { ambientSound } from '../utils/audioSynthesis';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onOpenCrisis: () => void;
  onOpenReminders?: () => void;
  activeRemindersCount?: number;
  onOpenMusic?: () => void;
  isMusicPlaying?: boolean;
  currentSongTitle?: string;
  onOpenVoiceModal?: () => void;
}

export function Navbar({ 
  activeTab, 
  onSelectTab, 
  onOpenCrisis, 
  onOpenReminders,
  activeRemindersCount = 0,
  onOpenMusic,
  isMusicPlaying = false,
  currentSongTitle,
  onOpenVoiceModal
}: NavbarProps) {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, loading, signIn, signOut } = useAuth();
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleSound = () => {
    const isNowPlaying = ambientSound.toggle('ambient');
    setIsPlayingAudio(isNowPlaying);
  };

  const handleSignIn = async () => {
    try {
      await signIn();
    } catch {
      // User cancellation handled gracefully
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsUserMenuOpen(false);
    } catch (err) {
      console.error('Sign out failed:', err);
    }
  };

  const navItems = [
    { id: 'checkin', label: 'Check-in' },
    { id: 'calm', label: 'Calm Room' },
    { id: 'habits', label: 'Habits' },
    { id: 'trends', label: 'Weekly Trends' },
    { id: 'prompts', label: 'Guided Prompts' },
    { id: 'resources', label: 'Resource Library' },
    { id: 'brain', label: 'Adolescent Brain' },
    { id: 'playbooks', label: 'Playbooks' },
    { id: 'untangle', label: 'Untangle' },
    { id: 'journal', label: 'Journal & Voice' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-stone-50/90 backdrop-blur-md border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        
        {/* Zone 1: Single Brand Title */}
        <button 
          onClick={() => onSelectTab('checkin')} 
          className="font-display text-xl font-bold text-stone-900 tracking-tight flex items-center gap-2 group text-left cursor-pointer shrink-0"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 group-hover:scale-125 transition-transform" />
          <span>Sanctuary</span>
        </button>

        {/* Zone 2: Navigation links */}
        <nav className="hidden lg:flex items-center gap-3 xl:gap-4 text-xs xl:text-sm font-medium text-stone-600 overflow-x-auto py-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`transition-colors relative py-1 cursor-pointer whitespace-nowrap ${
                  isActive ? 'text-stone-900 font-semibold' : 'hover:text-stone-900'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Voice Audio Transcription Modal Trigger */}
          {onOpenVoiceModal && (
            <button
              onClick={onOpenVoiceModal}
              title="Record Voice & Transcribe (Gemini 3.5 Transcribe)"
              className="p-2 rounded-lg border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
              aria-label="Record voice note"
            >
              <Mic className="w-4 h-4 text-emerald-700" />
              <span className="hidden md:inline">Voice Note</span>
            </button>
          )}

          {onOpenMusic && (
            <button
              onClick={onOpenMusic}
              title={isMusicPlaying ? `Now Playing: ${currentSongTitle || 'Music'}` : 'Listen to Any Song'}
              className={`p-2 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer relative ${
                isMusicPlaying
                  ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                  : 'bg-white border-stone-200 hover:border-emerald-300 text-stone-600 hover:text-stone-900'
              }`}
              aria-label="Open Music Lounge to listen to any song"
            >
              <Music className={`w-4 h-4 ${isMusicPlaying ? 'text-white animate-bounce' : 'text-emerald-700'}`} />
              <span className="hidden xl:inline">
                {isMusicPlaying ? (currentSongTitle ? currentSongTitle.substring(0, 14) + '...' : 'Playing') : 'Music'}
              </span>
              {isMusicPlaying && (
                <span className="w-2 h-2 rounded-full bg-white animate-ping absolute -top-0.5 -right-0.5" />
              )}
            </button>
          )}

          {onOpenReminders && (
            <button
              onClick={onOpenReminders}
              title={`Manage Daily Mood Reminders (${activeRemindersCount} active)`}
              className="p-2 rounded-lg border border-stone-200 bg-white hover:border-emerald-300 text-stone-600 hover:text-stone-900 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer relative"
              aria-label="Manage daily check-in reminders"
            >
              <Bell className="w-4 h-4 text-emerald-700" />
              <span className="hidden xl:inline">Reminders</span>
              {activeRemindersCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse absolute -top-0.5 -right-0.5" />
              )}
            </button>
          )}

          <button
            onClick={toggleSound}
            title={isPlayingAudio ? 'Mute 432Hz ambient sound' : 'Play calming 432Hz ambient sound'}
            className={`p-2 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
              isPlayingAudio 
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800' 
                : 'bg-white border-stone-200 text-stone-600 hover:text-stone-900 hover:border-stone-300'
            }`}
            aria-label={isPlayingAudio ? 'Mute ambient sound' : 'Turn on soothing ambient sound'}
          >
            {isPlayingAudio ? (
              <>
                <Volume2 className="w-4 h-4 text-emerald-600 animate-pulse" />
                <span className="hidden xl:inline">Sound On</span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4 text-stone-400" />
                <span className="hidden xl:inline">Sound Off</span>
              </>
            )}
          </button>

          {/* Firebase Authentication Button / User Profile */}
          <div className="relative" ref={userMenuRef}>
            {loading ? (
              <div className="w-8 h-8 rounded-full bg-stone-200 animate-pulse" />
            ) : user ? (
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 p-1 pl-2 pr-2.5 rounded-xl border border-stone-200 bg-white hover:border-emerald-400 transition-all cursor-pointer shadow-2xs"
                aria-label="User profile and sync settings"
              >
                {user.photoURL ? (
                  <img 
                    src={user.photoURL} 
                    alt={user.displayName || 'User'} 
                    className="w-6 h-6 rounded-full object-cover border border-emerald-500"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center">
                    {(user.displayName || user.email || 'U')[0].toUpperCase()}
                  </div>
                )}
                <span className="text-xs font-medium text-stone-800 hidden sm:inline max-w-[100px] truncate">
                  {user.displayName?.split(' ')[0] || 'Account'}
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500" title="Connected to Firebase" />
              </button>
            ) : (
              <button
                onClick={handleSignIn}
                className="px-3 py-1.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                title="Sign in with Google to sync your moods and journal safely to Firebase"
              >
                {/* Google "G" logo svg */}
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span className="hidden sm:inline">Sign In</span>
              </button>
            )}

            {/* Dropdown Menu when Signed In */}
            {isUserMenuOpen && user && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-stone-200 rounded-2xl shadow-xl p-3 z-50 space-y-2 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="p-2 border-b border-stone-100 flex items-center gap-3">
                  {user.photoURL ? (
                    <img 
                      src={user.photoURL} 
                      alt="" 
                      className="w-10 h-10 rounded-full object-cover border border-emerald-400"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center">
                      {(user.displayName || user.email || 'U')[0].toUpperCase()}
                    </div>
                  )}
                  <div className="overflow-hidden">
                    <p className="text-xs font-bold text-stone-900 truncate">
                      {user.displayName || 'Friend'}
                    </p>
                    <p className="text-[11px] text-stone-500 truncate">
                      {user.email}
                    </p>
                  </div>
                </div>

                <div className="px-2 py-1 text-[11px] text-emerald-800 bg-emerald-50 rounded-lg flex items-center gap-1.5">
                  <Cloud className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Syncing with Firebase Firestore</span>
                </div>

                <button
                  onClick={handleSignOut}
                  className="w-full text-left px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 rounded-xl font-medium flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>

          <button
            onClick={onOpenCrisis}
            className="px-3 py-1.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold hover:bg-rose-100 transition-colors flex items-center gap-1 cursor-pointer whitespace-nowrap"
          >
            <HeartHandshake className="w-3.5 h-3.5 text-rose-600" />
            <span className="hidden sm:inline">Crisis Help</span>
          </button>
        </div>
      </div>
    </header>
  );
}
