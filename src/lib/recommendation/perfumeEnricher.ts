import { PERFUMES, type Perfume } from "@/data/perfumes";
import type { PerfumeEnriched, Gender } from "./types";

function normalizeGender(genderArr: string[]): Gender {
  const g = (genderArr[0] || "").toLowerCase();
  if (g === "erkek" || g === "male" || g === "maskülen" || g === "maskulen") return "male";
  if (g === "kadın" || g === "kadin" || g === "female" || g === "feminen") return "female";
  return "unisex";
}

const SENSORY_MAP: Record<string, Partial<Record<keyof Omit<PerfumeEnriched, "id" | "name" | "gender_profile" | "top_profile" | "middle_profile" | "base_profile" | "accords" | "semantic_text">, number>>> = {
  "Akuatik & Ferah": { freshness: 0.9, cleanliness: 0.8, brightness: 0.7 },
  "Narenciye": { freshness: 0.8, brightness: 0.85, cleanliness: 0.6 },
  "Aromatik & Yeşil": { greenness: 0.85, freshness: 0.6, dryness: 0.4 },
  "Çiçeksi": { softness: 0.7, brightness: 0.6, sweetness: 0.3 },
  "Meyvemsi": { sweetness: 0.6, brightness: 0.7, softness: 0.5 },
  "Meyvemsi & Tatlı": { sweetness: 0.8, softness: 0.7, warmth: 0.4 },
  "Sıcak & Yoğun": { warmth: 0.9, intensity: 0.85, dryness: 0.3 },
  "Baharatlı": { warmth: 0.7, intensity: 0.7, dryness: 0.5 },
  "Odunsu": { warmth: 0.6, dryness: 0.7, intensity: 0.5 },
  "Amber & Reçineli": { warmth: 0.8, softness: 0.6, sweetness: 0.4 },
  "Misk": { softness: 0.8, cleanliness: 0.7, warmth: 0.3 },
  "Topraksı & Dumanlı": { dryness: 0.85, warmth: 0.6, intensity: 0.6 },
  "Gourmand & Tatlı": { sweetness: 0.9, warmth: 0.7, softness: 0.6 },
  "Baharatlı & Aromatik": { dryness: 0.6, warmth: 0.5, greenness: 0.3 },
};

function computeSensory(allNotes: string[]): Pick<PerfumeEnriched, "freshness" | "warmth" | "sweetness" | "intensity" | "greenness" | "brightness" | "softness" | "dryness" | "cleanliness"> {
  const acc: Record<string, number> = {
    freshness: 0, warmth: 0, sweetness: 0, intensity: 0,
    greenness: 0, brightness: 0, softness: 0, dryness: 0, cleanliness: 0,
  };
  let count = 0;

  for (const note of allNotes) {
    const map = SENSORY_MAP[note];
    if (map) {
      for (const [key, val] of Object.entries(map)) {
        acc[key] = (acc[key] || 0) + val;
      }
      count++;
    }
  }

  const keys = ["freshness", "warmth", "sweetness", "intensity", "greenness", "brightness", "softness", "dryness", "cleanliness"] as const;
  const result = {} as Record<string, number>;
  for (const k of keys) {
    result[k] = count > 0 ? Math.min(1, acc[k] / count) : 0;
  }
  return result as Pick<PerfumeEnriched, "freshness" | "warmth" | "sweetness" | "intensity" | "greenness" | "brightness" | "softness" | "dryness" | "cleanliness">;
}

function buildSemanticText(perfume: PerfumeEnriched): string {
  const chars: string[] = [];
  if (perfume.freshness > 0.5) chars.push("fresh");
  if (perfume.cleanliness > 0.5) chars.push("clean");
  if (perfume.greenness > 0.5) chars.push("green");
  if (perfume.warmth > 0.6) chars.push("warm");
  if (perfume.sweetness > 0.6) chars.push("sweet");
  if (perfume.intensity > 0.6) chars.push("intense");
  if (perfume.softness > 0.6) chars.push("soft");
  if (perfume.dryness > 0.6) chars.push("dry");
  if (perfume.brightness > 0.6) chars.push("bright");

  const moods: string[] = [];
  if (perfume.freshness > 0.6) moods.push("calm", "confident");
  if (perfume.warmth > 0.6) moods.push("cozy", "passionate");
  if (perfume.softness > 0.6) moods.push("gentle", "elegant");
  if (perfume.intensity > 0.6) moods.push("bold", "confident");

  const envs: string[] = [];
  if (perfume.freshness > 0.6) envs.push("daytime", "summer", "office");
  if (perfume.warmth > 0.6) envs.push("evening", "winter");
  if (perfume.intensity > 0.6) envs.push("evening", "special-occasion");
  if (perfume.cleanliness > 0.6) envs.push("office", "casual");

  return [
    `Perfume: ${perfume.name}`,
    ``,
    `Gender: ${perfume.gender_profile}`,
    ``,
    `Top notes:`,
    perfume.top_profile.join(", "),
    ``,
    `Middle notes:`,
    perfume.middle_profile.join(", "),
    ``,
    `Base notes:`,
    perfume.base_profile.join(", "),
    ``,
    `Top families:`,
    [...new Set(perfume.top_profile)].join(", "),
    ``,
    `Middle families:`,
    [...new Set(perfume.middle_profile)].join(", "),
    ``,
    `Base families:`,
    [...new Set(perfume.base_profile)].join(", "),
    ``,
    `Characteristics:`,
    chars.join(", "),
    ``,
    `Suitable mood:`,
    moods.join(", "),
    ``,
    `Suitable environments:`,
    envs.join(", "),
  ].join("\n");
}

let enrichedCache: PerfumeEnriched[] | null = null;

export function getEnrichedPerfumes(): PerfumeEnriched[] {
  if (enrichedCache) return enrichedCache;

  const result = PERFUMES.map((p: Perfume): PerfumeEnriched => {
    const allNotes = [...p.top_profile, ...p.middle_profile, ...p.base_profile];
    const sensory = computeSensory(allNotes);
    const accords = [...new Set(allNotes)];

    const enriched: PerfumeEnriched = {
      id: p.id,
      name: p.name,
      gender_profile: normalizeGender(p.gender_profile),
      top_profile: p.top_profile,
      middle_profile: p.middle_profile,
      base_profile: p.base_profile,
      accords,
      ...sensory,
      semantic_text: "",
    };
    enriched.semantic_text = buildSemanticText(enriched);
    return enriched;
  });
  enrichedCache = result;
  return result;
}
