import { createClient } from "@supabase/supabase-js";
import type { RecommendationResult, RecommendationItem, ScoredCandidate, PerfumeEnriched } from "./types";
import { recommendSync } from "./recommend";
import { getEnrichedPerfumes } from "./perfumeEnricher";
import { buildUserProfile, quizAnswersFromOptionIds } from "./profileBuilder";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface EdgeFunctionResponse {
  recommendations: RecommendationItem[];
  llmUsed: boolean;
}

export async function getRecommendations(
  selectedIdsPerStep: string[][],
): Promise<RecommendationResult> {
  const t0 = performance.now();

  const syncResult = recommendSync(selectedIdsPerStep);

  try {
    const userProfile = buildUserProfile(quizAnswersFromOptionIds(selectedIdsPerStep));
    const allPerfumes = getEnrichedPerfumes();
    const perfumeMap = new Map(allPerfumes.map((p) => [p.id, p]));

    const candidatesForEdge = syncResult.candidates.slice(0, 12).map((c) => ({
      id: c.perfume.id,
      name: c.perfume.name,
      gender_profile: c.perfume.gender_profile,
      top_profile: c.perfume.top_profile,
      middle_profile: c.perfume.middle_profile,
      base_profile: c.perfume.base_profile,
      freshness: c.perfume.freshness,
      warmth: c.perfume.warmth,
      sweetness: c.perfume.sweetness,
      intensity: c.perfume.intensity,
      greenness: c.perfume.greenness,
      brightness: c.perfume.brightness,
      softness: c.perfume.softness,
      dryness: c.perfume.dryness,
      cleanliness: c.perfume.cleanliness,
      finalScore: c.finalScore,
    }));

    const { data, error } = await supabase.functions.invoke<EdgeFunctionResponse>(
      "recommend-perfumes",
      {
        body: {
          userProfile: userProfile.semanticProfile,
          candidates: candidatesForEdge,
        },
      },
    );

    if (error || !data || !data.recommendations || data.recommendations.length !== 3) {
      return syncResult;
    }

    const recommendedPerfumes = data.recommendations
      .map((r) => perfumeMap.get(r.perfumeId))
      .filter((p): p is PerfumeEnriched => p !== undefined);

    const tEnd = performance.now();

    return {
      ...syncResult,
      recommendations: data.recommendations,
      perfumes: recommendedPerfumes,
      llmUsed: data.llmUsed,
      timings: {
        ...syncResult.timings,
        llmMs: Math.round(tEnd - t0) - syncResult.timings.totalMs,
        totalMs: Math.round(tEnd - t0),
      },
    };
  } catch {
    return syncResult;
  }
}
