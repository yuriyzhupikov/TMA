import type { DemoState, Reward, Chest } from "../types";
import type { GameConfig, RewardPreset } from "../config.types";
import { STORAGE_KEY } from "../data/constants";
import { todayKey, uid } from "../utils";

export type Effects = {
  toast: (text: string) => void;
  confetti: () => void;
  haptic: () => void;
};

const defaultState = (): DemoState => ({
  balance: {
    points: 120,
    minutes: 45,
    level: 3,
    xp: 40,
    xpNext: 90,
  },
  checkInDate: null,
  spinDate: null,
  chests: [],
  history: [],
  myCode: uid(),
  refAccepted: false,
});

const loadState = (): DemoState => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return defaultState();
    }
    const parsed = JSON.parse(raw) as DemoState;
    return {
      ...defaultState(),
      ...parsed,
      balance: { ...defaultState().balance, ...parsed.balance },
      chests: parsed.chests ?? [],
      history: parsed.history ?? [],
    };
  } catch {
    return defaultState();
  }
};

export const saveState = (state: DemoState) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

export const state = loadState();

export const sanitizeDailyFlags = () => {
  const today = todayKey();
  if (state.spinDate && state.spinDate !== today) {
    state.spinDate = null;
  }
};

export const createChest = (source: string): Chest => ({
  id: uid(),
  source,
  createdAt: Date.now(),
});

const levelUp = () => {
  while (state.balance.xp >= state.balance.xpNext) {
    state.balance.xp -= state.balance.xpNext;
    state.balance.level += 1;
    state.balance.xpNext = Math.round(state.balance.xpNext * 1.2 + 10);
  }
};

export const grantReward = (reward: Reward) => {
  if (reward.kind === "points") {
    state.balance.points += reward.value;
    state.balance.xp += reward.value;
  }
  if (reward.kind === "minutes") {
    state.balance.minutes += reward.value;
  }
  levelUp();
  state.history.unshift(reward);
  state.history = state.history.slice(0, 50);
};

export const createReward = (base: Omit<Reward, "id" | "source" | "at">, source: string): Reward => ({
  ...base,
  id: uid(),
  source,
  at: Date.now(),
});

export const randomLootReward = (rewards: RewardPreset[], source: string) =>
  createReward(rewards[Math.floor(Math.random() * rewards.length)], source);

export const applyCheckIn = (effects: Effects, config: GameConfig) => {
  const today = todayKey();
  if (state.checkInDate === today) {
    effects.toast("Уже отмечались");
    return;
  }
  state.checkInDate = today;
  const reward = createReward(config.checkin.reward, "Чек-ин");
  grantReward(reward);
  state.chests.unshift(createChest(config.checkin.chestSource));
  saveState(state);
  effects.haptic();
  effects.confetti();
  effects.toast("Чек-ин принят! Сундук добавлен.");
};

export const applySpin = (effects: Effects, config: GameConfig) => {
  const reward = randomLootReward(config.spin.rewards, "Lucky Spin");
  grantReward(reward);
  state.spinDate = todayKey();
  saveState(state);
  effects.haptic();
  effects.toast(`Выпало: ${reward.label}`);
};

export const claimLootbox = (chestId: string, reward: Reward, effects: Effects) => {
  grantReward(reward);
  state.chests = state.chests.filter((chest) => chest.id !== chestId);
  saveState(state);
  effects.haptic();
  effects.toast("Награда забрана!");
};

export const initReferral = (effects: Effects) => {
  const params = new URLSearchParams(window.location.search);
  const startapp = params.get("startapp") || params.get("ref");
  if (startapp && startapp.startsWith("ref_") && !state.refAccepted) {
    state.refAccepted = true;
    state.chests.unshift(createChest("referral"));
    saveState(state);
    effects.toast("Получен сундук за приглашение");
  }
};
