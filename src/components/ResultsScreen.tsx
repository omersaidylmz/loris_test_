import { useMemo, useState } from "react";
import { RotateCcw, Sparkles, ChevronDown, ChevronUp, Brain, Zap } from "lucide-react";
import { RadarChart } from "@/components/RadarChart";
import { PERFUMES } from "@/data/perfumes";
import type { RecommendationResult, RecommendationItem, PerfumeEnriched } from "@/lib/recommendation/types";

interface ResultsScreenProps {
  recommendation: RecommendationResult;
  onRestart: () => void;
}

export function ResultsScreen({ recommendation, onRestart }: ResultsScreenProps) {
  const { recommendations, perfumes, candidates, llmUsed, timings } = recommendation;
  const [expandedId, setExpandedId] = useState<string | null>(recommendations[0]?.perfumeId ?? null);

  const userCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    const profile = recommendation.userProfileSummary;
    const lines = profile.split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.includes(":") && trimmed !== "") {
        const families = trimmed.split(",").map((f) => f.trim()).filter(Boolean);
        for (const f of families) {
          if (f.length > 2) counts[f] = (counts[f] || 0) + 1;
        }
      }
    }
    return counts;
  }, [recommendation.userProfileSummary]);

  const perfumeMap = useMemo(() => {
    const map = new Map<string, PerfumeEnriched>();
    for (const p of perfumes) map.set(p.id, p);
    return map;
  }, [perfumes]);

  const topMatch = recommendations[0];
  const topPerfume = topMatch ? perfumeMap.get(topMatch.perfumeId) : undefined;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="mx-auto max-w-5xl px-6 py-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-200/30 bg-amber-100/10 px-4 py-1.5">
            <Sparkles className="h-4 w-4 text-amber-300" />
            <span className="text-sm font-medium tracking-wide text-amber-100">
              LORİS Koku Profiliniz
            </span>
          </div>
          <h1 className="font-serif text-4xl font-light tracking-tight sm:text-5xl">
            Size özel parfüm önerileri
          </h1>
          <p className="mt-3 text-sm text-gray-400">
            Profilinize en yüksek uyuma sahip {recommendations.length} parfüm
          </p>
          <div className="mt-4 flex items-center justify-center gap-3 text-xs">
            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 ${llmUsed ? "bg-amber-400/15 text-amber-200" : "bg-white/5 text-gray-400"}`}>
              {llmUsed ? <Brain className="h-3.5 w-3.5" /> : <Zap className="h-3.5 w-3.5" />}
              {llmUsed ? "AI destekli seçim" : "Algoritma tabanlı seçim"}
            </span>
            <span className="text-gray-600">{timings.totalMs}ms</span>
          </div>
        </div>

        {/* Top match with radar */}
        {topMatch && topPerfume && (
          <div className="mb-10 rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-6 sm:p-8">
            <div className="grid items-center gap-8 md:grid-cols-2">
              <div>
                <span className="text-xs uppercase tracking-widest text-amber-300">
                  En İyi Eşleşme
                </span>
                <h2 className="mt-2 font-serif text-2xl font-medium sm:text-3xl">
                  {topPerfume.name}
                </h2>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-4xl font-light text-amber-300">
                    %{Math.round(topMatch.confidence * 100)}
                  </span>
                  <span className="text-sm text-gray-400">uyum skoru</span>
                </div>

                {topMatch.reason && (
                  <p className="mt-4 text-sm leading-relaxed text-gray-300">
                    {topMatch.reason}
                  </p>
                )}

                {topMatch.matchedTraits.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {topMatch.matchedTraits.map((trait, i) => (
                      <span
                        key={`${trait}-${i}`}
                        className="rounded-full bg-amber-400/15 px-3 py-1 text-xs text-amber-200"
                      >
                        {trait}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-6 space-y-3">
                  <SensoryBar label="Ferahlik" value={topPerfume.freshness} />
                  <SensoryBar label="Sıcaklık" value={topPerfume.warmth} />
                  <SensoryBar label="Tatlılık" value={topPerfume.sweetness} />
                  <SensoryBar label="Yoğunluk" value={topPerfume.intensity} />
                </div>
              </div>
              <div className="flex justify-center">
                <RadarChart
                  userCounts={userCounts}
                  perfumeCounts={getPerfumeCounts(topPerfume)}
                  perfumeName={topPerfume.name}
                />
              </div>
            </div>
          </div>
        )}

        {/* Other matches */}
        <div className="space-y-3">
          {recommendations.slice(1).map((rec) => {
            const perfume = perfumeMap.get(rec.perfumeId);
            if (!perfume) return null;
            const isExpanded = expandedId === rec.perfumeId;
            return (
              <div
                key={rec.perfumeId}
                className="overflow-hidden rounded-2xl border border-white/10 bg-white/5"
              >
                <button
                  onClick={() => setExpandedId(isExpanded ? null : rec.perfumeId)}
                  className="flex w-full items-center justify-between p-5 text-left transition-colors hover:bg-white/5"
                >
                  <div className="flex items-center gap-4">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-400/20 text-sm font-semibold text-amber-300">
                      %{Math.round(rec.confidence * 100)}
                    </span>
                    <div>
                      <h3 className="font-serif text-lg font-medium">{perfume.name}</h3>
                      <p className="text-xs text-gray-500">
                        {perfume.top_profile.length + perfume.middle_profile.length + perfume.base_profile.length} koku notu
                      </p>
                    </div>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  )}
                </button>

                {isExpanded && (
                  <div className="border-t border-white/10 px-5 py-4">
                    {rec.reason && (
                      <p className="mb-4 text-sm leading-relaxed text-gray-300">
                        {rec.reason}
                      </p>
                    )}
                    {rec.matchedTraits.length > 0 && (
                      <div className="mb-4 flex flex-wrap gap-2">
                        {rec.matchedTraits.map((trait, i) => (
                          <span
                            key={`${trait}-${i}`}
                            className="rounded-full bg-amber-400/15 px-3 py-1 text-xs text-amber-200"
                          >
                            {trait}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="grid gap-4 sm:grid-cols-3">
                      <NoteColumn title="Tepe" notes={perfume.top_profile} />
                      <NoteColumn title="Orta" notes={perfume.middle_profile} />
                      <NoteColumn title="Taban" notes={perfume.base_profile} />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Restart */}
        <div className="mt-12 flex justify-center">
          <button
            onClick={onRestart}
            className="group inline-flex items-center gap-3 rounded-full border border-white/20 px-8 py-4 text-base font-medium text-white transition-all hover:border-amber-300 hover:text-amber-300 active:scale-95"
          >
            <RotateCcw className="h-5 w-5 transition-transform group-hover:-rotate-180" />
            Yeniden Başla
          </button>
        </div>
      </div>
    </div>
  );
}

function SensoryBar({ label, value }: { label: string; value: number }) {
  const pct = Math.min(100, value * 100);
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="text-gray-400">{label}</span>
        <span className="text-gray-500">{Math.round(pct)}%</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-200 transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function NoteColumn({ title, notes }: { title: string; notes: string[] }) {
  return (
    <div>
      <h4 className="mb-2 text-xs uppercase tracking-wider text-amber-300">{title} notalar</h4>
      <div className="flex flex-wrap gap-1.5">
        {notes.map((note, i) => (
          <span
            key={`${note}-${i}`}
            className="rounded-md bg-white/10 px-2 py-1 text-xs text-gray-300"
          >
            {note}
          </span>
        ))}
        {notes.length === 0 && <span className="text-xs text-gray-600">—</span>}
      </div>
    </div>
  );
}

function getPerfumeCounts(perfume: PerfumeEnriched): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const n of perfume.top_profile) counts[n] = (counts[n] || 0) + 1;
  for (const n of perfume.middle_profile) counts[n] = (counts[n] || 0) + 1;
  for (const n of perfume.base_profile) counts[n] = (counts[n] || 0) + 1;
  return counts;
}
