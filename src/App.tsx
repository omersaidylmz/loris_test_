import { useState, useCallback } from "react";
import { StartScreen } from "@/components/StartScreen";
import { FilterScreen, GENDER_OPTIONS, COLLECTION_OPTIONS } from "@/components/FilterScreen";
import { QuizScreen } from "@/components/QuizScreen";
import { ResultsScreen } from "@/components/ResultsScreen";
import { QUIZ_STEPS } from "@/data/quizData";
import type { RecommendationResult } from "@/lib/recommendation/types";

type Phase = "start" | "gender" | "collection" | "quiz" | "results" | "loading";

function App() {
  const [phase, setPhase] = useState<Phase>("start");
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<string[][]>([]);
  const [gender, setGender] = useState("Unisex");
  const [collection, setCollection] = useState("Frequence");
  const [recommendation, setRecommendation] = useState<RecommendationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleStart = useCallback(() => {
    setPhase("gender");
    setStepIndex(0);
    setAnswers([]);
  }, []);

  const handleAnswer = useCallback(
    (optionIds: string[]) => {
      const newAnswers = [...answers];
      newAnswers[stepIndex] = optionIds;
      setAnswers(newAnswers);

      if (stepIndex < QUIZ_STEPS.length - 1) {
        setStepIndex(stepIndex + 1);
      } else {
        setError(null);
        setPhase("loading");
        import("@/lib/recommendation/api").then(({ getRecommendations }) => {
          getRecommendations(newAnswers, { gender, collection }).then((result) => {
            setRecommendation(result);
            setPhase("results");
          }).catch((reason) => {
            console.error("[v0] Recommendation failed:", reason);
            setError("Öneriler hazırlanırken bir sorun oluştu. Lütfen filtreleri ve testi yeniden deneyin.");
            setPhase("results");
          });
        }).catch((reason) => {
          console.error("[v0] Recommendation module failed:", reason);
          setError("Öneri motoru yüklenemedi. Lütfen testi yeniden başlatın.");
          setPhase("results");
        });
      }
    },
    [stepIndex, answers, gender, collection],
  );

  const handleBack = useCallback(() => {
    if (stepIndex > 0) {
      setStepIndex(stepIndex - 1);
    } else {
      setPhase("start");
    }
  }, [stepIndex]);

  const handleRestart = useCallback(() => {
    setPhase("start");
    setStepIndex(0);
    setAnswers([]);
    setRecommendation(null);
  }, []);

  if (phase === "start") {
    return <StartScreen onStart={handleStart} />;
  }

  if (phase === "gender") {
    return <FilterScreen title="Koku kimliğinizi seçin" subtitle="Önce önerileri daraltmak için aradığınız cinsiyet profilini belirleyin." options={GENDER_OPTIONS} selectedId={gender} onSelect={setGender} onContinue={() => setPhase("collection")} />;
  }

  if (phase === "collection") {
    return <FilterScreen title="Koleksiyonunuzu seçin" subtitle="Frequence, Kreasyon veya Niche koleksiyonlarından size uygun olanı seçin." options={COLLECTION_OPTIONS} selectedId={collection} onSelect={setCollection} onContinue={() => setPhase("quiz")} />;
  }

  if (phase === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-2 border-amber-300/30 border-t-amber-300 mx-auto" />
          <p className="text-sm text-gray-400">Koku profiliniz analiz ediliyor...</p>
        </div>
      </div>
    );
  }

  if (phase === "results") {
    if (error) {
      return <div className="flex min-h-screen items-center justify-center bg-background px-6 text-center text-foreground"><div className="max-w-md"><h1 className="font-serif text-4xl">Bir şeyler ters gitti</h1><p className="mt-4 text-muted-foreground">{error}</p><button onClick={handleRestart} className="mt-8 rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground">Yeniden Başla</button></div></div>;
    }
    if (recommendation) {
      return <ResultsScreen recommendation={recommendation} onRestart={handleRestart} />;
    }
  }

  return (
    <QuizScreen
      stepIndex={stepIndex}
      selectedIds={answers[stepIndex] || []}
      onAnswer={handleAnswer}
      onBack={handleBack}
    />
  );
}

export default App;
