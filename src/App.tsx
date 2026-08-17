import { useState, useCallback } from "react";
import { StartScreen } from "@/components/StartScreen";
import { QuizScreen } from "@/components/QuizScreen";
import { ResultsScreen } from "@/components/ResultsScreen";
import { QUIZ_STEPS } from "@/data/quizData";

type Phase = "start" | "quiz" | "results";

function App() {
  const [phase, setPhase] = useState<Phase>("start");
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<string[][]>([]);
  const [selectedProfiles, setSelectedProfiles] = useState<string[]>([]);
  const [gender, setGender] = useState("maskulen");

  const handleStart = useCallback(() => {
    setPhase("quiz");
    setStepIndex(0);
    setAnswers([]);
    setSelectedProfiles([]);
  }, []);

  const handleAnswer = useCallback(
    (optionIds: string[]) => {
      const step = QUIZ_STEPS[stepIndex];
      const selectedOptions = step.options.filter((o) => optionIds.includes(o.id));

      const newProfiles = selectedOptions.flatMap((o) => o.profile);
      const updatedProfiles = [...selectedProfiles];
      for (const p of newProfiles) updatedProfiles.push(p);

      if (step.id === "identity" && selectedOptions[0]) {
        setGender(selectedOptions[0].id);
      }

      const newAnswers = [...answers];
      newAnswers[stepIndex] = optionIds;
      setAnswers(newAnswers);
      setSelectedProfiles(updatedProfiles);

      if (stepIndex < QUIZ_STEPS.length - 1) {
        setStepIndex(stepIndex + 1);
      } else {
        setPhase("results");
      }
    },
    [stepIndex, answers, selectedProfiles],
  );

  const handleBack = useCallback(() => {
    if (stepIndex > 0) {
      const prevStepIndex = stepIndex - 1;
      const prevAnswer = answers[prevStepIndex] || [];
      const prevStep = QUIZ_STEPS[prevStepIndex];
      const prevOptions = prevStep.options.filter((o) => prevAnswer.includes(o.id));
      const prevProfiles = prevOptions.flatMap((o) => o.profile);

      const updatedProfiles = selectedProfiles.slice(0, selectedProfiles.length - prevProfiles.length);
      setSelectedProfiles(updatedProfiles);
      setStepIndex(prevStepIndex);
    } else {
      setPhase("start");
    }
  }, [stepIndex, answers, selectedProfiles]);

  const handleRestart = useCallback(() => {
    setPhase("start");
    setStepIndex(0);
    setAnswers([]);
    setSelectedProfiles([]);
    setGender("maskulen");
  }, []);

  if (phase === "start") {
    return <StartScreen onStart={handleStart} />;
  }

  if (phase === "results") {
    return (
      <ResultsScreen
        selectedProfiles={selectedProfiles}
        gender={gender}
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
