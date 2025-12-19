import type { DailyQuestConfig } from "../../config.types";

export const defaultDailyQuest: DailyQuestConfig = {
  title: "Квест дня",
  description: "Сыграй одну быструю игру и забери бонус.",
  reward: { kind: "points", value: 35, label: "+35 очков" },
  chestSource: "quest",
  streakMilestones: [3, 7, 14],
  streakReward: { kind: "points", value: 80, label: "+80 очков" },
  variants: [
    "Сыграть 1 матч в выбранной игре",
    "Провести 30 минут в клубе",
    "Пройти 1 уровень в игре дня",
    "Набрать 50 очков за сессию",
    "Сделать 3 победы подряд",
    "Попробовать игру дня",
    "Пригласить друга и зайти вместе",
    "Посетить клуб в тихий час",
    "Выполнить мини-челлендж: 10 точных попаданий",
  ],
};
