import type { DemoState, UiState } from "../types";
import { leaderboard } from "../data/constants";

export const renderLeaderboard = (state: DemoState, ui: UiState) => {
  const myRank = 14;
  return `
    <section class="hero">
      <div class="hero-title">Лидерборд недели</div>
      <div class="hero-sub">Топ-10 игроков по активности и выполненным заданиям.</div>
    </section>

    <section class="list">
      ${leaderboard
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
              <div>• Чек-ин каждый день: +25 очков</div>
              <div>• Lucky Spin: до +50 очков</div>
              <div>• Приглашения друзей: сундук обоим</div>
              <div>• Открытие сундуков: бонусы и скидки</div>
            </div>`
          : ""
      }
    </section>
  `;
};
