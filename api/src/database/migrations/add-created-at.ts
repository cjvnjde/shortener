import { PoolClient } from "pg";
import { Migration } from "../../interfaces/Migration";

export class AddCreatedAt implements Migration {
  name = "add-created-at";

  async up(client: PoolClient) {
    const query = `
        ALTER TABLE urls
            ADD COLUMN createdAt TIMESTAMP DEFAULT NOW();
        UPDATE urls
        SET createdAt = current_timestamp
    `;

    await client.query(query);
  }

  async down(client: PoolClient) {
    const query = `
        ALTER TABLE urls
            DROP COLUMN createdAt
    `;

    await client.query(query);
  }
}
