import React, { useState, useEffect, useRef } from 'react';
import { Song } from '../types';
import { formatTime } from '../utils/musicService';
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Volume2, 
  VolumeX, 
  Repeat, 
  Search, 
  Music, 
  ChevronUp, 
  ChevronDown, 
  Disc,
  ExternalLink,
  Youtube,
  Tv,
  X,
  Sparkles,
  Radio
} from 'lucide-react';

interface GlobalMusicBarProps {
  currentSong: Song | null;
  isPlaying: boolean;
  progress: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isLooping: boolean;
  onTogglePlay: () => void;
  onSeek: (seconds: number) => void;
  onChangeVolume: (volume: number) => void;
  onToggleMute: () => void;
  onToggleLoop: () => void;
  onNext: () => void;
  onPrev: () => void;
  onOpenLounge: () => void;
  onTimeUpdate?: (seconds: number) => void;
  onDurationUpdate?: (duration: number) => void;
  onEnded?: () => void;
  onPlayerStateChange?: (playing: boolean) => void;
}

export function GlobalMusicBar({
  currentSong,
  isPlaying,
  progress,
  duration,
  volume,
  isMuted,
  isLooping,
  onTogglePlay,
  onSeek,
  onChangeVolume,
  onToggleMute,
  onToggleLoop,
  onNext,
  onPrev,
  onOpenLounge,
  onTimeUpdate,
  onDurationUpdate,
  onEnded,
  onPlayerStateChange
}: GlobalMusicBarProps) {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isVideoDrawerOpen, setIsVideoDrawerOpen] = useState(false);
  const ytIframeRef = useRef<HTMLIFrameElement | null>(null);

  // Sync YouTube iframe playback on isPlaying state change
  useEffect(() => {
    if (!currentSong?.youtubeId || !ytIframeRef.current) return;
    try {
      const func = isPlaying ? 'playVideo' : 'pauseVideo';
      ytIframeRef.current.contentWindow?.postMessage(
        JSON.stringify({ event: 'command', func, args: '' }),
        '*'
      );
    } catch {}
  }, [isPlaying, currentSong?.youtubeId]);

  // Sync YouTube iframe volume & mute
  useEffect(() => {
    if (!currentSong?.youtubeId || !ytIframeRef.current) return;
    try {
      ytIframeRef.current.contentWindow?.postMessage(
        JSON.stringify({ event: 'command', func: 'setVolume', args: [volume * 100] }),
        '*'
      );
      ytIframeRef.current.contentWindow?.postMessage(
        JSON.stringify({ event: 'command', func: isMuted ? 'mute' : 'unMute', args: '' }),
        '*'
      );
    } catch {}
  }, [volume, isMuted, currentSong?.youtubeId]);

  // Listen to postMessage from YouTube Iframe API for exact seconds and duration
  useEffect(() => {
    const handleWindowMessage = (event: MessageEvent) => {
      try {
        if (typeof event.data !== 'string') return;
        const data = JSON.parse(event.data);
        if (data.event === 'infoDelivery' && data.info) {
          if (typeof data.info.currentTime === 'number') {
            onTimeUpdate?.(data.info.currentTime);
          }
          if (typeof data.info.duration === 'number' && data.info.duration > 0) {
            onDurationUpdate?.(Math.round(data.info.duration));
          }
          if (data.info.playerState === 0) { // ENDED
            if (isLooping) {
              ytIframeRef.current?.contentWindow?.postMessage(
                JSON.stringify({ event: 'command', func: 'seekTo', args: [0, true] }),
                '*'
              );
              ytIframeRef.current?.contentWindow?.postMessage(
                '{"event":"command","func":"playVideo","args":""}',
                '*'
              );
            } else {
              onEnded ? onEnded() : onNext();
            }
          } else if (data.info.playerState === 1) { // PLAYING
            onPlayerStateChange?.(true);
          } else if (data.info.playerState === 2) { // PAUSED
            onPlayerStateChange?.(false);
          }
        }
      } catch {}
    };

    window.addEventListener('message', handleWindowMessage);
    return () => window.removeEventListener('message', handleWindowMessage);
  }, [isLooping, onNext, onEnded, onTimeUpdate, onDurationUpdate, onPlayerStateChange]);

  // If no song is loaded yet, show a gentle "Listen to Any Song" launcher dock
  if (!currentSong) {
    return (
      <div className="fixed bottom-18 lg:bottom-4 right-4 z-40">
        <button
          onClick={onOpenLounge}
          className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-stone-900/95 hover:bg-stone-800 text-white shadow-xl hover:shadow-2xl border border-stone-700/80 transition-all transform hover:-translate-y-0.5 cursor-pointer backdrop-blur-md group"
          title="Open Music Lounge to search and listen to any song"
        >
          <div className="w-7 h-7 rounded-xl bg-emerald-600 flex items-center justify-center text-white group-hover:scale-105 transition-transform">
            <Music className="w-4 h-4" />
          </div>
          <div className="text-left pr-1">
            <div className="text-xs font-bold leading-tight flex items-center gap-1.5">
              <span>Listen to Any Song</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <div className="text-[10px] text-stone-400">Search millions of songs</div>
          </div>
          <Search className="w-3.5 h-3.5 text-stone-400 group-hover:text-white transition-colors ml-1" />
        </button>
      </div>
    );
  }

  // Minimized floating pill mode
  if (isMinimized) {
    return (
      <div className="fixed bottom-18 lg:bottom-4 right-4 z-40 flex items-center gap-2 bg-stone-900/95 text-white rounded-full p-2 pl-3 shadow-2xl border border-stone-700 backdrop-blur-md animate-in slide-in-from-bottom-2 duration-200">
        <button
          onClick={onOpenLounge}
          className="flex items-center gap-2.5 hover:opacity-90 cursor-pointer text-left mr-1"
        >
          <div className={`w-8 h-8 rounded-full overflow-hidden border border-emerald-500/50 relative shrink-0 ${isPlaying ? 'animate-[spin_6s_linear_infinite]' : ''}`}>
            <img 
              src={currentSong.artwork} 
              alt={currentSong.title}
              className="w-full h-full object-cover" 
            />
          </div>
          <div className="max-w-[130px] truncate">
            <div className="text-xs font-bold truncate leading-tight">{currentSong.title}</div>
            <div className="text-[10px] text-stone-400 truncate">{currentSong.artist}</div>
          </div>
        </button>

        <button
          onClick={onTogglePlay}
          className="w-8 h-8 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center cursor-pointer transition-colors shadow-xs"
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
        </button>

        <button
          onClick={() => setIsMinimized(false)}
          className="p-1.5 rounded-full hover:bg-stone-800 text-stone-400 hover:text-white transition-colors cursor-pointer"
          title="Expand music player"
        >
          <ChevronUp className="w-4 h-4" />
        </button>
      </div>
    );
  }

  const effectiveDuration = duration > 0 ? duration : (currentSong.duration || 180);
  const percent = effectiveDuration > 0 ? Math.min(100, (progress / effectiveDuration) * 100) : 0;

  return (
    <>
      {/* Persistent YouTube Iframe container & Floating Video Screen */}
      {currentSong?.youtubeId && (
        <div
          className={`fixed transition-all duration-300 z-50 overflow-hidden shadow-2xl border border-stone-700 bg-stone-950 rounded-2xl flex flex-col ${
            isVideoDrawerOpen
              ? 'bottom-20 lg:bottom-16 right-4 w-72 sm:w-88 h-48 sm:h-56 opacity-100 pointer-events-auto scale-100'
              : '-bottom-[600px] -right-[600px] w-64 h-36 opacity-0 pointer-events-none scale-95'
          }`}
        >
          <div className="px-3 py-1.5 bg-stone-900 border-b border-stone-800 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2 min-w-0">
              <Youtube className="w-3.5 h-3.5 text-red-500 shrink-0" />
              <span className="text-[11px] font-bold text-white truncate">{currentSong.title}</span>
              <span className="text-[10px] text-emerald-400 font-mono shrink-0">
                {formatTime(progress)} / {formatTime(effectiveDuration)}
              </span>
            </div>
            <button
              onClick={() => setIsVideoDrawerOpen(false)}
              className="text-stone-400 hover:text-white p-1 rounded-lg hover:bg-stone-800 transition-colors cursor-pointer ml-2 shrink-0"
              title="Minimize video window (audio continues)"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="flex-1 bg-black relative">
            <iframe
              ref={ytIframeRef}
              id="global-youtube-player-iframe"
              src={`https://www.youtube-nocookie.com/embed/${currentSong.youtubeId}?enablejsapi=1&autoplay=1&playsinline=1&controls=1&origin=${encodeURIComponent(typeof window !== 'undefined' ? window.location.origin : '')}`}
              title={currentSong.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              className="w-full h-full border-0"
              onLoad={() => {
                ytIframeRef.current?.contentWindow?.postMessage('{"event":"listening"}', '*');
                ytIframeRef.current?.contentWindow?.postMessage(
                  JSON.stringify({ event: 'command', func: 'setVolume', args: [volume * 100] }),
                  '*'
                );
              }}
            />
          </div>
        </div>
      )}

      <aside 
        aria-label="Audio player"
        className="fixed bottom-14 lg:bottom-0 left-0 right-0 z-40 bg-stone-950/95 border-t border-stone-800/90 text-white shadow-2xl backdrop-blur-lg transition-all"
      >
        {/* Progress Bar (Scrubber) */}
        <div 
          className="w-full h-1.5 bg-stone-800 hover:h-2.5 transition-all cursor-pointer relative group"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const ratio = Math.max(0, Math.min(1, clickX / rect.width));
            const newSeconds = Math.round(ratio * effectiveDuration);
            onSeek(newSeconds);
            if (currentSong?.youtubeId && ytIframeRef.current) {
              ytIframeRef.current.contentWindow?.postMessage(
                JSON.stringify({ event: 'command', func: 'seekTo', args: [newSeconds, true] }),
                '*'
              );
            }
          }}
        >
          <div 
            className="h-full bg-linear-to-r from-emerald-500 to-teal-400 transition-all ease-out relative"
            style={{ width: `${percent}%` }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex items-center justify-between gap-3 sm:gap-6">
          
          {/* Left: Song Info & Artwork */}
          <div className="flex items-center gap-3 min-w-0 sm:w-1/3">
            <div 
              onClick={onOpenLounge}
              className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-xl overflow-hidden shrink-0 cursor-pointer group shadow-md border border-stone-700/60"
            >
              <img 
                src={currentSong.artwork} 
                alt={currentSong.title} 
                className={`w-full h-full object-cover transition-transform group-hover:scale-105 ${isPlaying ? 'animate-[spin_10s_linear_infinite]' : ''}`} 
              />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <Disc className="w-5 h-5 text-white" />
              </div>
              {currentSong.youtubeId && (
                <div className="absolute bottom-0.5 right-0.5 bg-red-600 text-white rounded p-0.5" title="Playing via YouTube">
                  <Youtube className="w-2.5 h-2.5" />
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h4 
                  onClick={onOpenLounge}
                  className="text-xs sm:text-sm font-bold truncate text-white hover:text-emerald-400 transition-colors cursor-pointer"
                  title={currentSong.title}
                >
                  {currentSong.title}
                </h4>
                <span className="hidden md:inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-800/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Real Song • {formatTime(effectiveDuration)}</span>
                </span>
              </div>
              <p 
                onClick={onOpenLounge}
                className="text-[11px] text-stone-400 truncate hover:text-stone-300 transition-colors cursor-pointer"
              >
                {currentSong.artist}
              </p>
            </div>
          </div>

          {/* Center: Controls & Time */}
          <div className="flex flex-col items-center gap-1 shrink-0">
            <div className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={onToggleLoop}
                title={isLooping ? 'Looping enabled' : 'Enable loop'}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  isLooping ? 'text-emerald-400 bg-emerald-950/60' : 'text-stone-400 hover:text-white'
                }`}
              >
                <Repeat className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={onPrev}
                className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800/80 transition-colors cursor-pointer"
                title="Previous song"
              >
                <SkipBack className="w-4 h-4" />
              </button>

              <button
                onClick={onTogglePlay}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center transition-transform active:scale-95 shadow-lg shadow-emerald-900/30 cursor-pointer"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4 fill-current" />
                ) : (
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                )}
              </button>

              <button
                onClick={onNext}
                className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800/80 transition-colors cursor-pointer"
                title="Next song"
              >
                <SkipForward className="w-4 h-4" />
              </button>

              {/* Equalizer animation when playing */}
              <div className="hidden sm:flex items-end gap-0.5 h-4 w-5 pl-1" title={isPlaying ? 'Audio playing' : 'Audio paused'}>
                <span className={`w-1 bg-emerald-500 rounded-t ${isPlaying ? 'animate-[bounce_0.8s_infinite]' : 'h-1'}`} style={{ height: isPlaying ? '70%' : '20%' }} />
                <span className={`w-1 bg-emerald-400 rounded-t ${isPlaying ? 'animate-[bounce_0.6s_infinite_0.2s]' : 'h-1'}`} style={{ height: isPlaying ? '100%' : '30%' }} />
                <span className={`w-1 bg-emerald-500 rounded-t ${isPlaying ? 'animate-[bounce_0.9s_infinite_0.4s]' : 'h-1'}`} style={{ height: isPlaying ? '50%' : '15%' }} />
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-[10px] font-mono text-stone-400">
              <span className="text-emerald-400 font-semibold">{formatTime(progress)}</span>
              <span>/</span>
              <span>{formatTime(effectiveDuration)}</span>
            </div>
          </div>

          {/* Right: Volume, Video Screen & Lounge Search Action */}
          <div className="flex items-center justify-end gap-2 sm:gap-3 sm:w-1/3">
            
            {/* Video Screen Toggle Button (for YouTube tracks) */}
            {currentSong?.youtubeId && (
              <button
                onClick={() => setIsVideoDrawerOpen(prev => !prev)}
                className={`p-1.5 sm:px-2.5 sm:py-1 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border ${
                  isVideoDrawerOpen
                    ? 'bg-red-950/90 text-red-300 border-red-700 shadow-md shadow-red-950/50'
                    : 'bg-stone-800/80 hover:bg-stone-700/80 text-stone-300 hover:text-white border-stone-700'
                }`}
                title={isVideoDrawerOpen ? 'Hide video display (audio keeps playing)' : 'Watch music video screen'}
              >
                <Tv className="w-3.5 h-3.5 text-red-400" />
                <span className="hidden lg:inline">{isVideoDrawerOpen ? 'Hide Video' : 'Video Screen'}</span>
              </button>
            )}

            {/* Volume Control */}
            <div className="hidden sm:flex items-center gap-2 group">
              <button
                onClick={onToggleMute}
                className="p-1.5 rounded-lg text-stone-400 hover:text-white transition-colors cursor-pointer"
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-4 h-4 text-rose-400" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.02"
                value={isMuted ? 0 : volume}
                onChange={(e) => onChangeVolume(parseFloat(e.target.value))}
                className="w-16 md:w-20 h-1.5 bg-stone-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                title={`Volume: ${Math.round((isMuted ? 0 : volume) * 100)}%`}
              />
            </div>

            {/* Search Any Song Button */}
            <button
              onClick={onOpenLounge}
              className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 border border-stone-700 text-stone-200 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              title="Search and listen to any song"
            >
              <Search className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden md:inline">Search Any Song</span>
              <span className="md:hidden">Search</span>
            </button>

            {/* Minimize / Collapse */}
            <button
              onClick={() => setIsMinimized(true)}
              className="p-1.5 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
              title="Minimize player"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

        </div>
      </aside>
    </>
  );
}
