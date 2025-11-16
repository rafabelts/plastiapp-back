import db from "@/common/core/database";
import type { Pool } from "pg";
import { CreatePlastic } from "./plastic.model";

export class PlasticRepository {
  private postgresDb: Pool

  constructor(postgresDb: Pool = db) {
    this.postgresDb = postgresDb;
  }

  async getAll() {
    const { rows } = await this.postgresDb.query(
      `
SELECT
  plastic_id AS id,
  name,
  description,
  price,
  created_at AS "createdAt",
  updated_at AS "updatedAt"
FROM plastic
WHERE
  deleted_at IS NULL
`);

    return rows ?? null;
  }

  async getById(id: number) {
    const { rows } = await this.postgresDb.query(
      `
SELECT
  plastic_id AS id,
  name,
  description,
  price,
  created_at AS "createdAt",
  updated_at AS "updatedAt"
FROM plastic
WHERE
  deleted_at IS NULL
  AND plastic_id = $1
`, [id]);

    return rows[0] ?? null;
  }

  async create(payload: CreatePlastic) {
    // plastic_id | name | description | price | created_at | updated_at | deleted_at
    const { rows } = await this.postgresDb.query(
      `
INSERT INTO plastic (
  name,
  description,
  price
) VALUES (
  $1,
  $2,
  $3
)
RETURNING 
  plastic_id, 
  name,
  description, 
  price,
  created_at AS "createdAt",
  updated_at AS "updatedAt"
`, [payload.name, payload.description, payload.price]
    );

    return rows[0] ?? "";
  }




}
