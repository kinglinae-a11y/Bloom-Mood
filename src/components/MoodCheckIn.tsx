import { useState } from 'react';
import { EMOTIONS_DATA } from '../data/adolescenceContent';
import { EmotionItem, EmotionCategory, MoodLogEntry } from '../types';
import { 
  Heart, 
  Sparkles, 
  Wind, 
  Flame, 
  CloudRain, 
  HelpCircle, 
  Check, 
  ArrowRight,
  BookmarkCheck,
  Bell
} from 'lucide-react';

interface MoodCheckInProps {
  onGoToCalm: () => void;
  onSaveEntry: (entry: MoodLogEntry) => void;
  onOpenReminders?: () => void;
}

const BODY_ZONES = [
  { id: 'head', label: 'Head / Temples', desc: 'Racing thoughts, tension headache' },
  { id: 'throat', label: 'Throat', desc: 'Choked up, lump in throat' },
  { id: 'chest', label: 'Chest / Heart', desc: 'Rapid heartbeat, shallow breathing' },
  { id: 'stomach', label: 'Stomach / Gut', desc: 'Butterflies, heavy pit, nausea' },
  { id: 'shoulders', label: 'Jaw & Shoulders', desc: 'Clenched teeth, tight posture' },
  { id: 'limbs', label: 'Limbs / Whole Body', desc: 'Restless fidgeting or heavy fatigue' },
];

const COMMON_TRIGGERS = [
  'School & Grades',
  'Friendship Drama',
  'Parents & Family Conflict',
  'Social Media Comparison',
  'Body Changes & Acne',
  'Fear of the Future',
  'Crush or Romantic Pain',
  'Sleep Deprivation',
];

