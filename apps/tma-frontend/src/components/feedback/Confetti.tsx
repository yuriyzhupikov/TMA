import type { UiState } from "../../types";

export const renderConfetti = (ui: UiState) => {
  if (!ui.confetti) {
    return "";
  }
  const pieces = Array.from({ length: 18 }, (_, index) => {
    const hue = 24 + index * 16;
    const x = (index * 19) % 100;
    const delay = index * 40;
    return `<span style="--hue:${hue};--x:${x};--delay:${delay}"></span>`;
  }).join("");
  return `<div class="confetti">${pieces}</div>`;
};
