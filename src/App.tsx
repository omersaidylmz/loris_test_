import { useState, useCallback } from "react";
import { StartScreen } from "@/components/StartScreen";
import { QuizScreen } from "@/components/QuizScreen";
import { ResultsScreen } from "@/components/ResultsScreen";
import { QUIZ_STEPS } from "@/data/quizData";
import type { RecommendationResult } from "@/lib/recommendation/types";

type Phase = "start" | "quiz" | "results" | "loading";

function App() {
  const [phase, setPhase] = useState<Phase>("start");
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<string[][]>([]);
  const [recommendation, setRecommendation] = useState<RecommendationResult | null>(null);

  const handleStart = useCallback(() => {
    setPhase("quiz");
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
        setPhase("loading");
        import("@/lib/recommendation/api").then(({ getRecommendations }) => {
          getRecommendations(newAnswers).then((result) => {
            setRecommendation(result);
            setPhase("results");
          }).catch(() => {
            setPhase("start");
          });
        }).catch(() => {
          setPhase("start");
        });
      }
    },
    [stepIndex, answers],
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

  if (phase === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] text-white">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-2 border-amber-300/30 border-t-amber-300 mx-auto" />
          <p className="text-sm text-gray-400">Koku profiliniz analiz ediliyor...</p>
        </div>
      </div>
    );
  }

  if (phase === "results" && recommendation) {
    return (
      <ResultsScreen
        recommendation={recommendation}
        onRestart={handleRestart}
      />
    );
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
