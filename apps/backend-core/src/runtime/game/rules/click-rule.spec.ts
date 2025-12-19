import { applyClickRule } from './click-rule';
import { ClickerConfig } from '../types';

describe('applyClickRule', () => {
  const baseConfig: ClickerConfig = {
    type: 'clicker',
    rewardPerClick: 5,
    level: {
      stepBalance: 10,
    },
  };

  it('increments balance by reward per click', () => {
    const result = applyClickRule({ balance: 0, level: 1 }, baseConfig);

    expect(result.progress.balance).toBe(5);
    expect(result.progress.level).toBe(1);
    expect(result.delta.balanceDelta).toBe(5);
  });

  it('levels up when balance crosses threshold', () => {
    const result = applyClickRule({ balance: 25, level: 2 }, baseConfig);

    expect(result.progress.level).toBe(4);
    expect(result.delta.levelDelta).toBe(2);
  });
});
