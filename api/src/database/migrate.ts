import { Pool, PoolClient } from "pg";
import { environment } from "../environments/environment";
import { Environment } from "../interfaces/Environment";
import { AddUrlTable } from "./migrations/add-url-table";
import { AddCreatedAt } from "./migrations/add-created-at";

class Migrate {
  private readonly environment: Environment;
  public readonly pool: Pool;

  migrations = [
    new AddUrlTable(),
    new AddCreatedAt(),
  ];

  constructor(environment: Environment) {
    this.environment = environment;
    this.pool = new Pool(this.environment.database);
  }

  async up() {
    return this.execute(async (client) => {
      await this.addUuidExtension(client);
      const exitMigrations = await this.checkMigrationTable(client);
      const existMigrationNames = exitMigrations.map(({ name }) => name);

      for await (const migration of this.migrations) {
        if (!existMigrationNames.includes(migration.name)) {
          await migration.up(client);
          const query = `
              INSERT INTO migrations (name)
              VALUES ('${migration.name}')
          `;
          await client.query(query);
        }
      }
    });
  }

  async down() {
    return this.execute(async (client) => {
      await this.addUuidExtension(client);
      const exitMigrations = await this.checkMigrationTable(client);
      const existMigrationNames = exitMigrations.map(({ name }) => name);

      for await (const migration of this.migrations.reverse()) {
        if (existMigrationNames.includes(migration.name)) {
          await migration.down(client);
          const query = `
              DELETE
              FROM migrations
              WHERE name = '${migration.name}'
          `;
          await client.query(query);
        }
      }
    });
  }

  async addUuidExtension(client: PoolClient) {
    const query = `CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    await client.query(query);
  }

  async checkMigrationTable(client: PoolClient) {
    const queryCheckExists = `
        SELECT EXISTS(
                       SELECT
                       FROM information_schema.tables
                       WHERE table_name = 'migrations'
                         AND table_schema LIKE 'public'
                   );
    `;

    const result = await client.query(queryCheckExists);
    const exists = result.rows[0].exists;

    if (exists) {
      const migrationsSql = `
          SELECT name
          FROM migrations
      `;
      const data = await client.query(migrationsSql);
      return data.rows;
    } else {
      const createMigrationsTable = `
          CREATE TABLE migrations
          (
              uuid uuid DEFAULT uuid_generate_v4(),
              name VARCHAR NOT NULL,
              PRIMARY KEY (uuid)
          );
      `;
      await client.query(createMigrationsTable);
      return [];
    }
  }

  private async execute<T>(command: (client: PoolClient) => Promise<T>): Promise<T> {
    const client = await this.pool.connect();

    let data = null;

    try {
      await client.query("BEGIN");
      console.log("BEGIN");

      data = await command(client);

      await client.query("COMMIT");
      console.log("COMMIT");
    } catch (e) {
      await client.query("ROLLBACK");
      console.log("ROLLBACK");
      throw e;
    } finally {
      client.release();
      console.log("release");
    }

    return data;
  }
}

const migrate = new Migrate(environment);

if (process.env.ROLLBACK === "true") {
  migrate.down();
} else {
  migrate.up();
}
