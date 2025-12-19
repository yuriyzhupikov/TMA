import type { LeaderboardConfig } from "../../config.types";

export const defaultLeaderboard: LeaderboardConfig = {
  title: "Лидерборд недели",
  subtitle: "Топ-10 игроков по активности и выполненным заданиям.",
  rules: [
    "Чек-ин каждый день: +25 очков",
    "Lucky Spin: до +50 очков",
    "Приглашения друзей: сундук обоим",
    "Открытие сундуков: бонусы и скидки",
  ],
  entries: [
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
  ],
};
