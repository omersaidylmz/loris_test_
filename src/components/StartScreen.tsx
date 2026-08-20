import { ArrowRight } from "lucide-react";
import lorisLogo from "/images/assets/logo.png";

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

        {/* LORİS Logo */}
        <div className="mb-7 flex items-center justify-center">
          <img
            src={lorisLogo}
            alt="LORİS"
            className="h-16 w-auto object-contain drop-shadow-[0_0_12px_rgba(251,191,36,0.18)]"
          />
        </div>

        {/* Title */}
        <h1 className="font-serif text-5xl font-light leading-tight tracking-tight sm:text-6xl md:text-7xl">
          Kişisel Koku Profili

          <span className="block text-amber-300">
            Keşif Yolculuğu
          </span>
        </h1>

        {/* Description */}
        <p className="mt-6 max-w-xl text-base leading-relaxed text-gray-300 sm:text-lg">
          Kişisel Koku Profilinizi keşfettiğiniz bu özel yolculukta,
          LORİS olarak size eşlik etmekten ve ruhunuza hitap eden kokuyu
          keşfederek sizi imza kokunuza bir adım daha yaklaştırmaktan
          mutluluk duyuyoruz.
        </p>

        {/* Start Button */}
        <button
          onClick={onStart}
          className="group mt-10 inline-flex items-center gap-3 rounded-full bg-amber-400 px-8 py-4 text-base font-semibold text-black transition-all hover:bg-amber-300 hover:shadow-[0_0_40px_rgba(251,191,36,0.4)] active:scale-95"
        >
          Yolculuğa Başla

          <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
        </button>

        {/* Bottom Steps + Brand Signature */}
        <div className="mt-16 flex flex-col items-center">

          {/* Journey Words */}
          <div className="flex items-center gap-8 text-xs uppercase tracking-widest text-gray-500">
            <span>HİSSET</span>

            <span className="h-1 w-1 rounded-full bg-gray-600" />

            <span>KEŞFET</span>

            <span className="h-1 w-1 rounded-full bg-gray-600" />

            <span>DENEYİMLE</span>
          </div>

          {/* Brand Signature */}
          <div className="mt-7 flex items-center gap-4">
            <div className="h-px w-10 bg-amber-300/30" />

            <span className="text-base font-medium uppercase tracking-[0.4em] text-amber-200/80">
              PARFÜM LORİSTİR
            </span>

            <div className="h-px w-10 bg-amber-300/30" />
          </div>
        </div>
      </div>
    </div>
  );
}