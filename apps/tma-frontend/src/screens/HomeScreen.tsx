import type { DemoState, UiState } from "../types";
import type { GameConfig } from "../config.types";
import { todayKey } from "../utils";

export const renderHome = (state: DemoState, ui: UiState, config: GameConfig) => {
  const checkInDone = state.checkInDate === todayKey();
  const spinDone = state.spinDate === todayKey();
  const lootAvailable = state.chests.length > 0;
  const spinEnabled = config.spin.enabled;

  const lootList = lootAvailable
    ? state.chests
        .slice(0, 6)
        .map((chest) => {
          const label = chest.source === "daily" ? "Daily" : chest.source;
          return `<span class="loot-chip">${label}</span>`;
        })
        .join("")
    : `<span class="empty">Сундуков пока нет</span>`;

  return `
    <section class="hero">
      <div class="hero-title">${config.theme.heroTitle}</div>
      <div class="hero-sub">${config.theme.heroSubtitle}</div>
      <div class="balance-mini">
        <div class="balance-chip"><strong>${state.balance.points}</strong><span>очки</span></div>
        <div class="balance-chip"><strong>${state.balance.minutes}</strong><span>минуты</span></div>
        <div class="balance-chip"><strong>${state.balance.level}</strong><span>уровень</span></div>
      </div>
    </section>

    <section class="card">
      <h3>Check-in</h3>
      <p>${checkInDone ? "Сегодня отмечались" : "Сегодня не отмечались"}</p>
      <div class="card-actions">
        <button class="button" data-action="checkin">Отметиться</button>
      </div>
    </section>

    <section class="card">
      <h3>Lucky Spin</h3>
      <p>${spinEnabled ? (spinDone ? "Уже крутили" : "Доступно 1 вращение") : "Скоро будет доступно"}</p>
      <div class="card-actions">
        <button class="button secondary" data-action="spin" ${
          spinDone || ui.isSpinning || !spinEnabled ? "disabled" : ""
        }>
          ${ui.isSpinning ? "Крутим..." : "Крутить"}
        </button>
      </div>
    </section>

    <section class="card">
      <h3>Lootbox</h3>
      <p>Доступно: ${state.chests.length}</p>
      <div class="loot-list">${lootList}</div>
      <div class="card-actions">
        <button class="button" data-action="open-lootbox" ${!lootAvailable || ui.lootbox ? "disabled" : ""}>
          Открыть
        </button>
      </div>
    </section>
  `;
};
