import type { DemoState, UiState } from "../types";
import type { GameConfig } from "../config.types";

export const renderLeaderboard = (state: DemoState, ui: UiState, config: GameConfig) => {
  const myRank = 14;
  return `
    <section class="hero">
      <div class="hero-title">${config.leaderboard.title}</div>
      <div class="hero-sub">${config.leaderboard.subtitle}</div>
    </section>

    <section class="list">
      ${config.leaderboard.entries
        .map(
          (entry, index) => `
          <div class="rank-row">
            <strong>${index + 1}</strong>
            <span>${entry.name}</span>
            <span>${entry.points}</span>
          </div>
        `,
        )
        .join("")}
      <div class="rank-row highlight">
        <strong>${myRank}</strong>
        <span>Ты</span>
        <span>${state.balance.points}</span>
      </div>
    </section>

    <section class="card">
      <h3>Как набрать очки?</h3>
      <p>Список правил доступен по кнопке ниже.</p>
      <div class="card-actions">
        <button class="button ghost" data-action="toggle-rules">
          ${ui.rulesOpen ? "Скрыть правила" : "Показать правила"}
        </button>
      </div>
      ${
        ui.rulesOpen
          ? `<div class="rules">
              ${config.leaderboard.rules.map((rule) => `<div>• ${rule}</div>`).join("")}
            </div>`
          : ""
      }
    </section>
  `;
};
