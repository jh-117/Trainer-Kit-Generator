export enum AppState {
  LANDING = 'LANDING',
  INPUT = 'INPUT',
  ANALYZING = 'ANALYZING',
  REVIEW = 'REVIEW',
  GENERATING = 'GENERATING',
  RESULTS = 'RESULTS',
}

export interface TrainingInput {
  industry: string;
  topic: string;
  file: File | null;
}

export interface TrainingModule {
  title: string;
  description: string;
  durationMinutes: number;
}

export interface TrainingPlan {
  title: string;
  targetAudience: string;
  learningObjectives: string[];
  modules: TrainingModule[];
  suggestedEnhancements: string[];
}

export interface Slide {
  title: string;
  content: string[];
  speakerNotes: string;
  visualSearchTerm: string;
}

export interface Flashcard {
  front: string;
  back: string;
}

export interface GeneratedKit {
  slides: Slide[];
  flashcards: Flashcard[];
  handoutMarkdown: string;
  facilitatorGuideMarkdown: string;
  backgroundImagePrompt: string;
}