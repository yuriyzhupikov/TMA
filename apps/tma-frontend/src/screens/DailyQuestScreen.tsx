import type { DemoState } from "../types";
import type { GameConfig } from "../config.types";
import { todayKey } from "../utils";

export const renderDailyQuest = (state: DemoState, config: GameConfig, questVariant: string) => {
  const done = state.dailyQuestDate === todayKey();
  const milestones = [...config.dailyQuest.streakMilestones].sort((a, b) => a - b);
  const maxMilestone = milestones[milestones.length - 1] ?? 1;
  const progress = Math.min(100, Math.round((state.dailyQuestStreak / maxMilestone) * 100));
  const nextMilestone = config.dailyQuest.streakMilestones.find(
    (milestone) => milestone > state.dailyQuestStreak,
  );
  return `
    <section class="hero">
      <div class="hero-title">${config.dailyQuest.title}</div>
      <div class="hero-sub">${config.dailyQuest.description}</div>
      <div class="hero-sub">Сегодняшнее задание: ${questVariant}</div>
    </section>

    <section class="card">
      <h3>Награда</h3>
      <p>${config.dailyQuest.reward.label} и сундук</p>
      <p class="hero-sub">Задание: ${questVariant}</p>
      <div class="card-actions">
        <button class="button" data-action="daily-quest" ${done ? "disabled" : ""}>
          ${done ? "Уже выполнен" : "Выполнить"}
        </button>
        <button class="button ghost" data-action="go-home">Назад</button>
      </div>
    </section>

    <section class="card">
      <h3>Серия квестов</h3>
      <p>Текущая серия: ${state.dailyQuestStreak} дней</p>
      <div class="progress"><span style="width:${progress}%"></span></div>
      <p class="hero-sub">Цель серии: ${maxMilestone} дней</p>
      <p>Бонус за серию: ${config.dailyQuest.streakReward.label}</p>
      <p>${
        nextMilestone
          ? `До бонуса осталось ${nextMilestone - state.dailyQuestStreak} дней`
          : "Все бонусы серии уже получены"
      }</p>
    </section>

    <section class="card">
      <h3>Примеры заданий</h3>
      <div class="rules">
        ${config.dailyQuest.variants.map((item) => `<div>• ${item}</div>`).join("")}
      </div>
    </section>
  `;
};
