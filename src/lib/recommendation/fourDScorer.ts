import products from "@/data/loris-products.json";
import scoring from "@/data/quiz-scoring.json";
import type { PerfumeEnriched, RecommendationResult, RecommendationItem, ScoredCandidate } from "./types";
import type { RecommendationFilters } from "./recommend";

type Vector = { freshness: number; warmth: number; sweetness: number; intensity: number };
const dimensions: (keyof Vector)[] = ["freshness", "warmth", "sweetness", "intensity"];

function mean(values: number[]) { return values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0; }
function avgVector(vectors: Vector[]): Vector { return Object.fromEntries(dimensions.map((d) => [d, mean(vectors.map((v) => v[d]))])) as Vector; }
function distance(a: Vector, b: Vector) { return Math.sqrt(mean(dimensions.map((d) => ((a[d] - b[d]) / 10) ** 2))); }

function toPerfume(product: (typeof products)[number]): PerfumeEnriched {
  const vectors = [product.top_notes_vector, product.middle_notes_vector, product.base_notes_vector];
  const vector = avgVector(vectors);
  return {
    id: product.id, name: product.name, gender_profile: product.gender_profile as PerfumeEnriched["gender_profile"],
    top_profile: product.top_notes, middle_profile: product.middle_notes, base_profile: product.base_notes,
    accords: [], ...vector, greenness: 0, brightness: 0, softness: 0, dryness: 0, cleanliness: 0,
    semantic_text: `${product.collection} ${product.name}`,
  };
}

export function recommendFourD(selectedIds: string[][], filters: RecommendationFilters): RecommendationResult {
  const layerVectors: Record<"top" | "middle" | "base", Vector[]> = { top: [], middle: [], base: [] };
  scoring.questions.forEach((question) => {
    const selected = selectedIds[Number(question.id.slice(1)) - 1]?.[0];
    const option = question.options.find((item) => item.id === selected) ?? question.options[0];
    if (!option) return;
    (Object.keys(layerVectors) as (keyof typeof layerVectors)[]).forEach((layer) => {
      const weight = question.layerWeights[layer];
      const count = Math.max(1, Math.round(weight * 100));
      for (let i = 0; i < count; i++) layerVectors[layer].push(option.vector as Vector);
    });
  });
  const target = { top: avgVector(layerVectors.top), middle: avgVector(layerVectors.middle), base: avgVector(layerVectors.base) };
  const genderMap: Record<string, string> = { Kadın: "female", Erkek: "male", Unisex: "unisex" };
  const eligible = products.filter((p) => p.recommendation_eligible !== false && p.gender_profile === (genderMap[filters.gender] ?? filters.gender.toLowerCase()) && p.collection.toLowerCase() === filters.collection.toLowerCase());
  const candidates: ScoredCandidate[] = eligible.map((product) => {
    const perfume = toPerfume(product);
    const score = 1 - mean([distance(target.top, product.top_notes_vector), distance(target.middle, product.middle_notes_vector), distance(target.base, product.base_notes_vector)]);
    return { perfume, finalScore: Math.max(0, score), scores: { semantic: score, notes: score, sensory: score, mood: score, environment: score, gender: 1 } };
  }).sort((a, b) => b.finalScore - a.finalScore);
  const top = candidates.slice(0, 3);
  const recommendations: RecommendationItem[] = top.map((candidate, index) => ({ perfumeId: candidate.perfume.id, rank: (index + 1) as 1 | 2 | 3, confidence: candidate.finalScore, reason: "Üst, orta ve alt nota eğilimlerinizle en yakın dört boyutlu eşleşme.", matchedTraits: ["ferahlık", "sıcaklık", "tatlılık", "yoğunluk"] }));
  return { userProfileSummary: `Üst nota: ${Object.values(target.top).map((v) => v.toFixed(1)).join(" / ")} · Orta nota: ${Object.values(target.middle).map((v) => v.toFixed(1)).join(" / ")} · Alt nota: ${Object.values(target.base).map((v) => v.toFixed(1)).join(" / ")}`, recommendations, perfumes: top.map((c) => c.perfume), candidates, llmUsed: false, timings: { profileBuildMs: 0, rankingMs: 0, llmMs: 0, totalMs: 0 } };
}