export function MoodCheckIn({ onGoToCalm, onSaveEntry, onOpenReminders }: MoodCheckInProps) {
  const [selectedCategory, setSelectedCategory] = useState<EmotionCategory | 'all'>('all');
  const [selectedEmotion, setSelectedEmotion] = useState<EmotionItem>(EMOTIONS_DATA[0]);
  const [intensity, setIntensity] = useState<number>(6);
  const [selectedBodyZones, setSelectedBodyZones] = useState<string[]>(['chest']);
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>(['School & Grades']);
  const [personalNote, setPersonalNote] = useState<string>('');
  const [isSavedRecently, setIsSavedRecently] = useState(false);

  const filteredEmotions = selectedCategory === 'all' 
    ? EMOTIONS_DATA 
    : EMOTIONS_DATA.filter(e => e.category === selectedCategory);

  const toggleBodyZone = (zoneId: string) => {
    setSelectedBodyZones(prev => 
      prev.includes(zoneId) ? prev.filter(z => z !== zoneId) : [...prev, zoneId]
    );
  };

  const toggleTrigger = (trigger: string) => {
    setSelectedTriggers(prev => 
      prev.includes(trigger) ? prev.filter(t => t !== trigger) : [...prev, trigger]
    );
  };

  const handleSave = () => {
    const entry: MoodLogEntry = {
      id: `mood-${Date.now()}`,
      timestamp: Date.now(),
      emotionId: selectedEmotion.id,
      emotionName: selectedEmotion.name,
      category: selectedEmotion.category,
      intensity,
      bodyLocations: selectedBodyZones,
      triggers: selectedTriggers,
      notes: personalNote.trim(),
    };
    onSaveEntry(entry);
    setIsSavedRecently(true);
    setTimeout(() => setIsSavedRecently(false), 3500);
  };

  const getIntensityLabel = (val: number) => {
    if (val <= 2) return 'Gentle ripple · Very manageable';
    if (val <= 4) return 'Noticeable flutter · Lingering in the background';
    if (val <= 6) return 'Elevated wave · Dominating your attention';
    if (val <= 8) return 'High surge · Hard to think about anything else';
    return 'Tidal flood · Overwhelming nervous system';
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      
      {/* Editorial Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-stone-900 text-stone-100 shadow-xl border border-stone-800">
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[380px]">
          <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-between z-10">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400">
                <span>Safe Exploration Space</span>
                <span aria-hidden="true">·</span>
                <span>Adolescent Emotional Compass</span>
              </div>
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white text-balance leading-tight">
                Whatever you are feeling right now is real. Let’s decode it.
              </h1>
              <p className="text-stone-300 text-sm sm:text-base leading-relaxed max-w-xl">
                Adolescence is not a flaw in your character; it is a profound neurological rewiring. Name your sensation, map where your body holds it, and discover immediate, scientifically proven relief.
              </p>
            </div>
            
            <div className="pt-6 flex flex-wrap items-center gap-3">
              <button
                onClick={onGoToCalm}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs sm:text-sm flex items-center gap-2 transition-transform active:scale-[0.98] cursor-pointer"
              >
                <Wind className="w-4 h-4" />
                <span>Instant Panic / Calm Room</span>
              </button>
              {onOpenReminders && (
                <button
                  onClick={onOpenReminders}
                  className="px-4 py-2.5 rounded-xl bg-stone-800/90 hover:bg-stone-700 text-emerald-300 border border-emerald-900/60 text-xs sm:text-sm font-medium flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Bell className="w-4 h-4 text-emerald-400" />
                  <span>Daily Reminders</span>
                </button>
              )}
              <a
                href="#decoder-step"
                className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs sm:text-sm font-medium transition-colors"
              >
                Begin Check-In Below
              </a>
            </div>
          </div>

          <div className="lg:col-span-5 relative min-h-[240px] lg:min-h-full">
            <img
              src="/src/assets/images/adolescent_calm_hero_1790183541475.jpg"
              alt="Teenager resting peacefully under a calm twilight sky"
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover opacity-85 hover:opacity-95 transition-opacity"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/40 lg:bg-gradient-to-r lg:from-stone-900 lg:via-transparent to-transparent" />
          </div>
        </div>
      </section>

      {/* Step 1: Emotion Wheel / Decoder */}
      <section id="decoder-step" className="space-y-6 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-stone-200 pb-4">
          <div>
            <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
              Step 1 of 4
            </span>
            <h2 className="font-display text-2xl font-bold text-stone-900">
              What specific emotion feels most present?
            </h2>
            <p className="text-xs sm:text-sm text-stone-500">
              Avoid just saying "fine" or "bad". Naming the granular feeling disarms the amygdala.
            </p>
          </div>

          {/* Interactive filter tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-stone-200/70 rounded-xl">
            {(['all', 'anxiety', 'anger', 'sadness', 'overwhelm', 'confusion', 'joy'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-white text-stone-900 shadow-sm'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Emotion Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredEmotions.map((item) => {
            const isSelected = selectedEmotion.id === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setSelectedEmotion(item)}
                className={`text-left p-4 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50/50 shadow-sm ring-1 ring-emerald-600/30'
                    : 'border-stone-200/90 bg-white hover:border-stone-300 hover:shadow-xs'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                      {item.category}
                    </span>
                    {isSelected && (
                      <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    )}
                  </div>
                  <h3 className="font-display text-base font-bold text-stone-900 mb-1">
                    {item.name}
                  </h3>
                  <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-3 mt-2 border-t border-stone-100 flex items-center gap-1.5 text-[11px] text-stone-500">
                  <span className="font-medium text-stone-700">Sensations:</span>
                  <span className="truncate">{item.bodySensations.join(', ')}</span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Step 2: Intensity Meter */}
      <section className="p-6 sm:p-8 bg-white rounded-3xl border border-stone-200 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
              Step 2 of 4
            </span>
            <h3 className="font-display text-xl font-bold text-stone-900">
              Measure Intensity
            </h3>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold font-mono text-emerald-700 tabular-nums">
              {intensity}
            </span>
            <span className="text-xs text-stone-400 font-mono"> / 10</span>
          </div>
        </div>

        <div className="space-y-3">
          <input
            type="range"
            min="1"
            max="10"
            value={intensity}
            onChange={(e) => setIntensity(Number(e.target.value))}
            className="w-full h-2.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-emerald-600 focus:outline-none"
            aria-label="Emotion intensity slider from 1 to 10"
          />
          <div className="flex justify-between text-xs text-stone-400 font-mono">
            <span>1 · Barely there</span>
            <span>5 · Moderate</span>
            <span>10 · Overwhelming storm</span>
          </div>
          <p className="text-xs sm:text-sm font-medium text-stone-700 bg-stone-50 p-3 rounded-xl border border-stone-100">
            Current State: <span className="text-emerald-800">{getIntensityLabel(intensity)}</span>
          </p>
        </div>
      </section>

      {/* Step 3: Somatic Body Mapping & Triggers */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Somatic Locator */}
        <div className="p-6 bg-white rounded-3xl border border-stone-200 shadow-xs space-y-4">
          <div>
            <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
              Step 3 of 4
            </span>
            <h3 className="font-display text-xl font-bold text-stone-900">
              Somatic Body Map
            </h3>
            <p className="text-xs text-stone-500">
              Emotions are physical sensations first. Where is this living in your body right now?
            </p>
          </div>

          <div className="space-y-2 pt-1">
            {BODY_ZONES.map((zone) => {
              const isSelected = selectedBodyZones.includes(zone.id);
              return (
                <button
                  key={zone.id}
                  onClick={() => toggleBodyZone(zone.id)}
                  className={`w-full text-left p-3 rounded-xl border transition-colors flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950 font-medium'
                      : 'border-stone-200 bg-stone-50/50 hover:bg-stone-100/70 text-stone-700'
                  }`}
                >
                  <div>
                    <div className="text-xs font-bold">{zone.label}</div>
                    <div className="text-[11px] text-stone-500">{zone.desc}</div>
                  </div>
                  <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                    isSelected ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-stone-300 bg-white'
                  }`}>
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Triggers / Context */}
        <div className="p-6 bg-white rounded-3xl border border-stone-200 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
              Context & Root
            </span>
            <h3 className="font-display text-xl font-bold text-stone-900">
              What ignited this wave?
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              Select any contributing forces in your life today:
            </p>

            <div className="flex flex-wrap gap-2">
              {COMMON_TRIGGERS.map((trigger) => {
                const isSelected = selectedTriggers.includes(trigger);
                return (
                  <button
                    key={trigger}
                    onClick={() => toggleTrigger(trigger)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-600 text-white'
                        : 'border-stone-200 bg-stone-50 text-stone-700 hover:border-stone-300'
                    }`}
                  >
                    {trigger}
                  </button>
                );
              })}
            </div>

            <div className="mt-5 space-y-2">
              <label htmlFor="checkin-notes" className="text-xs font-bold text-stone-700">
                Optional note or unedited thought:
              </label>
              <textarea
                id="checkin-notes"
                value={personalNote}
                onChange={(e) => setPersonalNote(e.target.value)}
                placeholder="What happened? E.g., 'Group chat got quiet after I sent a meme and my brain convinced me everyone hates me...'"
                rows={3}
                className="w-full text-xs p-3 rounded-xl border border-stone-200 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 bg-stone-50/50 resize-none text-stone-800"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
            <span className="text-[11px] text-stone-500">
              Saved strictly in your browser. 100% private.
            </span>
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              {isSavedRecently ? (
                <>
                  <BookmarkCheck className="w-4 h-4 text-emerald-400" />
                  <span>Logged to Journal!</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Save Check-In</span>
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* Step 4: Tailored Immediate Coping Prescription */}
      <section className="p-6 sm:p-8 bg-stone-900 text-stone-100 rounded-3xl border border-stone-800 shadow-lg space-y-5">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400">
          <span>Targeted Antidote</span>
          <span aria-hidden="true">·</span>
          <span>Based on {selectedEmotion.name}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-8 space-y-3">
            <h3 className="font-display text-xl sm:text-2xl font-bold text-white">
              Action Plan: {selectedEmotion.healthyAction}
            </h3>
            <p className="text-sm text-stone-300 italic border-l-2 border-emerald-500 pl-3.5 py-1">
              “{selectedEmotion.copingQuote}”
            </p>
          </div>

          <div className="md:col-span-4 flex flex-col gap-2.5">
            <button
              onClick={onGoToCalm}
              className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs sm:text-sm text-center transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <Wind className="w-4 h-4" />
              <span>Launch Calm Room Tool</span>
            </button>
            <p className="text-[11px] text-center text-stone-400">
              Interactive 4-4-4-4 breathing & 5-4-3-2-1 sensory reset
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
