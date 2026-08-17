import { useState } from "react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { QUIZ_STEPS } from "@/data/quizData";

interface QuizScreenProps {
  stepIndex: number;
  selectedIds: string[];
  onAnswer: (optionIds: string[]) => void;
  onBack: () => void;
}

export function QuizScreen({ stepIndex, selectedIds, onAnswer, onBack }: QuizScreenProps) {
  const step = QUIZ_STEPS[stepIndex];
  const [localSelected, setLocalSelected] = useState<string[]>(selectedIds);

  const toggle = (id: string) => {
    if (localSelected.includes(id)) {
      setLocalSelected(localSelected.filter((x) => x !== id));
    } else {
      setLocalSelected([...localSelected, id]);
    }
  };

  const canProceed = localSelected.length > 0;
  const isLast = stepIndex === QUIZ_STEPS.length - 1;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 z-20 h-1 bg-white/5">
        <div
          className="h-full bg-gradient-to-r from-amber-400 to-amber-200 transition-all duration-500 ease-out"
          style={{ width: `${((stepIndex + 1) / QUIZ_STEPS.length) * 100}%` }}
        />
      </div>

      <div className="mx-auto max-w-5xl px-6 py-12 pt-16">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <button
            onClick={onBack}
            disabled={stepIndex === 0}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-gray-300 transition-all hover:border-white/30 hover:text-white disabled:opacity-30 disabled:hover:border-white/10 disabled:hover:text-gray-300"
          >
            <ArrowLeft className="h-4 w-4" />
            Geri
          </button>
          <span className="text-sm font-medium tracking-wider text-amber-300">
            {stepIndex + 1} / {QUIZ_STEPS.length}
          </span>
        </div>

        {/* Question */}
        <div className="mb-10 text-center">
          <h2 className="font-serif text-3xl font-light tracking-tight sm:text-4xl md:text-5xl">
            {step.title}
          </h2>
          <p className="mt-3 text-sm text-gray-400 sm:text-base">{step.subtitle}</p>
        </div>

        {/* Options grid */}
        <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-4">
          {step.options.map((option) => {
            const isSelected = localSelected.includes(option.id);
            return (
              <button
                key={option.id}
                onClick={() => toggle(option.id)}
                className="group relative aspect-[3/4] overflow-hidden rounded-2xl border-2 transition-all duration-300"
                style={{
                  borderColor: isSelected ? "rgb(251 191 36)" : "rgba(255,255,255,0.08)",
                }}
              >
                <img
                  src={option.image}
                  alt={option.label}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div
                  className={`absolute inset-0 transition-all duration-300 ${
                    isSelected
                      ? "bg-amber-900/40"
                      : "bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:from-black/70"
                  }`}
                />

                {/* Selected indicator */}
                {isSelected && (
                  <div className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-amber-400 shadow-lg">
                    <Check className="h-5 w-5 text-black" strokeWidth={3} />
                  </div>
                )}

                {/* Label */}
                <div className="absolute bottom-0 left-0 right-0 p-4 text-left">
                  <h3 className="font-serif text-lg font-medium leading-tight">
                    {option.label}
                  </h3>
                  {option.description && (
                    <p className="mt-1 text-xs text-gray-300">{option.description}</p>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Continue button */}
        <div className="mt-10 flex justify-center">
          <button
            onClick={() => onAnswer(localSelected)}
            disabled={!canProceed}
            className="group inline-flex items-center gap-3 rounded-full bg-amber-400 px-8 py-4 text-base font-semibold text-black transition-all hover:bg-amber-300 hover:shadow-[0_0_30px_rgba(251,191,36,0.4)] active:scale-95 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-gray-500 disabled:shadow-none"
          >
            {isLast ? "Sonuçları Gör" : "Devam Et"}
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
}
