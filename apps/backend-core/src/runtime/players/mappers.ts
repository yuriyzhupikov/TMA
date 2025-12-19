import {
  PlayerProgressTable,
  PlayerTable,
} from '../../postgres/database.types';
import { PlayerProgressState } from '../game/types';
import type { Selectable } from 'kysely';

export interface RuntimePlayer {
  id: string;
  projectId: string;
  telegramId: string;
}

export function mapPlayer(row: Selectable<PlayerTable>): RuntimePlayer {
  return {
    id: row.id,
    projectId: row.project_id,
    telegramId: row.telegram_id,
  };
}

export function mapProgress(
  row: Selectable<PlayerProgressTable>,
): PlayerProgressState {
  return {
    balance: Number(row.balance),
    level: Number(row.level),
  };
}
