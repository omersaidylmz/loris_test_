import type { Gender } from "./types";

export const RECOMMENDATION_CONFIG = {
  genderWeights: {
    unisex_selection: {
      unisex: 1.0,
      male: 0.85,
      female: 0.85,
    },
    male_selection: {
      male: 1.0,
      unisex: 0.85,
      female: 0.3,
    },
    female_selection: {
      female: 1.0,
      unisex: 0.85,
      male: 0.3,
    },
  },

  scoring: {
    semantic: 0.25,
    notes: 0.25,
    sensory: 0.15,
    mood: 0.15,
    environment: 0.10,
    gender: 0.10,
  },

  noteLayerWeights: {
    top: 0.25,
    middle: 0.35,
    base: 0.40,
  },

  candidateCount: {
    vectorRetrieval: 20,
    deterministicRanking: 12,
    finalOutput: 3,
  },

  cache: {
    maxEntries: 200,
    ttlMs: 1000 * 60 * 30,
  },
} as const;

export function getGenderAffinity(
  userGender: Gender,
  perfumeGender: Gender,
): number {
  const map =
    userGender === "unisex"
      ? RECOMMENDATION_CONFIG.genderWeights.unisex_selection
      : userGender === "male"
        ? RECOMMENDATION_CONFIG.genderWeights.male_selection
        : RECOMMENDATION_CONFIG.genderWeights.female_selection;
  return map[perfumeGender] ?? 0.5;
}
