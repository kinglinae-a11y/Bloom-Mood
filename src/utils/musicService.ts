import { Song } from '../types';

export interface ItunesRawResult {
  trackId: number;
  trackName: string;
  artistName: string;
  collectionName?: string;
  artworkUrl100?: string;
  previewUrl?: string;
  trackTimeMillis?: number;
  primaryGenreName?: string;
  releaseDate?: string;
}

// Curated royalty-free calming & focus music tracks (full audio streaming)
export const CURATED_TRACKS: Song[] = [
  {
    id: 'curated-lofi-sanctuary',
    title: 'Rainy Night In Tokyo (Lo-Fi)',
    artist: 'Sanctuary Beats & Chillhop',
    album: 'Midnight Study Sessions',
    artwork: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=600&q=80',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3',
    duration: 147,
    genre: 'Lo-Fi / Chillhop',
    source: 'curated',
    isFullLength: true
  },
  {
    id: 'curated-theta-waves',
    title: '432Hz Deep Theta Healing',
    artist: 'Neuro-Acoustic Lab',
    album: 'Somatic Frequency Vol. 1',
    artwork: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3?filename=meditation-impromptu-01-109038.mp3',
    duration: 198,
    genre: 'Ambient / Solfeggio',
    source: 'curated',
    isFullLength: true
  },
  {
    id: 'curated-piano-peace',
    title: 'Warm Sunlight on the Piano',
    artist: 'Serenity Strings',
    album: 'Quiet Horizons',
    artwork: 'https://images.unsplash.com/photo-1520523839898-507121c00dfa?auto=format&fit=crop&w=600&q=80',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/11/06/audio_c97b830d17.mp3?filename=sad-soul-chasing-a-feeling-125759.mp3',
    duration: 165,
    genre: 'Modern Classical',
    source: 'curated',
    isFullLength: true
  },
  {
    id: 'curated-cozy-bedroom',
    title: 'Coffee & Late Homework',
    artist: 'Pastel Dreamers',
    album: 'Dorm Room Nostalgia',
    artwork: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=spirit-blossom-15285.mp3',
    duration: 172,
    genre: 'Acoustic / Indie',
    source: 'curated',
    isFullLength: true
  },
  {
    id: 'curated-stargazing',
    title: 'Floating Through the Nebula',
    artist: 'Cosmic Drift',
    album: 'Deep Sleep Waves',
    artwork: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=600&q=80',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2021/09/06/audio_824578b80b.mp3?filename=ambient-piano-amp-strings-10711.mp3',
    duration: 215,
    genre: 'Deep Ambient',
    source: 'curated',
    isFullLength: true
  },
  {
    id: 'curated-ocean-acoustic',
    title: 'Breathe In, Breathe Out',
    artist: 'Kindred Waves',
    album: 'Vagus Nerve Resets',
    artwork: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939f792cb.mp3?filename=relaxing-light-piano-123491.mp3',
    duration: 142,
    genre: 'Mindfulness',
    source: 'curated',
    isFullLength: true
  }
];

export const POPULAR_SEARCH_SUGGESTIONS = [
  'Taylor Swift',
  'Billie Eilish',
  'Olivia Rodrigo',
  'Coldplay',
  'Lo-Fi Girl',
  'Frank Ocean',
  'SZA',
  'Phoebe Bridgers',
  'Mac Miller',
  'Boygenius',
  'Clairo',
  'Chappell Roan',
  'Laufey',
  'Mitski',
  'Ghibli Lofi',
  'Beethoven Moonlight Sonata',
  'Chopin Nocturne'
];

// Reliable distributed Invidious public mirror instances
const INVIDIOUS_INSTANCES = [
  'https://invidious.f5.si',
  'https://inv.nadeko.net',
  'https://vid.priv.au',
  'https://invidious.nerdvpn.de',
  'https://yewtu.be'
];

/**
 * Searches for full-length songs with their exact recorded duration from YouTube.
 * Plays the real entire song from 0:00 to the end of recorded time.
 */
