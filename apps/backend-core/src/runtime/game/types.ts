export type RuntimeEventType = 'CLICK';

export interface LevelConfig {
  stepBalance: number;
}

export interface ClickerConfig {
  type: 'clicker';
  rewardPerClick: number;
  dailyClickLimit?: number;
  level?: LevelConfig;
}

export type RuntimeConfig = ClickerConfig;

export interface PlayerProgressState {
  balance: number;
  level: number;
}

export interface RuntimeEventPayload {
  eventType: RuntimeEventType;
  payload?: Record<string, unknown>;
}

export interface RuntimeEventDelta {
  balanceDelta: number;
  levelDelta: number;
}

export interface RuntimeEventResult {
  progress: PlayerProgressState;
  delta: RuntimeEventDelta;
}
