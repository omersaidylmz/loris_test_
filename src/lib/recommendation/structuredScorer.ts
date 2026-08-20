import type { UserScentProfile, PerfumeEnriched, ScoredCandidate, ScoreBreakdown } from "./types";
import { RECOMMENDATION_CONFIG, getGenderAffinity } from "./config";

function cosineSim(a: number[], b: number[]): number {
  if (a.length !== b.length || a.length === 0) return 0;
  let dot = 0, magA = 0, magB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    magA += a[i] * a[i];
    magB += b[i] * b[i];
  }
  const denom = Math.sqrt(magA) * Math.sqrt(magB);
  return denom === 0 ? 0 : dot / denom;
}

function familyOverlapScore(userFamilies: Record<string, number>, perfumeFamilies: string[]): number {
  const perfumeSet = new Set(perfumeFamilies);
  const userKeys = Object.keys(userFamilies);
  if (userKeys.length === 0 || perfumeFamilies.length === 0) return 0;
  let totalWeight = 0;
  let matchWeight = 0;
  for (const [family, count] of Object.entries(userFamilies)) {
    totalWeight += count;
    if (perfumeSet.has(family)) matchWeight += count;
  }
  return totalWeight > 0 ? matchWeight / totalWeight : 0;
}

function sensoryDistance(user: UserScentProfile, perfume: PerfumeEnriched): number {
  const keys = ["freshness", "warmth", "sweetness", "intensity", "greenness", "brightness", "softness", "dryness", "cleanliness"] as const;
  let sumSq = 0;
  for (const k of keys) {
    const diff = (user[k] || 0) - (perfume[k] || 0);
    sumSq += diff * diff;
  }
  return Math.sqrt(sumSq / keys.length);
}

function tagOverlap(userTags: string[], perfumeTags: string[]): number {
  if (userTags.length === 0 || perfumeTags.length === 0) return 0;
  const perfumeSet = new Set(perfumeTags);
  let matches = 0;
  for (const t of userTags) {
    if (perfumeSet.has(t)) matches++;
  }
  return matches / userTags.length;
}

function extractTagsFromSemantic(text: string): string[] {
  const lines = text.split("\n");
  const tagLines = lines.filter((l, i) => {
    const lower = l.trim().toLowerCase();
    return lower === "characteristics:" || lower === "suitable mood:" || lower === "suitable environments:";
  });
  const tags: string[] = [];
  for (let i = 0; i < lines.length; i++) {
    const lower = lines[i].trim().toLowerCase();
    if (lower === "characteristics:" || lower === "suitable mood:" || lower === "suitable environments:") {
      if (i + 1 < lines.length) {
        const content = lines[i + 1].trim();
        if (content) {
          tags.push(...content.split(",").map((t) => t.trim()).filter(Boolean));
        }
      }
    }
  }
  return tags;
}

export function scoreCandidate(
  user: UserScentProfile,
  perfume: PerfumeEnriched,
): ScoredCandidate {
  const w = RECOMMENDATION_CONFIG.scoring;

  const topNoteScore = familyOverlapScore(user.topFamilies, perfume.top_profile);
  const middleNoteScore = familyOverlapScore(user.middleFamilies, perfume.middle_profile);
  const baseNoteScore = familyOverlapScore(user.baseFamilies, perfume.base_profile);
  const noteWeights = RECOMMENDATION_CONFIG.noteLayerWeights;
  const notesScore =
    noteWeights.top * topNoteScore +
    noteWeights.middle * middleNoteScore +
    noteWeights.base * baseNoteScore;

  const sensoryScore = 1 - sensoryDistance(user, perfume);

  const perfumeTags = extractTagsFromSemantic(perfume.semantic_text);
  const moodScore = tagOverlap(user.moodTags, perfumeTags);
  const environmentScore = tagOverlap(user.environmentTags, perfumeTags);

  const genderScore = getGenderAffinity(user.identity, perfume.gender_profile);

  const semanticScore = 0.5 * notesScore + 0.3 * sensoryScore + 0.2 * (moodScore + environmentScore) / 2;

  const scores: ScoreBreakdown = {
    semantic: semanticScore,
    notes: notesScore,
    sensory: sensoryScore,
    mood: moodScore,
    environment: environmentScore,
    gender: genderScore,
  };

  const finalScore =
    w.semantic * semanticScore +
    w.notes * notesScore +
    w.sensory * sensoryScore +
    w.mood * moodScore +
    w.environment * environmentScore +
    w.gender * genderScore;

  return { perfume, scores, finalScore };
}

export function rankCandidates(
  user: UserScentProfile,
  perfumes: PerfumeEnriched[],
  topN: number = RECOMMENDATION_CONFIG.candidateCount.deterministicRanking,
): ScoredCandidate[] {
  return perfumes
    .map((p) => scoreCandidate(user, p))
    .sort((a, b) => b.finalScore - a.finalScore)
    .slice(0, topN);
}

export function vectorRetrieval(
  user: UserScentProfile,
  perfumes: PerfumeEnriched[],
  topN: number = RECOMMENDATION_CONFIG.candidateCount.vectorRetrieval,
): PerfumeEnriched[] {
  const scored = perfumes
    .map((p) => scoreCandidate(user, p))
    .sort((a, b) => b.finalScore - a.finalScore)
    .slice(0, topN);
  return scored.map((s) => s.perfume);
}

export { cosineSim };
