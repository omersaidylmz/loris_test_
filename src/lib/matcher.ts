import { PERFUMES, type Perfume } from "@/data/perfumes";

export interface MatchResult {
  perfume: Perfume;
  score: number;
  topScore: number;
  middleScore: number;
  baseScore: number;
}

const TOP_NOTES = new Set([
  "Akuatik & Ferah","Çiçeksi","Aromatik & Yeşil","Narenciye","Meyvemsi","Sıcak & Yoğun",
]);

const MIDDLE_NOTES = new Set([
  "Çiçeksi","Meyvemsi & Tatlı","Baharatlı","Aromatik & Yeşil","Odunsu","Amber & Reçineli",
]);

const BASE_NOTES = new Set([
  "Misk","Topraksı & Dumanlı","Odunsu","Amber & Reçineli","Gourmand & Tatlı","Baharatlı & Aromatik",
]);

function countOverlap(user: string[], perfume: string[]): number {
  const pSet = new Set(perfume);
  let count = 0;
  for (const note of user) {
    if (pSet.has(note)) count++;
  }
  return count;
}

export function computeMatches(
  selectedProfiles: string[],
  gender: string,
  topN: number = 5,
): MatchResult[] {
  const genderMap: Record<string, string[]> = {
    maskulen: ["Maskulin"],
    feminen: ["Feminin"],
  };
  const genderProfiles = genderMap[gender] || [];

  const userTop = selectedProfiles.filter((n) => TOP_NOTES.has(n));
  const userMiddle = selectedProfiles.filter((n) => MIDDLE_NOTES.has(n));
  const userBase = selectedProfiles.filter((n) => BASE_NOTES.has(n));

  const results: MatchResult[] = PERFUMES.map((perfume) => {
    const topScore = countOverlap(userTop, perfume.top_profile);
    const middleScore = countOverlap(userMiddle, perfume.middle_profile);
    const baseScore = countOverlap(userBase, perfume.base_profile);

    const topWeight = 0.40;
    const middleWeight = 0.35;
    const baseWeight = 0.25;

    const topNormalized = userTop.length > 0 ? topScore / userTop.length : 0;
    const middleNormalized = userMiddle.length > 0 ? middleScore / userMiddle.length : 0;
    const baseNormalized = userBase.length > 0 ? baseScore / userBase.length : 0;

    let score =
      topWeight * topNormalized +
      middleWeight * middleNormalized +
      baseWeight * baseNormalized;

    if (genderProfiles.length > 0) {
      const genderMatch = genderProfiles.some((g) =>
        perfume.name.toLowerCase().includes(genderToKeyword(g)),
      );
      if (genderMatch) score += 0.1;
    }

    return {
      perfume,
      score,
      topScore,
      middleScore,
      baseScore,
    };
  });

  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, topN);
}

function genderToKeyword(g: string): string {
  switch (g) {
    case "Maskulin": return "erkek";
    case "Feminin": return "kadın";
    default: return "";
  }
}

export function getProfileSummary(selectedProfiles: string[]): Record<string, number> {
  const summary: Record<string, number> = {};
  for (const p of selectedProfiles) {
    summary[p] = (summary[p] || 0) + 1;
  }
  return summary;
}

export const ALL_NOTES = [
  ...TOP_NOTES,
  ...MIDDLE_NOTES,
  ...BASE_NOTES,
];
