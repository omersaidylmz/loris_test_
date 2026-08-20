import scoring from "./quiz-scoring.json";

export interface QuizOption {
  id: string;
  label: string;
  description?: string;
  image: string;
  profile: string[];
}

export interface QuizStep {
  id: string;
  title: string;
  subtitle: string;
  options: QuizOption[];
}

const imageById: Record<string, string> = {
  ipek: "/images/kumaş/ipek.png", keten: "/images/kumaş/keten.png", kadife: "/images/kumaş/kadife.png", deri: "/images/kumaş/deri.png",
  sabah: "/images/oda_pencere/sabah.png", gunbatimi: "/images/oda_pencere/gunbatimi.png", mum: "/images/oda_pencere/mum.png", ay: "/images/oda_pencere/ay.png",
  dalga: "/images/oda_pencere/deniz1.png", kumas: "/images/col_tul.png", duman: "/images/oda_pencere/orman.png", kivilcim: "/images/oda_pencere/baharat.png",
  yagmur: "https://images.pexels.com/photos/3728298/pexels-photo-3728298.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  dalgalar: "https://images.pexels.com/photos/31093409/pexels-photo-31093409.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  samine: "https://images.pexels.com/photos/13588459/pexels-photo-13588459.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  yayli: "https://images.pexels.com/photos/7095504/pexels-photo-7095504.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  geometrik: "https://images.pexels.com/photos/30892556/pexels-photo-30892556.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", organik: "https://images.pexels.com/photos/943907/pexels-photo-943907.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", akiskan: "https://images.pexels.com/photos/48600/pexels-photo-48600.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", katmanli: "https://images.pexels.com/photos/35652150/pexels-photo-35652150.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  eksimsi: "https://images.pexels.com/photos/1987010/pexels-photo-1987010.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", buruk: "https://images.pexels.com/photos/11669662/pexels-photo-11669662.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", yumustatli: "https://images.pexels.com/photos/8793915/pexels-photo-8793915.jpeg?auto=compress&cs=tinysrgb&h=650&w=940", acibaharat: "https://images.pexels.com/photos/9014065/pexels-photo-9014065.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
};

export const QUIZ_STEPS: QuizStep[] = scoring.questions.map((question) => ({
  id: question.id,
  title: question.title,
  subtitle: "Sezgisel olarak size en yakın olanı seçin.",
  options: question.options.map((option) => ({
    id: option.id,
    label: option.label,
    image: imageById[option.id] ?? "/images/col_tul.png",
    profile: [],
  })),
}));

export type ScoringQuestion = (typeof scoring.questions)[number];
export { scoring };
