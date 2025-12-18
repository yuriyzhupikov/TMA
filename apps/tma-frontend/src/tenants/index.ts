import type { TenantConfig } from "../config.types";
import tmaDemo from "./tma-demo.json";
import arenaVibe from "./arena-vibe.json";

export const tenants: TenantConfig[] = [tmaDemo, arenaVibe];

export const getTenantById = (id: string) =>
  tenants.find((tenant) => tenant.id === id) ?? tenants[0];
