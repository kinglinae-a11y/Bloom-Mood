import { useState } from 'react';
import { Volume2, VolumeX, ShieldAlert, HeartHandshake } from 'lucide-react';
import { ambientSound } from '../utils/audioSynthesis';

interface NavbarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onOpenCrisis: () => void;
}

export function Navbar({ activeTab, onSelectTab, onOpenCrisis }: NavbarProps) {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const toggleSound = () => {
    const isNowPlaying = ambientSound.toggle('ambient');
    setIsPlayingAudio(isNowPlaying);
  };

  const navItems = [
    { id: 'checkin', label: 'Feelings Check-in' },
    { id: 'calm', label: 'Calm Room' },
    { id: 'brain', label: 'Adolescent Brain' },
    { id: 'playbooks', label: 'Life Playbooks' },
    { id: 'untangle', label: 'Thought Untangler' },
    { id: 'journal', label: 'Private Journal' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-stone-50/90 backdrop-blur-md border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
        {/* Zone 1: Single Brand Title */}
        <button 
          onClick={() => onSelectTab('checkin')} 
          className="font-display text-xl font-bold text-stone-900 tracking-tight flex items-center gap-2 group text-left cursor-pointer"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 group-hover:scale-125 transition-transform" />
          <span>Sanctuary</span>
        </button>

        {/* Zone 2: Clean 4-6 text navigation links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-stone-600">
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

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-3">
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
                <span className="hidden sm:inline">Ambient On</span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4 text-stone-400" />
                <span className="hidden sm:inline">Sound Off</span>
              </>
            )}
          </button>

          <button
            onClick={onOpenCrisis}
            className="px-3.5 py-1.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold hover:bg-rose-100 transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <HeartHandshake className="w-3.5 h-3.5 text-rose-600" />
            <span>Crisis & Help</span>
          </button>
        </div>
      </div>
    </header>
  );
}
