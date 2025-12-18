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
  };
};
