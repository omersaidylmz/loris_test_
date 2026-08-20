export type Gender = "male" | "female" | "unisex";

export interface UserScentProfile {
  identity: Gender;

  topFamilies: Record<string, number>;
  middleFamilies: Record<string, number>;
  baseFamilies: Record<string, number>;

  freshness: number;
  warmth: number;
  sweetness: number;
  intensity: number;
  greenness: number;
  brightness: number;
  softness: number;
  dryness: number;
  cleanliness: number;

  styleTags: string[];
  moodTags: string[];
  environmentTags: string[];

  semanticProfile: string;
}

export interface PerfumeEnriched {
  id: string;
  name: string;
  gender_profile: Gender;
  top_profile: string[];
  middle_profile: string[];
  base_profile: string[];
  accords: string[];
  freshness: number;
  warmth: number;
  sweetness: number;
  intensity: number;
  greenness: number;
  brightness: number;
  softness: number;
  dryness: number;
  cleanliness: number;
  semantic_text: string;
}

export interface ScoreBreakdown {
  semantic: number;
  notes: number;
  sensory: number;
  mood: number;
  environment: number;
  gender: number;
}

export interface ScoredCandidate {
  perfume: PerfumeEnriched;
  scores: ScoreBreakdown;
  finalScore: number;
}

export interface RecommendationItem {
  perfumeId: string;
  rank: 1 | 2 | 3;
  confidence: number;
  reason: string;
  matchedTraits: string[];
}

export interface RecommendationResult {
  userProfileSummary: string;
  recommendations: RecommendationItem[];
  perfumes: PerfumeEnriched[];
  candidates: ScoredCandidate[];
  llmUsed: boolean;
  timings: {
    profileBuildMs: number;
    rankingMs: number;
    llmMs: number;
    totalMs: number;
  };
}

export interface QuizAnswer {
  stepId: string;
  optionId: string;
  profiles: string[];
}
