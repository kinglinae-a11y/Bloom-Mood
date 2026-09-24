/**
 * Service for recording audio from the microphone and sending it to 
 * the server-side /api/transcribe endpoint powered by gemini-3.5-transcribe.
 */

export interface TranscriptionResult {
  transcript: string;
  durationSeconds: number;
}

export async function transcribeAudioBlob(blob: Blob, durationSeconds: number): Promise<TranscriptionResult> {
  const mimeType = blob.type || 'audio/webm';
  const base64 = await blobToBase64(blob);

  const response = await fetch('/api/transcribe', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      audioBase64: base64,
      mimeType,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Transcription failed with status ${response.status}`);
  }

  const data = await response.json();
  return {
    transcript: data.transcript || '',
    durationSeconds,
  };
}

export function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      resolve(result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
