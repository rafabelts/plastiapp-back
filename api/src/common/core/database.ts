import { Pool } from "pg";
import { env } from "@/common/utils/envConfig";
import { logger } from "@/server";

const db = new Pool({
  host: env.DB_HOST,
  port: env.DB_PORT,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  ssl: env.isProduction ? { rejectUnauthorized: false } : undefined,
});

export async function validateDBConnection() {
  const client = await db.connect();

  try {
    // simple health check query
    const result = await client.query("SELECT NOW() as now");

    logger.info(
      { now: result.rows[0].now },
      "Successful connection to PostgreSQL"
    );
  } catch (error) {
    logger.error(
      { err: error },
      "Error while trying to connect to PostgreSQL"
    );
  } finally {
    client.release();
  }
}


export default db;

