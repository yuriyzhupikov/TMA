import type { GameConfig, TenantConfig } from "../config.types";
import { defaultConfig } from "./defaultConfig";

const mergeArray = <T>(base: T[], override?: T[]) => (override && override.length ? override : base);

export const resolveConfig = (tenant: TenantConfig): GameConfig => {
  const overrides = tenant.overrides;

  return {
    ...defaultConfig,
    ...overrides,
    theme: {
      ...defaultConfig.theme,
      ...overrides.theme,
    },
    checkin: {
      ...defaultConfig.checkin,
      ...overrides.checkin,
      reward: overrides.checkin?.reward ?? defaultConfig.checkin.reward,
    },
    dailyQuest: {
      ...defaultConfig.dailyQuest,
      ...overrides.dailyQuest,
      reward: overrides.dailyQuest?.reward ?? defaultConfig.dailyQuest.reward,
    },
    spin: {
      ...defaultConfig.spin,
      ...overrides.spin,
      rewards: mergeArray(defaultConfig.spin.rewards, overrides.spin?.rewards),
    },
    lootbox: {
      ...defaultConfig.lootbox,
      ...overrides.lootbox,
      rewards: mergeArray(defaultConfig.lootbox.rewards, overrides.lootbox?.rewards),
    },
    leaderboard: {
      ...defaultConfig.leaderboard,
      ...overrides.leaderboard,
      rules: mergeArray(defaultConfig.leaderboard.rules, overrides.leaderboard?.rules),
      entries: mergeArray(defaultConfig.leaderboard.entries, overrides.leaderboard?.entries),
    },
    invite: {
      ...defaultConfig.invite,
      ...overrides.invite,
    },
    profile: {
      ...defaultConfig.profile,
      ...overrides.profile,
    },
    collection: {
      ...defaultConfig.collection,
      ...overrides.collection,
      items: mergeArray(defaultConfig.collection.items, overrides.collection?.items),
      sets: mergeArray(defaultConfig.collection.sets, overrides.collection?.sets),
    },
    quiz: {
      ...defaultConfig.quiz,
      ...overrides.quiz,
    },
    receipt: {
      ...defaultConfig.receipt,
      ...overrides.receipt,
    },
    pass: {
      ...defaultConfig.pass,
      ...overrides.pass,
    },
    features: {
      ...defaultConfig.features,
      ...overrides.features,
    },
  };
};
