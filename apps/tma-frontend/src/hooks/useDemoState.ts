import type { DemoState, Reward, Chest } from "../types";
import type { GameConfig, RewardPreset } from "../config.types";
import { STORAGE_KEY } from "../data/constants";
import { todayKey, uid } from "../utils";

export type Effects = {
  toast: (text: string) => void;
  confetti: () => void;
  haptic: () => void;
};

const defaultState = (tenantId = ""): DemoState => ({
  balance: {
    points: 120,
    minutes: 45,
    level: 3,
    xp: 40,
    xpNext: 90,
  },
  tenantId,
  checkInDate: null,
  dailyQuestDate: null,
  dailyQuestStreak: 0,
  dailyQuestVariant: null,
  dailyQuestVariantDate: null,
  dailyQuestVariantTenant: null,
  spinDate: null,
  quizDate: null,
  receiptDate: null,
  collectionItems: [],
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

export let state = loadState();

export const ensureTenantState = (tenantId: string) => {
  if (state.tenantId === tenantId) {
    return;
  }
  state = defaultState(tenantId);
  saveState(state);
};

export const sanitizeDailyFlags = () => {
  const today = todayKey();
  if (state.spinDate && state.spinDate !== today) {
    state.spinDate = null;
  }
  if (state.dailyQuestDate && state.dailyQuestDate !== today) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayKey = yesterday.toISOString().slice(0, 10);
    if (state.dailyQuestDate !== yesterdayKey) {
      state.dailyQuestStreak = 0;
    }
    state.dailyQuestDate = null;
  }
  if (state.quizDate && state.quizDate !== today) {
    state.quizDate = null;
  }
  if (state.receiptDate && state.receiptDate !== today) {
    state.receiptDate = null;
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

export const applyDailyQuest = (effects: Effects, config: GameConfig) => {
  const today = todayKey();
  if (state.dailyQuestDate === today) {
    effects.toast("Квест дня уже выполнен");
    return;
  }
  state.dailyQuestDate = today;
  state.dailyQuestStreak += 1;
  const reward = createReward(config.dailyQuest.reward, config.dailyQuest.title);
  grantReward(reward);
  state.chests.unshift(createChest(config.dailyQuest.chestSource));

  if (config.dailyQuest.streakMilestones.includes(state.dailyQuestStreak)) {
    const streakReward = createReward(config.dailyQuest.streakReward, "Серия квестов");
    grantReward(streakReward);
    effects.toast(`Бонус за серию: ${streakReward.label}`);
  }
  saveState(state);
  effects.haptic();
  effects.toast("Квест выполнен! Сундук добавлен.");
};

export const ensureDailyQuestVariant = (config: GameConfig, tenantId: string) => {
  const today = todayKey();
  const variants = config.dailyQuest.variants;
  if (!variants || variants.length === 0) {
    return config.dailyQuest.description;
  }
  if (
    state.dailyQuestVariant &&
    state.dailyQuestVariantDate === today &&
    state.dailyQuestVariantTenant === tenantId
  ) {
    return state.dailyQuestVariant;
  }
  const picked = variants[Math.floor(Math.random() * variants.length)];
  state.dailyQuestVariant = picked;
  state.dailyQuestVariantDate = today;
  state.dailyQuestVariantTenant = tenantId;
  saveState(state);
  return picked;
};

export const collectItem = (config: GameConfig, effects: Effects) => {
  const remaining = config.collection.items.filter((item) => !state.collectionItems.includes(item));
  if (remaining.length === 0) {
    effects.toast("Все карточки уже собраны");
    return;
  }
  const picked = remaining[Math.floor(Math.random() * remaining.length)];
  state.collectionItems.push(picked);
  grantReward(createReward({ kind: "points", value: 20, label: "+20 бонусов" }, "Коллекция"));

  config.collection.sets.forEach((set) => {
    const complete = set.items.every((item) => state.collectionItems.includes(item));
    if (complete) {
      grantReward(createReward(set.reward, `Набор: ${set.name}`));
      state.chests.unshift(createChest(config.collection.chestSource));
      effects.toast(`Собран набор: ${set.name}`);
    }
  });
  saveState(state);
  effects.haptic();
  effects.toast(`Добавлено: ${picked}`);
};

export const applyQuiz = (effects: Effects, config: GameConfig) => {
  const today = todayKey();
  if (state.quizDate === today) {
    effects.toast("Квиз уже пройден сегодня");
    return;
  }
  state.quizDate = today;
  const success = Math.random() > 0.25;
  const reward = createReward(
    success ? config.quiz.rewardPass : config.quiz.rewardFail,
    success ? "Викторина" : "Попытка викторины",
  );
  grantReward(reward);
  if (success) {
    state.chests.unshift(createChest("quiz"));
  }
  saveState(state);
  effects.haptic();
  effects.toast(success ? "Квиз пройден!" : "Попробуйте завтра");
};

export const applyReceipt = (effects: Effects, config: GameConfig) => {
  const today = todayKey();
  if (state.receiptDate === today) {
    effects.toast("Сегодня уже проверяли чек");
    return;
  }
  state.receiptDate = today;
  const win = Math.random() < config.receipt.winChance;
  if (win) {
    const reward = createReward(config.receipt.reward, "Счастливый чек");
    grantReward(reward);
    state.chests.unshift(createChest(config.receipt.chestSource));
    effects.toast("Чек счастливый! Приз добавлен");
  } else {
    effects.toast("Сегодня без выигрыша");
  }
  saveState(state);
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
