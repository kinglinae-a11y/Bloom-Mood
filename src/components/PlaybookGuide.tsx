import { useState } from 'react';
import { SCENARIO_PLAYBOOKS } from '../data/adolescenceContent';
import { ScenarioPlaybook } from '../types';
import { Copy, Check, AlertCircle, MessageSquareQuote, ShieldCheck } from 'lucide-react';

export function PlaybookGuide() {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'family' | 'friends' | 'school' | 'self'>('all');
  const [activePlaybook, setActivePlaybook] = useState<ScenarioPlaybook>(SCENARIO_PLAYBOOKS[0]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const filteredPlaybooks = selectedCategory === 'all'
    ? SCENARIO_PLAYBOOKS
    : SCENARIO_PLAYBOOKS.filter(p => p.category === selectedCategory);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2500);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-800">
            <span>Realistic Social & Emotional Strategies</span>
          </div>
          <h1 className="font-display text-3xl font-bold text-stone-900 tracking-tight">
            Adolescent Life Playbooks & Scripts
          </h1>
          <p className="text-xs sm:text-sm text-stone-500">
            Exact word-for-word scripts and tactical guides for the hardest conversations of teenage life.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-1.5 p-1 bg-stone-200/70 rounded-xl self-start sm:self-auto">
          {(['all', 'family', 'friends', 'school', 'self'] as const).map((cat) => (
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

      {/* Grid of Playbook Dilemmas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {filteredPlaybooks.map((book) => {
          const isSelected = activePlaybook.id === book.id;
          return (
            <button
              key={book.id}
              onClick={() => setActivePlaybook(book)}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'border-emerald-600 bg-emerald-50/50 shadow-sm ring-1 ring-emerald-600/30'
                  : 'border-stone-200 bg-white hover:border-stone-300 hover:shadow-xs'
              }`}
            >
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500 block mb-1">
                  {book.category}
                </span>
                <h3 className="font-display text-sm font-bold text-stone-900 line-clamp-2">
                  {book.title}
                </h3>
              </div>
              <div className="pt-3 mt-2 border-t border-stone-100 text-[11px] font-medium text-emerald-800 flex items-center justify-between">
                <span>View Playbook</span>
                <span>→</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Playbook Detail Card */}
      <section className="p-8 sm:p-10 bg-white rounded-3xl border border-stone-200 shadow-xs space-y-8">
        
        {/* Title & Dilemma */}
        <div className="space-y-3 border-b border-stone-100 pb-6">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-800">
            <span>{activePlaybook.category} Playbook</span>
            <span aria-hidden="true">·</span>
            <span>Step-by-Step Guide</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-stone-900">
            {activePlaybook.title}
          </h2>
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-1.5">
            <h4 className="text-xs font-bold text-stone-900">The Core Dilemma:</h4>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              {activePlaybook.dilemma}
            </p>
          </div>
        </div>

        {/* Why it is so tough */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">
            Why this feels overwhelming:
          </h4>
          <p className="text-sm text-stone-700 leading-relaxed font-medium">
            {activePlaybook.whyItsHard}
          </p>
        </div>

        {/* Practical Action Steps */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">
            Action Strategy
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {activePlaybook.practicalSteps.map((step, idx) => (
              <div key={idx} className="p-3.5 rounded-xl border border-stone-200/70 bg-stone-50/50 flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-bold font-mono shrink-0">
                  {idx + 1}
                </span>
                <p className="text-xs text-stone-700 leading-relaxed">
                  {step}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Word-for-Word Scripts */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center gap-2">
            <MessageSquareQuote className="w-5 h-5 text-emerald-700" />
            <h4 className="font-display text-lg font-bold text-stone-900">
              Word-for-Word Scripts You Can Use
            </h4>
          </div>

          <div className="space-y-4">
            {activePlaybook.scripts.map((script, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-stone-900 text-stone-100 space-y-3 border border-stone-800">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-800 pb-2">
                  <div>
                    <h5 className="text-sm font-bold text-white">{script.approach}</h5>
                    <p className="text-xs text-stone-400">{script.description}</p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(script.scriptText, idx)}
                    className="px-3.5 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
                  >
                    {copiedIndex === idx ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-300">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Script</span>
                      </>
                    )}
                  </button>
                </div>

                <p className="text-sm sm:text-base text-stone-200 italic leading-relaxed pl-3 border-l-2 border-emerald-500">
                  {script.scriptText}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* What NOT to do */}
        {activePlaybook.whatNotToDo.length > 0 && (
          <div className="p-5 rounded-2xl bg-rose-50/70 border border-rose-200/80 space-y-2">
            <h5 className="text-xs font-bold text-rose-900 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-rose-600" />
              <span>Traps to Avoid:</span>
            </h5>
            <ul className="space-y-1.5 text-xs text-rose-800 list-disc list-inside">
              {activePlaybook.whatNotToDo.map((trap, idx) => (
                <li key={idx}>{trap}</li>
              ))}
            </ul>
          </div>
        )}

      </section>

    </div>
  );
}
