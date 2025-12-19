import type { ReceiptConfig } from "../../config.types";

export const defaultReceipt: ReceiptConfig = {
  winChance: 0.2,
  reward: { kind: "discount", value: 7, label: "-7% по чеку" },
  chestSource: "receipt",
};
