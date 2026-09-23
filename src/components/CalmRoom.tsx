import { useState, useEffect, useRef } from 'react';
import { Wind, Eye, Flame, RotateCcw, Volume2, VolumeX, Sparkles, Check, Play, Pause } from 'lucide-react';
import { ambientSound } from '../utils/audioSynthesis';

type CalmTool = 'breathing' | 'grounding' | 'vent' | 'sigh';

export function CalmRoom() {
  const [activeTool, setActiveTool] = useState<CalmTool>('breathing');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Box Breathing State
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold (Full)' | 'Exhale' | 'Hold (Empty)'>('Inhale');
  const [phaseSecondsLeft, setPhaseSecondsLeft] = useState(4);
  const [completedCycles, setCompletedCycles] = useState(0);

  // 5-4-3-2-1 Grounding State
  const [groundingInputs, setGroundingInputs] = useState({
    see: ['', '', '', '', ''],
    touch: ['', '', '', ''],
    hear: ['', '', ''],
    smell: ['', ''],
    appreciate: ['']
  });
  const [groundingComplete, setGroundingComplete] = useState(false);

  // Vent Pad State
  const [ventText, setVentText] = useState('');
  const [isIncinerating, setIsIncinerating] = useState(false);
  const [incineratedCount, setIncineratedCount] = useState(0);

  // Box Breathing Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isBreathingActive) {
      interval = setInterval(() => {
        setPhaseSecondsLeft((prev) => {
          if (prev <= 1) {
            // Transition phase
            setBreathPhase((currentPhase) => {
              if (currentPhase === 'Inhale') return 'Hold (Full)';
              if (currentPhase === 'Hold (Full)') return 'Exhale';
              if (currentPhase === 'Exhale') return 'Hold (Empty)';
              // Completed a full cycle
              setCompletedCycles((c) => c + 1);
              return 'Inhale';
            });
            return 4;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isBreathingActive]);

  const handleToggleSound = () => {
    const isNowPlaying = ambientSound.toggle('ambient');
    setIsPlayingAudio(isNowPlaying);
  };

  const handleIncinerate = () => {
    if (!ventText.trim()) return;
    setIsIncinerating(true);
    setTimeout(() => {
      setVentText('');
      setIsIncinerating(false);
      setIncineratedCount((c) => c + 1);
    }, 1800);
  };

  const checkGroundingFilled = () => {
    const s = groundingInputs.see.filter(Boolean).length >= 3;
    const t = groundingInputs.touch.filter(Boolean).length >= 2;
    const h = groundingInputs.hear.filter(Boolean).length >= 1;
    const sm = groundingInputs.smell.filter(Boolean).length >= 1;
    const ap = groundingInputs.appreciate[0].trim().length > 0;
    return s && t && h && sm && ap;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-800">
            <span>De-Escalation & Nervous System Reset</span>
          </div>
          <h1 className="font-display text-3xl font-bold text-stone-900 tracking-tight">
            The Calm Room
          </h1>
          <p className="text-xs sm:text-sm text-stone-500">
            Rapid biological tools to slow down panic, anger, and sensory overload in under 3 minutes.
          </p>
        </div>

        {/* Ambient sound trigger */}
        <button
          onClick={handleToggleSound}
          className={`px-4 py-2 rounded-xl text-xs font-medium border flex items-center gap-2 transition-colors cursor-pointer self-start sm:self-auto ${
            isPlayingAudio 
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
              : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
          }`}
        >
          {isPlayingAudio ? (
            <>
              <Volume2 className="w-4 h-4 animate-pulse" />
              <span>432Hz Calm Playing</span>
            </>
          ) : (
            <>
              <VolumeX className="w-4 h-4 text-stone-400" />
              <span>Turn On Ambient Audio</span>
            </>
          )}
        </button>
      </div>

      {/* Tool Selector Buttons */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-stone-200/70 rounded-2xl">
        <button
          onClick={() => setActiveTool('breathing')}
          className={`flex-1 min-w-[140px] px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTool === 'breathing'
              ? 'bg-white text-stone-900 shadow-sm'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Wind className="w-4 h-4 text-emerald-700" />
          <span>Box Breathing (4-4-4-4)</span>
        </button>

        <button
          onClick={() => setActiveTool('grounding')}
          className={`flex-1 min-w-[140px] px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTool === 'grounding'
              ? 'bg-white text-stone-900 shadow-sm'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Eye className="w-4 h-4 text-blue-700" />
          <span>5-4-3-2-1 Sensory Grounding</span>
        </button>

        <button
          onClick={() => setActiveTool('sigh')}
          className={`flex-1 min-w-[140px] px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTool === 'sigh'
              ? 'bg-white text-stone-900 shadow-sm'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-700" />
          <span>Physiological Sigh</span>
        </button>

        <button
          onClick={() => setActiveTool('vent')}
          className={`flex-1 min-w-[140px] px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTool === 'vent'
              ? 'bg-white text-stone-900 shadow-sm'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Flame className="w-4 h-4 text-rose-700" />
          <span>Burn-After-Writing Vent</span>
        </button>
      </div>

      {/* Tool 1: Box Breathing */}
      {activeTool === 'breathing' && (
        <div className="p-8 sm:p-12 bg-white rounded-3xl border border-stone-200 shadow-xs flex flex-col items-center text-center space-y-8">
          <div className="max-w-md space-y-2">
            <h2 className="font-display text-2xl font-bold text-stone-900">
              Box Breathing Pacer
            </h2>
            <p className="text-xs sm:text-sm text-stone-500">
              Used by Navy SEALs and athletes. Equal 4-second intervals trick your autonomic nervous system into knowing you are not running from danger.
            </p>
          </div>

          {/* Animated Visual Pacer Circle */}
          <div className="relative w-64 h-64 flex items-center justify-center">
            {/* Background ring */}
            <div className="absolute inset-0 rounded-full border-4 border-stone-100" />

            {/* Dynamic pulsating circle */}
            <div
              className={`rounded-full transition-all ease-in-out flex items-center justify-center duration-1000 ${
                !isBreathingActive 
                  ? 'w-36 h-36 bg-stone-100 border-2 border-stone-300' 
                  : breathPhase === 'Inhale'
                    ? 'w-56 h-56 bg-emerald-100/80 border-4 border-emerald-500 shadow-lg shadow-emerald-500/20'
                    : breathPhase === 'Hold (Full)'
                      ? 'w-56 h-56 bg-teal-100/90 border-4 border-teal-500'
                      : breathPhase === 'Exhale'
                        ? 'w-32 h-32 bg-stone-200 border-4 border-stone-400'
                        : 'w-32 h-32 bg-stone-100 border-4 border-stone-300'
              }`}
            >
              <div className="space-y-1">
                <span className="block text-xs uppercase tracking-wider font-semibold text-stone-600">
                  {isBreathingActive ? breathPhase : 'Ready'}
                </span>
                <span className="block font-display text-3xl font-bold font-mono text-stone-900 tabular-nums">
                  {isBreathingActive ? phaseSecondsLeft : '4s'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-3">
            <button
              onClick={() => {
                setIsBreathingActive(!isBreathingActive);
                setBreathPhase('Inhale');
                setPhaseSecondsLeft(4);
              }}
              className={`px-8 py-3 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all cursor-pointer ${
                isBreathingActive
                  ? 'bg-stone-800 text-stone-100 hover:bg-stone-900'
                  : 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-md shadow-emerald-600/20'
              }`}
            >
              {isBreathingActive ? (
                <>
                  <Pause className="w-4 h-4" />
                  <span>Pause Breathing Exercise</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>Start 4-4-4-4 Cycle</span>
                </>
              )}
            </button>

            <div className="text-xs text-stone-500 font-mono">
              Cycles completed: <span className="font-bold text-stone-900 tabular-nums">{completedCycles}</span>
            </div>
          </div>
        </div>
      )}

      {/* Tool 2: 5-4-3-2-1 Sensory Grounding */}
      {activeTool === 'grounding' && (
        <div className="p-6 sm:p-8 bg-white rounded-3xl border border-stone-200 shadow-xs space-y-6">
          <div className="space-y-1">
            <h2 className="font-display text-2xl font-bold text-stone-900">
              5-4-3-2-1 Sensory Grounding
            </h2>
            <p className="text-xs sm:text-sm text-stone-500">
              When panic pulls your mind into future catastrophes, grounding reconnects your brain to the physical room you are sitting in right now.
            </p>
          </div>

          <div className="space-y-6">
            {/* 5 Things You See */}
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2.5">
              <label className="text-xs font-bold text-stone-800 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-xs font-mono font-bold">5</span>
                <span>Things you can SEE right now (look for colors, shapes, light reflections):</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {groundingInputs.see.map((val, idx) => (
                  <input
                    key={idx}
                    type="text"
                    placeholder={`e.g. A blue water bottle, shadow on the wall...`}
                    value={val}
                    onChange={(e) => {
                      const next = [...groundingInputs.see];
                      next[idx] = e.target.value;
                      setGroundingInputs({ ...groundingInputs, see: next });
                    }}
                    className="p-2 text-xs rounded-lg border border-stone-200 bg-white text-stone-800 focus:border-blue-500"
                  />
                ))}
              </div>
            </div>

            {/* 4 Things You Touch */}
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2.5">
              <label className="text-xs font-bold text-stone-800 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-mono font-bold">4</span>
                <span>Things you can physically TOUCH or FEEL (your clothes, chair, hair, cold desk):</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {groundingInputs.touch.map((val, idx) => (
                  <input
                    key={idx}
                    type="text"
                    placeholder={`e.g. Cotton of my hoodie, cool wooden desk...`}
                    value={val}
                    onChange={(e) => {
                      const next = [...groundingInputs.touch];
                      next[idx] = e.target.value;
                      setGroundingInputs({ ...groundingInputs, touch: next });
                    }}
                    className="p-2 text-xs rounded-lg border border-stone-200 bg-white text-stone-800 focus:border-emerald-500"
                  />
                ))}
              </div>
            </div>

            {/* 3 Things You Hear */}
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2.5">
              <label className="text-xs font-bold text-stone-800 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-xs font-mono font-bold">3</span>
                <span>Sounds you can HEAR (AC humming, cars outside, distant footsteps, clock ticking):</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {groundingInputs.hear.map((val, idx) => (
                  <input
                    key={idx}
                    type="text"
                    placeholder={`e.g. Refrigerator hum...`}
                    value={val}
                    onChange={(e) => {
                      const next = [...groundingInputs.hear];
                      next[idx] = e.target.value;
                      setGroundingInputs({ ...groundingInputs, hear: next });
                    }}
                    className="p-2 text-xs rounded-lg border border-stone-200 bg-white text-stone-800 focus:border-amber-500"
                  />
                ))}
              </div>
            </div>

            {/* 2 Things You Smell */}
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2.5">
              <label className="text-xs font-bold text-stone-800 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center text-xs font-mono font-bold">2</span>
                <span>Scents you can SMELL (fresh air, laundry detergent, coffee, or soap on hands):</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {groundingInputs.smell.map((val, idx) => (
                  <input
                    key={idx}
                    type="text"
                    placeholder={`e.g. Scent of laundry detergent...`}
                    value={val}
                    onChange={(e) => {
                      const next = [...groundingInputs.smell];
                      next[idx] = e.target.value;
                      setGroundingInputs({ ...groundingInputs, smell: next });
                    }}
                    className="p-2 text-xs rounded-lg border border-stone-200 bg-white text-stone-800 focus:border-purple-500"
                  />
                ))}
              </div>
            </div>

            {/* 1 Thing You Appreciate */}
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2.5">
              <label className="text-xs font-bold text-stone-800 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-800 flex items-center justify-center text-xs font-mono font-bold">1</span>
                <span>One thing you love, appreciate, or are gentle with about yourself:</span>
              </label>
              <input
                type="text"
                placeholder={`e.g. I am trying my best even when it's hard; I make my friends laugh...`}
                value={groundingInputs.appreciate[0]}
                onChange={(e) => {
                  setGroundingInputs({ ...groundingInputs, appreciate: [e.target.value] });
                }}
                className="w-full p-2 text-xs rounded-lg border border-stone-200 bg-white text-stone-800 focus:border-rose-500"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <button
              onClick={() => {
                setGroundingInputs({
                  see: ['', '', '', '', ''],
                  touch: ['', '', '', ''],
                  hear: ['', '', ''],
                  smell: ['', ''],
                  appreciate: ['']
                });
                setGroundingComplete(false);
              }}
              className="text-xs text-stone-500 hover:text-stone-800 flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear & Restart</span>
            </button>

            <button
              onClick={() => setGroundingComplete(true)}
              className="px-5 py-2.5 rounded-xl bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 transition-colors cursor-pointer"
            >
              Complete Grounding
            </button>
          </div>

          {groundingComplete && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <Check className="w-5 h-5" />
              </span>
              <div>
                <h4 className="text-xs font-bold">You are grounded and safe.</h4>
                <p className="text-[11px] text-emerald-800">
                  Notice your feet on the ground. Your brain has returned from imaginary disasters back to the physical present.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tool 3: Physiological Sigh Guide */}
      {activeTool === 'sigh' && (
        <div className="p-8 sm:p-10 bg-white rounded-3xl border border-stone-200 shadow-xs space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-semibold text-amber-800 uppercase tracking-wider">
              Stanford Neurobiology Technique
            </span>
            <h2 className="font-display text-2xl font-bold text-stone-900">
              The Physiological Sigh (The Fastest Biological Reset)
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-2xl">
              Studied extensively by Dr. Andrew Huberman at Stanford University. When you are stressed, tiny air sacs in your lungs (alveoli) collapse, raising carbon dioxide. Two quick inhales through the nose reinflates them, and a long mouth exhale instantly triggers the vagus nerve to slow your heartbeat.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2">
              <span className="text-xs font-mono font-bold text-amber-800">Step 1</span>
              <h3 className="text-sm font-bold text-stone-900">Deep Inhale Through Nose</h3>
              <p className="text-xs text-stone-600">
                Breathe in deeply through your nose, filling about 80% of your lung capacity.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2">
              <span className="text-xs font-mono font-bold text-amber-800">Step 2</span>
              <h3 className="text-sm font-bold text-stone-900">Sharp Second Sniff</h3>
              <p className="text-xs text-stone-600">
                Without exhaling, take a quick, sharp second sniff of air right on top of the first. This pops collapsed alveoli open.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2">
              <span className="text-xs font-mono font-bold text-amber-800">Step 3</span>
              <h3 className="text-sm font-bold text-stone-900">Long, Slow Mouth Exhale</h3>
              <p className="text-xs text-stone-600">
                Slowly empty your lungs through softly parted lips for 6 to 8 seconds until empty.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/70 text-amber-950 text-xs leading-relaxed">
            <span className="font-bold">Try it right now:</span> Repeat this sequence just 2 or 3 times. Notice the physical drop in shoulder tension and the sudden slowing of your pulse.
          </div>
        </div>
      )}

      {/* Tool 4: Burn-After-Writing Vent Pad */}
      {activeTool === 'vent' && (
        <div className="p-6 sm:p-8 bg-stone-900 text-stone-100 rounded-3xl border border-stone-800 shadow-xl space-y-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-rose-400">
              <Flame className="w-4 h-4 text-rose-500" />
              <span>Zero-Storage Rage / Vent Safe Zone</span>
            </div>
            <h2 className="font-display text-2xl font-bold text-white">
              Burn After Writing
            </h2>
            <p className="text-xs sm:text-sm text-stone-400 max-w-xl">
              Type your most raw, unfiltered feelings, frustration, resentment, or embarrassing fears. Nobody will ever read this. When you are ready, incinerate it into virtual ash.
            </p>
          </div>

          <div className="relative">
            <textarea
              value={ventText}
              onChange={(e) => setVentText(e.target.value)}
              placeholder="Dump whatever you need to say... 'I am furious at my teacher because...', 'I feel completely invisible...', 'I hate how everything feels right now...'"
              rows={7}
              disabled={isIncinerating}
              className={`w-full p-4 rounded-2xl bg-stone-800/80 border border-stone-700 text-stone-100 text-sm focus:outline-none focus:border-rose-500 transition-all resize-none ${
                isIncinerating ? 'opacity-20 scale-95 blur-xs text-rose-400' : ''
              }`}
            />
            {isIncinerating && (
              <div className="absolute inset-0 flex items-center justify-center bg-stone-900/80 backdrop-blur-xs rounded-2xl">
                <div className="text-center space-y-2 animate-pulse">
                  <Flame className="w-12 h-12 text-rose-500 mx-auto animate-bounce" />
                  <span className="text-sm font-display font-bold text-rose-300">
                    Incinerating and dissolving into nothingness...
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] text-stone-400">
              {incineratedCount > 0 ? `${incineratedCount} emotional thoughts burned and discarded.` : 'Nothing is saved to any database or local storage.'}
            </span>

            <button
              onClick={handleIncinerate}
              disabled={!ventText.trim() || isIncinerating}
              className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-rose-900/30"
            >
              <Flame className="w-4 h-4" />
              <span>Burn & Dissolve Thoughts</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