export async function searchFullSong(query: string): Promise<Song[]> {
  const cleanQuery = query.trim();
  if (!cleanQuery) return [];

  // Try mirrors with short timeout
  for (const instance of INVIDIOUS_INSTANCES) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4500);

      const url = `${instance}/api/v1/search?q=${encodeURIComponent(cleanQuery + ' audio')}&type=video`;
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (!res.ok) continue;

      const items = await res.json();
      if (!Array.isArray(items) || items.length === 0) continue;

      const validSongs: Song[] = items
        .filter((item: any) => item.type === 'video' && item.videoId && typeof item.lengthSeconds === 'number' && item.lengthSeconds > 20)
        .slice(0, 20)
        .map((item: any) => {
          // Parse title and artist cleanly
          let title = item.title || 'Unknown Title';
          let artist = item.author || 'Artist';

          // Split "Artist - Title" patterns
          if (title.includes(' - ')) {
            const parts = title.split(' - ');
            if (parts.length >= 2) {
              artist = parts[0].trim();
              title = parts.slice(1).join(' - ').trim();
            }
          }

          // Strip common YouTube fluff
          title = title
            .replace(/\s*[\(\[]\s*(official\s*(music\s*)?video|official\s*audio|lyrics?|visualizer|hq|hd|audio|remastered?)\s*[\)\]]/gi, '')
            .trim();

          const durationSeconds = Math.max(30, Math.round(item.lengthSeconds));

          return {
            id: `yt-${item.videoId}`,
            title,
            artist,
            album: 'Full Track Release',
            artwork: `https://img.youtube.com/vi/${item.videoId}/hqdefault.jpg`,
            youtubeId: item.videoId,
            duration: durationSeconds,
            genre: 'Full Song',
            source: 'youtube',
            isFullLength: true,
            viewCount: item.viewCountText || (item.viewCount ? `${(item.viewCount / 1000000).toFixed(1)}M views` : undefined),
            channelTitle: item.author
          } as Song;
        });

      if (validSongs.length > 0) {
        return validSongs;
      }
    } catch (e) {
      // Try next instance
      continue;
    }
  }

  // Fallback: If instances timed out, return iTunes results with real recorded duration tags
  return searchAnySong(cleanQuery);
}

/**
 * Automatically finds the matching full recorded YouTube video for any song title & artist.
 */
export async function resolveFullSongYouTubeId(title: string, artist: string): Promise<{ videoId: string; duration: number } | null> {
  const searchQuery = `${artist} ${title} audio`.trim();
  for (const instance of INVIDIOUS_INSTANCES) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      const url = `${instance}/api/v1/search?q=${encodeURIComponent(searchQuery)}&type=video`;
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (!res.ok) continue;

      const items = await res.json();
      if (!Array.isArray(items) || items.length === 0) continue;

      const match = items.find((item: any) => item.type === 'video' && item.videoId && item.lengthSeconds > 25);
      if (match) {
        return {
          videoId: match.videoId,
          duration: Math.round(match.lengthSeconds)
        };
      }
    } catch {
      continue;
    }
  }

  return null;
}

/**
 * Search the public global iTunes music catalogue of over 100 million songs.
 * Returns songs with high-res artwork, title, artist, and full recorded duration metadata.
 */
export async function searchAnySong(query: string): Promise<Song[]> {
  const cleanQuery = query.trim();
  if (!cleanQuery) return [];

  try {
    const url = `https://itunes.apple.com/search?term=${encodeURIComponent(cleanQuery)}&entity=song&limit=30`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`iTunes search error: ${response.status}`);
    }
    const data = await response.json();
    if (!data.results || !Array.isArray(data.results)) {
      return [];
    }

    return data.results
      .filter((item: ItunesRawResult) => Boolean(item.trackName))
      .map((item: ItunesRawResult) => {
        // Upgrade 100x100 artwork to crisp 600x600
        const artwork = item.artworkUrl100
          ? item.artworkUrl100.replace('100x100bb', '600x600bb')
          : 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80';

        const recordedSeconds = item.trackTimeMillis ? Math.round(item.trackTimeMillis / 1000) : 180;

        return {
          id: `itunes-${item.trackId}`,
          title: item.trackName,
          artist: item.artistName || 'Unknown Artist',
          album: item.collectionName || 'Single',
          artwork,
          audioUrl: item.previewUrl,
          duration: recordedSeconds,
          genre: item.primaryGenreName || 'Music',
          releaseYear: item.releaseDate ? item.releaseDate.substring(0, 4) : undefined,
          source: 'search',
          isFullLength: false
        } as Song;
      });
  } catch (error) {
    console.error('Failed to search songs:', error);
    return [];
  }
}

/**
 * Extracts a YouTube Video ID from any standard URL or ID string.
 */
export function extractYouTubeId(input: string): string | null {
  if (!input) return null;
  const trimmed = input.trim();

  // If already an 11-char ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  // Handle standard youtube.com, youtu.be, music.youtube.com
  const match = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  if (match && match[1]) {
    return match[1];
  }

  return null;
}

/**
 * Formats seconds into "M:SS" string.
 */
export function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}
