import { PoolClient } from "pg";
import { generateCode } from "../../utils/generateCode";

export class UrlEntity {
  client: PoolClient;

  constructor(client: PoolClient) {
    this.client = client;
  }

  async getUrl(key: string) {
    const query = `
        SELECT url
        FROM urls
        WHERE key = '${key}'
    `;

    const resp = await this.client.query(query);

    const url = resp.rows[0] || {};

    return url.url;
  }

  async generateKey(url: string): Promise<string> {
    const key = generateCode(8);

    const findUrl = `
        SELECT key
        FROM urls
        WHERE url = '${url}'
        ORDER BY createdat DESC
    `;

    const dbUrl = await this.client.query(findUrl);

    if (dbUrl.rows.length > 0) {
      return dbUrl.rows[0].key;
    }

    const query = `
        INSERT INTO urls (url, key)
        VALUES ('${url}', '${key}')
    `;

    await this.client.query(query);

    return key;
  }
}
