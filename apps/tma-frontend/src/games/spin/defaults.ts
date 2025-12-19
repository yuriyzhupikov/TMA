import type { SpinConfig } from "../../config.types";

export const defaultSpin: SpinConfig = {
  enabled: true,
  rewards: [
    { kind: "minutes", value: 30, label: "+30 минут" },
    { kind: "discount", value: 10, label: "Скидка 10%" },
    { kind: "points", value: 50, label: "+50 очков" },
  ],
};
