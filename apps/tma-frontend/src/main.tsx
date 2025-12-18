import "./styles.css";
import "./telegram/types";
import { BOT_NAME, STORAGE_KEY } from "./data";
import { renderBottomNav, getScreenFromButton } from "./components/layout";
import { renderConfetti, renderToasts } from "./components/feedback";
import { renderLootboxModal } from "./components/common";
import {
  applyCheckIn,
  applySpin,
  claimLootbox,
  initReferral,
  pushToast,
  randomLootReward,
  sanitizeDailyFlags,
  state,
  triggerConfetti,
  ui,
} from "./hooks";
import { renderHome, renderLeaderboard, renderInvite, renderProfile } from "./screens";
import { triggerHaptic, shareLink } from "./telegram";
import { todayKey } from "./utils";

const app = document.getElementById("app");
if (!app) {
  throw new Error("App container not found");
}

const notify = (text: string) => pushToast(text, render);
const confetti = () => triggerConfetti(render);
const effects = {
  toast: notify,
  confetti,
  haptic: triggerHaptic,
};

const openLootbox = () => {
  if (ui.lootbox || state.chests.length === 0) {
    return;
  }
  const chest = state.chests[0];
  ui.lootbox = {
    chestId: chest.id,
    phase: "opening",
    reward: randomLootReward("Сундук"),
  };
  triggerHaptic();
  render();
  window.setTimeout(() => {
    if (!ui.lootbox) {
      return;
    }
    ui.lootbox.phase = "result";
    render();
  }, 900);
};

const shareInvite = () => {
  const link = `https://t.me/${BOT_NAME}?startapp=ref_${state.myCode}`;
  shareLink(link);
  notify("Ссылка готова к отправке");
};

const resetDemo = () => {
  const confirmed = window.confirm("Сбросить демо-данные?");
  if (!confirmed) {
    return;
  }
  localStorage.removeItem(STORAGE_KEY);
  window.location.reload();
};

const render = () => {
  sanitizeDailyFlags();
  const screenContent =
    ui.screen === "home"
      ? renderHome(state, ui)
      : ui.screen === "leaderboard"
        ? renderLeaderboard(state, ui)
        : ui.screen === "invite"
          ? renderInvite(state)
          : renderProfile(state);

  app.innerHTML = `
    <div class="app-shell">
      <header class="topbar">
        <div>
          <div class="brand">TMA</div>
          <div class="badge">Игровые клубы</div>
        </div>
        <div class="badge">MVP демо</div>
      </header>
      ${screenContent}
    </div>
    ${renderBottomNav(ui)}
    ${renderLootboxModal(ui)}
    ${renderToasts(ui)}
    ${renderConfetti(ui)}
  `;
};

app.addEventListener("click", (event) => {
  const target = event.target as HTMLElement;
  const button = target.closest("button") as HTMLButtonElement | null;
  if (!button || button.disabled) {
    return;
  }
  const screen = getScreenFromButton(button);
  if (screen) {
    ui.screen = screen;
    render();
    return;
  }
  const action = button.getAttribute("data-action");
  if (!action) {
    return;
  }
  switch (action) {
    case "checkin":
      applyCheckIn(effects);
      break;
    case "spin":
      if (state.spinDate === todayKey()) {
        notify("Сегодня уже крутили");
        return;
      }
      if (ui.isSpinning) {
        return;
      }
      ui.isSpinning = true;
      render();
      window.setTimeout(() => {
        applySpin(effects);
        ui.isSpinning = false;
        render();
      }, 1200);
      break;
    case "open-lootbox":
      openLootbox();
      break;
    case "claim-lootbox":
      if (!ui.lootbox) {
        return;
      }
      claimLootbox(ui.lootbox.chestId, ui.lootbox.reward, effects);
      ui.lootbox = null;
      render();
      break;
    case "toggle-rules":
      ui.rulesOpen = !ui.rulesOpen;
      render();
      break;
    case "share":
      shareInvite();
      break;
    case "reset-demo":
      resetDemo();
      break;
    default:
      break;
  }
});

initReferral(effects);
render();
