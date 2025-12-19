import {
  ProjectConfigTable,
  ProjectTable,
} from '../../postgres/database.types';
import { RuntimeConfig } from '../game/types';
import type { Selectable } from 'kysely';

export interface RuntimeProjectModel {
  id: string;
  companyId: string;
  slug: string;
  name: string;
  gameType: string;
  status: ProjectTable['status'];
}

export interface RuntimeProjectWithConfig extends RuntimeProjectModel {
  config: RuntimeConfig;
  configVersion: number;
}

export function mapProjectWithConfig(
  project: Pick<
    Selectable<ProjectTable>,
    'id' | 'company_id' | 'slug' | 'name' | 'game_type' | 'status'
  >,
  config: Pick<Selectable<ProjectConfigTable>, 'config_json' | 'version'>,
): RuntimeProjectWithConfig {
  const runtimeConfig = (config.config_json ?? {}) as unknown as RuntimeConfig;

  return {
    id: project.id,
    companyId: project.company_id,
    slug: project.slug,
    name: project.name,
    gameType: project.game_type,
    status: project.status,
    config: runtimeConfig,
    configVersion: config.version,
  };
}
