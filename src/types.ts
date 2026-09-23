export type EmotionCategory = 
  | 'anxiety' 
  | 'anger' 
  | 'sadness' 
  | 'overwhelm' 
  | 'confusion' 
  | 'joy';

export interface EmotionItem {
  id: string;
  name: string;
  category: EmotionCategory;
  description: string;
  bodySensations: string[];
  healthyAction: string;
  copingQuote: string;
}

export interface MoodLogEntry {
  id: string;
  timestamp: number;
  emotionId: string;
  emotionName: string;
  category: EmotionCategory;
  intensity: number; // 1-10
  bodyLocations: string[];
  triggers: string[];
  notes: string;
}

export interface BrainFact {
  id: string;
  title: string;
  subtitle: string;
  scienceExplanation: string;
  realWorldImpact: string;
  actionableTip: string;
  mythBuster: string;
  iconName: string;
}

export interface ScenarioPlaybook {
  id: string;
  category: 'family' | 'friends' | 'school' | 'self' | 'boundaries';
  title: string;
  dilemma: string;
  whyItsHard: string;
  practicalSteps: string[];
  scripts: {
    approach: string;
    description: string;
    scriptText: string;
  }[];
  whatNotToDo: string[];
}

export interface CognitiveDistortion {
  id: string;
  name: string;
  teenExample: string;
  description: string;
  challengeQuestion: string;
  replacementExample: string;
}

export interface JournalPrompt {
  id: string;
  category: string;
  question: string;
}

export type ResourceCategory = 'stress' | 'identity' | 'relationships' | 'adolescent_concerns';
export type ResourceType = 'article' | 'website' | 'video';

export interface ResourceItem {
  id: string;
  title: string;
  summary: string;
  category: ResourceCategory;
  type: ResourceType;
  source: string;
  url: string;
  readOrWatchTime: string;
  keyTakeaways: string[];
  tags: string[];
  featuredQuote: string;
  embedVideoId?: string; // Optional YouTube ID or preview
  overviewDetails: string;
}

export type GuidedPromptCategory = 'self-discovery' | 'coping' | 'goals' | 'relationships' | 'challenges';

export interface GuidedPrompt {
  id: string;
  title: string;
  category: GuidedPromptCategory;
  coreQuestion: string;
  whyItMatters: string;
  stepPrompts: {
    step: number;
    title: string;
    promptText: string;
    placeholder: string;
  }[];
  suggestedAction: string;
  affirmation: string;
}
