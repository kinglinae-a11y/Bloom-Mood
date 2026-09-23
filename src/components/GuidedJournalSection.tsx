import { useState, useMemo } from 'react';
import { GUIDED_PROMPTS_DATA } from '../data/resourcesAndPrompts';
import { GuidedPrompt, GuidedPromptCategory } from '../types';
import { 
  Sparkles, 
  Check, 
  ArrowRight, 
  RotateCcw, 
  Shuffle, 
  BookOpen, 
  Heart, 
  Target, 
  ShieldCheck, 
  HelpCircle, 
  CheckCircle2, 
  PenTool, 
  Quote, 
  BookmarkCheck,
  ChevronRight,
  Flame,
  Compass
} from 'lucide-react';

interface GuidedJournalSectionProps {
  onSaveToJournal?: (entry: { promptQuestion: string; content: string; tags: string[] }) => void;
  onNavigateToJournal?: () => void;
}

const CATEGORY_TABS: { id: GuidedPromptCategory | 'all'; label: string; icon: string; desc: string }[] = [
  { id: 'all', label: 'All Prompts', icon: '✨', desc: 'Browse the complete guided adolescent reflection library' },
  { id: 'self-discovery', label: 'Self-Discovery', icon: '🌱', desc: 'Identity, values, authenticity, and unmasking' },
  { id: 'coping', label: 'Coping & Regulation', icon: '🧘', desc: 'Nervous system resets, somatic cues, and overcoming shame' },
  { id: 'goals', label: 'Goal Setting & Future', icon: '🎯', desc: 'Resilience, micro-habits, and overcoming perfectionism' },
  { id: 'relationships', label: 'Relationships & Boundaries', icon: '🤝', desc: 'Friendship audits, boundaries, and family communication' },
  { id: 'challenges', label: 'Teen Challenges', icon: '🧭', desc: 'Social comparison, academic dread, and body neutrality' },
];

