import { useState } from 'react';
import { COGNITIVE_DISTORTIONS } from '../data/adolescenceContent';
import { CognitiveDistortion } from '../types';
import { Sparkles, ArrowRight, RotateCcw, Check, HelpCircle } from 'lucide-react';

interface SavedReframe {
  id: string;
  hotThought: string;
  trap: string;
  reframe: string;
  date: string;
}

export function ThoughtUntangler() {
  const [selectedTrap, setSelectedTrap] = useState<CognitiveDistortion>(COGNITIVE_DISTORTIONS[0]);
  const [hotThought, setHotThought] = useState('');
  const [challengeAnswer, setChallengeAnswer] = useState('');
  const [balancedThought, setBalancedThought] = useState('');
  const [savedReframes, setSavedReframes] = useState<SavedReframe[]>(() => {
    try {
      const stored = localStorage.getItem('sanctuary_reframes');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const loadExample = (dist: CognitiveDistortion) => {
    setSelectedTrap(dist);
    setHotThought(dist.teenExample.replace(/[“”]/g, ''));
    setChallengeAnswer('');
    setBalancedThought(dist.replacementExample.replace(/[“”]/g, ''));
  };

  const handleSaveReframe = () => {
    if (!hotThought.trim() || !balancedThought.trim()) return;
    const newReframe: SavedReframe = {
      id: `reframe-${Date.now()}`,
      hotThought: hotThought.trim(),
      trap: selectedTrap.name,
      reframe: balancedThought.trim(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    };
    const updated = [newReframe, ...savedReframes];
    setSavedReframes(updated);
    try {
      localStorage.setItem('sanctuary_reframes', JSON.stringify(updated));
    } catch {}
    // Reset inputs
    setHotThought('');
    setChallengeAnswer('');
    setBalancedThought('');
  };

  const deleteReframe = (id: string) => {
    const updated = savedReframes.filter(r => r.id !== id);
    setSavedReframes(updated);
    try {
      localStorage.setItem('sanctuary_reframes', JSON.stringify(updated));
    } catch {}
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      
      {/* Header */}
      <div className="border-b border-stone-200 pb-5 space-y-1">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-800">
          <span>Cognitive Behavioral Reframing (CBT)</span>
        </div>
        <h1 className="font-display text-3xl font-bold text-stone-900 tracking-tight">
          Thought Untangler
        </h1>
        <p className="text-xs sm:text-sm text-stone-500">
          Your thoughts are hypotheses, not absolute facts. Catch cognitive traps and re-write them with calm clarity.
        </p>
      </div>

      {/* Traps Library */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-stone-900">
            Common Teen Brain Traps
          </h2>
          <span className="text-xs text-stone-500">Click to inspect or test</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {COGNITIVE_DISTORTIONS.map((trap) => {
            const isSelected = selectedTrap.id === trap.id;
            return (
              <button
                key={trap.id}
                onClick={() => setSelectedTrap(trap)}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  isSelected 
                    ? 'border-emerald-600 bg-emerald-50/60 shadow-xs ring-1 ring-emerald-600/30' 
                    : 'border-stone-200 bg-white hover:border-stone-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-display text-sm font-bold text-stone-900">{trap.name}</h3>
                  <span className="text-[11px] text-stone-400 font-mono">Trap</span>
                </div>
                <p className="text-xs text-stone-600 mb-2 leading-relaxed">
                  {trap.description}
                </p>
                <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                  <span className="text-[11px] text-stone-400 italic truncate max-w-[200px]">
                    {trap.teenExample}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      loadExample(trap);
                    }}
                    className="text-[11px] font-semibold text-emerald-800 hover:text-emerald-950 cursor-pointer"
                  >
                    Load Example
                  </button>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Untangling Workspace */}
      <div className="p-6 sm:p-8 bg-white rounded-3xl border border-stone-200 shadow-xs space-y-6">
        <h3 className="font-display text-xl font-bold text-stone-900 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-emerald-600" />
          <span>Interactive Untangler</span>
        </h3>

        {/* Step 1: Hot Thought */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-stone-800 flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-800 flex items-center justify-center text-xs font-mono font-bold">1</span>
            <span>The Raw "Hot Thought" (The anxious, angry, or catastrophic sentence in your head):</span>
          </label>
          <input
            type="text"
            value={hotThought}
            onChange={(e) => setHotThought(e.target.value)}
            placeholder="e.g. 'I didn't get invited to the hangout, so nobody in that group genuinely likes me.'"
            className="w-full p-3 rounded-xl border border-stone-200 text-xs sm:text-sm text-stone-900 focus:border-emerald-600 bg-stone-50/50"
          />
        </div>

        {/* Step 2: Trap Selected */}
        <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-xs font-mono font-bold">2</span>
            <span className="text-xs font-bold text-stone-900">Active Trap Identified:</span>
            <span className="text-xs text-emerald-800 font-semibold">{selectedTrap.name}</span>
          </div>
          <span className="text-xs text-stone-500">{selectedTrap.description}</span>
        </div>

        {/* Step 3: Challenge Question */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-stone-800 flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-xs font-mono font-bold">3</span>
            <span>Challenge Prompt: <span className="font-normal text-stone-600">{selectedTrap.challengeQuestion}</span></span>
          </label>
          <input
            type="text"
            value={challengeAnswer}
            onChange={(e) => setChallengeAnswer(e.target.value)}
            placeholder="e.g. They might only have had space in one car, or maybe it was just a quick neighborhood meetup..."
            className="w-full p-3 rounded-xl border border-stone-200 text-xs sm:text-sm text-stone-900 focus:border-blue-500 bg-stone-50/50"
          />
        </div>

        {/* Step 4: The Balanced Reframe */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-stone-800 flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-mono font-bold">4</span>
            <span>Balanced, Realistic Reframe:</span>
          </label>
          <textarea
            value={balancedThought}
            onChange={(e) => setBalancedThought(e.target.value)}
            placeholder="e.g. 'It stings to see plans without me, but one night doesn't define my friendships or my worth. I will reach out to Jordan tomorrow.'"
            rows={3}
            className="w-full p-3 rounded-xl border border-stone-200 text-xs sm:text-sm text-stone-900 focus:border-emerald-600 bg-stone-50/50 resize-none"
          />
        </div>

        <div className="pt-2 flex items-center justify-between">
          <button
            onClick={() => {
              setHotThought('');
              setChallengeAnswer('');
              setBalancedThought('');
            }}
            className="text-xs text-stone-500 hover:text-stone-800 flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Fields</span>
          </button>

          <button
            onClick={handleSaveReframe}
            disabled={!hotThought.trim() || !balancedThought.trim()}
            className="px-5 py-2.5 rounded-xl bg-stone-900 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-stone-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Save Balanced Reframe</span>
          </button>
        </div>
      </div>

      {/* Saved Reframes List */}
      {savedReframes.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-display text-lg font-bold text-stone-900">
            Your Untangled Thoughts Collection ({savedReframes.length})
          </h3>
          <div className="space-y-3">
            {savedReframes.map((item) => (
              <div key={item.id} className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-xs text-stone-500">
                  <span className="font-semibold text-stone-800">{item.trap}</span>
                  <div className="flex items-center gap-3">
                    <span>{item.date}</span>
                    <button
                      onClick={() => deleteReframe(item.id)}
                      className="text-rose-600 hover:text-rose-800 cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div className="text-xs text-stone-500 line-through">
                  "{item.hotThought}"
                </div>
                <div className="text-xs sm:text-sm font-medium text-emerald-950 bg-emerald-50/70 p-3 rounded-xl border border-emerald-100">
                  "{item.reframe}"
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
