import "./styles.css";
import "./telegram/types";
import { STORAGE_KEY } from "./data";
import { renderBottomNav, getScreenFromButton } from "./components/layout";
import { renderConfetti, renderToasts } from "./components/feedback";
import { renderLootboxModal } from "./components/common";
import {
  applyCheckIn,
  applyDailyQuest,
  applySpin,
  claimLootbox,
  initReferral,
  pushToast,
  ensureDailyQuestVariant,
  randomLootReward,
  sanitizeDailyFlags,
  state,
  triggerConfetti,
  ui,
} from "./hooks";
import { renderDailyQuest, renderHome, renderLeaderboard, renderInvite, renderProfile } from "./screens";
import { triggerHaptic, shareLink } from "./telegram";
import { todayKey } from "./utils";
import { initTenant, resolveConfig } from "./runtime";
import { getTenantById, tenants } from "./tenants";

const app = document.getElementById("app");
if (!app) {
  throw new Error("App container not found");
}

let tenant = initTenant();
let config = resolveConfig(tenant);
let activeTenantId = tenant.id;

const notify = (text: string) => pushToast(text, render);
const confetti = () => triggerConfetti(render);
const effects = {
  toast: notify,
  confetti,
  haptic: triggerHaptic,
};

const applyTheme = () => {
  const root = document.documentElement;
  root.style.setProperty("--accent", config.theme.accent);
  root.style.setProperty("--accent-2", config.theme.accent2);
  root.style.setProperty("--bg-1", config.theme.bg1);
  root.style.setProperty("--bg-2", config.theme.bg2);
  root.style.setProperty("--card", config.theme.card);
  root.style.setProperty("--stroke", config.theme.stroke);
  root.style.setProperty("--shadow", config.theme.shadow);
  root.style.setProperty("--ink", config.theme.ink);
  root.style.setProperty("--muted", config.theme.muted);
  root.style.setProperty("--glow-1", config.theme.glow1);
  root.style.setProperty("--glow-2", config.theme.glow2);
};

const openLootbox = () => {
  if (ui.lootbox || state.chests.length === 0) {
    return;
  }
  const chest = state.chests[0];
  ui.lootbox = {
    chestId: chest.id,
    phase: "opening",
    reward: randomLootReward(config.lootbox.rewards, "Сундук"),
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
  const link = `https://t.me/${config.botName}?startapp=ref_${state.myCode}`;
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
  const questVariant = ensureDailyQuestVariant(config, tenant.id);
  const screenContent =
    ui.screen === "home"
      ? renderHome(state, ui, config, questVariant)
      : ui.screen === "daily-quest"
        ? renderDailyQuest(state, config, questVariant)
        : ui.screen === "leaderboard"
          ? renderLeaderboard(state, ui, config)
          : ui.screen === "invite"
            ? renderInvite(state, config)
            : renderProfile(state, config, tenants, activeTenantId);

  app.innerHTML = `
    <div class="app-shell">
      <header class="topbar">
        <div>
          <div class="brand">${config.theme.brand}</div>
          <div class="badge">${config.theme.badge}</div>
        </div>
        <div class="badge">${tenant.label}</div>
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
      applyCheckIn(effects, config);
      break;
    case "daily-quest":
      applyDailyQuest(effects, config);
      break;
    case "open-quest":
      ui.screen = "daily-quest";
      render();
      break;
    case "go-home":
      ui.screen = "home";
      render();
      break;
    case "spin":
      if (!config.spin.enabled) {
        notify("Спин недоступен");
        return;
      }
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
        applySpin(effects, config);
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
    case "set-tenant": {
      const nextTenant = button.getAttribute("data-tenant");
      if (!nextTenant || nextTenant === activeTenantId) {
        return;
      }
      activeTenantId = nextTenant;
      tenant = getTenantById(nextTenant);
      config = resolveConfig(tenant);
      const params = new URLSearchParams(window.location.search);
      params.set("startapp", nextTenant);
      window.history.replaceState({}, "", `?${params.toString()}`);
      localStorage.setItem("tma_tenant_id", nextTenant);
      applyTheme();
      render();
      break;
    }
    default:
      break;
  }
});

initReferral(effects);
applyTheme();
render();
