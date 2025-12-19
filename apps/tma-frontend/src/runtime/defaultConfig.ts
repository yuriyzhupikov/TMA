import type { GameConfig } from "../config.types";
import { defaultCheckIn } from "../games/checkin/defaults";
import { defaultCollection } from "../games/collection/defaults";
import { defaultDailyQuest } from "../games/daily-quest/defaults";
import { defaultInvite } from "../games/invite/defaults";
import { defaultLeaderboard } from "../games/leaderboard/defaults";
import { defaultLootbox } from "../games/lootbox/defaults";
import { defaultPass } from "../games/pass/defaults";
import { defaultProfile } from "../games/profile/defaults";
import { defaultQuiz } from "../games/quiz/defaults";
import { defaultSpin } from "../games/spin/defaults";
import { defaultReceipt } from "../games/receipt/defaults";

export const defaultConfig: GameConfig = {
  botName: "tma_demo_bot",
  theme: {
    brand: "TMA",
    badge: "Игровые клубы",
    heroTitle: "Игровые клубы TMA игры",
    heroSubtitle: "Демо-MVP без бэка: чек-ин, спины, сундуки и лидерборд.",
    accent: "#ff7a1a",
    accent2: "#3d7a6b",
    bg1: "#f4f1ea",
    bg2: "#fef7e6",
    card: "rgba(255, 255, 255, 0.78)",
    stroke: "rgba(29, 26, 20, 0.12)",
    shadow: "0 16px 40px rgba(27, 24, 20, 0.14)",
    ink: "#1d1a14",
    muted: "#6f6557",
    glow1: "#ffd19a",
    glow2: "#b9e7d8",
    bgImage: "",
    bgOverlay: "rgba(222, 217, 166, 0.18)",
  },
  checkin: defaultCheckIn,
  dailyQuest: defaultDailyQuest,
  spin: defaultSpin,
  lootbox: defaultLootbox,
  leaderboard: defaultLeaderboard,
  invite: defaultInvite,
  profile: defaultProfile,
  collection: defaultCollection,
  quiz: defaultQuiz,
  receipt: defaultReceipt,
  pass: defaultPass,
  features: {
    collection: false,
    quiz: false,
    receipt: false,
    pass: false,
  },
};
