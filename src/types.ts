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
