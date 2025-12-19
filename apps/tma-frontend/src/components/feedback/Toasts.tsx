import type { UiState } from "../../types";

export const renderToasts = (ui: UiState) => `
  <div class="toast-stack">
    ${ui.toasts.map((toast) => `<div class="toast">${toast.text}</div>`).join("")}
  </div>
`;
