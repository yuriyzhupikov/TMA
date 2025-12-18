import type { UiState } from "../../types";

export const renderLootboxModal = (ui: UiState) => {
  if (!ui.lootbox) {
    return "";
  }
  const phaseText = ui.lootbox.phase === "opening" ? "Открываем..." : ui.lootbox.reward.label;
  return `
    <div class="modal">
      <div class="modal-card">
        <div class="lootbox ${ui.lootbox.phase === "opening" ? "opening" : ""}">Loot</div>
        <h3>${phaseText}</h3>
        <p>${ui.lootbox.phase === "opening" ? "Шанс на минуты, скидку или очки" : "Готово!"}</p>
        ${
          ui.lootbox.phase === "result"
            ? `<button class="button" data-action="claim-lootbox">Забрать</button>`
            : ""
        }
      </div>
    </div>
  `;
};
