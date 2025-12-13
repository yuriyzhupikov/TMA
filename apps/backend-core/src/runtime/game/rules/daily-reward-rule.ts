import { PlayerProgressState, RuntimeEventDelta } from '../types';

export interface DailyRewardRuleResult {
  progress: PlayerProgressState;
  delta: RuntimeEventDelta;
}

export function applyDailyRewardRule(
  progress: PlayerProgressState,
  reward: number,
): DailyRewardRuleResult {
  return {
    progress: {
      balance: progress.balance + reward,
      level: progress.level,
    },
    delta: {
      balanceDelta: reward,
      levelDelta: 0,
    },
  };
}
