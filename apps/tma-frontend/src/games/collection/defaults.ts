import type { CollectionConfig } from "../../config.types";

export const defaultCollection: CollectionConfig = {
  items: ["Краб", "Лосось", "Икра", "Мидии", "Креветки", "Осьминог"],
  sets: [
    {
      name: "Праздничный стол",
      items: ["Краб", "Икра", "Лосось"],
      reward: { kind: "discount", value: 10, label: "-10% на набор" },
    },
    {
      name: "Для гриля",
      items: ["Лосось", "Креветки", "Мидии"],
      reward: { kind: "points", value: 70, label: "+70 бонусов" },
    },
    {
      name: "Премиум улов",
      items: ["Осьминог", "Икра", "Краб"],
      reward: { kind: "discount", value: 15, label: "-15% премиум" },
    },
  ],
  chestSource: "collection",
};
