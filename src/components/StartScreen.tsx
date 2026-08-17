import { Sparkles, ArrowRight } from "lucide-react";

interface StartScreenProps {
  onStart: () => void;
}

export function StartScreen({ onStart }: StartScreenProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0a0a0a] text-white">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-40"
        style={{
          backgroundImage:
            "url('https://images.pexels.com/photos/16239693/pexels-photo-16239693.jpeg?auto=compress&cs=tinysrgb&h=650&w=940')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />

      {/* Content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 py-16 text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-200/30 bg-amber-100/10 px-4 py-1.5 backdrop-blur-sm">
          <Sparkles className="h-4 w-4 text-amber-300" />
          <span className="text-sm font-medium tracking-wide text-amber-100">
            Kişisel Koku Profili
          </span>
        </div>

        <h1 className="font-serif text-5xl font-light leading-tight tracking-tight sm:text-6xl md:text-7xl">
          Koku Kişiliğin
          <span className="block text-amber-300">Keşif Yolculuğu</span>
        </h1>

        <p className="mt-6 max-w-xl text-base leading-relaxed text-gray-300 sm:text-lg">
          Dokuz adımlık görsel bir yolculukla sana en uygun parfümleri keşfet.
          Tarzını, zevklerini ve yaşam alanını seç — biz sana özel seçkimizi hazırlayalım.
        </p>

        <button
          onClick={onStart}
          className="group mt-10 inline-flex items-center gap-3 rounded-full bg-amber-400 px-8 py-4 text-base font-semibold text-black transition-all hover:bg-amber-300 hover:shadow-[0_0_40px_rgba(251,191,36,0.4)] active:scale-95"
        >
          Yolculuğa Başla
          <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
        </button>

        <div className="mt-16 flex items-center gap-8 text-xs uppercase tracking-widest text-gray-500">
          <span>9 Adım</span>
          <span className="h-1 w-1 rounded-full bg-gray-600" />
          <span>Görsel Quiz</span>
          <span className="h-1 w-1 rounded-full bg-gray-600" />
          <span>Kişisel Öneri</span>
        </div>
      </div>
    </div>
  );
}
