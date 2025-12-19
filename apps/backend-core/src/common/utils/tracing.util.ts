export interface TraceContext {
  requestId?: string;
  userId?: string;
}

export function buildTraceContext(
  requestId?: string,
  userId?: string,
): TraceContext {
  return {
    ...(requestId ? { requestId } : {}),
    ...(userId ? { userId } : {}),
  };
}
