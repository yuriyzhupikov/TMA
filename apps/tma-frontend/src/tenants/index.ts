import type { TenantConfig } from "../config.types";
import gameOne from "./game-one.json";
import arenaVibe from "./arena-vibe.json";

export const tenants: TenantConfig[] = [gameOne, arenaVibe];

export const getTenantById = (id: string) =>
  tenants.find((tenant) => tenant.id === id) ?? tenants[0];
