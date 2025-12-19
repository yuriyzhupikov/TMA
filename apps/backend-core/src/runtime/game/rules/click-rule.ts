import {
  ClickerConfig,
  PlayerProgressState,
  RuntimeEventDelta,
} from '../types';

interface ClickRuleResult {
  progress: PlayerProgressState;
  delta: RuntimeEventDelta;
}

export function applyClickRule(
  progress: PlayerProgressState,
  config: ClickerConfig,
): ClickRuleResult {
  const reward = config.rewardPerClick || 0;
  const newBalance = progress.balance + reward;
  let newLevel = progress.level;

  const stepBalance = config.level?.stepBalance;
  if (stepBalance && stepBalance > 0) {
    while (newBalance >= newLevel * stepBalance) {
      newLevel += 1;
    }
  }

  return {
    progress: {
      balance: newBalance,
      level: newLevel,
    },
    delta: {
      balanceDelta: reward,
      levelDelta: newLevel - progress.level,
    },
  };
}
