import db from "@/common/core/database";
import type { Pool } from "pg";
import { CreatePlastic } from "./plastic.model";
import { a } from "vitest/dist/chunks/suite.d.FvehnV49";

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
ORDER BY name ASC
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

  async update(id: number, payload: Partial<CreatePlastic>) {
    const updates: Array<string> = [];
    const values: Array<unknown> = [];
    let paramIndex = 1;

    if (payload.name !== undefined) {
      updates.push(`name = $${paramIndex++}`);
      values.push(payload.name)
    }

    if (payload.description !== undefined) {
      updates.push(`description = $${paramIndex++}`);
      values.push(payload.description)
    }

    if (payload.price !== undefined) {
      updates.push(`price = $${paramIndex++}`);
      values.push(payload.price);
    }

    if (updates.length === 0) {
      return null;
    }

    updates.push(`updated_at = (NOW() AT TIME ZONE 'America/Mexico_City')`);
    values.push(id);

    const { rows } = await this.postgresDb.query(
      `
UPDATE plastic
SET ${updates.join(', ')}
WHERE plastic_id = $${paramIndex}
  AND deleted_at IS NULL
RETURNING plastic_id
`, values
    );

    return await this.getById(rows[0].product_id);
  }

  async softDelete(id: number) {
    const { rows } = await this.postgresDb.query(
      `
UPDATE plastic
SET
  deleted_at = (NOW() AT TIME ZONE 'America/Mexico_City'),
  updated_at = (NOW() AT TIME ZONE 'America/Mexico_City')
WHERE plastic_id = $1
  AND deleted_at IS NULL
RETURNING plastic_id AS id, deleted_at AS "deletedAt"
`, [id]
    );

    return rows[0] ?? null;
  }
}
