import type { GameConfig } from "../config.types";
import { defaultCheckIn } from "../games/checkin/defaults";
import { defaultInvite } from "../games/invite/defaults";
import { defaultLeaderboard } from "../games/leaderboard/defaults";
import { defaultLootbox } from "../games/lootbox/defaults";
import { defaultProfile } from "../games/profile/defaults";
import { defaultSpin } from "../games/spin/defaults";

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
  },
  checkin: defaultCheckIn,
  spin: defaultSpin,
  lootbox: defaultLootbox,
  leaderboard: defaultLeaderboard,
  invite: defaultInvite,
  profile: defaultProfile,
};
