// Minimal scorer: overlap + normalized weights
export function countOverlap(user: string[], perfume: string[]) {
  const pSet = new Set(perfume);
  let cnt = 0;
  for (const n of user) if (pSet.has(n)) cnt++;
  return cnt;
}

export function computeOverlapScore(selectedProfiles: string[], perfumeMeta: any) {
  // perfumeMeta expected to have top_profile, middle_profile, base_profile arrays
  const topNotes = new Set(perfumeMeta.top_profile || []);
  const middleNotes = new Set(perfumeMeta.middle_profile || []);
  const baseNotes = new Set(perfumeMeta.base_profile || []);

  const userTop = selectedProfiles.filter((n) => topNotes.has(n));
  const userMiddle = selectedProfiles.filter((n) => middleNotes.has(n));
  const userBase = selectedProfiles.filter((n) => baseNotes.has(n));

  const topScore = userTop.length > 0 ? (userTop.length / (userTop.length)) : 0;
  const midScore = userMiddle.length > 0 ? (userMiddle.length / (userMiddle.length)) : 0;
  const baseScore = userBase.length > 0 ? (userBase.length / (userBase.length)) : 0;

  // In practice use countOverlap / normalize; here we do simple weighting
  const topWeight = 0.25, midWeight = 0.35, baseWeight = 0.4;
  const combined = topWeight * topScore + midWeight * midScore + baseWeight * baseScore;
  return Number.isFinite(combined) ? combined : 0;
}

export function combineScores(sim: number, overlap: number, genderMatch = false) {
  const w1 = 0.6, w2 = 0.35, w3 = 0.05;
  const genderBoost = genderMatch ? 0.1 : 0;
  return w1 * sim + w2 * overlap + w3 * genderBoost;
}
