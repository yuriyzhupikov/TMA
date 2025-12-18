export type RewardKind = "points" | "minutes" | "discount";

export type RewardPreset = {
  kind: RewardKind;
  value: number;
  label: string;
};

export type CheckInConfig = {
  reward: RewardPreset;
  chestSource: string;
};

export type SpinConfig = {
  enabled: boolean;
  rewards: RewardPreset[];
};

export type LootboxConfig = {
  rewards: RewardPreset[];
};

export type LeaderboardEntry = {
  name: string;
  points: number;
};

export type LeaderboardConfig = {
  title: string;
  subtitle: string;
  rules: string[];
  entries: LeaderboardEntry[];
};

export type InviteConfig = {
  description: string;
};

export type ProfileConfig = {
  historyLimit: number;
};

export type ThemeConfig = {
  brand: string;
  badge: string;
  heroTitle: string;
  heroSubtitle: string;
  accent: string;
  accent2: string;
  bg1: string;
  bg2: string;
};

export type GameConfig = {
  checkin: CheckInConfig;
  spin: SpinConfig;
  lootbox: LootboxConfig;
  leaderboard: LeaderboardConfig;
  invite: InviteConfig;
  profile: ProfileConfig;
  theme: ThemeConfig;
  botName: string;
};

export type TenantConfig = {
  id: string;
  label: string;
  overrides: Partial<GameConfig>;
};
