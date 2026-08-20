import { ArrowRight, Check } from "lucide-react";

interface FilterOption {
  id: string;
  label: string;
  description: string;
}

interface FilterScreenProps {
  title: string;
  subtitle: string;
  options: FilterOption[];
  selectedId: string;
  onSelect: (id: string) => void;
  onContinue: () => void;
}

export function FilterScreen({ title, subtitle, options, selectedId, onSelect, onContinue }: FilterScreenProps) {
  return (
    <main className="min-h-screen bg-[#0a0a0a] px-6 py-14 text-white">
      <div className="mx-auto flex min-h-[calc(100vh-7rem)] max-w-4xl flex-col justify-center">
        <div className="mb-10 text-center">
          <p className="mb-4 text-xs uppercase tracking-[0.3em] text-amber-300">LORİS · Koku keşfi</p>
          <h1 className="font-serif text-4xl font-light tracking-tight sm:text-5xl">{title}</h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-gray-400 sm:text-base">{subtitle}</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {options.map((option) => {
            const selected = selectedId === option.id;
            return (
              <button key={option.id} type="button" onClick={() => onSelect(option.id)} aria-pressed={selected}
                className="relative min-h-40 rounded-2xl border-2 p-6 text-left transition-all hover:-translate-y-1 hover:border-amber-300/60"
                style={{ borderColor: selected ? "rgb(251 191 36)" : "rgba(255,255,255,0.1)", background: selected ? "rgba(251,191,36,0.1)" : "rgba(255,255,255,0.04)" }}>
                {selected && <span className="absolute right-4 top-4 flex size-7 items-center justify-center rounded-full bg-amber-400 text-black"><Check className="size-4" strokeWidth={3} /></span>}
                <span className="font-serif text-2xl">{option.label}</span>
                <span className="mt-3 block text-sm leading-6 text-gray-400">{option.description}</span>
              </button>
            );
          })}
        </div>
        <div className="mt-10 flex justify-center">
          <button type="button" onClick={onContinue} disabled={!selectedId}
            className="inline-flex items-center gap-3 rounded-full bg-amber-400 px-8 py-4 font-semibold text-black transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-gray-500">
            Devam Et <ArrowRight className="size-5" />
          </button>
        </div>
      </div>
    </main>
  );
}

export const GENDER_OPTIONS = [
  { id: "Kadın", label: "Feminen", description: "Çiçeksi, zarif ve yumuşak koku karakterleri." },
  { id: "Erkek", label: "Maskülen", description: "Odunsu, aromatik ve güçlü koku karakterleri." },
  { id: "Unisex", label: "Unisex", description: "Her stile uyum sağlayan dengeli kokular." },
];

export const COLLECTION_OPTIONS = [
  { id: "Frequence", label: "Frequence", description: "Günlük kullanıma uygun, erişilebilir koku dünyası." },
  { id: "Kreasyon", label: "Kreasyon", description: "Özgün ve yaratıcı kompozisyonları keşfedin." },
  { id: "Niche", label: "Niche", description: "Daha seçkin ve karakter sahibi koku profilleri." },
];
