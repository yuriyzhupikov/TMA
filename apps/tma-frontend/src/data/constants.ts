import type { Reward } from "../types";

export const STORAGE_KEY = "tma_demo_state_v1";
export const BOT_NAME = "tma_demo_bot";

export const lootRewards: Array<Omit<Reward, "id" | "source" | "at">> = [
  { kind: "minutes", value: 30, label: "+30 минут" },
  { kind: "discount", value: 10, label: "Скидка 10%" },
  { kind: "points", value: 50, label: "+50 очков" },
];

export const leaderboard = [
  { name: "Соня \"Koi\"", points: 980 },
  { name: "Илья \"Pulse\"", points: 930 },
  { name: "Оля \"Nova\"", points: 885 },
  { name: "Миша \"Byte\"", points: 840 },
  { name: "Аня \"Spark\"", points: 820 },
  { name: "Дима \"Orbit\"", points: 790 },
  { name: "Саша \"Hex\"", points: 770 },
  { name: "Рома \"Shift\"", points: 740 },
  { name: "Катя \"Nim\"", points: 710 },
  { name: "Лена \"Ping\"", points: 690 },
];
