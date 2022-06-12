import { PoolClient } from "pg";
import { Migration } from "../../interfaces/Migration";

export class AddUrlTable implements Migration {
  name = "add-url-table";

  async up(client: PoolClient) {
    const query = `
        CREATE TABLE urls
        (
            uuid uuid DEFAULT uuid_generate_v4(),
            url  VARCHAR NOT NULL,
            key  VARCHAR NOT NULL,
            PRIMARY KEY (uuid)
        );
    `;
    
    await client.query(query);
  }
  
  async down(client: PoolClient) {
    const query = `
        DROP TABLE urls;
    `;
    
    await client.query(query);
  }
}
