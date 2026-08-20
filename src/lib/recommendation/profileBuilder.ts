import type { Gender, UserScentProfile, QuizAnswer } from "./types";
import { QUIZ_STEPS } from "@/data/quizData";

const FAMILY_LAYERS: Record<string, "top" | "middle" | "base"> = {
  "Akuatik & Ferah": "top",
  "Çiçeksi": "top",
  "Aromatik & Yeşil": "top",
  "Narenciye": "top",
  "Meyvemsi": "top",
  "Sıcak & Yoğun": "top",
  "Meyvemsi & Tatlı": "middle",
  "Baharatlı": "middle",
  "Odunsu": "middle",
  "Amber & Reçineli": "middle",
  "Misk": "base",
  "Topraksı & Dumanlı": "base",
  "Gourmand & Tatlı": "base",
  "Baharatlı & Aromatik": "base",
};

const SENSORY_MAP: Record<string, Partial<Record<keyof Omit<UserScentProfile, "identity" | "topFamilies" | "middleFamilies" | "baseFamilies" | "styleTags" | "moodTags" | "environmentTags" | "semanticProfile">, number>>> = {
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

const STYLE_TAGS: Record<string, string[]> = {
  "ipek": ["elegant", "refined"],
  "keten": ["natural", "casual"],
  "kadife": ["luxurious", "sophisticated"],
  "deri": ["bold", "masculine"],
  "deniz": ["fresh", "airy"],
  "orman": ["natural", "earthy"],
  "portakal": ["bright", "energetic"],
  "baharat": ["warm", "spicy"],
  "yagmur": ["clean", "calm"],
  "dalgalar": ["powerful", "deep"],
  "samine": ["cozy", "warm"],
  "yayli": ["mysterious", "deep"],
  "sabah": ["fresh", "bright"],
  "gunbatimi": ["warm", "romantic"],
  "mum": ["romantic", "soft"],
  "ay": ["mysterious", "elegant"],
  "geometrik": ["modern", "sharp"],
  "organik": ["natural", "soft"],
  "akiskan": ["balanced", "calm"],
  "katmanli": ["complex", "rich"],
  "dalga": ["calm", "rhythmic"],
  "kumas": ["airy", "light"],
  "duman": ["mysterious", "intense"],
  "kivilcim": ["energetic", "warm"],
  "eksimsi": ["vibrant", "fresh"],
  "buruk": ["green", "herbal"],
  "yumustatli": ["soft", "sweet"],
  "acibaharat": ["dark", "intense"],
  "aydinliksahil": ["fresh", "airy"],
  "avlu": ["peaceful", "natural"],
  "koyuorman": ["mysterious", "deep"],
  "gecesalonu": ["cozy", "elegant"],
};

const MOOD_TAGS: Record<string, string[]> = {
  "deniz": ["calm", "free"],
  "orman": ["serene", "grounded"],
  "portakal": ["energetic", "happy"],
  "baharat": ["warm", "passionate"],
  "yagmur": ["calm", "reflective"],
  "dalgalar": ["powerful", "confident"],
  "samine": ["cozy", "nostalgic"],
  "yayli": ["melancholic", "deep"],
  "sabah": ["optimistic", "fresh"],
  "gunbatimi": ["romantic", "warm"],
  "mum": ["intimate", "romantic"],
  "ay": ["mysterious", "contemplative"],
  "dalga": ["calm", "meditative"],
  "kumas": ["light", "playful"],
  "duman": ["mysterious", "introspective"],
  "kivilcim": ["energetic", "passionate"],
  "eksimsi": ["vibrant", "lively"],
  "buruk": ["calm", "focused"],
  "yumustatli": ["comforted", "happy"],
  "acibaharat": ["bold", "intense"],
};

const ENV_TAGS: Record<string, string[]> = {
  "deniz": ["seaside", "outdoor"],
  "orman": ["forest", "nature"],
  "portakal": ["garden", "outdoor"],
  "baharat": ["warm-climate", "evening"],
  "yagmur": ["rainy-day", "indoor"],
  "dalgalar": ["seaside", "stormy"],
  "samine": ["fireplace", "winter"],
  "yayli": ["concert", "evening"],
  "sabah": ["morning", "outdoor"],
  "gunbatimi": ["sunset", "outdoor"],
  "mum": ["evening", "intimate"],
  "ay": ["night", "outdoor"],
  "aydinliksahil": ["seaside", "summer"],
  "avlu": ["courtyard", "spring"],
  "koyuorman": ["forest", "autumn"],
  "gecesalonu": ["lounge", "evening"],
};

function normalizeGender(id: string): Gender {
  if (id === "maskulen" || id === "erkek") return "male";
  if (id === "feminen" || id === "kadın" || id === "kadin") return "female";
  return "unisex";
}

function buildSemanticText(
  identity: Gender,
  topFamilies: Record<string, number>,
  middleFamilies: Record<string, number>,
  baseFamilies: Record<string, number>,
  sensory: Pick<UserScentProfile, "freshness" | "warmth" | "sweetness" | "intensity" | "greenness" | "brightness" | "softness" | "dryness" | "cleanliness">,
  styleTags: string[],
  moodTags: string[],
  environmentTags: string[],
): string {
  const top = Object.entries(topFamilies).sort((a, b) => b[1] - a[1]).map(([k]) => k);
  const middle = Object.entries(middleFamilies).sort((a, b) => b[1] - a[1]).map(([k]) => k);
  const base = Object.entries(baseFamilies).sort((a, b) => b[1] - a[1]).map(([k]) => k);

  const chars: string[] = [];
  if (sensory.freshness > 0.5) chars.push("fresh");
  if (sensory.cleanliness > 0.5) chars.push("clean");
  if (sensory.greenness > 0.5) chars.push("green");
  if (sensory.warmth > 0.6) chars.push("warm");
  if (sensory.sweetness > 0.6) chars.push("sweet");
  if (sensory.intensity > 0.6) chars.push("intense");
  if (sensory.softness > 0.6) chars.push("soft");
  if (sensory.dryness > 0.6) chars.push("dry");
  if (sensory.brightness > 0.6) chars.push("bright");

  return [
    `Gender: ${identity}`,
    ``,
    `Top families:`,
    top.join(", "),
    ``,
    `Middle families:`,
    middle.join(", "),
    ``,
    `Base families:`,
    base.join(", "),
    ``,
    `Characteristics:`,
    chars.join(", "),
    ``,
    `Style:`,
    styleTags.join(", "),
    ``,
    `Mood:`,
    moodTags.join(", "),
    ``,
    `Environments:`,
    environmentTags.join(", "),
  ].join("\n");
}

export function buildUserProfile(answers: QuizAnswer[]): UserScentProfile {
  const topFamilies: Record<string, number> = {};
  const middleFamilies: Record<string, number> = {};
  const baseFamilies: Record<string, number> = {};
  const sensory: Record<string, number> = {
    freshness: 0, warmth: 0, sweetness: 0, intensity: 0,
    greenness: 0, brightness: 0, softness: 0, dryness: 0, cleanliness: 0,
  };
  const styleSet = new Set<string>();
  const moodSet = new Set<string>();
  const envSet = new Set<string>();
  let identity: Gender = "unisex";

  let sensoryCount = 0;

  for (const answer of answers) {
    if (answer.stepId === "identity") {
      identity = normalizeGender(answer.optionId);
    }

    for (const profile of answer.profiles) {
      const layer = FAMILY_LAYERS[profile];
      if (layer === "top") topFamilies[profile] = (topFamilies[profile] || 0) + 1;
      else if (layer === "middle") middleFamilies[profile] = (middleFamilies[profile] || 0) + 1;
      else if (layer === "base") baseFamilies[profile] = (baseFamilies[profile] || 0) + 1;

      const sensoryMap = SENSORY_MAP[profile];
      if (sensoryMap) {
        for (const [key, val] of Object.entries(sensoryMap)) {
          sensory[key] = (sensory[key] || 0) + val;
        }
        sensoryCount++;
      }
    }

    const styles = STYLE_TAGS[answer.optionId];
    if (styles) styles.forEach((s) => styleSet.add(s));

    const moods = MOOD_TAGS[answer.optionId];
    if (moods) moods.forEach((m) => moodSet.add(m));

    const envs = ENV_TAGS[answer.optionId];
    if (envs) envs.forEach((e) => envSet.add(e));
  }

  const sensoryKeys = ["freshness", "warmth", "sweetness", "intensity", "greenness", "brightness", "softness", "dryness", "cleanliness"] as const;
  const normalizedSensory = {} as Record<string, number>;
  for (const key of sensoryKeys) {
    normalizedSensory[key] = sensoryCount > 0 ? Math.min(1, sensory[key] / sensoryCount) : 0;
  }

  const styleTags = [...styleSet];
  const moodTags = [...moodSet];
  const environmentTags = [...envSet];

  const semanticProfile = buildSemanticText(
    identity, topFamilies, middleFamilies, baseFamilies,
    normalizedSensory as Pick<UserScentProfile, "freshness" | "warmth" | "sweetness" | "intensity" | "greenness" | "brightness" | "softness" | "dryness" | "cleanliness">,
    styleTags, moodTags, environmentTags,
  );

  return {
    identity,
    topFamilies,
    middleFamilies,
    baseFamilies,
    freshness: normalizedSensory.freshness,
    warmth: normalizedSensory.warmth,
    sweetness: normalizedSensory.sweetness,
    intensity: normalizedSensory.intensity,
    greenness: normalizedSensory.greenness,
    brightness: normalizedSensory.brightness,
    softness: normalizedSensory.softness,
    dryness: normalizedSensory.dryness,
    cleanliness: normalizedSensory.cleanliness,
    styleTags,
    moodTags,
    environmentTags,
    semanticProfile,
  };
}

export function quizAnswersFromOptionIds(selectedIdsPerStep: string[][]): QuizAnswer[] {
  return selectedIdsPerStep.map((optionIds, i) => {
    const step = QUIZ_STEPS[i];
    const options = step.options.filter((o) => optionIds.includes(o.id));
    return {
      stepId: step.id,
      optionId: options[0]?.id ?? "",
      profiles: options.flatMap((o) => o.profile),
    };
  });
}
