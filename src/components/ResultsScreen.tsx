import { useMemo, useState } from "react";
import { RotateCcw, Sparkles, ChevronDown, ChevronUp } from "lucide-react";
import { computeMatches, getProfileSummary, type MatchResult } from "@/lib/matcher";
import { RadarChart } from "@/components/RadarChart";
import { PERFUMES } from "@/data/perfumes";
import { QUIZ_STEPS } from "@/data/quizData";

interface ResultsScreenProps {
  selectedProfiles: string[];
  gender: string;
  onRestart: () => void;
}

export function ResultsScreen({ selectedProfiles, gender, onRestart }: ResultsScreenProps) {
  const matches = useMemo(
    () => computeMatches(selectedProfiles, gender, 5),
    [selectedProfiles, gender],
  );
  const [expandedId, setExpandedId] = useState<string | null>(matches[0]?.perfume.id ?? null);

  const userCounts = useMemo(() => getProfileSummary(selectedProfiles), [selectedProfiles]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="mx-auto max-w-5xl px-6 py-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-200/30 bg-amber-100/10 px-4 py-1.5">
            <Sparkles className="h-4 w-4 text-amber-300" />
            <span className="text-sm font-medium tracking-wide text-amber-100">
              Senin Koku Profilin
            </span>
          </div>
          <h1 className="font-serif text-4xl font-light tracking-tight sm:text-5xl">
            Sana özel parfüm önerileri
          </h1>
          <p className="mt-3 text-sm text-gray-400">
            Seçimlerine göre en yüksek uyuma sahip {matches.length} parfüm
          </p>
        </div>

        {/* Top match with radar */}
        {matches[0] && (
          <div className="mb-10 rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-6 sm:p-8">
            <div className="grid items-center gap-8 md:grid-cols-2">
              <div>
                <span className="text-xs uppercase tracking-widest text-amber-300">
                  En İyi Eşleşme
                </span>
                <h2 className="mt-2 font-serif text-2xl font-medium sm:text-3xl">
                  {matches[0].perfume.name}
                </h2>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-4xl font-light text-amber-300">
                    %{Math.round(matches[0].score * 100)}
                  </span>
                  <span className="text-sm text-gray-400">uyum skoru</span>
                </div>

                <div className="mt-6 space-y-3">
                  <ProfileBar label="Tepe notaları" value={matches[0].topScore} max={5} />
                  <ProfileBar label="Orta notaları" value={matches[0].middleScore} max={5} />
                  <ProfileBar label="Taban notaları" value={matches[0].baseScore} max={5} />
                </div>
              </div>
              <div className="flex justify-center">
                <RadarChart
                  userCounts={userCounts}
                  perfumeCounts={getPerfumeCounts(matches[0].perfume)}
                  perfumeName={matches[0].perfume.name}
                />
              </div>
            </div>
          </div>
        )}

        {/* Other matches */}
        <div className="space-y-3">
          {matches.slice(1).map((match) => {
            const isExpanded = expandedId === match.perfume.id;
            return (
              <div
                key={match.perfume.id}
                className="overflow-hidden rounded-2xl border border-white/10 bg-white/5"
              >
                <button
                  onClick={() => setExpandedId(isExpanded ? null : match.perfume.id)}
                  className="flex w-full items-center justify-between p-5 text-left transition-colors hover:bg-white/5"
                >
                  <div className="flex items-center gap-4">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-400/20 text-sm font-semibold text-amber-300">
                      %{Math.round(match.score * 100)}
                    </span>
                    <div>
                      <h3 className="font-serif text-lg font-medium">{match.perfume.name}</h3>
                      <p className="text-xs text-gray-500">
                        {match.perfume.top_profile.length + match.perfume.middle_profile.length + match.perfume.base_profile.length} koku notu
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
                    <div className="grid gap-4 sm:grid-cols-3">
                      <NoteColumn title="Tepe" notes={match.perfume.top_profile} />
                      <NoteColumn title="Orta" notes={match.perfume.middle_profile} />
                      <NoteColumn title="Taban" notes={match.perfume.base_profile} />
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

function ProfileBar({ label, value, max }: { label: string; value: number; max: number }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="text-gray-400">{label}</span>
        <span className="text-gray-500">{value}/{max}</span>
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

function getPerfumeCounts(perfume: typeof PERFUMES[number]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const n of perfume.top_profile) counts[n] = (counts[n] || 0) + 1;
  for (const n of perfume.middle_profile) counts[n] = (counts[n] || 0) + 1;
  for (const n of perfume.base_profile) counts[n] = (counts[n] || 0) + 1;
  return counts;
}

export type { MatchResult };
