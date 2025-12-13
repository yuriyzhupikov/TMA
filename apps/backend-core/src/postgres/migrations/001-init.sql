BEGIN;
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE IF NOT EXISTS company (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS "user" (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS user_company (
  user_id uuid NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  company_id uuid NOT NULL REFERENCES company(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('owner','member')),
  PRIMARY KEY (user_id, company_id)
);
CREATE TABLE IF NOT EXISTS project (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES company(id) ON DELETE CASCADE,
  slug text NOT NULL,
  name text NOT NULL,
  game_type text NOT NULL,
  status text NOT NULL CHECK (status IN ('draft','active','paused')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (company_id, slug)
);
CREATE TABLE IF NOT EXISTS project_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES project(id) ON DELETE CASCADE,
  version int NOT NULL,
  status text NOT NULL CHECK (status IN ('draft','published','archived')),
  config_json jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (project_id, version)
);
CREATE TABLE IF NOT EXISTS player (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES project(id) ON DELETE CASCADE,
  telegram_id text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (project_id, telegram_id)
);
CREATE TABLE IF NOT EXISTS player_progress (
  player_id uuid PRIMARY KEY REFERENCES player(id) ON DELETE CASCADE,
  balance bigint NOT NULL DEFAULT 0,
  level int NOT NULL DEFAULT 1,
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS event_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ts timestamptz NOT NULL DEFAULT now(),
  company_id uuid NULL REFERENCES company(id) ON DELETE SET NULL,
  project_id uuid NULL REFERENCES project(id) ON DELETE SET NULL,
  player_id uuid NULL REFERENCES player(id) ON DELETE SET NULL,
  type text NOT NULL,
  payload_json jsonb NOT NULL DEFAULT '{}'::jsonb,
  delta_json jsonb NOT NULL DEFAULT '{}'::jsonb
);
COMMIT;
