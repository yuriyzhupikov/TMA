import type { RewardKind } from "./config.types";

export type Reward = {
  id: string;
  kind: RewardKind;
  value: number;
  label: string;
  source: string;
  at: number;
};

export type Chest = {
  id: string;
  source: string;
  createdAt: number;
};

export type Balance = {
  points: number;
  minutes: number;
  level: number;
  xp: number;
  xpNext: number;
};

export type DemoState = {
  balance: Balance;
  checkInDate: string | null;
  spinDate: string | null;
  chests: Chest[];
  history: Reward[];
  myCode: string;
  refAccepted: boolean;
};

export type Screen = "home" | "leaderboard" | "invite" | "profile";

export type LootboxUi = {
  chestId: string;
  phase: "opening" | "result";
  reward: Reward;
};

export type Toast = {
  id: string;
  text: string;
};

export type UiState = {
  screen: Screen;
  toasts: Toast[];
  rulesOpen: boolean;
  isSpinning: boolean;
  lootbox: LootboxUi | null;
  confetti: boolean;
};
