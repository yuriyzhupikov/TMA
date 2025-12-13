BEGIN;
INSERT INTO company (slug, name)
VALUES ('default', 'Default Company')
ON CONFLICT (slug) DO NOTHING;
WITH c AS (
  SELECT id FROM company WHERE slug='default'
),
p AS (
  INSERT INTO project (company_id, slug, name, game_type, status)
  SELECT c.id, 'acme-clicker-spring-2025', 'Acme Spring Clicker', 'clicker', 'active'
  FROM c
  ON CONFLICT (company_id, slug) DO UPDATE SET updated_at=now()
  RETURNING id
)
INSERT INTO project_config (project_id, version, status, config_json)
SELECT p.id, 1, 'published',
  '{"type":"clicker","rewardPerClick":5,"dailyClickLimit":5000,"level":{"stepBalance":1000}}'::jsonb
FROM p
ON CONFLICT (project_id, version) DO NOTHING;
COMMIT;
