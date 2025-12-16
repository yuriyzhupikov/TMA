export interface PaginationParams {
  limit: number;
  offset: number;
}

export function buildPagination(
  page: number | undefined,
  pageSize: number | undefined,
): PaginationParams {
  const normalizedPage =
    Number.isFinite(page) && Number(page) > 0 ? Number(page) : 1;
  const normalizedPageSize =
    Number.isFinite(pageSize) && Number(pageSize) > 0 ? Number(pageSize) : 20;

  const limit = Math.min(normalizedPageSize, 100);
  const offset = (normalizedPage - 1) * limit;

  return { limit, offset };
}
