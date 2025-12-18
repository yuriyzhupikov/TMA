import type { LootboxConfig } from "../../config.types";

export const defaultLootbox: LootboxConfig = {
  rewards: [
    { kind: "minutes", value: 30, label: "+30 минут" },
    { kind: "discount", value: 10, label: "Скидка 10%" },
    { kind: "points", value: 50, label: "+50 очков" },
  ],
};
