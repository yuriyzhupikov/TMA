import type { CheckInConfig } from "../../config.types";

export const defaultCheckIn: CheckInConfig = {
  reward: { kind: "points", value: 25, label: "+25 очков" },
  chestSource: "daily",
};
