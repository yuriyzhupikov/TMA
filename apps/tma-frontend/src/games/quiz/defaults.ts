import type { QuizConfig } from "../../config.types";

export const defaultQuiz: QuizConfig = {
  rewardPass: { kind: "points", value: 40, label: "+40 бонусов" },
  rewardFail: { kind: "points", value: 10, label: "+10 бонусов" },
  questions: 3,
  timerSeconds: 45,
};
