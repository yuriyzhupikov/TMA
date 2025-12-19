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

export type DailyQuestConfig = {
  title: string;
  description: string;
  reward: RewardPreset;
  chestSource: string;
  streakMilestones: number[];
  streakReward: RewardPreset;
  variants: string[];
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

export type CollectionSet = {
  name: string;
  items: string[];
  reward: RewardPreset;
};

export type CollectionConfig = {
  items: string[];
  sets: CollectionSet[];
  chestSource: string;
};

export type QuizConfig = {
  rewardPass: RewardPreset;
  rewardFail: RewardPreset;
  questions: number;
  timerSeconds: number;
};

export type ReceiptConfig = {
  winChance: number;
  reward: RewardPreset;
  chestSource: string;
};

export type PassConfig = {
  ranks: string[];
  xpPerAction: number;
};

export type FeatureToggles = {
  collection: boolean;
  quiz: boolean;
  receipt: boolean;
  pass: boolean;
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
  card: string;
  stroke: string;
  shadow: string;
  ink: string;
  muted: string;
  glow1: string;
  glow2: string;
  bgImage: string;
  bgOverlay: string;
};

export type GameConfig = {
  checkin: CheckInConfig;
  dailyQuest: DailyQuestConfig;
  spin: SpinConfig;
  lootbox: LootboxConfig;
  leaderboard: LeaderboardConfig;
  invite: InviteConfig;
  profile: ProfileConfig;
  collection: CollectionConfig;
  quiz: QuizConfig;
  receipt: ReceiptConfig;
  pass: PassConfig;
  theme: ThemeConfig;
  features: FeatureToggles;
  botName: string;
};

export type TenantConfig = {
  id: string;
  label: string;
  overrides: Partial<GameConfig>;
};
