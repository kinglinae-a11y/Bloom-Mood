import { useState, useMemo } from 'react';
import { RESOURCE_LIBRARY } from '../data/resourcesAndPrompts';
import { ResourceItem, ResourceCategory, ResourceType } from '../types';
import { 
  BookOpen, 
  Search, 
  ExternalLink, 
  Bookmark, 
  BookmarkCheck, 
  Video, 
  FileText, 
  Globe, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  Filter,
  X,
  Share2,
  HelpCircle,
  Quote,
  Lightbulb
} from 'lucide-react';

const CATEGORY_TABS: { id: ResourceCategory | 'all'; label: string; icon: string }[] = [
  { id: 'all', label: 'All Resources', icon: '🌟' },
  { id: 'stress', label: 'Stress & Regulation', icon: '🧘' },
  { id: 'identity', label: 'Identity & Self-Worth', icon: '🌱' },
  { id: 'relationships', label: 'Healthy Relationships', icon: '🤝' },
  { id: 'adolescent_concerns', label: 'Adolescent Concerns', icon: '🧭' },
];

const TYPE_FILTERS: { id: ResourceType | 'all'; label: string; icon: typeof FileText }[] = [
  { id: 'all', label: 'All Formats', icon: Sparkles },
  { id: 'article', label: 'Articles', icon: FileText },
  { id: 'website', label: 'Reputable Websites', icon: Globe },
  { id: 'video', label: 'Video Guides', icon: Video },
];

