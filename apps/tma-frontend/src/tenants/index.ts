import type { TenantConfig } from "../config.types";
import gameOne from "./game-one.json";
import arenaVibe from "./arena-vibe.json";
import kleshya from "./kleshya.json";

export const tenants: TenantConfig[] = [gameOne, arenaVibe, kleshya];

export const getTenantById = (id: string) =>
  tenants.find((tenant) => tenant.id === id) ?? tenants[0];
