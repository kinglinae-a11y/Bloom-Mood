import { useState } from 'react';
import { BRAIN_FACTS } from '../data/adolescenceContent';
import { BrainFact } from '../types';
import { Brain, Sparkles, Moon, ShieldAlert, Compass, Lightbulb, CheckCircle2 } from 'lucide-react';

export function BrainExplorer() {
  const [selectedTopic, setSelectedTopic] = useState<BrainFact>(BRAIN_FACTS[0]);
  const [activeStageComparison, setActiveStageComparison] = useState<'teen' | 'adult'>('teen');

  const getIcon = (name: string) => {
    switch (name) {
      case 'Brain': return <Brain className="w-5 h-5 text-indigo-600" />;
      case 'Sparkles': return <Sparkles className="w-5 h-5 text-amber-600" />;
      case 'Moon': return <Moon className="w-5 h-5 text-purple-600" />;
      case 'ShieldAlert': return <ShieldAlert className="w-5 h-5 text-rose-600" />;
      default: return <Compass className="w-5 h-5 text-emerald-600" />;
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      
      {/* Editorial Header with Educational Artwork */}
      <section className="p-8 sm:p-10 bg-white rounded-3xl border border-stone-200 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-800">
            <span>Neuroscience & Puberty Decoder</span>
            <span aria-hidden="true">·</span>
            <span>Why You Feel Everything So Deeply</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-stone-900 leading-tight">
            You Are Not Broken: It Is Biology Under Construction
          </h1>
          <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
            The adolescent brain undergoes the most radical structural redesign of any phase in human life since infancy. Understanding what is firing inside your skull dissolves guilt, self-blame, and confusion.
          </p>
          
          <div className="pt-2 flex items-center gap-4 text-xs text-stone-500 font-mono">
            <span>Synaptic Remodeling: Active</span>
            <span aria-hidden="true">·</span>
            <span>Myelination: In Progress</span>
          </div>
        </div>

        <div className="lg:col-span-5 rounded-2xl overflow-hidden border border-stone-200 shadow-sm relative aspect-4/3 bg-stone-100">
          <img
            src="/src/assets/images/brain_adolescence_guide_1790183553505.jpg"
            alt="Scientific illustration of the adolescent brain showing prefrontal cortex and emotional amygdala"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* Interactive Brain Topics Navigation */}
      <section className="space-y-6">
        <div>
          <h2 className="font-display text-2xl font-bold text-stone-900">
            Select a Neurological Wonder
          </h2>
          <p className="text-xs sm:text-sm text-stone-500">
            Tap any core transformation to reveal why it happens and how to manage it.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {BRAIN_FACTS.map((fact) => {
            const isSelected = selectedTopic.id === fact.id;
            return (
              <button
                key={fact.id}
                onClick={() => setSelectedTopic(fact)}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-stone-900 text-white border-stone-900 shadow-md'
                    : 'bg-white text-stone-800 border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className="space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-stone-100 dark:bg-stone-800 flex items-center justify-center">
                    {getIcon(fact.iconName)}
                  </div>
                  <h3 className={`font-display text-sm font-bold ${isSelected ? 'text-white' : 'text-stone-900'}`}>
                    {fact.title}
                  </h3>
                  <p className={`text-xs leading-relaxed line-clamp-2 ${isSelected ? 'text-stone-300' : 'text-stone-500'}`}>
                    {fact.subtitle}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Selected Topic Deep Dive */}
      <section className="p-8 sm:p-10 bg-white rounded-3xl border border-stone-200 shadow-xs space-y-8">
        <div className="border-b border-stone-100 pb-5 space-y-2">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-stone-100">
              {getIcon(selectedTopic.iconName)}
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
              In-Depth Exploration
            </span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-stone-900">
            {selectedTopic.title}
          </h2>
          <p className="text-sm font-medium text-emerald-800">
            {selectedTopic.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Scientific Explanation */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">
              The Neuroscience (What Is Happening)
            </h4>
            <p className="text-sm text-stone-700 leading-relaxed">
              {selectedTopic.scienceExplanation}
            </p>

            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-950 leading-relaxed">
              <span className="font-bold block mb-1">Myth Buster:</span>
              {selectedTopic.mythBuster}
            </div>
          </div>

          {/* Real-World Impact & Actionable Strategy */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">
              Real-World Translation
            </h4>
            <p className="text-sm text-stone-700 leading-relaxed">
              {selectedTopic.realWorldImpact}
            </p>

            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 text-xs text-emerald-950 space-y-1">
              <span className="font-bold text-emerald-900 block flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-emerald-700" />
                Actionable Daily Strategy:
              </span>
              <p className="leading-relaxed">
                {selectedTopic.actionableTip}
              </p>
            </div>
          </div>
        </div>

        {/* Interactive Comparison Simulator */}
        <div className="pt-6 border-t border-stone-100 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-display text-base font-bold text-stone-900">
              Brain Wiring Comparison
            </h4>
            <div className="flex items-center p-1 bg-stone-100 rounded-xl">
              <button
                onClick={() => setActiveStageComparison('teen')}
                className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                  activeStageComparison === 'teen' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600'
                }`}
              >
                Adolescent (Ages 12-24)
              </button>
              <button
                onClick={() => setActiveStageComparison('adult')}
                className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                  activeStageComparison === 'adult' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600'
                }`}
              >
                Adult (Ages 25+)
              </button>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 text-xs sm:text-sm text-stone-700 leading-relaxed">
            {activeStageComparison === 'teen' ? (
              <div className="space-y-2">
                <p>
                  <strong>Limbic System (Emotional Center):</strong> Operating at peak sensitivity. Emotional memories form with permanent intensity. Social validation delivers profound neurological rewards.
                </p>
                <p>
                  <strong>Prefrontal Cortex (Control Center):</strong> Mid-construction. Requires more intentional conscious effort to inhibit sudden impulses when excited or distressed.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <p>
                  <strong>Prefrontal Cortex:</strong> Fully myelinated. Pathways for long-term calculation and impulse pausing are insulated for rapid, automatic deployment.
                </p>
                <p>
                  <strong>Dopamine Baseline:</strong> More stable and regulated. Fewer dramatic peaks and valleys; routine tasks cause less neurological friction.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

    </div>
  );
}