export function ResourceLibrary() {
  const [selectedCategory, setSelectedCategory] = useState<ResourceCategory | 'all'>('all');
  const [selectedType, setSelectedType] = useState<ResourceType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [onlySaved, setOnlySaved] = useState(false);
  const [activeModalItem, setActiveModalItem] = useState<ResourceItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Saved bookmarks stored in localStorage
  const [savedIds, setSavedIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('sanctuary_saved_resources');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const toggleSave = (id: string) => {
    setSavedIds(prev => {
      const next = prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id];
      try {
        localStorage.setItem('sanctuary_saved_resources', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const handleCopyLink = (item: ResourceItem) => {
    navigator.clipboard.writeText(item.url);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filtered resources
  const filteredResources = useMemo(() => {
    return RESOURCE_LIBRARY.filter(item => {
      // Category filter
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      // Type filter
      if (selectedType !== 'all' && item.type !== selectedType) {
        return false;
      }
      // Saved filter
      if (onlySaved && !savedIds.includes(item.id)) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesSummary = item.summary.toLowerCase().includes(q);
        const matchesSource = item.source.toLowerCase().includes(q);
        const matchesTags = item.tags.some(t => t.toLowerCase().includes(q));
        const matchesTakeaways = item.keyTakeaways.some(t => t.toLowerCase().includes(q));
        if (!matchesTitle && !matchesSummary && !matchesSource && !matchesTags && !matchesTakeaways) {
          return false;
        }
      }
      return true;
    });
  }, [selectedCategory, selectedType, onlySaved, savedIds, searchQuery]);

  return (
    <div className="space-y-10">
      
      {/* Header Banner */}
      <div className="border-b border-stone-200 pb-8 space-y-4">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-800">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Vetted Educational Sanctuary</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2 max-w-3xl">
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
              Adolescent Resource Library
            </h1>
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
              Curated, peer-reviewed articles, evidence-backed organizations, and clinician-led video guides covering stress regulation, identity, healthy boundaries, and teenage neurobiology.
            </p>
          </div>

          {/* Quick Bookmark Counter */}
          <button
            onClick={() => setOnlySaved(!onlySaved)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shrink-0 border ${
              onlySaved
                ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm'
                : 'bg-white text-stone-700 border-stone-200 hover:border-stone-300 shadow-2xs'
            }`}
          >
            {onlySaved ? (
              <BookmarkCheck className="w-4 h-4 text-emerald-200" />
            ) : (
              <Bookmark className="w-4 h-4 text-stone-400" />
            )}
            <span>Saved Bookmarks ({savedIds.length})</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar Controls */}
      <div className="space-y-4">
        
        {/* Search Input & Format Filter */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search topics (e.g. nervous system, social media, boundaries, perfectionism)..."
              className="w-full pl-10 pr-10 py-3 rounded-2xl border border-stone-200 bg-white text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 shadow-2xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Format Buttons */}
          <div className="flex items-center gap-1.5 p-1 bg-stone-200/70 rounded-2xl overflow-x-auto">
            {TYPE_FILTERS.map(filter => {
              const Icon = filter.icon;
              const isActive = selectedType === filter.id;
              return (
                <button
                  key={filter.id}
                  onClick={() => setSelectedType(filter.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white text-stone-900 shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-700' : 'text-stone-400'}`} />
                  <span>{filter.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Category Pill Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORY_TABS.map(tab => {
            const isActive = selectedCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
                  isActive
                    ? 'bg-stone-900 text-white shadow-xs font-semibold'
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

      {/* Results Count & Active Filters Indicator */}
      <div className="flex items-center justify-between text-xs text-stone-500 px-1">
        <span>
          Showing <strong className="text-stone-900 font-semibold">{filteredResources.length}</strong> vetted resources
          {onlySaved && ' in your bookmarks'}
          {selectedCategory !== 'all' && ` under "${CATEGORY_TABS.find(c => c.id === selectedCategory)?.label}"`}
        </span>
        {(searchQuery || selectedCategory !== 'all' || selectedType !== 'all' || onlySaved) && (
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setSelectedType('all');
              setOnlySaved(false);
            }}
            className="text-emerald-700 hover:text-emerald-800 font-medium hover:underline cursor-pointer"
          >
            Reset all filters
          </button>
        )}
      </div>

      {/* Resources Cards Grid */}
      {filteredResources.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white border border-stone-200 shadow-xs space-y-4">
          <div className="w-12 h-12 mx-auto rounded-full bg-stone-100 flex items-center justify-center text-stone-400">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-display text-lg font-bold text-stone-900">No resources matched your criteria</h3>
            <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto">
              Try adjusting your search terms or clearing the current format filter to see other guides.
            </p>
          </div>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setSelectedType('all');
              setOnlySaved(false);
            }}
            className="px-4 py-2 bg-stone-900 text-white text-xs font-semibold rounded-xl hover:bg-stone-800 cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((item) => {
            const isSaved = savedIds.includes(item.id);
            const isVideo = item.type === 'video';
            const isArticle = item.type === 'article';
            const isWebsite = item.type === 'website';

            return (
              <div
                key={item.id}
                className="flex flex-col bg-white rounded-3xl border border-stone-200/90 shadow-2xs hover:shadow-md hover:border-emerald-200 transition-all duration-200 overflow-hidden group"
              >
                {/* Card Header Media Accent */}
                <div className={`p-4 sm:p-5 border-b border-stone-100 flex items-center justify-between gap-3 ${
                  isVideo 
                    ? 'bg-linear-to-r from-indigo-50/70 to-purple-50/40' 
                    : isArticle 
                    ? 'bg-linear-to-r from-emerald-50/70 to-teal-50/40' 
                    : 'bg-linear-to-r from-amber-50/70 to-orange-50/40'
                }`}>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider ${
                      isVideo 
                        ? 'bg-indigo-100 text-indigo-800' 
                        : isArticle 
                        ? 'bg-emerald-100 text-emerald-900' 
                        : 'bg-amber-100 text-amber-900'
                    }`}>
                      {isVideo && <Video className="w-3.5 h-3.5" />}
                      {isArticle && <FileText className="w-3.5 h-3.5" />}
                      {isWebsite && <Globe className="w-3.5 h-3.5" />}
                      <span>{item.type}</span>
                    </span>

                    <span className="text-[11px] text-stone-500 flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3 text-stone-400" />
                      <span>{item.readOrWatchTime}</span>
                    </span>
                  </div>

                  {/* Bookmark Toggle Button */}
                  <button
                    onClick={() => toggleSave(item.id)}
                    aria-label={isSaved ? 'Remove bookmark' : 'Save bookmark'}
                    className={`p-2 rounded-xl transition-colors cursor-pointer ${
                      isSaved
                        ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                        : 'text-stone-400 hover:text-stone-700 hover:bg-white/80'
                    }`}
                  >
                    {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                  </button>
                </div>

                {/* Card Body */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2.5">
                    
                    {/* Source Organization */}
                    <div className="flex items-center gap-1.5 text-xs text-stone-500 font-medium">
                      <span className="font-semibold text-emerald-800">{item.source}</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-stone-400 capitalize">{item.category.replace('_', ' ')}</span>
                    </div>

                    <h3 className="font-display text-lg font-bold text-stone-900 group-hover:text-emerald-900 transition-colors leading-snug">
                      {item.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-stone-600 line-clamp-3 leading-relaxed">
                      {item.summary}
                    </p>
                  </div>

                  {/* Key Takeaways Mini Highlights */}
                  <div className="space-y-2 pt-2 border-t border-stone-100">
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 flex items-center gap-1">
                      <Lightbulb className="w-3 h-3 text-amber-500" />
                      <span>Key Takeaway</span>
                    </div>
                    <p className="text-xs text-stone-700 italic bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                      "{item.keyTakeaways[0]}"
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {item.tags.map(tag => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 text-[10px] font-mono"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Card Action Footer */}
                  <div className="pt-3 flex items-center justify-between gap-2 border-t border-stone-100">
                    <button
                      onClick={() => setActiveModalItem(item)}
                      className="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-stone-600" />
                      <span>Read Overview</span>
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleCopyLink(item)}
                        title="Copy official link"
                        className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
                      >
                        {copiedId === item.id ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Share2 className="w-4 h-4" />
                        )}
                      </button>

                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                      >
                        <span>Visit Source</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Vetted Science & Trust Standards */}
      <section className="p-6 sm:p-8 rounded-3xl bg-linear-to-br from-stone-900 to-stone-800 text-stone-100 border border-stone-800 space-y-6">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400">
          <ShieldCheck className="w-4 h-4" />
          <span>Sanctuary Editorial Integrity Standards</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <h4 className="font-display text-base font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Accredited Clinical Sources</span>
            </h4>
            <p className="text-xs text-stone-300 leading-relaxed">
              Every resource is sourced exclusively from peer-reviewed adolescent health research centers (Child Mind Institute, APA, Stanford, UCLA Semel Institute, and JED Foundation).
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-display text-base font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Zero Slop & Sensationalism</span>
            </h4>
            <p className="text-xs text-stone-300 leading-relaxed">
              We prohibit pop-psychology buzzwords or viral self-diagnosis trends. Content focuses on somatic nervous system regulation and developmental neuroscience.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-display text-base font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Empowerment Over Shame</span>
            </h4>
            <p className="text-xs text-stone-300 leading-relaxed">
              Adolescence is not a medical illness to be cured. We highlight resources that normalize pubertal neuroplasticity, identity exploration, and boundary-setting.
            </p>
          </div>
        </div>
      </section>

      {/* Resource Detail Modal */}
      {activeModalItem && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div 
            className="bg-white rounded-3xl border border-stone-200 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-150"
            role="dialog"
            aria-modal="true"
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-stone-100 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider">
                  <span>{activeModalItem.source}</span>
                  <span aria-hidden="true">·</span>
                  <span className="capitalize">{activeModalItem.type}</span>
                </div>
                <h3 className="font-display text-2xl font-bold text-stone-900">
                  {activeModalItem.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveModalItem(null)}
                className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video preview / Embed note if video */}
            {activeModalItem.embedVideoId && (
              <div className="aspect-video w-full rounded-2xl bg-stone-900 overflow-hidden shadow-inner flex flex-col items-center justify-center text-stone-200 p-4 relative group">
                <iframe
                  className="w-full h-full rounded-2xl"
                  src={`https://www.youtube.com/embed/${activeModalItem.embedVideoId}`}
                  title={activeModalItem.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}

            {/* Featured Quote Callout */}
            <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/70 border border-emerald-100 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-900">
                <Quote className="w-4 h-4 text-emerald-700" />
                <span>Featured Thought</span>
              </div>
              <p className="text-xs sm:text-sm text-emerald-950 font-serif italic leading-relaxed">
                "{activeModalItem.featuredQuote}"
              </p>
            </div>

            {/* Clinical Overview */}
            <div className="space-y-3">
              <h4 className="font-display text-base font-bold text-stone-900">
                Educational Overview
              </h4>
              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                {activeModalItem.overviewDetails}
              </p>
            </div>

            {/* Key Clinical Takeaways */}
            <div className="space-y-3">
              <h4 className="font-display text-base font-bold text-stone-900 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                <span>Key Takeaways & Action Steps</span>
              </h4>
              <ul className="space-y-2">
                {activeModalItem.keyTakeaways.map((point, index) => (
                  <li key={index} className="flex items-start gap-2.5 text-xs sm:text-sm text-stone-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                onClick={() => toggleSave(activeModalItem.id)}
                className={`w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer border ${
                  savedIds.includes(activeModalItem.id)
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                }`}
              >
                {savedIds.includes(activeModalItem.id) ? (
                  <>
                    <BookmarkCheck className="w-4 h-4 text-emerald-700" />
                    <span>Saved in Bookmarks</span>
                  </>
                ) : (
                  <>
                    <Bookmark className="w-4 h-4 text-stone-400" />
                    <span>Bookmark for Later</span>
                  </>
                )}
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setActiveModalItem(null)}
                  className="w-1/2 sm:w-auto px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold cursor-pointer"
                >
                  Close
                </button>
                <a
                  href={activeModalItem.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-1/2 sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <span>Read Official Source</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
