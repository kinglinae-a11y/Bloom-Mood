import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  Unsubscribe 
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { MoodLogEntry } from '../types';

export interface FirestoreJournalEntry {
  id: string;
  userId: string;
  timestamp: number;
  promptQuestion?: string;
  content: string;
  tags?: string[];
  isAudioTranscribed?: boolean;
  audioDurationSeconds?: number;
  createdAt?: string;
}

export interface FirestoreVoiceNote {
  id: string;
  userId: string;
  timestamp: number;
  title: string;
  transcript: string;
  durationSeconds?: number;
  category?: string;
  createdAt?: string;
}

// ---------------- MOOD ENTRIES ----------------

export async function syncMoodEntryToFirestore(userId: string, entry: MoodLogEntry): Promise<void> {
  const path = `users/${userId}/moodEntries/${entry.id}`;
  try {
    const docRef = doc(db, 'users', userId, 'moodEntries', entry.id);
    await setDoc(docRef, {
      id: entry.id,
      userId,
      timestamp: entry.timestamp,
      emotionId: entry.emotionId,
      emotionName: entry.emotionName,
      category: entry.category,
      intensity: entry.intensity,
      bodyLocations: entry.bodyLocations || [],
      triggers: entry.triggers || [],
      notes: entry.notes || '',
      createdAt: new Date(entry.timestamp).toISOString()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function removeMoodEntryFromFirestore(userId: string, entryId: string): Promise<void> {
  const path = `users/${userId}/moodEntries/${entryId}`;
  try {
    const docRef = doc(db, 'users', userId, 'moodEntries', entryId);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export function subscribeUserMoodEntries(
  userId: string, 
  onData: (entries: MoodLogEntry[]) => void
): Unsubscribe {
  const path = `users/${userId}/moodEntries`;
  try {
    const colRef = collection(db, 'users', userId, 'moodEntries');
    const q = query(colRef, orderBy('timestamp', 'desc'));
    return onSnapshot(
      q,
      (snapshot) => {
        const entries: MoodLogEntry[] = [];
        snapshot.forEach((docSnap) => {
          entries.push(docSnap.data() as MoodLogEntry);
        });
        onData(entries);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, path);
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return () => {};
  }
}

// ---------------- JOURNAL ENTRIES ----------------

export async function syncJournalEntryToFirestore(userId: string, entry: FirestoreJournalEntry): Promise<void> {
  const path = `users/${userId}/journalEntries/${entry.id}`;
  try {
    const docRef = doc(db, 'users', userId, 'journalEntries', entry.id);
    await setDoc(docRef, {
      id: entry.id,
      userId,
      timestamp: entry.timestamp,
      promptQuestion: entry.promptQuestion || '',
      content: entry.content,
      tags: entry.tags || [],
      isAudioTranscribed: entry.isAudioTranscribed || false,
      audioDurationSeconds: entry.audioDurationSeconds || 0,
      createdAt: entry.createdAt || new Date(entry.timestamp).toISOString()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function removeJournalEntryFromFirestore(userId: string, entryId: string): Promise<void> {
  const path = `users/${userId}/journalEntries/${entryId}`;
  try {
    const docRef = doc(db, 'users', userId, 'journalEntries', entryId);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export function subscribeUserJournalEntries(
  userId: string,
  onData: (entries: FirestoreJournalEntry[]) => void
): Unsubscribe {
  const path = `users/${userId}/journalEntries`;
  try {
    const colRef = collection(db, 'users', userId, 'journalEntries');
    const q = query(colRef, orderBy('timestamp', 'desc'));
    return onSnapshot(
      q,
      (snapshot) => {
        const entries: FirestoreJournalEntry[] = [];
        snapshot.forEach((docSnap) => {
          entries.push(docSnap.data() as FirestoreJournalEntry);
        });
        onData(entries);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, path);
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return () => {};
  }
}

// ---------------- VOICE NOTES ----------------

export async function syncVoiceNoteToFirestore(userId: string, note: FirestoreVoiceNote): Promise<void> {
  const path = `users/${userId}/voiceNotes/${note.id}`;
  try {
    const docRef = doc(db, 'users', userId, 'voiceNotes', note.id);
    await setDoc(docRef, {
      id: note.id,
      userId,
      timestamp: note.timestamp,
      title: note.title,
      transcript: note.transcript,
      durationSeconds: note.durationSeconds || 0,
      category: note.category || 'General',
      createdAt: note.createdAt || new Date(note.timestamp).toISOString()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function removeVoiceNoteFromFirestore(userId: string, noteId: string): Promise<void> {
  const path = `users/${userId}/voiceNotes/${noteId}`;
  try {
    const docRef = doc(db, 'users', userId, 'voiceNotes', noteId);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export function subscribeUserVoiceNotes(
  userId: string,
  onData: (notes: FirestoreVoiceNote[]) => void
): Unsubscribe {
  const path = `users/${userId}/voiceNotes`;
  try {
    const colRef = collection(db, 'users', userId, 'voiceNotes');
    const q = query(colRef, orderBy('timestamp', 'desc'));
    return onSnapshot(
      q,
      (snapshot) => {
        const notes: FirestoreVoiceNote[] = [];
        snapshot.forEach((docSnap) => {
          notes.push(docSnap.data() as FirestoreVoiceNote);
        });
        onData(notes);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, path);
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return () => {};
  }
}
