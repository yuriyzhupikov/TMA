import type { UiState } from "../types";
import { uid } from "../utils";

export const ui: UiState = {
  screen: "home",
  toasts: [],
  rulesOpen: false,
  isSpinning: false,
  lootbox: null,
  confetti: false,
};

export const pushToast = (text: string, render: () => void) => {
  const toast = { id: uid(), text };
  ui.toasts.push(toast);
  render();
  window.setTimeout(() => {
    ui.toasts = ui.toasts.filter((item) => item.id !== toast.id);
    render();
  }, 2200);
};

export const triggerConfetti = (render: () => void) => {
  ui.confetti = true;
  render();
  window.setTimeout(() => {
    ui.confetti = false;
    render();
  }, 900);
};
