import type { ColumnType, Generated } from 'kysely';

type NumericColumn = ColumnType<string, number | string, number | string>;
type TimestampColumn = ColumnType<
  Date,
  Date | string | undefined,
  Date | string
>;

export interface UsersTable {
  id: Generated<number>;
  balance: ColumnType<string, number | string | undefined, number | string>;
  created_at: TimestampColumn;
  updated_at: TimestampColumn;
}

export interface PaymentHistoryTable {
  id: Generated<number>;
  user_id: number;
  action: 'CREDIT' | 'DEBIT';
  amount: NumericColumn;
  ts: TimestampColumn;
}

export interface DatabaseSchema {
  users: UsersTable;
  payment_history: PaymentHistoryTable;
}
