import type { ColumnType, Generated } from 'kysely';

type TimestampColumn = ColumnType<
  Date,
  Date | string | undefined,
  Date | string
>;

type JsonbColumn<T = unknown> = ColumnType<
  T,
  string | T | undefined,
  string | T
>;

export interface CompanyTable {
  id: Generated<string>;
  slug: string;
  name: string;
  created_at: TimestampColumn;
}

export interface UserTable {
  id: Generated<string>;
  email: string;
  password_hash: string;
  created_at: TimestampColumn;
}

export interface UserCompanyTable {
  user_id: string;
  company_id: string;
  role: 'owner' | 'member';
}

export interface ProjectTable {
  id: Generated<string>;
  company_id: string;
  slug: string;
  name: string;
  game_type: string;
  status: 'draft' | 'active' | 'paused';
  created_at: TimestampColumn;
  updated_at: TimestampColumn;
}

export interface ProjectConfigTable {
  id: Generated<string>;
  project_id: string;
  version: number;
  status: 'draft' | 'published' | 'archived';
  config_json: JsonbColumn<Record<string, unknown>>;
  created_at: TimestampColumn;
}

export interface PlayerTable {
  id: Generated<string>;
  project_id: string;
  telegram_id: string;
  created_at: TimestampColumn;
}

export interface PlayerProgressTable {
  player_id: string;
  balance: number;
  level: number;
  updated_at: TimestampColumn;
}

export interface EventLogTable {
  id: Generated<string>;
  ts: TimestampColumn;
  company_id: string | null;
  project_id: string | null;
  player_id: string | null;
  type: string;
  payload_json: JsonbColumn<Record<string, unknown>>;
  delta_json: JsonbColumn<Record<string, unknown>>;
}

export interface DatabaseSchema {
  company: CompanyTable;
  user: UserTable;
  user_company: UserCompanyTable;
  project: ProjectTable;
  project_config: ProjectConfigTable;
  player: PlayerTable;
  player_progress: PlayerProgressTable;
  event_log: EventLogTable;
}
