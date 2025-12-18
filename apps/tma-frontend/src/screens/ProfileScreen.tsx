import type { DemoState } from "../types";
import type { GameConfig, TenantConfig } from "../config.types";
import { formatDateTime } from "../utils";

export const renderProfile = (
  state: DemoState,
  config: GameConfig,
  tenants: TenantConfig[],
  activeTenantId: string,
) => {
  const progress = Math.min(100, Math.round((state.balance.xp / state.balance.xpNext) * 100));
  const history = state.history.slice(0, config.profile.historyLimit);
  return `
    <section class="hero">
      <div class="hero-title">Профиль игрока</div>
      <div class="hero-sub">Уровень, прогресс и последние награды.</div>
      <div>
        <strong>Уровень ${state.balance.level}</strong>
        <div class="progress"><span style="width:${progress}%"></span></div>
        <p class="hero-sub">${state.balance.xp} / ${state.balance.xpNext} XP</p>
      </div>
    </section>

    <section class="card">
      <h3>История наград</h3>
      <div class="history">
        ${
          history.length
            ? history
                .map(
                  (item) => `
                <div class="history-item">
                  <strong>${item.source}</strong>
                  <span>${item.label} · ${formatDateTime(item.at)}</span>
                </div>
              `,
                )
                .join("")
            : `<span class="empty">Пока нет наград</span>`
        }
      </div>
    </section>

    <section class="card">
      <h3>Демо режим</h3>
      <p>Очистить локальный прогресс и начать заново.</p>
      <div class="card-actions">
        <button class="button ghost" data-action="reset-demo">Сброс демо</button>
      </div>
    </section>

    <section class="card">
      <h3>Компания / тема</h3>
      <p>Переключить набор настроек и стиль.</p>
      <div class="card-actions">
        ${tenants
          .map(
            (tenant) => `
            <button class="button ghost" data-action="set-tenant" data-tenant="${tenant.id}">
              ${tenant.id === activeTenantId ? "✓ " : ""}${tenant.label}
            </button>
          `,
          )
          .join("")}
      </div>
    </section>
  `;
};
