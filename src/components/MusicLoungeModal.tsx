import React, { useState, useEffect, useRef } from 'react';
import { Song } from '../types';
import { 
  searchFullSong,
  searchAnySong, 
  resolveFullSongYouTubeId,
  CURATED_TRACKS, 
  POPULAR_SEARCH_SUGGESTIONS, 
  extractYouTubeId, 
  formatTime 
} from '../utils/musicService';
import { 
  Search, 
  X, 
  Play, 
  Pause, 
  Music, 
  Sparkles, 
  Youtube, 
  Upload, 
  Radio, 
  ExternalLink, 
  Disc, 
  Volume2, 
  VolumeX, 
  Plus, 
  Check, 
  Heart,
  Loader2,
  ListMusic,
  TrendingUp,
  Headphones,
  Zap,
  CheckCircle2,
  Clock
} from 'lucide-react';

interface MusicLoungeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSong: Song | null;
  isPlaying: boolean;
  onPlaySong: (song: Song) => void;
  onTogglePlay: () => void;
  customSongs: Song[];
  onAddCustomSong: (song: Song) => void;
}

type TabType = 'search' | 'curated' | 'youtube' | 'custom';

export function MusicLoungeModal({
  isOpen,
  onClose,
  currentSong,
  isPlaying,
  onPlaySong,
  onTogglePlay,
  customSongs,
  onAddCustomSong
}: MusicLoungeModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchMode, setSearchMode] = useState<'full' | 'itunes'>('full');
  const [searchResults, setSearchResults] = useState<Song[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [resolvingSongId, setResolvingSongId] = useState<string | null>(null);

  // YouTube tab state
  const [youtubeInput, setYoutubeInput] = useState('');
  const [youtubeTitle, setYoutubeTitle] = useState('');
  const [youtubeError, setYoutubeError] = useState<string | null>(null);
  const [activeYoutubeId, setActiveYoutubeId] = useState<string | null>(null);

  // Custom audio stream & upload state
  const [customStreamUrl, setCustomStreamUrl] = useState('');
  const [customTitle, setCustomTitle] = useState('');
  const [customArtist, setCustomArtist] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Perform search
  const handlePerformSearch = async (queryToSearch: string, modeOverride?: 'full' | 'itunes') => {
    const q = queryToSearch.trim();
    if (!q) return;
    const mode = modeOverride || searchMode;
    setIsSearching(true);
    setHasSearched(true);
    setActiveTab('search');

    try {
      if (mode === 'full') {
        const results = await searchFullSong(q);
        setSearchResults(results);
      } else {
        const results = await searchAnySong(q);
        setSearchResults(results);
      }
    } catch (err) {
      console.error(err);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSubmitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    handlePerformSearch(searchQuery);
  };

  // Play any song - automatically resolves full recorded track if needed
  const handleSelectAndPlay = async (song: Song) => {
    if (currentSong?.id === song.id) {
      onTogglePlay();
      return;
    }

    // If song already has youtubeId or is curated/upload with full audio, play directly
    if (song.youtubeId || song.isFullLength || song.source === 'curated' || song.source === 'upload') {
      onPlaySong(song);
      return;
    }

    // Resolve real full recorded song from YouTube
    setResolvingSongId(song.id);
    try {
      const match = await resolveFullSongYouTubeId(song.title, song.artist);
      if (match) {
        const fullSong: Song = {
          ...song,
          youtubeId: match.videoId,
          duration: match.duration, // Real recorded time!
          isFullLength: true
        };
        onPlaySong(fullSong);
      } else {
        // Fallback to original
        onPlaySong(song);
      }
    } catch {
      onPlaySong(song);
    } finally {
      setResolvingSongId(null);
    }
  };

  // YouTube player action
  const handlePlayYouTube = (e: React.FormEvent) => {
    e.preventDefault();
    setYoutubeError(null);
    const videoId = extractYouTubeId(youtubeInput);
    if (!videoId) {
      setYoutubeError('Please enter a valid YouTube video link or 11-character video ID.');
      return;
    }

    const title = youtubeTitle.trim() || 'YouTube Music Stream';
    const youtubeSong: Song = {
      id: `youtube-${videoId}`,
      title,
      artist: 'YouTube Audio',
      artwork: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      youtubeId: videoId,
      duration: 240,
      source: 'youtube',
      genre: 'Full Song Stream',
      isFullLength: true
    };

    onAddCustomSong(youtubeSong);
    onPlaySong(youtubeSong);
    setActiveYoutubeId(videoId);
  };

  // Custom URL action
  const handleAddCustomStream = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customStreamUrl.trim() || !customTitle.trim()) return;

    const streamSong: Song = {
      id: `custom-${Date.now()}`,
      title: customTitle.trim(),
      artist: customArtist.trim() || 'Custom Stream',
      artwork: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80',
      audioUrl: customStreamUrl.trim(),
      duration: 180,
      source: 'custom',
      genre: 'Web Stream'
    };

    onAddCustomSong(streamSong);
    onPlaySong(streamSong);
    setCustomStreamUrl('');
    setCustomTitle('');
    setCustomArtist('');
  };

  // Local audio file upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    const cleanFileName = file.name.replace(/\.[^/.]+$/, '');

    const uploadedSong: Song = {
      id: `upload-${Date.now()}`,
      title: cleanFileName,
      artist: 'Local Audio File',
      artwork: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80',
      audioUrl: objectUrl,
      duration: 200,
      source: 'upload',
      genre: 'Personal Upload'
    };

    onAddCustomSong(uploadedSong);
    onPlaySong(uploadedSong);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-150">
      <div 
        className="bg-stone-900 border border-stone-800 text-stone-100 rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="music-lounge-title"
      >
        {/* Modal Top Header */}
        <div className="p-5 sm:p-6 border-b border-stone-800/80 flex items-start justify-between gap-4 shrink-0 bg-stone-900/90">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400">
              <Headphones className="w-4 h-4 text-emerald-400" />
              <span>Sanctuary Music Lounge</span>
            </div>
            <h2 id="music-lounge-title" className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Listen to Any Song
            </h2>
            <p className="text-xs sm:text-sm text-stone-400">
              Search millions of tracks worldwide, explore soothing lo-fi soundscapes, or play full songs from YouTube.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
            aria-label="Close music lounge"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Global Search Bar */}
        <div className="p-4 sm:px-6 bg-stone-950/60 border-b border-stone-800/60 shrink-0 space-y-3">
          <form onSubmit={handleSubmitSearch} className="relative flex items-center">
            <Search className="w-5 h-5 text-stone-400 absolute left-4 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search any song, artist, album, or genre (e.g. Taylor Swift, Billie Eilish, Lo-Fi, Coldplay)..."
              className="w-full pl-12 pr-28 py-3 rounded-2xl bg-stone-800/90 border border-stone-700 text-sm text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-24 text-stone-400 hover:text-white cursor-pointer p-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              type="submit"
              disabled={isSearching || !searchQuery.trim()}
              className="absolute right-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
            >
              {isSearching ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
              <span>Search</span>
            </button>
          </form>

          {/* Quick Suggestion Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
            <span className="text-[11px] font-semibold text-stone-400 shrink-0 flex items-center gap-1 mr-1">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              <span>Trending:</span>
            </span>
            {POPULAR_SEARCH_SUGGESTIONS.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => {
                  setSearchQuery(suggestion);
                  handlePerformSearch(suggestion);
                }}
                className="px-2.5 py-1 rounded-lg bg-stone-800/80 hover:bg-emerald-950/80 border border-stone-700/80 hover:border-emerald-600 text-[11px] text-stone-300 hover:text-emerald-300 transition-all cursor-pointer shrink-0"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center border-b border-stone-800 px-4 sm:px-6 shrink-0 bg-stone-900/50">
          <button
            onClick={() => setActiveTab('search')}
            className={`px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 flex items-center gap-2 cursor-pointer transition-colors ${
              activeTab === 'search'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Search Catalog {searchResults.length > 0 && `(${searchResults.length})`}</span>
          </button>

          <button
            onClick={() => setActiveTab('curated')}
            className={`px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 flex items-center gap-2 cursor-pointer transition-colors ${
              activeTab === 'curated'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Curated Sanctuary Beats</span>
          </button>

          <button
            onClick={() => setActiveTab('youtube')}
            className={`px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 flex items-center gap-2 cursor-pointer transition-colors ${
              activeTab === 'youtube'
                ? 'border-red-500 text-red-400'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Youtube className="w-4 h-4 text-red-400" />
            <span>Full YouTube Player</span>
          </button>

          <button
            onClick={() => setActiveTab('custom')}
            className={`px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 flex items-center gap-2 cursor-pointer transition-colors ${
              activeTab === 'custom'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Radio className="w-4 h-4" />
            <span>Upload & Stream</span>
          </button>
        </div>

        {/* Tab Content Body (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          
          {/* TAB 1: SEARCH RESULTS */}
          {activeTab === 'search' && (
            <div className="space-y-3">
              {/* Search Engine Mode Selector */}
              <div className="flex flex-wrap items-center justify-between gap-2 p-2 rounded-2xl bg-stone-900/80 border border-stone-800">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setSearchMode('full');
                      if (searchQuery.trim()) handlePerformSearch(searchQuery, 'full');
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      searchMode === 'full'
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/60'
                        : 'text-stone-400 hover:text-white bg-stone-800/60 hover:bg-stone-800'
                    }`}
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>Real Full Songs (Uncut Recorded Time)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchMode('itunes');
                      if (searchQuery.trim()) handlePerformSearch(searchQuery, 'itunes');
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                      searchMode === 'itunes'
                        ? 'bg-stone-800 text-white border border-stone-700'
                        : 'text-stone-400 hover:text-white bg-stone-800/40 hover:bg-stone-800'
                    }`}
                  >
                    <span>Apple Music Catalog</span>
                  </button>
                </div>

                <div className="text-[11px] text-emerald-400 font-medium flex items-center gap-1 px-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Full length 3 to 5+ minute recorded songs</span>
                </div>
              </div>

              {isSearching ? (
                <div className="py-16 text-center space-y-3">
                  <Loader2 className="w-8 h-8 text-emerald-500 animate-spin mx-auto" />
                  <p className="text-sm text-stone-300 font-medium">Finding full-length recorded tracks...</p>
                  <p className="text-xs text-stone-500">Retrieving official audio and exact time recorded</p>
                </div>
              ) : searchResults.length > 0 ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-stone-400 pb-1">
                    <span>Found {searchResults.length} real recorded tracks</span>
                    <span>Plays uninterrupted across Sanctuary</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                    {searchResults.map((song) => {
                      const isCurrent = currentSong?.id === song.id;
                      const isResolving = resolvingSongId === song.id;

                      return (
                        <div
                          key={song.id}
                          className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                            isCurrent
                              ? 'bg-emerald-950/50 border-emerald-500 shadow-md shadow-emerald-950/50'
                              : 'bg-stone-800/50 hover:bg-stone-800 border-stone-800 hover:border-stone-700'
                          }`}
                        >
                          <div 
                            onClick={() => handleSelectAndPlay(song)}
                            className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer"
                          >
                            <div className="relative w-13 h-13 rounded-xl overflow-hidden shrink-0 border border-stone-700 bg-stone-900">
                              <img 
                                src={song.artwork} 
                                alt={song.title} 
                                className="w-full h-full object-cover" 
                              />
                              {isCurrent && isPlaying && (
                                <div className="absolute inset-0 bg-emerald-950/70 flex items-center justify-center">
                                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                                </div>
                              )}
                              {song.youtubeId && (
                                <div className="absolute bottom-0.5 right-0.5 bg-red-600 text-white rounded p-0.5" title="Full YouTube Audio">
                                  <Youtube className="w-2.5 h-2.5" />
                                </div>
                              )}
                            </div>

                            <div className="min-w-0 flex-1">
                              <h4 className="text-xs sm:text-sm font-bold text-white truncate hover:text-emerald-300 transition-colors">
                                {song.title}
                              </h4>
                              <p className="text-[11px] text-stone-400 truncate">
                                {song.artist}
                              </p>
                              <div className="flex items-center gap-1.5 flex-wrap text-[10px] text-stone-400 mt-1">
                                <span className="inline-flex items-center gap-1 font-mono font-semibold px-1.5 py-0.5 rounded bg-stone-900 text-emerald-400 border border-stone-700">
                                  <Clock className="w-2.5 h-2.5" />
                                  <span>{formatTime(song.duration)}</span>
                                </span>
                                {song.isFullLength && (
                                  <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
                                    Real Song
                                  </span>
                                )}
                                {song.viewCount && (
                                  <span className="text-stone-500 hidden sm:inline">{song.viewCount}</span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            {/* Play Button */}
                            <button
                              onClick={() => handleSelectAndPlay(song)}
                              disabled={isResolving}
                              className={`px-3 py-2 rounded-xl flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer ${
                                isCurrent && isPlaying
                                  ? 'bg-emerald-500 text-stone-950 shadow-md'
                                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs'
                              }`}
                              title={isCurrent && isPlaying ? 'Pause' : 'Play real full song'}
                            >
                              {isResolving ? (
                                <>
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                  <span className="hidden sm:inline">Loading...</span>
                                </>
                              ) : isCurrent && isPlaying ? (
                                <>
                                  <Pause className="w-3.5 h-3.5 fill-current" />
                                  <span className="hidden sm:inline">Playing</span>
                                </>
                              ) : (
                                <>
                                  <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                                  <span className="hidden sm:inline">Play</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : hasSearched ? (
                <div className="py-16 text-center space-y-3">
                  <Music className="w-10 h-10 text-stone-600 mx-auto" />
                  <h4 className="text-base font-bold text-white">No songs found for "{searchQuery}"</h4>
                  <p className="text-xs text-stone-400 max-w-sm mx-auto">
                    Try checking the spelling or search for popular artists like Billie Eilish, Taylor Swift, Coldplay, or Lo-Fi.
                  </p>
                </div>
              ) : (
                <div className="py-12 text-center space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-950/60 border border-emerald-800/80 text-emerald-400 flex items-center justify-center mx-auto">
                    <Music className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-white">Type any song or artist above</h3>
                    <p className="text-xs text-stone-400 max-w-md mx-auto">
                      Search our instant catalog of over 100 million tracks. Listen while tracking your moods, breathing in the Calm Room, or writing in your journal.
                    </p>
                  </div>

                  <div className="pt-2 flex flex-wrap justify-center gap-2 max-w-lg mx-auto">
                    {['Taylor Swift', 'Lo-Fi Chillhop', 'Billie Eilish', 'Olivia Rodrigo', '432Hz Ambient', 'Coldplay'].map((genre) => (
                      <button
                        key={genre}
                        onClick={() => {
                          setSearchQuery(genre);
                          handlePerformSearch(genre);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-emerald-900 border border-stone-700 text-xs font-medium text-stone-200 hover:text-emerald-200 transition-colors cursor-pointer"
                      >
                        Explore {genre}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: CURATED TRACKS */}
          {activeTab === 'curated' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-linear-to-r from-emerald-950/60 to-teal-950/60 border border-emerald-800/50 flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                    Full-Length Sanctuary Soundscapes
                  </div>
                  <h4 className="text-sm sm:text-base font-bold text-white">
                    Bio-Acoustic Frequencies for Nervous System Regulation
                  </h4>
                  <p className="text-xs text-stone-300">
                    Hand-crafted 432Hz ambient drones, gentle piano chords, and soothing lo-fi beats designed to lower amygdala arousal.
                  </p>
                </div>
                <Sparkles className="w-8 h-8 text-emerald-400 shrink-0 hidden sm:block" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {CURATED_TRACKS.map((track) => {
                  const isCurrent = currentSong?.id === track.id;
                  return (
                    <div
                      key={track.id}
                      className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                        isCurrent
                          ? 'bg-emerald-950/50 border-emerald-500 shadow-md'
                          : 'bg-stone-800/40 hover:bg-stone-800 border-stone-800 hover:border-stone-700'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img 
                          src={track.artwork} 
                          alt={track.title} 
                          className="w-12 h-12 rounded-xl object-cover border border-stone-700 shrink-0" 
                        />
                        <div className="min-w-0">
                          <h4 className="text-xs sm:text-sm font-bold text-white truncate">
                            {track.title}
                          </h4>
                          <p className="text-[11px] text-stone-400 truncate">
                            {track.artist}
                          </p>
                          <span className="text-[10px] text-emerald-400 font-medium">
                            {track.genre} • {formatTime(track.duration)}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          if (isCurrent) {
                            onTogglePlay();
                          } else {
                            onPlaySong(track);
                          }
                        }}
                        className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                          isCurrent && isPlaying
                            ? 'bg-emerald-500 text-stone-950'
                            : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                        }`}
                      >
                        {isCurrent && isPlaying ? (
                          <Pause className="w-4 h-4 fill-current" />
                        ) : (
                          <Play className="w-4 h-4 fill-current ml-0.5" />
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: YOUTUBE FULL SONG PLAYER */}
          {activeTab === 'youtube' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-red-950/30 border border-red-900/60 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-red-400 uppercase tracking-wider">
                  <Youtube className="w-4 h-4" />
                  <span>Listen to Any Full Song on YouTube</span>
                </div>
                <p className="text-xs sm:text-sm text-stone-300">
                  Paste any YouTube song link, music video URL, or video ID to stream the complete uninterrupted song right here inside the website.
                </p>
              </div>

              {/* YouTube Link Input Form */}
              <form onSubmit={handlePlayYouTube} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-300">
                    YouTube URL or Video ID
                  </label>
                  <input
                    type="text"
                    value={youtubeInput}
                    onChange={(e) => {
                      setYoutubeInput(e.target.value);
                      if (youtubeError) setYoutubeError(null);
                    }}
                    placeholder="e.g. https://www.youtube.com/watch?v=jfKfPfyJRdk or jfKfPfyJRdk"
                    className="w-full px-4 py-2.5 rounded-xl bg-stone-800 border border-stone-700 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-500/50"
                  />
                  {youtubeError && (
                    <p className="text-xs text-rose-400 font-medium pt-1">
                      {youtubeError}
                    </p>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <input
                    type="text"
                    value={youtubeTitle}
                    onChange={(e) => setYoutubeTitle(e.target.value)}
                    placeholder="Optional song title (e.g. Lofi Girl Live Stream)"
                    className="w-full sm:flex-1 px-4 py-2.5 rounded-xl bg-stone-800 border border-stone-700 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-500/50"
                  />
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-md shrink-0"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>Play Full Video / Song</span>
                  </button>
                </div>
              </form>

              {/* Preset YouTube Chill Streams */}
              <div className="space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                  Popular Full-Length YouTube Stations
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {[
                    { title: 'Lofi Girl - beats to relax/study to', id: 'jfKfPfyJRdk', tag: '24/7 Lo-Fi Stream' },
                    { title: 'Gentle Rain on Window & Soft Piano', id: '5qap5aO4i9A', tag: 'Sleep & Anxiety Relief' },
                    { title: 'Peaceful Guitar & Nature Sounds', id: 'lTRiuFIWV54', tag: 'Acoustic Calm' }
                  ].map((stream) => (
                    <button
                      key={stream.id}
                      onClick={() => {
                        const ytSong: Song = {
                          id: `youtube-${stream.id}`,
                          title: stream.title,
                          artist: 'YouTube Calm Station',
                          artwork: `https://img.youtube.com/vi/${stream.id}/hqdefault.jpg`,
                          youtubeId: stream.id,
                          duration: 3600,
                          source: 'youtube',
                          genre: stream.tag
                        };
                        onAddCustomSong(ytSong);
                        onPlaySong(ytSong);
                        setActiveYoutubeId(stream.id);
                      }}
                      className="p-3 rounded-2xl bg-stone-800/60 hover:bg-stone-800 border border-stone-700/80 text-left space-y-1.5 transition-all cursor-pointer group"
                    >
                      <div className="relative aspect-video rounded-lg overflow-hidden bg-stone-900 border border-stone-700">
                        <img 
                          src={`https://img.youtube.com/vi/${stream.id}/mqdefault.jpg`} 
                          alt={stream.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                          <Play className="w-6 h-6 text-white fill-white" />
                        </div>
                      </div>
                      <div className="text-xs font-bold text-white truncate">{stream.title}</div>
                      <div className="text-[10px] text-red-400">{stream.tag}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Active Embedded YouTube Player (if any active) */}
              {(currentSong?.youtubeId || activeYoutubeId) && (
                <div className="mt-4 p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-2">
                  <div className="flex items-center justify-between text-xs text-stone-400">
                    <span className="font-semibold text-white">Active YouTube Stream:</span>
                    <span>Plays uninterrupted</span>
                  </div>
                  <div className="aspect-video w-full rounded-xl overflow-hidden shadow-lg border border-stone-800">
                    <iframe
                      src={`https://www.youtube.com/embed/${currentSong?.youtubeId || activeYoutubeId}?autoplay=1&enablejsapi=1`}
                      title="YouTube music player"
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: UPLOAD & CUSTOM STREAM */}
          {activeTab === 'custom' && (
            <div className="space-y-6">
              
              {/* Device Audio Upload */}
              <div className="p-6 rounded-2xl bg-stone-800/40 border-2 border-dashed border-stone-700 text-center space-y-3 hover:border-emerald-500/80 transition-colors">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="audio/*,.mp3,.wav,.m4a,.ogg,.aac"
                  className="hidden"
                />
                <div className="w-12 h-12 rounded-2xl bg-emerald-950/60 border border-emerald-800 text-emerald-400 flex items-center justify-center mx-auto">
                  <Upload className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white">Upload Any Audio / Song from Your Device</h4>
                  <p className="text-xs text-stone-400 max-w-sm mx-auto">
                    Select any MP3, WAV, M4A, or FLAC file from your computer or phone. Plays directly in your browser.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer inline-flex items-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Choose Audio File</span>
                </button>
              </div>

              {/* Direct Web Audio Stream URL */}
              <form onSubmit={handleAddCustomStream} className="p-5 rounded-2xl bg-stone-800/50 border border-stone-700/80 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
                  <Radio className="w-4 h-4" />
                  <span>Direct Web Stream / Radio URL</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-stone-300">Track / Station Name</label>
                    <input
                      type="text"
                      required
                      value={customTitle}
                      onChange={(e) => setCustomTitle(e.target.value)}
                      placeholder="e.g. Calm Lo-Fi Stream"
                      className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-stone-300">Artist / Creator</label>
                    <input
                      type="text"
                      value={customArtist}
                      onChange={(e) => setCustomArtist(e.target.value)}
                      placeholder="e.g. Internet Radio"
                      className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-stone-300">Direct Audio URL (MP3 / AAC / OGG)</label>
                  <input
                    type="url"
                    required
                    value={customStreamUrl}
                    onChange={(e) => setCustomStreamUrl(e.target.value)}
                    placeholder="https://example.com/audio-stream.mp3"
                    className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  />
                </div>

                <div className="pt-1 flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Play Stream</span>
                  </button>
                </div>
              </form>

              {/* Custom & Uploaded Songs History */}
              {customSongs.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                    Your Custom & Uploaded Tracks ({customSongs.length})
                  </span>
                  <div className="space-y-2">
                    {customSongs.map((song) => {
                      const isCurrent = currentSong?.id === song.id;
                      return (
                        <div
                          key={song.id}
                          className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                            isCurrent
                              ? 'bg-emerald-950/50 border-emerald-500'
                              : 'bg-stone-800/40 hover:bg-stone-800 border-stone-800'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <img 
                              src={song.artwork} 
                              alt={song.title} 
                              className="w-10 h-10 rounded-xl object-cover border border-stone-700 shrink-0" 
                            />
                            <div className="min-w-0">
                              <h5 className="text-xs font-bold text-white truncate">{song.title}</h5>
                              <p className="text-[11px] text-stone-400 truncate">{song.artist}</p>
                            </div>
                          </div>

                          <button
                            onClick={() => {
                              if (isCurrent) onTogglePlay();
                              else onPlaySong(song);
                            }}
                            className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                              isCurrent && isPlaying
                                ? 'bg-emerald-500 text-stone-950'
                                : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                            }`}
                          >
                            {isCurrent && isPlaying ? (
                              <Pause className="w-3.5 h-3.5 fill-current" />
                            ) : (
                              <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                            )}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

            </div>
          )}

        </div>

        {/* Modal Bottom Now Playing Footer */}
        {currentSong && (
          <div className="p-3 sm:p-4 bg-stone-950 border-t border-stone-800/90 flex items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <div className={`w-10 h-10 rounded-xl overflow-hidden border border-emerald-500/40 shrink-0 ${isPlaying ? 'animate-[spin_8s_linear_infinite]' : ''}`}>
                <img 
                  src={currentSong.artwork} 
                  alt={currentSong.title} 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                  Now Playing
                </div>
                <div className="text-xs sm:text-sm font-bold text-white truncate">
                  {currentSong.title}
                </div>
                <div className="text-[11px] text-stone-400 truncate">
                  {currentSong.artist}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onTogglePlay}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-3.5 h-3.5 fill-white" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
                    <span>Play</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
