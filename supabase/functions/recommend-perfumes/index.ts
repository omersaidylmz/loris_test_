import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface CandidatePerfume {
  id: string;
  name: string;
  gender_profile: string;
  top_profile: string[];
  middle_profile: string[];
  base_profile: string[];
  freshness: number;
  warmth: number;
  sweetness: number;
  intensity: number;
  greenness: number;
  brightness: number;
  softness: number;
  dryness: number;
  cleanliness: number;
  finalScore: number;
}

interface RecommendRequest {
  userProfile: string;
  candidates: CandidatePerfume[];
}

interface LLMRecommendation {
  perfumeId: string;
  rank: number;
  reason: string;
  matchedTraits: string[];
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const body = await req.json() as RecommendRequest;
    const { userProfile, candidates } = body;

    if (!userProfile || !candidates || candidates.length === 0) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const topCandidates = candidates.slice(0, 12);

    const groqApiKey = Deno.env.get("GROQ_API_KEY");
    if (!groqApiKey) {
      return new Response(JSON.stringify({
        recommendations: buildFallback(topCandidates),
        llmUsed: false,
      }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const perfumeList = topCandidates.map((c, i) => {
      const top = [...new Set(c.top_profile)].join(", ");
      const mid = [...new Set(c.middle_profile)].join(", ");
      const base = [...new Set(c.base_profile)].join(", ");
      const chars: string[] = [];
      if (c.freshness > 0.5) chars.push("ferah");
      if (c.warmth > 0.6) chars.push("sıcak");
      if (c.sweetness > 0.6) chars.push("tatlı");
      if (c.intensity > 0.6) chars.push("yoğun");
      if (c.greenness > 0.5) chars.push("yeşil");
      if (c.softness > 0.6) chars.push("yumuşak");
      if (c.dryness > 0.6) chars.push("kuru");
      if (c.brightness > 0.6) chars.push("parlak");
      if (c.cleanliness > 0.5) chars.push("temiz");
      return `[${i + 1}] ID: ${c.id} | İsim: ${c.name} | Cinsiyet: ${c.gender_profile} | Tepe: ${top} | Orta: ${mid} | Taban: ${base} | Karakter: ${chars.join(", ")}`;
    }).join("\n");

    const systemPrompt = `Sen bir parfüm danışmanısın. Kullanıcının koku profilini ve aday parfümleri inceleyerek en iyi 3 parfümü seçecek ve her biri için Türkçe açıklama yazacaksın.

Kullanıcı profili:
${userProfile}

Aday parfümler:
${perfumeList}

Kurallar:
1. En iyi 3 parfümü seç ve 1, 2, 3 sıralaması yap.
2. Her parfüm için 1-2 cümlelik Türkçe açıklama yaz. Neden bu parfümün kullanıcıya uygun olduğunu açıkla.
3. matchedTraits alanına en fazla 6 adet Türkçe özellik dizi olarak ver (örn: "ferah", "sıcak", "çiçeksi").
4. Sadece JSON döndür, başka metin yazma.

Çıktı formatı (SADECE JSON):
{
  "recommendations": [
    {
      "perfumeId": "parfüm ID'si",
      "rank": 1,
      "reason": "Türkçe açıklama",
      "matchedTraits": ["özellik1", "özellik2"]
    }
  ]
}`;

    const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${groqApiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: "Lütfen en iyi 3 parfüm önerisini JSON olarak ver." },
        ],
        temperature: 0.7,
        max_completion_tokens: 1024,
        response_format: { type: "json_object" },
      }),
    });

    if (!groqResponse.ok) {
      const errText = await groqResponse.text();
      console.error("Groq API error:", groqResponse.status, errText);
      return new Response(JSON.stringify({
        recommendations: buildFallback(topCandidates),
        llmUsed: false,
      }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const groqData = await groqResponse.json();
    const content = groqData.choices?.[0]?.message?.content;

    if (!content) {
      return new Response(JSON.stringify({
        recommendations: buildFallback(topCandidates),
        llmUsed: false,
      }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const parsed = JSON.parse(content);
    const recommendations: LLMRecommendation[] = parsed.recommendations || [];

    const validIds = new Set(topCandidates.map((c) => c.id));
    const validRecs = recommendations.filter((r) => validIds.has(r.perfumeId));

    if (validRecs.length !== 3) {
      return new Response(JSON.stringify({
        recommendations: buildFallback(topCandidates),
        llmUsed: false,
      }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({
      recommendations: validRecs.map((r) => ({
        perfumeId: r.perfumeId,
        rank: r.rank as 1 | 2 | 3,
        confidence: topCandidates.find((c) => c.id === r.perfumeId)?.finalScore ?? 0,
        reason: r.reason,
        matchedTraits: r.matchedTraits || [],
      })),
      llmUsed: true,
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Edge function error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

function buildFallback(candidates: CandidatePerfume[]): LLMRecommendation[] {
  return candidates.slice(0, 3).map((c, i) => {
    const traits: string[] = [];
    if (c.freshness > 0.5) traits.push("ferah");
    if (c.warmth > 0.6) traits.push("sıcak");
    if (c.sweetness > 0.6) traits.push("tatlı");
    if (c.intensity > 0.6) traits.push("yoğun");
    if (c.greenness > 0.5) traits.push("yeşil");
    if (c.softness > 0.6) traits.push("yumuşak");
    if (c.dryness > 0.6) traits.push("kuru");
    if (c.brightness > 0.6) traits.push("parlak");
    if (c.cleanliness > 0.5) traits.push("temiz");

    const topFam = [...new Set(c.top_profile)].slice(0, 2).join(" ve ");
    const baseFam = [...new Set(c.base_profile)].slice(0, 2).join(" ve ");
    const reason = `${topFam ? topFam + " açılışı, " : ""}${baseFam ? baseFam + " tabanı" : ""} profilinize uyumlu. ${traits.length > 0 ? "Öne çıkan: " + traits.join(", ") + "." : ""}`.trim();

    return {
      perfumeId: c.id,
      rank: i + 1,
      reason,
      matchedTraits: traits.slice(0, 6),
    };
  });
}
