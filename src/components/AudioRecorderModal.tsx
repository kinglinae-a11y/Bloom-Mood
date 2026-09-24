import { useState, useRef, useEffect } from 'react';
import { 
  Mic, 
  Square, 
  Sparkles, 
  Copy, 
  Check, 
  Trash2, 
  Save, 
  Volume2, 
  AlertCircle, 
  X,
  RefreshCw,
  FileText
} from 'lucide-react';
import { transcribeAudioBlob } from '../utils/audioTranscriptionService';
import { useAuth } from '../context/AuthContext';
import { syncVoiceNoteToFirestore } from '../utils/firestoreService';

interface AudioRecorderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTranscriptComplete?: (transcript: string) => void;
  initialContext?: string; // e.g. "Journal Entry", "Mood Reflection", "Voice Note"
}

export function AudioRecorderModal({
  isOpen,
  onClose,
  onTranscriptComplete,
  initialContext = 'Voice Reflection'
}: AudioRecorderModalProps) {
  const { user } = useAuth();
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingDuration, setRecordingDuration] = useState<number>(0);
  const [isTranscribing, setIsTranscribing] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [savedToCloud, setSavedToCloud] = useState<boolean>(false);
  const [audioVolumeLevel, setAudioVolumeLevel] = useState<number>(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<any>(null);
  const animationFrameRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Clean up when modal closes or unmounts
  useEffect(() => {
    if (!isOpen) {
      handleStopStream();
      setTranscript('');
      setErrorMsg(null);
      setRecordingDuration(0);
      setIsRecording(false);
      setIsTranscribing(false);
      setSavedToCloud(false);
    }
  }, [isOpen]);

  const handleStopStream = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    mediaRecorderRef.current = null;
    audioChunksRef.current = [];
  };

  const startRecording = async () => {
    setErrorMsg(null);
    setTranscript('');
    setSavedToCloud(false);
    audioChunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        } 
      });
      streamRef.current = stream;

      // Audio analysis for real-time visual meter
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        const audioCtx = new AudioCtx();
        audioContextRef.current = audioCtx;
        const source = audioCtx.createMediaStreamSource(stream);
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 256;
        source.connect(analyser);

        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        const checkVolume = () => {
          if (!isRecording && !streamRef.current) return;
          analyser.getByteFrequencyData(dataArray);
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i];
          }
          const average = sum / dataArray.length;
          setAudioVolumeLevel(Math.min(100, Math.round((average / 128) * 100)));
          animationFrameRef.current = requestAnimationFrame(checkVolume);
        };
        animationFrameRef.current = requestAnimationFrame(checkVolume);
      } catch (err) {
        console.warn('Audio visualization not supported in browser environment:', err);
      }

      // Determine supported mime type
      let mimeType = 'audio/webm';
      if (typeof MediaRecorder.isTypeSupported === 'function') {
        if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
          mimeType = 'audio/webm;codecs=opus';
        } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
          mimeType = 'audio/mp4';
        } else if (MediaRecorder.isTypeSupported('audio/ogg')) {
          mimeType = 'audio/ogg';
        }
      }

      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = async () => {
        const fullAudioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        handleStopStream();
        await processAudioTranscription(fullAudioBlob);
      };

      recorder.start(250); // collect 250ms chunks
      setIsRecording(true);
      setRecordingDuration(0);

      timerRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);

    } catch (err: any) {
      console.error('Microphone error:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setErrorMsg('Microphone access was denied. Please allow microphone permissions in your browser to transcribe audio.');
      } else {
        setErrorMsg('Unable to access your microphone. Please check your audio input settings.');
      }
      handleStopStream();
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const processAudioTranscription = async (blob: Blob) => {
    setIsTranscribing(true);
    setErrorMsg(null);
    try {
      const result = await transcribeAudioBlob(blob, recordingDuration);
      if (!result.transcript || result.transcript.trim() === '') {
        setErrorMsg('No speech was detected in the recording. Please speak clearly into the microphone and try again.');
      } else {
        setTranscript(result.transcript);
        // If user is authenticated, save voice note to Firestore
        if (user) {
          const noteId = `voice-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
          await syncVoiceNoteToFirestore(user.uid, {
            id: noteId,
            userId: user.uid,
            timestamp: Date.now(),
            title: `${initialContext} Voice Note`,
            transcript: result.transcript,
            durationSeconds: recordingDuration,
            category: initialContext,
            createdAt: new Date().toISOString()
          }).then(() => {
            setSavedToCloud(true);
          }).catch(err => {
            console.error('Failed to sync voice note:', err);
          });
        }
      }
    } catch (err: any) {
      console.error('Transcription error:', err);
      setErrorMsg(err.message || 'Audio transcription failed. Please try again.');
    } finally {
      setIsTranscribing(false);
    }
  };

  const handleCopy = () => {
    if (transcript) {
      navigator.clipboard.writeText(transcript);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleUseTranscript = () => {
    if (transcript && onTranscriptComplete) {
      onTranscriptComplete(transcript);
      onClose();
    }
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(remainder).padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border border-stone-200 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-xs">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-stone-900 text-lg flex items-center gap-2">
                Voice Transcription
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 font-mono">
                  Gemini 3.5 Transcribe
                </span>
              </h3>
              <p className="text-xs text-stone-500">
                Speak freely. Your microphone audio will be accurately transcribed into text.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="py-6 flex-1 overflow-y-auto space-y-6">

          {/* Recording & Input State Card */}
          <div className="flex flex-col items-center justify-center p-8 bg-stone-50 rounded-2xl border border-stone-200/80 text-center">
            
            {/* Pulsing Visualizer / State */}
            {isRecording ? (
              <div className="relative mb-6">
                {/* Visual pulsating aura responding to audio volume */}
                <div 
                  className="absolute inset-0 rounded-full bg-red-400/30 blur-md transition-all duration-75"
                  style={{
                    transform: `scale(${1 + audioVolumeLevel / 60})`,
                    opacity: 0.3 + audioVolumeLevel / 120
                  }}
                />
                <div className="relative w-24 h-24 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg animate-pulse">
                  <Mic className="w-10 h-10 animate-bounce" />
                </div>
              </div>
            ) : isTranscribing ? (
              <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-6 shadow-xs">
                <RefreshCw className="w-9 h-9 animate-spin" />
              </div>
            ) : transcript ? (
              <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center mb-4 shadow-md">
                <Check className="w-8 h-8" />
              </div>
            ) : (
              <div className="w-20 h-20 rounded-full bg-stone-200 text-stone-600 flex items-center justify-center mb-6 shadow-inner">
                <Mic className="w-9 h-9" />
              </div>
            )}

            {/* Status Text & Timer */}
            {isRecording && (
              <div className="space-y-1">
                <div className="flex items-center justify-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                  <span className="text-sm font-semibold text-red-600 uppercase tracking-wider">
                    Recording Audio...
                  </span>
                </div>
                <div className="text-3xl font-mono font-bold text-stone-900">
                  {formatTime(recordingDuration)}
                </div>
                <p className="text-xs text-stone-500 max-w-xs mt-1">
                  Speak naturally about your day, thoughts, or emotions. Click Stop when finished.
                </p>
              </div>
            )}

            {isTranscribing && (
              <div className="space-y-2">
                <div className="text-lg font-semibold text-stone-900 flex items-center justify-center gap-2">
                  <Sparkles className="w-5 h-5 text-emerald-600 animate-spin" />
                  Transcribing with Gemini 3.5...
                </div>
                <p className="text-xs text-stone-500 max-w-xs">
                  Converting your spoken voice into clean, punctuation-accurate text.
                </p>
              </div>
            )}

            {!isRecording && !isTranscribing && !transcript && (
              <div className="space-y-3">
                <div className="text-base font-semibold text-stone-800">
                  Ready to Record
                </div>
                <p className="text-xs text-stone-500 max-w-sm">
                  Click the button below to start talking. Microphone input will be transcribed into text using <span className="font-semibold text-stone-700">gemini-3.5-transcribe</span>.
                </p>
                <button
                  onClick={startRecording}
                  className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 mx-auto"
                >
                  <Mic className="w-4 h-4" />
                  Start Speaking
                </button>
              </div>
            )}

            {/* Recording Controls */}
            {isRecording && (
              <div className="flex items-center gap-3 mt-6">
                <button
                  onClick={stopRecording}
                  className="px-6 py-2.5 rounded-2xl bg-stone-900 hover:bg-black text-white font-medium text-sm shadow-md transition-all flex items-center gap-2"
                >
                  <Square className="w-4 h-4 fill-white" />
                  Stop & Transcribe
                </button>
                <button
                  onClick={() => {
                    handleStopStream();
                    setIsRecording(false);
                    setRecordingDuration(0);
                  }}
                  className="px-4 py-2.5 rounded-2xl bg-stone-200 hover:bg-stone-300 text-stone-700 font-medium text-xs transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* Error Notice */}
          {errorMsg && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 flex items-start gap-3 text-red-800 text-xs">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold">{errorMsg}</p>
                <button
                  onClick={startRecording}
                  className="mt-2 text-red-700 underline font-medium hover:text-red-900 block"
                >
                  Try again
                </button>
              </div>
            </div>
          )}

          {/* Transcription Results Card */}
          {transcript && (
            <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200/90 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-700" />
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-900">
                    Transcribed Text ({recordingDuration}s audio)
                  </span>
                </div>
                {savedToCloud && (
                  <span className="text-[11px] text-emerald-700 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full font-mono flex items-center gap-1">
                    <Check className="w-3 h-3" /> Saved to Firebase
                  </span>
                )}
              </div>

              {/* Editable transcript text area */}
              <div className="bg-white rounded-xl p-4 border border-emerald-100 shadow-inner">
                <p className="text-stone-800 text-sm leading-relaxed whitespace-pre-wrap font-sans selection:bg-emerald-200">
                  {transcript}
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="px-3 py-1.5 rounded-xl bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 text-xs font-medium flex items-center gap-1.5 transition-colors shadow-2xs"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        Copy Text
                      </>
                    )}
                  </button>

                  <button
                    onClick={startRecording}
                    className="px-3 py-1.5 rounded-xl bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 text-xs font-medium flex items-center gap-1.5 transition-colors shadow-2xs"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Record Another
                  </button>
                </div>

                {onTranscriptComplete && (
                  <button
                    onClick={handleUseTranscript}
                    className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Use in Journal
                  </button>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>AI Studio Speech-to-Text</span>
          </div>
          <span>Audio is processed securely</span>
        </div>

      </div>
    </div>
  );
}