export function GuidedJournalSection({ onSaveToJournal, onNavigateToJournal }: GuidedJournalSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<GuidedPromptCategory | 'all'>('all');
  const [activePrompt, setActivePrompt] = useState<GuidedPrompt>(GUIDED_PROMPTS_DATA[0]);
  const [stepAnswers, setStepAnswers] = useState<{ [step: number]: string }>({});
  const [isFreeformMode, setIsFreeformMode] = useState<boolean>(false);
  const [freeformContent, setFreeformContent] = useState<string>('');
  const [isSavedSuccessfully, setIsSavedSuccessfully] = useState<boolean>(false);

  // Filter prompts by category
  const filteredPrompts = useMemo(() => {
    if (selectedCategory === 'all') return GUIDED_PROMPTS_DATA;
    return GUIDED_PROMPTS_DATA.filter(p => p.category === selectedCategory);
  }, [selectedCategory]);

  // Handle switching active prompt
  const handleSelectPrompt = (prompt: GuidedPrompt) => {
    setActivePrompt(prompt);
    setStepAnswers({});
    setFreeformContent('');
    setIsSavedSuccessfully(false);
    window.scrollTo({ top: 320, behavior: 'smooth' });
  };

  // Pick a random prompt
  const handleSurpriseMe = () => {
    const remaining = GUIDED_PROMPTS_DATA.filter(p => p.id !== activePrompt.id);
    const random = remaining[Math.floor(Math.random() * remaining.length)];
    handleSelectPrompt(random);
  };

  // Word count calculator
  const totalWords = useMemo(() => {
    if (isFreeformMode) {
      return freeformContent.trim() ? freeformContent.trim().split(/\s+/).length : 0;
    }
    const fullText = Object.values(stepAnswers).join(' ').trim();
    return fullText ? fullText.split(/\s+/).length : 0;
  }, [isFreeformMode, freeformContent, stepAnswers]);

  // Handle saving entry into user's private journal
  const handleSaveEntry = () => {
    let compiledContent = '';

    if (isFreeformMode) {
      compiledContent = freeformContent;
    } else {
      compiledContent = activePrompt.stepPrompts.map(step => {
        const answer = stepAnswers[step.step] || '(Unanswered)';
        return `### ${step.step}. ${step.title}\n*${step.promptText}*\n\n${answer}`;
      }).join('\n\n');

      if (activePrompt.affirmation) {
        compiledContent += `\n\n**Affirmation:** "${activePrompt.affirmation}"`;
      }
    }

    if (!compiledContent.trim()) return;

    // Save directly to localStorage for private journal
    const newEntry = {
      id: `guided-${Date.now()}`,
      timestamp: Date.now(),
      promptQuestion: `${activePrompt.title}: ${activePrompt.coreQuestion}`,
      content: compiledContent,
      tags: ['Guided Reflection', activePrompt.category, `#${activePrompt.id}`]
    };

    try {
      const stored = localStorage.getItem('sanctuary_journal_entries');
      const existing = stored ? JSON.parse(stored) : [];
      localStorage.setItem('sanctuary_journal_entries', JSON.stringify([newEntry, ...existing]));
    } catch {}

    if (onSaveToJournal) {
      onSaveToJournal({
        promptQuestion: newEntry.promptQuestion,
        content: compiledContent,
        tags: newEntry.tags
      });
    }

    setIsSavedSuccessfully(true);
    setTimeout(() => setIsSavedSuccessfully(false), 4000);
  };

  return (
    <div className="space-y-10">
      
      {/* Editorial Header */}
      <div className="border-b border-stone-200 pb-8 space-y-4">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-800">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>Structured Emotional Inquiry</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2 max-w-3xl">
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
              Guided Journaling Prompts
            </h1>
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
              Targeted, 3-step prompts designed to bypass blank-page anxiety. Untangle adolescent challenges, explore your developing identity, practice somatic coping, and define your future goals.
            </p>
          </div>

          <button
            onClick={handleSurpriseMe}
            className="px-4 py-2.5 rounded-2xl bg-white border border-stone-200 hover:border-stone-300 text-stone-800 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-2xs shrink-0"
          >
            <Shuffle className="w-4 h-4 text-emerald-600" />
            <span>Surprise Me / Random Prompt</span>
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="space-y-2">
        <div className="text-xs font-semibold uppercase tracking-wider text-stone-400">
          Select Topic Domain
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORY_TABS.map(tab => {
            const isActive = selectedCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
                  isActive
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100 hover:text-stone-900'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Active Reflection Studio */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 sm:p-8 space-y-8">
        
        {/* Active Prompt Header Info */}
        <div className="space-y-4 border-b border-stone-100 pb-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-800">
              <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-100 capitalize">
                {activePrompt.category.replace('-', ' ')}
              </span>
              <span aria-hidden="true">·</span>
              <span className="text-stone-400">Step-by-Step Guided Reflection</span>
            </div>

            {/* Mode Switcher: 3-Step Guided vs Freeform */}
            <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-xl text-xs">
              <button
                onClick={() => setIsFreeformMode(false)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                  !isFreeformMode ? 'bg-white text-stone-900 shadow-2xs font-semibold' : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                Guided 3-Step
              </button>
              <button
                onClick={() => setIsFreeformMode(true)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                  isFreeformMode ? 'bg-white text-stone-900 shadow-2xs font-semibold' : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                Free-Flow Writing
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-stone-900">
              {activePrompt.title}
            </h2>
            <p className="text-base sm:text-lg text-emerald-950 font-serif italic border-l-3 border-emerald-500 pl-4 py-1">
              "{activePrompt.coreQuestion}"
            </p>
          </div>

          {/* Neurobiology & Emotional Insight Box */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/70 text-xs sm:text-sm text-stone-700 leading-relaxed flex items-start gap-3">
            <Quote className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold text-stone-900">Why this reflection matters: </strong>
              <span>{activePrompt.whyItMatters}</span>
            </div>
          </div>
        </div>

        {/* Studio Content Area */}
        {!isFreeformMode ? (
          <div className="space-y-6">
            {activePrompt.stepPrompts.map((step) => (
              <div 
                key={step.step}
                className="p-5 sm:p-6 rounded-2xl bg-stone-50/70 border border-stone-200/90 space-y-3 transition-colors focus-within:border-emerald-500 focus-within:bg-white"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-800 text-white font-mono text-xs font-bold flex items-center justify-center">
                      {step.step}
                    </span>
                    <h3 className="font-display text-sm sm:text-base font-bold text-stone-900">
                      {step.title}
                    </h3>
                  </div>
                  {stepAnswers[step.step]?.trim() && (
                    <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Answered</span>
                    </span>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-stone-600 italic">
                  {step.promptText}
                </p>

                <textarea
                  rows={3}
                  value={stepAnswers[step.step] || ''}
                  onChange={(e) => setStepAnswers({ ...stepAnswers, [step.step]: e.target.value })}
                  placeholder={step.placeholder}
                  className="w-full p-3.5 rounded-xl border border-stone-200 bg-white text-xs sm:text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 resize-y"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-stone-500">
              <span>Write freely without steps. Let thoughts spill onto the page:</span>
              <span className="font-mono">{totalWords} words</span>
            </div>
            <textarea
              rows={9}
              value={freeformContent}
              onChange={(e) => setFreeformContent(e.target.value)}
              placeholder="Start typing your honest, unfiltered reflection here..."
              className="w-full p-4 rounded-2xl border border-stone-200 bg-stone-50/50 text-xs sm:text-sm text-stone-800 placeholder:text-stone-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 resize-y leading-relaxed"
            />
          </div>
        )}

        {/* Affirmation & Micro-Action Box */}
        <div className="p-4 sm:p-5 rounded-2xl bg-linear-to-r from-emerald-50/90 to-teal-50/50 border border-emerald-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5" />
              <span>Suggested Grounding Anchor</span>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-emerald-950 font-serif">
              "{activePrompt.affirmation}"
            </p>
            <p className="text-xs text-emerald-800">
              <strong>Next Action:</strong> {activePrompt.suggestedAction}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-stone-500 font-mono">
              {totalWords} words written
            </span>
          </div>
        </div>

        {/* Studio Save Actions */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-stone-100">
          <div className="text-xs text-stone-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Reflections are stored in your device's encrypted private local cache.</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => {
                setStepAnswers({});
                setFreeformContent('');
              }}
              className="px-4 py-2.5 rounded-xl border border-stone-200 text-stone-600 hover:text-stone-900 text-xs font-semibold cursor-pointer"
            >
              Clear
            </button>

            <button
              onClick={handleSaveEntry}
              disabled={totalWords === 0}
              className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-emerald-700 disabled:opacity-40 hover:bg-emerald-600 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
            >
              {isSavedSuccessfully ? (
                <>
                  <Check className="w-4 h-4 text-emerald-200" />
                  <span>Saved to Private Journal!</span>
                </>
              ) : (
                <>
                  <BookmarkCheck className="w-4 h-4" />
                  <span>Save to My Journal</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>

      {/* Prompt Browser: Explore More Guided Prompts */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-xl font-bold text-stone-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-stone-600" />
            <span>More Guided Prompts in this Collection ({filteredPrompts.length})</span>
          </h3>
          <span className="text-xs text-stone-400">Click any prompt to open studio</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredPrompts.map((prompt) => {
            const isCurrentlyActive = prompt.id === activePrompt.id;
            return (
              <button
                key={prompt.id}
                onClick={() => handleSelectPrompt(prompt)}
                className={`p-5 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                  isCurrentlyActive
                    ? 'bg-emerald-50/50 border-emerald-400 ring-2 ring-emerald-500/20 shadow-xs'
                    : 'bg-white border-stone-200 hover:border-stone-300 shadow-2xs hover:shadow-xs'
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/60 px-2 py-0.5 rounded-md capitalize">
                      {prompt.category.replace('-', ' ')}
                    </span>
                    {isCurrentlyActive && (
                      <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                        <span>Active</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>
                  <h4 className="font-display text-base font-bold text-stone-900">
                    {prompt.title}
                  </h4>
                  <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                    "{prompt.coreQuestion}"
                  </p>
                </div>

                <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400">
                  <span>3 guided micro-steps</span>
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    Open Prompt <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
}
