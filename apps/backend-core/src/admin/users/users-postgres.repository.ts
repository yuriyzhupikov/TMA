import { Inject, Injectable } from '@nestjs/common';
import { Kysely, Selectable } from 'kysely';
import { PG_CLIENT } from '../../configuretion/constants';
import {
  DatabaseSchema,
  UserCompanyTable,
  UserTable,
} from '../../postgres/database.types';

type DbClient = Kysely<DatabaseSchema>;

@Injectable()
export class UsersPostgresRepository {
  constructor(@Inject(PG_CLIENT) private readonly db: DbClient) {}

  async findAllUsers(): Promise<Selectable<UserTable>[]> {
    return this.db.selectFrom('user').selectAll().execute();
  }

  async findUserCompanies(): Promise<Selectable<UserCompanyTable>[]> {
    return this.db.selectFrom('user_company').selectAll().execute();
  }

  async findByEmail(email: string): Promise<Selectable<UserTable> | null> {
    const row = await this.db
      .selectFrom('user')
      .selectAll()
      .where('email', '=', email)
      .executeTakeFirst();

    return row ?? null;
  }

  async findById(id: string): Promise<Selectable<UserTable> | null> {
    const row = await this.db
      .selectFrom('user')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst();

    return row ?? null;
  }

  async insertUser(
    email: string,
    passwordHash: string,
  ): Promise<Selectable<UserTable>> {
    return this.db
      .insertInto('user')
      .values({
        email,
        password_hash: passwordHash,
      })
      .returningAll()
      .executeTakeFirstOrThrow();
  }

  async insertUserCompany(
    userId: string,
    companyId: string,
    role: UserCompanyTable['role'],
  ): Promise<void> {
    await this.db
      .insertInto('user_company')
      .values({
        user_id: userId,
        company_id: companyId,
        role,
      })
      .execute();
  }

  async updateUser(
    id: string,
    payload: Partial<Pick<UserTable, 'email' | 'password_hash'>>,
  ): Promise<void> {
    await this.db
      .updateTable('user')
      .set(payload)
      .where('id', '=', id)
      .execute();
  }

  async updateUserRole(
    userId: string,
    role: UserCompanyTable['role'],
  ): Promise<void> {
    await this.db
      .updateTable('user_company')
      .set({ role })
      .where('user_id', '=', userId)
      .execute();
  }

  async findCompaniesByUser(
    userId: string,
  ): Promise<Selectable<UserCompanyTable>[]> {
    return this.db
      .selectFrom('user_company')
      .selectAll()
      .where('user_id', '=', userId)
      .execute();
  }

  async findCompanyById(companyId: string): Promise<{ id: string } | null> {
    const row = await this.db
      .selectFrom('company')
      .select(['id'])
      .where('id', '=', companyId)
      .executeTakeFirst();

    return row ?? null;
  }
}
