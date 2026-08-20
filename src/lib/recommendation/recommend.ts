import type {
  QuizAnswer,
  UserScentProfile,
  PerfumeEnriched,
  ScoredCandidate,
  RecommendationResult,
  RecommendationItem,
} from "./types";
import { buildUserProfile, quizAnswersFromOptionIds } from "./profileBuilder";
import { getEnrichedPerfumes } from "./perfumeEnricher";
import { rankCandidates, vectorRetrieval } from "./structuredScorer";
import { RECOMMENDATION_CONFIG } from "./config";

function buildFallbackRecommendations(
  candidates: ScoredCandidate[],
): RecommendationItem[] {
  return candidates.slice(0, 3).map((c, i) => ({
    perfumeId: c.perfume.id,
    rank: (i + 1) as 1 | 2 | 3,
    confidence: c.finalScore,
    reason: buildFallbackReason(c),
    matchedTraits: extractMatchedTraits(c),
  }));
}

function buildFallbackReason(candidate: ScoredCandidate): string {
  const p = candidate.perfume;
  const parts: string[] = [];
  if (p.freshness > 0.6) parts.push("ferah");
  if (p.warmth > 0.6) parts.push("sıcak");
  if (p.sweetness > 0.6) parts.push("tatlı");
  if (p.intensity > 0.6) parts.push("yoğun");
  if (p.greenness > 0.6) parts.push("yeşil");
  if (p.softness > 0.6) parts.push("yumuşak");
  if (p.dryness > 0.6) parts.push("kuru");
  if (p.brightness > 0.6) parts.push("parlak");
  if (p.cleanliness > 0.6) parts.push("temiz");

  const topFam = [...new Set(p.top_profile)].slice(0, 2).join(" ve ");
  const baseFam = [...new Set(p.base_profile)].slice(0, 2).join(" ve ");

  return `${topFam ? topFam + " açılışı, " : ""}${baseFam ? baseFam + " tabanı" : ""} profilinize uyumlu. ${parts.length > 0 ? "Öne çıkan: " + parts.join(", ") + "." : ""}`.trim();
}

function extractMatchedTraits(candidate: ScoredCandidate): string[] {
  const p = candidate.perfume;
  const traits: string[] = [];
  if (p.freshness > 0.6) traits.push("ferah");
  if (p.warmth > 0.6) traits.push("sıcak");
  if (p.sweetness > 0.6) traits.push("tatlı");
  if (p.intensity > 0.6) traits.push("yoğun");
  if (p.greenness > 0.6) traits.push("yeşil");
  if (p.softness > 0.6) traits.push("yumuşak");
  if (p.dryness > 0.6) traits.push("kuru");
  if (p.brightness > 0.6) traits.push("parlak");
  if (p.cleanliness > 0.6) traits.push("temiz");
  return traits.slice(0, 6);
}

export interface RecommendOptions {
  llmRerank?: (candidates: ScoredCandidate[], userProfile: UserScentProfile) => Promise<RecommendationItem[]>;
}

export interface RecommendationFilters {
  gender: string;
  collection: string;
}

function filterPerfumes(perfumes: PerfumeEnriched[], filters?: RecommendationFilters): PerfumeEnriched[] {
  if (!filters) return perfumes;
  return perfumes.filter((perfume) => {
    const genderMap: Record<string, string> = { Kadın: "female", Erkek: "male", Unisex: "unisex" };
    const genderMatch = perfume.gender_profile === (genderMap[filters.gender] ?? "unisex");
    const collectionMatch = perfume.name.toLocaleLowerCase("tr-TR").includes(filters.collection.toLocaleLowerCase("tr-TR"));
    return genderMatch && collectionMatch;
  });
}

export async function recommend(
  selectedIdsPerStep: string[][],
  options: RecommendOptions = {},
  filters?: RecommendationFilters,
): Promise<RecommendationResult> {
  const t0 = performance.now();

  const answers = quizAnswersFromOptionIds(selectedIdsPerStep);
  const userProfile = buildUserProfile(answers);
  const tProfile = performance.now();

  const allPerfumes = filterPerfumes(getEnrichedPerfumes(), filters);
  const semanticCandidates = vectorRetrieval(userProfile, allPerfumes);
  const ranked = rankCandidates(userProfile, semanticCandidates);
  const tRank = performance.now();

  let recommendations: RecommendationItem[];
  let llmUsed = false;
  let tLlm = tRank;

  if (options.llmRerank) {
    try {
      const llmResult = await options.llmRerank(ranked, userProfile);
      const validIds = new Set(allPerfumes.map((p) => p.id));
      const allValid = llmResult.every((r) => validIds.has(r.perfumeId));
      if (allValid && llmResult.length === 3) {
        recommendations = llmResult;
        llmUsed = true;
      } else {
        recommendations = buildFallbackRecommendations(ranked);
      }
      tLlm = performance.now();
    } catch {
      recommendations = buildFallbackRecommendations(ranked);
      tLlm = performance.now();
    }
  } else {
    recommendations = buildFallbackRecommendations(ranked);
  }

  const tEnd = performance.now();

  const perfumeMap = new Map(allPerfumes.map((p) => [p.id, p]));
  const recommendedPerfumes = recommendations
    .map((r) => perfumeMap.get(r.perfumeId))
    .filter((p): p is PerfumeEnriched => p !== undefined);

  return {
    userProfileSummary: userProfile.semanticProfile,
    recommendations,
    perfumes: recommendedPerfumes,
    candidates: ranked,
    llmUsed,
    timings: {
      profileBuildMs: Math.round(tProfile - t0),
      rankingMs: Math.round(tRank - tProfile),
      llmMs: Math.round(tLlm - tRank),
      totalMs: Math.round(tEnd - t0),
    },
  };
}

export function recommendSync(
  selectedIdsPerStep: string[][],
  filters?: RecommendationFilters,
): RecommendationResult {
  const t0 = performance.now();

  const answers = quizAnswersFromOptionIds(selectedIdsPerStep);
  const userProfile = buildUserProfile(answers);
  const tProfile = performance.now();

  const allPerfumes = filterPerfumes(getEnrichedPerfumes(), filters);
  const semanticCandidates = vectorRetrieval(userProfile, allPerfumes);
  const ranked = rankCandidates(userProfile, semanticCandidates);
  const tRank = performance.now();

  const recommendations = buildFallbackRecommendations(ranked);

  const tEnd = performance.now();

  const perfumeMap = new Map(allPerfumes.map((p) => [p.id, p]));
  const recommendedPerfumes = recommendations
    .map((r) => perfumeMap.get(r.perfumeId))
    .filter((p): p is PerfumeEnriched => p !== undefined);

  return {
    userProfileSummary: userProfile.semanticProfile,
    recommendations,
    perfumes: recommendedPerfumes,
    candidates: ranked,
    llmUsed: false,
    timings: {
      profileBuildMs: Math.round(tProfile - t0),
      rankingMs: Math.round(tRank - tProfile),
      llmMs: 0,
      totalMs: Math.round(tEnd - t0),
    },
  };
}

export function profileHash(answers: QuizAnswer[]): string {
  const sorted = answers
    .map((a) => `${a.stepId}:${a.optionId}`)
    .sort()
    .join("|");
  let hash = 0;
  for (let i = 0; i < sorted.length; i++) {
    hash = ((hash << 5) - hash) + sorted.charCodeAt(i);
    hash |= 0;
  }
  return hash.toString(36);
}

export type { ScoredCandidate, RecommendationResult, RecommendationItem };
