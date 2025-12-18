import { getTenantById } from "../tenants";

export const initTenantId = () => {
  const params = new URLSearchParams(window.location.search);
  const startapp = params.get("startapp") || params.get("tenant");
  if (startapp && startapp.startsWith("tenant_")) {
    return startapp.replace("tenant_", "");
  }
  if (startapp) {
    return startapp;
  }
  return "tma-demo";
};

export const initTenant = () => {
  const tenantId = initTenantId();
  return getTenantById(tenantId);
};
