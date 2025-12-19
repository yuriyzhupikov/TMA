import type { DemoState, UiState } from "../types";
import type { GameConfig } from "../config.types";
import { todayKey } from "../utils";

export const renderHome = (
  state: DemoState,
  ui: UiState,
  config: GameConfig,
  questVariant: string,
) => {
  const checkInDone = state.checkInDate === todayKey();
  const questDone = state.dailyQuestDate === todayKey();
  const spinDone = state.spinDate === todayKey();
  const lootAvailable = state.chests.length > 0;
  const spinEnabled = config.spin.enabled;
  const collectionProgress = Math.round(
    (state.collectionItems.length / config.collection.items.length) * 100,
  );

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
      <h3>${config.dailyQuest.title}</h3>
      <p>${questDone ? "Квест выполнен на сегодня" : config.dailyQuest.description}</p>
      <p class="hero-sub">Сегодня: ${questVariant}</p>
      <div class="card-actions">
        <button class="button ghost" data-action="open-quest">
          Подробнее
        </button>
      </div>
      <div class="hero-sub">Серия: ${state.dailyQuestStreak} дней</div>
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

    ${
      config.features.collection
        ? `<section class="card">
            <h3>Собери морскую корзину</h3>
            <p>Собрано карточек: ${state.collectionItems.length}/${config.collection.items.length}</p>
            <div class="progress"><span style="width:${collectionProgress}%"></span></div>
            <div class="card-actions">
              <button class="button ghost" data-action="collect-item">
                Добавить карточку
              </button>
            </div>
          </section>`
        : ""
    }

    ${
      config.features.quiz
        ? `<section class="card">
            <h3>Морская викторина</h3>
            <p>${
              state.quizDate === todayKey()
                ? "Уже сыграли сегодня"
                : "Ответьте на 3 вопроса за 45 секунд"
            }</p>
            <div class="card-actions">
              <button class="button ghost" data-action="quiz">
                Начать викторину
              </button>
            </div>
          </section>`
        : ""
    }

    ${
      config.features.receipt
        ? `<section class="card">
            <h3>Счастливый чек</h3>
            <p>${
              state.receiptDate === todayKey() ? "Проверили чек сегодня" : "Введи сумму или отсканируй QR"
            }</p>
            <div class="card-actions">
              <button class="button ghost" data-action="receipt">
                Проверить чек
              </button>
            </div>
          </section>`
        : ""
    }
  `;
};
