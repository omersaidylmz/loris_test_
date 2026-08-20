import { useMemo } from "react";
import { ALL_NOTES } from "@/lib/matcher";

interface RadarChartProps {
  userCounts: Record<string, number>;
  perfumeCounts: Record<string, number>;
  perfumeName: string;
}

export function RadarChart({ userCounts, perfumeCounts, perfumeName }: RadarChartProps) {
  const size = 320;
  const center = size / 2;
  const radius = 110;
  const labels = ALL_NOTES;
  const n = labels.length;

  const maxUser = Math.max(1, ...Object.values(userCounts));
  const maxPerfume = Math.max(1, ...Object.values(perfumeCounts));

  const points = useMemo(() => {
    return labels.map((label, i) => {
      const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
      const userVal = (userCounts[label] || 0) / maxUser;
      const perfumeVal = (perfumeCounts[label] || 0) / maxPerfume;
      return {
        label,
        angle,
        userX: center + radius * userVal * Math.cos(angle),
        userY: center + radius * userVal * Math.sin(angle),
        perfumeX: center + radius * perfumeVal * Math.cos(angle),
        perfumeY: center + radius * perfumeVal * Math.sin(angle),
        labelX: center + (radius + 20) * Math.cos(angle),
        labelY: center + (radius + 20) * Math.sin(angle),
      };
    });
  }, [userCounts, perfumeCounts, maxUser, maxPerfume]);

  const userPath = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.userX},${p.userY}`).join(" ") + " Z";
  const perfumePath = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.perfumeX},${p.perfumeY}`).join(" ") + " Z";

  const gridLevels = [0.25, 0.5, 0.75, 1];

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} className="max-w-full">
        {/* Grid polygons */}
        {gridLevels.map((level) => {
          const pts = labels
            .map((_, i) => {
              const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
              return `${center + radius * level * Math.cos(angle)},${center + radius * level * Math.sin(angle)}`;
            })
            .join(" ");
          return (
            <polygon
              key={level}
              points={pts}
              fill="none"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth={1}
            />
          );
        })}

        {/* Axis lines */}
        {points.map((p) => (
          <line
            key={`axis-${p.label}`}
            x1={center}
            y1={center}
            x2={center + radius * Math.cos(p.angle)}
            y2={center + radius * Math.sin(p.angle)}
            stroke="rgba(255,255,255,0.05)"
            strokeWidth={1}
          />
        ))}

        {/* Perfume shape */}
        <path d={perfumePath} fill="rgba(251,191,36,0.15)" stroke="rgb(251,191,36)" strokeWidth={2} />

        {/* User shape */}
        <path d={userPath} fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.6)" strokeWidth={2} strokeDasharray="4 3" />

        {/* Center dot */}
        <circle cx={center} cy={center} r={2} fill="rgba(255,255,255,0.3)" />
      </svg>

      {/* Legend */}
      <div className="mt-4 flex items-center gap-6 text-xs">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-sm border border-white/60 bg-white/10" />
          <span className="text-gray-400">Senin profilin</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-sm border border-amber-400 bg-amber-400/20" />
          <span className="text-gray-400">{perfumeName}</span>
        </div>
      </div>
    </div>
  );
}
