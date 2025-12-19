declare module 'pg' {
  export interface PoolConfig {
    host?: string;
    port?: number;
    user?: string;
    password?: string;
    database?: string;
    max?: number;
  }

  export interface QueryResult<R = unknown> {
    command: 'UPDATE' | 'DELETE' | 'INSERT' | 'SELECT' | 'MERGE';
    rowCount: number;
    rows: R[];
  }

  export interface Cursor<R = unknown> {
    read(rowsCount: number): Promise<R[]>;
    close(): Promise<void>;
  }

  export interface PoolClient {
    query<R = unknown>(cursor: Cursor<R>): Cursor<R>;
    query<R = unknown>(
      sql: string,
      params: ReadonlyArray<unknown>,
    ): Promise<QueryResult<R>>;
    release(): void;
  }

  export class Pool {
    constructor(config?: PoolConfig);
    connect(): Promise<PoolClient>;
    end(): Promise<void>;
  }
}
